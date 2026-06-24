/**
 * state.js
 * ─────────────────────────────────────────────────────────────────
 * Estado global centralizado do monitor.
 *
 * Todas as variáveis mutáveis ficam aqui. Quando precisar saber
 * "quem muda apontCache?", basta buscar quem importa este módulo.
 * ─────────────────────────────────────────────────────────────────
 */

import { STORAGE_KEYS } from './config.js';

// ── OPERAÇÕES ─────────────────────────────────────────────────────
export let operations    = [];
export let apontCache    = {};
export let monitoradas   = new Set();
export let expanded      = new Set();

// ── FILA DE FETCH ─────────────────────────────────────────────────
export let fetchQueue    = [];
export let inQueue       = new Set();
export let iframesInUse  = {};
export let activeFetches = 0;

// ── FILTRO / SORT ─────────────────────────────────────────────────
export let filterText = '';
export let sortCol    = null;
export let sortDir    = 1;
export const collapsedBuckets = new Set();

// ── NOTIFICAÇÕES ──────────────────────────────────────────────────
// Carregadas diretamente do localStorage para evitar dependência circular
export let notificadas = _loadSet(STORAGE_KEYS.NOTIF_APT, localStorage);
export let notifEscala = _loadSet(STORAGE_KEYS.NOTIF_ESC, localStorage);
export let notifEscChange = _loadSet(STORAGE_KEYS.NOTIF_ESC_CHANGE, sessionStorage);

// ── SNAPSHOT DE ESCALADOS ─────────────────────────────────────────
export let escaladosSnapshot = {};
export let _snapCarregado    = false;
export let _snapPendentes    = [];

// ── CONTATOS ──────────────────────────────────────────────────────
export let contatos = null;

// ── TIMERS ────────────────────────────────────────────────────────
export let refreshTimer  = null;
export let _alignTimeout = null;

// ── LAYOUT ────────────────────────────────────────────────────────
export let layoutMode = (() => {
  try { return localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'normal'; } catch(e) { return 'normal'; }
})();

// ── SETTERS ───────────────────────────────────────────────────────
export function setOperations(ops)        { operations = ops; }
export function setApontCache(id, dados)  { apontCache[id] = dados; }
export function setActiveFetches(n)       { activeFetches = n; }
export function setIframesInUse(obj)      { iframesInUse = obj; }
export function setFetchQueue(arr)        { fetchQueue = arr; }
export function setInQueue(set)           { inQueue = set; }
export function setFilterText(t)          { filterText = t; }
export function setSortCol(c)             { sortCol = c; }
export function setSortDir(d)             { sortDir = d; }
export function setSnapCarregado(v)       { _snapCarregado = v; }
export function setContatos(c)            { contatos = c; }
export function setRefreshTimer(t)        { refreshTimer = t; }
export function setAlignTimeout(t)        { _alignTimeout = t; }
export function setLayoutMode(m)          { layoutMode = m; }
export function setEscaladosSnapshot(obj) { escaladosSnapshot = obj; }

// ── HELPER PRIVADO ────────────────────────────────────────────────
function _loadSet(key, storage) {
  try { return new Set(JSON.parse(storage.getItem(key) || '[]').map(String)); }
  catch(e) { return new Set(); }
}
