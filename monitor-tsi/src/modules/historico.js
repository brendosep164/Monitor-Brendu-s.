/**
 * modules/historico.js
 * ─────────────────────────────────────────────────────────────────
 * Gerencia o histórico de reports de operações.
 *
 * Cada entry: { opId, chave, sigla, site, hora, dataOp,
 *               apontado, solicitado, escalado, lideres,
 *               quemEnviou, ts }
 *
 * Persistência: Supabase (chave 'reportHistorico'), compartilhado
 * entre todos os usuários.
 * ─────────────────────────────────────────────────────────────────
 */

import { sbGet, sbSet } from '../services/supabase.js';
import { operations, apontCache } from '../state.js';
import { getNomeUsuario, getDataDaOp } from '../utils/formatters.js';

const HIST_KEY  = 'reportHistorico';
const MAX_ITEMS = 300;

let _reportHist = [];

// ── CARGA / PERSISTÊNCIA ──────────────────────────────────────────

/**
 * Carrega o histórico do Supabase.
 * @param {function} [cb] - Chamado após carregar
 */
export function carregarHistorico(cb) {
  sbGet(HIST_KEY, data => {
    _reportHist = Array.isArray(data) ? data : [];
    cb?.();
  });
}

/**
 * Salva uma nova entrada no histórico (upsert por opId+dataOp).
 * @param {string} opId
 */
export function salvarEntradaHistorico(opId) {
  const op = operations.find(o => o.id === opId);
  const d  = apontCache[opId];
  if (!op || !d || d === 'loading') return;

  const entry = {
    opId,
    chave:      op.chave,
    sigla:      op.sigla  || '',
    site:       op.site   || '',
    hora:       op.hora   || '',
    dataOp:     getDataDaOp(op),
    apontado:   d.apontado   || 0,
    solicitado: d.solicitado || op.qtd || 0,
    escalado:   d.escalado   || 0,
    lideres:    d.lideres    || [],
    quemEnviou: getNomeUsuario() || 'Anônimo',
    ts: Date.now(),
  };

  // Remove entrada anterior da mesma op no mesmo dia (evita duplicata)
  _reportHist = _reportHist.filter(e =>
    !(e.opId === opId && e.dataOp === entry.dataOp)
  );

  _reportHist.unshift(entry);
  if (_reportHist.length > MAX_ITEMS) _reportHist = _reportHist.slice(0, MAX_ITEMS);

  sbSet(HIST_KEY, _reportHist);
}

/**
 * Limpa todo o histórico no Supabase.
 * @param {function} [cb]
 */
export function limparHistorico(cb) {
  _reportHist = [];
  sbSet(HIST_KEY, [], cb);
}

/**
 * Retorna a lista atual de histórico em memória.
 * @returns {Array}
 */
export function getHistorico() {
  return _reportHist;
}

/**
 * Filtra o histórico por texto (chave, sigla ou site).
 * @param {string} query
 * @returns {Array}
 */
export function filtrarHistorico(query) {
  if (!query) return _reportHist;
  const q = query.toLowerCase().trim();
  return _reportHist.filter(e =>
    (e.chave || '').toLowerCase().includes(q) ||
    (e.sigla || '').toLowerCase().includes(q) ||
    (e.site  || '').toLowerCase().includes(q)
  );
}
