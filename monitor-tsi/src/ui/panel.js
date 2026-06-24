/**
 * ui/panel.js
 * ─────────────────────────────────────────────────────────────────
 * Criação e gerenciamento do painel principal do monitor.
 *
 * O painel é um sidebar fixo na direita da tela com:
 * - Header com logo, status, ações e progresso
 * - Rail de navegação lateral
 * - Área principal com tabela de operações
 * - Drawer de detalhe de operação
 *
 * NOTA: O HTML do painel é extenso (~500 linhas). Está aqui
 * organizado em seções nomeadas para facilitar manutenção.
 * ─────────────────────────────────────────────────────────────────
 */

import { AVATAR_URL, STORAGE_KEYS } from '../config.js';
import { layoutMode } from '../state.js';

const PANEL_ID = 'mon-panel';

// ── CRIAÇÃO DO PAINEL ─────────────────────────────────────────────

/**
 * Cria o painel se ainda não existir e injeta no DOM.
 */
export function renderPanel() {
  if (document.getElementById(PANEL_ID)) return;

  injectStyles();

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.className = 'mon-v2';
  panel.style.cssText = `
    position:fixed;top:0;right:0;
    width:clamp(680px,52vw,980px);height:100vh;
    z-index:99998;display:none;flex-direction:column;overflow:hidden;
  `;

  panel.innerHTML = _buildPanelHTML();
  document.body.appendChild(panel);

  _restoreTheme(panel);
  _restoreLayout();
  _initDragResize(panel);
  _createFloatButton();
}

// ── HTML DO PAINEL ────────────────────────────────────────────────

