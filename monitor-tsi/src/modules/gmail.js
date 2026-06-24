/**
 * modules/gmail.js
 * ─────────────────────────────────────────────────────────────────
 * Abertura do Gmail com escala pré-preenchida.
 * Usa a API de composição do Gmail via URL (mailto avançado).
 * ─────────────────────────────────────────────────────────────────
 */

import { apontCache, operations, contatos } from '../state.js';
import { getNomeUsuario, getSaudacao, getDataDaOp, formatarHora, formatarHoraAssunto } from '../utils/formatters.js';
import { emailsDaOp } from '../services/jsonbin.js';

/**
 * Abre o Gmail com rascunho de e-mail de escala pré-preenchido.
 * @param {string}      opId
 * @param {HTMLElement} btnEl
 */
export function abrirGmailEscala(opId, btnEl) {
  const d  = apontCache[opId];
  const op = operations.find(o => o.id === opId);
  if (!op) return;

  const atualizada  = d && d !== 'loading' && d.listaEnviada === true;
  const data        = getDataDaOp(op);
  const horaExib    = formatarHora(op.hora);
  const horaAssunto = formatarHoraAssunto(op.hora);
  const nome        = getNomeUsuario();
  const saudacao    = getSaudacao();

  const emails = emailsDaOp(op, contatos);
  if (emails.length === 0) {
    _feedback(btnEl, '⚠ Sem destinatários', 'var(--mon-amber)', 'var(--mon-amber-border)', 3500);
    return;
  }

  const assinatura = `\n\nAtenciosamente,\n${nome ? nome + '\n' : ''}Assistente de Planejamento | TSI`;

  const assunto = atualizada
    ? `TSI - ESCALA ATUALIZADA | ${data} | ${horaAssunto}`
    : `TSI - ESCALA | ${data} | ${horaAssunto}`;

  const corpo = atualizada
    ? `${saudacao},\n\nEncaminho a versão atualizada da escala TSI referente ao dia ${data}, turno das ${horaExib}. Pedimos que desconsiderem a versão anterior.\n\nQualquer dúvida, estou à disposição.${assinatura}`
    : `${saudacao},\n\nEncaminho a escala TSI referente ao dia ${data}, turno das ${horaExib}, para conhecimento e organização das atividades.\n\nSolicito a conferência das informações. Qualquer dúvida, estou à disposição.${assinatura}`;

  const url = 'https://mail.google.com/mail/?view=cm&fs=1'
    + `&to=${encodeURIComponent(emails.join(','))}`
    + `&su=${encodeURIComponent(assunto)}`
    + `&body=${encodeURIComponent(corpo)}`;

  window.open(url, '_blank');
  _feedback(btnEl, '✅ Gmail aberto!', 'var(--mon-green)', '', 3000);
}

function _feedback(btnEl, msg, color, borderColor, duration) {
  const orig = btnEl.innerHTML;
  btnEl.innerHTML = msg;
  btnEl.style.color = color;
  if (borderColor) btnEl.style.borderColor = borderColor;
  setTimeout(() => {
    btnEl.innerHTML = orig;
    btnEl.style.color = '';
    if (borderColor) btnEl.style.borderColor = '';
  }, duration);
}

// Expõe globalmente
window._monAbrirGmailEscala = abrirGmailEscala;
