/**
 * modules/notificacoes.js
 * ─────────────────────────────────────────────────────────────────
 * Gerenciamento de notificações do browser e histórico local.
 * ─────────────────────────────────────────────────────────────────
 */

import { AVATAR_URL, STORAGE_KEYS, HOJE } from '../config.js';

// ── LIMPEZA DE CHAVES ANTIGAS ─────────────────────────────────────
(function limparChavesAntigas() {
  try {
    Object.keys(localStorage).forEach(k => {
      if (
        (k.startsWith('_monNotificadas_') && k !== STORAGE_KEYS.NOTIF_APT) ||
        (k.startsWith('_monNotifEscala_') && k !== STORAGE_KEYS.NOTIF_ESC)
      ) localStorage.removeItem(k);
    });
  } catch(e) {}
})();

// ── PERSISTÊNCIA ──────────────────────────────────────────────────

export function notificadasLoad() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIF_APT) || '[]').map(String)); }
  catch(e) { return new Set(); }
}
export function notificadasSave(notificadas) {
  try { localStorage.setItem(STORAGE_KEYS.NOTIF_APT, JSON.stringify([...notificadas])); } catch(e) {}
}

export function notifEscLoad() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIF_ESC) || '[]').map(String)); }
  catch(e) { return new Set(); }
}
export function notifEscSave(notifEscala) {
  try { localStorage.setItem(STORAGE_KEYS.NOTIF_ESC, JSON.stringify([...notifEscala])); } catch(e) {}
}

export function notifEscChangeLoad() {
  try { return new Set(JSON.parse(sessionStorage.getItem(STORAGE_KEYS.NOTIF_ESC_CHANGE) || '[]').map(String)); }
  catch(e) { return new Set(); }
}
export function notifEscChangeSave(notifEscChange) {
  try { sessionStorage.setItem(STORAGE_KEYS.NOTIF_ESC_CHANGE, JSON.stringify([...notifEscChange])); } catch(e) {}
}

// ── HISTÓRICO LOCAL ───────────────────────────────────────────────
const MAX_HIST = 200;

function histLoad() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIF_HIST) || '[]'); }
  catch(e) { return []; }
}
function histSave(arr) {
  try { localStorage.setItem(STORAGE_KEYS.NOTIF_HIST, JSON.stringify(arr)); } catch(e) {}
}

export function histAdd(entry) {
  const arr = histLoad();
  arr.unshift({
    ...entry,
    ts: Date.now(),
    horaStr: new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
  });
  if (arr.length > MAX_HIST) arr.length = MAX_HIST;
  histSave(arr);
  try { window._monAtualizarBadgeNotifHist?.(); } catch(e) {}
}

export function histGetAll() { return histLoad(); }

// ── PERMISSÃO ─────────────────────────────────────────────────────

export function pedirPermissao() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification('🔔 Monitor TSI', { body: 'Notificações já estão ativas!', icon: AVATAR_URL });
    return;
  }
  if (Notification.permission === 'denied') {
    alert('Notificações bloqueadas!\n\n1. Clique no cadeado\n2. Notificações → Permitir\n3. Recarregue');
    return;
  }
  Notification.requestPermission().then(perm => {
    const btn = document.getElementById('mon-notif-btn');
    if (perm === 'granted') {
      new Notification('✅ Monitor TSI ativado!', { body: 'Você receberá alertas.', icon: AVATAR_URL });
      if (btn) { btn.textContent = 'Notif. ativa'; btn.dataset.state = 'on'; }
    } else {
      if (btn) { btn.textContent = 'Bloqueado'; btn.dataset.state = 'off'; }
    }
  });
}

// ── ENVIO DE NOTIFICAÇÕES ─────────────────────────────────────────

export function notifyOpCompleta(op, d) {
  if (!_podeNotificar()) return;
  if ((op.time || '') !== 'VD') return;
  const titulo = '✅ Operação Completa — TSI';
  const corpo  = `${op.sigla} | ${op.site}\n${d.apontado}/${d.solicitado} apontados`;
  histAdd({ tipo: 'op_completa', icone: '✅', titulo, corpo, chave: op.chave || '', sigla: op.sigla || '', site: op.site || '' });
  _dispararNotif(titulo, corpo);
}

export function notifyEscalaCompleta(op, d) {
  if (!_podeNotificar()) return;
  const titulo = '📋 Escala Completa — TSI';
  const corpo  = `${op.sigla} | ${op.site}\n${d.escalado}/${op.qtd} escalados`;
  histAdd({ tipo: 'escala_completa', icone: '📋', titulo, corpo, chave: op.chave || '', sigla: op.sigla || '', site: op.site || '' });
  _dispararNotif(titulo, corpo);
}

export function notifyMudancaEscala(op, entrouList, saiuList) {
  if (!_podeNotificar()) return;
  const local = op.site || op.sigla || op.chave;
  try {
    if (entrouList?.length > 0) {
      const nomes = entrouList.map(e => e.nome || e.cpf).join(', ');
      const corpo = entrouList.length === 1
        ? `${op.chave} · ${local}\n👤 ${nomes} entrou na escala`
        : `${op.chave} · ${local}\n👥 ${entrouList.length} pessoas entraram: ${nomes}`;
      const titulo = '🔴 Mudança na Escala — TSI';
      histAdd({ tipo: 'esc_entrou', icone: '🔴', titulo, corpo, chave: op.chave || '', sigla: op.sigla || '', site: op.site || '' });
      new Notification(titulo, { body: corpo, icon: AVATAR_URL, tag: `esc-entrou-${op.id}` });
    }
    if (saiuList?.length > 0) {
      const nomes = saiuList.map(e => e.nome || e.cpf).join(', ');
      const corpo = saiuList.length === 1
        ? `${op.chave} · ${local}\n❌ ${nomes} saiu da escala`
        : `${op.chave} · ${local}\n❌ ${saiuList.length} pessoas saíram: ${nomes}`;
      const titulo = '⚠️ Saída na Escala — TSI';
      histAdd({ tipo: 'esc_saiu', icone: '⚠️', titulo, corpo, chave: op.chave || '', sigla: op.sigla || '', site: op.site || '' });
      new Notification(titulo, { body: corpo, icon: AVATAR_URL, tag: `esc-saiu-${op.id}` });
    }
  } catch(e) {}
}

function _podeNotificar() {
  return 'Notification' in window && Notification.permission === 'granted';
}
function _dispararNotif(titulo, corpo) {
  try { new Notification(titulo, { body: corpo, icon: AVATAR_URL }); } catch(e) {}
}