function _buildPanelHTML() {
  const r    = 20;
  const circ = 2 * Math.PI * r;

  const notifState = !('Notification' in window) ? 'off'
    : Notification.permission === 'granted' ? 'on'
    : Notification.permission === 'denied'  ? 'off'
    : 'default';
  const notifLabel = notifState === 'on' ? '🔔 Notif. ativa'
    : notifState === 'off'  ? '🔕 Bloqueado'
    : '🔔 Ativar notif.';

  return `
    <!-- HEADER -->
    <div id="mon-header" class="mon-hd-v2">
      <div class="mon-hd-brand">
        <div class="mon-logo">
          <div class="mon-logo-icon">
            <img src="${AVATAR_URL}" alt="TSI" onerror="this.style.display='none'" />
          </div>
          <div class="mon-logo-text">
            <div class="mon-logo-title">Monitor <span style="color:var(--mon-accent)">TSI</span></div>
            <div class="mon-logo-sub" id="mon-sub">Inicializando…</div>
          </div>
        </div>
      </div>

      <!-- Ticker minimizado -->
      <div id="mon-ticker-wrap" style="display:none;flex:1;min-width:0;overflow:hidden;margin:0 12px;align-items:center;position:relative;height:20px;">
        <div id="mon-ticker" style="white-space:nowrap;display:inline-block;position:absolute;top:0;left:0;will-change:transform;">—</div>
      </div>

      <div class="mon-hd-spacer"></div>

      <div class="mon-hd-actions">
        <span id="mon-live" class="mon-status-pill" data-state="offline">
          <span class="mon-status-dot"></span>
          <span>Offline</span>
        </span>

        <div class="mon-refresh-pill" title="Próxima atualização automática">
          <span id="mon-hg-icon" style="font-size:11px">⏳</span>
          <span id="mon-hg-count" style="font-family:var(--mon-mono);font-size:11px;font-weight:600;color:var(--mon-text-dim)">—</span>
          <button class="mon-hd-icon-btn" onclick="window._monRefresh()" title="Atualizar">🔄</button>
        </div>

        <button id="mon-notif-hist-btn" class="mon-hd-icon-btn" onclick="window._monAbrirHistoricoNotif()" title="Notificações" style="position:relative;font-size:16px">
          🔔
          <span id="mon-notif-hist-badge" style="display:none;position:absolute;top:2px;right:2px;min-width:16px;height:16px;background:#ef4444;color:#fff;border-radius:8px;font-size:9px;font-weight:700;line-height:16px;text-align:center;padding:0 3px;"></span>
        </button>

        <div class="mon-avatar-wrap" title="Progresso de carregamento">
          <img id="mon-avatar-img" src="${AVATAR_URL}" alt="" />
          <div id="mon-progress-overlay"></div>
          <div id="mon-progress-text" style="display:none">0%</div>
          <svg width="44" height="44" style="position:absolute;top:0;left:0;transform:rotate(-90deg);z-index:4">
            <circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--mon-border)" stroke-width="2.5"/>
            <circle id="mon-progress-circle" cx="22" cy="22" r="${r}" fill="none"
              stroke="var(--mon-amber)" stroke-width="2.5"
              stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
              style="transition:stroke-dashoffset 0.4s ease,stroke 0.4s ease"/>
          </svg>
        </div>

        <button class="mon-hd-icon-btn" onclick="window._monToggleLayout()" title="Alternar layout">⊞</button>
        <button id="mon-theme-btn" class="mon-hd-icon-btn" onclick="window._monToggleTheme()" title="Alternar tema">🌙</button>
        <button class="mon-hd-icon-btn" onclick="window._monMinimize()" title="Minimizar">&#8212;</button>
        <button class="mon-hd-icon-btn mon-hd-icon-btn--danger" onclick="window._monFechar()" title="Fechar">&#10005;</button>

        <!-- Mantido invisível para compatibilidade -->
        <button id="mon-notif-btn" class="mon-hdr-btn" data-state="${notifState}" style="display:none" onclick="window._monPedirNotif()">${notifLabel}</button>
      </div>
    </div>

    <!-- BODY: RAIL + MAIN + DRAWER -->
    <div id="mon-body" class="mon-body-v2" style="display:flex;flex:1;overflow:hidden;min-height:0">

      <!-- RAIL DE NAVEGAÇÃO -->
      <aside class="mon-rail" id="mon-rail">
        <button class="mon-rail-item is-active" data-view="ops" onclick="window._monNavView('ops',this)" title="Operações">
          <span class="mon-rail-ic">📊</span>
          <span class="mon-rail-lbl">Ops</span>
        </button>
        <button class="mon-rail-item" data-view="hist" onclick="window._monNavView('hist',this)" title="Histórico">
          <span class="mon-rail-ic">🕐</span>
          <span class="mon-rail-lbl">Histórico</span>
        </button>
        <button class="mon-rail-item" data-view="faltas" onclick="window._monNavView('faltas',this)" title="Faltas">
          <span class="mon-rail-ic">📋</span>
          <span class="mon-rail-lbl">Faltas</span>
        </button>
        <button class="mon-rail-item" data-view="relatorios" onclick="window._monNavView('relatorios',this)" title="Relatórios">
          <span class="mon-rail-ic">📁</span>
          <span class="mon-rail-lbl">Relatórios</span>
        </button>
        <div style="flex:1"></div>
        <button class="mon-rail-item" onclick="window._monAbrirGerenciarContatos()" title="Contatos">
          <span class="mon-rail-ic">📧</span>
          <span class="mon-rail-lbl">Contatos</span>
        </button>
        <button class="mon-rail-item" onclick="window._monAbrirConfiguracoes()" title="Configurações">
          <span class="mon-rail-ic">⚙️</span>
          <span class="mon-rail-lbl">Config</span>
        </button>
      </aside>

      <!-- ÁREA PRINCIPAL -->
      <main class="mon-main" id="mon-main" style="flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0">

        <!-- FILTROS E CHIPS -->
        <div class="mon-filters" id="mon-filters">
          <div style="position:relative;flex:1">
            <input id="mon-filter-input" type="text" placeholder="Filtrar por chave, sigla ou site…"
              oninput="window._monSetFilter(this.value)"
              style="width:100%;box-sizing:border-box;padding:6px 28px 6px 10px;border-radius:8px;
                border:1px solid var(--mon-border2);background:var(--mon-bg);
                color:var(--mon-text);font-size:12px;font-family:var(--mon-font);outline:none" />
            <button id="mon-filter-clear" onclick="window._monClearFilter()"
              style="display:none;position:absolute;right:6px;top:50%;transform:translateY(-50%);
                background:none;border:none;color:var(--mon-text-faint);cursor:pointer;font-size:14px">✕</button>
          </div>

          <div id="mon-status-chips" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">
            <button class="mon-chip mon-chip--all active" onclick="window._monSetStatusFilter('all',this)">Todos</button>
            <button class="mon-chip mon-chip--completo" onclick="window._monSetStatusFilter('completo',this)">✓ Completo</button>
            <button class="mon-chip mon-chip--parcial" onclick="window._monSetStatusFilter('parcial',this)">△ Parcial</button>
            <button class="mon-chip mon-chip--esc" onclick="window._monSetStatusFilter('esc',this)">Esc. ok</button>
            <button class="mon-chip mon-chip--esc-inc" onclick="window._monSetStatusFilter('esc_inc',this)">⚠ Esc. inc.</button>
            <button class="mon-chip mon-chip--nenhum" onclick="window._monSetStatusFilter('nenhum',this)">✗ Nenhum</button>
          </div>

          <!-- Subfiltro de escala enviada (aparece quando chip Esc.ok está ativo) -->
          <div id="mon-esc-subfilter" style="display:none;gap:4px;margin-top:4px">
            <button id="mon-sub-esc-enviada" class="mon-chip" onclick="window._monToggleEscEnviada(this)">Não enviadas</button>
          </div>
        </div>

        <!-- CABEÇALHO DA TABELA -->
        <div class="mon-list-colhdr">
          <span style="flex:2">Chave / Op</span>
          <span style="flex:1">Sigla</span>
          <span style="flex:1.5">Site</span>
          <span class="mon-th-sort" onclick="window._monToggleSort('hora',this)" style="flex:0.8;cursor:pointer">Hora ▲▼</span>
          <span class="mon-th-sort" onclick="window._monToggleSort('esc',this)" style="flex:1;cursor:pointer">Esc ▲▼</span>
          <span class="mon-th-sort" onclick="window._monToggleSort('apt',this)" style="flex:1;cursor:pointer">Apt ▲▼</span>
          <span style="flex:1.5">Líder</span>
          <span style="flex:2">Ações</span>
        </div>

        <!-- TABELA DE OPERAÇÕES -->
        <div style="flex:1;overflow-y:auto">
          <table style="width:100%;border-collapse:collapse">
            <tbody id="mon-tbody">
              <tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Carregando operações…</td></tr>
            </tbody>
          </table>
        </div>

        <!-- MÉTRICAS DO RODAPÉ -->
        <div class="mon-metrics" id="mon-metrics">
          <span>Ops: <strong id="m-total">—</strong></span>
          <span>✓ <strong id="m-ok">—</strong></span>
          <span>△ <strong id="m-inc">—</strong></span>
          <span>✗ <strong id="m-zero">—</strong></span>
        </div>
      </main>

      <!-- DRAWER DE DETALHE (abre lateralmente) -->
      <div id="mon-drawer" class="mon-drawer" style="display:none;width:320px;border-left:1px solid var(--mon-border);overflow-y:auto;flex-shrink:0"></div>
    </div>
  `;
}

