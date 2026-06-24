/**
 * modules/snapshot.js
 * ─────────────────────────────────────────────────────────────────
 * Snapshot de escalados sincronizado via Supabase entre usuários.
 * Detecta entradas/saídas na escala (bolinhas vermelhas).
 * ─────────────────────────────────────────────────────────────────
 */

import { sbGet, sbSet } from '../services/supabase.js';
import {
  escaladosSnapshot, _snapCarregado, _snapPendentes, operations, apontCache,
  setEscaladosSnapshot, setSnapCarregado,
} from '../state.js';

const SNAP_LEGACY_KEY = '_monEscSnap_v1';

export function snapEnsureLoaded(cb) {
  if (_snapCarregado) { cb?.(); return; }
  snapLoadRemote(cb);
}

export function snapLoadRemote(cb) {
  // Migração de dados legados
  try {
    const old = sessionStorage.getItem(SNAP_LEGACY_KEY);
    if (old) {
      const parsed = JSON.parse(old);
      if (Object.keys(parsed).length > 0) {
        setEscaladosSnapshot(parsed);
        sessionStorage.removeItem(SNAP_LEGACY_KEY);
        snapSaveRemote();
      }
    }
  } catch(e) {}

  sbGet('escaladosSnap', remote => {
    Object.entries(remote).forEach(([opId, val]) => {
      const loc = escaladosSnapshot[opId];
      if (!loc || (val.ts && loc.ts && val.ts > loc.ts)) escaladosSnapshot[opId] = val;
    });

    setSnapCarregado(true);

    _snapPendentes.forEach(({ opId, escalados }) => {
      if (!escaladosSnapshot[opId]) snapSet(opId, escalados);
    });
    _snapPendentes.length = 0;

    cb?.();

    setTimeout(() => {
      operations.forEach(op => {
        const d = apontCache[op.id];
        if (d && d !== 'loading') window._updateSnapDotForOp?.(op);
      });
    }, 0);
  });
}

export function snapSaveRemote(cb) {
  sbSet('escaladosSnap', escaladosSnapshot, cb);
}

export function snapSet(opId, escalados) {
  const anterior  = escaladosSnapshot[opId];
  const hrAnterior = {};
  anterior?.lista?.forEach(e => { if (e.cpf && e.hrEntrou) hrAnterior[e.cpf] = e.hrEntrou; });

  const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const lista = (escalados || []).map(e => ({
    nome: e.nome, cpf: e.cpf, tipo: e.tipo,
    hrEntrou: hrAnterior[e.cpf] || agora,
  }));

  escaladosSnapshot[opId] = { lista, ts: Date.now() };
  snapSaveRemote();
}

export function snapDiff(opId, escaladosAtuais) {
  const snap = escaladosSnapshot[opId];
  if (!snap?.lista) return null;

  const cpfAnt = new Set(snap.lista.map(e => e.cpf));
  const cpfNow = new Set((escaladosAtuais || []).map(e => e.cpf));
  const saiu   = snap.lista.filter(e => !cpfNow.has(e.cpf));
  const entrou = (escaladosAtuais || []).filter(e => !cpfAnt.has(e.cpf));

  if (saiu.length === 0 && entrou.length === 0) return null;

  const hrSnap = {};
  snap.entradas?.forEach(e => { if (e.cpf && e.hrEntrou) hrSnap[e.cpf] = e.hrEntrou; });

  const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  let persistiu = false;
  entrou.forEach(e => { if (e.cpf && !hrSnap[e.cpf]) { hrSnap[e.cpf] = agora; persistiu = true; } });

  if (persistiu) {
    snap.entradas = Object.entries(hrSnap).map(([cpf, hrEntrou]) => ({ cpf, hrEntrou }));
    snapSaveRemote();
  }

  const entrouComHr = entrou.map(e => ({ ...e, hrEntrou: hrSnap[e.cpf] || agora }));
  if (entrou.length === 0) return { saiu, entrou: entrouComHr, _soSaiu: true };
  return { saiu, entrou: entrouComHr };
}

export async function limparBolinhas() {
  let resetadas = 0;
  operations.forEach(op => {
    const d = apontCache[op.id];
    if (d && d !== 'loading' && d.escalados?.length > 0) { snapSet(op.id, d.escalados); resetadas++; }
    else delete escaladosSnapshot[op.id];
  });

  snapSaveRemote(async () => {
    window._updateSnapDots?.();
    const { renderTable } = await import('../ui/render.js');
    renderTable();
  });

  const msg = resetadas > 0
    ? `Bolinhas limpas em ${resetadas} operação(ões).`
    : 'Nenhuma operação com dados carregados.';
  alert(msg);
}

export function _updateSnapDots() {
  operations.forEach(op => window._updateSnapDotForOp?.(op));
}
