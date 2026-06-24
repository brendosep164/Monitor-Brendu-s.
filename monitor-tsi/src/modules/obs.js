/**
 * modules/obs.js
 * ─────────────────────────────────────────────────────────────────
 * Observações por operação — balão de comentário no monitor.
 * ─────────────────────────────────────────────────────────────────
 */

import { STORAGE_KEYS } from '../config.js';
import { sbGet, sbSet } from '../services/supabase.js';
import { operations, apontCache } from '../state.js';
import { getNomeUsuario } from '../utils/formatters.js';
import { toast } from '../ui/toast.js';

let _obsCarregouPelaVez = false;
let _obsCurrentOpId     = null;
let _obsPopover         = null;
const _monObsVistas     = _obsVistasLoad();
const _obsTs            = _obsTsLoad();

window._monObsCache = {};

function _obsVistasLoad() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.OBS_VISTAS) || '[]')); }
  catch(e) { return new Set(); }
}
function _obsVistasSave() {
  try { localStorage.setItem(STORAGE_KEYS.OBS_VISTAS, JSON.stringify([..._monObsVistas])); } catch(e) {}
}
function _obsTsLoad() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.OBS_TS) || '{}'); }
  catch(e) { return {}; }
}
function _obsTsSave(ts) {
  try { localStorage.setItem(STORAGE_KEYS.OBS_TS, JSON.stringify(ts)); } catch(e) {}
}
function _obsTsMarcar(opId, data) { _obsTs[opId] = data || ''; _obsTsSave(_obsTs); }

export function obsLoad(cb) {
  sbGet('obs', data => {
    const novo      = data || {};
    const novidades = [];

    if (_obsCarregouPelaVez) {
      Object.entries(novo).forEach(([opId, obsNova]) => {
        if (!obsNova?.texto) return;
        const tsConhecido = _obsTs[opId];
        const tsNova      = obsNova.data || '';
        const eNova       = !tsConhecido || tsNova !== tsConhecido;
        const euMesmo     = obsNova.autor && obsNova.autor === getNomeUsuario();
        if (eNova && !euMesmo) { _monObsVistas.delete(opId); _obsVistasSave(); novidades.push({ opId, obs: obsNova }); }
      });
    } else {
      Object.entries(novo).forEach(([opId, obsNova]) => {
        if (obsNova?.texto && obsNova.data) _obsTs[opId] = obsNova.data;
      });
      _obsTsSave(_obsTs);
      _obsCarregouPelaVez = true;
    }

    window._monObsCache = novo;

    if (novidades.length > 0) {
      novidades.forEach(({ opId, obs }) => _obsTsMarcar(opId, obs.data || ''));
      const op    = operations.find(o => o.id === novidades[0].opId);
      const chave = op ? (op.sigla || op.chave) : novidades[0].opId;
      const autor = novidades[0].obs.autor || 'Alguém';
      const extra = novidades.length > 1 ? ` (+${novidades.length - 1} mais)` : '';
      toast(`${autor} comentou em ${chave}${extra}`, 'obs');
    }

    cb?.(novo);
  });
}

export const _obsLoad = obsLoad;

function _obsSave(obs, cb) {
  window._monObsCache = obs;
  sbSet('obs', obs, cb);
}

