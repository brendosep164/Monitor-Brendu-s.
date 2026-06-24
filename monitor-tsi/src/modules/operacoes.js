/**
 * modules/operacoes.js
 * ─────────────────────────────────────────────────────────────────
 * Parse e lógica de negócio das operações.
 *
 * Responsabilidades:
 * - Parsear o DOM da página de planejamento-operacional
 * - Determinar se uma op está "dentro da janela" de monitoramento
 * - Lógica de conclusão
 * ─────────────────────────────────────────────────────────────────
 */

import { monitoradas, apontCache } from '../state.js';

// ── JANELA DE MONITORAMENTO ───────────────────────────────────────

/**
 * Retorna true se a operação está dentro da janela de monitoramento.
 * Ops passadas são sempre incluídas; futuras apenas até +3h.
 * @param {Object} op
 * @returns {boolean}
 */
export function dentroJanela(op) {
  if (!op.hora) return false;
  const [h, m] = op.hora.split(':').map(Number);
  if (isNaN(h)) return false;

  if (op.chave) {
    const matchData = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
    if (matchData) {
      const opDate = new Date(
        parseInt(matchData[3]),
        parseInt(matchData[2]) - 1,
        parseInt(matchData[1]),
        h, m || 0, 0
      );
      return (opDate - new Date()) / 60000 <= 180;
    }
  }

  // Fallback: só pela hora do dia
  const agora    = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const opMin    = h * 60 + (m || 0);
  let diffMin    = opMin - agoraMin;
  if (diffMin > 180) diffMin -= 1440;
  return diffMin <= 180;
}

/**
 * Retorna true quando falta menos de 1h para a operação (ou já passou).
 * @param {Object} op
 * @returns {boolean}
 */
export function dentroJanela1h(op) {
  if (!op.hora) return false;
  const [h, m] = op.hora.split(':').map(Number);
  if (isNaN(h)) return false;

  if (op.chave) {
    const matchData = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
    if (matchData) {
      const opDate = new Date(
        parseInt(matchData[3]),
        parseInt(matchData[2]) - 1,
        parseInt(matchData[1]),
        h, m || 0, 0
      );
      return (opDate - new Date()) / 60000 <= 60;
    }
  }

  const agora    = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const opMin    = h * 60 + (m || 0);
  let diffMin    = opMin - agoraMin;
  if (diffMin < -180) diffMin += 1440;
  return diffMin <= 60;
}

/**
 * Chave única de uma operação.
 * @param {Object} op
 * @returns {string}
 */
export function opKey(op) {
  return op.id || op.chave;
}

/**
 * Retorna true se a op está na janela de monitoramento OU monitorada manualmente.
 * @param {Object} op
 * @returns {boolean}
 */
export function naJanela(op) {
  return monitoradas.has(opKey(op)) || dentroJanela(op);
}

/**
 * Retorna true se a operação está concluída (todos os passos confirmados).
 * @param {Object} op
 * @returns {boolean}
 */
export function isConcluida(op) {
  const d = apontCache[op.id];
  if (!d || d === 'loading') return false;
  return d.todosConfirmados === true;
}

// ── PARSER DO DOM ─────────────────────────────────────────────────

/**
 * Parseia uma bolinha de status do TSI App.
 * @param {HTMLElement} img
 * @returns {{ status: number, title: string } | null}
 */
export function parseBubble(img) {
  if (!img) return null;
  const src   = img.getAttribute('src') || '';
  const title = img.getAttribute('data-original-title') || img.getAttribute('title') || '';
  let status  = 0;

  if (src.includes('statusbubble_1'))      status = 1;
  else if (src.includes('statusbubble_2')) status = 2;
  else if (src.includes('statusbubble_3')) status = 3;
  else return null;

  return { status, title };
}

/**
 * Extrai a lista de operações do Document da página de planejamento.
 * @param {Document} doc
 * @returns {Array}
 */
export function parseOpsFromDoc(doc) {
  const ops = [];
  const mainTable = doc.querySelector('table tbody');
  if (!mainTable) return ops;

  mainTable.querySelectorAll('tr').forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 9) return;

    const allLinks    = [...row.querySelectorAll('a[onclick*="planejamento-operacional-edit"]')];
    const linkEl      = allLinks[0] || null;
    const linkElView  = allLinks[1] || null;
    const eyeLink     = row.querySelector('a[href*="pedidoEgeral"]') || row.querySelector('a[href*="pedidoE"]');

    let id = '';
    if (linkEl) {
      const match = linkEl.getAttribute('onclick').match(
        /planejamento-operacional-edit([A-Za-z0-9+\/=_-]+?)_\d+[',\s]/
      );
      if (match) id = match[1];
    }

    const g = i => cells[i]?.textContent?.trim() || '';

    const bubbles = [];
    row.querySelectorAll('img[src*="statusbubble_"]').forEach(img => {
      const b = parseBubble(img);
      if (b) bubbles.push(b);
    });

    const liderCell = cells[11];
    const lider = liderCell?.getAttribute('title')
      || liderCell?.getAttribute('data-original-title')
      || liderCell?.textContent?.trim()
      || '';

    // Persiste referências DOM para uso em ações (enviar escala etc.)
    window._monLinkEls     = window._monLinkEls     || {};
    window._monLinkElsView = window._monLinkElsView || {};
    window._monEyeHrefs    = window._monEyeHrefs    || {};
    if (linkEl && id)   window._monLinkEls[id]     = linkEl;
    if (linkElView && id) window._monLinkElsView[id] = linkElView;
    if (eyeLink && id)  window._monEyeHrefs[id]    = eyeLink.getAttribute('href');

    ops.push({
      chave:   g(0),
      sigla:   g(1),
      site:    g(2),
      qtd:     parseInt(g(3)) || 0,
      hora:    g(9),
      lider,
      liderCompleto: lider,
      status:  g(24).toLowerCase(),
      time:    g(8),
      id,
      bubbles,
      // Quantidade escalada atual da coluna ESC/SOL (ex: "3/3" → 3)
      escAtual: (() => {
        const match = (g(4) || '').match(/^(\d+)\//);
        return match ? parseInt(match[1]) : -1;
      })(),
      // Carga horária da coluna CARGA HORÁRIA (ex: "1D8H")
      cargaHoraria: (() => {
        const raw = g(25);
        return /^[1-9]D\d+H$/i.test(raw) ? raw.toUpperCase() : '';
      })(),
    });
  });

  return ops;
}
