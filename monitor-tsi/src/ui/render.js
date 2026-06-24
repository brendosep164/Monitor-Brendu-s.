/**
 * ui/render.js
 * ─────────────────────────────────────────────────────────────────
 * Renderização da tabela de operações no painel.
 *
 * Esta é a função mais complexa do monitor — responsável por:
 * - Renderizar linhas de operações com reconciliação (sem flicker)
 * - Calcular e exibir badges de progresso (esc/apt)
 * - Atualizar chips de filtro com contagens
 * - Renderizar detalhe expandido de cada operação
 * - Atualizar bolinhas de mudança de escala (snapshot diff)
 *
 * POR QUE ESTÁ SEPARADO:
 * Antes, renderTable() ficava no meio de 12k linhas misturado com
 * lógica de negócio. Agora é isolado aqui — se o layout mudar,
 * você sabe exatamente onde mexer.
 * ─────────────────────────────────────────────────────────────────
 */

import { operations, apontCache, expanded, collapsedBuckets } from '../state.js';
import { getVisibleOps, chaveTimestamp } from './filtros.js';
import { updateMetrics } from './metricas.js';
import { naJanela, dentroJanela1h } from '../modules/operacoes.js';
import { snapDiff } from '../modules/snapshot.js';

// ── RENDERIZAÇÃO PRINCIPAL ────────────────────────────────────────

/**
 * Renderiza (ou reconcilia) a tabela de operações.
 * Usa reconciliação por chave para evitar re-render completo e flickering.
 */
export function renderTable() {
  // Tenta usar o sistema V2 (drawer premium) se disponível
  if (typeof window.renderTableV2 === 'function') {
    window.renderTableV2();
    return;
  }

  const tbody = document.getElementById('mon-tbody');
  if (!tbody) return;

  _atualizarChips();

  if (operations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Nenhuma operação encontrada</td></tr>`;
    updateMetrics();
    return;
  }

  const visibleOps = getVisibleOps();

  // Atualiza placeholder do input de filtro
  const inp = document.getElementById('mon-filter-input');
  if (inp && !window.filterText) {
    inp.placeholder = `Filtrar por chave, sigla ou site… (${operations.length} ops)`;
  }

  if (visibleOps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Nenhuma operação corresponde ao filtro</td></tr>`;
    updateMetrics();
    return;
  }

  // Remove placeholder se existir
  const ph = tbody.querySelector('tr td[colspan]');
  if (ph) tbody.innerHTML = '';

  // Reconciliação: mantém linhas existentes, adiciona/remove o necessário
  const existingRows = new Map();
  [...tbody.querySelectorAll('tr[data-chave]')].forEach(tr => {
    existingRows.set(tr.dataset.chave, tr);
  });

  const newChaves = new Set(visibleOps.map(op => op.chave));

  // Remove linhas que não devem mais aparecer
  existingRows.forEach((tr, chave) => {
    if (!newChaves.has(chave)) tr.remove();
  });

  // Renderiza/atualiza cada linha
  visibleOps.forEach((op, idx) => {
    const existing = existingRows.get(op.chave);
    const d        = apontCache[op.id];
    const rowHtml  = _renderRow(op, d, idx);

    if (existing) {
      // Atualiza apenas o conteúdo interno se a linha já existe
      existing.outerHTML = rowHtml;
    } else {
      tbody.insertAdjacentHTML('beforeend', rowHtml);
    }

    // Renderiza detalhe expandido se necessário
    if (expanded.has(op.chave)) {
      const detRow = document.getElementById(`det-${op.chave}`);
      if (detRow) {
        const inner = detRow.querySelector('.mon-detail-inner');
        if (inner) inner.innerHTML = renderDetail(op);
      }
    }
  });

  updateMetrics();
  _updateSnapDots();
}

/**
 * Atualiza células de uma linha existente sem re-renderizar tudo.
 * Chamado após cada fetch individual de operação.
 * @param {HTMLElement} row
 * @param {Object}      op
 * @param {Object}      dados
 * @param {Object|null} oldCache
 */
export function updateRowCells(row, op, dados, oldCache) {
  if (!row || !dados || dados === 'loading') return;
  // Re-renderiza a linha completa (reconciliação é rápida)
  const d = apontCache[op.id];
  row.outerHTML = _renderRow(op, d, -1);
}

// ── DETALHE EXPANDIDO ─────────────────────────────────────────────

/**
 * Gera o HTML do painel de detalhe de uma operação (colaboradores, vales, links).
 * @param {Object} op
 * @returns {string}
 */
