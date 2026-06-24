/**
 * services/fetch.js
 * ─────────────────────────────────────────────────────────────────
 * Busca de páginas do TSI App e gerenciamento da fila de fetches.
 *
 * POR QUE ISSO É IMPORTANTE:
 * O código de busca estava misturado com a lógica de processamento
 * de dados. Aqui separamos a camada de transporte (buscar a página)
 * da camada de negócio (interpretar o que veio).
 * ─────────────────────────────────────────────────────────────────
 */

import { MAX_CONCURRENT_FETCHES } from '../config.js';
import {
  apontCache, fetchQueue, inQueue, iframesInUse, activeFetches,
  escaladosSnapshot, expanded, _snapCarregado, _snapPendentes,
  setActiveFetches, setApontCache,
} from '../state.js';
import { snapSet, snapLoadRemote } from '../modules/snapshot.js';
import { renderTable } from '../ui/render.js';
import { updateMetrics } from '../ui/metricas.js';

// ── CACHE PERSISTENTE (sessionStorage) ────────────────────────────
const CACHE_KEY = '_monCache_v2';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function cacheSave() {
  try {
    const payload = {};
    Object.entries(apontCache).forEach(([k, v]) => {
      if (v && v !== 'loading') payload[k] = { d: v, ts: Date.now() };
    });
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

export function cacheLoad() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const payload = JSON.parse(raw);
    const now = Date.now();
    const out = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v && v.d && (now - v.ts) < CACHE_TTL) out[k] = v.d;
    });
    return out;
  } catch (e) { return {}; }
}

// ── FETCH DE PÁGINA (mesma origem) ────────────────────────────────

/**
 * Busca uma URL do TSI App e retorna o Document parseado.
 * Funciona porque o userscript roda no mesmo domínio.
 * @param {string} url
 * @returns {Promise<Document>}
 */
export function fetchDoc(url) {
  return fetch(url, { credentials: 'include' })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(html => new DOMParser().parseFromString(html, 'text/html'));
}

// ── FILA DE FETCH COM DEDUPLICAÇÃO ────────────────────────────────

/**
 * Processa a fila de ops aguardando fetch.
 * Controla concorrência máxima com semáforo simples.
 */
export function processQueue() {
  if (fetchQueue.length === 0) return;
  if (activeFetches >= MAX_CONCURRENT_FETCHES) return;

  const { op, callback } = fetchQueue.shift();
  inQueue.delete(op.id);

  if (!op.id) { setTimeout(processQueue, 10); return; }

  setActiveFetches(activeFetches + 1);
  const fakeId = `_fetch_${op.id}`;
  iframesInUse[fakeId] = { opId: op.id, since: Date.now() };

  const oldCache = (apontCache[op.id] && apontCache[op.id] !== 'loading')
    ? apontCache[op.id]
    : null;

  const release = (dados) => {
    setActiveFetches(activeFetches - 1);
    delete iframesInUse[fakeId];

    if (dados !== null) {
      // Preserva vales do cache anterior se o novo fetch não os trouxer
      if (oldCache) {
        if ((!dados.vales || dados.vales.length === 0) && oldCache.vales?.length > 0) {
          dados.vales = oldCache.vales;
        }
      }

      // Snapshot inicial: salva escalados se listaEnviada e ainda não tem snapshot
      if (dados.listaEnviada && dados.escalados?.length > 0) {
        if (_snapCarregado) {
          if (!escaladosSnapshot[op.id]) snapSet(op.id, dados.escalados);
        } else {
          _snapPendentes.push({ opId: op.id, escalados: dados.escalados });
        }
      }

      setApontCache(op.id, dados);

      // Atualiza detalhe expandido se estiver aberto
      if (expanded.has(op.chave)) {
        const det = document.getElementById(`det-${op.chave}`);
        if (det) {
          if (window._monRenderDetail) {
            det.querySelector('.mon-detail-inner').innerHTML = window._monRenderDetail(op);
          }
        }
      }
    }

    callback(apontCache[op.id], oldCache);
    updateMetrics();
    setTimeout(processQueue, 0);
  };

  const fallback = (escalados) => {
    release({
      solicitado: op.qtd,
      escalado: escalados.length,
      apontado: 0,
      colaboradores: [],
      escalados: escalados || [],
      faltando: escalados || [],
      pdfLinks: [],
      xlsLinks: [],
      vales: oldCache?.vales || [],
    });
  };

  if (!apontCache[op.id]) setApontCache(op.id, 'loading');

  fetchOperacaoCompleta(op, oldCache, release, fallback);
}

