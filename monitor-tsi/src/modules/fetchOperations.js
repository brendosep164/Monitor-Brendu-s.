/**
 * modules/fetchOperations.js
 * ─────────────────────────────────────────────────────────────────
 * Busca a lista de operações da página e inicializa os fetches.
 * ─────────────────────────────────────────────────────────────────
 */

import { fetchDoc, cacheLoad, enfileirar, cacheSave } from '../services/fetch.js';
import { parseOpsFromDoc, dentroJanela, opKey } from './operacoes.js';
import {
  operations, apontCache, expanded, monitoradas,
  setOperations, setApontCache, setFetchQueue, setInQueue,
} from '../state.js';
import { renderTable }   from '../ui/render.js';
import { updateMetrics } from '../ui/metricas.js';
import { updateProgress } from '../ui/progress.js';

let monPaginas = 1;
export function setMonPaginas(n) { monPaginas = n; }
export function getMonPaginas()  { return monPaginas; }

export function fetchOperations() {
  _setLiveStatus('sync', 'Sincronizando…');

  const finalizar = (opsAll) => {
    const seen = new Set();
    const ops  = opsAll.filter(o => { if (seen.has(o.chave)) return false; seen.add(o.chave); return true; });

    const savedCache = cacheLoad();
    const prevCache  = apontCache;

    setOperations(ops);
    window._monOps = ops;

    const novoCache = {};
    ops.forEach(o => {
      if (!o.id) return;
      const mem = prevCache[o.id], ses = savedCache[o.id];
      if (mem && mem !== 'loading') novoCache[o.id] = mem;
      else if (ses) novoCache[o.id] = ses;
    });
    Object.keys(novoCache).forEach(id => setApontCache(id, novoCache[id]));

    setFetchQueue([]); setInQueue(new Set());

    const novoMonitoradas = new Set();
    const opsComId = ops.filter(o => o.id);
    opsComId.forEach(o => { if (dentroJanela(o)) novoMonitoradas.add(opKey(o)); });

    renderTable();
    _setLiveStatus('live', 'Ao vivo');

    const sub = document.getElementById('mon-sub');
    if (sub) sub.textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR');

    const total = opsComId.length;
    let loaded  = 0;
    opsComId.forEach(o => { if (apontCache[o.id]) { apontCache[o.id]._stale = true; loaded++; } });
    updateProgress(loaded, total);
    if (loaded > 0) updateMetrics();

    opsComId.forEach(op => {
      const hadCache = !!apontCache[op.id];
      enfileirar(op, (novo) => {
        if (dentroJanela(op)) novoMonitoradas.add(opKey(op));
        if (!hadCache) loaded++;
        updateProgress(loaded, total);
        updateMetrics();
        cacheSave();
        if (loaded >= total) setTimeout(() => window._updateSnapDots?.(), 100);
      }, true);
    });
  };

  const _executarFinalizar = async (opsDoc) => {
    if (monPaginas >= 2) {
      const todasOps = [...opsDoc];
      let pagNum = 2;
      while (true) {
        try {
          const docN = await fetchDoc(`https://tsi-app.com/planejamento-operacional_${pagNum}`);
          const opsPagN = parseOpsFromDoc(docN);
          if (opsPagN.length === 0) break;
          todasOps.push(...opsPagN);
          pagNum++;
        } catch(e) { break; }
      }
      finalizar(todasOps);
    } else {
      finalizar(opsDoc);
    }
  };

  let _fetchDone = false;
  const _tryParse = () => {
    if (_fetchDone) return;
    const opsDoc = parseOpsFromDoc(document);
    if (opsDoc.length > 0) {
      _fetchDone = true;
      if (_tbodyObserver) { _tbodyObserver.disconnect(); _tbodyObserver = null; }
      _executarFinalizar(opsDoc);
    }
  };

  let _tbodyObserver = new MutationObserver(() => _tryParse());
  _tbodyObserver.observe(document.body, { childList: true, subtree: true });

  let _pollTentativas = 0;
  const _poll = () => {
    if (_fetchDone) return;
    _tryParse();
    _pollTentativas++;
    if (_pollTentativas < 60) setTimeout(_poll, 1000);
    else {
      if (_tbodyObserver) { _tbodyObserver.disconnect(); _tbodyObserver = null; }
      if (!_fetchDone) finalizar([]);
    }
  };
  setTimeout(_poll, 500);
}

export function manualRefresh() {
  import('../services/jsonbin.js').then(({ carregarContatos }) => carregarContatos());
  setFetchQueue([]); setInQueue(new Set());
  Object.keys(apontCache).forEach(k => { if (apontCache[k] && apontCache[k] !== 'loading') apontCache[k]._stale = true; });
  try { sessionStorage.removeItem('_monCache_v2'); } catch(e) {}
  fetchOperations();
  import('./timer.js').then(({ scheduleAlignedRefresh }) => scheduleAlignedRefresh());
  import('./obs.js').then(({ obsLoad }) => obsLoad(() => renderTable()));
  import('./snapshot.js').then(({ snapLoadRemote, _updateSnapDots }) =>
    snapLoadRemote(() => setTimeout(_updateSnapDots, 500))
  );
}

export function watchPageNavigation() {
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (!currentUrl.includes('planejamento-operacional')) return;
      setTimeout(() => { setFetchQueue([]); setInQueue(new Set()); fetchOperations(); }, 5000);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const origPush    = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);
  const handle = () => setTimeout(() => {
    const url = window.location.href;
    if (url !== lastUrl && url.includes('planejamento-operacional')) {
      lastUrl = url;
      setTimeout(() => { setFetchQueue([]); setInQueue(new Set()); fetchOperations(); }, 3000);
    }
  }, 100);
  history.pushState    = function(...args) { origPush(...args);    handle(); };
  history.replaceState = function(...args) { origReplace(...args); handle(); };
}

function _setLiveStatus(type, msg) {
  const el = document.getElementById('mon-live');
  if (!el) return;
  el.dataset.state = type;
  const span = el.querySelector('span:last-child');
  if (span) span.textContent = msg;
}

window._monRefresh    = manualRefresh;
window._monSetPaginas = function(n, btnEl) {
  setMonPaginas(n);
  document.querySelectorAll('.mon-pag-btn').forEach(b => b.classList.remove('active'));
  btnEl?.classList.add('active');
  manualRefresh();
};