// ── AÇÕES DO PAINEL ───────────────────────────────────────────────

window._monFechar = function () {
  const panel = document.getElementById(PANEL_ID);
  const btn   = document.getElementById('btn-mon');
  if (panel) panel.style.display = 'none';
  if (btn)   btn.style.display   = 'flex';
};

window._monMinimize = function () {
  // Implementação mantida compatível com o sistema original
  const panel = document.getElementById(PANEL_ID);
  if (!panel) return;
  panel.classList.toggle('mon-minimized');
  const wrap  = document.getElementById('mon-ticker-wrap');
  const body  = document.getElementById('mon-body');
  const minimized = panel.classList.contains('mon-minimized');
  if (wrap) wrap.style.display = minimized ? 'flex' : 'none';
  if (body) body.style.display = minimized ? 'none' : 'flex';
};

window._monToggleTheme = function () {
  const panel = document.getElementById(PANEL_ID);
  const btn   = document.getElementById('mon-theme-btn');
  if (!panel) return;
  const isDark = panel.classList.toggle('mon-dark');
  document.body.classList.toggle('mon-dark-mode', isDark);
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  try { localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light'); } catch (e) {}
};

window._monRefresh = function () {
  // manualRefresh exposto via window pelo fetchOperations.js
  manualRefresh();
};

window._monNavView = function (view, btnEl) {
  document.querySelectorAll('.mon-rail-item').forEach(b => b.classList.remove('is-active'));
  btnEl?.classList.add('is-active');
  // Redireciona para os modais/views corretos
  const viewMap = {
    hist:      () => window._monAbrirHistorico?.(),
    faltas:    () => window._monAbrirFaltas?.(),
    relatorios: () => window._monAbrirRelatorios?.(),
  };
  viewMap[view]?.();
};

// ── RESTAURAÇÃO DE ESTADO ─────────────────────────────────────────

function _restoreTheme(panel) {
  try {
    if (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') {
      panel.classList.add('mon-dark');
      document.body.classList.add('mon-dark-mode');
      const btn = document.getElementById('mon-theme-btn');
      if (btn) btn.textContent = '☀️';
    }
  } catch (e) {}
}

function _restoreLayout() {
  const btn      = document.getElementById('mon-layout-btn');
  const groupsEl = document.getElementById('mon-groups');
  const colhdr   = document.querySelector(`#${PANEL_ID} .mon-list-colhdr`);
  const isCompact = layoutMode === 'compact';
  btn?.classList.toggle('is-compact', isCompact);
  groupsEl?.classList.toggle('is-compact', isCompact);
  colhdr?.classList.toggle('is-compact', isCompact);
}

// ── DRAG/RESIZE ───────────────────────────────────────────────────

function _initDragResize(panel) {
  // Resize handle na borda esquerda
  const handle = document.createElement('div');
  handle.style.cssText = 'position:absolute;left:0;top:0;width:4px;height:100%;cursor:ew-resize;z-index:1;';
  panel.appendChild(handle);

  let startX = 0, startW = 0;

  handle.addEventListener('mousedown', e => {
    startX = e.clientX;
    startW = panel.offsetWidth;
    e.preventDefault();

    const onMove = e => {
      const newW = Math.max(400, Math.min(window.innerWidth * 0.9, startW - (e.clientX - startX)));
      panel.style.width = newW + 'px';
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ── BOTÃO FLUTUANTE ───────────────────────────────────────────────

function _createFloatButton() {
  if (document.getElementById('btn-mon')) return;
  const btn = document.createElement('button');
  btn.id    = 'btn-mon';
  btn.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:99997;
    width:52px;height:52px;border-radius:50%;
    background:var(--mon-accent,#4f46e5);color:#fff;
    border:none;cursor:pointer;font-size:20px;
    box-shadow:0 4px 20px rgba(0,0,0,0.25);
    display:flex;align-items:center;justify-content:center;
    transition:transform 0.15s;
  `;
  btn.title     = 'Abrir Monitor TSI';
  btn.innerHTML = '📊';
  btn.onclick   = () => {
    const panel = document.getElementById(PANEL_ID);
    if (panel) {
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
    }
    btn.style.display = 'none';
  };
  document.body.appendChild(btn);
}

// ── ESTILOS BASE ──────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('mon-styles')) return;
  const style = document.createElement('style');
  style.id    = 'mon-styles';
  style.textContent = `
    /* CSS Variables - Light Theme */
    #mon-panel {
      --mon-font: system-ui, -apple-system, sans-serif;
      --mon-mono: 'Courier New', Courier, monospace;
      --mon-bg:         #ffffff;
      --mon-surface:    #f8f9fa;
      --mon-surface2:   #f1f3f5;
      --mon-surface3:   #e9ecef;
      --mon-border:     #dee2e6;
      --mon-border2:    #ced4da;
      --mon-text:       #212529;
      --mon-text-dim:   #495057;
      --mon-text-faint: #868e96;
      --mon-accent:     #4f46e5;
      --mon-accent-bg:  rgba(79,70,229,0.07);
      --mon-accent-border: rgba(79,70,229,0.3);
      --mon-green:        #16a34a;
      --mon-green-bg:     rgba(22,163,74,0.08);
      --mon-green-border: rgba(22,163,74,0.3);
      --mon-red:          #dc2626;
      --mon-red-bg:       rgba(220,38,38,0.06);
      --mon-red-border:   rgba(220,38,38,0.3);
      --mon-amber:        #d97706;
      --mon-amber-bg:     rgba(217,119,6,0.08);
      --mon-amber-border: rgba(217,119,6,0.3);
      --mon-blue:         #2563eb;
      --mon-blue-bg:      rgba(37,99,235,0.08);
      --mon-blue-border:  rgba(37,99,235,0.3);
      --mon-indigo:       #4f46e5;
    }

    /* Dark Theme */
    #mon-panel.mon-dark {
      --mon-bg:         #1a1b1e;
      --mon-surface:    #25262b;
      --mon-surface2:   #2c2d33;
      --mon-surface3:   #373a40;
      --mon-border:     #373a40;
      --mon-border2:    #4a4d56;
      --mon-text:       #c1c2c5;
      --mon-text-dim:   #909296;
      --mon-text-faint: #5c5f66;
    }

    #mon-panel * { box-sizing: border-box; }
    #mon-panel { font-family: var(--mon-font); background: var(--mon-bg); color: var(--mon-text); }

    .mon-hd-v2 { display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0;min-height:52px; }
    .mon-hd-brand { display:flex;align-items:center;gap:8px;flex-shrink:0; }
    .mon-logo { display:flex;align-items:center;gap:8px; }
    .mon-logo-icon { width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0; }
    .mon-logo-icon img { width:100%;height:100%;object-fit:cover; }
    .mon-logo-title { font-size:13px;font-weight:700;color:var(--mon-text);letter-spacing:-0.3px; }
    .mon-logo-sub { font-size:10px;color:var(--mon-text-faint); }
    .mon-hd-spacer { flex:1; }
    .mon-hd-actions { display:flex;align-items:center;gap:4px; }
    .mon-hd-icon-btn { width:28px;height:28px;border-radius:7px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:background 0.1s; }
    .mon-hd-icon-btn:hover { background:var(--mon-surface3);color:var(--mon-text); }
    .mon-hd-icon-btn--danger:hover { background:var(--mon-red-bg);color:var(--mon-red);border-color:var(--mon-red-border); }
    .mon-status-pill { display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;padding:3px 8px;border-radius:99px;border:1px solid var(--mon-border);background:var(--mon-surface2); }
    .mon-status-dot { width:6px;height:6px;border-radius:50%;background:var(--mon-text-faint); }
    [data-state="live"] .mon-status-dot { background:var(--mon-green); }
    [data-state="sync"] .mon-status-dot { background:var(--mon-amber); }
    .mon-refresh-pill { display:flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;border:1px solid var(--mon-border);background:var(--mon-surface2);font-size:11px; }
    .mon-avatar-wrap { position:relative;width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0; }
    .mon-avatar-wrap img { width:100%;height:100%;object-fit:cover;border-radius:50%; }
    #mon-progress-overlay { position:absolute;inset:0;background:rgba(0,0,0,0.4);border-radius:50%;opacity:0;transition:opacity 0.3s; }
    #mon-progress-text { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff; }

    .mon-rail { display:flex;flex-direction:column;gap:2px;padding:8px 4px;border-right:1px solid var(--mon-border);background:var(--mon-surface);width:60px;flex-shrink:0;align-items:center; }
    .mon-rail-item { width:48px;height:48px;border-radius:10px;border:none;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--mon-text-faint);transition:background 0.1s,color 0.1s;padding:4px; }
    .mon-rail-item:hover,.mon-rail-item.is-active { background:var(--mon-accent-bg);color:var(--mon-accent); }
    .mon-rail-ic { font-size:16px; }
    .mon-rail-lbl { font-size:9px;font-weight:600; }

    .mon-filters { padding:8px 12px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0; }
    .mon-list-colhdr { display:flex;align-items:center;padding:4px 12px;background:var(--mon-surface2);border-bottom:1px solid var(--mon-border);font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.5px;flex-shrink:0; }
    .mon-metrics { display:flex;gap:16px;padding:6px 14px;border-top:1px solid var(--mon-border);background:var(--mon-surface);font-size:11px;color:var(--mon-text-faint);flex-shrink:0; }

    .mon-chip { padding:4px 10px;border-radius:99px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:11px;cursor:pointer;font-weight:500;transition:all 0.1s; }
    .mon-chip:hover,.mon-chip.active { background:var(--mon-accent-bg);color:var(--mon-accent);border-color:var(--mon-accent-border); }
    .mon-th-sort.sort-asc::after { content:'▲';margin-left:3px;font-size:9px; }
    .mon-th-sort.sort-desc::after { content:'▼';margin-left:3px;font-size:9px; }

    .mon-send-btn { padding:3px 8px;border-radius:6px;border:1px solid var(--mon-border);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:11px;cursor:pointer;white-space:nowrap; }
    .mon-send-btn:hover { background:var(--mon-accent-bg);color:var(--mon-accent);border-color:var(--mon-accent-border); }
    .mon-send-btn--err { background:var(--mon-red-bg)!important;color:var(--mon-red)!important;border-color:var(--mon-red-border)!important; }
    .mon-obs-btn { padding:3px 8px;border-radius:6px;border:1px solid var(--mon-border);background:var(--mon-surface2);color:var(--mon-text-faint);font-size:11px;cursor:pointer; }
    .mon-obs-btn.has-obs { background:var(--mon-amber-bg);color:var(--mon-amber);border-color:var(--mon-amber-border); }
    .mon-obs-badge { display:block;width:8px;height:8px;border-radius:50%;background:var(--mon-red);position:absolute;top:0;right:0; }
    .mon-obs-wrap { position:relative;display:inline-block; }

    .mon-obs-popover { display:none;position:fixed;z-index:999999;width:280px;border-radius:12px;border:1px solid var(--mon-border);background:var(--mon-bg);box-shadow:0 8px 32px rgba(0,0,0,0.2); }
    .mon-obs-popover.open { display:block; }
    .mon-obs-header { display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--mon-border);font-size:13px;font-weight:700; }
    .mon-obs-hist { display:none;max-height:120px;overflow-y:auto;border-bottom:1px solid var(--mon-border);font-size:11px;padding:6px 12px; }
    .mon-obs-hist.open { display:block; }
    .mon-obs-hist-item { padding:4px 0;border-bottom:1px solid var(--mon-border); }
    #mon-obs-text { width:100%;padding:8px 12px;border:none;background:var(--mon-surface2);resize:none;font-family:var(--mon-font);font-size:12px;color:var(--mon-text);outline:none; }
    .mon-obs-meta { font-size:10px;color:var(--mon-text-faint);padding:4px 12px; }
    .mon-obs-footer { display:flex;justify-content:flex-end;padding:8px 12px;border-top:1px solid var(--mon-border); }
    .mon-obs-save { padding:5px 14px;border-radius:7px;border:none;background:var(--mon-accent);color:#fff;font-size:12px;font-weight:600;cursor:pointer; }

    @keyframes mon-fadein { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
    @keyframes mon-shake { from{transform:rotate(-5deg)} to{transform:rotate(5deg)} }
  `;
  document.head.appendChild(style);
}