export function renderDetail(op) {
  const d = apontCache[op.id];
  if (!d || d === 'loading') {
    return '<div style="padding:16px;color:var(--mon-text-faint);font-size:12px">Carregando dados…</div>';
  }

  const colaboradores = d.colaboradores || [];
  const escalados     = d.escalados     || [];
  const vales         = d.vales         || [];
  const pdfLinks      = d.pdfLinks      || [];
  const xlsLinks      = d.xlsLinks      || [];

  // Seção de colaboradores apontados
  const colabHtml = colaboradores.length === 0
    ? '<div style="color:var(--mon-text-faint);font-size:12px;padding:8px 0">Nenhum apontamento registrado</div>'
    : colaboradores.map(c => `
        <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--mon-border)">
          <span style="font-size:11px;color:var(--mon-text)">${c.nome || '—'}</span>
          <span style="font-size:10px;color:var(--mon-text-faint)">${c.cpf || ''}</span>
          ${c.dist != null ? `<span style="font-size:10px;color:${c.dist <= 1 ? 'var(--mon-green)' : 'var(--mon-red)'}">${c.dist === 0 ? '✓' : c.dist + 'km'}</span>` : ''}
        </div>
      `).join('');

  // Links de PDF e XLS
  const pdfBtns = pdfLinks.map((l, i) => `
    <button onclick="window._monAbrirPdf('${op.id}', ${i})"
      style="font-size:11px;padding:4px 8px;border-radius:6px;border:1px solid var(--mon-border);background:var(--mon-surface2);color:var(--mon-text);cursor:pointer">
      📄 ${l.label || 'PDF ' + (i + 1)}
    </button>
  `).join('');

  const xlsBtns = xlsLinks.map((l, i) => `
    <a href="https://tsi-app.com/${l.href}" target="_blank"
      style="font-size:11px;padding:4px 8px;border-radius:6px;border:1px solid var(--mon-border);background:var(--mon-surface2);color:var(--mon-text);text-decoration:none;display:inline-block">
      📊 ${l.label || 'XLS ' + (i + 1)}
    </a>
  `).join('');

  return `
    <div style="padding:12px 16px;display:flex;flex-direction:column;gap:12px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">
          Apontados (${colaboradores.length})
        </div>
        ${colabHtml}
      </div>
      ${(pdfLinks.length > 0 || xlsLinks.length > 0) ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${pdfBtns}
          ${pdfLinks.length >= 2 ? `<button onclick="window._monMergePdfAssinaturas('${op.id}','${op.chave}',this)" style="font-size:11px;padding:4px 8px;border-radius:6px;border:1px solid var(--mon-border);background:var(--mon-surface2);color:var(--mon-text);cursor:pointer">🔗 Mesclar PDFs</button>` : ''}
          ${xlsBtns}
        </div>
      ` : ''}
    </div>
  `;
}

// ── BOLINHAS DE SNAPSHOT ──────────────────────────────────────────

/**
 * Atualiza as bolinhas de mudança de escala em todas as linhas visíveis.
 */
export function _updateSnapDots() {
  operations.forEach(op => _updateSnapDotForOp(op));
}

export function _updateSnapDotForOp(op) {
  const row = document.querySelector(`tr[data-chave="${op.chave}"]`);
  if (!row) return;
  const d    = apontCache[op.id];
  const esc2 = (d && d !== 'loading') ? (d.escalados || []) : null;
  if (!esc2) return;

  const diff = snapDiff(op.id, esc2);
  const dot  = row.querySelector('.mon-snap-dot');
  if (!dot) return;
  dot.style.display = (diff && !diff._soSaiu) ? 'block' : 'none';
}

// Expõe globalmente para chamadas internas
window._updateSnapDots     = _updateSnapDots;
window._updateSnapDotForOp = _updateSnapDotForOp;

// ── HELPERS PRIVADOS ──────────────────────────────────────────────

function _renderRow(op, d, idx) {
  const temDados  = d && d !== 'loading';
  const emJanela  = naJanela(op);
  const em1h      = dentroJanela1h(op);

  const escEfetivo = temDados ? (d.escalado || 0) : 0;
  const escPct     = (temDados && op.qtd > 0) ? Math.min(100, Math.round((escEfetivo / op.qtd) * 100)) : 0;
  const aptPct     = (temDados && emJanela && op.qtd > 0) ? Math.min(100, Math.round((d.apontado / op.qtd) * 100)) : 0;

  const escCor = escPct >= 100 ? 'var(--mon-green)' : escPct > 0 ? 'var(--mon-blue)' : 'var(--mon-red)';
  const aptCor = aptPct >= 100 ? 'var(--mon-green)' : aptPct > 0 ? 'var(--mon-amber)' : 'var(--mon-text-faint)';

  const nenhum   = temDados && d.escalado === 0 && d.apontado === 0;
  const escOk    = temDados && d.escalado >= d.solicitado;
  const aptOk    = temDados && d.apontado >= d.solicitado;
  const bordaCor = !temDados ? 'transparent'
    : nenhum     ? 'var(--mon-red)'
    : (aptOk && escOk) ? 'var(--mon-green)'
    : !escOk     ? 'var(--mon-amber)'
    : 'var(--mon-blue)';

  const diff    = temDados ? snapDiff(op.id, d.escalados || []) : null;
  const temDiff = diff && !diff._soSaiu;

  return `
    <tr data-chave="${op.chave}" style="border-left:3px solid ${bordaCor}">
      <td style="padding:8px 12px">
        <span class="mon-chave" style="font-size:12px;font-weight:700;font-family:var(--mon-mono)">${op.chave}</span>
        <span class="mon-snap-dot" style="display:${temDiff ? 'block' : 'none'};width:8px;height:8px;border-radius:50%;background:var(--mon-red);margin-top:2px"></span>
      </td>
      <td style="padding:8px 4px;font-size:12px">${op.sigla}</td>
      <td style="padding:8px 4px;font-size:12px;color:var(--mon-text-faint)">${op.site || '—'}</td>
      <td style="padding:8px 4px;font-size:12px;font-family:var(--mon-mono);font-weight:700">${op.hora || '—'}</td>
      <td style="padding:8px 4px">
        <div style="color:${escCor};font-size:12px;font-weight:700">${escEfetivo}/${op.qtd}</div>
        <div style="width:40px;height:4px;background:var(--mon-surface3);border-radius:2px;overflow:hidden;margin-top:2px">
          <div style="width:${escPct}%;height:100%;background:${escCor};border-radius:2px"></div>
        </div>
      </td>
      <td style="padding:8px 4px">
        ${emJanela ? `
          <div style="color:${aptCor};font-size:12px;font-weight:700">${temDados ? d.apontado : '…'}/${op.qtd}</div>
          <div style="width:40px;height:4px;background:var(--mon-surface3);border-radius:2px;overflow:hidden;margin-top:2px">
            <div style="width:${aptPct}%;height:100%;background:${aptCor};border-radius:2px"></div>
          </div>
        ` : `<span style="font-size:11px;color:var(--mon-text-faint)">—</span>`}
      </td>
      <td style="padding:8px 4px;font-size:11px;color:var(--mon-text-faint)">${op.lider || '—'}</td>
      <td style="padding:4px 8px">
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          <button onclick="window._monEnviarEscala('${op.id}',this)" class="mon-send-btn" title="Enviar escala">📋 Escala</button>
          <button onclick="window._monEnviarReport('${op.id}',this)" class="mon-send-btn" title="Enviar report">✅ Report</button>
          <button onclick="window._monGerarRelatorio('${op.id}',this)" class="mon-send-btn" title="Copiar relatório WPP">📲 WPP</button>
          <div class="mon-obs-wrap">
            <button onclick="window._monAbrirObs('${op.id}',this)" class="mon-obs-btn${window._monObsCache?.[op.id]?.texto ? ' has-obs' : ''}" title="Observações">💬</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function _atualizarChips() {
  const chipMap = {
    all: 'Todos', completo: '✓ Completo', parcial: '△ Parcial',
    esc: 'Esc. ok', esc_inc: '⚠ Esc. inc.', nenhum: '✗ Nenhum',
    esc_inc_nenhum: '⚠+✗ Inc. + Nenhum',
  };

  const countFor = (f) => operations.filter(op => {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return f !== 'completo' && f !== 'parcial';
    const escOk = d.escalado >= d.solicitado;
    const aptOk = d.apontado >= d.solicitado;
    switch (f) {
      case 'all': return true;
      case 'completo': return aptOk && escOk;
      case 'parcial':  return d.apontado > 0 && !aptOk;
      case 'esc':      return d.apontado === 0 && escOk;
      case 'esc_inc':  return d.escalado > 0 && !escOk;
      case 'nenhum':   return d.apontado === 0 && d.escalado === 0;
      case 'esc_inc_nenhum': return !escOk;
      default: return true;
    }
  }).length;

  Object.entries(chipMap).forEach(([f, label]) => {
    const btn = document.querySelector(`#mon-status-chips .mon-chip--${f.replace(/_/g, '-')}`);
    if (btn) btn.textContent = `${label} ${countFor(f)}`;
  });
}

// ── EXPOSIÇÃO GLOBAL (para acesso sem circular dependency) ────────
window._monRenderTable  = renderTable;
window._monRenderDetail = renderDetail;
window._updateSnapDots      = _updateSnapDots;
window._updateSnapDotForOp  = _updateSnapDotForOp;
