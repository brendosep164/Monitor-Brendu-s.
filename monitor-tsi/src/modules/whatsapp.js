/**
 * modules/whatsapp.js
 * ─────────────────────────────────────────────────────────────────
 * Geração de mensagens para WhatsApp.
 *
 * Tipos de mensagem:
 * - Report de apontamentos (gerarRelatorio)
 * - Escala para o time (gerarMsgEscala)
 * - Mensagem direta para o líder (wppLider)
 * ─────────────────────────────────────────────────────────────────
 */

import { JSONBIN_URL, JSONBIN_KEY } from '../config.js';
import { apontCache, operations } from '../state.js';
import { toast } from '../ui/toast.js';
import { getSaudacao, getDataDaOp, formatarHora, pad } from '../utils/formatters.js';

// ── RELATÓRIO DE APONTAMENTOS ─────────────────────────────────────

/**
 * Gera e copia o relatório de apontamentos para o clipboard.
 * @param {string}      opId
 * @param {HTMLElement} btnEl
 */
export function gerarRelatorio(opId, btnEl) {
  const d  = apontCache[opId];
  const op = operations.find(o => o.id === opId);
  if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
  if (!op) return;

  const entregues = (d.colaboradores || []).filter(c => c.dist === 0 || c.dist <= 1);
  const lideres   = (d.lideres?.length > 0)
    ? d.lideres
    : (op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : ['—']));

  const data     = getDataDaOp(op);
  const [dia, mes, ano] = data.split('/');
  const unidade  = op.sigla || op.site || '—';
  const titulo   = d.todosConfirmados ? '*REPORT ATUALIZADO*' : '*REPORT*';

  const texto = [
    titulo, '',
    `*CHAVE:* ${op.chave}`,
    `*UNIDADE:* ${unidade}`, '',
    `*DATA:* ${dia}/${mes}/${ano}`,
    `*HORÁRIO:* ${op.hora || '—'}`, '',
    `*SOLICITADO:* ${pad(op.qtd)}`,
    `*ENTREGUE:* ${pad(entregues.length)}`, '',
    `*LÍDER:* ${lideres.join(' / ')}`,
  ].join('\n');

  copiarTexto(texto, btnEl, '✅ Report copiado!');
}

// ── MENSAGEM DE ESCALA ────────────────────────────────────────────

/**
 * Gera e copia a mensagem de escala para o time.
 * @param {string}      opId
 * @param {HTMLElement} btnEl
 */
export function gerarMsgEscala(opId, btnEl) {
  const d  = apontCache[opId];
  const op = operations.find(o => o.id === opId);
  if (!op) return;

  const atualizada = d && d !== 'loading' && d.listaEnviada === true;
  const data       = getDataDaOp(op);
  const hora       = formatarHora(op.hora);
  const saudacao   = getSaudacao();

  const texto = atualizada
    ? `${saudacao}, time. Segue a escala TSI *atualizada* de *${data}* às *${hora}*.`
    : `${saudacao}, time. Segue a escala TSI de *${data}* às *${hora}*.`;

  copiarTexto(texto, btnEl, null);
}

// ── MENSAGEM PARA O LÍDER ─────────────────────────────────────────

// Dados fixos de líderes conhecidos (fallback offline)
const WPP_LID_DADOS = [
  // { nome: 'Nome Líder', tel: '5511999999999' }
  // Preenchido via JSONBin dinamicamente
];

const _wppOpMap   = {};
const _wppNomeTel = {};

/**
 * Carrega os líderes cadastrados no JSONBin.
 */
export async function carregarLideres() {
  try {
    const r    = await fetch(`${JSONBIN_URL}/latest`, { headers: { 'X-Master-Key': JSONBIN_KEY } });
    const json = await r.json();
    const lid  = json.record?.lideres || json.record?.contatos?.lideres || [];
    lid.forEach(l => { if (l.nome && l.tel) _wppNomeTel[_wppNorm(l.nome)] = l.tel; });
  } catch (e) {}
}

/**
 * Abre WhatsApp para o líder da operação.
 * @param {string}      opId
 * @param {HTMLElement} btnEl
 */
export function enviarParaLider(opId, btnEl) {
  const op = operations.find(o => o.id === opId);
  if (!op) return;

  const nomeLider = op.liderCompleto || op.lider || '';
  const tel       = _wppBuscarTel(nomeLider);

  if (!tel) {
    _wppModalPedirNumero(opId, nomeLider);
    return;
  }

  const texto = _wppGerarMensagem(op);
  const url   = `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// ── UTILITÁRIOS PRIVADOS ──────────────────────────────────────────

function copiarTexto(texto, btnEl, toastMsg) {
  navigator.clipboard.writeText(texto)
    .then(() => {
      if (btnEl) {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copiado!';
        btnEl.style.color = 'var(--mon-green)';
        setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; }, 2500);
      }
      if (toastMsg) toast(toastMsg, 'success');
    })
    .catch(() => prompt('Copie o texto:', texto));
}

function _wppNorm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function _wppBuscarTel(nomeLider) {
  const norm = _wppNorm(nomeLider);
  // Busca exata
  if (_wppNomeTel[norm]) return _wppNomeTel[norm];
  // Busca parcial
  const key = Object.keys(_wppNomeTel).find(k => norm.includes(k) || k.includes(norm));
  return key ? _wppNomeTel[key] : null;
}

function _wppGerarMensagem(op) {
  const saudacao = getSaudacao();
  const data     = getDataDaOp(op);
  const hora     = formatarHora(op.hora);
  const nome     = _nomeProprio(op.liderCompleto || op.lider || '');
  return `${saudacao}, ${nome}! Tudo bem? Segue a escala TSI de *${data}* às *${hora}*. 📋`;
}

function _nomeProprio(s) {
  return (s || '').split(' ')[0]
    .charAt(0).toUpperCase() + s.split(' ')[0].slice(1).toLowerCase();
}

function _wppModalPedirNumero(opId, nomeLider) {
  const tel = prompt(`Número do WhatsApp de ${nomeLider} (com DDD, sem espaços):`);
  if (!tel) return;
  _wppNomeTel[_wppNorm(nomeLider)] = tel.replace(/\D/g, '');
  enviarParaLider(opId, null);
}

// Expõe globalmente
window._monGerarRelatorio  = gerarRelatorio;
window._monGerarMsgEscala  = gerarMsgEscala;
window._monEnviarParaLider = enviarParaLider;