/**
 * Adiciona uma op à fila de fetch (com deduplicação).
 * @param {Object}   op       - Operação a buscar
 * @param {function} callback - Chamado com os dados quando pronto
 * @param {boolean}  force    - Força mesmo se já na fila
 */
export function enfileirar(op, callback, force = false) {
  if (!op.id) return;
  if (!force && inQueue.has(op.id)) return;
  inQueue.add(op.id);
  fetchQueue.push({ op, callback });
  processQueue();
}

/**
 * Enfileira com prioridade (vai para o início da fila).
 */
export function enfileirarUrgente(op, callback) {
  if (!op.id) return;
  inQueue.add(op.id);
  fetchQueue.unshift({ op, callback });
  processQueue();
}

// ── FETCH COMPLETO DE UMA OPERAÇÃO ────────────────────────────────

/**
 * Busca os dados de apontamento e escala de uma operação.
 * Faz 2 requisições em sequência: página da op → página de escala → página de apontamentos.
 */
async function fetchOperacaoCompleta(op, oldCache, release, fallback) {
  try {
    const docOp = await fetchDoc(
      `https://tsi-app.com/planejamento-operacional-edit${op.id}_1`
    );

    // Detecta etapas confirmadas (lista enviada)
    let listaEnviada = false, todosConfirmados = false;
    try {
      let etapa = 0, confirmadas = 0;
      docOp.querySelectorAll('table tbody tr').forEach(row => {
        const radios = row.querySelectorAll('input[type="radio"]');
        if (radios.length >= 2) { etapa++; if (radios[0].checked) confirmadas++; }
      });
      listaEnviada     = etapa >= 8  && confirmadas >= 8;
      todosConfirmados = etapa >= 11 && confirmadas >= 11;
    } catch (e) {}

    // Encontra links de escala e apontamento
    let escalaHref, eaptHref;
    const escalaLink = docOp.querySelector('a[href*="pedidoEescala"]');
    const eaptLink   = docOp.querySelector('a[href*="pedidoEapt"]');

    if (escalaLink && eaptLink) {
      escalaHref = escalaLink.getAttribute('href');
      eaptHref   = eaptLink.getAttribute('href');
    } else {
      const eg = docOp.querySelector('a[href*="pedidoEgeral"]');
      if (!eg) { fallback([]); return; }
      escalaHref = eg.getAttribute('href').replace('pedidoEgeral', 'pedidoEescala');
      eaptHref   = eg.getAttribute('href').replace('pedidoEgeral', 'pedidoEapt');
    }

    // Importação inline para evitar dependência circular
    const { parseEscala } = await import('./parsers/escala.js');
    const { parseApontamentos } = await import('./parsers/apontamentos.js');

    const docEscala = await fetchDoc(`https://tsi-app.com/${escalaHref}`);
    const { escalados, vales, pdfLinks, xlsLinks, lideres } = parseEscala(docEscala, op);

    const docApt = await fetchDoc(`https://tsi-app.com/${eaptHref}`);
    const { apontado, colaboradores, faltando } = parseApontamentos(docApt);

    release({
      solicitado: op.qtd,
      escalado: escalados.length,
      apontado,
      colaboradores,
      escalados,
      faltando,
      pdfLinks,
      xlsLinks,
      vales,
      lideres,
      listaEnviada,
      todosConfirmados,
    });
  } catch (e) {
    fallback([]);
  }
}

// Expõe globalmente para beforeunload no index.js
window._monCacheSave = cacheSave;
