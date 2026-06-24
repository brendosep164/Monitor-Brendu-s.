/**
 * config.js
 * ─────────────────────────────────────────────────────────────────
 * Todas as constantes globais e credenciais em um único lugar.
 *
 * POR QUE ISSO É IMPORTANTE:
 * Antes, as credenciais estavam espalhadas em ~5 lugares diferentes
 * no arquivo. Se a chave do Supabase mudar, você alterava aqui e
 * pronto — sem precisar vasculhar 12 mil linhas.
 *
 * SEGURANÇA: Mesmo aqui, as chaves ficam visíveis no código-fonte
 * do GitHub. O ideal futuro seria usar um proxy próprio para não
 * expor a chave pública do Supabase.
 * ─────────────────────────────────────────────────────────────────
 */

// ── UI ────────────────────────────────────────────────────────────
export const AVATAR_URL = 'https://i.imgur.com/9HPkbTi.png';

// ── IFRAMES ───────────────────────────────────────────────────────
export const BG_IFRAME_IDS = ['_mon_ifr_A', '_mon_ifr_B', '_mon_ifr_C', '_mon_ifr_D'];
export const IFR_PAG2      = '_mon_pag2';
export const IFR_ESCALA    = '_mon_escala';

// ── SUPABASE ──────────────────────────────────────────────────────
export const SUPABASE_URL = 'https://kbacscpaeloghoqodize.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_IQaYA2yhfpu3N19jDbEQ6Q_P0tYMvFZ';

// ── JSONBIN ───────────────────────────────────────────────────────
export const JSONBIN_ID  = '69dd9cfa36566621a8ae40e1';
export const JSONBIN_KEY = '$2a$10$re7SEj86dL3mQnxKBMLFvu7f566NmQucI1RwyW5t9tfYCrCQUExt.';
export const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

// ── STORAGE KEYS ──────────────────────────────────────────────────
const _hoje = new Date().toISOString().slice(0, 10);
export const STORAGE_KEYS = {
  NOTIF_APT:       `_monNotificadas_${_hoje}`,
  NOTIF_ESC:       `_monNotifEscala_${_hoje}`,
  NOTIF_ESC_CHANGE: '_monNotifEscChange_sess',
  NOTIF_HIST:      '_monNotifHistorico',
  HIST_REP:        'mon_report_hist',
  CACHE:           '_monCache',
  THEME:           '_monTheme',
  LAYOUT_MODE:     '_monLayoutMode',
  OBS_VISTAS:      '_monObsVistas',
  OBS_TS:          `_monObsTs_${_hoje}`,
};

// ── FETCH ─────────────────────────────────────────────────────────
export const MAX_CONCURRENT_FETCHES = 10;

// ── HOJE ──────────────────────────────────────────────────────────
export const HOJE = _hoje;
