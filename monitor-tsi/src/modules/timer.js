/**
 * modules/timer.js
 * ─────────────────────────────────────────────────────────────────
 * Gerencia o polling automático alinhado ao minuto fechado.
 * ─────────────────────────────────────────────────────────────────
 */

import { refreshTimer, _alignTimeout, setRefreshTimer, setAlignTimeout } from '../state.js';

let _countdownTimer = null;

export function scheduleAlignedRefresh() {
  if (refreshTimer)  clearInterval(refreshTimer);
  if (_alignTimeout) clearTimeout(_alignTimeout);
  setRefreshTimer(null);
  setAlignTimeout(null);

  const agora           = new Date();
  const msAteProxMinuto = (60 - agora.getSeconds()) * 1000 - agora.getMilliseconds();

  const timeout = setTimeout(async () => {
    setAlignTimeout(null);
    await silentRefresh();
    startCountdown();

    const interval = setInterval(async () => {
      await silentRefresh();
      startCountdown();
    }, 60 * 1000);
    setRefreshTimer(interval);
  }, msAteProxMinuto);

  setAlignTimeout(timeout);
  startCountdown(Math.round(msAteProxMinuto / 1000));
}

async function silentRefresh() {
  const [{ fetchOperations }, { obsLoad }, { snapLoadRemote, _updateSnapDots }, { renderTable }] = await Promise.all([
    import('./fetchOperations.js'),
    import('./obs.js'),
    import('./snapshot.js'),
    import('../ui/render.js'),
  ]);
  fetchOperations();
  obsLoad(() => renderTable());
  snapLoadRemote(() => setTimeout(_updateSnapDots, 500));
}

export function startCountdown(segundos = 60) {
  if (_countdownTimer) clearInterval(_countdownTimer);
  let remaining = segundos;
  _atualizarAmpulheta(remaining, segundos);
  _countdownTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) { clearInterval(_countdownTimer); _countdownTimer = null; }
    _atualizarAmpulheta(remaining, segundos);
  }, 1000);
}

function _atualizarAmpulheta(remaining, total) {
  const el = document.getElementById('mon-hg-count');
  if (el) el.textContent = `${remaining}s`;
}
