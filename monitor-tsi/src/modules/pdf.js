/**
 * modules/pdf.js
 * ─────────────────────────────────────────────────────────────────
 * Download e merge de PDFs de assinatura de escala.
 *
 * O merge é implementado em JS puro (sem biblioteca) porque o
 * ambiente de userscript não permite importar módulos npm.
 * Funciona apenas para PDFs de estrutura simples/linear gerados
 * pelo TSI App.
 * ─────────────────────────────────────────────────────────────────
 */

import { apontCache, operations } from '../state.js';

// ── DOWNLOAD DE UM PDF ────────────────────────────────────────────

/**
 * Baixa um PDF de assinatura pelo índice.
 * @param {string} opId
 * @param {number} idx - Índice do PDF em d.pdfLinks
 */
export function abrirPdf(opId, idx) {
  const d = apontCache[opId];
  if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
  const l = d.pdfLinks?.[idx];
  if (!l) { alert('Link não encontrado.'); return; }

  const op       = operations.find(o => o.id === opId);
  const chave    = op ? op.chave : opId;
  const prefixo  = d.listaEnviada ? 'ESCALA ATUALIZADA' : 'ESCALA';
  const sufixo   = (d.pdfLinks.length > 1) ? ` [${String(idx + 1).padStart(2, '0')}]` : '';
  const nomeArq  = `${prefixo} - ${chave}${sufixo}.pdf`;

  fetch(`https://tsi-app.com/${l.href}`, { credentials: 'include' })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
    .then(blob => {
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
      _download(url, nomeArq);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    })
    .catch(e => alert(`Erro ao baixar PDF: ${e.message}`));
}

// ── MERGE DE PDFs ─────────────────────────────────────────────────

/**
 * Baixa todos os PDFs de assinatura de uma operação e os mescla em um único arquivo.
 * @param {string}      opId
 * @param {string}      chave  - Chave da operação (para nome do arquivo)
 * @param {HTMLElement} btnEl  - Botão que disparou a ação
 */
