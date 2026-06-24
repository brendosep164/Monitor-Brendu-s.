/**
 * ui/toast.js
 * ─────────────────────────────────────────────────────────────────
 * Componente de toast notification — mensagens flutuantes no canto.
 *
 * Tipos disponíveis: 'success' | 'error' | 'info' | 'obs'
 *
 * USO:
 *   import { toast } from '../ui/toast.js';
 *   toast('Report enviado!', 'success');
 * ─────────────────────────────────────────────────────────────────
 */

// Injeta keyframes de animação (uma vez só)
(function injetarEstilos() {
  if (document.getElementById('_mon_toast_style')) return;
  const s = document.createElement('style');
  s.id = '_mon_toast_style';
  s.textContent = `
    @keyframes _monPulseRed {
      0%   { box-shadow: 0 0 0 0 rgba(220,38,38,0.85), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1); }
      25%  { box-shadow: 0 0 0 10px rgba(220,38,38,0.35), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1.04); }
      50%  { box-shadow: 0 0 0 18px rgba(220,38,38,0.0), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1); }
      75%  { box-shadow: 0 0 0 10px rgba(220,38,38,0.2), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.0), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1); }
    }
    ._mon_toast_pulse {
      animation: _monPulseRed 0.7s ease-out 3 !important;
    }
  `;
  document.head.appendChild(s);
})();

const TOAST_COLORS = {
  success: { bg: 'rgba(22,163,74,0.95)',  border: 'rgba(22,163,74,0.3)',  icon: '✅' },
  error:   { bg: 'rgba(220,38,38,0.95)',  border: 'rgba(220,38,38,0.3)',  icon: '❌' },
  info:    { bg: 'rgba(37,99,235,0.95)',   border: 'rgba(37,99,235,0.3)',  icon: 'ℹ️' },
  obs:     { bg: 'rgba(185,28,28,0.97)',   border: 'rgba(239,68,68,0.6)',  icon: '💬' },
};

// Alias antigo mantido para compatibilidade (era chamado como 'ok' no código original)
TOAST_COLORS.ok = TOAST_COLORS.success;

/**
 * Exibe um toast na tela.
 * @param {string} msg  - Mensagem a exibir
 * @param {'success'|'error'|'info'|'obs'|'ok'} [type='info'] - Tipo do toast
 */
export function toast(msg, type = 'info') {
  const existing = document.getElementById('_mon_toast');
  if (existing) existing.remove();

  const c = TOAST_COLORS[type] || TOAST_COLORS.info;
  const isObs = type === 'obs';
  const fontSize = isObs ? '15px' : '14px';
  const padding  = isObs ? '15px 22px' : '13px 20px';
  const iconSize = isObs ? '22px' : '18px';

  const el = document.createElement('div');
  el.id = '_mon_toast';
  el.style.cssText = [
    'position:fixed', 'bottom:28px', 'right:28px', 'z-index:2147483647',
    'display:flex', 'align-items:center', 'gap:10px',
    `padding:${padding}`, 'border-radius:12px',
    `background:${c.bg}`, `border:2px solid ${c.border}`,
    'box-shadow:0 8px 32px rgba(0,0,0,0.28)',
    'font-family:system-ui,sans-serif',
    `font-size:${fontSize}`, 'font-weight:700', 'color:#fff',
    'pointer-events:none', 'transition:opacity 0.2s,transform 0.2s',
    'opacity:0', 'transform:translateY(12px)',
  ].join(';');

  el.innerHTML = `<span style="font-size:${iconSize}">${c.icon}</span><span>${msg}</span>`;
  document.body.appendChild(el);

  // Anima entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      if (isObs) setTimeout(() => el.classList.add('_mon_toast_pulse'), 120);
    });
  });

  // Anima saída
  const duration = isObs ? 3500 : 2000;
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => { try { el.remove(); } catch (e) {} }, 400);
  }, duration);
}

// Expõe globalmente para compatibilidade com código HTML inline (onclick="...")
window._monToast = toast;
