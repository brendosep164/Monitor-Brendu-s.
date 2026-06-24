/**
 * services/jsonbin.js
 * ─────────────────────────────────────────────────────────────────
 * Toda comunicação com o JSONBin em um único lugar.
 *
 * O JSONBin é usado para armazenar dados compartilhados entre
 * usuários: contatos/e-mails por unidade e dados de líderes WPP.
 *
 * POR QUE ISSO É IMPORTANTE:
 * Antes, a URL e a chave do JSONBin apareciam em 3 lugares
 * diferentes com nomes diferentes (_MON_BIN_KEY, _WPP_BIN_KEY...)
 * mas eram a mesma chave. Agora centralizado aqui.
 * ─────────────────────────────────────────────────────────────────
 */

import { JSONBIN_URL, JSONBIN_KEY } from '../config.js';
import { setContatos } from '../state.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_KEY,
};

/**
 * Lê o registro mais recente do JSONBin.
 * @returns {Promise<Object>} O conteúdo do bin
 */
export function binGet() {
  return fetch(`${JSONBIN_URL}/latest`, { headers: HEADERS })
    .then(r => r.json())
    .then(j => j.record || {})
    .catch(() => ({}));
}

/**
 * Substitui todo o conteúdo do bin.
 * @param {Object} data - Novo conteúdo
 * @returns {Promise<Object>} Resposta do JSONBin
 */
export function binSet(data) {
  return fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  }).then(r => r.json());
}

// ─────────────────────────────────────────────────────────────────
// CONTATOS
// ─────────────────────────────────────────────────────────────────

/**
 * Carrega contatos do JSONBin, com fallback para localStorage.
 * Atualiza o estado global após carregar.
 */
export function carregarContatos() {
  // Carrega cache local imediatamente para resposta instantânea
  try {
    const local = localStorage.getItem('tsi_contatos');
    if (local) setContatos(JSON.parse(local));
  } catch (e) {}

  // Atualiza do servidor em background
  binGet().then(record => {
    if (record.contatos && Object.keys(record.contatos).length > 0) {
      setContatos(record.contatos);
      try {
        localStorage.setItem('tsi_contatos', JSON.stringify(record.contatos));
      } catch (e) {}
    }
  });
}

/**
 * Salva os contatos no JSONBin e atualiza localStorage.
 * @param {Object} novosContatos
 * @returns {Promise<Object>}
 */
export function salvarContatos(novosContatos) {
  return binSet({ contatos: novosContatos }).then(json => {
    if (json.record) {
      setContatos(novosContatos);
      try {
        localStorage.setItem('tsi_contatos', JSON.stringify(novosContatos));
      } catch (e) {}
    }
    return json;
  });
}

/**
 * Retorna lista de e-mails para uma operação, baseado na chave.
 * @param {Object} op        - Objeto de operação
 * @param {Object} contatos  - Mapa de contatos atual
 * @returns {string[]}
 */
export function emailsDaOp(op, contatos) {
  if (!contatos || !op.chave) return [];
  const chaveUp = op.chave.toUpperCase();
  const unidade = Object.keys(contatos).find(k =>
    chaveUp.startsWith(k.toUpperCase())
  );
  if (!unidade) return [];
  const u = contatos[unidade];
  return (u && Array.isArray(u.emails)) ? u.emails : [];
}
