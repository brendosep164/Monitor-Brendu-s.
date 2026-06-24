/**
 * modules/faltas.js
 * ─────────────────────────────────────────────────────────────────
 * Gerenciamento de faltas de colaboradores.
 *
 * Falta = diferença entre qtd solicitada e entregues na op.
 * Os dados são compartilhados via Supabase entre todos os usuários.
 * ─────────────────────────────────────────────────────────────────
 */

import { sbGet, sbSet } from '../services/supabase.js';
import { apontCache } from '../state.js';
import { getNomeUsuario, getDataDaOp } from '../utils/formatters.js';

let _faltasCache = {}; // { chave: { ...registro } }

const MOTIVOS = [
  'desistência sem reposição',
  'sem aderência',
];

// Motivos escolhidos por op (em memória, reseta ao fechar/abrir o modal)
window._faltasMotivos = window._faltasMotivos || {};

// ── CARGA / PERSISTÊNCIA ──────────────────────────────────────────

/**
 * Carrega faltas do Supabase.
 * @param {function} [cb]
 */
export function carregarFaltas(cb) {
  sbGet('faltas', data => {
    _faltasCache = data || {};
    _atualizarBotao();
    cb?.(_faltasCache);
  });
}

/**
 * Salva faltas no Supabase.
 * @param {Object}   faltas
 * @param {function} [cb]
 */
export function salvarFaltas(faltas, cb) {
  _faltasCache = faltas;
  _atualizarBotao();
  sbSet('faltas', faltas, cb);
}

// ── REGISTRO ──────────────────────────────────────────────────────

/**
 * Registra faltas de uma operação.
 * Calcula a diferença entre solicitado e entregues.
 *
 * @param {Object}   op           - Operação
 * @param {number}   entregueCount - Quantidade de colaboradores entregues
 * @param {function} [cb]          - Chamado após salvar
 */
export function registrarFaltas(op, entregueCount, cb) {
  const d       = apontCache[op.id];
  const escalado = (d && d.escalado != null) ? d.escalado : op.qtd;
  const faltas   = Math.max(0, op.qtd - entregueCount);

  if (faltas === 0) { cb?.(); return; }

  const agora = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });

  const registro = {
    chave:        op.chave,
    hora:         op.hora || '—',
    dataOp:       getDataDaOp(op),
    solicitado:   op.qtd,
    escalado,
    entregue:     entregueCount,
    faltas,
    registradoEm:  agora,
    registradoPor: getNomeUsuario() || 'Anônimo',
  };

  salvarFaltas({ ..._faltasCache, [op.chave]: registro }, cb);
}

// ── FILTRO / RELATÓRIO ────────────────────────────────────────────

/**
 * Retorna faltas filtradas pelo período selecionado no modal.
 * @returns {Array}
 */
export function getFaltasFiltradas() {
  const dataIni = _val('mon-faltas-data-ini');
  const horaIni = _val('mon-faltas-hora-ini');
  const dataFim = _val('mon-faltas-data-fim');
  const horaFim = _val('mon-faltas-hora-fim');
  const registros = Object.values(_faltasCache);

  if (!dataIni && !dataFim) return registros;

  const toISO = s => {
    const p = (s || '').split('/');
    return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : '';
  };

  const dtIni = dataIni ? new Date(`${dataIni}T${horaIni || '00:00'}:00`).getTime() : null;
  const dtFim = dataFim ? new Date(`${dataFim}T${horaFim || '23:59'}:00`).getTime() : null;

  return registros.filter(r => {
    const iso  = toISO(r.dataOp || '');
    if (!iso) return true;
    const hora = (r.hora && r.hora !== '—') ? r.hora : '00:00';
    const dtR  = new Date(`${iso}T${hora}:00`).getTime();
    if (dtIni && dtR < dtIni) return false;
    if (dtFim && dtR > dtFim) return false;
    return true;
  });
}

/**
 * Gera texto formatado para WhatsApp com o relatório de faltas.
 * @returns {string}
 */
export function gerarTextoFaltas() {
  const lista = _sortLista(getFaltasFiltradas().filter(r => r.faltas > 0));
  if (lista.length === 0) return '';

  const datasUnicas = [...new Set(lista.map(r => r.dataOp))].sort((a, b) => {
    const toISO = s => { const [d, m, y] = s.split('/'); return `${y}-${m}-${d}`; };
    return toISO(a).localeCompare(toISO(b));
  });

  const datasStr   = datasUnicas.length > 1
    ? `${datasUnicas[0]} - ${datasUnicas[datasUnicas.length - 1]}`
    : datasUnicas[0];
  const totalFaltas = lista.reduce((s, r) => s + r.faltas, 0);
  const sep         = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

  const linhas = ['📋 *RELATÓRIO DE FALTAS* 📋', `📅 *${datasStr}*`, ''];
  lista.forEach(r => {
    const motivo = (window._faltasMotivos?.[r.chave]) || MOTIVOS[0];
    const qtd    = r.faltas === 1 ? '01 falta' : `${String(r.faltas).padStart(2, '0')} faltas`;
    linhas.push(`❌ *${r.chave}*`, `└➤ *${qtd}* por ${motivo}`, sep);
  });
  linhas.push(`➡️ *TOTAL: ${String(totalFaltas).padStart(2, '0')} FALTA${totalFaltas !== 1 ? 'S' : ''}*`);
  return linhas.join('\n');
}

/**
 * Retorna o cache atual de faltas.
 * @returns {Object}
 */
export function getFaltasCache() { return _faltasCache; }

/**
 * Remove um registro de falta por chave.
 * @param {string}   chave
 * @param {function} [cb]
 */
export function removerFalta(chave, cb) {
  const novasFaltas = { ..._faltasCache };
  delete novasFaltas[chave];
  salvarFaltas(novasFaltas, cb);
}

/**
 * Limpa todas as faltas.
 * @param {function} [cb]
 */
export function limparFaltas(cb) {
  salvarFaltas({}, cb);
}

// ── UTILITÁRIOS PRIVADOS ──────────────────────────────────────────

function _atualizarBotao() {
  const btn = document.getElementById('mon-faltas-btn');
  if (!btn) return;
  const total = Object.values(_faltasCache).reduce((s, r) => s + (r.faltas || 0), 0);
  btn.textContent = total > 0 ? `📋 Faltas (${total})` : '📋 Faltas';
}

function _sortLista(lista) {
  const toISO = s => { const p = (s || '').split('/'); return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : ''; };
  return [...lista].sort((a, b) => {
    const dtA = `${toISO(a.dataOp || '')}T${(a.hora && a.hora !== '—') ? a.hora : '00:00'}`;
    const dtB = `${toISO(b.dataOp || '')}T${(b.hora && b.hora !== '—') ? b.hora : '00:00'}`;
    return dtA.localeCompare(dtB);
  });
}

function _val(id) {
  return (document.getElementById(id) || {}).value || '';
}

// Expõe globalmente
window._faltasGerarTextoAtual = gerarTextoFaltas;
