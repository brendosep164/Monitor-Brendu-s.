/**
 * build.js
 * ─────────────────────────────────────────────────────────────────
 * Gera o arquivo final monitor-tsi.user.js a partir dos módulos.
 *
 * USO:
 *   node build.js          → build único
 *   node build.js --watch  → recompila ao salvar qualquer arquivo
 *
 * O esbuild junta todos os módulos em um único arquivo JS que o
 * Tampermonkey consegue instalar diretamente.
 * ─────────────────────────────────────────────────────────────────
 */

import esbuild from 'esbuild';
import fs from 'fs';

const USERSCRIPT_HEADER = `// ==UserScript==
// @name         Monitor Operacional TSI
// @namespace    http://tampermonkey.net/
// @version      55.20
// @description  Monitor de apontamentos em tempo real
// @author       TSI
// @match        https://tsi-app.com/planejamento-operacional*
// @match        https://tsi-app.com/pedidoEapt*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @updateURL    https://raw.githubusercontent.com/brendosep164/monitor-tsi/main/monitor-tsi.user.js
// @downloadURL  https://raw.githubusercontent.com/brendosep164/monitor-tsi/main/monitor-tsi.user.js
// ==/UserScript==

`;

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'iife',       // Gera IIFE (function() { ... })() — necessário para userscripts
  outfile: 'dist/monitor-tsi.user.js',
  minify: false,        // Mantém legível para debugging
  sourcemap: false,
  banner: {
    js: USERSCRIPT_HEADER,
  },
  logLevel: 'info',
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('👀 Observando mudanças... (Ctrl+C para parar)');
} else {
  await esbuild.build(buildOptions);

  // Verifica tamanho do arquivo gerado
  const stats = fs.statSync('dist/monitor-tsi.user.js');
  const kb = (stats.size / 1024).toFixed(1);
  console.log(`✅ Build concluído: dist/monitor-tsi.user.js (${kb} KB)`);
}
