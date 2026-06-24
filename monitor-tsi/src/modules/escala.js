/**
 * modules/escala.js
 * ─────────────────────────────────────────────────────────────────
 * Lógica de envio de escala via iframe do TSI App.
 *
 * O envio de escala funciona carregando a página de edição da op
 * em um iframe oculto, marcando os radios P1–P8 como "Sim" e
 * clicando no botão de salvar — tudo programaticamente.
 * ─────────────────────────────────────────────────────────────────
 */

import { IFR_ESCALA } from '../config.js';
import { apontCache, escaladosSnapshot } from '../state.js';
import { snapSaveRemote } from './snapshot.js';

const SESSION_KEYS = {
  REOPEN_OP:    '_monReopenOp',
  REOPEN_PANEL: '_monReopenPanel',
};

/**
 * Envia a escala de uma operação via iframe.
 * Marca P1–P8 como "Sim" e salva o formulário.
 *
 * @param {string}      opId  - ID da operação
 * @param {HTMLElement} btnEl - Botão que disparou a ação (para feedback visual)
 */
export function enviarEscala(opId, btnEl) {
  const ifr = document.getElementById(IFR_ESCALA);
  if (!ifr || !opId) return;

  const origTxt = btnEl.innerHTML;
  btnEl.disabled  = true;
  btnEl.innerHTML = 'Enviando…';
  btnEl.style.opacity = '0.6';

  let done = false;

  const fail = (msg) => {
    if (done) return;
    done = true;
    btnEl.disabled  = false;
    btnEl.innerHTML = `✗ ${msg}`;
    btnEl.classList.add('mon-send-btn--err');
    btnEl.style.opacity = '1';
    setTimeout(() => {
      btnEl.innerHTML = origTxt;
      btnEl.classList.remove('mon-send-btn--err');
    }, 3000);
  };

  const safetyTimer = setTimeout(() => fail('timeout'), 25000);

  ifr.onload = null;
  ifr.src = `https://tsi-app.com/planejamento-operacional-edit${opId}_1`;

  ifr.onload = function () {
    if (done) return;
    try {
      const doc = ifr.contentDocument;
      if (!doc?.body) { fail('modal vazio'); clearTimeout(safetyTimer); return; }

      // Marca P1 a P8 como "Sim"
      let marcados = 0;
      for (let i = 1; i <= 8; i++) {
        const radio = doc.querySelector(`input[name="p${i}_confirm"][value="S"]`);
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          radio.dispatchEvent(new Event('click',  { bubbles: true }));
          marcados++;
        }
      }

      if (marcados === 0) { fail('radios não encontrados'); clearTimeout(safetyTimer); return; }

      setTimeout(() => {
        if (done) return;
        const saveBtn = doc.querySelector('button[name="submitF"]');
        if (!saveBtn) { fail('btn salvar não encontrado'); clearTimeout(safetyTimer); return; }

        saveBtn.click();

        setTimeout(() => {
          if (done) return;
          done = true;
          clearTimeout(safetyTimer);
          btnEl.innerHTML = '✓ Enviado!';
          btnEl.style.opacity = '1';

          _posEnvioEscala(opId);
        }, 500);
      }, 50);
    } catch (e) { fail('erro'); clearTimeout(safetyTimer); }
  };
}

/**
 * Ações pós-envio de escala:
 * 1. Atualiza o snapshot local com os escalados atuais
 * 2. Salva no Supabase
 * 3. Recarrega a página (aguardando o save terminar)
 */
function _posEnvioEscala(opId) {
  const _dSnap = apontCache[opId];

  const _doReload = () => {
    try { sessionStorage.setItem(SESSION_KEYS.REOPEN_OP, JSON.stringify({ opId, page: window.location.href })); } catch (e) {}
    try { sessionStorage.setItem(SESSION_KEYS.REOPEN_PANEL, '1'); } catch (e) {}
    window.location.reload();
  };

  if (_dSnap && _dSnap !== 'loading' && _dSnap.escalados) {
    const lista = (_dSnap.escalados || []).map(e => ({ nome: e.nome, cpf: e.cpf, tipo: e.tipo }));
    escaladosSnapshot[opId] = { lista, ts: Date.now() };

    let reloaded = false;
    const safeReload = () => { if (!reloaded) { reloaded = true; _doReload(); } };
    setTimeout(safeReload, 4000); // failsafe
    snapSaveRemote(safeReload);
  } else {
    setTimeout(_doReload, 1500);
  }
}

// Expõe globalmente para chamadas via onclick no HTML inline
window._monEnviarEscala = enviarEscala;
