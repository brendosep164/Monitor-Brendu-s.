/**
 * ui/progress.js
 * ─────────────────────────────────────────────────────────────────
 * Barra/anel de progresso do carregamento de operações.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Atualiza o anel de progresso circular no avatar.
 * @param {number} loaded - Operações já carregadas
 * @param {number} total  - Total de operações
 */
export function updateProgress(loaded, total) {
  const circle  = document.getElementById('mon-progress-circle');
  const overlay = document.getElementById('mon-progress-overlay');
  const text    = document.getElementById('mon-progress-text');
  const img     = document.getElementById('mon-avatar-img');
  if (!circle || !overlay || !text) return;

  const pct  = total === 0 ? 100 : Math.round((loaded / total) * 100);
  const r    = 22;
  const circ = 2 * Math.PI * r;
  circle.style.strokeDashoffset = circ - (pct / 100) * circ;

  if (pct >= 100) {
    circle.style.stroke   = 'var(--mon-green)';
    overlay.style.opacity = '0';
    text.style.display    = 'none';
    if (img) { img.style.animation = 'none'; img.style.transform = 'none'; }
  } else {
    circle.style.stroke   = 'var(--mon-amber)';
    overlay.style.opacity = '0.55';
    text.style.display    = 'flex';
    text.textContent      = `${pct}%`;
    if (img) img.style.animation = 'mon-shake 0.5s ease-in-out infinite alternate';
  }
}
