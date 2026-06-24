/**
 * modules/report.js
 * ─────────────────────────────────────────────────────────────────
 * Lógica de envio de report de apontamentos.
 *
 * Funciona de forma similar ao envio de escala, mas:
 * - Marca P1–P11 (escala marca só P1–P8)
 * - Preenche o campo de quantidade do P10 com o total apontado
 * - Após salvar: registra no histórico e registra faltas
 * ─────────────────────────────────────────────────────────────────
 */

import { IFR_ESCALA } from '../config.js';
import { apontCache, operations } from '../state.js';
import { salvarEntradaHistorico } from './historico.js';
import { registrarFaltas } from './faltas.js';

const SESSION_KEYS = {
  REOPEN_OP:    '_monReopenOp',
  REOPEN_PANEL: '_monReopenPanel',
};

// Seletores candidatos para o campo de quantidade do P10
const P10_QUANT_SELECTORS = [
  'input[name="p10_qtd"]',
  'input[name="p10_quantidade"]',
  'input[name="p10_quant"]',
  'input[name="p10_valor"]',
];

/**
 * Envia o report de uma operação via iframe.
 * Marca P1–P11 como "Sim", preenche quantidade de apontados e salva.
 *
 * @param {string}      opId  - ID da operação
 * @param {HTMLElement} btnEl - Botão que disparou a ação
 */
export function enviarReport(opId, btnEl) {
  const ifr = document.getElementById(IFR_ESCALA);
  if (!ifr || !opId) return;

  const d = apontCache[opId];
  const qtdApontados = (d && d !== 'loading' && d.apontado != null) ? d.apontado : 0;

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

      // Marca P1 a P11 como "Sim"
      let marcados = 0;
      for (let i = 1; i <= 11; i++) {
        const radio = doc.querySelector(`input[name="p${i}_confirm"][value="S"]`);
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          radio.dispatchEvent(new Event('click',  { bubbles: true }));
          marcados++;
        }
      }

      if (marcados === 0) { fail('radios não encontrados'); clearTimeout(safetyTimer); return; }

      // Preenche quantidade de apontados no P10
      _preencherP10(doc, qtdApontados);

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

          _posEnvioReport(opId);
        }, 500);
      }, 50);
    } catch (e) { fail('erro'); clearTimeout(safetyTimer); }
  };
}

/**
 * Preenche o campo de quantidade de apontados no P10.
 * Tenta múltiplos seletores, com fallback para busca por posição no DOM.
 */
function _preencherP10(doc, qtd) {
  let input = null;
  for (const sel of P10_QUANT_SELECTORS) {
    input = doc.querySelector(sel);
    if (input) break;
  }

  // Fallback: procura input na mesma linha do radio do P10
  if (!input) {
    const p10Radio = doc.querySelector('input[name="p10_confirm"]');
    if (p10Radio) {
      const row = p10Radio.closest('tr') || p10Radio.closest('div');
      if (row) input = row.querySelector('input[type="text"], input[type="number"]');
    }
  }

  if (input) {
    input.value = qtd;
    input.dispatchEvent(new Event('input',  { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Ações pós-envio de report:
 * 1. Salva no histórico de reports
 * 2. Registra faltas (se houver)
 * 3. Recarrega a página
 */
function _posEnvioReport(opId) {
  salvarEntradaHistorico(opId);

  const op = operations.find(o => o.id === opId);
  const d  = apontCache[opId];

  const _doReload = () => {
    try { sessionStorage.setItem(SESSION_KEYS.REOPEN_OP, JSON.stringify({ opId, page: window.location.href })); } catch (e) {}
    try { sessionStorage.setItem(SESSION_KEYS.REOPEN_PANEL, '1'); } catch (e) {}
    window.location.reload();
  };

  if (op && d && d !== 'loading') {
    const entregues = (d.colaboradores || []).filter(c => c.dist === 0 || c.dist <= 1);
    const faltas    = Math.max(0, op.qtd - entregues.length);

    if (faltas > 0) {
      registrarFaltas(op, entregues.length, _doReload);
      return;
    }
  }

  setTimeout(_doReload, 1500);
}

// Expõe globalmente para chamadas via onclick no HTML inline
window._monEnviarReport = enviarReport;
