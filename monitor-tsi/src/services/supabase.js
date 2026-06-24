/**
 * services/supabase.js
 * ─────────────────────────────────────────────────────────────────
 * Toda comunicação com o Supabase em um único lugar.
 *
 * POR QUE ISSO É IMPORTANTE:
 * Antes, a URL e a chave do Supabase eram repetidas em vários
 * pontos do código. Se você precisar trocar o projeto Supabase
 * ou o endpoint, muda aqui — e só aqui.
 *
 * USO:
 *   import { sbGet, sbSet } from '../services/supabase.js';
 *   sbGet('minha-chave', (valor) => console.log(valor));
 * ─────────────────────────────────────────────────────────────────
 */

import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

const TIMEOUT_MS = 5000;

/**
 * Lê um valor do Supabase pelo nome da chave.
 * @param {string} chave - Identificador do registro
 * @param {function} cb  - Callback com o valor (ou {} em caso de erro)
 */
export function sbGet(chave, cb) {
  const timeout = setTimeout(() => cb({}), TIMEOUT_MS);

  fetch(`${SUPABASE_URL}/rest/v1/mon_store?chave=eq.${encodeURIComponent(chave)}`, {
    headers: HEADERS,
  })
    .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
    .then(rows => {
      clearTimeout(timeout);
      cb((rows && rows[0]) ? rows[0].valor : {});
    })
    .catch(() => {
      clearTimeout(timeout);
      cb({});
    });
}

/**
 * Salva (ou atualiza) um valor no Supabase.
 * Usa upsert (merge-duplicates) para não criar duplicatas.
 * @param {string}   chave - Identificador do registro
 * @param {any}      valor - Valor a salvar (será serializado como JSON)
 * @param {function} [cb]  - Callback opcional chamado após salvar
 */
export function sbSet(chave, valor, cb) {
  fetch(`${SUPABASE_URL}/rest/v1/mon_store`, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({ chave, valor }),
  })
    .then(() => { if (cb) cb(); })
    .catch(() => { if (cb) cb(); });
}
