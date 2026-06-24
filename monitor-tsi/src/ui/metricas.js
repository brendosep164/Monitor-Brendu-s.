/**
 * ui/metricas.js
 * ─────────────────────────────────────────────────────────────────
 * Métricas agregadas exibidas no rodapé do painel.
 * Total de operações, escalados, apontados e completos.
 * ─────────────────────────────────────────────────────────────────
 */

import { operations, apontCache } from '../state.js';

/**
 * Recalcula e atualiza os contadores de métricas no DOM.
 */
export function updateMetrics() {
  let totalOps  = 0;
  let totalEsc  = 0;
  let totalApt  = 0;
  let totalSol  = 0;
  let completos = 0;

  operations.forEach(op => {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return;
    totalOps++;
    totalEsc  += d.escalado    || 0;
    totalApt  += d.apontado    || 0;
    totalSol  += d.solicitado  || op.qtd || 0;
    if (d.apontado >= d.solicitado && d.escalado >= d.solicitado) completos++;
  });

  _setMetric('mon-metric-ops',     totalOps);
  _setMetric('mon-metric-esc',     totalEsc);
  _setMetric('mon-metric-apt',     totalApt);
  _setMetric('mon-metric-sol',     totalSol);
  _setMetric('mon-metric-compl',   completos);
}

function _setMetric(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
