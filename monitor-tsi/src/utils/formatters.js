/**
 * utils/formatters.js
 * ─────────────────────────────────────────────────────────────────
 * Funções utilitárias de formatação de datas, horas e textos.
 *
 * Todas são funções puras — sem efeitos colaterais, fáceis de testar.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Retorna o primeiro nome do usuário logado no TSI App.
 * Lê diretamente do DOM da página.
 * @returns {string}
 */
export function getNomeUsuario() {
  try {
    const el = document.querySelector('.headertop-nomeappsub');
    if (!el) return '';
    const nomeCompleto = el.textContent.trim();
    const primeiro = nomeCompleto.split(' ')[0] || '';
    return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
  } catch (e) { return ''; }
}

/**
 * Retorna saudação baseada no horário atual.
 * @returns {'Bom dia'|'Boa tarde'|'Boa noite'}
 */
export function getSaudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

/**
 * Retorna a data de hoje formatada como DD/MM/YYYY.
 * @returns {string}
 */
export function getDataHoje() {
  const d  = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/**
 * Extrai a data da chave da operação.
 * Ex: "SRRDHL17052026xxxx" → "17/05/2026"
 * Fallback para data de hoje se a chave não tiver data válida.
 * @param {Object} op - Objeto de operação
 * @returns {string}
 */
export function getDataDaOp(op) {
  if (op?.chave) {
    const m = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
    if (m) return `${m[1]}/${m[2]}/${m[3]}`;
  }
  return getDataHoje();
}

/**
 * Formata hora para exibição legível.
 * Ex: "08:00" → "8h" | "14:30" → "14h30"
 * @param {string} hora
 * @returns {string}
 */
export function formatarHora(hora) {
  if (!hora) return '';
  return hora.replace(':', 'h').replace(/h00$/, 'h');
}

/**
 * Formata hora para uso em assunto de e-mail.
 * Ex: "08:00" → "08H00"
 * @param {string} hora
 * @returns {string}
 */
export function formatarHoraAssunto(hora) {
  if (!hora) return '';
  return hora.replace(':', 'H');
}

/**
 * Converte string de hora "HH:MM" para minutos desde meia-noite.
 * @param {string} str
 * @returns {number}
 */
export function horaParaMinutos(str) {
  if (!str) return 0;
  const [h, m] = str.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Converte carga horária "XDyH" para minutos.
 * Ex: "1D8H" → 480 | "0D4H" → 240
 * @param {string} carga
 * @returns {number}
 */
export function cargaParaMinutos(carga) {
  if (!carga) return 0;
  const mD = carga.match(/(\d+)D/i);
  const mH = carga.match(/(\d+)H/i);
  return ((mD ? parseInt(mD[1]) : 0) * 24 + (mH ? parseInt(mH[1]) : 0)) * 60;
}

/**
 * Pad numérico com zeros à esquerda.
 * @param {number} n
 * @param {number} [len=2]
 * @returns {string}
 */
export function pad(n, len = 2) {
  return String(n).padStart(len, '0');
}