export async function mergePdfAssinaturas(opId, chave, btnEl) {
  const d = apontCache[opId];
  if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
  const hrefs = (d.pdfLinks || []).map(l => l.href);
  if (hrefs.length < 2) { alert('Menos de 2 PDFs disponíveis.'); return; }

  const orig = btnEl.innerHTML;
  btnEl.disabled = true;

  try {
    // Baixa todos os PDFs
    const buffers = [];
    for (let i = 0; i < hrefs.length; i++) {
      btnEl.innerHTML = `⏳ Baixando ${i + 1}/${hrefs.length}…`;
      const resp = await fetch(`https://tsi-app.com/${hrefs[i]}`, { credentials: 'include' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ao baixar PDF ${i + 1}`);
      buffers.push(await resp.arrayBuffer());
    }

    btnEl.innerHTML = '⏳ Mesclando…';

    const merged  = _mergePdfs(buffers);
    const blob    = new Blob([merged], { type: 'application/octet-stream' });
    const url     = URL.createObjectURL(blob);
    const prefixo = d.listaEnviada ? 'ESCALA ATUALIZADA' : 'ESCALA';
    _download(url, `${prefixo} - ${chave || 'merged'}.pdf`);
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    btnEl.innerHTML = '✅ Baixado!';
    btnEl.style.color = 'var(--mon-green)';
    setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
  } catch (e) {
    console.error('[Monitor] Merge PDF erro:', e);
    btnEl.innerHTML = `✗ Erro: ${e.message.slice(0, 35)}`;
    setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; btnEl.disabled = false; }, 4000);
  }
}

// ── MERGE INTERNO (PDF puro em JS) ────────────────────────────────

function _mergePdfs(buffers) {
  const pdfs = buffers.map(buf => _parsePdf(_buf2str(buf)));

  // Reserva obj 1 = Catalog, obj 2 = Pages do merged
  let nextId = 3;
  const remaps = pdfs.map(pdf => {
    const remap = new Map();
    for (const [, obj] of pdf.objects) remap.set(obj.id, nextId++);
    return remap;
  });

  const allPageNewIds = [];
  for (let i = 0; i < pdfs.length; i++) {
    for (const oldId of pdfs[i].pageRefs) allPageNewIds.push(remaps[i].get(oldId));
  }

  const offsets = new Map();
  let body = '%PDF-1.4\n';

  const addObj = (id, raw) => {
    offsets.set(id, body.length);
    body += `${id} 0 obj\n${raw}\nendobj\n`;
  };

  const firstMediaBox = pdfs.find(p => p.mediaBox)?.mediaBox || '/MediaBox [0 0 595 842]';
  addObj(2,
    `<< /Type /Pages\n   /Kids [${allPageNewIds.map(id => `${id} 0 R`).join(' ')}]\n   /Count ${allPageNewIds.length}\n   ${firstMediaBox}\n>>`
  );

  for (let pi = 0; pi < pdfs.length; pi++) {
    const { objects, pageRefs } = pdfs[pi];
    const remap    = remaps[pi];
    const pageIdSet = new Set(pageRefs);

    for (const [, obj] of objects) {
      if (/\/Type\s*\/Pages\b/.test(obj.raw))   continue; // pula Pages original
      if (/\/Type\s*\/Catalog\b/.test(obj.raw)) continue; // pula Catalog original

      const newId = remap.get(obj.id);
      let raw = _rewriteRefs(obj.raw, remap);

      if (pageIdSet.has(obj.id)) {
        raw = raw.replace(/\/Parent\s+\d+\s+\d+\s+R/, '/Parent 2 0 R');
        if (!/\/Parent/.test(raw)) raw = raw.replace('<<', '<< /Parent 2 0 R');
      }

      addObj(newId, raw);
    }
  }

  addObj(1, '<< /Type /Catalog /Pages 2 0 R >>');

  const xrefOffset = body.length;
  body += `xref\n0 ${nextId}\n0000000000 65535 f \n`;
  for (let id = 1; id < nextId; id++) {
    const off = offsets.get(id);
    body += off !== undefined
      ? `${String(off).padStart(10, '0')} 00000 n \n`
      : '0000000000 65535 f \n';
  }
  body += `trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return _str2buf(body);
}

function _parsePdf(str) {
  const objects = new Map();
  const objRe   = /(\d+)\s+(\d+)\s+obj\s*([\s\S]*?)endobj/g;
  let m;
  while ((m = objRe.exec(str)) !== null) {
    objects.set(`${m[1]}_${m[2]}`, { id: parseInt(m[1]), gen: parseInt(m[2]), raw: m[3].trim() });
  }

  let pageRefs = [], mediaBox = null;
  for (const [, obj] of objects) {
    if (/\/Type\s*\/Pages\b/.test(obj.raw)) {
      const kids = obj.raw.match(/\/Kids\s*\[([^\]]+)\]/);
      if (kids) pageRefs = [...kids[1].matchAll(/(\d+)\s+\d+\s+R/g)].map(r => parseInt(r[1]));
      const mb = obj.raw.match(/\/MediaBox\s*\[[^\]]+\]/);
      if (mb) mediaBox = mb[0];
    }
  }

  return { objects, pageRefs, mediaBox };
}

function _rewriteRefs(raw, remap) {
  return raw.replace(/(\d+)\s+(\d+)\s+R/g, (full, id) => {
    const newId = remap.get(parseInt(id));
    return newId !== undefined ? `${newId} 0 R` : full;
  });
}

function _buf2str(ab) {
  const arr = new Uint8Array(ab);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return s;
}

function _str2buf(s) {
  const arr = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i) & 0xff;
  return arr;
}

function _download(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// Expõe globalmente
window._monAbrirPdf             = abrirPdf;
window._monMergePdfAssinaturas  = mergePdfAssinaturas;
