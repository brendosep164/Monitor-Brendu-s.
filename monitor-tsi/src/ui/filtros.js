/**
 * ui/filtros.js
 * ─────────────────────────────────────────────────────────────────
 * Filtros, ordenação e agrupamento de operações na tabela.
 * ─────────────────────────────────────────────────────────────────
 */

import {
  operations, apontCache, filterText, sortCol, sortDir,
  collapsedBuckets, setFilterText, setSortCol, setSortDir,
} from '../state.js';

let activeStatusFilter  = 'all';
let escEnviadaSubfilter = false;

// ── RANK / MATCH ──────────────────────────────────────────────────

/**
 * Retorna o rank numérico de status da op (para ordenação).
 * 0 = completo → 4 = nenhum.
 */
export function getStatusRank(op) {
  const d = apontCache[op.id];
  if (!d || d === 'loading') return 99;
  if (d.apontado >= d.solicitado && d.escalado >= d.solicitado) return 0;
  if (d.apontado > 0) return 1;
  if (d.escalado >= d.solicitado) return 2;
  if (d.escalado > 0) return 3;
  return 4;
}

/**
 * Verifica se a op corresponde ao filtro de status ativo.
 */
export function matchesStatusFilter(op) {
  if (activeStatusFilter === 'all') return true;
  const d = apontCache[op.id];
  if (!d || d === 'loading') {
    return activeStatusFilter !== 'completo' && activeStatusFilter !== 'parcial';
  }
  const escOk = d.escalado >= d.solicitado;
  const aptOk = d.apontado >= d.solicitado;
  switch (activeStatusFilter) {
    case 'completo':       return aptOk && escOk;
    case 'parcial':        return d.apontado > 0 && !aptOk;
    case 'esc':            return d.apontado === 0 && escOk;
    case 'esc_inc':        return d.escalado > 0 && !escOk;
    case 'nenhum':         return d.apontado === 0 && d.escalado === 0;
    case 'esc_inc_nenhum': return !escOk;
    default:               return true;
  }
}

// ── OPS VISÍVEIS ──────────────────────────────────────────────────

/**
 * Retorna a lista de ops filtradas e ordenadas para renderização.
 * @returns {Array}
 */
export function getVisibleOps() {
  const q = filterText.toLowerCase().trim();

  let ops = operations.filter(op => {
    if (q && !op.chave.toLowerCase().includes(q)
          && !op.sigla.toLowerCase().includes(q)
          && !(op.site   || '').toLowerCase().includes(q)
          && !(op.lider  || '').toLowerCase().includes(q)) return false;

    if (activeStatusFilter === 'esc' && escEnviadaSubfilter) {
      const d = apontCache[op.id];
      if (!d || d === 'loading') return false;
      if (d.listaEnviada || d.todosConfirmados) return false;
    }

    return matchesStatusFilter(op);
  });

  if (sortCol) {
    ops = [...ops].sort((a, b) => {
      let va, vb;
      const da = apontCache[a.id], db = apontCache[b.id];
      switch (sortCol) {
        case 'esc':
          va = (da && da !== 'loading' && a.qtd > 0) ? da.escalado / a.qtd : -1;
          vb = (db && db !== 'loading' && b.qtd > 0) ? db.escalado / b.qtd : -1;
          break;
        case 'apt':
          va = (da && da !== 'loading' && a.qtd > 0) ? da.apontado / a.qtd : -1;
          vb = (db && db !== 'loading' && b.qtd > 0) ? db.apontado / b.qtd : -1;
          break;
        case 'hora':
          va = a.hora || '99:99'; vb = b.hora || '99:99';
          break;
        case 'status':
          va = getStatusRank(a); vb = getStatusRank(b);
          break;
      }
      if (va < vb) return -1 * sortDir;
      if (va > vb) return  1 * sortDir;
      return 0;
    });
  } else {
    // Ordenação padrão: data+hora extraídas da chave
    ops = [...ops].sort((a, b) => chaveTimestamp(a.chave) - chaveTimestamp(b.chave));
  }

  return ops;
}

/**
 * Extrai timestamp de ordenação da chave da operação.
 * Ex: "SVCCAS220520260500" → timestamp de 2026-05-22T05:00
 */
export function chaveTimestamp(chave) {
  if (!chave || chave.length < 12) return 0;
  const tail = chave.slice(-12);
  const ts   = Date.parse(
    `${tail.slice(4,8)}-${tail.slice(2,4)}-${tail.slice(0,2)}T${tail.slice(8,10)}:${tail.slice(10,12)}:00`
  );
  return isNaN(ts) ? 0 : ts;
}

// ── AÇÕES DE FILTRO (expostas globalmente) ────────────────────────

window._monSetFilter = function (val) {
  setFilterText(val);
  window.filterText = val;
  const clearBtn = document.getElementById('mon-filter-clear');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  renderTable();
};

window._monClearFilter = function () {
  setFilterText('');
  window.filterText = '';
  const inp = document.getElementById('mon-filter-input');
  if (inp) inp.value = '';
  const clearBtn = document.getElementById('mon-filter-clear');
  if (clearBtn) clearBtn.style.display = 'none';
  renderTable();
};

window._monSetStatusFilter = function (val, btnEl) {
  activeStatusFilter = val;
  if (val !== 'esc') {
    escEnviadaSubfilter = false;
    document.getElementById('mon-sub-esc-enviada')?.classList.remove('active');
  }
  const escSubRow = document.getElementById('mon-esc-subfilter');
  if (escSubRow) escSubRow.style.display = val === 'esc' ? 'flex' : 'none';
  document.querySelectorAll('.mon-chip').forEach(b => b.classList.remove('active'));
  btnEl?.classList.add('active');
  renderTable();
};

window._monToggleEscEnviada = function (btnEl) {
  escEnviadaSubfilter = !escEnviadaSubfilter;
  btnEl?.classList.toggle('active', escEnviadaSubfilter);
  renderTable();
};

window._monToggleSort = function (col, thEl) {
  if (sortCol === col) setSortDir(sortDir * -1);
  else { setSortCol(col); setSortDir(1); }
  document.querySelectorAll('.mon-th-sort').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
  thEl?.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
  renderTable();
};

window._monToggleBucket = function (bucketKey, hdrEl) {
  const group   = hdrEl?.closest('.mon-group')
    ?? document.querySelector(`.mon-group[data-bucket="${bucketKey}"]`);
  if (!group) return;
  const rows    = group.querySelector('.mon-group-rows');
  const chevron = hdrEl?.querySelector('.g-chevron');

  if (collapsedBuckets.has(bucketKey)) {
    collapsedBuckets.delete(bucketKey);
    hdrEl?.classList.remove('is-collapsed');
    if (chevron) chevron.textContent = '▼';
    if (rows) {
      rows.style.cssText = 'overflow:hidden;display:block;max-height:0px;transition:max-height 0.18s ease';
      requestAnimationFrame(() => { rows.style.maxHeight = `${rows.scrollHeight}px`; });
      setTimeout(() => { rows.style.cssText = ''; }, 190);
    }
  } else {
    collapsedBuckets.add(bucketKey);
    hdrEl?.classList.add('is-collapsed');
    if (chevron) chevron.textContent = '▶';
    if (rows) {
      rows.style.cssText = `overflow:hidden;max-height:${rows.scrollHeight}px;transition:max-height 0.18s ease`;
      requestAnimationFrame(() => { rows.style.maxHeight = '0px'; });
      setTimeout(() => { rows.style.cssText = 'display:none'; }, 190);
    }
  }
};

// Usa window para evitar dependência circular
function renderTable() {
  window._monRenderTable?.();
}
