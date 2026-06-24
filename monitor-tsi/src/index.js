/**
 * index.js — Ponto de entrada do Monitor Operacional TSI
 * ─────────────────────────────────────────────────────────────────
 * Inicializa o monitor importando todos os módulos na ordem correta.
 * ─────────────────────────────────────────────────────────────────
 */

// ── GUARDS ────────────────────────────────────────────────────────
if (!window.location.href.includes('planejamento-operacional')) {
  throw new Error('Monitor: página incorreta');
}
if (window.self !== window.top) {
  throw new Error('Monitor: rodando em iframe');
}

// ── IMPORTAÇÕES DE MÓDULOS ────────────────────────────────────────
import './ui/toast.js';
import './ui/panel.js';
import './ui/render.js';
import './ui/metricas.js';
import './ui/progress.js';
import './ui/filtros.js';

import './modules/notificacoes.js';
import './modules/snapshot.js';
import './modules/historico.js';
import './modules/operacoes.js';
import './modules/faltas.js';
import './modules/obs.js';
import './modules/escala.js';
import './modules/report.js';
import './modules/whatsapp.js';
import './modules/pdf.js';
import './modules/gmail.js';
import './modules/timer.js';
import './modules/fetchOperations.js';

import { carregarContatos } from './services/jsonbin.js';
import { snapLoadRemote }   from './modules/snapshot.js';
import { cacheLoad }        from './services/fetch.js';
import { setApontCache }    from './state.js';
import { renderPanel }      from './ui/panel.js';
import { fetchOperations, watchPageNavigation } from './modules/fetchOperations.js';
import { scheduleAlignedRefresh } from './modules/timer.js';
import { obsLoad } from './modules/obs.js';
import { carregarHistorico } from './modules/historico.js';
import { renderTable } from './ui/render.js';
import { pedirPermissao } from './modules/notificacoes.js';

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────
setTimeout(() => {
  // 1. Restaura cache da sessão anterior
  const cached = cacheLoad();
  Object.entries(cached).forEach(([id, dados]) => setApontCache(id, dados));

  // 2. Cria o painel na tela
  renderPanel();

  // 3. Carrega dados externos
  carregarContatos();
  carregarHistorico();

  // 4. Carrega snapshot e inicia fetch de operações
  snapLoadRemote(() => {
    obsLoad(() => renderTable());
  });

  // 5. Inicia o monitor
  fetchOperations();
  scheduleAlignedRefresh();
  watchPageNavigation();

  // 6. Pede permissão de notificação se ainda não dada
  if (Notification.permission === 'default') pedirPermissao();

  // 7. Salva estado antes de fechar
  window.addEventListener('beforeunload', () => {
    window._monCacheSave?.();
  });
}, 2000);