export function abrirObs(opId, btnEl) {
  _obsEnsurePopover();
  _obsCurrentOpId = opId;

  _monObsVistas.add(opId);
  _obsVistasSave();
  const _obsVista = window._monObsCache?.[opId];
  if (_obsVista?.data) _obsTsMarcar(opId, _obsVista.data);

  const wrap = btnEl.closest('.mon-obs-wrap');
  if (wrap) wrap.querySelector('.mon-obs-badge')?.remove();

  const rect = btnEl.getBoundingClientRect();
  _obsPopover.style.top  = `${rect.bottom + 6}px`;
  _obsPopover.style.left = `${Math.min(rect.left, window.innerWidth - 296)}px`;

  const d         = apontCache[opId];
  const reportEnv = d && d.todosConfirmados;
  const obsData   = window._monObsCache?.[opId] || { texto: '', log: [] };
  const textarea  = document.getElementById('mon-obs-text');
  const meta      = document.getElementById('mon-obs-meta');

  if (reportEnv) {
    textarea.value = ''; textarea.placeholder = 'Obs oculta — report já enviado.';
    textarea.disabled = true; meta.textContent = '';
  } else {
    textarea.value = obsData.texto || ''; textarea.disabled = false;
    textarea.placeholder = 'Digite uma observação...';
    meta.textContent = obsData.autor && obsData.data ? `Editado por ${obsData.autor} às ${obsData.data}` : '';
  }

  const histEl = document.getElementById('mon-obs-hist');
  if (histEl) {
    const log = obsData.log || [];
    histEl.innerHTML = log.length === 0
      ? '<div class="mon-obs-hist-item">Nenhum histórico ainda.</div>'
      : [...log].reverse().map(e => `<div class="mon-obs-hist-item"><strong>${e.autor}</strong> · ${e.data}<br>${e.texto}</div>`).join('');
  }

  _obsPopover.classList.add('open');
  if (!reportEnv) textarea.focus();
}

export function fecharObs() {
  _obsPopover?.classList.remove('open');
  _obsCurrentOpId = null;
}

export async function salvarObs() {
  if (!_obsCurrentOpId) return;
  const textarea = document.getElementById('mon-obs-text');
  const texto    = (textarea.value || '').trim();
  const nome     = getNomeUsuario() || 'Anônimo';
  const agora    = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const obs      = window._monObsCache || {};
  const anterior = obs[_obsCurrentOpId] || { texto: '', log: [] };
  const log      = [...(anterior.log || [])];

  if (texto !== anterior.texto && anterior.texto) {
    log.push({ texto: anterior.texto, autor: anterior.autor || '?', data: anterior.data || '?' });
    if (log.length > 20) log.shift();
  }

  obs[_obsCurrentOpId] = { texto, autor: nome, data: agora, log };

  const saveBtn = _obsPopover.querySelector('.mon-obs-save');
  saveBtn.textContent = 'Salvando…'; saveBtn.disabled = true;

  _obsSave(obs, async () => {
    saveBtn.textContent = 'Salvo ✓';
    setTimeout(() => { saveBtn.textContent = 'Salvar'; saveBtn.disabled = false; }, 1500);

    const meta = document.getElementById('mon-obs-meta');
    if (meta) meta.textContent = texto ? `Editado por ${nome} às ${agora}` : '';

    document.querySelectorAll('.mon-obs-btn').forEach(b => {
      if (b.getAttribute('onclick')?.includes(`'${_obsCurrentOpId}'`)) {
        b.classList.toggle('has-obs', !!texto);
      }
    });

    const { renderTable } = await import('../ui/render.js');
    renderTable();
  });
}

function _obsEnsurePopover() {
  if (_obsPopover) return;
  _obsPopover = document.createElement('div');
  _obsPopover.id        = 'mon-obs-popover';
  _obsPopover.className = 'mon-obs-popover';
  _obsPopover.innerHTML = `
    <div class="mon-obs-header">
      <span>💬 Observação</span>
      <button class="mon-obs-hist-btn" onclick="window._monToggleObsHist()">📋 Histórico</button>
      <button class="mon-obs-close" onclick="window._monFecharObs()">✕</button>
    </div>
    <div id="mon-obs-hist" class="mon-obs-hist"></div>
    <textarea id="mon-obs-text" rows="4" maxlength="500" placeholder="Digite uma observação..."></textarea>
    <div id="mon-obs-meta" class="mon-obs-meta"></div>
    <div class="mon-obs-footer">
      <button class="mon-obs-save" onclick="window._monSalvarObs()">Salvar</button>
    </div>
  `;
  document.body.appendChild(_obsPopover);
  document.addEventListener('mousedown', e => {
    if (_obsPopover.classList.contains('open') && !_obsPopover.contains(e.target)) fecharObs();
  });
}

window._monAbrirObs      = abrirObs;
window._monFecharObs     = fecharObs;
window._monSalvarObs     = salvarObs;
window._monToggleObsHist = () => document.getElementById('mon-obs-hist')?.classList.toggle('open');
