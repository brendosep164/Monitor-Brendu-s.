// ==UserScript==
// @name         Monitor - Brendu's
// @namespace    http://tampermonkey.net/
// @version      70.99
// @description  Monitor de apontamentos em tempo real — workspace SaaS · v70.99: fix selo de biometria ficava travado em "…" (carregava às vezes, às vezes não) — race condition no cache: o painel re-renderizava antes do fetch da origem responder, disparando outro fetch concorrente pra mesma URL cujo callback caía num elemento que já não existia mais no DOM; agora o cache guarda a Promise em andamento (não só o resultado final), então chamadas concorrentes reaproveitam a mesma requisição; falha de rede também não é mais cacheada, permitindo nova tentativa na próxima renderização · selo simplificado de "Biometria v2/v3" para só "v2"/"v3" (cores continuam: v2 verde, v3 vermelho) · v70.98: selo de biometria também no card APONTADOS do modal de detalhe da op · v70.97: modal de Apontados — selo de origem da biometria (v2/v3) por colaborador · v70.96: barra "/" entre múltiplos líderes estava muito apagada — agora em negrito e com cor mais forte para destacar melhor a separação · v70.95: removido emoji 👤 repetido antes de cada nome quando há múltiplos líderes — agora só "Nome/Nome" (na lista normal o emoji único antes do grupo continua) · v70.94: separador entre múltiplos líderes trocado de "·" para "/" (ex: 👤 Nome/👤 Nome) — tanto na lista normal quanto na compact · v70.93: emoji 👤 agora aparece antes de cada nome quando há múltiplos líderes (não só antes do primeiro), e na visão compact (modo tabela 38/68/Todas) a coluna líder também passou a listar todos os líderes (antes só o primeiro), com tooltip mostrando o nome completo de todos ao passar o mouse · v70.92: coluna LÍDER na lista de ops agora mostra todos os líderes quando há mais de um (antes só aparecia o primeiro) — primeiro nome de cada um, separados por "·", quebra de linha quando não cabe numa linha só, tooltip com nome completo de todos · v70.91: fix "Print Escala" sempre falhava com "Clique em ↻ Atualizar..." para operações com mais de 3h de antecedência — eaptHref (link do comprovante) só era salvo no cache quando a operação estava dentro da janela de 3h (naJanela); agora eaptHref é salvo independente da janela, então Print Escala funciona a qualquer momento (a janela de 3h continua controlando apenas a busca dos apontamentos reais, sem mudança nesse comportamento) · v70.90: fix modal "Atribuir HE em massa" abria atrás do modal de Relatórios — z-index estava menor (9999996) que o do modal de Relatórios (9999998); corrigido para 99999970 · v70.89: fix Atribuir HE em massa não gravava — o campo qtdHE é &lt;input type="number"&gt; (HTML5), que exige ponto decimal; o script enviava com vírgula e o backend ignorava o valor; também passou a ignorar campos disabled do form (como um submit real faria) · v70.88: modal de Atribuir HE em massa reformulado — tabela com colunas (chave, início, enc. previsto, saída real, HE detectada, HE a atribuir), modal ampliado (960px) para visualização organizada · v70.87: aba "H. Extra" movida para dentro do modal de Relatórios, ao lado de "Saídas" (antes era item separado no rail lateral) · v70.86: botões de ação nos modais de lista — Apontados: ✏️ Editar e 🗑️ Excluir; Escalados/Faltando: ✏️ Editar e ⚠️ Gerar Falta — abre via loadiframe original com parâmetros reais (tamanho/modal) e z-index fix · v70.85: report WhatsApp removeu linha de LÍDER/LÍDERES · v55.22: envio em lote — botão ⚡ na toolbar abre modal com checkboxes para selecionar múltiplas ops e enviar escala/report de uma vez sem precisar abrir cada op individualmente · v55.21: editar qtd de faltas com audit log (quem editou e quando) · v60.62: fix botões do modal (copiar/email/pdf) inoperantes após navegar entre ops; fix nome estranho de arquivo PDF (ID numérico ao invés da chave) · v60.63: fix fechar op do histórico voltava para lista de ops em vez de voltar ao histórico · v60.64: fix ops abertas pelo histórico apareciam na lista principal e nos contadores dos chips · v60.65: fix modal da nova op sem conteúdo/botões ao fechar e abrir outra op rapidamente · v60.66: fix após enviar escala não abre mais o drawer (evitava bug de botões travados); agora apenas expande a linha inline e rola até ela · v60.67: fix faltas chegavam ao relatório de turno sem ordem; agora vem cronologicamente (dataOp + hora), igual ao painel de Faltas · v60.68: relatório de turno redesenhado — modal maior e mais respirado, cards com handle de arrastar (drag-and-drop) para reordenar faltas, não entregues e pontos de atenção · v60.69: fix ordenação da lista de operações (ops já passadas caíam no meio em vez de ficar no topo) — timestamp agora é derivado da chave (formato fixo DDMMAAAAHHMM) e dataOp/hora viram fallback · v60.72: fix persistência do rel. turno após reload (funções expostas no window, turno restaurado sem race condition, listener de input adicionado antes do _faltasLoad async) · v60.71: relatório de turno agora persiste no localStorage — dados salvos automaticamente ao editar e restaurados ao reabrir; botão "Limpar" apaga o rascunho · v70.84: faltas multi-motivo — cada registro pode ter múltiplas sub-linhas (qtd + motivo diferentes), botão “+ motivo diferente” no card, texto do relatório gera uma linha por motivo · v70.83: relatório de faltas — botão "+ Adicionar" no header permite registrar falta manualmente (chave, hora, quantidade) sem precisar enviar report pela op · v70.82: relatório de turno reescrito — estado unificado em _rel (elimina dessincronização entre variáveis), add/remove/drag-and-drop corrigidos, modal ampliado (1100px, 97vh), listas com scroll independente (max-height por seção) · v70.81: fix agrupamento — ops que já passaram vão sempre para "Operações em Andamento" (past), removido o wraparound +1440min que reposicionava ops de madrugada (ex: 01:00 após 05:00) no grupo "Hoje · mais tarde" · v70.80: fix _monEta — ETA da op agora usa _opTs (data+hora real) em vez de só op.hora, corrigindo o bug onde ops passadas há mais de 4h recebiam "em 19hXXmin" por causa do wraparound +1440 · v70.79: fix ordenação — chave no formato SIGLA+DDMMAAAA+XXXX (4 dígitos finais são código interno, não HHMM); _opTs e _chaveTs agora extraem apenas DDMMAAAA da chave e lêem hora de op.hora, corrigindo ops cujo mês parseado era inválido (ex: CONMEI 01:00 ficava no meio da lista) · v70.78: linha expansível "CONVOCAÇÃO" no modal de detalhe da op — entre o header e os cards de métricas, recolhida por padrão, fetch lazy da tabela Advisor/QTDE/EXTRA da página _1, cache de 5min por opId · v70.77: card Convocação agora lê diretamente do iframe Fmodal1500 (NOME/QTDE/EXTRA reais) — watcher de load atualiza o card automaticamente quando o form de edição abre · v70.76: fix clique no resultado da busca de colaborador não abria a op (bug de type mismatch no find + handler inline substituído por função global com delay) · v70.75: card Convocação (Advisor/QTDE/EXTRA) no modal de detalhe da op — colapsável, fetch lazy do endpoint de edição, cache por opId · v70.74: busca de colaborador por nome no header (🔍) — mostra em qual op está escalado e status (apontado/faltando/escalado), abre drawer da op ao clicar · v70.73: fix zoom foto aparecia atrás do modal de biometria (z-index elevado para máximo); LIDER → LÍDERES no report quando há mais de um; integração do ajuste de tela cheia (content.js) · v60.70: fix definitivo dos botões travados após "Enviar Report"/"Enviar Escala" (que exigia refresh manual) — 3 camadas de proteção: (1) bloco de restauração geral pula reabertura via drawer quando _MON_REOPEN_OP_KEY está presente; (2) reload de escala/report zera _state.opId antes de recarregar; (3) flag window._monSuppressStateSave impede o beforeunload de regravar opId
// @author       TSI
// @match        https://tsi-app.com/planejamento-operacional*
// @match        https://tsi-app.com/pedidoEapt*
// @match        https://tsi-app.com/pedidos_1*
// @match        https://tsi-app.com/pedidoE_*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @updateURL    https://raw.githubusercontent.com/brendosep164/monitor-tsi/main/monitor-tsi.user.js
// @downloadURL  https://raw.githubusercontent.com/brendosep164/monitor-tsi/main/monitor-tsi.user.js
// ==/UserScript==

(function() {
  'use strict';



  // ── LOGGER CENTRALIZADO ───────────────────────────────────────────────────────
  const _MON_VERSION = '70.99';
  const _monLog = (level, tag, msg, extra) => {
    const ts = new Date().toISOString();
    const prefix = `[Monitor TSI v${_MON_VERSION}] ${ts} [${level}] ${tag}`;
    if (level === 'ERROR')      console.error(prefix, msg, extra ?? '');
    else if (level === 'WARN')  console.warn(prefix, msg, extra ?? '');
    else                        console.log(prefix, msg, extra ?? '');
  };
  const _monLogInfo  = (tag, msg, extra) => _monLog('INFO',  tag, msg, extra);
  const _monLogWarn  = (tag, msg, extra) => _monLog('WARN',  tag, msg, extra);
  const _monLogError = (tag, msg, extra) => _monLog('ERROR', tag, msg, extra);

  function _setStyles(el, styles) {
    if (!el || !styles) return;
    if (typeof styles === 'string') el.style.cssText = styles;
    else Object.assign(el.style, styles);
  }

  function _mk(tag, props, styles, html) {
    const el = document.createElement(tag);
    if (props) {
      Object.entries(props).forEach(([name, value]) => {
        if (name === 'className') el.className = value;
        else if (name === 'textContent') el.textContent = value;
        else if (name === 'innerHTML') el.innerHTML = value;
        else if (name in el) el[name] = value;
        else el.setAttribute(name, value);
      });
    }
    _setStyles(el, styles);
    if (html !== undefined) el.innerHTML = html;
    return el;
  }

  function _hiddenIframe(id) {
    let ifr = document.getElementById(id);
    if (!ifr) {
      ifr = _mk('iframe', { id: id });
      _setStyles(ifr, 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:none;top:-9999px;left:-9999px;');
      document.body.appendChild(ifr);
    }
    return ifr;
  }

  function _createOverlay(id, styles) {
    let overlay = document.getElementById(id);
    if (!overlay) {
      overlay = _mk('div', { id: id });
      _setStyles(overlay, Object.assign({
        position: 'fixed',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }, styles || {}));
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  _monLogInfo('[Init]', `Script iniciado — URL: ${window.location.href}`);

  // ── Redirect imediato: veio de modal de falta/edição que jogou para pedidoE_ ──
  // O _MON_REOPEN_OP_KEY contém a página original (planejamento-operacional).
  // Redireciona antes de qualquer renderização para evitar piscar a página errada.
  if (window.location.href.includes('pedidoE_')) {
    try {
      var _rRaw = sessionStorage.getItem('_monReopenOp');
      if (_rRaw) {
        var _rData = JSON.parse(_rRaw);
        if (_rData && _rData.page && _rData.page.includes('planejamento-operacional')) {
          window.location.replace(_rData.page);
          return;
        }
      }
    } catch(e) {}
    return;
  }

  if (!window.location.href.includes('planejamento-operacional') && !window.location.href.includes('pedidos_1')) return;

  // ── Botão flutuante de Pedidos em tsi-app.com/pedidos_1 ──────────────────
  if (window.location.href.includes('pedidos_1')) {
    if (window.self !== window.top) return;
    const _pedBtn = () => {
      const btn = document.createElement('div');
      btn.id = '_mon-ped-fab';
      btn.title = 'Abrir Pedidos';
      btn.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:9999999;width:56px;height:56px;border-radius:50%;background:#6366f1;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(99,102,241,0.45);transition:transform .15s,box-shadow .15s;user-select:none;';
      btn.textContent = '📦';
      btn.onmouseover = () => { btn.style.transform='scale(1.1)'; btn.style.boxShadow='0 6px 24px rgba(99,102,241,0.6)'; };
      btn.onmouseout  = () => { btn.style.transform=''; btn.style.boxShadow='0 4px 18px rgba(99,102,241,0.45)'; };
      btn.onclick = () => { if (typeof window._monAbrirRelatorios === 'function') window._monAbrirRelatorios('pedidos'); };
      document.body.appendChild(btn);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _pedBtn);
    else _pedBtn();
    // Não faz return — o monitor continua inicializando normalmente nessa página
  }

  // ── fim botão pedidos ─────────────────────────────────────────────────────

  // ── Ajuste de tela cheia (integrado do content.js da extensão) ──────────
  if (window.location.href.includes('planejamento-operacional')) {
    const _ajustarTelaCheia = () => {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      // overflow do body: hidden só quando o painel está aberto, visível e não minimizado
      const _monPanel = document.getElementById('mon-panel');
      const _monPanelAtivo = _monPanel
        && _monPanel.dataset.minimized !== '1'
        && _monPanel.style.display !== 'none';
      document.body.style.overflow = _monPanelAtivo ? 'hidden' : 'auto';

      document.querySelectorAll('table').forEach(tabela => {
        const container = tabela.closest('div');
        // Não mexe em containers que contêm o painel do monitor (evita 2ª scrollbar)
        if (container && !container.contains(document.getElementById('mon-panel')) && !container.closest('#mon-panel')) {
          container.style.height = 'calc(100vh - 95px)';
          container.style.maxHeight = 'calc(100vh - 95px)';
          container.style.overflow = 'auto';
        }
      });

      const rodape = document.querySelector('.pagination, .dataTables_paginate');
      if (rodape) {
        rodape.style.position = 'fixed';
        rodape.style.bottom = '0';
        rodape.style.left = '0';
        rodape.style.right = '0';
        rodape.style.background = '#fff';
        rodape.style.zIndex = '9999';
      }
    };
    _ajustarTelaCheia();
    setInterval(_ajustarTelaCheia, 1000);
  }

  // ── fim ajuste de tela ───────────────────────────────────────────────────


  if (window.self !== window.top) return;

  const AVATAR_URL = 'https://i.imgur.com/9HPkbTi.png';

  const BG_IFRAME_IDS = ['_mon_ifr_A', '_mon_ifr_B', '_mon_ifr_C', '_mon_ifr_D'];
  const IFR_PAG2   = '_mon_pag2';
  const IFR_ESCALA = '_mon_escala';

  // ─── ESTADO ────────────────────────────────────────────────────────────────

  // ── MONTAGEM DE PRINT (vale) ──────────────────────────────────────────────────
  function _monMontagem(cropCanvas, opId) {
    return new Promise(resolve => {
      const LOGO_SRC = 'data:image/png;base64,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';
      const op      = (typeof operations !== 'undefined' ? operations : []).find(o => o.id === opId) || {};
      const opChave = op.chave || opId || '';
      const hora    = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const quem    = (typeof monNomeUsuario === 'function' ? monNomeUsuario() : null) || 'Anônimo';

      const sw  = cropCanvas.width;
      const sh  = cropCanvas.height;
      const HDR = Math.round(sw * 0.09);
      const u   = HDR / 100;

      const out = document.createElement('canvas');
      out.width  = sw;
      out.height = HDR + sh;
      const ctx  = out.getContext('2d');

      // fundo gradiente
      const bgGrad = ctx.createLinearGradient(0, 0, sw * 0.5, HDR);
      bgGrad.addColorStop(0,   '#0a1f10');
      bgGrad.addColorStop(0.5, '#0f2d18');
      bgGrad.addColorStop(1,   '#0a1f10');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, sw, HDR);

      // faixa topo
      const topH   = Math.round(u * 4);
      const topGrd = ctx.createLinearGradient(0, 0, sw, 0);
      topGrd.addColorStop(0,   '#1b4332');
      topGrd.addColorStop(0.3, '#2d6a4f');
      topGrd.addColorStop(0.7, '#1b4332');
      topGrd.addColorStop(1,   '#1b4332');
      ctx.fillStyle = topGrd;
      ctx.fillRect(0, 0, sw, topH);

      // faixa base
      ctx.fillStyle = '#166534';
      ctx.fillRect(0, HDR - Math.round(u * 2), sw, Math.round(u * 2));

      // print original abaixo — INALTERADO
      ctx.drawImage(cropCanvas, 0, HDR);

      const img = new Image();
      img.onload = () => {

        // zona logo (55%) e info (45%)
        const logoZoneH = Math.round(HDR * 0.55);
        const infoZoneH = HDR - logoZoneH;

        // logo centralizada
        const LS  = Math.round(logoZoneH * 0.80);
        const CX  = Math.round(sw / 2);
        const CYL = Math.round(logoZoneH / 2) + topH;
        const CR  = LS / 2;

        // brilho atrás da logo
        const glowR = CR * 2.2;
        const glow  = ctx.createRadialGradient(CX, CYL, 0, CX, CYL, glowR);
        glow.addColorStop(0,   'rgba(45,106,79,0.18)');
        glow.addColorStop(0.4, 'rgba(45,106,79,0.06)');
        glow.addColorStop(1,   'rgba(45,106,79,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(CX, CYL, glowR, 0, Math.PI * 2);
        ctx.fill();

        // clip logo circular
        ctx.save();
        ctx.beginPath();
        ctx.arc(CX, CYL, CR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.clip();
        ctx.drawImage(img, CX - CR, CYL - CR, LS, LS);
        ctx.restore();

        // borda logo
        const bw   = Math.round(u * 3);
        const bGrd = ctx.createLinearGradient(CX - CR, CYL - CR, CX + CR, CYL + CR);
        bGrd.addColorStop(0,    '#2d6a4f');
        bGrd.addColorStop(0.35, '#95d5b2');
        bGrd.addColorStop(0.65, '#1b4332');
        bGrd.addColorStop(1,    '#74c69d');
        ctx.beginPath();
        ctx.arc(CX, CYL, CR + bw / 2, 0, Math.PI * 2);
        ctx.strokeStyle = bGrd;
        ctx.lineWidth   = bw;
        ctx.stroke();

        // brilho arco superior
        ctx.beginPath();
        ctx.arc(CX, CYL, CR + bw / 2, Math.PI * 1.1, Math.PI * 1.9);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth   = Math.round(u * 1);
        ctx.stroke();

        // zona info
        const infoY0 = logoZoneH + topH;
        const infoCY = infoY0 + infoZoneH / 2;

        const fsLabel = Math.max(10, Math.round(infoZoneH * 0.22));
        const fsVal   = Math.max(18, Math.round(infoZoneH * 0.46));
        const labelY  = infoCY - Math.round(fsVal * 0.15) - Math.round(fsLabel * 0.3);
        const valY    = infoCY + Math.round(fsVal * 0.55);

        // pill fundo
        const pillW = Math.round(sw * 0.78);
        const pillH = Math.round(infoZoneH * 0.84);
        const pillX = Math.round((sw - pillW) / 2);
        const pillY = Math.round(infoY0 + (infoZoneH - pillH) / 2);
        const pillR = Math.round(pillH * 0.28);

        ctx.beginPath();
        ctx.moveTo(pillX + pillR, pillY);
        ctx.lineTo(pillX + pillW - pillR, pillY);
        ctx.arcTo(pillX + pillW, pillY,         pillX + pillW, pillY + pillR,         pillR);
        ctx.lineTo(pillX + pillW, pillY + pillH - pillR);
        ctx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - pillR, pillY + pillH, pillR);
        ctx.lineTo(pillX + pillR, pillY + pillH);
        ctx.arcTo(pillX, pillY + pillH,         pillX, pillY + pillH - pillR,         pillR);
        ctx.lineTo(pillX, pillY + pillR);
        ctx.arcTo(pillX, pillY,                 pillX + pillR, pillY,                 pillR);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(255,255,255,0.06)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(149,213,178,0.25)';
        ctx.lineWidth   = Math.round(u * 0.8);
        ctx.stroke();

        // título canto superior esquerdo
        const fsTitle = Math.max(12, Math.round(infoZoneH * 0.38));
        const titleTxt = 'Comprovante de Vale Gerado';
        ctx.font         = '600 ' + fsTitle + 'px Arial, sans-serif';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        const titleX   = Math.round(u * 10);
        const titleY   = Math.round(u * 18);
        const titleW   = ctx.measureText(titleTxt).width;
        const titlePX  = Math.round(fsTitle * 0.5);
        const titlePY  = Math.round(fsTitle * 0.3);
        const titleBX  = titleX - titlePX;
        const titleBY  = titleY - fsTitle * 0.5 - titlePY;
        const titleBW  = titleW + titlePX * 2;
        const titleBH  = fsTitle + titlePY * 2;
        const titleBR  = Math.round(fsTitle * 0.3);
        ctx.beginPath();
        ctx.moveTo(titleBX + titleBR, titleBY);
        ctx.lineTo(titleBX + titleBW - titleBR, titleBY);
        ctx.arcTo(titleBX + titleBW, titleBY, titleBX + titleBW, titleBY + titleBR, titleBR);
        ctx.lineTo(titleBX + titleBW, titleBY + titleBH - titleBR);
        ctx.arcTo(titleBX + titleBW, titleBY + titleBH, titleBX + titleBW - titleBR, titleBY + titleBH, titleBR);
        ctx.lineTo(titleBX + titleBR, titleBY + titleBH);
        ctx.arcTo(titleBX, titleBY + titleBH, titleBX, titleBY + titleBH - titleBR, titleBR);
        ctx.lineTo(titleBX, titleBY + titleBR);
        ctx.arcTo(titleBX, titleBY, titleBX + titleBR, titleBY, titleBR);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(0,0,0,0)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(149,213,178,0.15)';
        ctx.lineWidth   = Math.max(1, Math.round(u * 0.8));
        ctx.stroke();
        ctx.fillStyle    = 'rgba(255,255,255,0.75)';
        ctx.fillText(titleTxt, titleX, titleY);

        // 3 colunas
        const colW    = Math.round(pillW / 3);
        const sepDivW = Math.max(2, Math.round(u * 1.5));
        const sepDivH = Math.round(pillH * 0.60);
        const sepDivY = pillY + (pillH - sepDivH) / 2;

        const cols = [
          { label: 'CHAVE',      value: opChave },
          { label: 'HORA',       value: hora    },
          { label: 'GERADO POR', value: quem    },
        ];

        cols.forEach((col, i) => {
          const colCX = pillX + colW * i + colW / 2;
          if (i > 0) {
            const dg = ctx.createLinearGradient(0, sepDivY, 0, sepDivY + sepDivH);
            dg.addColorStop(0,   'rgba(149,213,178,0)');
            dg.addColorStop(0.5, 'rgba(149,213,178,0.4)');
            dg.addColorStop(1,   'rgba(149,213,178,0)');
            ctx.fillStyle = dg;
            ctx.fillRect(pillX + colW * i - sepDivW / 2, sepDivY, sepDivW, sepDivH);
          }
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.font         = '600 ' + fsLabel + 'px Arial, sans-serif';
          ctx.fillStyle    = 'rgba(255,255,255,0.60)';
          ctx.fillText(col.label, colCX, labelY);
          ctx.font        = '700 ' + fsVal + 'px Arial, sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.7)';
          ctx.shadowBlur  = Math.round(u * 3);
          ctx.fillStyle   = '#ffffff';
          ctx.fillText(col.value, colCX, valY);
          ctx.shadowBlur  = 0;
          ctx.shadowColor = 'transparent';
        });

        // borda só no cabeçalho — base mais fina
        const bwF    = Math.round(u * 6);
        const bwFBot = Math.round(u * 2);   // borda inferior mais fina
        const frameR = Math.round(u * 5);
        function drawHdrFrame(lineW, linWBot, style) {
          const h  = lineW / 2;
          const hB = linWBot / 2;
          // topo e lados com lineW, base com linWBot
          // topo
          ctx.beginPath();
          ctx.moveTo(frameR + h, h);
          ctx.lineTo(sw - frameR - h, h);
          ctx.strokeStyle = style;
          ctx.lineWidth   = lineW;
          ctx.stroke();
          // lado direito
          ctx.beginPath();
          ctx.moveTo(sw - h, frameR + h);
          ctx.lineTo(sw - h, HDR - hB);
          ctx.strokeStyle = style;
          ctx.lineWidth   = lineW;
          ctx.stroke();
          // lado esquerdo
          ctx.beginPath();
          ctx.moveTo(h, frameR + h);
          ctx.lineTo(h, HDR - hB);
          ctx.strokeStyle = style;
          ctx.lineWidth   = lineW;
          ctx.stroke();
          // base fina
          ctx.beginPath();
          ctx.moveTo(frameR + hB, HDR - hB);
          ctx.lineTo(sw - frameR - hB, HDR - hB);
          ctx.strokeStyle = style;
          ctx.lineWidth   = linWBot;
          ctx.stroke();
        }
        const grd1 = ctx.createLinearGradient(0, 0, sw, 0);
        grd1.addColorStop(0,   '#1b4332');
        grd1.addColorStop(0.5, '#2d6a4f');
        grd1.addColorStop(1,   '#1b4332');
        drawHdrFrame(bwF, bwFBot, grd1);
        const grd2 = ctx.createLinearGradient(0, 0, sw, HDR);
        grd2.addColorStop(0,   'rgba(255,255,255,0.3)');
        grd2.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        grd2.addColorStop(1,   'rgba(255,255,255,0.15)');
        drawHdrFrame(Math.round(u * 1.2), Math.round(u * 0.8), grd2);

        // carimbo — desenhado localmente no canvas
        (function drawCarimbo() {
          const CS   = Math.round(HDR * 0.82);
          const CX_s = sw - Math.round(CS * 0.55);
          const CY_s = HDR - Math.round(CS * 0.55);
          ctx.save();
          ctx.translate(CX_s, CY_s);
          ctx.rotate(-0.18);
          ctx.globalAlpha = 0.88;

          const R  = CS / 2;
          const lw = Math.max(3, Math.round(R * 0.08));
          const lw2 = Math.max(1, Math.round(R * 0.03));

          // fundo
          ctx.beginPath();
          ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34,197,94,0.07)';
          ctx.fill();

          // círculo externo
          ctx.beginPath();
          ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth   = lw;
          ctx.stroke();

          // círculo interno
          ctx.beginPath();
          ctx.arc(0, 0, R - lw - Math.round(R * 0.07), 0, Math.PI * 2);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth   = lw2;
          ctx.stroke();

          // linha separadora
          const lineLen = Math.round(R * 0.58);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth   = lw2;
          ctx.beginPath();
          ctx.moveTo(-lineLen, 0);
          ctx.lineTo(lineLen, 0);
          ctx.stroke();

          ctx.fillStyle    = '#22c55e';
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';

          // VALE
          ctx.font = '900 ' + Math.max(10, Math.round(R * 0.40)) + 'px Arial Black, Arial, sans-serif';
          ctx.fillText('VALE', 0, -Math.round(R * 0.27));

          // GERADO
          ctx.font = '900 ' + Math.max(9, Math.round(R * 0.30)) + 'px Arial Black, Arial, sans-serif';
          ctx.fillText('GERADO', 0, Math.round(R * 0.27));

          ctx.restore();
          resolve(out);
        })();
      };
      img.onerror = () => { resolve(out); };
      img.src = LOGO_SRC;
    });
  }

    let iframesInUse  = {};
  let fetchQueue    = [];
  let inQueue       = new Set();
  let operations    = [];
  let apontCache    = {};
  let _convCache    = {};   // cache de advisors da convocação: opId → { rows:[{nome,qtde,extra}], ts }

  // ── Fetch/parse da tabela de Advisors (seção CONVOCAÇÃO da página _1) ────────
  // Retorna Promise<Array<{nome,qtde,extra}>>
  // Usa cache para evitar fetch repetido; invalida após 5 minutos
  function _parseAdvisorsFromDoc(doc) {
    const rows = [];
    let advTable = null;
    doc.querySelectorAll('div.alert-info').forEach(function(el) {
      if (advTable) return;
      if ((el.textContent || '').indexOf('CONVOCA') !== -1) {
        var p = el.parentNode;
        if (p) advTable = p.querySelector('table.tables');
      }
    });
    if (advTable) {
      advTable.querySelectorAll('tbody tr').forEach(function(tr) {
        var tds = tr.querySelectorAll('td');
        if (tds.length < 2) return;
        var nome = (tds[0].textContent || '').trim();
        if (!nome || nome.length < 2) return;
        var qtde = (tds[1].textContent || '').trim();
        var extra = tds[2] ? (tds[2].textContent || '').trim() : '';
        rows.push({ nome: nome, qtde: qtde, extra: extra });
      });
    }
    return rows;
  }

  window._monFetchAdvisors = function(opId) {
    const cached = _convCache[opId];
    // Já tem rows populadas
    if (cached && cached.rows && cached.rows.length > 0) return Promise.resolve(cached.rows);
    // Tem o egeralHref salvo — usa ele
    const href = cached && cached.egeralHref ? cached.egeralHref : null;
    const url = href
      ? 'https://tsi-app.com/' + href
      : null;
    if (!url) return Promise.resolve([]);
    return fetchDoc(url)
      .then(function(doc) {
        const rows = _parseAdvisorsFromDoc(doc);
        _convCache[opId] = Object.assign({}, _convCache[opId] || {}, { rows: rows, ts: Date.now() });
        return rows;
      })
      .catch(function() { return []; });
  };

  // Invalida o cache de convocação de uma op (ex: após editar a escala)
  window._monInvalidaConvCache = function(opId) {
    delete _convCache[opId];
  };

  // Cache de anotações por opId
  let _anotCache = {};

  // Toggle da linha expansível de Anotações
  window._monToggleAnot = function(opId, sfx) {
    var bodyId = 'mon-anot-body-' + opId + sfx;
    var arrId  = 'mon-anot-arr-'  + opId + sfx;
    var wrapId = 'mon-anot-wrap-' + opId + sfx;
    var body = document.getElementById(bodyId);
    var arr  = document.getElementById(arrId);
    var wrap = document.getElementById(wrapId);
    if (!body || !arr) return;
    var open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    arr.style.transform = open ? '' : 'rotate(180deg)';
    // Alarga o modal quando aberto
    var modalDlg = document.querySelector('#mon-op-modal');
    if (modalDlg) modalDlg.style.maxWidth = open ? '' : '860px';
    if (!open && body.dataset.loaded !== '1') {
      body.dataset.loaded = '1';
      body.innerHTML = '<div style="padding:10px 14px;font-size:11px;color:var(--mon-text-faint)">⏳ Carregando…</div>';
      // Pega anotações do cache de convocação (mesmo fetch) ou busca direto
      var cached = _anotCache[opId];
      if (cached !== undefined) {
        window._monRenderAnot(opId, sfx, cached);
      } else {
        var convCached = _convCache[opId];
        var href = convCached && convCached.egeralHref ? convCached.egeralHref : null;
        if (!href) { body.innerHTML = '<div style="padding:10px 14px;font-size:11px;color:var(--mon-text-faint)">Sem link disponível</div>'; return; }
        // A página de anotações é o planejamento — usa a URL _1 do planejamento-operacional-edit
        // O egeralHref é pedidoEgeral_ID_1 — precisamos do planejamento-operacional-edit
        // Busca o link do planejamento a partir da página pedidoEgeral
        // op.id é o mesmo planId usado em planejamento-operacional-edit
        fetchDoc('https://tsi-app.com/planejamento-operacional-edit' + opId + '_1')
          .then(function(planDoc) {
            var inp = planDoc.querySelector('#anotacoes_plan');
            var val = inp ? (inp.value || '') : '';
            _anotCache[opId] = val;
            window._monRenderAnot(opId, sfx, val);
          })
          .catch(function() {
            _anotCache[opId] = '';
            window._monRenderAnot(opId, sfx, '');
          });
      }
    }
  };

  window._monRenderAnot = function(opId, sfx, valor) {
    var bodyId = 'mon-anot-body-' + opId + sfx;
    var body = document.getElementById(bodyId);
    if (!body) return;
    body.innerHTML =
      '<div style="padding:10px 14px;">' +
        '<textarea id="mon-anot-txt-' + opId + sfx + '" style="width:100%;min-height:80px;max-height:200px;border:1px solid var(--mon-border);border-radius:6px;background:var(--mon-surface2);color:var(--mon-text);font-size:12px;padding:8px;resize:vertical;box-sizing:border-box">' +
          (valor || '').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
        '</textarea>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:6px;gap:8px">' +
          '<span id="mon-anot-status-' + opId + sfx + '" style="font-size:10px;color:var(--mon-text-faint);align-self:center"></span>' +
          '<button onclick="window._monSaveAnot(\'' + opId + '\',\'' + sfx + '\')" style="padding:4px 14px;font-size:11px;font-weight:600;border:none;border-radius:5px;background:var(--mon-accent);color:#fff;cursor:pointer">💾 Salvar</button>' +
        '</div>' +
      '</div>';
  };

  window._monSaveAnot = function(opId, sfx) {
    var txtId    = 'mon-anot-txt-'    + opId + sfx;
    var statusId = 'mon-anot-status-' + opId + sfx;
    var txt    = document.getElementById(txtId);
    var status = document.getElementById(statusId);
    if (!txt || !status) return;
    var novoValor = txt.value;
    status.textContent = '⏳ Salvando…';

    var planUrl = 'https://tsi-app.com/planejamento-operacional-edit' + opId + '_1';

    // Cria iframe invisível temporário — não interfere com nada na página
    var ifr = _hiddenIframe('_mon-anot-iframe');

    ifr.onload = function() {
      try {
        var iDoc = ifr.contentDocument || ifr.contentWindow.document;
        var inp = iDoc.getElementById('anotacoes_plan');
        var btn = iDoc.getElementById('submitF');
        if (!inp || !btn) {
          document.body.removeChild(ifr);
          var s = document.getElementById(statusId);
          if (s) s.textContent = '❌ Campo não encontrado';
          return;
        }
        inp.value = novoValor;
        // Aguarda o submit recarregar o iframe
        ifr.onload = function() {
          ifr.onload = null;
          document.body.removeChild(ifr);
          _anotCache[opId] = novoValor;
          var s = document.getElementById(statusId);
          if (s) {
            s.textContent = '✅ Salvo!';
            setTimeout(function() { var s2 = document.getElementById(statusId); if (s2) s2.textContent = ''; }, 3000);
          }
          setTimeout(function() { window.location.reload(); }, 1500);
        };
        btn.click();
      } catch(e) {
        console.warn('[MonAnot] erro save:', e);
        try { document.body.removeChild(ifr); } catch(_) {}
        var s = document.getElementById(statusId);
        if (s) s.textContent = '❌ Erro: ' + e.message;
      }
    };
    ifr.src = planUrl;
  };

  // Toggle da linha expansível de Convocação — chamado pelo onclick do header
  window._monToggleConv = function(opId, sfx) {
    var bodyId = 'mon-conv-body-' + opId + sfx;
    var arrId  = 'mon-conv-arr-'  + opId + sfx;
    var body = document.getElementById(bodyId);
    var arr  = document.getElementById(arrId);
    if (!body || !arr) return;
    var open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    arr.style.transform = open ? '' : 'rotate(180deg)';
    if (!open && body.dataset.loaded !== '1') {
      body.dataset.loaded = '1';
      body.innerHTML = '<div style="padding:8px 12px;font-size:11px;color:var(--mon-text-faint)">⏳ Carregando advisors…</div>';
      window._monFetchAdvisors(opId).then(function(rows) {
        var b = document.getElementById(bodyId);
        if (!b) return;
        if (!rows || rows.length === 0) {
          b.innerHTML = '<div style="padding:8px 12px;font-size:11px;color:var(--mon-text-faint)">Nenhum advisor cadastrado</div>';
          return;
        }
        var tbl = '<table style="width:100%;border-collapse:collapse;font-size:11.5px">';
        tbl += '<thead><tr style="background:var(--mon-surface2)">';
        tbl += '<th style="text-align:left;padding:5px 12px;font-weight:700;color:var(--mon-text-dim);font-size:10px;letter-spacing:0.5px">NOME</th>';
        tbl += '<th style="text-align:center;padding:5px 8px;font-weight:700;color:var(--mon-text-dim);font-size:10px;letter-spacing:0.5px">QTDE</th>';
        tbl += '<th style="text-align:center;padding:5px 8px;font-weight:700;color:var(--mon-text-dim);font-size:10px;letter-spacing:0.5px">EXTRA</th>';
        tbl += '</tr></thead><tbody>';
        rows.forEach(function(r, i) {
          var bg = i % 2 === 0 ? 'transparent' : 'var(--mon-surface2)';
          tbl += '<tr style="background:' + bg + '">';
          tbl += '<td style="padding:5px 12px;font-weight:500;color:var(--mon-text)">'   + r.nome  + '</td>';
          tbl += '<td style="text-align:center;padding:5px 8px;font-weight:700;color:var(--mon-accent)">' + r.qtde  + '</td>';
          tbl += '<td style="text-align:center;padding:5px 8px;font-weight:600;color:var(--mon-text-dim)">' + r.extra + '</td>';
          tbl += '</tr>';
        });
        tbl += '</tbody></table>';
        b.innerHTML = tbl;
      });
    }
  };

  // FIX: helper para buscar op por id com coerção de tipo
  // opId vindo de onclick inline é sempre string ('123'), mas o.id pode ser number (123)
  // A comparação estrita === falha silenciosamente — op fica undefined — e o fallback
  // usa o próprio opId (número como string) como nome de arquivo/dado, causando o bug
  // "nome estranho com ID" nos botões de PDF, e-mail, copiar, etc.
  function _monFindOp(opId) {
    if (opId === undefined || opId === null) return null;
    const idNum = Number(opId);
    const byNum = !isNaN(idNum) && operations.find(o => o.id === idNum);
    if (byNum) return byNum;
    const idStr = String(opId);
    return operations.find(o => String(o.id) === idStr) || null;
  }
  // Também busca no histórico (_fromHist)
  function _monFindOpOrHist(opId) {
    const found = _monFindOp(opId);
    if (found) return found;
    // Fallback: op do histórico que já saiu de operations
    try {
      return operations.find(o => o._fromHist && String(o.id) === String(opId)) || null;
    } catch(e) { return null; }
  }
  let expanded      = new Set();
  let monitoradas   = new Set();
  let minimized     = false;
  let refreshTimer  = null;
  let watchdogTimer = null;

  // ── FILTRO / ORDENAÇÃO ──────────────────────────────────────────────────────
  let filterText  = "";
  let sortCol     = null;   // 'esc' | 'apt' | 'hora' | 'status'
  let sortDir     = 1;      // 1 = asc, -1 = desc
  // Estado de colapso dos grupos (Set com keys colapsados)
  const _monCollapsedBuckets = new Set();
  // ops já notificadas — persiste no localStorage com chave por data (limpa automaticamente a cada dia)
  const _hoje = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const NOTIF_KEY = '_monNotificadas_' + _hoje;
  // Limpa chaves de dias anteriores
  (function() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('_monNotificadas_') && k !== NOTIF_KEY) localStorage.removeItem(k);
      });
    } catch(e) {}
  })();
  function notificadasLoad() { try { return new Set((JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]')).map(String)); } catch(e) { return new Set(); } }
  function notificadasSave() { try { localStorage.setItem(NOTIF_KEY, JSON.stringify([...notificadas])); } catch(e) {} }
  let notificadas = notificadasLoad();

  // ── NOTIFICAÇÕES DE ESCALA COMPLETA ─────────────────────────────────────────
  const NOTIF_ESC_KEY = '_monNotifEscala_' + _hoje;
  (function() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('_monNotifEscala_') && k !== NOTIF_ESC_KEY) localStorage.removeItem(k);
      });
    } catch(e) {}
  })();
  function notifEscLoad() { try { return new Set(JSON.parse(localStorage.getItem(NOTIF_ESC_KEY) || '[]').map(String)); } catch(e) { return new Set(); } }
  function notifEscSave() { try { localStorage.setItem(NOTIF_ESC_KEY, JSON.stringify([...notifEscala])); } catch(e) {} }
  let notifEscala = notifEscLoad();

  // ── NOTIFICAÇÕES DE MUDANÇA DE ESCALA (bolinha vermelha) ─────────────────────
  const NOTIF_ESC_CHANGE_KEY = '_monNotifEscChange_sess';
  // Dedup por sessão (sessionStorage): notifica sempre que a bolinha acender após reload
  // Antes era localStorage por dia — causava silêncio ao recarregar com bolinha já acesa
  function notifEscChangeLoad() { try { return new Set(JSON.parse(sessionStorage.getItem(NOTIF_ESC_CHANGE_KEY) || '[]').map(String)); } catch(e) { return new Set(); } }
  function notifEscChangeSave() { try { sessionStorage.setItem(NOTIF_ESC_CHANGE_KEY, JSON.stringify([...notifEscChange])); } catch(e) {} }
  let notifEscChange = notifEscChangeLoad();

  // ── HISTÓRICO DE NOTIFICAÇÕES (cache local) ──────────────────────────────────
  const NOTIF_HIST_KEY = '_monNotifHistorico';
  function _notifHistLoad() { try { return JSON.parse(localStorage.getItem(NOTIF_HIST_KEY) || '[]'); } catch(e) { return []; } }
  function _notifHistSave(arr) { try { localStorage.setItem(NOTIF_HIST_KEY, JSON.stringify(arr)); } catch(e) {} }
  function _notifHistAdd(entry) {
    const arr = _notifHistLoad();
    arr.unshift({ ...entry, ts: Date.now(), horaStr: new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' }) });
    if (arr.length > 200) arr.length = 200;
    _notifHistSave(arr);
    try { window._monAtualizarBadgeNotifHist && window._monAtualizarBadgeNotifHist(); } catch(e) {}
  }

  // ── FIREBASE CONFIG (migrado do Supabase) ────────────────────────────────────
  const _FB_CONFIG = {
    apiKey:            'AIzaSyAUJlmEmpKuSTXR55HXbRVpqQSul1573ic',
    authDomain:        'monitor-tsi-35d11.firebaseapp.com',
    databaseURL:       'https://monitor-tsi-35d11-default-rtdb.firebaseio.com',
    projectId:         'monitor-tsi-35d11',
    storageBucket:     'monitor-tsi-35d11.firebasestorage.app',
    messagingSenderId: '787188547148',
    appId:             '1:787188547148:web:e53e13d1c2426f0c5ebee9'
  };

  // Carrega SDK do Firebase dinamicamente e inicializa o monitor
  // (evita dependência de @require que pode ser bloqueado por CSP da página)
  let _fbDb = null;

  function _loadFirebaseAndInit(callback) {
    function _loadScript(url, cb) {
      if (document.querySelector('script[src="' + url + '"]')) { cb(); return; }
      const s = document.createElement('script');
      s.src = url;
      s.onload = cb;
      s.onerror = cb; // continua mesmo se falhar
      document.head.appendChild(s);
    }
    _loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js', function() {
      _loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js', function() {
        _loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js', function() {
          try {
            if (!window.firebase) { _monLogError('[Firebase]', 'SDK não carregou'); callback(); return; }
            if (!firebase.apps.length) firebase.initializeApp(_FB_CONFIG);
            _monLogInfo('[Firebase]', 'Iniciando autenticação anônima');
            firebase.auth().signInAnonymously()
              .then(function() {
                _monLogInfo('[Firebase]', 'Autenticado com sucesso');
                _fbDb = firebase.database();
                callback();
              })
              .catch(function(e) {
                _monLogError('[Firebase]', 'Erro auth', e);
                callback();
              });
          } catch(e) {
            _monLogError('[Firebase]', 'Erro ao inicializar', e);
            callback();
          }
        });
      });
    });
  }

  // ── CRIPTOGRAFIA AES-GCM (dados em repouso no Firebase) ─────────────────────
  const _MON_ENC_KEY = 'mon-tsi-2025-k1#';

  async function _monEncrypt(valor) {
    try {
      const json    = JSON.stringify(valor);
      const enc     = new TextEncoder();
      const keyMat  = await crypto.subtle.importKey('raw', enc.encode(_MON_ENC_KEY.padEnd(16).slice(0,16)), 'AES-GCM', false, ['encrypt']);
      const iv      = crypto.getRandomValues(new Uint8Array(12));
      const cipher  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, keyMat, enc.encode(json));
      const buf     = new Uint8Array(iv.byteLength + cipher.byteLength);
      buf.set(iv, 0);
      buf.set(new Uint8Array(cipher), iv.byteLength);
      let bin = '';
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      return btoa(bin);
    } catch(e) {
      _monLogError('[Crypto]', 'Erro ao criptografar', e);
      return null;
    }
  }

  async function _monDecrypt(blob) {
    try {
      const buf     = Uint8Array.from(atob(blob), c => c.charCodeAt(0));
      const iv      = buf.slice(0, 12);
      const cipher  = buf.slice(12);
      const enc     = new TextEncoder();
      const keyMat  = await crypto.subtle.importKey('raw', enc.encode(_MON_ENC_KEY.padEnd(16).slice(0,16)), 'AES-GCM', false, ['decrypt']);
      const plain   = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, keyMat, cipher);
      return JSON.parse(new TextDecoder().decode(plain));
    } catch(e) {
      return null; // dado corrompido ou não criptografado (legado)
    }
  }

  // Substitutos diretos de _sbGet/_sbSet — mesma assinatura, zero mudança no resto do código
  function _sbGet(chave, cb) {
    if (!_fbDb) { cb({}); return; }
    const timeout = setTimeout(() => cb({}), 6000);
    _fbDb.ref('mon_store/' + chave).once('value')
      .then(async snap => {
        clearTimeout(timeout);
        const raw = snap.val();
        if (raw === null) { cb({}); return; }
        // Tenta descriptografar — se falhar, retorna o valor bruto (compatibilidade com dados legados)
        if (typeof raw === 'string') {
          const dec = await _monDecrypt(raw);
          cb(dec !== null ? dec : raw);
        } else {
          cb(raw);
        }
      })
      .catch(() => { clearTimeout(timeout); cb({}); });
  }

  function _sbSet(chave, valor, cb) {
    if (!_fbDb) { if (cb) cb(); return; }
    _monEncrypt(valor).then(encrypted => {
      if (!encrypted) { if (cb) cb(); return; }
      _fbDb.ref('mon_store/' + chave).set(encrypted)
        .then(() => { if (cb) cb(); })
        .catch(() => { if (cb) cb(); });
    });
  }

  // ── HASH DE CPF (SHA-256 truncado) ───────────────────────────────────────────
  // Cache síncrono: CPF bruto → 'h:XXXXXXXX' (8 hex chars do SHA-256)
  // Toda a lógica interna usa o hash; o CPF bruto nunca vai ao Supabase.
  const _cpfHashCache = {};

  // Versão síncrona — retorna do cache ou 'h:????????' se ainda não calculado
  // (na prática, sempre haverá cache pois _cpfPreHash é chamado antes)
  function _hashCpfSync(cpf) {
    if (!cpf) return '';
    const limpo = cpf.replace(/[\s.\-]/g, '');
    if (_cpfHashCache[limpo]) return _cpfHashCache[limpo];
    // fallback temporário: ainda não calculado (não deve acontecer em fluxo normal)
    return 'h:????????';
  }

  // Versão assíncrona — calcula e armazena no cache
  async function _cpfPreHash(cpf) {
    if (!cpf) return '';
    const limpo = cpf.replace(/[\s.\-]/g, '');
    if (_cpfHashCache[limpo]) return _cpfHashCache[limpo];
    try {
      const enc = new TextEncoder().encode(limpo);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
      const hash = 'h:' + hex.slice(0, 8);
      _cpfHashCache[limpo] = hash;
      return hash;
    } catch(e) {
      // Web Crypto indisponível (improvável em navegadores modernos)
      const simples = 'h:' + limpo.split('').reduce((a,c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0).toString(16).padStart(8,'0');
      _cpfHashCache[limpo] = simples;
      return simples;
    }
  }

  // Pré-hasha um array de objetos com campo cpf (in-place, async)
  async function _hashCpfArray(arr) {
    if (!arr) return arr;
    await Promise.all(arr.map(e => e.cpf ? _cpfPreHash(e.cpf).then(h => { e.cpf = h; }) : Promise.resolve()));
    return arr;
  }

  // ── HISTÓRICO DE REPORTS ──────────────────────────────────────────────────────
  // Cada entrada: { opId, chave, sigla, site, hora, dataOp, apontado, solicitado,
  //                escalado, lideres, quemEnviou, ts }
  const HIST_REP_KEY = 'reportHistorico';
  let _reportHist = [];

  function _reportHistCarregar(cb) {
    _sbGet(HIST_REP_KEY, data => {
      // Firebase RTDB converte arrays em objetos com chaves numéricas ao persistir
      // ex: [entry0, entry1] vira {0: entry0, 1: entry1} — Object.values restaura a ordem
      if (Array.isArray(data)) {
        _reportHist = data;
      } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        _reportHist = Object.values(data);
      } else {
        _reportHist = [];
      }
      if (cb) cb();
    });
  }

  function _reportHistSalvar(opId) {
    const op = operations.find(o => o.id === opId);
    const d  = apontCache[opId];
    if (!op || !d || d === 'loading') return;
    const entry = {
      opId,
      chave:      op.chave,
      sigla:      op.sigla  || '',
      site:       op.site   || '',
      hora:       op.hora   || '',
      dataOp:     monDataDaOp(op),
      apontado:   d.apontado   || 0,
      solicitado: d.solicitado || op.qtd || 0,
      escalado:   d.escalado   || 0,
      lideres:    d.lideres    || [],
      quemEnviou: monNomeUsuario() || 'Anônimo',
      ts: Date.now()
    };
    // Evita duplicata da mesma op no mesmo dia
    _reportHist = _reportHist.filter(e => {
      const mesmaOp  = e.opId === opId;
      const mesmoDs  = e.dataOp === entry.dataOp;
      return !(mesmaOp && mesmoDs);
    });
    _reportHist.unshift(entry);
    if (_reportHist.length > 300) _reportHist = _reportHist.slice(0, 300);
    _sbSet(HIST_REP_KEY, _reportHist);
  }

  // Abre modal de histórico
  window._monAbrirHistorico = function() {
    let modal = document.getElementById('mon-hist-modal');
    if (!modal) {
      modal = _createOverlay('mon-hist-modal', {
        zIndex: '999999',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '12px',
        fontFamily: 'var(--mon-font)'
      });
      modal.style.display = 'none';
      modal.innerHTML = `
        <div id="mon-hist-box" style="
          background:var(--mon-bg);
          border-radius:16px;
          width:500px;max-width:96vw;max-height:92vh;
          display:flex;flex-direction:column;overflow:hidden;
          animation:mon-fadein 0.1s ease;
          box-shadow:0 24px 64px rgba(0,0,0,0.4),0 0 0 1px var(--mon-border);
        ">

          <!-- HEADER -->
          <div style="
            padding:14px 16px 13px;flex-shrink:0;
            border-bottom:1px solid var(--mon-border);
            background:var(--mon-surface);
            display:flex;align-items:center;gap:10px;
          ">
            <div style="
              width:32px;height:32px;border-radius:8px;flex-shrink:0;
              background:var(--mon-blue-bg);border:1px solid var(--mon-blue-border);
              display:flex;align-items:center;justify-content:center;font-size:15px;
            ">🕐</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:700;color:var(--mon-text);letter-spacing:-0.3px;line-height:1.2;">Histórico de Reports</div>
              <div style="font-size:10.5px;color:var(--mon-text-faint);margin-top:1px;">Clique em qualquer operação para abrir</div>
            </div>
            <button onclick="window._monLimparHistorico()" title="Limpar histórico" style="
              display:flex;align-items:center;gap:4px;
              padding:5px 10px;border-radius:7px;flex-shrink:0;
              border:1px solid var(--mon-red-border);background:var(--mon-red-bg);
              color:var(--mon-red);font-size:11px;font-weight:600;
              cursor:pointer;transition:background 0.1s,color 0.1s;font-family:var(--mon-font);
            " onmouseover="this.style.background='var(--mon-red)';this.style.color='#fff'"
               onmouseout="this.style.background='var(--mon-red-bg)';this.style.color='var(--mon-red)'">🗑 Limpar</button>
            <button onclick="window._monFecharHistorico()" style="
              width:28px;height:28px;border-radius:7px;flex-shrink:0;
              border:1px solid var(--mon-border);background:transparent;
              color:var(--mon-text-faint);font-size:13px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;transition:background 0.1s,color 0.1s;
            " onmouseover="this.style.background='var(--mon-surface3)';this.style.color='var(--mon-text)'"
               onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)'">✕</button>
          </div>

          <!-- BUSCA -->
          <div style="padding:9px 12px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0;">
            <div style="position:relative;">
              <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--mon-text-faint);pointer-events:none;">🔍</span>
              <input id="mon-hist-filtro" type="text" placeholder="Buscar por chave, sigla ou site…"
                style="width:100%;box-sizing:border-box;padding:7px 10px 7px 30px;border-radius:8px;
                  border:1px solid var(--mon-border2);background:var(--mon-bg);
                  color:var(--mon-text);font-size:11.5px;font-family:var(--mon-font);outline:none;
                  transition:border-color 0.15s;"
                oninput="window._monFiltrarHistorico(this.value)"
                onfocus="this.style.borderColor='var(--mon-accent)'"
                onblur="this.style.borderColor='var(--mon-border2)'" />
            </div>
          </div>

          <!-- LISTA -->
          <div id="mon-hist-body" style="flex:1;overflow-y:auto;padding:8px 10px 10px;"></div>
        </div>`;
      modal.addEventListener('click', e => { if (e.target === modal) window._monFecharHistorico(); });
      document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    // Bug fix: mostra loading e só renderiza após o _sbGet terminar
    const _histBody = document.getElementById('mon-hist-body');
    if (_histBody) _histBody.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:40px;color:var(--mon-text-faint);font-size:12px"><div style="width:16px;height:16px;border:2px solid var(--mon-border);border-top-color:var(--mon-accent);border-radius:50%;animation:mon-spin 0.7s linear infinite"></div>Carregando…</div>';
    const fi = document.getElementById('mon-hist-filtro');
    if (fi) fi.value = '';
    _reportHistCarregar(() => {
      window._monFiltrarHistorico('');
      if (fi) setTimeout(() => fi.focus(), 80);
      setTimeout(() => {
        const MAX_PRELOAD = 10;
        let count = 0;
        _reportHist.forEach(entry => {
          if (count >= MAX_PRELOAD) return;
          if (!entry.opId) return;
          if (apontCache[entry.opId] && apontCache[entry.opId] !== 'loading') return;
          if (apontCache[entry.opId] === 'loading') return;
          count++;
          let op = operations.find(o => o.id === entry.opId);
          if (!op) {
            op = {
              id: entry.opId, chave: entry.chave, sigla: entry.sigla || '',
              site: entry.site || '', hora: entry.hora || '',
              lider: (entry.lideres && entry.lideres[0]) || '',
              liderCompleto: (entry.lideres && entry.lideres[0]) || '',
              qtd: entry.solicitado || 0,
              status: '', time: '', bubbles: [], escAtual: -1, _fromHist: true
            };
            operations.push(op);
          }
          enfileirar(op, () => {}, false);
        });
      }, 300);
    });
  };

  window._monFecharHistorico = function(skipRailReset) {
    const m = document.getElementById('mon-hist-modal');
    if (m) m.style.display = 'none';
    if (!skipRailReset && window._monRailVoltarOps) window._monRailVoltarOps();
  };

  window._monLimparHistorico = function() {
    if (!confirm('Limpar todo o histórico de reports? Isso afeta todos os usuários e não pode ser desfeito.')) return;
    _reportHist = [];
    _sbSet(HIST_REP_KEY, [], () => {
      window._monFiltrarHistorico('');
      _monToast('Histórico limpo com sucesso.', 'ok');
    });
  };

  window._monFiltrarHistorico = function(q) {
    const body = document.getElementById('mon-hist-body');
    if (!body) return;
    const qn = (q || '').toLowerCase().trim();
    let lista = _reportHist;
    if (qn) lista = lista.filter(e =>
      (e.chave || '').toLowerCase().includes(qn) ||
      (e.sigla || '').toLowerCase().includes(qn) ||
      (e.site  || '').toLowerCase().includes(qn)
    );

    if (lista.length === 0) {
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:48px 20px;gap:10px;color:var(--mon-text-faint);">
          <span style="font-size:32px;opacity:0.4;">${qn ? '🔍' : '📋'}</span>
          <span style="font-size:12px;font-weight:500;">${qn ? 'Nenhum resultado para "' + q + '"' : 'Nenhum report registrado ainda'}</span>
        </div>`;
      return;
    }

    // Agrupa por data
    const grupos = {};
    lista.forEach(e => {
      const grp = e.dataOp || '—';
      if (!grupos[grp]) grupos[grp] = [];
      grupos[grp].push(e);
    });

    let html = '';
    Object.keys(grupos).sort((a, b) => {
      const p = s => { try { const [d,m,y] = s.split('/'); return new Date(y,m-1,d).getTime(); } catch(e){return 0;} };
      return p(b) - p(a);
    }).forEach(data => {
      // Cabeçalho de data
      html += `
        <div style="
          display:flex;align-items:center;gap:8px;
          margin:10px 1px 5px;
        ">
          <div style="flex:1;height:1px;background:var(--mon-border);opacity:0.6;"></div>
          <span style="font-size:9.5px;font-weight:700;color:var(--mon-text-faint);
            text-transform:uppercase;letter-spacing:0.8px;white-space:nowrap;">${data}</span>
          <span style="font-size:9px;font-weight:600;color:var(--mon-text-faint);
            background:var(--mon-surface3);border-radius:99px;padding:1px 7px;
            opacity:0.8;">${grupos[data].length}</span>
          <div style="flex:1;height:1px;background:var(--mon-border);opacity:0.6;"></div>
        </div>`;

      grupos[data].forEach(e => {
        const ok      = e.apontado >= e.solicitado;
        const parcial = !ok && e.apontado > 0;
        const aptCor  = ok ? 'var(--mon-green)' : parcial ? 'var(--mon-amber)' : 'var(--mon-text-dim)';
        const aptBg   = ok ? 'var(--mon-green-bg)' : parcial ? 'var(--mon-amber-bg)' : 'var(--mon-surface2)';
        const aptBrd  = ok ? 'var(--mon-green-border)' : parcial ? 'var(--mon-amber-border)' : 'var(--mon-border)';
        const pct     = e.solicitado > 0 ? Math.min(100, Math.round((e.apontado / e.solicitado) * 100)) : 0;
        const icone   = ok ? '✓' : parcial ? '~' : '✗';
        const enviado = (() => { try { return new Date(e.ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); } catch(x){return '';} })();
        const opIdEsc = (e.opId || '').replace(/'/g, "\'");
        const sigla   = e.sigla ? `<span style="font-size:9.5px;font-weight:600;color:var(--mon-text-dim);background:var(--mon-surface3);border-radius:4px;padding:1px 6px;letter-spacing:0.2px;">${e.sigla}</span>` : '';
        const hora    = e.hora  ? `<span style="font-size:9.5px;font-weight:700;font-family:var(--mon-mono);color:var(--mon-amber);background:var(--mon-amber-bg);border:1px solid var(--mon-amber-border);border-radius:4px;padding:1px 6px;">${e.hora}</span>` : '';
        const lider   = e.lideres && e.lideres.length
          ? `<span style="font-size:10px;color:var(--mon-text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;" title="${e.lideres.join(', ')}">👤 ${e.lideres[0]}</span>` : '';

        html += `
          <div onclick="window._monAbrirDoHistorico('${opIdEsc}')"
            style="
              display:flex;align-items:stretch;gap:0;
              border-radius:10px;margin-bottom:5px;
              border:1px solid var(--mon-border);background:var(--mon-surface);
              cursor:pointer;transition:background 0.1s,color 0.1s;overflow:hidden;
            "
            onmouseover="this.style.background='var(--mon-surface2)';this.style.borderColor='var(--mon-accent-border)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'"
            onmouseout="this.style.background='var(--mon-surface)';this.style.borderColor='var(--mon-border)';this.style.transform='';this.style.boxShadow=''">

            <!-- Painel lateral score -->
            <div style="
              flex-shrink:0;width:52px;
              background:${aptBg};border-right:1px solid ${aptBrd};
              display:flex;flex-direction:column;align-items:center;justify-content:center;
              padding:10px 4px;gap:1px;
            ">
              <div style="font-size:10px;font-weight:800;color:${aptCor};line-height:1;">${icone}</div>
              <div style="font-size:18px;font-weight:800;color:${aptCor};line-height:1;margin-top:2px;">${e.apontado}</div>
              <div style="font-size:9px;color:${aptCor};opacity:0.6;font-weight:600;line-height:1;">/${e.solicitado}</div>
              <div style="margin-top:4px;width:28px;height:2px;background:${aptBrd};border-radius:2px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${aptCor};border-radius:2px;"></div>
              </div>
            </div>

            <!-- Info principal -->
            <div style="flex:1;min-width:0;padding:9px 10px 9px 11px;">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:5px;">
                <span style="font-family:var(--mon-mono);font-size:11.5px;font-weight:700;
                  color:var(--mon-accent);background:var(--mon-accent-bg);
                  border:1px solid var(--mon-accent-border);border-radius:4px;padding:1px 7px;letter-spacing:-0.2px;">${e.chave || '—'}</span>
                ${sigla}${hora}
              </div>
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                ${lider ? lider + '<span style="color:var(--mon-border);font-size:10px;">·</span>' : ''}
                <span style="font-size:10px;color:var(--mon-text-faint);">
                  por <strong style="color:var(--mon-text-dim);font-weight:600;">${e.quemEnviou || '?'}</strong>
                  <span style="opacity:0.6;">às ${enviado}</span>
                </span>
              </div>
            </div>

            <!-- Seta -->
            <div style="flex-shrink:0;display:flex;align-items:center;padding:0 10px;">
              <span style="font-size:16px;color:var(--mon-text-faint);opacity:0.5;">›</span>
            </div>
          </div>`;
      });
    });
    body.innerHTML = html;
  };

  // Abre a op pelo histórico — usa loadiframe direto (igual "Abrir OP"),
  // funciona mesmo que a op não esteja mais na lista atual.

  // ── MODAL DE DETALHE DO HISTÓRICO ────────────────────────────────────────────
  function _monEnsureHistDetModal() {
    if (document.getElementById('mon-hist-det-modal')) return;
    const m = document.createElement('div');
    m.id = 'mon-hist-det-modal';
    m.style.cssText = [
      'display:none;position:fixed;inset:0;z-index:10000000;',
      'align-items:center;justify-content:center;',
      'background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);',
      'font-family:var(--mon-font);padding:16px;'
    ].join('');
    m.innerHTML = `
      <div id="mon-hist-det-box" style="
        background:var(--mon-bg);
        border-radius:16px;
        width:900px;max-width:96vw;max-height:90vh;
        display:flex;flex-direction:column;overflow:hidden;
        animation:mon-fadein 0.1s ease;
        box-shadow:0 24px 72px rgba(0,0,0,0.45),0 0 0 1px var(--mon-border);
      ">
        <!-- HEADER -->
        <div style="
          padding:13px 16px 12px;flex-shrink:0;
          background:var(--mon-surface);
          border-bottom:1px solid var(--mon-border);
          display:flex;align-items:center;gap:10px;
        ">
          <!-- Ícone -->
          <div style="
            width:30px;height:30px;border-radius:8px;flex-shrink:0;
            background:var(--mon-blue-bg);border:1px solid var(--mon-blue-border);
            display:flex;align-items:center;justify-content:center;font-size:14px;
          ">🕐</div>

          <!-- Chave + meta -->
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;">
            <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
              <span id="mon-hist-det-chip" style="
                font-family:var(--mon-mono);font-size:12.5px;font-weight:700;
                color:var(--mon-accent);background:var(--mon-accent-bg);
                border:1px solid var(--mon-accent-border);
                border-radius:5px;padding:2px 10px;letter-spacing:-0.3px;
              "></span>
              <span id="mon-hist-det-meta" style="
                font-size:10.5px;color:var(--mon-text-faint);font-weight:500;
              "></span>
            </div>
            <div style="font-size:9.5px;color:var(--mon-text-faint);opacity:0.7;letter-spacing:0.1px;display:flex;align-items:center;gap:5px;">
              Histórico de Reports
              <span style="display:inline-flex;align-items:center;gap:4px;color:var(--mon-green);opacity:1;">
                <span id="mon-hist-det-hg-icon" style="font-size:11px;">⏳</span>
                <span id="mon-hist-det-hg-count" style="font-family:var(--mon-mono);font-size:10px;font-weight:700;color:var(--mon-green);">30s</span>
              </span>
            </div>
          </div>

          <!-- Botão Abrir OP -->
          <button id="mon-hist-det-abrir-op" style="
            display:flex;align-items:center;gap:5px;
            padding:6px 13px;border-radius:8px;flex-shrink:0;
            border:1px solid var(--mon-accent-border);
            background:var(--mon-accent-bg);
            color:var(--mon-accent);font-size:11px;font-weight:700;
            cursor:pointer;transition:background 0.1s,color 0.1s;font-family:var(--mon-font);
            letter-spacing:-0.1px;
          "
          onmouseover="this.style.background='var(--mon-accent)';this.style.color='#fff';this.style.borderColor='var(--mon-accent)';this.style.boxShadow='0 2px 8px rgba(79,70,229,0.3)'"
          onmouseout="this.style.background='var(--mon-accent-bg)';this.style.color='var(--mon-accent)';this.style.borderColor='var(--mon-accent-border)';this.style.boxShadow=''">
            🔎 Abrir OP
          </button>

          <!-- Fechar -->
          <button onclick="window._monFecharHistDet()" style="
            width:28px;height:28px;border-radius:7px;flex-shrink:0;
            border:1px solid var(--mon-border);background:transparent;
            color:var(--mon-text-faint);font-size:13px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;transition:background 0.1s,color 0.1s;
          " onmouseover="this.style.background='var(--mon-surface3)';this.style.color='var(--mon-text)'"
             onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)'">✕</button>
        </div>
        <!-- CONTEÚDO -->
        <div id="mon-hist-det-inner" style="flex:1;overflow-y:auto;padding:16px;background:var(--mon-bg);border-top:none;animation:none;"></div>
      </div>`;
    m.addEventListener('click', e => { if (e.target === m) window._monFecharHistDet(); });
    document.body.appendChild(m);
  }

  window._monFecharHistDet = function() {
    const m = document.getElementById('mon-hist-det-modal');
    if (m) m.style.display = 'none';
    if (window._monHistDetRefresh)   { clearInterval(window._monHistDetRefresh);   window._monHistDetRefresh = null; }
    if (window._monHistDetCountdown) { clearInterval(window._monHistDetCountdown); window._monHistDetCountdown = null; }
    // Reabre o modal do histórico (usuário veio de lá)
    const hist = document.getElementById('mon-hist-modal');
    if (hist) hist.style.display = 'flex';
  };

  window._monAbrirDoHistorico = function(opId) {
    window._monFecharHistorico(true); // fecha histórico sem resetar o rail
    _monEnsureHistDetModal();

    const modal = document.getElementById('mon-hist-det-modal');
    const inner = document.getElementById('mon-hist-det-inner');
    const chip  = document.getElementById('mon-hist-det-chip');

    // Garante que a op existe em operations (injeta temporariamente se necessário)
    let op = operations.find(o => o.id === opId);
    if (!op) {
      const hist = _reportHist.find(e => e.opId === opId);
      if (!hist) { _monToast('Operação não encontrada no histórico.', 'error'); return; }
      op = {
        id: hist.opId, chave: hist.chave, sigla: hist.sigla || '',
        site: hist.site || '', hora: hist.hora || '',
        lider: (hist.lideres && hist.lideres[0]) || '',
        liderCompleto: (hist.lideres && hist.lideres[0]) || '',
        qtd: hist.solicitado || 0,
        status: '', time: '', bubbles: [], escAtual: -1, _fromHist: true
      };
      operations.push(op);
    } else {
      // Garante _fromHist em toda abertura pelo histórico (inclusive reopens múltiplos)
      op._fromHist = true;
    }

    if (chip) chip.textContent = op.chave;
    const meta = document.getElementById('mon-hist-det-meta');
    if (meta) {
      const parts = [op.sigla, op.hora].filter(Boolean);
      meta.textContent = parts.join(' · ');
    }

    // Liga o botão "Abrir OP" do header ao opId correto
    const abrirOpBtn = document.getElementById('mon-hist-det-abrir-op');
    if (abrirOpBtn) {
      abrirOpBtn.onclick = function() {
        if (typeof loadiframe === 'function') {
          loadiframe('planejamento-operacional-edit' + op.id + '_3', 'Editar Planejamento', 570, 'modal1500');
          if (window.$) {
            $('#modal1500').modal('show');
            setTimeout(function() {
              var backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.style.zIndex = '9999990';
              var modalEl = document.getElementById('modal1500');
              if (modalEl) modalEl.style.zIndex = '9999991';
            }, 80);
          }
        }
        var _hd = document.getElementById('mon-hist-det-modal');
        if (_hd) _hd.style.display = 'none';
        var _p = document.getElementById('mon-panel');
        if (window._monMinimize && _p && _p.dataset.minimized !== '1') window._monMinimize();
      };
    }

    // Mostra loading e abre o modal
    inner.innerHTML = `<div class="mon-loading-detail"><div class="mon-loading-spinner"></div>Carregando dados…</div>`;
    modal.style.display = 'flex';

    // Função que renderiza quando os dados chegarem
    // Re-busca op em operations para garantir que _fromHist está presente mesmo após update
    const _render = () => {
      const _opR = operations.find(o => o.id === op.id) || op;
      _opR._fromHist = true;
      inner.innerHTML = renderDetail(_opR);
    };

    const cached = apontCache[op.id];
    if (cached && cached !== 'loading') {
      _render();
    } else {
      monitoradas.add(monKey(op));
      if (!cached) apontCache[op.id] = 'loading';
      inQueue.delete(op.id);
      enfileirar(op, () => { _render(); updateMetrics(); }, true);

      // Poll enquanto loading
      const poll = setInterval(() => {
        const c = apontCache[op.id];
        if (c && c !== 'loading') { clearInterval(poll); _render(); }
      }, 200);
      setTimeout(() => clearInterval(poll), 40000);
    }

    // ── Atualização contínua enquanto o modal estiver aberto ──
    if (window._monHistDetRefresh)   clearInterval(window._monHistDetRefresh);
    if (window._monHistDetCountdown) clearInterval(window._monHistDetCountdown);

    // Contagem regressiva
    const _HIST_DET_INTERVAL = 30;
    let _histDetRemaining = _HIST_DET_INTERVAL;
    const _tickHistDet = () => {
      const icon  = document.getElementById('mon-hist-det-hg-icon');
      const count = document.getElementById('mon-hist-det-hg-count');
      if (!count) return;
      count.textContent = _histDetRemaining + 's';
      if (icon) icon.textContent = (_histDetRemaining % 2 === 0) ? '⏳' : '⌛';
      _histDetRemaining--;
      if (_histDetRemaining < 0) _histDetRemaining = _HIST_DET_INTERVAL;
    };
    _tickHistDet();
    window._monHistDetCountdown = setInterval(_tickHistDet, 1000);

    // Refresh a cada 30s
    window._monHistDetRefresh = setInterval(() => {
      const m = document.getElementById('mon-hist-det-modal');
      if (!m || m.style.display === 'none') {
        clearInterval(window._monHistDetRefresh);
        clearInterval(window._monHistDetCountdown);
        window._monHistDetRefresh = null;
        window._monHistDetCountdown = null;
        return;
      }
      // Re-busca op e garante _fromHist (pode ter sido substituída no update de operations)
      const _opFresh = operations.find(o => o.id === op.id) || op;
      _opFresh._fromHist = true;
      inQueue.delete(_opFresh.id);
      enfileirar(_opFresh, () => {
        const still = document.getElementById('mon-hist-det-modal');
        if (still && still.style.display !== 'none') {
          inner.innerHTML = renderDetail(_opFresh);
        }
      }, true);
    }, 30000);
  };

  // ── SNAPSHOT DE ESCALADOS (compartilhado via Supabase — sincroniza entre usuários) ──
  const SNAP_KEY = '_monEscSnap_v1'; // mantido apenas para migração/fallback

  // { [opId]: { lista: [{nome, cpf, tipo}], ts: timestamp } }
  let escaladosSnapshot = {};
  let _snapCarregado = false; // true após snapLoadRemote terminar pela 1ª vez
  let _snapPendentes = []; // ops que chegaram antes do snapLoadRemote terminar

  // Carrega do Supabase (chamado na inicialização e pelo polling)
  // Versão leve: só busca remoto se ainda não carregou, senão executa callback direto
  function snapEnsureLoaded(cb) {
    if (_snapCarregado) { if (cb) cb(); return; }
    snapLoadRemote(cb);
  }

  function snapLoadRemote(cb) {
    try {
      const old = sessionStorage.getItem(SNAP_KEY);
      if (old) {
        const parsed = JSON.parse(old);
        if (Object.keys(parsed).length > 0) {
          escaladosSnapshot = parsed;
          sessionStorage.removeItem(SNAP_KEY);
          snapSaveRemote();
        }
      }
    } catch(e) {}

    _sbGet('escaladosSnap', remote => {
      Object.entries(remote).forEach(([opId, val]) => {
        const loc = escaladosSnapshot[opId];
        if (!loc || (val.ts && loc.ts && val.ts > loc.ts)) {
          escaladosSnapshot[opId] = val;
        }
      });
      _snapCarregado = true;
      let _haviaPendentes = _snapPendentes.length > 0;
      _snapPendentes.forEach(({ opId, escalados }) => {
        if (!escaladosSnapshot[opId]) {
          snapSet(opId, escalados);
        }
      });
      _snapPendentes = [];
      if (cb) cb();
      // Após snap remoto carregar, reprocessar TODAS as ops que já têm cache
      // Isso garante a bolinha mesmo que o cache chegou antes do snap
      setTimeout(() => {
        operations.forEach(op => {
          const d = apontCache[op.id];
          if (d && d !== 'loading') _updateSnapDotForOp(op);
        });
      }, 0);
    });
  }

  function snapSaveRemote(cb) {
    _sbSet('escaladosSnap', escaladosSnapshot, cb);
  }

  // Compatibilidade: snapSave agora salva remoto
  function snapSave() { snapSaveRemote(); }

  // Reseta todos os snapshots para o estado atual (apaga as bolinhas vermelhas de todas as ops)
  window._monLimparBolinhas = function() {
    let resetadas = 0;
    operations.forEach(op => {
      const d = apontCache[op.id];
      if (d && d !== 'loading' && d.escalados && d.escalados.length > 0) {
        snapSet(op.id, d.escalados);
        resetadas++;
      } else {
        // Sem dados em cache: zera o snapshot para que não gere alerta falso
        delete escaladosSnapshot[op.id];
      }
    });
    snapSaveRemote(() => {
      _updateSnapDots();
      renderTable();
    });
    const msg = resetadas > 0
      ? `Bolinhas limpas em ${resetadas} operação(ões). O estado atual virou o novo ponto de referência.`
      : 'Nenhuma operação com dados carregados. Tente após atualizar as ops (↻).';
    alert(msg);
  };

  // { [opId]: { lista: [{nome, cpf, tipo}], ts: timestamp } }
  // escaladosSnapshot já declarado acima — carregado via snapLoadRemote() na init

  // Salva snapshot de uma op (lista atual de escalados)
  // Preserva o horário de entrada (hrEntrou) de quem já estava no snapshot anterior
  function snapSet(opId, escalados) {
    const anterior = escaladosSnapshot[opId];
    const hrAnterior = {}; // cpf → hrEntrou
    if (anterior && anterior.lista) {
      anterior.lista.forEach(e => { if (e.cpf && e.hrEntrou) hrAnterior[e.cpf] = e.hrEntrou; });
    }
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const lista = (escalados || []).map(e => ({
      nome: e.nome, cpf: e.cpf, tipo: e.tipo,
      hrEntrou: hrAnterior[e.cpf] || agora  // mantém horário original se já estava
    }));
    escaladosSnapshot[opId] = { lista, ts: Date.now() };
    snapSave();
  }

  // Retorna diff { saiu: [...], entrou: [...] } ou null se sem snapshot
  // Bolinha vermelha só aparece quando alguém ENTROU (saiu não gera alerta)
  function snapDiff(opId, escaladosAtuais) {
    const snap = escaladosSnapshot[opId];
    if (!snap || !snap.lista) return null;
    const cpfAnt = new Set(snap.lista.map(e => e.cpf));
    const cpfNow = new Set((escaladosAtuais || []).map(e => e.cpf));
    const saiu   = snap.lista.filter(e => !cpfNow.has(e.cpf));
    const entrou = (escaladosAtuais || []).filter(e => !cpfAnt.has(e.cpf));
    if (saiu.length === 0 && entrou.length === 0) return null;
    // Busca horários já gravados no snapshot (entradas anteriores detectadas)
    const hrSnap = {}; // cpf → hrEntrou já persistido
    (snap.entradas || []).forEach(e => { if (e.cpf && e.hrEntrou) hrSnap[e.cpf] = e.hrEntrou; });
    // Para quem entrou agora e ainda não tem hrEntrou registrado, grava o horário atual
    // e persiste no snapshot para não mudar nas próximas chamadas
    let persistiu = false;
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    entrou.forEach(e => {
      if (e.cpf && !hrSnap[e.cpf]) {
        hrSnap[e.cpf] = agora;
        persistiu = true;
      }
    });
    if (persistiu) {
      // Salva as entradas detectadas com horário fixo no snapshot
      snap.entradas = Object.entries(hrSnap).map(([cpf, hrEntrou]) => ({ cpf, hrEntrou }));
      snapSaveRemote();
    }
    const entrouComHr = entrou.map(e => ({ ...e, hrEntrou: hrSnap[e.cpf] || agora }));
    // Bolinha só aparece se alguém entrou
    if (entrou.length === 0) return { saiu, entrou: entrouComHr, _soSaiu: true };
    return { saiu, entrou: entrouComHr };
  }

  // ── CACHE PERSISTENTE (sessionStorage) ──────────────────────────────────────
  const CACHE_KEY = '_monCache_v2';
  const CACHE_TTL = 5 * 60 * 1000;

  function cacheSave() {
    try {
      const payload = {};
      Object.entries(apontCache).forEach(([k, v]) => {
        if (v && v !== 'loading') payload[k] = { d: v, ts: Date.now() };
      });
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch(e) {}
  }

  function cacheLoad() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      const payload = JSON.parse(raw);
      const now = Date.now();
      const out = {};
      Object.entries(payload).forEach(([k, v]) => {
        if (v && v.d && (now - v.ts) < CACHE_TTL) {
          out[k] = v.d;
        }
      });
      return out;
    } catch(e) { return {}; }
  }

  // ── IFRAMES ─────────────────────────────────────────────────────────────────
  function criarIfr(id) {
    if (document.getElementById(id)) return;
    _hiddenIframe(id);
  }

  function ensureIframes() {
    BG_IFRAME_IDS.forEach(criarIfr);
    criarIfr(IFR_PAG2);
    criarIfr(IFR_ESCALA);
  }

  function releaseIfr(ifrId) {
    delete iframesInUse[ifrId];
    const ifr = document.getElementById(ifrId);
    if (ifr) {
      ifr.onload = null;
      try { ifr.src = 'about:blank'; } catch(e) {}
    }
    setTimeout(processQueue, 50);
  }

  function startWatchdog() {
    if (watchdogTimer) clearInterval(watchdogTimer);
    watchdogTimer = setInterval(() => {
      const now = Date.now();
      Object.entries(iframesInUse).forEach(([key, info]) => {
        if (now - info.since > 35000) {
          console.warn('[Monitor] watchdog destravou', key, 'op:', info.opId);
          if (info.opId && apontCache[info.opId] === 'loading') {
            apontCache[info.opId] = {
              solicitado: 0, escalado: 0, apontado: 0,
              colaboradores: [], escalados: [], faltando: [],
              pdfLinks: [], xlsLinks: [], _erro: true
            };
          }
          delete iframesInUse[key];
          activeFetches = Math.max(0, activeFetches - 1);
        }
      });
      if (fetchQueue.length > 0 && activeFetches < MAX_CONCURRENT()) {
        processQueue();
      }
    }, 8000);
  }

  // ── JANELA ──────────────────────────────────────────────────────────────────
  function dentroJanela(op) {
    if (!op.hora) return false;
    const [h, m] = op.hora.split(':').map(Number);
    if (isNaN(h)) return false;

    // Usa a data real da chave (ex: SRRDHL17052026...) para não confundir ops de dias diferentes
    if (op.chave) {
      const matchData = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
      if (matchData) {
        const dia = parseInt(matchData[1]);
        const mes = parseInt(matchData[2]) - 1;
        const ano = parseInt(matchData[3]);
        const opDate = new Date(ano, mes, dia, h, m || 0, 0);
        const diffMin = (opDate - new Date()) / 60000;
        // Ops passadas: sempre inclui; futuras: apenas até +3h
        return diffMin <= 180;
      }
    }

    // Fallback sem data: só hora do dia
    const agora    = new Date();
    const agoraMin = agora.getHours() * 60 + agora.getMinutes();
    const opMin    = h * 60 + (m || 0);
    let diffMin    = opMin - agoraMin;
    if (diffMin > 180) diffMin -= 1440;
    return diffMin <= 180;
  }

  // Retorna true quando falta menos de 1h para a operação (ou já passou)
  function dentroJanela1h(op) {
    if (!op.hora) return false;
    const [h, m] = op.hora.split(':').map(Number);
    if (isNaN(h)) return false;

    // Extrai data da chave (formato: SIGLA + DDMMAA + resto)
    // Ex: SRRDHL170520268600 → dia=17, mes=05, ano=2026
    if (op.chave) {
      const matchData = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
      if (matchData) {
        const dia = parseInt(matchData[1]);
        const mes = parseInt(matchData[2]) - 1;
        const ano = parseInt(matchData[3]);
        const opDate = new Date(ano, mes, dia, h, m || 0, 0);
        const diffMin = (opDate - new Date()) / 60000;
        return diffMin <= 60;
      }
    }

    // Fallback: usa só hora do dia
    const agora    = new Date();
    const agoraMin = agora.getHours() * 60 + agora.getMinutes();
    const opMin    = h * 60 + (m || 0);
    let diffMin    = opMin - agoraMin;
    if (diffMin < -180) diffMin += 1440;
    return diffMin <= 60;
  }

  function monKey(op) { return op.id || op.chave; }
  function naJanela(op) { return monitoradas.has(monKey(op)) || dentroJanela(op); }

  // ── PARSER DE OPS ────────────────────────────────────────────────────────────
  function parseBubble(img) {
    if (!img) return null;
    const src = img.getAttribute('src') || '';
    const title = img.getAttribute('data-original-title') || img.getAttribute('title') || '';
    let status = 0;
    if (src.includes('statusbubble_1')) status = 1;
    else if (src.includes('statusbubble_2')) status = 2;
    else if (src.includes('statusbubble_3')) status = 3;
    else return null;
    return { status, title };
  }

  function parseOpsFromDoc(doc) {
    const ops = [];
    const mainTable = doc.querySelector('table tbody');
    if (!mainTable) return ops;
    mainTable.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 9) return;
      const allLinks = [...row.querySelectorAll('a[onclick*="planejamento-operacional-edit"]')];
      const linkEl = allLinks[0] || null;
      const linkElView = allLinks[1] || null; // olhinho = segundo link
      const eyeLink = row.querySelector('a[href*="pedidoEgeral"]') || row.querySelector('a[href*="pedidoE"]');
      let id = '';
      if (linkEl) {
        const match = linkEl.getAttribute('onclick').match(/planejamento-operacional-edit([A-Za-z0-9+\/=_-]+?)_\d+[',\s]/);
        if (match) id = match[1];
      }
      const g = i => cells[i]?.textContent?.trim() || '';
      const bubbles = [];
      row.querySelectorAll('img[src*="statusbubble_"]').forEach(img => {
        const b = parseBubble(img);
        if (b) bubbles.push(b);
      });
      const liderCell = cells[11];
      const lider = liderCell?.getAttribute('title') || liderCell?.getAttribute('data-original-title') || liderCell?.textContent?.trim() || '';
      window._monLinkEls = window._monLinkEls || {}; window._monLinkElsView = window._monLinkElsView || {}; window._monEyeHrefs = window._monEyeHrefs || {};
      if (linkEl && id) window._monLinkEls[id] = linkEl;
      if (linkElView && id) window._monLinkElsView[id] = linkElView;
      if (eyeLink && id) window._monEyeHrefs[id] = eyeLink.getAttribute('href');
      ops.push({ chave: g(0), sigla: g(1), site: g(2), qtd: parseInt(g(3)) || 0, hora: g(9), dataOp: g(10), lider, liderCompleto: lider, status: g(24).toLowerCase(), time: g(8), id, bubbles,
        anot: g(12),
        // Tenta extrair escalado atual da coluna ESC/SOL da tabela principal (ex: "3/3" → 3)
        escAtual: (() => { const m = (g(4)||'').match(/^(\d+)\//); return m ? parseInt(m[1]) : -1; })(),
        // Extrai carga horária da coluna CARGA HORÁRIA da tabela principal (ex: 1D8H, 1D10H, 3D10H)
        cargaHoraria: (() => { const raw = g(25); return /^[1-9]D\d+H$/i.test(raw) ? raw.toUpperCase() : ''; })()
      });
    });
    return ops;
  }

  // ── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
  function pedirPermissaoNotificacao() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('🔔 Monitor - Brendu\'s', { body: 'Notificações já estão ativas!', icon: AVATAR_URL });
      return;
    }
    if (Notification.permission === 'denied') {
      alert('Notificações bloqueadas!\n\n1. Clique no cadeado\n2. Notificações → Permitir\n3. Recarregue');
      return;
    }
    Notification.requestPermission().then(perm => {
      const btn = document.getElementById('mon-notif-btn');
      if (perm === 'granted') {
        new Notification('✅ Monitor TSI ativado!', { body: 'Você receberá alertas.', icon: AVATAR_URL });
        if (btn) { btn.textContent = 'Notif. ativa'; btn.dataset.state = 'on'; }
      } else {
        if (btn) { btn.textContent = 'Bloqueado'; btn.dataset.state = 'off'; }
      }
    });
  }

  // Op considerada concluída quando todos os P1–P11 estão marcados como "Sim" no modal
  // Usa o campo todosConfirmados gravado no cache durante o fetch da operação
  function isConcluido(op) {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return false;
    return d.todosConfirmados === true;
  }

  function notify(op, d) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if ((op.time || '') !== 'VD') return;
    if (isConcluido(op)) return; // ← não notifica ops já concluídas
    const _nt = '✅ Operação Completa — TSI', _nb = `${op.sigla} | ${op.site}\n${d.apontado}/${d.solicitado} apontados`;
    _notifHistAdd({ tipo: 'op_completa', icone: '✅', titulo: _nt, corpo: _nb, chave: op.chave||'', sigla: op.sigla||'', site: op.site||'' });
    try { new Notification(_nt, { body: _nb, icon: AVATAR_URL }); } catch(e) {}
  }

  function notifyEscala(op, d) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const _et = '📋 Escala Completa — TSI', _eb = `${op.sigla} | ${op.site}\n${d.escalado}/${op.qtd} escalados`;
    _notifHistAdd({ tipo: 'escala_completa', icone: '📋', titulo: _et, corpo: _eb, chave: op.chave||'', sigla: op.sigla||'', site: op.site||'' });
    try {
      new Notification(_et, { body: _eb, icon: AVATAR_URL });
    } catch(e) {}
  }

  function notifyEscChange(op, entrouList, saiuList) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const local = op.site || op.sigla || op.chave;
    try {
      if (entrouList && entrouList.length > 0) {
        const nomes = entrouList.map(e => e.nome || e.cpf).join(', ');
        const body = entrouList.length === 1
          ? `${op.chave} · ${local}\n👤 ${nomes} entrou na escala`
          : `${op.chave} · ${local}\n👥 ${entrouList.length} pessoas entraram: ${nomes}`;
        _notifHistAdd({ tipo: 'esc_entrou', icone: '🔴', titulo: '🔴 Mudança na Escala — TSI', corpo: body, chave: op.chave||'', sigla: op.sigla||'', site: op.site||'' });
        new Notification('🔴 Mudança na Escala — TSI', {
          body, icon: AVATAR_URL,
          tag: 'esc-entrou-' + op.id,
          requireInteraction: false
        });
      }
      if (saiuList && saiuList.length > 0) {
        const nomes = saiuList.map(e => e.nome || e.cpf).join(', ');
        const body = saiuList.length === 1
          ? `${op.chave} · ${local}\n❌ ${nomes} saiu da escala`
          : `${op.chave} · ${local}\n❌ ${saiuList.length} pessoas saíram: ${nomes}`;
        _notifHistAdd({ tipo: 'esc_saiu', icone: '⚠️', titulo: '⚠️ Saída na Escala — TSI', corpo: body, chave: op.chave||'', sigla: op.sigla||'', site: op.site||'' });
        new Notification('⚠️ Saída na Escala — TSI', {
          body, icon: AVATAR_URL,
          tag: 'esc-saiu-' + op.id,
          requireInteraction: false
        });
      }
    } catch(e) {}
  }

  window._monPedirNotif = pedirPermissaoNotificacao;

  // ── PROGRESSO ────────────────────────────────────────────────────────────────
  function updateProgress(loaded, total) {
    const circle  = document.getElementById('mon-progress-circle');
    const overlay = document.getElementById('mon-progress-overlay');
    const text    = document.getElementById('mon-progress-text');
    const img     = document.getElementById('mon-avatar-img');
    if (!circle || !overlay || !text) return;
    const pct  = total === 0 ? 100 : Math.round((loaded / total) * 100);
    const r    = 22, circ = 2 * Math.PI * r;
    circle.style.strokeDashoffset = circ - (pct / 100) * circ;
    if (pct >= 100) {
      circle.style.stroke   = 'var(--mon-green)';
      overlay.style.opacity = '0';
      text.style.display    = 'none';
      if (img) { img.style.animation = 'none'; img.style.transform = 'none'; }
    } else {
      circle.style.stroke   = 'var(--mon-amber)';
      overlay.style.opacity = '0.55';
      text.style.display    = 'flex';
      text.textContent      = pct + '%';
      if (img) img.style.animation = 'mon-shake 0.5s ease-in-out infinite alternate';
    }
  }

  // ── FETCH COM DOMPARSER (substitui iframes) ──────────────────────────────────
  // Como o script roda no contexto da página (mesma origem), fetch funciona direto.
  function fetchDoc(url) {
    // Deduplicação: se já há fetch em voo para esta URL, retorna a mesma Promise
    if (_fetchInFlight[url]) { _diag.tsi.cancelados++; return _fetchInFlight[url]; }
    const t0 = Date.now();
    _diag.tsi.total++;
    _diag.tsi._minAtual++;
    _diag.tsi.ultimaReq = Date.now();
    const p = fetch(url, { credentials: 'include' })
      .then(r => {
        if (!r.ok) {
          _diag.tsi.erros++;
          _diag.tsi.ultimoErro = { ts: Date.now(), status: r.status, url };
          throw new Error('HTTP ' + r.status);
        }
        return r.text();
      })
      .then(html => {
        const ms = Date.now() - t0;
        _diag.tsi.tempos.push(ms);
        if (_diag.tsi.tempos.length > 200) _diag.tsi.tempos.shift();
        _diag.tsi.bytes += html.length;
        delete _fetchInFlight[url];
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
      })
      .catch(e => {
        _diag.tsi.erros++;
        delete _fetchInFlight[url];
        throw e;
      });
    _fetchInFlight[url] = p;
    return p;
  }

  // ── DIAGNÓSTICO DE REQUISIÇÕES ───────────────────────────────────────────────
  const _diag = {
    tsi: {
      total: 0,           // total de requisições feitas
      erros: 0,           // requisições com erro (4xx, 5xx, timeout)
      tempos: [],         // histórico de tempos de resposta (ms)
      cancelados: 0,      // fetches cancelados por dedup
      porMinuto: [],      // histórico de req/min { t, n }
      _minAtual: 0,       // contador do minuto atual
      _minTs: Date.now(), // timestamp início do minuto atual
      bytes: 0,           // bytes baixados estimados
      ultimoErro: null,   // { ts, status, url }
      ultimaReq: null,    // timestamp da última requisição
    },
    sb: {
      gets: 0, sets: 0, cacheHits: 0,
    },
    ops: {
      total: 0,           // total de ops carregadas
      rejeitadas: 0,      // ops que falharam no fetch
    },
    inicio: Date.now(),
  };

  // Registra um novo minuto de req/min a cada 60s
  setInterval(() => {
    const agora = Date.now();
    const elapsed = (agora - _diag.tsi._minTs) / 1000;
    if (elapsed >= 55) { // ~1 minuto
      _diag.tsi.porMinuto.push({ t: agora, n: _diag.tsi._minAtual });
      if (_diag.tsi.porMinuto.length > 60) _diag.tsi.porMinuto.shift();
      _diag.tsi._minAtual = 0;
      _diag.tsi._minTs = agora;
    }
  }, 60 * 1000);
  // Deduplicação: evita dois fetches simultâneos para a mesma URL
  const _fetchInFlight = {};

  // ── FILA COM DEDUPLICAÇÃO ────────────────────────────────────────────────────
  // Concorrência dinâmica: igual ao número de ops na janela (mínimo 5)
  let activeFetches = 0;
  function MAX_CONCURRENT() {
    const opsNaJanela = (typeof operations !== 'undefined' && Array.isArray(operations))
      ? operations.filter(o => o.id && naJanela(o)).length
      : 0;
    return Math.max(5, opsNaJanela);
  }

  function getAvailableIframe() {
    return BG_IFRAME_IDS.find(id => !iframesInUse[id]);
  }

  function loadUrl(ifr, url, timeout, onDone) {
    // Mantido apenas para compatibilidade com enviarEscala
    let fired = false;
    const fire = (result) => {
      if (fired) return;
      fired = true;
      clearTimeout(timer);
      ifr.onload = null;
      onDone(result);
    };
    const timer = setTimeout(() => fire(null), timeout);
    ifr.onload = function() {
      try {
        const href = ifr.contentDocument && ifr.contentDocument.location && ifr.contentDocument.location.href;
        if (!href || href === 'about:blank') return;
      } catch(e) {}
      setTimeout(() => {
        try { fire(ifr.contentDocument); }
        catch(e) { fire(null); }
      }, 1800);
    };
    try { ifr.src = url; } catch(e) { fire(null); }
  }

  function processQueue() {
    if (fetchQueue.length === 0) return;
    if (activeFetches >= MAX_CONCURRENT()) return;

    const { op, callback } = fetchQueue.shift();
    inQueue.delete(op.id);

    if (!op.id) { setTimeout(processQueue, 10); return; }

    activeFetches++;
    // Marca um slot de iframe como "em uso" só pro watchdog continuar funcionando
    const fakeId = '_fetch_' + op.id;
    iframesInUse[fakeId] = { opId: op.id, since: Date.now() };

    const oldCache = (apontCache[op.id] && apontCache[op.id] !== 'loading') ? apontCache[op.id] : null;

    const release = (dados) => {
      activeFetches--;
      delete iframesInUse[fakeId];
      if (dados !== null) {
        // Preserva dados ADTO/vales do cache anterior se o novo fetch não os trouxer
        if (oldCache) {
          if ((!dados.vales || dados.vales.length === 0) && oldCache.vales && oldCache.vales.length > 0) dados.vales = oldCache.vales;
        }
        // ── Snapshot inicial: salva escalados se listaEnviada e ainda não tem snapshot
        // Aguarda snapLoadRemote terminar para não sobrescrever snapshot remoto existente
        if (dados.listaEnviada && dados.escalados && dados.escalados.length > 0) {
          if (_snapCarregado) {
            if (!escaladosSnapshot[op.id]) {
              snapSet(op.id, dados.escalados);
            }
          } else {
            _snapPendentes.push({ opId: op.id, escalados: dados.escalados });
          }
        }
        apontCache[op.id] = dados;
        // Atualiza detalhe expandido se estiver aberto para refletir vales atualizados
        if (expanded.has(op.chave)) {
          const idx = operations.findIndex(o => o.chave === op.chave);
          const det = document.getElementById('det-' + op.chave);
          if (det) det.querySelector('.mon-detail-inner').innerHTML = renderDetail(op);
        }
      }
      callback(apontCache[op.id], oldCache);
      updateMetrics();
      setTimeout(processQueue, 0);
    };

    const fallback = (escalados) => {
      release({
        solicitado: op.qtd, escalado: escalados.length, apontado: 0,
        colaboradores: [], escalados: escalados || [],
        faltando: escalados || [], pdfLinks: [], xlsLinks: [],
        vales: oldCache?.vales || []
      });
    };

    if (!apontCache[op.id]) apontCache[op.id] = 'loading';

    // 1) Busca a página da operação para pegar os links de escala e apontamento
    fetchDoc('https://tsi-app.com/planejamento-operacional-edit' + op.id + '_1')
      .then(doc => {
        let listaEnviada = false, todosConfirmados = false;
        try {
          let etapa = 0, confirmadas = 0;
          doc.querySelectorAll('table tbody tr').forEach(row => {
            const radios = row.querySelectorAll('input[type="radio"]');
            if (radios.length >= 2) { etapa++; if (radios[0].checked) confirmadas++; }
          });
          listaEnviada     = etapa >= 8  && confirmadas >= 8;
          todosConfirmados = etapa >= 11 && confirmadas >= 11;
        } catch(e) {}



        let escalaHref, eaptHref;
        const escalaLink = doc.querySelector('a[href*="pedidoEescala"]');
        const eaptLink   = doc.querySelector('a[href*="pedidoEapt"]');
        let _egeralHref = '';
        if (escalaLink && eaptLink) {
          escalaHref = escalaLink.getAttribute('href');
          eaptHref   = eaptLink.getAttribute('href');
          // extrai o egeralHref a partir do escalaHref
          _egeralHref = escalaHref.replace('pedidoEescala', 'pedidoEgeral');
        } else {
          const eg = doc.querySelector('a[href*="pedidoEgeral"]');
          if (!eg) { fallback([]); return; }
          _egeralHref = eg.getAttribute('href');
          escalaHref = _egeralHref.replace('pedidoEgeral', 'pedidoEescala');
          eaptHref   = _egeralHref.replace('pedidoEgeral', 'pedidoEapt');
        }
        // Salva o href do pedidoEgeral para o fetch de advisors
        if (_egeralHref) _convCache[op.id] = { egeralHref: _egeralHref, rows: null, ts: 0 };

        // 2) Busca escala
        return fetchDoc('https://tsi-app.com/' + escalaHref)
          .then(doc2 => {
            const escalados = [], pdfLinks = [], xlsLinks = [];

            // ── Identifica colunas ADTO TR e ADTO AL ────────────────────────────────
            // Estratégia: lê ROW0 do thead somando colspans diretamente (sem grade virtual)
            // Estrutura real confirmada: ROW0 tem "ADTO. TR" cs=2 e "ADTO. AL" cs=2
            let colAdtoTr = -1, colAdtoAl = -1;
            const escTbl = doc2.querySelector('table.tables.table-fixed.card-table.table-bordered')
                        || doc2.querySelector('table.tables.table-fixed.card-table')
                        || [...doc2.querySelectorAll('table')].find(t => t.innerHTML.includes('advances/create'));

            if (escTbl) {
              // Método 1: tbody — procura botões type=VT (TR) e type=VR (AL)
              // Mais confiável: usa o onclick real dos botões
              const allBodyRows = [...escTbl.querySelectorAll('tbody tr')];
              for (const row of allBodyRows) {
                if (colAdtoTr !== -1 && colAdtoAl !== -1) break;
                [...row.querySelectorAll('td')].forEach((td, ci) => {
                  const btn = td.querySelector('a[onclick*="advance"]');
                  if (!btn) return;
                  const oc = btn.getAttribute('onclick') || '';
                  if (colAdtoTr === -1 && /type=VT/i.test(oc)) colAdtoTr = ci;
                  if (colAdtoAl === -1 && /type=VR/i.test(oc)) colAdtoAl = ci;
                });
              }

              // Método 2 (fallback): thead ROW0 somando colspans
              // ADTO.TR e ADTO.AL têm cs=2 — o botão fica na 2a sub-coluna (ci+1)
              if (colAdtoTr === -1 || colAdtoAl === -1) {
                const headRow0 = escTbl.querySelector('thead tr');
                if (headRow0) {
                  let ci = 0;
                  [...headRow0.querySelectorAll('th,td')].forEach(th => {
                    const txt = (th.textContent || '').replace(/\s+/g,' ').toLowerCase().trim();
                    const cs  = parseInt(th.getAttribute('colspan') || '1');
                    if (txt.includes('adto') && txt.includes('tr') && colAdtoTr === -1) colAdtoTr = ci + 1;
                    if (txt.includes('adto') && txt.includes('al') && colAdtoAl === -1) colAdtoAl = ci + 1;
                    ci += cs;
                  });
                }
              }
            }

            // ── Extrai dados de ADTO ─────────────────────────────────────────────────
            // Cada ADTO ocupa 2 colunas: [colX]=botão "Gerar OP" ou vazio, [colX+1]=número OP + status
            // Quando gerado: colX fica vazio/sem botão, colX+1 tem o número e bolinha colorida
            // Quando não gerado: colX tem botão "Gerar OP" (type=VT ou VR), colX+1 vazio
            function parseAdtoCell(cellBtn, cellStatus) {
              // cellBtn  = coluna com o botão de gerar (colAdtoTr ou colAdtoAl)
              // cellStatus = coluna seguinte com número da OP e status pago/pendente
              const cell   = cellBtn    || null;
              const cellSt = cellStatus || null;

              // Botão de gerar
              const btn    = cell ? cell.querySelector('a[onclick*="advance"]') : null;
              const onclick = btn ? (btn.getAttribute('onclick') || '') : '';

              // Número da OP: busca em AMBAS as células (o sistema às vezes muda qual tem o número)
              const txtBtn  = cell   ? cell.textContent.replace(/\s+/g,' ').trim()   : '';
              const txtSt   = cellSt ? cellSt.textContent.replace(/\s+/g,' ').trim() : '';
              const txtBoth = txtBtn + ' ' + txtSt;
              const opMatch = txtBoth.match(/\d{5,}/);
              const opNum   = opMatch ? opMatch[0] : '';

              // Se não há OP e há botão → ainda não gerado
              if (!opNum) return { onclick, op: '', pago: false };

              // Detecta pago: varre title/data-original-title em TODOS os elementos das duas células
              let isPago = false;
              [cell, cellSt].forEach(function(c) {
                if (!c || isPago) return;
                // Por title/data-original-title em qualquer elemento filho
                c.querySelectorAll('*').forEach(function(el) {
                  if (isPago) return;
                  const t = ((el.getAttribute('title') || '') + ' ' + (el.getAttribute('data-original-title') || '')).toLowerCase();
                  if (t.includes('pago')) isPago = true;
                });
                if (!isPago) {
                  // Fallback por classe CSS
                  const ih = c.innerHTML || '';
                  if (
                    /\bPago\b/i.test(txtBoth) ||
                    /text-green|text-success|badge-success|bg-success/i.test(ih) ||
                    !!c.querySelector('.text-success,.text-green,.badge-success,.bg-success')
                  ) isPago = true;
                }
                if (!isPago) {
                  // Fallback por img de bolinha verde (statusbubble_1 = verde)
                  c.querySelectorAll('img[src*="statusbubble"]').forEach(function(img) {
                    const src = img.getAttribute('src') || '';
                    if (src.includes('statusbubble_1') || src.includes('statusbubble_2')) isPago = true;
                  });
                }
              });

              return { onclick, op: opNum, pago: isPago };
            }

            // ── Varre tbody ──────────────────────────────────────────────────────────
            const vales = [];
            if (escTbl) {
              escTbl.querySelectorAll('tbody tr').forEach(row => {
                if (row.classList.contains('strikethrough')) return;
                if (row.querySelector('td.strikethrough')) return;
                const cells = row.querySelectorAll('td');
                if (cells.length < 5) return;
                const nome = cells[2]?.textContent?.trim();
                const cpf  = cells[3]?.textContent?.trim();
                if (!nome || nome.length < 3) return;
                const datacad = cells[12]?.textContent?.trim() || '';
                const advisor = cells[13]?.textContent?.trim() || '';
                // Captura o onclick do botão "Gerar Falta" desta linha
                const faltaBtn = row.querySelector('a[onclick*="Falta"], button[onclick*="Falta"], a[href*="falta"], button[id*="falta"], a[id*="falta"]')
                              || [...row.querySelectorAll('a,button')].find(el =>
                                  /gerar\s*falta/i.test(el.textContent || '') ||
                                  /gerar\s*falta/i.test(el.getAttribute('title') || '') ||
                                  /gerar\s*falta/i.test(el.getAttribute('data-original-title') || '') ||
                                  /pedidoESCfalta/i.test(el.getAttribute('onclick') || '')
                                );
                const faltaOnclick = faltaBtn ? (faltaBtn.getAttribute('onclick') || faltaBtn.getAttribute('href') || '') : '';
                // Captura carga horária individual do escalado (TD.autosize na mesma linha)
                let cargaEscalado = '';
                row.querySelectorAll('td.autosize, td[class*="autosize"]').forEach(td => {
                  const txt = td.textContent.trim();
                  if (/^\d+D\d+H$/i.test(txt)) cargaEscalado = txt.toUpperCase();
                });
                escalados.push({ nome, cpf, tipo: cells[4]?.textContent?.trim(), tr: cells[9]?.textContent?.trim(), datacad, advisor, faltaOnclick, carga: cargaEscalado });

                const adtoTr = colAdtoTr >= 0 ? parseAdtoCell(cells[colAdtoTr], cells[colAdtoTr + 1]) : null;
                const adtoAl = colAdtoAl >= 0 ? parseAdtoCell(cells[colAdtoAl], cells[colAdtoAl + 1]) : null;
                vales.push({ nome, cpf, tipo: cells[4]?.textContent?.trim(), adtoTr, adtoAl });
              });
            }

            const xlsLabels = ['Layout 1 (SHEIN)','Layout 2 (Cordovil)','Layout 3 (SBC)','Layout 4 (SBF)','Layout 5 (Endereço)','Layout 6 (KISOC)'];
            const lideresSet = new Set();
            escalados.forEach(e => { if (e.advisor && e.advisor.length > 2) lideresSet.add(e.advisor); });
            const lideres = lideresSet.size > 0
              ? [...lideresSet]
              : (op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : []));
            doc2.querySelectorAll('a[href*="escalaprelistaLiderPDF_"]').forEach(a => {
              pdfLinks.push({ label: a.textContent.trim() || 'Lista p/ Assinaturas', href: a.getAttribute('href') });
            });
            doc2.querySelectorAll('a[href*="escalaprelistaLiderXLS"]').forEach((a, i) => xlsLinks.push({ label: xlsLabels[i] || a.textContent.trim(), href: a.getAttribute('href') }));

            if (!naJanela(op)) {
              const _aptAnterior = (oldCache && typeof oldCache.apontado === 'number') ? oldCache.apontado : 0;
              const _escAnterior = (oldCache && typeof oldCache.escalado === 'number') ? oldCache.escalado : 0;
              const _colabAnterior = (oldCache && oldCache.colaboradores) ? oldCache.colaboradores : [];
              const _faltasAnterior = (oldCache && oldCache.faltasConfirmadas) ? oldCache.faltasConfirmadas : [];
              // Se já tem apontados, usa dados completos do cache anterior (não marca como _soEscala)
              if (_aptAnterior > 0) {
                release({ solicitado: op.qtd, escalado: escalados.length, apontado: _aptAnterior, colaboradores: _colabAnterior, escalados, faltando: [], faltasConfirmadas: _faltasAnterior, pdfLinks, xlsLinks, _soEscala: false, listaEnviada, todosConfirmados, eaptHref, lideres, vales });
              } else {
                release({ solicitado: op.qtd, escalado: escalados.length, apontado: 0, colaboradores: [], escalados, faltando: escalados, pdfLinks, xlsLinks, _soEscala: true, listaEnviada, todosConfirmados, eaptHref, lideres, vales });
              }
              return;
            }

            // 3) Busca apontamentos
            return fetchDoc('https://tsi-app.com/' + eaptHref)
              .then(doc3 => {
                const colaboradores = [], faltasConfirmadas = [];
                const tbl3 = doc3.querySelector('table.tables.table-fixed.card-table');
                if (tbl3) {
                  // Detecta índice da coluna TÉRMINO OPORTUNIDADE pelo header
                  let colTermino = -1;
                  const headRows3 = tbl3.querySelectorAll('thead tr');
                  headRows3.forEach(tr => {
                    let ci = 0;
                    tr.querySelectorAll('th,td').forEach(th => {
                      const txt = (th.textContent || '').replace(/\s+/g,' ').toLowerCase().trim();
                      const cs  = parseInt(th.getAttribute('colspan') || '1');
                      if (colTermino === -1 && (txt.includes('t\u00e9rmino') || txt.includes('termino') || txt.includes('t\u00e9rmino'))) colTermino = ci;
                      ci += cs;
                    });
                  });
                  tbl3.querySelectorAll('tbody tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 10) return;
                    const nome = cells[0]?.textContent?.trim();
                    const cpf  = cells[1]?.textContent?.trim();
                    if (!nome || nome.length < 3) return;
                    // Extrai hora HH:MM de uma string de data+hora "dd/mm/yyyy HH:MM:SS"
                    const _extrairHora = (raw) => {
                      if (!raw) return '';
                      const m = raw.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
                      return m ? m[1] + ':' + m[2] : '';
                    };
                    // FALTA pode aparecer em qualquer célula da linha
                    const isFalta = [...cells].some(td => (td.textContent || '').trim() === 'FALTA');
                    const inicio = _extrairHora(cells[8]?.textContent?.trim());
                    if (isFalta) { faltasConfirmadas.push({ nome, cpf, tipo: cells[2]?.textContent?.trim(), inicio }); return; }
                    if (!inicio) return;
                    // Término: col 11 é DATA do TÉRMINO OPORTUNIDADE (fixo pela estrutura da tabela)
                    // Fallback: coluna detectada pelo header, depois varredura a partir da col 11
                    let termino = _extrairHora(cells[11]?.textContent?.trim());
                    if (!termino && colTermino >= 0 && cells[colTermino]) {
                      termino = _extrairHora(cells[colTermino].textContent.trim());
                    }
                    if (!termino) {
                      for (let ci = 11; ci < Math.min(cells.length, 20); ci++) {
                        const raw = (cells[ci]?.textContent || '').trim();
                        const hora = _extrairHora(raw);
                        if (hora && raw.length > 4 && raw.length < 25 && !/^[\d.,]+\s*km/i.test(raw)) {
                          termino = hora; break;
                        }
                      }
                    }
                    // Cruza com escalados para pegar a carga individual deste colaborador
                    const escaladoMatch = escalados.find(e => e.cpf === cpf);
                    let carga = escaladoMatch ? escaladoMatch.carga : '';
                    // Fallback: varre as células da própria linha procurando padrão de carga (ex: 1D8H, 3D10H)
                    if (!carga) {
                      for (let ci = 0; ci < cells.length; ci++) {
                        const txt = (cells[ci]?.textContent || '').trim();
                        if (/^\d+D\d+H$/i.test(txt)) { carga = txt.toUpperCase(); break; }
                      }
                    }
                    const distRaw = cells[10]?.textContent?.trim() || '';
                    const distMatch = distRaw.match(/([\d.,]+)\s*km/i);
                    const distNum = distMatch ? parseFloat(distMatch[1].replace(',', '.')) : 0;
                    let bioOnclick = '';
                    const bioA = row.querySelector('a[onclick*="VerBiometria"]');
                    if (bioA) bioOnclick = bioA.getAttribute('onclick') || '';
                    const excluirBtn = [...row.querySelectorAll('a,button')].find(el =>
                      /excluir\s*registro/i.test(el.textContent || '') ||
                      /excluir\s*registro/i.test(el.getAttribute('title') || '') ||
                      /excluir\s*registro/i.test(el.getAttribute('data-original-title') || '') ||
                      /pedidoAPTdel/i.test(el.getAttribute('onclick') || '')
                    );
                    const excluirOnclick = excluirBtn ? (excluirBtn.getAttribute('onclick') || '') : '';
                    colaboradores.push({ nome, cpf, tipo: cells[2]?.textContent?.trim(), advisor: cells[3]?.textContent?.trim() || '', inicio, termino, carga, dist: distNum, bioOnclick, excluirOnclick });
                  });
                }
                const apontadosCPF = new Set(colaboradores.map(c => c.cpf));
                const faltasConfirmadasCPF = new Set(faltasConfirmadas.map(f => f.cpf || f.chave));
                const faltando = escalados.filter(e => !apontadosCPF.has(e.cpf) && !faltasConfirmadasCPF.has(e.cpf));
                release({ solicitado: op.qtd, escalado: escalados.length, apontado: colaboradores.length, colaboradores, escalados, faltando, faltasConfirmadas, pdfLinks, xlsLinks, listaEnviada, todosConfirmados, eaptHref, lideres, vales });
              });
          });
      })
      .catch(() => fallback([]));
  }

  function enfileirar(op, callback, force) {
    if (!op.id) return;
    if (inQueue.has(op.id)) return;
    if (!force && apontCache[op.id] === 'loading') return;
    if (!force && apontCache[op.id] && apontCache[op.id] !== 'loading') return;
    inQueue.add(op.id);
    fetchQueue.push({ op, callback });
    processQueue();
  }

  // Enfileira com prioridade máxima (coloca na frente da fila) — usado ao abrir uma op pelo clique
  function enfileirarUrgente(op, callback) {
    if (!op.id) return;
    // Se já está na fila normal, remove para reposicionar na frente
    if (inQueue.has(op.id)) {
      const idx = fetchQueue.findIndex(item => item.op.id === op.id);
      if (idx > 0) fetchQueue.splice(idx, 1); else if (idx === 0) { processQueue(); return; }
      inQueue.delete(op.id);
    }
    // Se já está carregando ativamente, só aguarda o poll do modal
    if (apontCache[op.id] === 'loading') return;
    // Se já tem cache, não precisa fazer nada
    if (apontCache[op.id] && apontCache[op.id] !== 'loading') { callback(apontCache[op.id], null); return; }
    inQueue.add(op.id);
    apontCache[op.id] = 'loading';
    fetchQueue.unshift({ op, callback });
    processQueue();
  }

  function fetchApontamentos(op, callback) {
    if (!op.id) return;
    const cached = apontCache[op.id];
    if (cached !== undefined && cached !== 'loading' && cached !== null) {
      callback(cached, null);
      return;
    }
    enfileirar(op, callback);
  }

  // ── ENVIAR ESCALA ─────────────────────────────────────────────────────────────
  function enviarEscala(opId, btnEl) {
    const ifr = document.getElementById(IFR_ESCALA);
    if (!ifr || !opId) return;

    const origTxt = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = 'Enviando…';
    btnEl.style.opacity = '0.6';

    let done = false;
    const fail = (msg) => {
      if (done) return; done = true;
      btnEl.disabled = false;
      btnEl.innerHTML = '✗ ' + msg;
      btnEl.className = btnEl.className.replace('mon-send-btn', 'mon-send-btn mon-send-btn--err');
      btnEl.style.opacity = '1';
      setTimeout(() => { btnEl.innerHTML = origTxt; btnEl.className = btnEl.className.replace(' mon-send-btn--err', ''); }, 3000);
    };
    const safetyTimer = setTimeout(() => fail('timeout'), 25000);

    ifr.onload = null;
    ifr.src = 'https://tsi-app.com/planejamento-operacional-edit' + opId + '_1';
    ifr.onload = function() {
        if (done) return;
        try {
          const doc = ifr.contentDocument;
          if (!doc || !doc.body) { fail('modal vazio'); clearTimeout(safetyTimer); return; }
          let marcados = 0;
          for (let i = 1; i <= 8; i++) {
            const radio = doc.querySelector('input[name="p' + i + '_confirm"][value="S"]');
            if (radio) {
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
              radio.dispatchEvent(new Event('click',  { bubbles: true }));
              marcados++;
            }
          }
          if (marcados === 0) { fail('radios não encontrados'); clearTimeout(safetyTimer); return; }
          setTimeout(() => {
            if (done) return;
            const saveBtn = doc.querySelector('button[name="submitF"]');
            if (!saveBtn) { fail('btn salvar não encontrado'); clearTimeout(safetyTimer); return; }
            saveBtn.click();
            setTimeout(() => {
              if (done) return;
              done = true;
              clearTimeout(safetyTimer);
              btnEl.innerHTML = '✓ Enviado!';
              btnEl.style.opacity = '1';
              // ── Atualiza snapshot com a lista atual de escalados
              // IMPORTANTE: aguarda o snapSaveRemote terminar (GET+PUT ao JSONBin)
              // antes de recarregar a página, para garantir que a bolinha vermelha
              // suma em todos os PCs após o envio da escala.
              const _dSnap = apontCache[opId];
              const _doReload = () => {
                // v60.70: zera opId do _MON_STATE_KEY e suprime beforeunload save
                // para impedir que o bloco de restauração geral tente abrir o drawer
                // em paralelo com a expansão inline (que é o comportamento desejado
                // após enviar escala — fix do v60.66).
                try {
                  window._monSuppressStateSave = true;
                  const _raw = sessionStorage.getItem(_MON_STATE_KEY);
                  if (_raw) {
                    const _st = JSON.parse(_raw);
                    _st.opId = null;
                    sessionStorage.setItem(_MON_STATE_KEY, JSON.stringify(_st));
                  }
                } catch(e) {}
                try { sessionStorage.setItem(_MON_REOPEN_OP_KEY, JSON.stringify({ opId, page: window.location.href })); } catch(e) {}
                try { sessionStorage.setItem(_MON_REOPEN_PANEL_KEY, '1'); } catch(e) {}
                window.location.reload();
              };
              if (_dSnap && _dSnap !== 'loading' && _dSnap.escalados) {
                // Atualiza o snapshot local imediatamente
                const _lista = (_dSnap.escalados || []).map(e => ({ nome: e.nome, cpf: e.cpf, tipo: e.tipo }));
                escaladosSnapshot[opId] = { lista: _lista, ts: Date.now() };
                // Salva remotamente e só recarrega quando o PUT terminar (ou timeout de 4s)
                let _reloaded = false;
                const _safeReload = () => { if (!_reloaded) { _reloaded = true; _doReload(); } };
                setTimeout(_safeReload, 4000); // failsafe
                snapSaveRemote(_safeReload);
              } else {
                setTimeout(_doReload, 1500);
              }
            }, 500);
          }, 50);
        } catch(e) { fail('erro'); clearTimeout(safetyTimer); }
    };
  }

  window._monEnviarEscala = enviarEscala;
  window._monEnviarReport = enviarReport;

  // ── TOAST NOTIFICATION ────────────────────────────────────────────────────────
  // Injeta keyframes de vibração vermelha (uma vez só)
  (function() {
    if (document.getElementById('_mon_toast_style')) return;
    const s = document.createElement('style');
    s.id = '_mon_toast_style';
    s.textContent = `
      @keyframes _monPulseRed {
        0%   { box-shadow: 0 0 0 0 rgba(220,38,38,0.85), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1); }
        40%  { box-shadow: 0 0 0 14px rgba(220,38,38,0.0), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1.04); }
        100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.0), 0 8px 32px rgba(0,0,0,0.28); transform: scale(1); }
      }
      ._mon_toast_pulse {
        animation: _monPulseRed 0.65s ease-out 2 !important;
        will-change: transform, box-shadow;
      }
    `;
    document.head.appendChild(s);
  })();

  function _monToast(msg, type) {
    const existing = document.getElementById('_mon_toast');
    if (existing) existing.remove();

    const colors = {
      success: { bg: 'rgba(22,163,74,0.95)',  border: 'rgba(22,163,74,0.3)',  icon: '✅' },
      error:   { bg: 'rgba(220,38,38,0.95)',  border: 'rgba(220,38,38,0.3)',  icon: '❌' },
      info:    { bg: 'rgba(37,99,235,0.95)',   border: 'rgba(37,99,235,0.3)',  icon: 'ℹ️' },
      obs:     { bg: 'rgba(185,28,28,0.97)',   border: 'rgba(239,68,68,0.6)',  icon: '💬' },
    };
    const c = colors[type] || colors.info;
    const isObs = type === 'obs';

    const toast = document.createElement('div');
    toast.id = '_mon_toast';
    toast.style.cssText = [
      'position:fixed',
      'bottom:28px',
      'right:28px',
      'z-index:2147483647',
      'display:flex',
      'align-items:center',
      'gap:10px',
      'padding:' + (isObs ? '15px 22px' : '13px 20px'),
      'border-radius:12px',
      'background:' + c.bg,
      'border:2px solid ' + c.border,
      'box-shadow:0 8px 32px rgba(0,0,0,0.28)',
      'font-family:system-ui,sans-serif',
      'font-size:' + (isObs ? '15px' : '14px'),
      'font-weight:700',
      'color:#fff',
      'pointer-events:none',
      'transition:opacity 0.2s,transform 0.2s',
      'will-change:opacity,transform',
      'opacity:0',
      'transform:translateY(12px)',
    ].join(';');
    toast.innerHTML = '<span style="font-size:' + (isObs ? '22px' : '18px') + '">' + c.icon + '</span><span>' + msg + '</span>';
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        // Pulso vermelho só no tipo obs, após entrar na tela
        if (isObs) {
          setTimeout(() => { toast.classList.add('_mon_toast_pulse'); }, 120);
        }
      });
    });

    // Animate out and remove (obs fica 5s, resto 3s)
    const duration = isObs ? 3500 : 2000;
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => { try { toast.remove(); } catch(e) {} }, 400);
    }, duration);
  }
  window._monToast = _monToast;

  // ── ENVIAR REPORT ─────────────────────────────────────────────────────────────
  function enviarReport(opId, btnEl) {
    const ifr = document.getElementById(IFR_ESCALA);
    if (!ifr || !opId) return;

    // Quantidade de apontados já em cache para esta operação
    const d = apontCache[opId];
    const qtdApontados = (d && d !== 'loading' && d.apontado != null) ? d.apontado : 0;

    const origTxt = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = 'Enviando…';
    btnEl.style.opacity = '0.6';

    let done = false;
    const fail = (msg) => {
      if (done) return; done = true;
      btnEl.disabled = false;
      btnEl.innerHTML = '✗ ' + msg;
      btnEl.className = btnEl.className.replace('mon-send-btn', 'mon-send-btn mon-send-btn--err');
      btnEl.style.opacity = '1';
      setTimeout(() => { btnEl.innerHTML = origTxt; btnEl.className = btnEl.className.replace(' mon-send-btn--err', ''); }, 3000);
    };
    const safetyTimer = setTimeout(() => fail('timeout'), 25000);

    ifr.onload = null;
    ifr.src = 'https://tsi-app.com/planejamento-operacional-edit' + opId + '_1';
    ifr.onload = function() {
        if (done) return;
        try {
          const doc = ifr.contentDocument;
          if (!doc || !doc.body) { fail('modal vazio'); clearTimeout(safetyTimer); return; }

          let marcados = 0;

          // Marca P1 a P11 com "S"
          for (let i = 1; i <= 11; i++) {
            const radio = doc.querySelector('input[name="p' + i + '_confirm"][value="S"]');
            if (radio) {
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
              radio.dispatchEvent(new Event('click',  { bubbles: true }));
              marcados++;
            }
          }

          if (marcados === 0) { fail('radios não encontrados'); clearTimeout(safetyTimer); return; }

          // P10: preenche também o campo de quantidade de apontamentos
          // Tenta selectors comuns para o campo de quantidade do P10
          const p10QuantSelectors = [
            'input[name="p10_qtd"]',
            'input[name="p10_quantidade"]',
            'input[name="p10_quant"]',
            'input[name="p10_valor"]',
          ];
          let p10Input = null;
          for (const sel of p10QuantSelectors) {
            p10Input = doc.querySelector(sel);
            if (p10Input) break;
          }
          // Fallback: procura input de texto/number dentro da mesma linha do radio do p10
          if (!p10Input) {
            const p10Radio = doc.querySelector('input[name="p10_confirm"]');
            if (p10Radio) {
              const row = p10Radio.closest('tr') || p10Radio.closest('div');
              if (row) {
                p10Input = row.querySelector('input[type="text"], input[type="number"]');
              }
            }
          }
          if (p10Input) {
            p10Input.value = qtdApontados;
            p10Input.dispatchEvent(new Event('input',  { bubbles: true }));
            p10Input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          setTimeout(() => {
            if (done) return;
            const saveBtn = doc.querySelector('button[name="submitF"]');
            if (!saveBtn) { fail('btn salvar não encontrado'); clearTimeout(safetyTimer); return; }
            saveBtn.click();
            setTimeout(() => {
              if (done) return;
              done = true;
              clearTimeout(safetyTimer);
              btnEl.innerHTML = '✓ Enviado!';
              btnEl.style.opacity = '1';

              // ── Salva no histórico ──────────────────────────────────────────
              _reportHistSalvar(opId);
              // v60.70: helper de reload que zera opId do state e suprime save
              // (mesmo motivo do enviarEscala — evita drawer abrir em paralelo).
              const _reportDoReload = () => {
                try {
                  window._monSuppressStateSave = true;
                  const _raw = sessionStorage.getItem(_MON_STATE_KEY);
                  if (_raw) {
                    const _st = JSON.parse(_raw);
                    _st.opId = null;
                    sessionStorage.setItem(_MON_STATE_KEY, JSON.stringify(_st));
                  }
                } catch(e) {}
                try { sessionStorage.setItem(_MON_REOPEN_OP_KEY, JSON.stringify({ opId, page: window.location.href })); } catch(e) {}
                try { sessionStorage.setItem(_MON_REOPEN_PANEL_KEY, '1'); } catch(e) {}
                window.location.reload();
              };

              // ── Registra faltas usando lógica do WhatsApp (dist <= 1km) ──
              const _op = operations.find(o => o.id === opId);
              let _faltasPendente = false;
              if (_op) {
                const _d = apontCache[opId];
                if (_d && _d !== 'loading') {
                  const _entregues = (_d.colaboradores || []).filter(c => c.dist === 0 || c.dist <= 1);
                  const _faltas = Math.max(0, _op.qtd - _entregues.length);
                  if (_faltas > 0) {
                    _faltasPendente = true;
                    _faltasRegistrar(_op, _entregues.length, _reportDoReload);
                  }
                }
              }
              if (!_faltasPendente) setTimeout(_reportDoReload, 1500);
            }, 500);
          }, 50);
        } catch(e) { fail('erro'); clearTimeout(safetyTimer); }
    };
  }

  // ── ENVIO EM LOTE ─────────────────────────────────────────────────────────────
  window._monAbrirLote = function() {
    // Remove modal anterior se existir
    const prev = document.getElementById('_mon_lote_modal');
    if (prev) prev.remove();

    // Coleta ops candidatas (não fromHist, com dados carregados)
    const candidatas = (typeof operations !== 'undefined' ? operations : []).filter(op => {
      if (op._fromHist) return false;
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      if (!d || d === 'loading') return false;
      // Elegível se tem escala NÃO enviada OU report NÃO enviado
      const escPendente = d.escalado > 0 && !d.listaEnviada;
      const reportPendente = !d.todosConfirmados;
      return escPendente || reportPendente;
    });

    const overlay = _createOverlay('_mon_lote_modal', {
      zIndex: '99999998',
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(3px)',
    });

    const box = document.createElement('div');
    box.style.cssText = `
      background:var(--mon-surface,#1a1a2e);border:1px solid var(--mon-border,#333);
      border-radius:14px;padding:0;width:540px;max-width:95vw;max-height:85vh;
      display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,0.5);
      font-family:var(--mon-font,system-ui,sans-serif);color:var(--mon-text,#e2e8f0);
      overflow:hidden;
    `;

    // ── HEADER
    const hdr = document.createElement('div');
    hdr.style.cssText = `
      padding:16px 20px;border-bottom:1px solid var(--mon-border,#333);
      display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
    `;
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px">⚡</span>
        <div>
          <div style="font-size:15px;font-weight:700;line-height:1.2">Envio em lote</div>
          <div style="font-size:11px;color:var(--mon-text-dim,#888);margin-top:2px">Selecione as ops e o tipo de envio</div>
        </div>
      </div>
      <button onclick="document.getElementById('_mon_lote_modal').remove()" style="background:none;border:none;color:var(--mon-text-dim,#888);font-size:18px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1;">✕</button>
    `;

    // ── TIPO DE ENVIO
    const tipoWrap = document.createElement('div');
    tipoWrap.style.cssText = `padding:12px 20px 0;flex-shrink:0;display:flex;gap:8px;`;
    tipoWrap.innerHTML = `
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600;padding:7px 14px;border-radius:8px;border:1.5px solid var(--mon-accent,#6366f1);background:var(--mon-accent-bg,rgba(99,102,241,0.12));color:var(--mon-accent,#6366f1);">
        <input type="radio" name="_monLoteTipo" value="escala" checked style="accent-color:var(--mon-accent,#6366f1)"> 📋 Escala
      </label>
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600;padding:7px 14px;border-radius:8px;border:1.5px solid var(--mon-border,#333);color:var(--mon-text-dim,#888);">
        <input type="radio" name="_monLoteTipo" value="report" style="accent-color:var(--mon-accent,#6366f1)"> 📊 Report
      </label>
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600;padding:7px 14px;border-radius:8px;border:1.5px solid var(--mon-border,#333);color:var(--mon-text-dim,#888);">
        <input type="radio" name="_monLoteTipo" value="ambos" style="accent-color:var(--mon-accent,#6366f1)"> ⚡ Escala + Report
      </label>
    `;

    // Atualiza estilos dos labels ao mudar radio
    tipoWrap.querySelectorAll('input[type=radio]').forEach(r => {
      r.addEventListener('change', () => {
        tipoWrap.querySelectorAll('label').forEach(l => {
          const sel = l.querySelector('input').checked;
          l.style.borderColor = sel ? 'var(--mon-accent,#6366f1)' : 'var(--mon-border,#333)';
          l.style.background  = sel ? 'var(--mon-accent-bg,rgba(99,102,241,0.12))' : '';
          l.style.color       = sel ? 'var(--mon-accent,#6366f1)' : 'var(--mon-text-dim,#888)';
        });
        _monLoteAtualizarLista();
      });
    });

    // ── CONTROLES SELEÇÃO
    const selBar = document.createElement('div');
    selBar.style.cssText = `padding:10px 20px 8px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;`;
    selBar.innerHTML = `
      <span id="_mon_lote_count" style="font-size:12px;color:var(--mon-text-dim,#888)">—</span>
      <div style="display:flex;gap:8px;">
        <button onclick="window._monLoteSelectAll(true)"  style="font-size:12px;background:none;border:none;color:var(--mon-accent,#6366f1);cursor:pointer;padding:3px 6px;">Marcar tudo</button>
        <button onclick="window._monLoteSelectAll(false)" style="font-size:12px;background:none;border:none;color:var(--mon-text-dim,#888);cursor:pointer;padding:3px 6px;">Desmarcar</button>
      </div>
    `;

    // ── LISTA DE OPS
    const lista = document.createElement('div');
    lista.id = '_mon_lote_lista';
    lista.style.cssText = `flex:1;overflow-y:auto;padding:0 12px 8px;min-height:0;`;

    // ── FOOTER
    const ftr = document.createElement('div');
    ftr.style.cssText = `
      padding:14px 20px;border-top:1px solid var(--mon-border,#333);
      display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
    `;
    ftr.innerHTML = `
      <div id="_mon_lote_status" style="font-size:12px;color:var(--mon-text-dim,#888);min-width:160px;"></div>
      <div style="display:flex;gap:8px;">
        <button onclick="document.getElementById('_mon_lote_modal').remove()"
          style="padding:8px 18px;border-radius:8px;border:1px solid var(--mon-border,#333);background:none;color:var(--mon-text,#e2e8f0);cursor:pointer;font-size:13px;">
          Cancelar
        </button>
        <button id="_mon_lote_enviar_btn" onclick="window._monLoteEnviar()"
          style="padding:8px 20px;border-radius:8px;border:none;background:var(--mon-accent,#6366f1);color:#fff;font-weight:700;font-size:13px;cursor:pointer;">
          ⚡ Enviar selecionadas
        </button>
      </div>
    `;

    box.appendChild(hdr);
    box.appendChild(tipoWrap);
    box.appendChild(selBar);
    box.appendChild(lista);
    box.appendChild(ftr);
    overlay.appendChild(box);

    // Fecha ao clicar fora
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    document.body.appendChild(overlay);

    // Guarda candidatas acessíveis pelas funções internas
    overlay._candidatas = candidatas;

    // Renderiza lista inicial
    _monLoteAtualizarLista();
  };

  function _monLoteAtualizarLista() {
    const overlay = document.getElementById('_mon_lote_modal');
    if (!overlay) return;
    const lista = document.getElementById('_mon_lote_lista');
    const countEl = document.getElementById('_mon_lote_count');
    if (!lista) return;

    const tipo = (document.querySelector('input[name="_monLoteTipo"]:checked') || {}).value || 'escala';
    const candidatas = overlay._candidatas || [];

    // Filtra por tipo
    const elegíveis = candidatas.filter(op => {
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      if (!d || d === 'loading') return false;
      if (tipo === 'escala') return d.escalado > 0 && !d.listaEnviada;
      if (tipo === 'report') return !d.todosConfirmados;
      if (tipo === 'ambos')  return (d.escalado > 0 && !d.listaEnviada) || !d.todosConfirmados;
      return false;
    });

    if (elegíveis.length === 0) {
      lista.innerHTML = `<div style="text-align:center;padding:32px 16px;color:var(--mon-text-dim,#888);font-size:13px;">
        Nenhuma operação elegível para "${tipo === 'escala' ? 'Escala' : tipo === 'report' ? 'Report' : 'Escala + Report'}"
      </div>`;
      if (countEl) countEl.textContent = '0 ops elegíveis';
      return;
    }

    if (countEl) countEl.textContent = `${elegíveis.length} ops elegíveis`;

    lista.innerHTML = elegíveis.map(op => {
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      const escEnv  = d && d.listaEnviada;
      const repEnv  = d && d.todosConfirmados;
      const escPend = d && d.escalado > 0 && !escEnv;
      const repPend = d && !repEnv;
      const tags = [
        escPend ? `<span style="font-size:10px;padding:1px 6px;border-radius:99px;background:var(--mon-accent-bg,rgba(99,102,241,0.12));color:var(--mon-accent,#6366f1);border:1px solid var(--mon-accent-border,rgba(99,102,241,0.3))">📋 escala</span>` : '',
        repPend ? `<span style="font-size:10px;padding:1px 6px;border-radius:99px;background:rgba(245,158,11,0.1);color:var(--mon-amber,#f59e0b);border:1px solid rgba(245,158,11,0.3)">📊 report</span>` : '',
      ].filter(Boolean).join(' ');

      return `<div style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;margin:2px 0;cursor:pointer;background:var(--mon-bg,#111);"
        onmouseenter="this.style.background='var(--mon-surface,#1a1a2e)'"
        onmouseleave="this.style.background='var(--mon-bg,#111)'"
        onclick="var cb=this.querySelector('input');cb.checked=!cb.checked;window._monLoteAtualizarContador();">
        <input type="checkbox" data-lote-opid="${op.id}" checked
          onclick="event.stopPropagation();window._monLoteAtualizarContador();"
          style="accent-color:var(--mon-accent,#6366f1);width:15px;height:15px;flex-shrink:0;cursor:pointer;">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:12px;font-weight:700;color:var(--mon-text,#e2e8f0)">${op.sigla || op.chave || op.id}</span>
            <span style="font-size:11px;color:var(--mon-text-dim,#888)">${op.hora || ''}</span>
            ${tags}
          </div>
          <div style="font-size:10.5px;color:var(--mon-text-faint,#555);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${op.chave || ''} · Esc: ${d ? d.escalado : '?'}/${d ? d.solicitado : '?'} · Apt: ${d ? d.apontado : '?'}</div>
        </div>
      </div>`;
    }).join('');

    window._monLoteAtualizarContador();
  }

  window._monLoteAtualizarContador = function() {
    const checked = document.querySelectorAll('input[data-lote-opid]:checked');
    const countEl = document.getElementById('_mon_lote_count');
    if (countEl) {
      const total = document.querySelectorAll('input[data-lote-opid]').length;
      countEl.textContent = `${checked.length} de ${total} selecionadas`;
    }
  };

  window._monLoteSelectAll = function(sel) {
    document.querySelectorAll('input[data-lote-opid]').forEach(cb => cb.checked = sel);
    window._monLoteAtualizarContador();
  };

  window._monLoteEnviar = function() {
    const tipo = (document.querySelector('input[name="_monLoteTipo"]:checked') || {}).value || 'escala';
    const selecionadas = [...document.querySelectorAll('input[data-lote-opid]:checked')].map(cb => cb.dataset.loteOpid);

    if (selecionadas.length === 0) { alert('Selecione ao menos uma operação.'); return; }

    // ── Monta resumo das ops selecionadas ─────────────────────────────────────
    const tipoLabel = tipo === 'escala' ? '📋 Escala' : tipo === 'report' ? '📊 Report' : '⚡ Escala + Report';
    const linhasOps = selecionadas.map(opId => {
      const op = _monFindOp(opId);
      const d  = (typeof apontCache !== 'undefined') ? apontCache[opId] : null;
      const sigla = op ? (op.sigla || op.chave || opId) : opId;
      const hora  = op ? (op.hora || '') : '';
      const esc   = d && d !== 'loading' ? d.escalado  : '?';
      const sol   = d && d !== 'loading' ? d.solicitado : '?';
      const apt   = d && d !== 'loading' ? d.apontado  : '?';
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:7px;background:var(--mon-bg,#111);margin:2px 0;">
        <span style="font-size:13px;font-weight:700;min-width:90px;color:var(--mon-text,#e2e8f0)">${sigla}</span>
        <span style="font-size:11px;color:var(--mon-text-dim,#888)">${hora}</span>
        <span style="font-size:11px;color:var(--mon-text-dim,#888);margin-left:auto">Esc: ${esc}/${sol} · Apt: ${apt}</span>
      </div>`;
    }).join('');

    // ── Modal de confirmação ───────────────────────────────────────────────────
    const confId = '_mon_lote_confirm';
    const prev = document.getElementById(confId);
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.id = confId;
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999999;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;font-family:var(--mon-font,system-ui,sans-serif);';

    overlay.innerHTML = `
      <div style="background:var(--mon-surface,#1a1a2e);border:1px solid var(--mon-border,#333);border-radius:14px;width:460px;max-width:94vw;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,0.6);overflow:hidden;color:var(--mon-text,#e2e8f0);">

        <!-- header -->
        <div style="padding:18px 20px 14px;border-bottom:1px solid var(--mon-border,#333);display:flex;align-items:center;gap:10px;flex-shrink:0;">
          <span style="font-size:22px">⚠️</span>
          <div>
            <div style="font-size:15px;font-weight:700;line-height:1.2">Confirmar envio em lote</div>
            <div style="font-size:11px;color:var(--mon-text-dim,#888);margin-top:2px">Essa ação não pode ser desfeita</div>
          </div>
        </div>

        <!-- resumo -->
        <div style="padding:14px 20px 8px;flex-shrink:0;">
          <div style="font-size:13px;color:var(--mon-text-dim,#888);margin-bottom:8px;">
            Você está prestes a enviar <strong style="color:var(--mon-text,#e2e8f0)">${tipoLabel}</strong> para
            <strong style="color:var(--mon-accent,#6366f1)">${selecionadas.length} operaç${selecionadas.length === 1 ? 'ão' : 'ões'}</strong>:
          </div>
        </div>

        <!-- lista ops -->
        <div style="flex:1;overflow-y:auto;padding:0 20px 12px;min-height:0;">
          ${linhasOps}
        </div>

        <!-- aviso -->
        <div style="padding:10px 20px;flex-shrink:0;">
          <div style="font-size:11.5px;color:var(--mon-amber,#f59e0b);background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:8px;padding:8px 12px;line-height:1.5;">
            ⚠️ O sistema vai preencher e salvar automaticamente cada operação. Confira se os dados estão corretos antes de continuar.
          </div>
        </div>

        <!-- botões -->
        <div style="padding:12px 20px 16px;border-top:1px solid var(--mon-border,#333);display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;">
          <button onclick="document.getElementById('${confId}').remove()"
            style="padding:9px 20px;border-radius:8px;border:1px solid var(--mon-border,#333);background:none;color:var(--mon-text,#e2e8f0);font-size:13px;cursor:pointer;">
            Cancelar
          </button>
          <button id="_mon_lote_confirm_btn"
            style="padding:9px 22px;border-radius:8px;border:none;background:var(--mon-accent,#6366f1);color:#fff;font-weight:700;font-size:13px;cursor:pointer;">
            ✅ Confirmar — enviar ${selecionadas.length} op${selecionadas.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    `;

    // Fecha ao clicar fora
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    // Ao confirmar: fecha o confirm, dispara o envio real
    document.getElementById('_mon_lote_confirm_btn').addEventListener('click', () => {
      overlay.remove();
      _monLoteExecutar(tipo, selecionadas);
    });
  };

  function _monLoteExecutar(tipo, selecionadas) {
    const btnEnviar = document.getElementById('_mon_lote_enviar_btn');
    if (btnEnviar) { btnEnviar.disabled = true; btnEnviar.textContent = 'Enviando…'; }

    const statusEl = document.getElementById('_mon_lote_status');
    let idx = 0;
    const resultados = [];

    function _next() {
      if (idx >= selecionadas.length) {
        // Concluído
        const ok = resultados.filter(r => r.ok).length;
        const fail = resultados.filter(r => !r.ok).length;
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--mon-green,#10b981)">✓ ${ok} enviados</span>${fail > 0 ? `<span style="color:var(--mon-red,#ef4444);margin-left:8px">✗ ${fail} erros</span>` : ''}`;
        if (btnEnviar) { btnEnviar.disabled = false; btnEnviar.textContent = '✓ Concluído'; btnEnviar.style.background = 'var(--mon-green,#10b981)'; }
        // Recarrega após 2s para refletir envios
        setTimeout(() => {
          try {
            window._monSuppressStateSave = true;
            try { const _raw = sessionStorage.getItem('_monState'); if (_raw) { const _st = JSON.parse(_raw); _st.opId = null; sessionStorage.setItem('_monState', JSON.stringify(_st)); } } catch(e) {}
          } catch(e) {}
          window.location.reload();
        }, 2000);
        return;
      }

      const opId = selecionadas[idx];
      const opNum = idx + 1;
      if (statusEl) statusEl.textContent = `Enviando ${opNum}/${selecionadas.length}…`;

      const ifr = document.getElementById('_mon_escala');
      if (!ifr) { resultados.push({ opId, ok: false }); idx++; _next(); return; }

      let done = false;
      const safetyTimer = setTimeout(() => {
        if (!done) { done = true; resultados.push({ opId, ok: false, err: 'timeout' }); idx++; _next(); }
      }, 25000);

      ifr.onload = null;
      ifr.src = 'https://tsi-app.com/planejamento-operacional-edit' + opId + '_1';
      ifr.onload = function() {
        if (done) return;
        try {
          const doc = ifr.contentDocument;
          if (!doc || !doc.body) { done = true; clearTimeout(safetyTimer); resultados.push({ opId, ok: false, err: 'vazio' }); idx++; _next(); return; }

          // Determina quantos radios marcar: escala P1-P8, report P1-P11
          const maxP = (tipo === 'escala') ? 8 : 11;
          let marcados = 0;
          for (let i = 1; i <= maxP; i++) {
            const radio = doc.querySelector('input[name="p' + i + '_confirm"][value="S"]');
            if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); radio.dispatchEvent(new Event('click', { bubbles: true })); marcados++; }
          }
          if (marcados === 0) { done = true; clearTimeout(safetyTimer); resultados.push({ opId, ok: false, err: 'radios' }); idx++; _next(); return; }

          // Se report ou ambos: tenta preencher P10 com qtd apontados
          if (tipo === 'report' || tipo === 'ambos') {
            const d = (typeof apontCache !== 'undefined') ? apontCache[opId] : null;
            const qtdApt = (d && d !== 'loading' && d.apontado != null) ? d.apontado : 0;
            const p10Sels = ['input[name="p10_qtd"]','input[name="p10_quantidade"]','input[name="p10_quant"]','input[name="p10_valor"]'];
            let p10 = null;
            for (const s of p10Sels) { p10 = doc.querySelector(s); if (p10) break; }
            if (!p10) { const r10 = doc.querySelector('input[name="p10_confirm"]'); if (r10) { const row = r10.closest('tr') || r10.closest('div'); if (row) p10 = row.querySelector('input[type="text"],input[type="number"]'); } }
            if (p10) { p10.value = qtdApt; p10.dispatchEvent(new Event('input', { bubbles: true })); p10.dispatchEvent(new Event('change', { bubbles: true })); }
          }

          setTimeout(() => {
            if (done) return;
            const saveBtn = doc.querySelector('button[name="submitF"]');
            if (!saveBtn) { done = true; clearTimeout(safetyTimer); resultados.push({ opId, ok: false, err: 'btn' }); idx++; _next(); return; }
            saveBtn.click();
            setTimeout(() => {
              if (done) return;
              done = true; clearTimeout(safetyTimer);
              // Salva histórico se for report
              if ((tipo === 'report' || tipo === 'ambos') && typeof _reportHistSalvar === 'function') {
                try { _reportHistSalvar(opId); } catch(e) {}
              }
              resultados.push({ opId, ok: true });
              idx++;
              // Pequena pausa entre envios para não sobrecarregar o iframe
              setTimeout(_next, 800);
            }, 500);
          }, 50);
        } catch(e) { done = true; clearTimeout(safetyTimer); resultados.push({ opId, ok: false, err: 'erro' }); idx++; _next(); }
      };
    }

    _next();
  };

  // ── GERAR RELATÓRIO WHATSAPP ──────────────────────────────────────────────────
  window._monGerarRelatorio = function(opId, btnEl) {
    const d = apontCache[opId];
    if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!op) return;

    // Colaboradores entregues = apontados com dist <= 1km
    // dist=0 significa que não encontrou dado de distância — conta normalmente
    const entregues = (d.colaboradores || []).filter(c => c.dist === 0 || c.dist <= 1);
    const entregueCount = entregues.length;

    // Líderes: prioridade = lideres da escala; fallback = op.liderCompleto ou op.lider
    const lideres = (d.lideres && d.lideres.length > 0)
      ? d.lideres
      : (op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : ['—']));

    // Data da operação (extraída da chave; fallback para hoje)
    const _dataOp = monDataDaOp(op).split('/');
    const dia = _dataOp[0], mes = _dataOp[1], ano = _dataOp[2];

    // Nome completo do líder: prioriza liderCompleto, fallback para lider
    const lideresCompletos = lideres.map(l => {
      if (l && l !== '—') return l;
      return op.liderCompleto || op.lider || '—';
    });

    const reportAtualizado = d.todosConfirmados === true;
    const tituloReport = reportAtualizado
      ? `*REPORT ATUALIZADO*`
      : `*REPORT*`;

    // Unidade = sigla da operação
    const unidade = op.sigla || op.site || '—';

    const texto = [
      tituloReport,
      ``,
      `*CHAVE:* ${op.chave}`,
      `*UNIDADE:* ${unidade}`,
      ``,
      `*DATA:* ${dia}/${mes}/${ano}`,
      `*HORÁRIO:* ${op.hora || '—'}`,
      ``,
      `*SOLICITADO:* ${String(op.qtd).padStart(2,'0')}`,
      `*ENTREGUE:* ${String(entregueCount).padStart(2,'0')}`,
    ].join('\n');

    navigator.clipboard.writeText(texto)
      .then(() => {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copiado!';
        btnEl.style.color = 'var(--mon-green)';
        _monToast('✅ Report copiado!', 'success');
        setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; }, 2500);
      })
      .catch(() => {
        // Fallback: abre prompt com o texto para copiar manualmente
        prompt('Copie o relatório:', texto);
      });
  };

  // ── PRINT APONTAMENTOS ────────────────────────────────────────────────────────
  // Carrega a página de apontamentos em iframe oculto (mesmo domínio = sem CORS),
  // aplica html2canvas direto no documento do iframe e baixa/copia o PNG.
  window._monPrintApontamentos = function(opId, btnEl) {
    const d = apontCache[opId];
    if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
    const href = d.eaptHref;
    if (!href) { alert('Clique em ↻ Atualizar para habilitar o print desta operação.'); return; }

    const origHTML = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = '⏳ Carregando…';

    const fail = (msg) => {
      btnEl.innerHTML = '✗ ' + msg;
      setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.disabled = false; }, 3500);
    };

    // Cria iframe oculto com tamanho real para renderização correta
    const printIfr = document.createElement('iframe');
    printIfr.id = '_mon_print_ifr';
    printIfr.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      'width:1400px',
      'height:900px',
      'opacity:0',
      'pointer-events:none',
      'border:none',
      'z-index:-1',
    ].join(';');
    document.body.appendChild(printIfr);

    const cleanup = () => { try { document.body.removeChild(printIfr); } catch(e) {} };

    const safetyTimeout = setTimeout(() => { cleanup(); fail('Timeout ao carregar'); }, 30000);

    printIfr.onload = () => {
      // Aguarda o DOM do iframe renderizar completamente
      setTimeout(() => {
        try {
          const ifrDoc = printIfr.contentDocument || printIfr.contentWindow.document;
          const ifrWin = printIfr.contentWindow;

          // Injeta html2canvas no iframe (mesmo domínio, funciona sem CORS)
          const script = ifrDoc.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = () => {
            setTimeout(() => {
              try {
                // ── Acha o contador "X apontamento(s) registrado(s)"
                // Usa TreeWalker nos nós de TEXTO para achar o nó mais específico,
                // evitando pegar o textContent herdado de ancestrais (que engloba a página toda).
                let counterEl = null;
                const walker = ifrDoc.createTreeWalker(ifrDoc.body, NodeFilter.SHOW_TEXT);
                let node;
                while ((node = walker.nextNode())) {
                  if (/\d+\s*apontamento.*registrado/i.test(node.nodeValue)) {
                    // Sobe até incluir badge FALTAS mas sem englobar a tabela
                    let t = node.parentElement;
                    for (let i = 0; i < 4; i++) {
                      if (!t || !t.parentElement || t.parentElement === ifrDoc.body) break;
                      const p = t.parentElement;
                      if (p.querySelector('table')) break;
                      t = p;
                    }
                    counterEl = t;
                    break;
                  }
                }

                // ── Acha a tabela principal
                const tbl = ifrDoc.querySelector('table.tables.table-fixed.card-table:not(.table-bordered)')
                         || ifrDoc.querySelector('table.card-table')
                         || ifrDoc.querySelector('table');

                if (!tbl) { clearTimeout(safetyTimeout); cleanup(); fail('Tabela não encontrada'); return; }

                // ── Encontra coluna DATA para saber onde cortar à direita
                const theadRows = Array.from(tbl.querySelectorAll('thead tr'));
                let dataThEl = null;
                if (theadRows[1]) {
                  for (const cell of theadRows[1].querySelectorAll('th,td')) {
                    if (/^DATA$/i.test(cell.textContent.trim())) { dataThEl = cell; break; }
                  }
                }
                if (!dataThEl && theadRows[0]) {
                  for (const cell of theadRows[0].querySelectorAll('th,td')) {
                    if (/^DATA$/i.test(cell.textContent.trim())) { dataThEl = cell; break; }
                  }
                }

                // ── Calcula área de recorte
                const scrollX = ifrWin.scrollX || 0;
                const scrollY = ifrWin.scrollY || 0;
                // Se não achou o contador, usa o topo da tabela menos 40px para garantir espaço
                const counterRect = counterEl
                  ? counterEl.getBoundingClientRect()
                  : { top: tbl.getBoundingClientRect().top - 40, left: tbl.getBoundingClientRect().left };
                const tblRect    = tbl.getBoundingClientRect();
                const lastRow    = tbl.querySelector('tbody tr:last-child');
                const bottomRect = lastRow ? lastRow.getBoundingClientRect() : tblRect;
                const dataRect   = dataThEl ? dataThEl.getBoundingClientRect() : null;

                const cropTop    = counterRect.top  - 10 + scrollY;
                const cropLeft   = counterRect.left - 6  + scrollX;
                const cropBottom = bottomRect.bottom + 6 + scrollY;
                const cropRight  = dataRect ? dataRect.right + 6 + scrollX : tblRect.right + 6 + scrollX;

                btnEl.innerHTML = '📸 Gerando…';

                // ── Captura com html2canvas diretamente no documento do iframe
                ifrWin.html2canvas(ifrDoc.body, {
                  backgroundColor: '#ffffff',
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  logging: false,
                  scrollX: 0,
                  scrollY: 0,
                  windowWidth: ifrDoc.body.scrollWidth,
                  windowHeight: ifrDoc.body.scrollHeight,
                }).then(canvas => {
                  clearTimeout(safetyTimeout);

                  const scale = 2;
                  const sx = Math.round(cropLeft  * scale);
                  const sy = Math.round(Math.max(0, cropTop) * scale);
                  const sw = Math.max(1, Math.round((cropRight  - cropLeft) * scale));
                  const sh = Math.max(1, Math.round((cropBottom - cropTop)  * scale));

                  const out = document.createElement('canvas');
                  out.width  = sw;
                  out.height = sh;
                  out.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

                  const dataUrl = out.toDataURL('image/png');

                  // ── Tenta clipboard; se falhar faz download automático
                  const doDownload = () => {
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    const opChave = (_monFindOp(opId) || {}).chave || null; // FIX: null em vez de opId numérico como nome
                    a.download = 'apontamentos_' + opChave + '_' + new Date().toISOString().slice(0,16).replace(/[T:]/g,'-') + '.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };

                  const onSuccess = () => {
                    btnEl.innerHTML = '✅ Print copiado!';
                    btnEl.style.color = 'var(--mon-green)';
                    _monToast('🖼️ Print copiado para a área de transferência!', 'success');
                    setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
                  };
                  const onDownloaded = () => {
                    btnEl.innerHTML = '✅ Baixado!';
                    btnEl.style.color = 'var(--mon-green)';
                    _monToast('📥 Print baixado com sucesso!', 'success');
                    setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
                  };

                  if (navigator.clipboard && navigator.clipboard.write) {
                    fetch(dataUrl).then(r => r.blob()).then(blob => {
                      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                        .then(onSuccess)
                        .catch(() => { doDownload(); onDownloaded(); });
                    }).catch(() => { doDownload(); onDownloaded(); });
                  } else {
                    doDownload();
                    onDownloaded();
                  }

                  cleanup();
                }).catch(e => {
                  clearTimeout(safetyTimeout);
                  cleanup();
                  fail('Erro canvas: ' + e.message);
                });
              } catch(e) {
                clearTimeout(safetyTimeout);
                cleanup();
                fail('Erro: ' + e.message);
              }
            }, 100);
          };
          script.onerror = () => { clearTimeout(safetyTimeout); cleanup(); fail('Erro ao carregar html2canvas'); };
          ifrDoc.head.appendChild(script);
        } catch(e) {
          clearTimeout(safetyTimeout);
          cleanup();
          fail('Erro de acesso ao iframe: ' + e.message);
        }
      }, 300);
    };

    printIfr.src = 'https://tsi-app.com/' + href;
  };

  // ── FILTRO / SORT ─────────────────────────────────────────────────────────────
  let activeStatusFilter  = 'all';
  let monPaginas      = 1;   // 1 = só pag1 (30 ops), 2 = pag1+pag2 (60 ops)
  let _pag2LastFetch  = 0;   // timestamp do último fetch da pag2
  const PAG2_INTERVAL = 5 * 60 * 1000; // 5 minutos
  let escEnviadaSubfilter = false; // subfiltro dentro de 'esc': true = só enviadas, false = todas

  function getStatusRank(op) {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return 99;
    if (d.apontado >= d.solicitado && d.escalado >= d.solicitado) return 0; // completo
    if (d.apontado > 0) return 1;  // parcial
    if (d.escalado >= d.solicitado) return 2; // esc ok
    if (d.escalado > 0) return 3;  // esc parcial
    return 4; // nenhum
  }

  function matchesStatusFilter(op) {
    if (activeStatusFilter === 'all') return true;
    const d = apontCache[op.id];
    if (!d || d === 'loading') return activeStatusFilter !== 'completo' && activeStatusFilter !== 'parcial';
    const escOk = d.escalado >= d.solicitado;
    const aptOk = d.apontado >= d.solicitado;
    if (activeStatusFilter === 'completo') return aptOk && escOk;
    if (activeStatusFilter === 'parcial')  return d.apontado > 0 && !aptOk;
    if (activeStatusFilter === 'esc')      return d.apontado === 0 && escOk;
    if (activeStatusFilter === 'esc_inc')  return d.escalado > 0 && !escOk;
    if (activeStatusFilter === 'nenhum')   return d.apontado === 0 && d.escalado === 0;
    if (activeStatusFilter === 'esc_inc_nenhum') return !escOk;
    return true;
  }

  // Extrai timestamp de ordenação da chave: [SIGLA][DDMMAAAA][HHMM]
  // Ex: SVCCAS220520260500 -> data=22052026 hora=0500 -> 2026-05-22T05:00
  // Escopo de módulo — usada em getVisibleOps e renderTableV2.
  // v60.69: a chave é a fonte mais confiável (formato fixo). dataOp+hora da
  // tabela do TSI vira fallback porque pode vir vazio ou com data diferente,
  // o que bagunçava a ordem (ex: op de 06:30 caindo entre 17:00 e 18:20).
  function _opTs(op) {
    if (!op) return 0;
    // 1) Extrai DDMMAAAA da chave (os 4 últimos dígitos são código interno, não HHMM)
    //    Ex: SRRDHL170520268600 → DD=17, MM=05, AAAA=2026; hora vem de op.hora
    var m = (op.chave||'').match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
    if (m) {
      var partsH = (op.hora||'00:00').split(':');
      var hh = parseInt(partsH[0])||0, mm = parseInt(partsH[1])||0;
      var hStr = (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm;
      var ts = Date.parse(m[3]+'-'+m[2]+'-'+m[1]+'T'+hStr+':00');
      if (!isNaN(ts)) return ts;
    }
    // 2) Fallback: dataOp DD/MM/YYYY + op.hora
    var dp = (op.dataOp||'').match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dp) {
      var ts2 = Date.parse(dp[3]+'-'+dp[2]+'-'+dp[1]+'T'+(op.hora||'00:00')+':00');
      if (!isNaN(ts2)) return ts2;
    }
    return 0;
  }
  function _chaveTs(chave, hora) {
    if (!chave) return 0;
    // Mesmo padrão: DDMMAAAA + 4 dígitos de código interno; hora via parâmetro
    var m = chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
    if (m) {
      var partsH = (hora||'00:00').split(':');
      var hh = parseInt(partsH[0])||0, mm = parseInt(partsH[1])||0;
      var hStr = (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm;
      var ts = Date.parse(m[3]+'-'+m[2]+'-'+m[1]+'T'+hStr+':00');
      if (!isNaN(ts)) return ts;
    }
    return 0;
  }

  function getVisibleOps() {
    const q = filterText.toLowerCase().trim();
    let ops = operations.filter(op => {
      // Ops injetadas pelo histórico não aparecem na lista principal
      if (op._fromHist) return false;
      if (q && !op.chave.toLowerCase().includes(q) &&
               !op.sigla.toLowerCase().includes(q) &&
               !(op.site||'').toLowerCase().includes(q) &&
               !(op.lider||'').toLowerCase().includes(q)) return false;
      // Subfiltro: dentro de Esc.ok com "não enviadas" ativo, esconde as já enviadas
      if (activeStatusFilter === 'esc' && escEnviadaSubfilter) {
        const d = apontCache[op.id];
        if (!d || d === 'loading') return false;
        if (d.listaEnviada || d.todosConfirmados) return false;
      }
      return matchesStatusFilter(op);
    });

    if (sortCol) {
      ops = [...ops].sort((a, b) => {
        let va, vb;
        const da = apontCache[a.id], db = apontCache[b.id];
        if (sortCol === 'esc') {
          va = (da && da !== 'loading' && a.qtd > 0) ? da.escalado / a.qtd : -1;
          vb = (db && db !== 'loading' && b.qtd > 0) ? db.escalado / b.qtd : -1;
        } else if (sortCol === 'apt') {
          va = (da && da !== 'loading' && a.qtd > 0) ? da.apontado / a.qtd : -1;
          vb = (db && db !== 'loading' && b.qtd > 0) ? db.apontado / b.qtd : -1;
        } else if (sortCol === 'hora') {
          va = _opTs(a) || 0; vb = _opTs(b) || 0;
        } else if (sortCol === 'status') {
          va = getStatusRank(a); vb = getStatusRank(b);
        }
        if (va < vb) return -1 * sortDir;
        if (va > vb) return  1 * sortDir;
        return 0;
      });
    } else {
      // Ordenação padrão: data+hora extraídas da chave (mais cedo primeiro)
      ops = [...ops].sort((a, b) => _opTs(a) - _opTs(b));
    }
    return ops;
  }

  window._monSetFilter = function(val) {
    filterText = val;
    window.filterText = val; // sync para highlight em renderTableV2
    const clearBtn = document.getElementById('mon-filter-clear');
    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
    renderTable();
  };

  window._monClearFilter = function() {
    filterText = '';
    window.filterText = ''; // sync para highlight em renderTableV2
    const inp = document.getElementById('mon-filter-input');
    if (inp) inp.value = '';
    const clearBtn = document.getElementById('mon-filter-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    renderTable();
  };

  window._monSetStatusFilter = function(val, btnEl) {
    activeStatusFilter = val;
    // Reseta subfiltro ao sair do chip Esc.ok
    if (val !== 'esc') {
      escEnviadaSubfilter = false;
      const subBtn = document.getElementById('mon-sub-esc-enviada');
      if (subBtn) subBtn.classList.remove('active');
    }
    const escSubRow = document.getElementById('mon-esc-subfilter');
    if (escSubRow) escSubRow.style.display = val === 'esc' ? 'flex' : 'none';
    document.querySelectorAll('.mon-chip').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderTable();
  };

  window._monToggleEscEnviada = function(btnEl) {
    escEnviadaSubfilter = !escEnviadaSubfilter;
    if (btnEl) btnEl.classList.toggle('active', escEnviadaSubfilter);
    renderTable();
  };

  window._monToggleSort = function(col, thEl) {
    if (sortCol === col) {
      sortDir = sortDir * -1;
    } else {
      sortCol = col;
      sortDir = 1;
    }
    // Atualiza visual das colunas
    document.querySelectorAll('.mon-th-sort').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
    });
    if (thEl) thEl.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
    renderTable();
  };

  // ── COLAPSO DE GRUPOS (seções de horário) ────────────────────────────────────
  window._monToggleBucket = function(bucketKey, hdrEl) {
    const group = hdrEl ? hdrEl.closest('.mon-group') : document.querySelector(`.mon-group[data-bucket="${bucketKey}"]`);
    if (!group) return;
    const rows = group.querySelector('.mon-group-rows');
    const chevron = hdrEl ? hdrEl.querySelector('.g-chevron') : null;

    if (_monCollapsedBuckets.has(bucketKey)) {
      // Expandir
      _monCollapsedBuckets.delete(bucketKey);
      if (hdrEl) hdrEl.classList.remove('is-collapsed');
      if (chevron) chevron.textContent = '▼';
      if (rows) {
        rows.style.overflow = 'hidden';
        rows.style.display = 'block';
        // Anima altura de 0 → natural
        const h = rows.scrollHeight;
        rows.style.maxHeight = '0px';
        rows.style.transition = 'max-height 0.18s ease';
        requestAnimationFrame(() => { rows.style.maxHeight = h + 'px'; });
        setTimeout(() => { rows.style.maxHeight = ''; rows.style.overflow = ''; rows.style.transition = ''; }, 190);
      }
    } else {
      // Colapsar
      _monCollapsedBuckets.add(bucketKey);
      if (hdrEl) hdrEl.classList.add('is-collapsed');
      if (chevron) chevron.textContent = '▶';
      if (rows) {
        const h = rows.scrollHeight;
        rows.style.overflow = 'hidden';
        rows.style.maxHeight = h + 'px';
        rows.style.transition = 'max-height 0.18s ease';
        requestAnimationFrame(() => { rows.style.maxHeight = '0px'; });
        setTimeout(() => { rows.style.display = 'none'; rows.style.maxHeight = ''; rows.style.overflow = ''; rows.style.transition = ''; }, 190);
      }
    }
  };

  // ── ATUALIZAÇÃO MANUAL ────────────────────────────────────────────────────────
  function manualRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    if (_alignTimeout) clearTimeout(_alignTimeout);
    monCarregarContatos();
    iframesInUse = {};
    fetchQueue   = [];
    inQueue      = new Set();
    // Marca cache como stale mas não zera — renderTable ainda mostra dados antigos (com bolinhas)
    // Os novos fetches vão sobrescrever cada entrada quando chegarem
    Object.keys(apontCache).forEach(k => {
      if (apontCache[k] && apontCache[k] !== 'loading') apontCache[k]._stale = true;
    });
    try { sessionStorage.removeItem(CACHE_KEY); } catch(e) {}
    BG_IFRAME_IDS.forEach(id => {
      const ifr = document.getElementById(id);
      if (ifr) { ifr.onload = null; try { ifr.src = 'about:blank'; } catch(e) {} }
    });
    fetchOperations();
    scheduleAlignedRefresh();
    _obsLoad(() => renderTable());
    // Após atualizar: recarrega snap remoto e atualiza bolinhas com delay
    // para garantir que os fetches das ops já chegaram
    snapLoadRemote(() => setTimeout(_updateSnapDots, 500));
  }
  window._monRefresh = manualRefresh;

  // ── TEMA CLARO / ESCURO ───────────────────────────────────────────────────────
  const THEME_KEY = '_monTheme';
  (function() {
    try {
      if (localStorage.getItem(THEME_KEY) === 'dark') {
        const p = document.getElementById('mon-panel');
        if (p) { p.classList.add('mon-dark'); const b = document.getElementById('mon-theme-btn'); if (b) b.textContent = '☀️'; }
      }
    } catch(e) {}
  })();

  window._monToggleTheme = function() {
    const panel = document.getElementById('mon-panel');
    const btn   = document.getElementById('mon-theme-btn');
    if (!panel) return;
    const isDark = panel.classList.toggle('mon-dark');
    document.body.classList.toggle('mon-dark-mode', isDark);
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch(e) {}
  };

  // ── TOGGLE DE LAYOUT ──────────────────────────────────────────────────────────
  window._monToggleLayout = function() {
    _monLayoutMode = (_monLayoutMode === 'compact') ? 'normal' : 'compact';
    try { localStorage.setItem('_monLayoutMode', _monLayoutMode); } catch(e) {}
    const btn = document.getElementById('mon-layout-btn');
    if (btn) btn.classList.toggle('is-compact', _monLayoutMode === 'compact');
    const groupsEl = document.getElementById('mon-groups');
    if (groupsEl) groupsEl.classList.toggle('is-compact', _monLayoutMode === 'compact');
    const colhdr = document.querySelector('#mon-panel .mon-list-colhdr');
    if (colhdr) colhdr.classList.toggle('is-compact', _monLayoutMode === 'compact');
    if (typeof renderTableV2 === 'function') renderTableV2();
  };

  // Aplica layout salvo ao iniciar
  window._monApplyLayoutBtn = function() {
    const btn = document.getElementById('mon-layout-btn');
    if (btn) btn.classList.toggle('is-compact', _monLayoutMode === 'compact');
    const groupsEl = document.getElementById('mon-groups');
    if (groupsEl) groupsEl.classList.toggle('is-compact', _monLayoutMode === 'compact');
    const colhdr = document.querySelector('#mon-panel .mon-list-colhdr');
    if (colhdr) colhdr.classList.toggle('is-compact', _monLayoutMode === 'compact');
  };

  // ── POLL DE OBS A CADA 5s ────────────────────────────────────────────────────
  setInterval(() => {
    _obsLoad(() => {
      // Atualiza apenas badges de obs nas linhas sem re-renderizar a tabela inteira
      if (!window._monObsCache) return;
      document.querySelectorAll('.mon-obs-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        const match = onclick.match(/'([^']+)'/);
        if (!match) return;
        const opId = match[1];
        const obs = window._monObsCache[opId];
        const temObs = obs && obs.texto;
        btn.classList.toggle('has-obs', !!temObs);
        const wrap = btn.closest('.mon-obs-wrap');
        if (!wrap) return;
        const jaVista = _monObsVistas.has(opId);
        let badge = wrap.querySelector('.mon-obs-badge');
        if (temObs && !jaVista) {
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'mon-obs-badge';
            wrap.appendChild(badge);
          }
        } else if (badge) {
          badge.remove();
        }
      });
    });
  }, 5 * 1000);

  // ── ATUALIZAÇÃO SILENCIOSA ────────────────────────────────────────────────────
  // Atualiza a bolinha de mudança de escala para uma op específica
  function _updateSnapDotForOp(op) {
    const row = document.querySelector('tr[data-chave="' + op.chave + '"]');
    if (!row) return;
    const d = apontCache[op.id];
    const esc2 = d && d !== 'loading' ? (d.escalados || []) : null;
    const temSnap = !!escaladosSnapshot[op.id];
    const diff2 = esc2 && (d.listaEnviada || temSnap) ? snapDiff(op.id, esc2) : null;

    const cells = row.querySelectorAll('td');
    if (!cells[1]) return;
    const chaveSpan = cells[1].querySelector('.mon-chave');
    if (!chaveSpan) return;
    const existingDot = cells[1].querySelector('.mon-esc-change-dot');
    if (diff2 && !diff2._soSaiu) {
      if (!existingDot) {
        const dot = document.createElement('span');
        dot.className = 'mon-esc-change-dot';
        dot.style.cssText = 'margin-left:5px;vertical-align:middle';
        dot.title = 'Alguém entrou na escala desde o último envio';
        chaveSpan.after(dot);
        // Notifica entradas ainda não notificadas
        const novos = (diff2.entrou || []).filter(e => !notifEscChange.has(op.id + ':' + e.cpf));
        if (novos.length > 0) {
          notifyEscChange(op, novos, null);
          novos.forEach(e => notifEscChange.add(op.id + ':' + e.cpf));
          notifEscChangeSave();
        }
      }
    } else if (existingDot) {
      existingDot.remove();
      const saiuNotif = (diff2 && diff2.saiu) ? diff2.saiu.filter(e => notifEscChange.has(op.id + ':' + e.cpf)) : [];
      if (saiuNotif.length > 0) notifyEscChange(op, null, saiuNotif);
      (diff2 && diff2.saiu || []).forEach(e => notifEscChange.delete(op.id + ':' + e.cpf));
      notifEscChangeSave();
    }
  }

  // Atualiza apenas bolinhas de mudança de escala sem re-renderizar a tabela
  function _updateSnapDots() {
    // Processa linhas da tabela legada E do modo compacto (tr) E do modo v2 (div)
    const rows = [
      ...document.querySelectorAll('tr[data-chave]'),
      ...document.querySelectorAll('.mon-row-v2[data-chave]')
    ];
    rows.forEach(row => {
      const chave = row.dataset.chave;
      const op = operations.find(o => o.chave === chave);
      if (!op) return;
      const d = apontCache[op.id];
      const esc2 = d && d !== 'loading' ? (d.escalados || []) : null;
      // Exibe bolinha se listaEnviada OU se já existe snapshot remoto para esta op
      const temSnap = !!escaladosSnapshot[op.id];
      const diff2 = esc2 && (d.listaEnviada || temSnap) ? snapDiff(op.id, esc2) : null;
      const isDiv = row.tagName === 'DIV';
      const isCompact = !isDiv && row.closest('#mon-compact-tbl');
      const cells = row.querySelectorAll('td');
      const chaveSpan = isDiv
        ? row.querySelector('.mon-r-sigla')
        : isCompact
          ? (cells[0] && cells[0].querySelector('.mon-ct-chave'))
          : (cells[1] && cells[1].querySelector('.mon-chave'));
      if (!chaveSpan) return;
      const existingDot = row.querySelector('.mon-esc-change-dot');
      if (diff2 && !diff2._soSaiu) {
        if (!existingDot) {
          const dot = document.createElement('span');
          dot.className = 'mon-esc-change-dot';
          dot.style.cssText = 'margin-left:5px;vertical-align:middle';
          dot.title = 'Alguém entrou na escala desde o último envio';
          chaveSpan.after(dot);
          // Notifica apenas entradas ainda não notificadas
          const novos = (diff2.entrou || []).filter(e => {
            const k = op.id + ':' + e.cpf;
            return !notifEscChange.has(k);
          });
          if (novos.length > 0) {
            notifyEscChange(op, novos, null);
            novos.forEach(e => notifEscChange.add(op.id + ':' + e.cpf));
            notifEscChangeSave();
          }
        }
      } else if (existingDot) {
        existingDot.remove();
        // Notifica saída e limpa do set para poder notificar novamente se a pessoa entrar de novo
        const saiuNotif = (diff2 && diff2.saiu) ? diff2.saiu.filter(e => notifEscChange.has(op.id + ':' + e.cpf)) : [];
        if (saiuNotif.length > 0) notifyEscChange(op, null, saiuNotif);
        (diff2 && diff2.saiu || []).forEach(e => notifEscChange.delete(op.id + ':' + e.cpf));
        notifEscChangeSave();
      }
    });
  }

  function silentRefresh() {
    _obsLoad(null); // obs já tem poll próprio de 5s; aqui só atualiza cache
    snapLoadRemote(() => _updateSnapDots()); // atualiza bolinhas sem piscar

    const _doSilent = (ops) => {
      if (ops.length === 0) return;

      const oldIds  = new Set(operations.map(o => o.id));
      const newIds  = new Set(ops.map(o => o.id));

      const estruturaMudou = ops.some(o => !oldIds.has(o.id)) ||
                             operations.some(o => !newIds.has(o.id));

    operations.filter(o => !newIds.has(o.id)).forEach(o => {
      delete apontCache[o.id];
      expanded.delete(o.chave);
      monitoradas.delete(monKey(o));
    });

    ops.forEach(o => { if (dentroJanela(o)) monitoradas.add(monKey(o)); });
    // Preserva ops do histórico (_fromHist) que não estão na lista nova
    const _histOps = operations.filter(o => o._fromHist && !ops.find(n => n.id === o.id));
    operations = ops.concat(_histOps);
    if (estruturaMudou) {
      // Só adiciona/remove linhas que mudaram — não limpa a tabela toda
      const tbody = document.getElementById('mon-tbody');
      if (tbody) {
        // Remove linhas de ops que sumiram
        operations.filter(o => !newIds.has(o.id)).forEach(o => {
          const row = tbody.querySelector('tr[data-chave="' + o.chave + '"]');
          if (row) row.remove();
          const det = tbody.querySelector('#det-' + o.chave);
          if (det) det.remove();
        });
        // Se tem ops novas, re-renderiza só para garantir a ordem correta
        const temNova = ops.some(o => !oldIds.has(o.id));
        if (temNova) renderTable();
      } else {
        renderTable();
      }
    }

    // FIX: removido setTimeout escalonado (i * 50ms) — criava até 30 timers por refresh
    // acumulando race conditions quando o próximo silentRefresh disparava antes do anterior terminar.
    // A fila fetchQueue/processQueue já controla a concorrência (MAX_CONCURRENT) — enqueue direto é seguro.
    ops.filter(o => o.id).forEach((op) => {
        const cached = apontCache[op.id];
        const emJanela = naJanela(op);

        if (cached === 'loading') return;

        if (!oldIds.has(op.id)) {
          monitoradas.add(monKey(op));
          enfileirar(op, (novo, old) => {
            updateCells(op, novo, old);
            updateMetrics();
          });
          return;
        }

        // Se tinha cache só de escala mas agora entrou na janela, invalida e rebusca com apontamentos
        const eraSoEscala = cached && cached !== 'loading' && cached._soEscala;
        if (emJanela || eraSoEscala) {
          if (emJanela) monitoradas.add(monKey(op));
          inQueue.delete(op.id);
          enfileirar(op, (novo, old) => {
            updateCells(op, novo, old);
            updateMetrics();
            cacheSave();
            if (expanded.has(op.chave)) {
              const idx = operations.findIndex(o => o.chave === op.chave);
              const det = document.getElementById('det-' + op.chave);
              if (det) det.querySelector('.mon-detail-inner').innerHTML = renderDetail(op);
            }
          }, true);
        } else if (cached && cached !== 'loading' && typeof cached.apontado === 'number' && cached.apontado > 0) {
          // Tem apontados fora da janela: rebusca escala para manter escalado atualizado e aplicar o floor
          inQueue.delete(op.id);
          enfileirar(op, (novo, old) => {
            updateCells(op, novo, old);
            cacheSave();
          }, true);
        } else {
          // Só escala, sem apontamentos, fora da janela: rebusca escala para ver novos escalados
          if (!cached || cached._erro) {
            enfileirar(op, (novo) => {
              updateCells(op, novo, null);
              cacheSave();
            });
          } else {
            // Tem cache de escala válido: force-rebusca para atualizar escalados
            inQueue.delete(op.id);
            enfileirar(op, (novo, old) => {
              updateCells(op, novo, old);
              cacheSave();
            }, true);
          }
        }
    });

      const sub = document.getElementById('mon-sub');
      if (sub) sub.textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR');
    }; // fim _doSilent

    const opsPag1 = parseOpsFromDoc(document);
    if (monPaginas >= 2) {
      const agora = Date.now();
      const deveAtualizarPags = (agora - _pag2LastFetch) >= PAG2_INTERVAL;
      if (deveAtualizarPags) {
        // Busca todas as páginas além da 1 até não encontrar mais ops
        (async () => {
          const todasOps = [...opsPag1];
          let pagNum = 2;
          while (true) {
            try {
              const docN = await fetchDoc('https://tsi-app.com/planejamento-operacional_' + pagNum);
              const opsN = parseOpsFromDoc(docN);
              if (opsN.length === 0) break;
              todasOps.push(...opsN);
              if (pagNum === 2) _pag2LastFetch = Date.now();
              pagNum++;
            } catch(e) { break; }
          }
          _doSilent(todasOps);
        })();
      } else {
        // Mantém as ops das páginas extras que já estão em operations, junta com pag1 atualizada
        const idsPag1 = new Set(opsPag1.map(o => o.id));
        const opsPagsCache = operations.filter(o => !idsPag1.has(o.id));
        _doSilent([...opsPag1, ...opsPagsCache]);
      }
    } else {
      _doSilent(opsPag1);
    }
  }

  function updateCells(op, d, old) {
    if (!d || d === 'loading') return;
    const row = document.querySelector(`tr[data-chave="${op.chave}"]`);
    if (!row) return;
    const cells = row.querySelectorAll('td');
    if (cells[2]) cells[2].innerHTML = escaladoBadge(d, op.qtd);
    if (naJanela(op)) {
      if (cells[3]) cells[3].innerHTML = apontBadge(d, op.qtd);
    }
    if (cells[6]) cells[6].innerHTML = situacaoBadge(d, op);
    if (cells[7]) cells[7].innerHTML = escalaEnviadaBadge(op);

    // ── Atualiza highlight/cor da linha ──────────────────────────────────────
    const _hlV = d.solicitado > 0 && d.apontado >= d.solicitado;
    const _nenhum2 = d.escalado === 0 && d.apontado === 0;
    const _escOk2  = d.escalado >= d.solicitado;
    const _aptOk2  = d.apontado >= d.solicitado;
    const _bordaCor2 = _nenhum2           ? 'var(--mon-red)'
                     : (_aptOk2 && _escOk2) ? 'var(--mon-green)'
                     : (!_escOk2)           ? 'var(--mon-amber)'
                     : 'var(--mon-blue)';
    const _falta1h30b = (() => {
      if (!op.hora) return false;
      const [h, m] = op.hora.split(':').map(Number);
      if (isNaN(h)) return false;
      const agora = new Date();
      const agoraMin = agora.getHours() * 60 + agora.getMinutes();
      const opMin = h * 60 + (m || 0);
      let diff = opMin - agoraMin;
      if (diff < -180) diff += 1440;
      return diff <= 90;
    })();
    const _solVal2 = op.qtd || d.solicitado || 0;
    const _escVal2 = op.escAtual >= 0 ? op.escAtual : (d.escalado || 0);
    const _hlNenhum2 = !_hlV && _falta1h30b && _solVal2 > 0 && _escVal2 === 0;
    const _hlInc2    = !_hlV && _falta1h30b && _solVal2 > 0 && _escVal2 > 0 && _escVal2 < _solVal2;
    row.style.animation = '';
    const _hlBg = _hlV        ? 'rgba(10,124,87,0.13)'
                : _hlNenhum2  ? 'linear-gradient(90deg,rgba(127,0,0,0.07) 0%,rgba(185,28,28,0.02) 100%)'
                : _hlInc2     ? 'linear-gradient(90deg,rgba(185,28,28,0.05) 0%,rgba(185,28,28,0.01) 100%)'
                : '';
    if (_hlV) { row.classList.add('hl-verde'); } else { row.classList.remove('hl-verde'); }
    if (!_hlV) { cells.forEach(td => { td.style.background = _hlBg; }); }
    if (_hlV) {
      row.style.borderLeft  = '4px solid #0a7c57';
      row.style.boxShadow   = 'inset 0 0 0 1px rgba(10,124,87,0.18)';
    } else if (_hlNenhum2) {
      row.style.borderLeft  = '4px solid #7f0000';
      row.style.boxShadow   = '';
      row.style.outline     = '';
    } else if (_hlInc2) {
      row.style.borderLeft  = '3px solid var(--mon-red)';
      row.style.boxShadow   = '';
      row.style.outline     = '';
    } else {
      row.style.borderLeft  = '3px solid ' + _bordaCor2;
      row.style.boxShadow   = '';
      row.style.outline     = '';
    }

    // Atualiza detalhe expandido (inclui vales) se estiver aberto
    if (expanded.has(op.chave)) {
      const idx = operations.findIndex(o => o.chave === op.chave);
      const det = document.getElementById('det-' + op.chave);
      if (det) det.querySelector('.mon-detail-inner').innerHTML = renderDetail(op);
    }

    const _nid = String(op.id);

    // Se a op voltou ao estado ativo (não concluída) mas ainda não completou,
    // remove do set para poder notificar novamente quando completar
    if (!isConcluido(op) && notificadas.has(_nid)) {
      const jaCompleta = d && typeof d.apontado === 'number' && typeof d.solicitado === 'number'
                         && d.solicitado > 0 && d.apontado >= d.solicitado;
      if (!jaCompleta) {
        notificadas.delete(_nid);
        notificadasSave();
      }
    }

    // Notifica quando apontamentos completarem
    const _completa = d && d !== 'loading' && !d._erro &&
                      typeof d.apontado === 'number' && typeof d.solicitado === 'number' &&
                      d.solicitado > 0 && d.apontado >= d.solicitado;
    if (_completa && !isConcluido(op) && !notificadas.has(_nid)) {
      notify(op, d);
      notificadas.add(_nid);
      notificadasSave();
    }

    // Notifica quando escala completar (escalado >= solicitado)
    const _escCompleta = d && d !== 'loading' && !d._erro &&
                         typeof d.escalado === 'number' && op.qtd > 0 &&
                         d.escalado >= op.qtd;
    const _nidEsc = 'esc_' + String(op.id);
    if (_escCompleta && !d.listaEnviada && !d.todosConfirmados && !notifEscala.has(_nidEsc)) {
      notifyEscala(op, d);
      notifEscala.add(_nidEsc);
      notifEscSave();
    }
    // Se escala regrediu (alguém removido), permite notificar novamente
    if (!_escCompleta && notifEscala.has(_nidEsc)) {
      notifEscala.delete(_nidEsc);
      notifEscSave();
    }

    // Atualiza bolinha de mudança de escala para esta op agora que o cache está populado
    // Isso garante que a bolinha apareça mesmo sem precisar clicar na op
    _updateSnapDotForOp(op);

    // Atualiza o card desta op no painel V2 sem re-renderizar tudo —
    // usa debounce para não re-renderizar a cada fetch individual (evita flickering)
    if (typeof renderTableV2 === 'function') {
      clearTimeout(window._monRenderV2Timer);
      window._monRenderV2Timer = setTimeout(() => {
        try { renderTableV2(); } catch(e) {}
      }, 150);
    }
  }

  // ── DRAG / RESIZE / MINIMIZE ──────────────────────────────────────────────────
  // Shield único reutilizável — evita múltiplos overlays empilhados ou esquecidos
  let _monShield = null;
  function _showShield(cursor) {
    if (!_monShield) {
      _monShield = document.createElement('div');
      _monShield.style.cssText = 'position:fixed;inset:0;z-index:199999;';
      document.body.appendChild(_monShield);
    }
    _monShield.style.cursor = cursor;
  }
  function _hideShield() {
    if (_monShield) { _monShield.remove(); _monShield = null; }
    document.body.style.userSelect = '';
  }

  // Altura salva antes de minimizar para restaurar corretamente
  let _savedPanelHeight = '';

  function initControls(panel) {
    panel.style.position = 'fixed';
    let isDocked = true; // painel começa ancorado na direita via CSS

    // ── RESIZE (alça esquerda) ──────────────────────────────────────────────
    const rh = document.createElement('div');
    rh.className = 'mon-resize-handle';
    rh.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX, startW = panel.offsetWidth;
      document.body.style.userSelect = 'none';
      _showShield('ew-resize');
      let _lastRX = e.clientX;
      const mv = e => {
        _lastRX = e.clientX;
        requestAnimationFrame(() => {
          const newW = Math.min(Math.max(startW + (startX - _lastRX), 380), window.innerWidth - 40);
          panel.style.width = newW + 'px';
        });
      };
      const up = () => {
        document.body.style.userSelect = '';
        _hideShield();
        window.removeEventListener('mousemove', mv);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('blur', up);
      };
      window.addEventListener('mousemove', mv);
      window.addEventListener('mouseup', up);
      window.addEventListener('blur', up);
    });
    panel.appendChild(rh);

    // ── DRAG (header) ───────────────────────────────────────────────────────
    const header = panel.querySelector('#mon-header');
    if (!header) return;

    header.addEventListener('mousedown', e => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('[id^="mon-dd"]') || e.target.closest('[id^="wpp-dd"]')) return;

      // Se minimizado, qualquer clique no header restaura
      if (minimized) {
        window._monMinimize();
        return;
      }

      e.preventDefault();

      // Converte de right-anchored para posição absoluta na primeira arrastada
      if (isDocked) {
        const r = panel.getBoundingClientRect();
        panel.style.left  = r.left + 'px';
        panel.style.top   = r.top  + 'px';
        panel.style.right = 'auto';
        isDocked = false;
      }

      const r  = panel.getBoundingClientRect();
      const ox = e.clientX - r.left;
      const oy = e.clientY - r.top;
      document.body.style.userSelect = 'none';
      header.style.cursor = 'grabbing';
      _showShield('grabbing');

      let _lastX = e.clientX, _lastY = e.clientY;
      const mv = e => {
        _lastX = e.clientX; _lastY = e.clientY;
        requestAnimationFrame(() => {
          panel.style.left = Math.max(0, Math.min(_lastX - ox, window.innerWidth  - panel.offsetWidth))  + 'px';
          panel.style.top  = Math.max(0, Math.min(_lastY - oy, window.innerHeight - 60)) + 'px';
        });
      };
      const up = () => {
        header.style.cursor = '';
        document.body.style.userSelect = '';
        _hideShield();
        window.removeEventListener('mousemove', mv);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('blur', up);
      };
      window.addEventListener('mousemove', mv);
      window.addEventListener('mouseup', up);
      window.addEventListener('blur', up);
    });
  }

  const MINIM_KEY = '_monMinimized';

  window._monFechar = function() {
    const panel = document.getElementById('mon-panel');
    const btn   = document.getElementById('btn-mon');
    if (panel) panel.style.display = 'none';
    if (btn) {
      btn.style.display = '';
      btn.innerHTML = '<span class="mon-fab-badge"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
    }
    // Limpa persistência de estado ao fechar
    try { sessionStorage.removeItem(MINIM_KEY); } catch(e) {}
    minimized = false;
  };

  let _tickerAnim = null;
  let _tickerLastText = null;

  function tickerUpdate() {
    const ticker = document.getElementById('mon-ticker');
    const wrap   = document.getElementById('mon-ticker-wrap');
    if (!ticker || !wrap) return;

    // 1) Monta o texto novo
    const opsJanela = operations.filter(op => dentroJanela(op) && op.id);
    let novoTexto;
    if (opsJanela.length === 0) {
      novoTexto = '— Nenhuma operação na janela —';
    } else {
      novoTexto = opsJanela.map(op => {
        const d = apontCache[op.id];
        const temDados = d && d !== 'loading';
        const esc = temDados ? d.escalado : '?';
        const apt = temDados ? d.apontado : '?';
        const sol = op.qtd || '?';
        const status = (temDados && typeof apt === 'number' && typeof sol === 'number' && apt >= sol) ? '✅' : '⏳';
        return `${status} ${op.chave}  ${apt}/${sol}`;
      }).join('  ·  ');
    }

    // 2) Se o texto não mudou, não reinicia a animação — deixa rolar tranquilo
    if (novoTexto === _tickerLastText) return;
    _tickerLastText = novoTexto;

    // 3) Atualiza o texto e para animação atual
    ticker.textContent = novoTexto;
    ticker.style.animation = 'none';

    // 4) Duplo rAF: garante que o browser renderizou o novo texto antes de medir scrollWidth
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const wrapW = wrap.offsetWidth;
        const textW = ticker.scrollWidth;
        if (wrapW <= 0 || textW <= 0) return;

        const duration = (wrapW + textW) / 80;

        let styleEl = document.getElementById('mon-ticker-keyframes');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'mon-ticker-keyframes';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `@keyframes mon-ticker-scroll {
          from { transform: translateY(-50%) translateX(${wrapW}px); }
          to   { transform: translateY(-50%) translateX(-${textW}px); }
        }`;

        ticker.style.animation = `mon-ticker-scroll ${duration}s linear infinite`;
      });
    });
  }

    window._monCopiar = _monCopiar;
  window._monMinimize = function() {
    const body  = document.getElementById('mon-body');
    const btn   = document.getElementById('mon-min-btn');
    const panel = document.getElementById('mon-panel');
    if (!body || !btn || !panel) return;
    minimized = !minimized;
    if (minimized) {
      _savedPanelHeight = panel.style.height || '';
      const savedTop   = panel.style.top;
      const savedLeft  = panel.style.left;
      const savedRight = panel.style.right;
      body.style.display   = 'none';
      panel.style.height       = 'auto';
      panel.style.overflow     = 'hidden';
      panel.style.width        = 'clamp(340px, 42vw, 560px)';
      panel.style.borderRadius = '14px';
      panel.style.border       = '1px solid var(--mon-border)';
      // Ancora no canto inferior direito ao minimizar — sempre flutuante com margem
      panel.style.top    = 'auto';
      panel.style.bottom = '14px';
      panel.style.right  = '14px';
      panel.style.left   = 'auto';
      panel.dataset.savedTop   = savedTop;
      panel.dataset.savedLeft  = savedLeft;
      panel.dataset.savedRight = savedRight;
      btn.innerHTML = '&#9633;';
      // Clique em qualquer lugar do header restaura quando minimizado
      panel.dataset.minimized = '1';
      try { sessionStorage.setItem(MINIM_KEY, '1'); } catch(e) {}
      // Esconde o botão flutuante
      const fabBtn = document.getElementById('btn-mon');
      if (fabBtn) fabBtn.style.display = 'none';
      // Mostra e atualiza ticker
      const tickerWrap = document.getElementById('mon-ticker-wrap');
      if (tickerWrap) tickerWrap.style.display = 'flex';
      tickerUpdate();
    } else {
      // Restaura posição original ANTES de mostrar
      panel.style.bottom = '';
      panel.style.top    = panel.dataset.savedTop   || '0';
      panel.style.left   = panel.dataset.savedLeft  || 'auto';
      panel.style.right  = panel.dataset.savedRight || '0';
      panel.style.height       = _savedPanelHeight || '100vh';
      panel.style.width        = '';
      panel.style.borderRadius = '0 0 0 18px';
      panel.style.border       = '1px solid var(--mon-border)';
      panel.style.overflow     = 'hidden';
      panel.style.overflow = 'hidden';
      panel.style.display  = 'flex';
      panel.style.flexDirection = 'column';
      // Restaura o body
      body.style.cssText = 'display:flex;flex:1;overflow:hidden;min-height:0';
      btn.innerHTML = '&#8212;';
      panel.dataset.minimized = '';
      try { sessionStorage.removeItem(MINIM_KEY); } catch(e) {}
      // Mostra o botão flutuante novamente
      const fabBtn = document.getElementById('btn-mon');
      if (fabBtn) fabBtn.style.display = '';
      // Esconde ticker e restaura spacer
      const tickerWrap = document.getElementById('mon-ticker-wrap');
      if (tickerWrap) tickerWrap.style.display = 'none';
      if (_tickerAnim) { cancelAnimationFrame(_tickerAnim); _tickerAnim = null; }
      const tickerEl = document.getElementById('mon-ticker');
      if (tickerEl) tickerEl.style.animation = 'none';
      _tickerLastText = null;
      // Força reflow para a scrollbar reaparecer corretamente
      requestAnimationFrame(() => {
        const wrap = document.getElementById('mon-table-wrap');
        if (wrap) { wrap.style.overflowY = 'hidden'; requestAnimationFrame(() => { wrap.style.overflowY = 'auto'; }); }
      });
    }
  };

  // ── BOTÃO FLUTUANTE ───────────────────────────────────────────────────────────
  function injectButton() {
    if (document.getElementById('btn-mon')) return;
    if (window.self !== window.top) return;
    const btn = document.createElement('button');
    btn.id = 'btn-mon';
    btn.innerHTML = `<span class="mon-fab-badge"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    btn.onclick = toggleMonitor;
    document.body.appendChild(btn);
  }

  // ── ESTILOS ───────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('mon-style')) return;
    const s = document.createElement('style');
    s.id = 'mon-style';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
      /* Fallback imediato enquanto Inter carrega — evita FOIT que pode contribuir para tremedeira */
      #mon-panel { font-display: swap; }

      /* ── VARIÁVEIS TEMA EQUILIBRADO ── */
      :root {
        --mon-bg:          #ECEAE4;
        --mon-surface:     #F0EEE9;
        --mon-wa-bg:       #ECE5DD;
        --mon-wa-bubble:   #DCF8C6;
        --mon-surface2:    #E4E2DC;
        --mon-surface3:    #DDDBD4;
        --mon-border:      #B8B6AE;
        --mon-border2:     #A8A69E;
        --mon-text:        #1B1B1B;
        --mon-text-dim:    #4A4845;
        --mon-text-faint:  #8A8880;
        --mon-green:       #0a7c57;
        --mon-green-light: #0e9e6e;
        --mon-green-bg:    rgba(10,124,87,0.11);
        --mon-green-border:rgba(10,124,87,0.28);
        --mon-amber:       #a85800;
        --mon-amber-bg:    rgba(168,88,0,0.1);
        --mon-amber-border:rgba(168,88,0,0.28);
        --mon-red:         #b91c1c;
        --mon-red-bg:      rgba(185,28,28,0.09);
        --mon-red-border:  rgba(185,28,28,0.28);
        --mon-blue:        #1d4ed8;
        --mon-blue-bg:     rgba(29,78,216,0.09);
        --mon-blue-border: rgba(29,78,216,0.28);
        --mon-indigo:      #4338ca;
        --mon-indigo-bg:   rgba(67,56,202,0.1);
        --mon-indigo-border:rgba(67,56,202,0.28);
        --mon-accent:      #4338ca;
        --mon-accent-bg:   rgba(67,56,202,0.1);
        --mon-accent-border:rgba(67,56,202,0.28);
        --mon-shadow-sm:   0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.07);
        --mon-shadow:      0 4px 16px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07);
        --mon-shadow-lg:   0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
        --mon-radius:      10px;
        --mon-radius-sm:   6px;
        --mon-radius-xs:   4px;
        --mon-font: 'Inter', system-ui, sans-serif;
        --mon-mono: 'JetBrains Mono', 'Consolas', monospace;
      }

      /* ── TEMA ESCURO ── */
      #mon-panel.mon-dark {
        --mon-bg:           #2e2e2c;
        --mon-surface:      #383836;
        --mon-surface2:     #424240;
        --mon-surface3:     #4a4a48;
        --mon-border:       #555552;
        --mon-border2:      #626260;
        --mon-text:         #e8e6e0;
        --mon-text-dim:     #b0ada6;
        --mon-text-faint:   #7a7874;
        --mon-green:        #34d399;
        --mon-green-bg:     rgba(52,211,153,0.12);
        --mon-green-border: rgba(52,211,153,0.30);
        --mon-amber:        #fbbf24;
        --mon-amber-bg:     rgba(251,191,36,0.12);
        --mon-amber-border: rgba(251,191,36,0.30);
        --mon-red:          #f87171;
        --mon-red-bg:       rgba(248,113,113,0.12);
        --mon-red-border:   rgba(248,113,113,0.30);
        --mon-blue:         #60a5fa;
        --mon-blue-bg:      rgba(96,165,250,0.12);
        --mon-blue-border:  rgba(96,165,250,0.30);
        --mon-accent:       #818cf8;
        --mon-accent-bg:    rgba(129,140,248,0.12);
        --mon-accent-border:rgba(129,140,248,0.30);
        --mon-shadow-sm:    0 1px 3px rgba(0,0,0,0.4);
        --mon-shadow:       0 4px 16px rgba(0,0,0,0.5);
        --mon-shadow-lg:    0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);
      }

      #mon-panel.mon-dark,
      body.mon-dark-mode #mon-bio-box,
      body.mon-dark-mode #mon-faltas-box,
      body.mon-dark-mode #mon-vales-box,
      body.mon-dark-mode #mon-lista-box,
      body.mon-dark-mode .mon-obs-popover,
      body.mon-dark-mode #mon-hist-box,
      body.mon-dark-mode #mon-hist-det-box,
      body.mon-dark-mode #mon-wpp-modal > div,
      #mon-panel.mon-dark #mon-ticker {
        color: #e8e6e0 !important;
      }
      #mon-panel.mon-dark #mon-ticker-wrap {
        background: var(--mon-surface, #1e293b) !important;
        border-color: var(--mon-border, #334155) !important;
      }
      /* ── Minimizado: painel vira uma pill arredondada ── */
      #mon-panel[data-minimized="1"] {
        border-radius: 14px !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.32) !important;
      }
      /* ── Modo minimizado: logo + letreiro + botão maximizar ── */
      #mon-panel[data-minimized="1"] #mon-live,
      #mon-panel[data-minimized="1"] #mon-refresh-pill,
      #mon-panel[data-minimized="1"] #mon-notif-hist-btn,
      #mon-panel[data-minimized="1"] .mon-avatar-wrap,
      #mon-panel[data-minimized="1"] #mon-busca-colab-btn,
      #mon-panel[data-minimized="1"] #mon-layout-btn,
      #mon-panel[data-minimized="1"] #mon-theme-btn,
      #mon-panel[data-minimized="1"] .mon-hd-spacer,
      #mon-panel[data-minimized="1"] .mon-hd-icon-btn--danger,
      #mon-panel[data-minimized="1"] #mon-saudacao { display: none !important; }
      #mon-panel[data-minimized="1"] .mon-logo-text {
        display: none !important;
      }
      /* ticker-wrap cresce para ocupar o espaço disponível */
      #mon-panel[data-minimized="1"] #mon-ticker-wrap {
        flex: 1 !important;
        max-width: unset !important;
        margin: 0 10px !important;
      }
      /* logo menor e sem texto */
      #mon-panel[data-minimized="1"] .mon-logo-icon {
        width: 28px !important;
        height: 28px !important;
      }
      #mon-panel[data-minimized="1"] .mon-logo-icon img {
        width: 28px !important;
        height: 28px !important;
      }
      /* botão maximizar — bem visível */
      #mon-panel[data-minimized="1"] #mon-min-btn {
        display: inline-flex !important;
        opacity: 1 !important;
        width: 26px !important;
        height: 26px !important;
        font-size: 14px !important;
        background: var(--mon-accent-bg, rgba(99,102,241,0.18)) !important;
        border: 1px solid var(--mon-accent-border, rgba(99,102,241,0.45)) !important;
        color: var(--mon-accent, #6366f1) !important;
        border-radius: 7px !important;
      }
      #mon-panel[data-minimized="1"] #mon-min-btn:hover {
        background: var(--mon-accent, #6366f1) !important;
        color: #fff !important;
      }
      body.mon-dark-mode #mon-bio-modal,
      body.mon-dark-mode #mon-faltas-modal,
      body.mon-dark-mode #mon-vales-modal,
      body.mon-dark-mode #mon-lista-modal,
      body.mon-dark-mode #mon-adto-modal,
      body.mon-dark-mode #mon-wpp-modal,
      body.mon-dark-mode #mon-hist-modal,
      body.mon-dark-mode #mon-hist-det-modal,
      body.mon-dark-mode #mon-config-modal,
      body.mon-dark-mode #mon-notif-hist-modal { background: rgba(0,0,0,0.55); }

      body.mon-dark-mode #mon-progress-overlay { background: rgba(0,0,0,0.55); }

      body.mon-dark-mode #mon-faltas-box,
      body.mon-dark-mode #mon-bio-box,
      body.mon-dark-mode #mon-lista-box,
      body.mon-dark-mode #mon-vales-box,
      body.mon-dark-mode #mon-hist-box,
      body.mon-dark-mode #mon-hist-det-box {
        border: 1px solid #555552;
      }

      body.mon-dark-mode .mon-obs-popover {
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      }

      /* Elementos fora do #mon-panel que usam var(--mon-*) */
      body.mon-dark-mode #mon-voltar-fixed,
      body.mon-dark-mode #mon-bio-box,
      body.mon-dark-mode #mon-faltas-box,
      body.mon-dark-mode #mon-vales-box,
      body.mon-dark-mode #mon-lista-box,
      body.mon-dark-mode .mon-obs-popover,
      body.mon-dark-mode #mon-sa-modal > div,
      body.mon-dark-mode #mon-contatos-modal > div,
      body.mon-dark-mode #mon-rel-combinado-modal > div,
      body.mon-dark-mode #mon-hist-modal > div,
      body.mon-dark-mode #mon-hist-det-modal > div,
      body.mon-dark-mode #mon-config-modal > div,
      body.mon-dark-mode #mon-notif-hist-modal > div {
        --mon-bg:           #2e2e2c;
        --mon-surface:      #383836;
        --mon-surface2:     #424240;
        --mon-surface3:     #4a4a48;
        --mon-border:       #555552;
        --mon-border2:      #626260;
        --mon-text:         #e8e6e0;
        --mon-text-dim:     #b0ada6;
        --mon-text-faint:   #7a7874;
        --mon-green:        #34d399;
        --mon-green-bg:     rgba(52,211,153,0.12);
        --mon-green-border: rgba(52,211,153,0.30);
        --mon-amber:        #fbbf24;
        --mon-amber-bg:     rgba(251,191,36,0.12);
        --mon-amber-border: rgba(251,191,36,0.30);
        --mon-red:          #f87171;
        --mon-red-bg:       rgba(248,113,113,0.12);
        --mon-red-border:   rgba(248,113,113,0.30);
        --mon-blue:         #60a5fa;
        --mon-blue-bg:      rgba(96,165,250,0.12);
        --mon-blue-border:  rgba(96,165,250,0.30);
        --mon-accent:       #818cf8;
        --mon-accent-bg:    rgba(129,140,248,0.12);
        --mon-accent-border:rgba(129,140,248,0.30);
        --mon-font: 'Inter', system-ui, sans-serif;
        --mon-mono: 'JetBrains Mono', 'Consolas', monospace;
        --mon-radius: 10px;
        --mon-radius-sm: 6px;
        --mon-radius-xs: 4px;
        --mon-shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
        --mon-shadow: 0 4px 16px rgba(0,0,0,0.5);
        --mon-wa-bg:     #0b141a;
        --mon-wa-bubble: #005c4b;
        --mon-wa-text:   #e9edef;
      }

      /* Botão tema */
      #mon-theme-btn {
        height: 32px; width: 32px; border-radius: var(--mon-radius-sm);
        border: 1px solid var(--mon-border2); background: var(--mon-surface);
        color: var(--mon-text-dim); font-size: 15px; font-family: var(--mon-font);
        cursor: pointer; transition: background 0.1s,color 0.1s;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      #mon-theme-btn:hover { background: var(--mon-surface2); color: var(--mon-text); }

      /* ── KEYFRAMES ── */
      @keyframes mon-shake {
        0%   { transform: rotate(-6deg) scale(1.03); }
        100% { transform: rotate(6deg)  scale(1.03); }
      }
      @keyframes mon-bar-fill {
        from { width: 0; }
        to   { width: var(--bar-w); }
      }
      @keyframes mon-fadein {
        from { opacity: 0; transform: translateY(2px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes mon-pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.6; transform: scale(0.85); }
      }
      @keyframes mon-hg-thread-blink {
        0%, 100% { opacity: 0.7; }
        50%       { opacity: 0.2; }
      }
      @keyframes mon-row-in {
        from { opacity: 0; transform: translateX(4px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes mon-esc-change-blink {
        0%,100% { opacity:1; transform:scale(1); }
        50%      { opacity:0.6; transform:scale(1.25); }
      }
      .mon-esc-change-dot {
        display:inline-block; width:8px; height:8px; border-radius:50%;
        background:var(--mon-red); flex-shrink:0;
        animation:mon-esc-change-blink 1.1s ease-in-out infinite;
        will-change: transform, opacity;
      }
      @keyframes mon-live-blink {
        0%,100%{opacity:1}
        50%{opacity:.45}
      }
      @keyframes mon-live-ring {
        0%{transform:translateY(-50%) scale(1);opacity:.7}
        100%{transform:translateY(-50%) scale(2.4);opacity:0}
      }
      .mon-live-badge {
        display:inline-flex;align-items:center;gap:3px;
        background:rgba(220,38,38,0.10);border:1px solid rgba(220,38,38,0.30);
        border-radius:99px;padding:1px 5px 1px 3px;
        font-size:9px;font-weight:700;color:#dc2626;
        white-space:nowrap;flex-shrink:0;user-select:none;
        position:relative;line-height:1.3;
      }
      .mon-live-badge .lc { width:5px;height:5px;border-radius:50%;background:#dc2626;flex-shrink:0;animation:mon-live-blink 1.1s ease-in-out infinite;will-change:opacity,box-shadow; }
      .mon-live-badge .lr { position:absolute;left:3px;top:50%;width:5px;height:5px;border-radius:50%;background:#dc2626;opacity:0;animation:mon-live-ring 1.1s ease-out infinite;will-change:transform,opacity; }
      @keyframes mon-slide-in {
        from { opacity: 0; transform: translateX(32px) scale(0.98); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      #mon-ticker-wrap {
        mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
      }
      #mon-ticker {
        font-family: 'Courier New', Courier, monospace !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        letter-spacing: 0.3px;
        color: #1b2333 !important;
        text-shadow: none;
      }

      /* ── COPIAR COM CLIQUE ── */
      .mon-copiavel {
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.15s, color 0.15s;
      }
      .mon-copiavel:hover {
        background: var(--mon-accent-bg) !important;
        color: var(--mon-accent) !important;
      }
      /* ── BOTÃO FLUTUANTE ── */
      #btn-mon {
        position: fixed; bottom: 24px; right: 24px; z-index: 99999;
        width: 52px; height: 52px;
        display: flex; align-items: center; justify-content: center;
        background: #1e293b; color: #60a5fa;
        border: 1px solid #334155; border-radius: 14px;
        cursor: pointer; padding: 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        transition: background 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.15s;
      }
      #btn-mon svg { width: 24px; height: 24px; display: block; }
      #btn-mon:hover { background: #253347; border-color: rgba(96,165,250,0.35); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.5); }
      #btn-mon:active { transform: translateY(0); }
      .mon-fab-badge {
        position: absolute; top: 7px; right: 7px;
        width: 8px; height: 8px; border-radius: 50%;
        background: #22c55e; box-shadow: 0 0 0 2px #1e293b;
        pointer-events: none;
      }

      /* ── PAINEL PRINCIPAL ── */
      #mon-panel {
        font-family: var(--mon-font);
        font-size: 13px;
        background: var(--mon-bg);
        color: var(--mon-text);
        border: 1px solid var(--mon-border);
        border-radius: 0 0 0 18px;
        box-shadow: 0 8px 48px rgba(0,0,0,0.28), 0 2px 12px rgba(0,0,0,0.18);
        animation: mon-slide-in 0.15s cubic-bezier(0.22,1,0.36,1) both;
        /* ── Perf: cria stacking context isolado para o painel inteiro ── */
        isolation: isolate;
        contain: layout;
        overflow: hidden; /* garante que filhos respeitem o border-radius */
      }

      /* ── RESIZE HANDLE ── */
      .mon-resize-handle {
        position: absolute; left: 0; top: 0; width: 4px; height: 100%;
        cursor: ew-resize; z-index: 10; background: transparent;
        transition: background 0.15s;
      }
      .mon-resize-handle:hover { background: var(--mon-accent); opacity: 0.3; }

      /* ── SCROLLBAR — sempre visível, larga ── */
      #mon-panel ::-webkit-scrollbar { width: 7px; height: 7px; }
      #mon-panel ::-webkit-scrollbar-track { background: transparent; }
      #mon-panel ::-webkit-scrollbar-thumb {
        background: var(--mon-green-border);
        border-radius: 99px;
        min-height: 36px;
      }
      #mon-panel ::-webkit-scrollbar-thumb:hover { background: var(--mon-green); }
      #mon-panel ::-webkit-scrollbar-corner { background: transparent; }
      #mon-table-wrap {
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
      }

      /* ── HEADER ── */
      #mon-header {
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border);
        border-radius: 0;
        padding: 0 16px;
        height: 56px;
        display: flex; align-items: center; justify-content: flex-start;
        flex-shrink: 0; user-select: none; cursor: grab;
        gap: 12px;
      }
      #mon-header:active { cursor: grabbing; }
      .mon-logo {
        display: flex; align-items: center; gap: 10px; flex-shrink: 0;
      }
      .mon-logo-icon {
        width: 40px; height: 40px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; overflow: hidden;
        box-shadow: 0 2px 12px rgba(30,100,255,0.5);
        filter: brightness(1.1) contrast(1.05);
      }
      .mon-logo-icon img {
        width: 40px; height: 40px; object-fit: cover; display: block;
      }
      .mon-logo-text {
        display: flex; flex-direction: column; gap: 0px;
      }
      .mon-logo-title {
        font-size: 13px; font-weight: 700; color: var(--mon-text);
        letter-spacing: -0.2px;
      }
      .mon-logo-sub {
        font-size: 11px; color: var(--mon-text-faint); font-weight: 400;
      }

      /* ── STATUS PILL ── */
      .mon-status-pill {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 4px 10px; border-radius: 99px;
        border: 1px solid;
        font-size: 11px; font-weight: 600; letter-spacing: 0.2px;
        white-space: nowrap;
      }
      .mon-status-pill[data-state="live"] {
        color: var(--mon-green); border-color: var(--mon-green-border);
        background: var(--mon-green-bg);
      }
      .mon-status-pill[data-state="sync"] {
        color: var(--mon-amber); border-color: var(--mon-amber-border);
        background: var(--mon-amber-bg);
      }
      .mon-status-pill[data-state="offline"] {
        color: var(--mon-text-faint); border-color: var(--mon-border);
        background: transparent;
      }
      .mon-status-dot {
        width: 6px; height: 6px; border-radius: 50%; background: currentColor;
        flex-shrink: 0;
      }
      .mon-status-pill[data-state="live"] .mon-status-dot {
        animation: mon-pulse-dot 1.8s ease-in-out infinite;
      }
      .mon-status-pill[data-state="sync"] .mon-status-dot {
        animation: mon-spin 1s linear infinite;
        border-radius: 0;
        clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      }

      /* ── BOTÕES HEADER ── */
      .mon-hdr-btn {
        height: 32px; padding: 0 12px; border-radius: var(--mon-radius-sm);
        border: 1px solid var(--mon-border2); background: var(--mon-surface);
        color: var(--mon-text-dim); font-size: 12px; font-family: var(--mon-font);
        font-weight: 500; cursor: pointer; transition: background 0.1s,color 0.1s;
        display: inline-flex; align-items: center; gap: 5px;
        white-space: nowrap;
      }
      .mon-hdr-btn:hover {
        background: var(--mon-surface2); color: var(--mon-text);
        border-color: var(--mon-border2);
      }
      .mon-hdr-btn--green {
        color: var(--mon-green); border-color: var(--mon-green-border);
        background: var(--mon-green-bg);
      }
      .mon-hdr-btn--green:hover { background: rgba(5,150,105,0.14); }
      .mon-hdr-btn[data-state="on"] { color: var(--mon-green); }
      .mon-hdr-btn[data-state="off"] { color: var(--mon-red); }

      .mon-icon-btn {
        width: 32px; height: 32px; border-radius: var(--mon-radius-sm);
        border: 1px solid var(--mon-border); background: transparent;
        color: var(--mon-text-faint); font-size: 14px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: background 0.1s,color 0.1s; flex-shrink: 0;
      }
      .mon-icon-btn:hover { background: var(--mon-surface2); color: var(--mon-text); border-color: var(--mon-border2); }

      /* ── MÉTRICAS ── */
      #mon-metrics {
        display: grid; grid-template-columns: repeat(4, 1fr);
        border-bottom: 1px solid var(--mon-border);
        flex-shrink: 0;
        background: var(--mon-surface);
        overflow: hidden;
        max-height: 80px;
        transition: max-height 0.25s ease, opacity 0.2s ease, border-width 0.25s ease;
        opacity: 1;
      }
      #mon-metrics.mon-metrics-hidden {
        max-height: 0;
        opacity: 0;
        border-bottom-width: 0;
      }
      .mon-metric {
        padding: 14px 16px; position: relative;
        border-right: 1px solid var(--mon-border);
      }
      .mon-metric:last-child { border-right: none; }
      .mon-metric-label {
        font-size: 10px; color: var(--mon-text-faint); letter-spacing: 0.5px;
        text-transform: uppercase; margin-bottom: 5px; font-weight: 600;
      }
      .mon-metric-val {
        font-size: 28px; font-weight: 700; line-height: 1;
        color: var(--mon-text); letter-spacing: -1px;
      }
      .mon-metric-val.green  { color: var(--mon-green); }
      .mon-metric-val.amber  { color: var(--mon-amber); }
      .mon-metric-val.red    { color: var(--mon-red); }
      .mon-metric-accent {
        position: absolute; bottom: 0; left: 16px; right: 16px;
        height: 2px; border-radius: 1px; opacity: 0;
        transition: opacity 0.3s;
      }
      .mon-metric:hover .mon-metric-accent { opacity: 1; }
      .mon-metric:nth-child(1) .mon-metric-accent { background: var(--mon-accent); }
      .mon-metric:nth-child(2) .mon-metric-accent { background: var(--mon-green); }
      .mon-metric:nth-child(3) .mon-metric-accent { background: var(--mon-amber); }
      .mon-metric:nth-child(4) .mon-metric-accent { background: var(--mon-red); }

      /* ── FILTER BAR ── */
      #mon-filter-bar {
        display: flex; flex-direction: column; gap: 10px;
        padding: 12px 14px 10px;
        border-bottom: 1px solid var(--mon-border);
        background: var(--mon-surface);
        flex-shrink: 0;
      }
      #mon-filter-input-wrap {
        display: flex; align-items: center; gap: 8px;
        background: var(--mon-bg);
        border: 1.5px solid var(--mon-border2);
        border-radius: 8px; padding: 7px 12px;
        width: 100%; box-sizing: border-box;
        transition: border-color 0.18s, box-shadow 0.18s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      #mon-filter-input-wrap:focus-within {
        border-color: var(--mon-green);
        box-shadow: 0 0 0 3px rgba(10,124,87,0.12);
      }
      .mon-filter-icon { color: var(--mon-green); font-size: 15px; flex-shrink: 0; opacity: 0.8; }
      #mon-filter-input {
        flex: 1; background: transparent; border: none; outline: none;
        color: var(--mon-text); font-size: 12.5px; font-family: var(--mon-font);
      }
      #mon-filter-input::placeholder { color: var(--mon-text-faint); }
      #mon-filter-clear {
        background: none; border: none; color: var(--mon-text-faint);
        cursor: pointer; font-size: 12px; padding: 0; line-height: 1;
        display: none; transition: color 0.15s;
      }
      #mon-filter-clear:hover { color: var(--mon-red); }

      /* ── STATUS CHIPS ── */
      #mon-status-chips { display: flex; flex-wrap: wrap; gap: 5px; }
      .mon-chip {
        padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 500;
        font-family: var(--mon-font); cursor: pointer;
        border: 1.5px solid var(--mon-border2);
        background: var(--mon-bg); color: var(--mon-text-dim);
        transition: background 0.1s,color 0.1s; letter-spacing: 0.2px; white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0,0,0,0.06);
      }
      .mon-chip:hover { background: var(--mon-surface2); color: var(--mon-text); border-color: var(--mon-green-border); }
      .mon-chip.active { background: var(--mon-accent-bg); border-color: var(--mon-accent-border); color: var(--mon-accent); font-weight: 600; box-shadow: none; }
      .mon-chip--completo.active { background: var(--mon-green-bg); border-color: var(--mon-green); color: var(--mon-green); font-weight: 700; }
      .mon-chip--parcial.active  { background: var(--mon-amber-bg); border-color: var(--mon-amber-border); color: var(--mon-amber); }
      .mon-chip--esc.active      { background: var(--mon-blue-bg); border-color: var(--mon-blue-border); color: var(--mon-blue); }
      .mon-chip--esc-inc.active  { background: rgba(234,88,12,0.07); border-color: rgba(234,88,12,0.25); color: #ea580c; }
      .mon-chip--nenhum.active   { background: var(--mon-red-bg); border-color: var(--mon-red-border); color: var(--mon-red); }
      .mon-chip--esc-inc-nenhum.active { background: rgba(127,0,0,0.08); border-color: rgba(127,0,0,0.30); color: #7f0000; }
      #mon-sub-esc-enviada.active { background: var(--mon-blue-bg); border-color: var(--mon-blue-border); color: var(--mon-blue); font-weight: 600; }
      .mon-pag-btn {
        font-size: 10px; font-weight: 600; font-family: var(--mon-font);
        padding: 1px 6px; border-radius: 4px; cursor: pointer;
        border: 1.5px solid var(--mon-border2);
        background: transparent; color: var(--mon-text-faint);
        transition: background 0.1s,color 0.1s; line-height: 1.6;
      }
      .mon-pag-btn:hover { background: var(--mon-surface2); color: var(--mon-text); }
      .mon-pag-btn.active { background: var(--mon-accent-bg); border-color: var(--mon-accent-border); color: var(--mon-accent); }
      #mon-sub-esc-info { transition: opacity 0.15s; }

      /* ── TABELA ── */
      #mon-table-wrap { flex: 1; overflow-y: auto; overflow-x: hidden; background: var(--mon-bg); min-height: 0; box-sizing: border-box; }
      #mon-table {
        width: 100%; border-collapse: collapse; font-size: 12.5px;
        table-layout: fixed; box-sizing: border-box;
      }
      #mon-table thead th {
        padding: 9px 13px;
        text-align: left; font-size: 10.5px; font-weight: 600;
        color: var(--mon-text-faint); letter-spacing: 0.4px;
        text-transform: uppercase;
        background: var(--mon-surface);
        border-bottom: 1.5px solid var(--mon-border);
        position: sticky; top: 0; z-index: 2;
        white-space: nowrap;
      }
      #mon-table thead th.center { text-align: center; }

      /* ── ROWS ── */
      tr.op-row { border-left: 3px solid transparent;
        border-bottom: 1px solid var(--mon-border);
        cursor: pointer; background: var(--mon-bg);
        transition: background 0.1s;
        animation: mon-row-in 0.2s ease both;
      }
      tr.op-row:hover td { background: var(--mon-surface) !important; }
      tr.op-row.is-expanded td { background: var(--mon-surface2) !important; }
      tr.op-row.hl-verde td { background: rgba(10,124,87,0.22) !important; }
      tr.op-row.hl-verde:hover td { background: rgba(10,124,87,0.30) !important; }
      tr.op-row.hl-verde.is-expanded td { background: rgba(10,124,87,0.32) !important; }
      tr.op-row td {
        padding: 11px 13px; vertical-align: middle;
        background: var(--mon-bg); transition: background 0.1s;
      }
      tr.op-row td:nth-child(8) { padding-right: 6px; }

      .mon-chave {
        font-family: var(--mon-mono);
        font-size: 11px; color: var(--mon-accent);
        white-space: nowrap; overflow: hidden;
        letter-spacing: -0.3px; display: block;
        font-weight: 600;
      }
      .mon-sigla {
        font-weight: 700; font-size: 13px; color: var(--mon-text);
        letter-spacing: -0.3px;
      }
      .mon-hora {
        font-family: var(--mon-mono);
        font-size: 12px; color: var(--mon-text);
        letter-spacing: -0.2px; font-weight: 600;
      }
      .mon-lider {
        font-size: 12px; color: var(--mon-text-dim);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        display: block;
      }
      .mon-lider-multi {
        white-space: normal; overflow: visible; text-overflow: initial;
        line-height: 1.35; word-break: break-word;
      }
      .mon-lider-sep {
        color: var(--mon-border); margin: 0 3px; font-size: 10px;
      }


      /* ── PROGRESS BADGE ── */
      .mon-prog-cell { text-align: center; }
      .mon-prog-num {
        font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
      }
      .mon-prog-bar {
        height: 3px; background: var(--mon-surface3); border-radius: 2px;
        overflow: hidden; margin-top: 4px;
      }
      .mon-prog-fill {
        height: 100%; border-radius: 2px;
        width: var(--bar-w);
        transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
      }
      .mon-prog-pending { font-size: 12px; color: var(--mon-text-faint); }
      .mon-prog-na { font-size: 11px; color: var(--mon-text-faint); }

      /* ── STATUS BADGES ── */
      .mon-status-badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 5px 12px; border-radius: 99px;
        font-size: 13px; font-weight: 700; letter-spacing: 0.1px;
        white-space: nowrap; border: 1px solid transparent;
      }
      .mon-status-badge.completo  { color: var(--mon-green); background: var(--mon-green-bg); border-color: var(--mon-green-border); }
      .mon-status-badge.parcial   { color: var(--mon-amber); background: var(--mon-amber-bg); border-color: var(--mon-amber-border); }
      .mon-status-badge.esc-ok    { color: var(--mon-blue); background: var(--mon-blue-bg); border-color: var(--mon-blue-border); }
      .mon-status-badge.nenhum    { color: var(--mon-red); background: var(--mon-red-bg); border-color: var(--mon-red-border); }
      .mon-status-badge.neutro    { color: var(--mon-text-faint); background: transparent; }
      .mon-envelope { font-size: 12px; margin-left: 4px; opacity: 0.7; }

      /* ── OBS BALÃO ── */
      .mon-obs-badge {
        position: absolute; top: -4px; right: -4px;
        width: 8px; height: 8px; border-radius: 50%;
        background: #e53e3e; border: 1.5px solid var(--mon-surface);
        pointer-events: none;
      }
      .mon-obs-wrap { position: relative; display: inline-block; line-height: 0; }
      .mon-obs-btn {
        background: none; border: none; cursor: pointer; padding: 3px 5px;
        border-radius: 6px; color: var(--mon-text-faint); font-size: 14px;
        line-height: 1; transition: color 0.15s, background 0.15s;
        display: inline-flex; align-items: center;
      }
      .mon-obs-btn:hover { color: var(--mon-accent); background: var(--mon-surface2); }
      .mon-obs-btn.has-obs { color: var(--mon-amber); }
      .mon-obs-popover {
        position: fixed; z-index: 999999;
        background: var(--mon-surface); border: 1px solid var(--mon-border2);
        border-radius: 10px; padding: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        width: 280px; display: none; flex-direction: column; gap: 10px;
      }
      .mon-obs-popover.open { display: flex; }
      .mon-obs-header { display: flex; justify-content: space-between; align-items: center; }
      .mon-obs-title { font-size: 12px; font-weight: 700; color: var(--mon-text); }
      .mon-obs-close { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--mon-text-faint); line-height: 1; padding: 0; }
      .mon-obs-textarea {
        width: 100%; min-height: 70px; resize: vertical;
        border: 1px solid var(--mon-border2); border-radius: 6px;
        padding: 7px 9px; font-size: 12px; font-family: var(--mon-font);
        background: var(--mon-bg); color: var(--mon-text);
        box-sizing: border-box;
      }
      .mon-obs-textarea:focus { outline: none; border-color: var(--mon-accent); }
      .mon-obs-meta { font-size: 11px; color: var(--mon-text-faint); }
      .mon-obs-actions { display: flex; gap: 6px; }
      .mon-obs-save {
        flex: 1; padding: 5px 0; border-radius: 6px; border: none; cursor: pointer;
        background: var(--mon-accent); color: #fff; font-size: 12px; font-weight: 600;
      }
      .mon-obs-save:hover { opacity: 0.88; }
      .mon-obs-hist-btn {
        padding: 5px 10px; border-radius: 6px; border: 1px solid var(--mon-border2);
        background: none; cursor: pointer; font-size: 12px; color: var(--mon-text-dim);
      }
      .mon-obs-hist-btn:hover { background: var(--mon-surface2); }
      .mon-obs-hist {
        display: none; flex-direction: column; gap: 6px;
        max-height: 160px; overflow-y: auto;
      }
      .mon-obs-hist.open { display: flex; }
      .mon-obs-hist-item {
        font-size: 11px; padding: 6px 8px; border-radius: 6px;
        background: var(--mon-surface2); color: var(--mon-text-dim);
        border-left: 2px solid var(--mon-border2);
      }
      .mon-obs-hist-item strong { color: var(--mon-text); font-weight: 600; }

      /* ── SORT HEADERS ── */
      .mon-th-sort { cursor: pointer; user-select: none; }
      .mon-th-sort:hover { color: var(--mon-text-dim); }
      .mon-sort-arrow { font-size: 9px; margin-left: 3px; opacity: 0.35; }
      .mon-th-sort.sort-asc  .mon-sort-arrow::after { content: '▲'; opacity: 1; color: var(--mon-accent); }
      .mon-th-sort.sort-desc .mon-sort-arrow::after { content: '▼'; opacity: 1; color: var(--mon-accent); }
      .mon-th-sort:not(.sort-asc):not(.sort-desc) .mon-sort-arrow::after { content: '⇅'; }

      /* ── DETALHE EXPANDIDO ── */
      tr.op-detail td { padding: 0 !important; border-bottom: 1px solid var(--mon-border); }
      .mon-detail-inner {
        background: var(--mon-bg);
        border-top: 1px solid var(--mon-border);
        padding: 16px;
        animation: mon-fadein 0.1s ease;
      }
      .mon-detail-header {
        display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
        flex-wrap: wrap;
      }
      .mon-key-chip {
        font-family: var(--mon-mono); font-size: 11.5px;
        color: var(--mon-accent); background: var(--mon-accent-bg);
        border: 1px solid var(--mon-accent-border); border-radius: var(--mon-radius-xs);
        padding: 3px 9px; letter-spacing: -0.2px; font-weight: 600;
      }
      .mon-copy-btn {
        background: transparent; border: 1px solid var(--mon-border);
        color: var(--mon-text-dim); padding: 4px 10px;
        border-radius: var(--mon-radius-xs); font-size: 11px; font-family: var(--mon-font);
        cursor: pointer; transition: background 0.1s,color 0.1s;
      }
      .mon-copy-btn:hover { background: var(--mon-surface2); color: var(--mon-text); border-color: var(--mon-border2); }
      .mon-open-btn {
        background: var(--mon-accent-bg); border: 1px solid var(--mon-accent-border);
        color: var(--mon-accent) !important; text-decoration: none;
        padding: 4px 10px; border-radius: var(--mon-radius-xs);
        font-size: 11px; font-family: var(--mon-font); font-weight: 600;
        cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
        transition: background 0.1s,color 0.1s;
      }
      .mon-open-btn:hover { background: rgba(79,70,229,0.14); }

      .mon-stat-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        margin-bottom: 14px;
      }
      .mon-stat-card {
        background: var(--mon-surface);
        border: 1px solid var(--mon-border);
        border-radius: var(--mon-radius-sm);
        padding: 13px 15px;
        box-shadow: var(--mon-shadow-sm);
      }
      .mon-stat-card-header {
        display: flex; justify-content: space-between; align-items: baseline;
        margin-bottom: 9px;
      }
      .mon-stat-card-label {
        font-size: 10px; color: var(--mon-text-faint); letter-spacing: 0.5px;
        text-transform: uppercase; font-weight: 600;
      }
      .mon-stat-card-num {
        font-size: 20px; font-weight: 700; letter-spacing: -0.5px;
      }
      .mon-stat-card-sub {
        font-size: 13px; color: var(--mon-text-dim);
        font-weight: 500; margin-left: 1px;
      }
      .mon-stat-card-pct { font-size: 10px; color: var(--mon-text-faint); margin-top: 6px; }

      /* ── ACTIONS ── */
      .mon-actions {
        display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; align-items: center;
        background: var(--mon-surface2); border: 1px solid var(--mon-border);
        border-radius: var(--mon-radius-sm); padding: 8px 10px;
      }

      .mon-send-btn {
        display: inline-flex; align-items: center; gap: 5px;
        background: var(--mon-surface);
        border: 1px solid var(--mon-border2);
        color: var(--mon-text-dim);
        padding: 6px 13px; border-radius: var(--mon-radius-sm);
        font-size: 11.5px; font-family: var(--mon-font); font-weight: 500;
        cursor: pointer; letter-spacing: 0.1px;
        transition: background 0.1s,color 0.1s; box-shadow: var(--mon-shadow-sm);
      }
      .mon-send-btn:hover { background: var(--mon-surface2); color: var(--mon-text); border-color: var(--mon-border2); }
      .mon-send-btn:disabled { cursor: not-allowed; opacity: 0.45; }
      .mon-send-btn--err { color: var(--mon-red) !important; border-color: var(--mon-red-border) !important; background: var(--mon-red-bg) !important; }
      .mon-send-btn--open { background: var(--mon-accent-bg) !important; border-color: var(--mon-accent-border) !important; color: var(--mon-accent) !important; text-decoration: none; }
      .mon-send-btn--open:hover { background: rgba(79,70,229,0.14) !important; }

      .mon-dl-btn {
        display: inline-flex; align-items: center; gap: 5px;
        background: var(--mon-surface);
        border: 1px solid var(--mon-border2);
        color: var(--mon-text-dim);
        padding: 6px 12px; border-radius: var(--mon-radius-sm);
        font-size: 11.5px; font-family: var(--mon-font);
        cursor: pointer; transition: background 0.1s,color 0.1s; text-decoration: none;
        box-shadow: var(--mon-shadow-sm);
      }
      .mon-dl-btn:hover { background: var(--mon-surface2); color: var(--mon-text); }

      /* ── DROPDOWN GENÉRICO (Report, Escala, XLS) ── */
      .mon-xls-menu { position: relative; display: inline-block; }
      .mon-xls-dropdown {
        display: none; position: absolute; top: calc(100% + 6px); left: 0;
        background: var(--mon-surface); border: 1px solid var(--mon-border2);
        border-radius: var(--mon-radius-sm); padding: 4px;
        z-index: 10000010; min-width: 220px;
        box-shadow: var(--mon-shadow);
        animation: mon-fadein 0.08s ease;
      }
      .mon-xls-menu.open .mon-xls-dropdown { display: block; }

      /* itens do dropdown — base */
      .mon-xls-dropdown a,
      .mon-xls-dropdown button.mon-drop-item {
        display: flex; align-items: center; gap: 8px;
        width: 100%; padding: 8px 11px;
        color: var(--mon-text-dim); background: transparent;
        font-size: 12px; font-family: var(--mon-font); font-weight: 500;
        text-decoration: none; border: none; border-radius: var(--mon-radius-xs);
        cursor: pointer; transition: all 0.1s; text-align: left; box-sizing: border-box;
      }
      .mon-xls-dropdown a:hover,
      .mon-xls-dropdown button.mon-drop-item:hover { background: var(--mon-surface2); color: var(--mon-text); }

      /* item de confirmação — fica no topo com destaque sutil */
      .mon-drop-item--confirm {
        border-bottom: 1px solid var(--mon-border) !important;
        margin-bottom: 3px !important; padding-bottom: 9px !important;
        color: var(--mon-text) !important; font-weight: 600 !important;
      }

      /* separador de label de grupo dentro do dropdown */
      .mon-drop-group-label {
        font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--mon-text-faint); padding: 6px 11px 3px; pointer-events: none;
      }

      /* botão de menu do Report — amber */
      .mon-menu-btn--report {
        background: var(--mon-amber-bg) !important; border-color: var(--mon-amber-border) !important; color: var(--mon-amber) !important;
      }
      .mon-menu-btn--report:hover { background: rgba(217,119,6,0.14) !important; }

      /* botão de menu da Escala — green/teal */
      .mon-menu-btn--escala {
        background: var(--mon-green-bg) !important; border-color: var(--mon-green-border) !important; color: var(--mon-green) !important;
      }
      .mon-menu-btn--escala:hover { background: rgba(5,150,105,0.14) !important; }

      /* ── LISTAS LADO A LADO ── */
      #mon-panel .mon-lists-grid,
      #mon-hist-det-modal .mon-lists-grid {
        display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important;
        margin: 0 !important; padding: 0 !important; align-items: start !important;
      }
      #mon-panel .mon-list-panel,
      #mon-hist-det-modal .mon-list-panel {
        border-radius: var(--mon-radius-sm) !important;
        border: 1px solid var(--mon-border) !important;
        overflow: hidden !important;
        background: var(--mon-surface) !important;
        box-shadow: var(--mon-shadow-sm) !important;
        display: flex !important; flex-direction: column !important;
      }
      #mon-panel .mon-list-panel-header,
      #mon-hist-det-modal .mon-list-panel-header {
        display: flex !important; align-items: center !important; gap: 8px !important;
        padding: 9px 13px !important;
        background: var(--mon-bg) !important;
        border-bottom: 1px solid var(--mon-border) !important;
        margin: 0 !important; flex-shrink: 0 !important;
      }
      #mon-panel .mon-list-panel-dot,
      #mon-hist-det-modal .mon-list-panel-dot {
        width: 7px !important; height: 7px !important; border-radius: 50% !important;
        flex-shrink: 0 !important; display: inline-block !important;
      }
      #mon-panel .mon-list-panel-title,
      #mon-hist-det-modal .mon-list-panel-title {
        font-size: 10.5px !important; font-weight: 700 !important; letter-spacing: 0.4px !important;
        text-transform: uppercase !important; color: var(--mon-text-dim) !important; flex: 1 !important;
        margin: 0 !important;
      }
      #mon-panel .mon-list-panel-count,
      #mon-hist-det-modal .mon-list-panel-count {
        font-size: 10.5px !important; font-weight: 700 !important;
        padding: 2px 8px !important; border-radius: 99px !important;
        line-height: 1.4 !important; border: 1px solid !important;
      }
      #mon-panel .mon-list-panel-body,
      #mon-hist-det-modal .mon-list-panel-body {
        max-height: 260px !important; overflow-y: auto !important; flex: 1 !important;
      }
      #mon-panel .mon-list-row,
      #mon-hist-det-modal .mon-list-row {
        padding: 8px 13px !important;
        border-bottom: 1px solid var(--mon-border) !important;
        transition: background 0.1s !important;
        display: block !important;
      }
      #mon-panel .mon-list-row:nth-child(even),
      #mon-hist-det-modal .mon-list-row:nth-child(even) { background: var(--mon-surface2) !important; }
      #mon-panel .mon-list-row:last-child,
      #mon-hist-det-modal .mon-list-row:last-child { border-bottom: none !important; }
      #mon-panel .mon-list-row:hover,
      #mon-hist-det-modal .mon-list-row:hover { background: var(--mon-surface3) !important; }
      #mon-panel .mon-list-row-name,
      #mon-hist-det-modal .mon-list-row-name {
        font-size: 12px !important; font-weight: 600 !important; color: var(--mon-text) !important;
        margin-bottom: 3px !important; display: block !important;
        white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;
      }
      #mon-panel .mon-list-row-meta,
      #mon-hist-det-modal .mon-list-row-meta {
        display: flex !important; align-items: center !important; gap: 6px !important;
        flex-wrap: wrap !important;
      }
      #mon-panel .mon-list-row-tipo,
      #mon-hist-det-modal .mon-list-row-tipo {
        font-size: 11px !important; color: var(--mon-text-dim) !important;
      }
      #mon-panel .mon-list-row-time,
      #mon-hist-det-modal .mon-list-row-time {
        font-size: 11px !important; color: var(--mon-amber) !important;
        font-family: var(--mon-mono) !important; margin-left: auto !important;
        background: var(--mon-amber-bg) !important;
        border: 1px solid var(--mon-amber-border) !important;
        border-radius: var(--mon-radius-xs) !important; padding: 2px 7px !important;
        letter-spacing: -0.2px !important; font-weight: 600 !important;
      }
      #mon-panel .mon-list-empty,
      #mon-hist-det-modal .mon-list-empty {
        padding: 20px 13px !important; font-size: 12px !important;
        color: var(--mon-text-faint) !important; text-align: center !important;
        display: block !important;
      }

      .mon-loading-detail {
        display: flex; align-items: center; gap: 9px;
        color: var(--mon-text-dim); font-size: 12px; padding: 4px 0;
      }
      .mon-loading-spinner {
        width: 15px; height: 15px; border-radius: 50%;
        border: 2px solid var(--mon-border);
        border-top-color: var(--mon-accent);
        animation: mon-spin 0.7s linear infinite; flex-shrink: 0;
        will-change: transform;
      }

      .mon-empty-detail { color: var(--mon-text-faint); font-size: 12px; padding: 8px 0; }

      /* ── BADGES ADTO TR / AL ── */
      .mon-adto-btn {
        display: inline-flex; align-items: center; justify-content: center;
        gap: 4px; padding: 3px 8px; border-radius: 5px; font-size: 11px;
        font-weight: 600; font-family: var(--mon-font); cursor: pointer;
        border: 1.5px solid var(--mon-border2); background: var(--mon-surface2);
        color: var(--mon-text-dim); transition: background 0.1s,color 0.1s; white-space: nowrap;
        line-height: 1.3;
      }
      .mon-adto-btn:hover { background: var(--mon-surface3); color: var(--mon-text); border-color: var(--mon-accent-border); }
      .mon-adto-btn--has {
        background: var(--mon-amber-bg); border-color: var(--mon-amber-border); color: var(--mon-amber);
      }
      .mon-adto-btn--has:hover { background: var(--mon-amber); color: #fff; }
      .mon-adto-btn--pago {
        background: var(--mon-green-bg); border-color: var(--mon-green-border); color: var(--mon-green);
      }
      .mon-adto-btn--pago:hover { background: var(--mon-green); color: #fff; }
      .mon-adto-empty { color: var(--mon-text-faint); font-size: 11px; text-align: center; display: block; }


      /* ── PROGRESS AVATAR ── */
      .mon-avatar-wrap {
        position: relative; width: 44px; height: 44px; flex-shrink: 0;
      }
      #mon-avatar-img {
        width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
        position: absolute; top: 2px; left: 2px; z-index: 1;
        transform-origin: center;
      }
      #mon-progress-overlay {
        position: absolute; top: 2px; left: 2px; width: 40px; height: 40px;
        border-radius: 50%; background: rgba(255,255,255,0.65); z-index: 2;
        transition: opacity 0.3s;
      }
      #mon-progress-text {
        position: absolute; top: 2px; left: 2px; width: 40px; height: 40px;
        border-radius: 50%; z-index: 3;
        display: flex; align-items: center; justify-content: center;
        font-size: 9px; font-weight: 700; color: var(--mon-text); font-family: var(--mon-mono);
      }

      /* ── HIGHLIGHT DE BUSCA ── */
      mark {
        background: rgba(79,70,229,0.12) !important;
        color: var(--mon-accent) !important;
        border-radius: 2px !important;
        padding: 0 1px !important;
      }

      /* ── MODAL BIOMETRIA DO MONITOR ── */
      #mon-bio-modal {
        display: none; position: fixed; inset: 0;
        z-index: 999999; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.6);
      }
      #mon-bio-modal.open { display: flex; }
      #mon-bio-box {
        background: var(--mon-bg); border-radius: 10px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        width: 540px; max-width: 95vw; overflow: hidden;
        animation: mon-fadein 0.08s ease;
      }
      #mon-bio-header {
        background: #c0392b; color: #fff;
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px 16px; font-weight: 700; font-size: 14px;
      }
      #mon-bio-close {
        background: none; border: none; color: #fff; font-size: 20px;
        cursor: pointer; line-height: 1; padding: 0 4px;
      }
      #mon-bio-body { padding: 16px; }
      #mon-bio-photos { display: flex; gap: 16px; margin-bottom: 14px; justify-content: center; }
      #mon-bio-photos img { width: 140px; height: 140px; object-fit: cover; border-radius: 6px; border: 2px solid var(--mon-border); }
      #mon-bio-info { font-size: 12px; line-height: 1.7; color: var(--mon-text); margin-bottom: 12px; }
      #mon-bio-info strong { color: var(--mon-text-dim); font-weight: 600; }
      #mon-bio-map { width: 100%; height: 220px; border: none; border-radius: 6px; }
      #mon-bio-loading { text-align: center; padding: 40px; color: var(--mon-text-faint); font-size: 13px; }

      /* ── BUSCA COLABORADOR ── */
      #mon-busca-overlay {
        display: none; position: fixed; inset: 0; z-index: 10000010;
        background: rgba(0,0,0,0.55); align-items: flex-start; justify-content: center;
        padding-top: 80px;
      }
      #mon-busca-overlay.open { display: flex; }
      #mon-busca-box {
        background: var(--mon-bg); border-radius: 12px;
        box-shadow: 0 8px 48px rgba(0,0,0,0.5);
        width: 480px; max-width: 95vw;
        display: flex; flex-direction: column; overflow: hidden;
        animation: mon-fadein 0.08s ease;
        max-height: calc(100vh - 120px);
      }
      #mon-busca-header {
        display: flex; align-items: center; gap: 8px;
        padding: 12px 14px; border-bottom: 1px solid var(--mon-border);
        background: var(--mon-surface);
      }
      #mon-busca-input {
        flex: 1; background: var(--mon-surface2); border: 1px solid var(--mon-border2);
        border-radius: 7px; padding: 7px 11px; font-size: 13px;
        color: var(--mon-text); font-family: var(--mon-font); outline: none;
      }
      #mon-busca-input:focus { border-color: var(--mon-accent); }
      #mon-busca-close {
        background: none; border: none; color: var(--mon-text-faint); font-size: 18px;
        cursor: pointer; padding: 2px 6px; border-radius: 4px; line-height: 1;
      }
      #mon-busca-close:hover { background: var(--mon-surface2); color: var(--mon-text); }
      #mon-busca-results {
        overflow-y: auto; flex: 1; padding: 8px 0;
      }
      #mon-busca-empty {
        padding: 24px; text-align: center; color: var(--mon-text-faint); font-size: 12px;
      }
      .mon-busca-item {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 14px; cursor: pointer;
        transition: background 0.12s;
      }
      .mon-busca-item:hover { background: var(--mon-surface2); }
      .mon-busca-item-info { flex: 1; min-width: 0; }
      .mon-busca-nome {
        font-size: 13px; font-weight: 600; color: var(--mon-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mon-busca-nome mark {
        background: rgba(251,191,36,0.35); color: inherit;
        border-radius: 2px; padding: 0 1px;
      }
      .mon-busca-op {
        font-size: 11px; color: var(--mon-text-dim); margin-top: 1px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mon-busca-badge {
        font-size: 10px; font-weight: 700; padding: 2px 7px;
        border-radius: 20px; white-space: nowrap; flex-shrink: 0;
        background: var(--mon-green-bg); color: var(--mon-green);
        border: 1px solid var(--mon-green);
      }
      .mon-busca-badge.faltando {
        background: var(--mon-red-bg); color: var(--mon-red);
        border-color: var(--mon-red-border);
      }
      .mon-busca-cpf {
        font-family: var(--mon-mono);
        font-size: 10px;
        color: var(--mon-text-faint);
        margin-left: 6px;
        padding: 1px 5px;
        border-radius: 4px;
      }
      .mon-busca-badge.pendente {
        background: var(--mon-amber-bg,rgba(251,191,36,0.12)); color: var(--mon-amber,#f59e0b);
        border-color: var(--mon-amber,#f59e0b);
      }
      #mon-busca-hint {
        padding: 10px 14px; font-size: 11px; color: var(--mon-text-faint);
        border-top: 1px solid var(--mon-border); text-align: center;
      }

      /* ── ZOOM FOTO ── */
      #mon-foto-zoom {
        display: none; position: fixed; inset: 0; z-index: 2147483647;
        background: rgba(0,0,0,0.85); align-items: center; justify-content: center;
        flex-direction: column; gap: 10px; cursor: zoom-out;
      }
      #mon-foto-zoom.open { display: flex; }
      #mon-foto-zoom img { width: auto; height: auto; max-width: 95vw; max-height: 92vh; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 40px rgba(0,0,0,0.6); object-fit: contain; }
      #mon-foto-zoom span { color: #fff; font-size: 13px; font-weight: 600; opacity: 0.8; }

      /* ── MODAL LISTA (apontados / escalados / faltando) ── */
      #mon-lista-modal {
        display: none; position: fixed; inset: 0; z-index: 9999998;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.55);
        font-family: var(--mon-font);
      }
      #mon-lista-modal.open { display: flex; }
      #mon-lista-box {
        background: var(--mon-bg);
        border-radius: 12px;
        width: 860px; max-width: 96vw; max-height: 85vh;
        display: flex; flex-direction: column; overflow: hidden;
        animation: mon-fadein 0.08s ease;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px var(--mon-border);
      }
      #mon-lista-header {
        padding: 13px 18px 11px; flex-shrink: 0;
        border-bottom: 1px solid var(--mon-border);
        background: var(--mon-surface);
        display: flex; align-items: center; gap: 10px;
      }
      #mon-lista-body {
        flex: 1; overflow-y: auto; padding: 12px 16px;
      }
      #mon-lista-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
      .mon-lista-card {
        background: var(--mon-surface);
        border: 1px solid var(--mon-border);
        border-radius: 8px;
        padding: 9px 13px;
        display: flex; flex-direction: column; gap: 4px;
        transition: background 0.12s;
      }
      .mon-lista-card:hover { background: var(--mon-surface2); }
      .mon-lista-card-name {
        font-size: 12px; font-weight: 600; color: var(--mon-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mon-lista-card-name.red { color: var(--mon-red); }
      .mon-lista-card-meta {
        display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      }
      .mon-lista-card-tag {
        font-size: 10.5px; color: var(--mon-text-dim);
      }
      .mon-lista-card-badge {
        font-size: 10.5px; font-weight: 600;
        padding: 1px 7px; border-radius: 4px; border: 1px solid;
        white-space: nowrap;
      }
      .mon-lista-emoji {
        font-family: "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif !important;
        font-style: normal !important;
        line-height: 1;
      }
      .mon-list-panel-header:hover .mon-list-panel-title {
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    `;
    document.head.appendChild(s);
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ESTILOS V2 — workspace SaaS (rail + main + drawer + grupos + linhas-card)
  // Estes estilos são ADITIVOS: sobrescrevem apenas o que muda, preservando
  // os componentes existentes (modais Bio, Faltas, Vales, etc).
  // ══════════════════════════════════════════════════════════════════════════════
  function injectStylesV2() {
    if (document.getElementById('mon-style-v2')) return;
    const s = document.createElement('style');
    s.id = 'mon-style-v2';
    s.textContent = `
      /* Variáveis V2 (sistema de espaçamento 4px) */
      :root, #mon-panel.mon-v2 {
        --mon-sp-1: 4px; --mon-sp-2: 8px; --mon-sp-3: 12px; --mon-sp-4: 16px;
        --mon-sp-5: 20px; --mon-sp-6: 24px;
        --mon-rail-w: 60px;
        --mon-drawer-w: 560px;
        --mon-hd-h: 48px;
        --mon-tb-h: 48px;
      }

      /* ── PAINEL V2 ── */
      #mon-panel.mon-v2 {
        font-family: var(--mon-font);
        background: var(--mon-bg);
        color: var(--mon-text);
        border-left: 1px solid var(--mon-border);
        box-shadow: var(--mon-shadow-lg);
      }

      /* ── ÁREA DE SCROLL DAS OPS — aceleração de hardware ── */
      #mon-table-wrap {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        will-change: scroll-position;
        contain: layout style paint; /* era strict (size incluso) — causava 2ª scrollbar */
      }
      /* Cada grupo de horário: contém seu próprio paint */
      .mon-group {
        contain: layout style;
      }
      /* Cada linha V2: isolada do reflow vizinho */
      .mon-row-v2 {
        contain: layout style;
        transform: translateZ(0);
      }

      /* ── HEADER V2 (48px, compacto) ── */
      .mon-hd-v2 {
        height: var(--mon-hd-h) !important;
        padding: 0 var(--mon-sp-3) 0 var(--mon-sp-4) !important;
        background: var(--mon-surface) !important;
        border-bottom: 1px solid var(--mon-border) !important;
        display: flex; align-items: center; gap: var(--mon-sp-3);
        flex-shrink: 0;
        /* ── Perf: isola o header do pipeline de scroll ── */
        will-change: auto;
        transform: translateZ(0);
        contain: layout style;
        backface-visibility: hidden;
      }
      .mon-hd-brand { flex-shrink: 0; }
      .mon-logo-text { display: none !important; }
      .mon-hd-spacer { flex: 1; }
      .mon-hd-actions {
        display: flex; align-items: center; gap: var(--mon-sp-2);
        flex-shrink: 0;
      }
      .mon-hd-v2 .mon-logo-icon { width: 40px; height: 40px; box-shadow: 0 2px 12px rgba(30,100,255,0.5); filter: brightness(1.1) contrast(1.05); }
      .mon-hd-v2 .mon-logo-icon img { width: 40px; height: 40px; }
      .mon-hd-v2 .mon-logo-title {
        font-size: 13.5px; font-weight: 700; letter-spacing: -0.3px; line-height: 1.15;
      }
      .mon-hd-v2 .mon-logo-sub {
        font-size: 10.5px; color: var(--mon-text-faint); line-height: 1.2;
      }
      .mon-hd-icon-btn {
        width: 30px; height: 30px; border-radius: 6px;
        border: 1px solid transparent; background: transparent;
        color: var(--mon-text-dim); font-size: 13px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 0.12s; flex-shrink: 0;
      }
      .mon-hd-icon-btn:hover { background: var(--mon-surface2); color: var(--mon-text); border-color: var(--mon-border); }
      .mon-hd-icon-btn--danger:hover { background: var(--mon-red-bg); color: var(--mon-red); border-color: var(--mon-red-border); }

      /* Pílula de refresh: countdown + botão */
      .mon-refresh-pill {
        display: inline-flex; align-items: center; gap: 5px;
        height: 30px; padding: 0 6px 0 10px;
        border: 1px solid var(--mon-border); border-radius: 99px;
        background: var(--mon-surface);
      }
      .mon-refresh-pill .mon-hd-icon-btn {
        width: 22px; height: 22px; font-size: 11px;
        background: var(--mon-green-bg); color: var(--mon-green);
        border-color: var(--mon-green-border);
      }
      .mon-refresh-pill .mon-hd-icon-btn:hover { background: var(--mon-green); color: #fff; }

      /* ── BODY V2 (3 colunas) ── */
      .mon-body-v2 { background: var(--mon-bg); }

      /* ── RAIL (60px, vertical) ── */
      .mon-rail {
        width: var(--mon-rail-w);
        background: var(--mon-surface);
        border-right: 1px solid var(--mon-border);
        display: flex; flex-direction: column;
        padding: var(--mon-sp-2) 0;
        gap: 2px;
        flex-shrink: 0;
      }
      .mon-rail-item {
        background: none; border: none; cursor: pointer;
        padding: 9px 4px 7px; margin: 0 6px;
        border-radius: 8px;
        display: flex; flex-direction: column; align-items: center; gap: 3px;
        color: var(--mon-text-faint);
        transition: background 0.1s,color 0.1s;
        font-family: var(--mon-font);
      }
      .mon-rail-item:hover { background: var(--mon-surface2); color: var(--mon-text); }
      .mon-rail-item.is-active {
        background: var(--mon-accent-bg);
        color: var(--mon-accent);
      }
      .mon-rail-item.is-active::before {
        content: ''; position: absolute; left: 0; width: 3px; height: 24px;
        background: var(--mon-accent); border-radius: 0 3px 3px 0;
        margin-left: -6px;
      }
      .mon-rail-item { position: relative; }
      .mon-rail-ic { font-size: 18px; line-height: 1; }
      .mon-rail-lbl {
        font-size: 9.5px; font-weight: 600; letter-spacing: 0.1px;
        text-align: center; line-height: 1.1;
      }
      .mon-rail-sep {
        height: 1px; background: var(--mon-border); margin: var(--mon-sp-2) 10px;
      }

      /* ── MAIN ── */
      .mon-main {
        flex: 1; display: flex; flex-direction: column;
        min-width: 0; overflow: hidden;
      }

      /* ── TOOLBAR ── */
      .mon-toolbar {
        display: flex; align-items: center; gap: var(--mon-sp-2);
        padding: 0 var(--mon-sp-4);
        height: var(--mon-tb-h);
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border);
        flex-shrink: 0;
      }
      .mon-tb-search {
        display: flex; align-items: center; gap: 6px;
        background: var(--mon-bg);
        border: 1px solid var(--mon-border);
        border-radius: 7px;
        padding: 0 10px;
        height: 32px;
        min-width: 240px; flex: 0 1 280px;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .mon-tb-search:focus-within {
        border-color: var(--mon-accent);
        box-shadow: 0 0 0 3px var(--mon-accent-bg);
      }
      .mon-tb-search .mon-filter-icon { color: var(--mon-text-faint); font-size: 14px; }
      .mon-tb-search #mon-filter-input {
        border: none; outline: none; background: transparent;
        font-size: 13px; color: var(--mon-text); font-family: var(--mon-font);
        flex: 1; min-width: 0; padding: 0;
      }
      .mon-tb-search #mon-filter-clear {
        background: transparent; border: none; cursor: pointer;
        color: var(--mon-text-faint); font-size: 12px;
        display: none;
      }
      .mon-tb-search #mon-filter-clear:hover { color: var(--mon-red); }

      /* Quando a search é full-width, anula as restrições da classe base */
      .mon-tb-search.mon-tb-search-full {
        min-width: 0 !important; flex: 1 1 100% !important;
        width: 100% !important;
      }

      .mon-tb-divider {
        width: 1px; height: 22px; background: var(--mon-border); flex-shrink: 0;
      }

      .mon-tb-chips {
        display: flex; flex-wrap: nowrap; gap: 4px;
        overflow-x: auto;
        scrollbar-width: none;
        flex: 1; min-width: 0;
      }
      .mon-tb-chips::-webkit-scrollbar { display: none; }
      .mon-tb-chips .mon-chip {
        display: inline-flex; align-items: center; gap: 5px;
        height: 28px; padding: 0 10px;
        border: 1px solid var(--mon-border);
        border-radius: 99px;
        background: transparent;
        font-size: 11.5px; font-weight: 600; color: var(--mon-text-dim);
        cursor: pointer; transition: background 0.1s,color 0.1s;
        white-space: nowrap; font-family: var(--mon-font);
        flex-shrink: 0;
      }
      .mon-tb-chips .mon-chip:hover {
        background: var(--mon-surface2); color: var(--mon-text);
        border-color: var(--mon-border2);
      }
      .mon-tb-chips .mon-chip.is-active, .mon-tb-chips .mon-chip.active {
        background: var(--mon-text); color: var(--mon-bg);
        border-color: var(--mon-text);
      }
      #mon-panel.mon-dark .mon-tb-chips .mon-chip.is-active,
      #mon-panel.mon-dark .mon-tb-chips .mon-chip.active {
        background: var(--mon-text); color: #1b1b1b;
      }
      .mon-chip-dot {
        width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
      }

      .mon-tb-pages {
        display: inline-flex; align-items: center; gap: 4px;
        flex-shrink: 0;
      }
      .mon-tb-pages-lbl {
        font-size: 10px; font-weight: 600; color: var(--mon-text-faint);
        text-transform: uppercase; letter-spacing: 0.4px; margin-right: 2px;
      }
      .mon-tb-pages .mon-pag-btn {
        height: 26px; min-width: 30px; padding: 0 7px;
        border: 1px solid var(--mon-border); border-radius: 6px;
        background: transparent; color: var(--mon-text-dim);
        font-size: 11.5px; font-weight: 700; cursor: pointer;
        font-family: var(--mon-mono);
        transition: background 0.1s,color 0.1s;
      }
      .mon-tb-pages .mon-pag-btn:hover { background: var(--mon-surface2); color: var(--mon-text); }
      .mon-tb-pages .mon-pag-btn.is-active, .mon-tb-pages .mon-pag-btn.active {
        background: var(--mon-accent); color: #fff; border-color: var(--mon-accent);
      }

      /* ── KPIs INLINE ── */
      .mon-kpis-v2 {
        display: flex !important; align-items: center; gap: var(--mon-sp-5);
        padding: 0 var(--mon-sp-4) !important;
        height: 44px !important;
        max-height: 44px !important;
        background: var(--mon-bg) !important;
        border-bottom: 1px solid var(--mon-border) !important;
        flex-shrink: 0;
        grid-template-columns: none !important;
        overflow: hidden;
        transition: max-height 0.25s ease, opacity 0.2s ease, border-width 0.25s ease, padding 0.25s ease;
      }
      #mon-metrics.mon-metrics-hidden.mon-kpis-v2 {
        max-height: 0 !important;
        padding-top: 0 !important; padding-bottom: 0 !important;
        opacity: 0; border-bottom-width: 0;
      }
      .mon-kpi {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 0; background: none !important; border: none !important;
      }
      .mon-kpi-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--mon-text-faint);
      }
      .mon-kpi[data-tone="green"]   .mon-kpi-dot { background: var(--mon-green); }
      .mon-kpi[data-tone="amber"]   .mon-kpi-dot { background: var(--mon-amber); }
      .mon-kpi[data-tone="red"]     .mon-kpi-dot { background: var(--mon-red); }
      .mon-kpi[data-tone="neutral"] .mon-kpi-dot { background: var(--mon-accent); }
      .mon-kpi-lbl {
        font-size: 11px; color: var(--mon-text-dim); font-weight: 500;
      }
      .mon-kpi-val {
        font-size: 18px; font-weight: 700; color: var(--mon-text);
        font-family: var(--mon-mono); letter-spacing: -0.4px; line-height: 1;
      }
      .mon-kpi[data-tone="green"]   .mon-kpi-val { color: var(--mon-green); }
      .mon-kpi[data-tone="amber"]   .mon-kpi-val { color: var(--mon-amber); }
      .mon-kpi[data-tone="red"]     .mon-kpi-val { color: var(--mon-red); }
      .mon-kpis-spacer { flex: 1; }
      .mon-kpis-hint {
        font-size: 10.5px; color: var(--mon-text-faint); font-style: italic;
      }

      /* ── LISTA: cabeçalho de colunas ── */
      .mon-list-wrap {
        flex: 1; overflow-y: auto; overflow-x: hidden;
        background: var(--mon-bg); min-height: 0;
        padding: 0;
      }
      .mon-list-colhdr {
        display: grid;
        grid-template-columns: minmax(130px,1fr) 68px 72px 72px 115px 42px;
        gap: 6px;
        padding: 8px var(--mon-sp-4);
        font-size: 10px; font-weight: 700; color: var(--mon-text-faint);
        text-transform: uppercase; letter-spacing: 0.6px;
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border);
        position: sticky; top: 0; z-index: 5;
      }
      .mon-list-colhdr > div { display: flex; align-items: center; overflow: hidden; white-space: nowrap; }
      .mon-list-colhdr .mon-col-prog { justify-content: center; }
      .mon-list-colhdr .mon-th-sort { cursor: pointer; user-select: none; }
      .mon-list-colhdr .mon-th-sort:hover { color: var(--mon-text-dim); }

      /* ── GRUPOS ── */
      .mon-group { padding: 0; }
      .mon-group-hdr {
        display: flex; align-items: center; gap: 10px;
        padding: 14px var(--mon-sp-4) 8px;
        font-size: 11px; font-weight: 700;
        color: var(--mon-text-dim);
        text-transform: uppercase; letter-spacing: 0.6px;
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }
      .mon-group-hdr:hover { background: var(--mon-surface); }
      .mon-group-hdr .g-chevron {
        font-size: 9px; color: var(--mon-text-faint);
        transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
        flex-shrink: 0; margin-left: -4px;
      }
      .mon-group-hdr.is-collapsed .g-chevron { transform: rotate(-90deg); }
      .mon-group-hdr .g-ic { font-size: 13px; }
      .mon-group-hdr .g-name { color: var(--mon-text); letter-spacing: 0.3px; }
      .mon-group-hdr .g-count {
        font-family: var(--mon-mono); font-size: 12px; font-weight: 800;
        background: var(--mon-surface2); color: var(--mon-text-dim);
        padding: 2px 10px; border-radius: 99px;
      }
      .mon-group-hdr.is-urgent .g-name { color: var(--mon-red); }
      .mon-group-hdr.is-urgent .g-count { background: var(--mon-red-bg); color: var(--mon-red); }
      .mon-group-hdr.is-soon .g-name { color: var(--mon-text); }
      .mon-group-hdr.is-soon .g-count { background: var(--mon-surface2); color: var(--mon-text-dim); }
      .mon-group-hdr.is-done .g-name { color: var(--mon-green); }
      .mon-group-hdr.is-done .g-count { background: var(--mon-green-bg); color: var(--mon-green); }
      /* Operações em Andamento — prioridade máxima, barra laranja no topo */
      .mon-group[data-bucket="past"] {
        border-top: 3px solid var(--mon-amber);
        margin-bottom: 2px;
        background: linear-gradient(180deg, var(--mon-amber-bg) 0%, transparent 48px);
      }
      .mon-group-hdr.is-past-priority .g-ic { font-size: 11px; animation: mon-pulse-dot 2s ease infinite; }
      .mon-group-hdr.is-past-priority .g-name { color: var(--mon-amber) !important; font-weight: 800 !important; letter-spacing: 0.5px; text-transform: uppercase; font-size: 11px !important; }
      .mon-group-hdr.is-past-priority .g-count { background: var(--mon-amber-bg) !important; color: var(--mon-amber) !important; border: 1px solid var(--mon-amber-border); }
      .mon-group-hdr .g-line {
        flex: 1; height: 1px;
        background: linear-gradient(90deg, var(--mon-border), transparent);
      }

      /* ── LINHA / CARD DE OPERAÇÃO ── */
      .mon-row-v2 {
        display: grid;
        grid-template-columns: minmax(130px,1fr) 68px 72px 72px 115px 42px;
        gap: 6px; align-items: center;
        padding: 8px var(--mon-sp-4);
        background: var(--mon-bg);
        border-bottom: 1px solid var(--mon-border);
        border-left: 3px solid transparent;
        cursor: pointer;
        transition: background 0.12s, border-left-color 0.12s;
        position: relative;
      }
      .mon-row-v2:hover { background: var(--mon-surface); }
      .mon-row-v2.is-selected {
        background: var(--mon-accent-bg) !important;
        border-left-color: var(--mon-accent) !important;
      }
      .mon-row-v2.is-selected::after {
        content: ''; position: absolute; right: 0; top: 50%;
        transform: translateY(-50%);
        width: 4px; height: 60%;
        background: var(--mon-accent);
        border-radius: 4px 0 0 4px;
      }

      /* Estados (faixa lateral) */
      .mon-row-v2[data-state="completo"] { border-left-color: var(--mon-green); }
      .mon-row-v2[data-state="parcial"]  { border-left-color: var(--mon-amber); }
      .mon-row-v2[data-state="esc-ok"]   { border-left-color: var(--mon-blue); }
      .mon-row-v2[data-state="nenhum"]   { border-left-color: #7f0000; }
      .mon-row-v2[data-state="esc-inc"]  { border-left-color: var(--mon-red); }

      .mon-row-v2.is-hl-verde {
        background: rgba(10,124,87,0.18);
        border-left: 4px solid var(--mon-green);
      }
      .mon-row-v2.is-hl-verde:hover { background: rgba(10,124,87,0.26); }
      .mon-row-v2.is-hl-nenhum {
        background: linear-gradient(90deg,rgba(127,0,0,0.07) 0%,rgba(185,28,28,0.02) 100%);
        border-left: 4px solid #7f0000;
      }
      .mon-row-v2.is-hl-inc {
        background: linear-gradient(90deg,rgba(185,28,28,0.05) 0%,rgba(185,28,28,0.01) 100%);
        border-left: 3px solid var(--mon-red);
      }

      /* Coluna ID */
      .mon-r-id { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .mon-r-id-top {
        display: flex; align-items: center; gap: 6px; flex-wrap: nowrap;
      }
      .mon-r-sigla {
        font-size: 13px; font-weight: 700; color: var(--mon-text);
        letter-spacing: -0.2px;
      }
      .mon-r-chave {
        font-family: var(--mon-mono); font-size: 10.5px;
        color: var(--mon-text-faint); letter-spacing: -0.2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mon-r-lider {
        font-size: 11px; color: var(--mon-text-dim);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        display: flex; align-items: center; gap: 4px;
      }
      .mon-r-lider::before { content: '👤'; font-size: 10px; opacity: 0.6; flex-shrink: 0; }
      .mon-r-lider.is-multi {
        white-space: normal; overflow: visible; text-overflow: initial;
        flex-wrap: wrap; line-height: 1.3;
      }
      .mon-r-lider-sep {
        color: var(--mon-text-dim); margin: 0 1px; font-size: 11px; font-weight: 700;
      }
      .mon-r-now-badge {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 9px; font-weight: 800; letter-spacing: 0.4px;
        color: #fff; background: var(--mon-red);
        padding: 2px 6px 2px 5px; border-radius: 4px;
        text-transform: uppercase;
      }
      .mon-r-now-badge::before {
        content: ''; width: 5px; height: 5px; border-radius: 50%;
        background: #fff; animation: mon-pulse-dot 1.6s ease infinite;
      }
      .mon-r-soon-badge {
        display: none;
      }
      .mon-r-escchange {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--mon-red);
        box-shadow: 0 0 0 2px var(--mon-bg);
        flex-shrink: 0;
      }
      .mon-r-obs {
        background: none; border: 1px solid transparent; cursor: pointer;
        width: 22px; height: 22px; border-radius: 5px;
        color: var(--mon-text-faint); font-size: 13px;
        display: inline-flex; align-items: center; justify-content: center;
        position: relative;
        transition: all 0.12s;
      }
      .mon-r-obs:hover { background: var(--mon-surface2); color: var(--mon-accent); border-color: var(--mon-border); }
      .mon-r-obs.has-obs { color: var(--mon-amber); background: var(--mon-amber-bg); }
      .mon-r-obs .mon-obs-badge {
        position: absolute; top: -2px; right: -2px;
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--mon-red); border: 1.5px solid var(--mon-bg);
      }

      /* Coluna horário */
      .mon-r-time {
        display: flex; flex-direction: column; gap: 2px;
        font-family: var(--mon-mono);
      }
      .mon-r-time-hh {
        font-size: 14px; font-weight: 700; color: var(--mon-text);
        letter-spacing: -0.3px;
      }
      .mon-r-time-eta {
        font-size: 10px; color: var(--mon-text-faint); font-weight: 600;
      }
      .mon-r-time-eta.is-urgent { color: var(--mon-red); }
      .mon-r-time-eta.is-soon { color: var(--mon-text-faint); }

      /* Colunas de progresso — circular gauge */
      .mon-r-circ {
        display: flex; flex-direction: column; align-items: center;
        gap: 1px; min-width: 0; justify-content: center;
      }
      .mon-r-circ-pct, .mon-r-circ-lbl {
        font-size: 11.5px; font-weight: 800; font-family: var(--mon-mono);
        letter-spacing: 0.1px; line-height: 1;
      }
      .mon-r-prog-na { font-size: 11px; color: var(--mon-text-faint); }
      .mon-r-prog-loading {
        font-size: 11px; color: var(--mon-text-faint);
      }

      /* Coluna status */
      .mon-r-status .mon-status-badge {
        padding: 4px 10px; font-size: 11px;
      }
      .mon-ct-status {
        display: flex; flex-direction: row; gap: 4px;
        align-items: center; justify-content: flex-start;
      }
      .mon-ct-status > * {
        vertical-align: middle;
      }
      .mon-ct-status .mon-status-badge {
        display: inline-flex; align-items: center;
        padding: 3px 8px; font-size: 11px; white-space: nowrap;
        line-height: 1; margin: 0;
      }

      /* Coluna ações */
      .mon-r-act {
        display: flex; align-items: center; gap: 4px; justify-content: flex-end;
      }
      .mon-r-act-btn {
        width: 28px; height: 28px; border-radius: 6px;
        border: 1px solid var(--mon-border); background: var(--mon-surface);
        color: var(--mon-text-dim); font-size: 13px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 0.12s;
      }
      .mon-r-act-btn:hover {
        background: var(--mon-accent-bg); color: var(--mon-accent);
        border-color: var(--mon-accent-border); transform: translateY(-1px);
      }
      .mon-r-act-btn[data-tone="green"]:hover {
        background: var(--mon-green-bg); color: var(--mon-green);
        border-color: var(--mon-green-border);
      }

      /* Empty state */
      .mon-list-empty-v2 {
        padding: 64px 32px; text-align: center;
        color: var(--mon-text-faint); font-size: 13px;
      }
      .mon-list-empty-v2 .ic { font-size: 36px; opacity: 0.4; margin-bottom: 12px; }

      /* ── DRAWER LATERAL ── */
      .mon-drawer {
        width: 0; min-width: 0;
        background: var(--mon-surface);
        border-left: 1px solid var(--mon-border);
        display: flex; flex-direction: column;
        overflow: hidden;
        transition: width 0.24s cubic-bezier(0.4,0,0.2,1), min-width 0.24s;
        flex-shrink: 0;
      }
      .mon-drawer[data-open="1"] {
        width: var(--mon-drawer-w); min-width: var(--mon-drawer-w);
      }
      .mon-drawer-hdr {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px var(--mon-sp-3) 10px var(--mon-sp-4);
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border);
        flex-shrink: 0;
        min-height: 48px;
      }
      .mon-drawer-hdr-left {
        display: flex; align-items: center; gap: var(--mon-sp-2); min-width: 0;
      }
      .mon-drawer-hdr-right {
        display: flex; align-items: center; gap: 4px; flex-shrink: 0;
      }
      .mon-drawer-back {
        width: 28px; height: 28px; border-radius: 6px;
        background: var(--mon-surface2); color: var(--mon-text-dim);
        cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
        font-size: 14px; flex-shrink: 0; transition: all 0.12s;
      }
      .mon-drawer-back:hover { background: var(--mon-accent-bg); color: var(--mon-accent); }
      .mon-drawer-title {
        font-size: 13px; font-weight: 700; color: var(--mon-text);
        letter-spacing: -0.2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        max-width: 320px;
      }
      .mon-drawer-sub {
        font-size: 11px; color: var(--mon-text-faint);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      #mon-drawer-pin.is-active {
        background: var(--mon-accent-bg); color: var(--mon-accent);
        border-color: var(--mon-accent-border);
      }
      .mon-drawer-body {
        flex: 1; overflow-y: auto; overflow-x: hidden;
        padding: var(--mon-sp-4);
        min-height: 0;
      }
      .mon-drawer-empty {
        padding: 48px 24px; text-align: center;
        color: var(--mon-text-faint);
      }
      .mon-drawer-empty-ic { font-size: 42px; opacity: 0.4; margin-bottom: 12px; }
      .mon-drawer-empty-tit {
        font-size: 14px; font-weight: 600; color: var(--mon-text-dim);
        margin-bottom: 6px;
      }
      .mon-drawer-empty-sub {
        font-size: 12px; line-height: 1.5;
      }

      /* No drawer, o conteúdo do renderDetail original é reaproveitado.
         Damos um leve refresh nos cards stat dele. */
      .mon-drawer-body .mon-detail-header { margin-bottom: 12px; }
      .mon-drawer-body .mon-stat-card { box-shadow: none; }

      /* ── RESPONSIVIDADE ── */
      @media (max-width: 1320px) {
        #mon-panel.mon-v2 { width: 96vw !important; }
        .mon-drawer { --mon-drawer-w: 480px; }
      }
      @media (max-width: 1100px) {
        .mon-rail-lbl { display: none; }
        .mon-rail { width: 48px; --mon-rail-w: 48px; }
        .mon-rail-item { padding: 9px 0 7px; margin: 0 6px; }
        .mon-rail-ic { font-size: 17px; }
      }

      /* ── DARK MODE OVERRIDES ── */
      #mon-panel.mon-v2.mon-dark .mon-tb-chips .mon-chip.is-active { background:#e8e6e0; color:#1b1b1b; border-color:#e8e6e0; }
      #mon-panel.mon-v2.mon-dark .mon-row-v2 { background: var(--mon-bg); }
      #mon-panel.mon-v2.mon-dark .mon-row-v2:hover { background: var(--mon-surface); }
      #mon-panel.mon-v2.mon-dark .mon-row-v2.is-hl-verde { background: rgba(52,211,153,0.18) !important; border-left-color: #34d399; }
      #mon-panel.mon-v2.mon-dark .mon-row-v2.is-hl-verde:hover { background: rgba(52,211,153,0.26) !important; }
      #mon-panel.mon-v2.mon-dark .mon-compact-table tbody tr.is-hl-verde { background: rgba(52,211,153,0.18) !important; border-left-color: #34d399; }
      #mon-panel.mon-v2.mon-dark .mon-compact-table tbody tr.is-hl-verde:hover { background: rgba(52,211,153,0.26) !important; }


      /* ── LAYOUT COMPACTO ── */
      #mon-groups.is-compact .mon-group { margin-bottom: 0; }
      #mon-groups.is-compact .mon-group-rows { display: block !important; }

      /* ── LAYOUT COMPACTO: grid e tamanhos ajustados ── */
      /* Colunas: [ID] [horário] [gauge escala] [gauge apt] [status] [ação] */

      #mon-groups.is-compact .mon-row-v2 {
        grid-template-columns: minmax(100px,1fr) 54px 60px 60px 100px 30px;
        gap: 6px;
        padding: 3px 8px;
        min-height: 0;
        border-bottom: 1px solid var(--mon-border);
      }
      #mon-groups.is-compact .mon-r-id { gap: 1px; }
      #mon-groups.is-compact .mon-r-id-top { gap: 4px; }
      #mon-groups.is-compact .mon-r-sigla { font-size: 11.5px; }
      #mon-groups.is-compact .mon-r-chave { font-size: 9.5px; }
      #mon-groups.is-compact .mon-r-lider { font-size: 9px; }
      #mon-groups.is-compact .mon-r-now-badge { font-size: 8px; padding: 1px 4px; }

      /* Horário alinhado */
      #mon-groups.is-compact .mon-r-time { justify-content: center; }
      #mon-groups.is-compact .mon-r-time-hh { font-size: 11px; }
      #mon-groups.is-compact .mon-r-time-eta { font-size: 9px; white-space: nowrap; }

      /* Gauge menor e centralizado — 48px cabe na coluna de 58px com folga */
      #mon-groups.is-compact .mon-r-circ { align-items: center; }
      #mon-groups.is-compact .mon-r-circ svg { width: 48px; height: 48px; }
      #mon-groups.is-compact .mon-r-circ svg text:first-of-type { font-size: 14px !important; }
      #mon-groups.is-compact .mon-r-circ svg text:last-of-type  { font-size: 10px !important; }
      #mon-groups.is-compact .mon-r-circ-lbl { font-size: 9px; }

      /* Status e ação */
      #mon-groups.is-compact .mon-r-status { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; justify-content: center; }
      #mon-groups.is-compact .mon-status-badge { font-size: 9px !important; padding: 2px 5px !important; white-space: nowrap; }
      #mon-groups.is-compact .mon-r-act { justify-content: center; }
      #mon-groups.is-compact .mon-r-obs { width: 18px; height: 18px; font-size: 10px; }
      #mon-groups.is-compact .mon-r-act-btn { width: 22px; height: 22px; font-size: 11px; }

      /* Separador de hora no compacto — linha fina entre blocos de hora diferente */
      #mon-groups.is-compact .mon-compact-hour-sep {
        padding: 3px 10px 2px;
        font-size: 9px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
        color: var(--mon-text-faint);
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border);
        border-left: 3px solid transparent;
      }

      /* ── TABELA COMPACTA (estilo data-grid) ── */
      .mon-compact-table {
        width: 100%; border-collapse: collapse; font-size: 13px;
        font-family: var(--mon-font);
      }
      .mon-compact-table thead th {
        padding: 8px 12px; text-align: left;
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.5px; color: var(--mon-text-faint);
        background: var(--mon-surface); border-bottom: 1px solid var(--mon-border);
        position: sticky; top: 0; z-index: 5; white-space: nowrap;
      }
      .mon-compact-table thead th.center { text-align: center; }
      .mon-compact-table tbody tr {
        border-bottom: 1px solid var(--mon-border);
        cursor: pointer; transition: background 0.1s;
        border-left: 3px solid transparent;
        contain: layout style;
      }
      .mon-compact-table tbody tr:hover { background: var(--mon-surface); }
      .mon-compact-table tbody tr.is-hl-verde { background: rgba(10,124,87,0.18) !important; border-left: 4px solid var(--mon-green); }
      .mon-compact-table tbody tr.is-hl-verde:hover { background: rgba(10,124,87,0.26) !important; }
      .mon-compact-table tbody tr[data-state="completo"] { border-left-color: var(--mon-green); }
      .mon-compact-table tbody tr[data-state="parcial"]  { border-left-color: var(--mon-amber); }
      .mon-compact-table tbody tr[data-state="esc-ok"]   { border-left-color: var(--mon-blue); }
      .mon-compact-table tbody tr[data-state="nenhum"]   { border-left-color: #7f0000; }
      .mon-compact-table tbody tr[data-state="esc-inc"]  { border-left-color: var(--mon-red); }
      .mon-compact-table td { padding: 11px 12px; color: var(--mon-text); vertical-align: middle; }
      .mon-ct-chave { font-family: var(--mon-mono); font-size: 11.5px; font-weight: 500; color: var(--mon-text-dim); }
      .mon-ct-sigla { font-weight: 800; font-size: 14px; color: var(--mon-text); }
      .mon-ct-hora  { font-family: var(--mon-mono); font-size: 14px; font-weight: 700; color: var(--mon-text); white-space: nowrap; }
      .mon-ct-lider { font-size: 13px; color: var(--mon-text-dim); white-space: normal; word-break: break-word; line-height: 1.3; }
      .mon-ct-bar-wrap { display: flex; align-items: center; gap: 8px; min-width: 100px; }
      .mon-ct-bar-bg { flex: 1; height: 8px; border-radius: 99px; background: var(--mon-border); overflow: hidden; min-width: 50px; }
      .mon-ct-bar-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
      .mon-ct-bar-txt { font-family: var(--mon-mono); font-size: 13px; font-weight: 700; white-space: nowrap; min-width: 40px; text-align: right; }
      .mon-ct-status { white-space: nowrap; }

      /* Botão de layout */
      #mon-layout-btn {
        height: 32px; width: 32px; border-radius: var(--mon-radius-sm);
        border: 1px solid var(--mon-border2); background: var(--mon-surface);
        color: var(--mon-text-dim); font-size: 14px; font-family: var(--mon-font);
        cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      #mon-layout-btn:hover { background: var(--mon-surface2); color: var(--mon-text); }
      #mon-layout-btn.is-compact { background: var(--mon-accent-bg); color: var(--mon-accent); border-color: var(--mon-accent-border); }


      /* ══════════════════════════════════════════════════════════════════════
         ESTILOS V3 — toolbar reestruturada, modal premium, tipografia melhorada
         ══════════════════════════════════════════════════════════════════════ */

      /* ── TOOLBAR DUAS LINHAS (chips acima, busca abaixo) ── */
      /* ── toolbar-v3 / search — definições movidas para o bloco v54 abaixo ── */



      /* ── MELHORIAS TIPOGRÁFICAS GLOBAIS v54 ── */
      .mon-r-sigla    { font-size: 13px !important; font-weight: 800 !important; }
      .mon-r-chave    { font-size: 10.5px !important; }
      .mon-r-lider    { font-size: 11.5px !important; }
      .mon-r-time-hh  { font-size: 14px !important; }
      .mon-r-time-eta { font-size: 10.5px !important; }

      /* ── GAUGE CIRCULAR: maior e mais legível ── */
      .mon-r-circ {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 1px !important;
        min-width: 0 !important;
        justify-content: center !important;
      }
      .mon-r-circ svg { width: 60px !important; height: 60px !important; }
      .mon-r-circ-pct, .mon-r-circ-lbl {
        font-size: 11.5px !important; font-weight: 800 !important;
        font-family: var(--mon-mono) !important;
        letter-spacing: 0.1px !important; line-height: 1 !important;
      }

      .mon-status-badge { font-size: 11.5px !important; padding: 4px 10px !important; }
      .mon-group-hdr .g-name { font-size: 12px !important; }
      .mon-group-hdr .g-count { font-size: 12px !important; padding: 2px 10px !important; }
      .mon-kpi-val { font-size: 19px !important; }
      .mon-kpi-lbl { font-size: 11.5px !important; }
      .mon-kpis-v2 { height: 48px !important; max-height: 48px !important; gap: var(--mon-sp-5) !important;
        contain: layout style; /* isola KPIs do layout de scroll */ }
      .mon-kpis-hint { font-size: 11px !important; }

      /* Header proporcional ao layout compacto */
      .mon-hd-v2 { height: 50px !important; }
      .mon-hd-v2 .mon-logo-title { font-size: 14px !important; }
      .mon-hd-v2 .mon-logo-sub { font-size: 10.5px !important; }

      /* Coluna de cabeçalho e linhas */
      .mon-list-colhdr { font-size: 10.5px !important; padding: 8px var(--mon-sp-4) !important; }
      .mon-row-v2 { padding: 7px var(--mon-sp-4) !important; }

      /* Cabeçalho no modo compacto — vem depois para sobrescrever regras acima */
      #mon-panel .mon-list-colhdr.is-compact {
        display: none !important;
      }

      /* ── TOOLBAR v54: busca premium ── */
      .mon-toolbar-v3 {
        display: flex !important; flex-direction: column !important;
        gap: 0 !important; height: auto !important;
        padding: 0 !important;
        background: var(--mon-surface) !important;
        border-bottom: 1px solid var(--mon-border) !important;
        /* ── Perf: isola toolbar do reflow de scroll ── */
        contain: layout style;
        transform: translateZ(0);
      }
      .mon-toolbar-row {
        display: flex; align-items: center;
        gap: var(--mon-sp-2); padding: 8px var(--mon-sp-4);
      }
      .mon-toolbar-row--chips {
        border-bottom: 1px solid var(--mon-border);
        padding: 8px var(--mon-sp-4);
        flex-wrap: wrap; gap: 5px;
      }
      .mon-toolbar-row--search {
        padding: 0 !important;
        gap: 0 !important;
        width: 100% !important;
        background: var(--mon-surface);
        border-bottom: 1px solid var(--mon-border2);
      }
      /* Chips ligeiramente mais polidos */
      .mon-tb-chips .mon-chip {
        height: 27px !important; padding: 0 11px !important;
        font-size: 11px !important; border-radius: 99px !important;
        font-weight: 600 !important;
      }

      /* SEARCH: barra larga de ponta a ponta */
      .mon-tb-search-full {
        flex: 1 !important; min-width: 0 !important; max-width: none !important;
        width: 100% !important; box-sizing: border-box !important;
        height: 36px !important;
        border-radius: 0 !important;
        border: none !important;
        border-bottom: 2px solid transparent !important;
        background: var(--mon-bg) !important;
        transition: border-color 0.15s !important;
        box-shadow: none !important;
        display: flex !important; align-items: center !important; gap: 8px !important;
        padding: 0 16px !important;
      }
      .mon-tb-search-full:focus-within {
        border-bottom-color: var(--mon-accent) !important;
        box-shadow: none !important;
      }
      .mon-tb-search-full .mon-filter-icon {
        font-size: 14px !important; color: var(--mon-text-faint) !important;
        opacity: 0.7 !important; flex-shrink: 0 !important;
      }
      .mon-tb-search-full:focus-within .mon-filter-icon {
        color: var(--mon-accent) !important; opacity: 1 !important;
      }
      .mon-tb-search-full #mon-filter-input {
        font-size: 13px !important; padding: 0 !important;
        font-weight: 400 !important; letter-spacing: 0 !important;
        color: var(--mon-text) !important;
      }
      .mon-tb-search-full #mon-filter-clear {
        font-size: 11px !important; opacity: 0.5 !important;
        width: 18px !important; height: 18px !important;
        display: none !important;
        border-radius: 50% !important;
        background: var(--mon-surface2) !important;
        align-items: center !important; justify-content: center !important;
        transition: all 0.12s !important; flex-shrink: 0 !important;
      }
      .mon-tb-search-full #mon-filter-clear:hover {
        background: var(--mon-red-bg) !important;
        color: var(--mon-red) !important; opacity: 1 !important;
      }

      /* ── KPIs — separador entre itens ── */
      .mon-kpi:not(:last-of-type):not(.mon-kpis-spacer) {
        padding-right: var(--mon-sp-5);
        border-right: 1px solid var(--mon-border);
        margin-right: 0;
      }

      /* ── MODAL DE DETALHE PREMIUM ── */
      #mon-op-modal {
        font-family: var(--mon-font);
      }

      /* Dark mode no modal */
      body.mon-dark-mode #mon-op-modal { background: rgba(0,0,0,0.72); }
      body.mon-dark-mode #mon-op-modal-box {
        --mon-bg:          #2e2e2c;
        --mon-surface:     #383836;
        --mon-surface2:    #424240;
        --mon-surface3:    #4a4a48;
        --mon-border:      #555552;
        --mon-border2:     #626260;
        --mon-text:        #e8e6e0;
        --mon-text-dim:    #b0ada6;
        --mon-text-faint:  #7a7874;
        --mon-green:       #34d399;
        --mon-green-bg:    rgba(52,211,153,0.12);
        --mon-green-border:rgba(52,211,153,0.30);
        --mon-amber:       #fbbf24;
        --mon-amber-bg:    rgba(251,191,36,0.12);
        --mon-amber-border:rgba(251,191,36,0.30);
        --mon-red:         #f87171;
        --mon-red-bg:      rgba(248,113,113,0.12);
        --mon-red-border:  rgba(248,113,113,0.30);
        --mon-blue:        #60a5fa;
        --mon-blue-bg:     rgba(96,165,250,0.12);
        --mon-blue-border: rgba(96,165,250,0.30);
        --mon-accent:      #818cf8;
        --mon-accent-bg:   rgba(129,140,248,0.12);
        --mon-accent-border:rgba(129,140,248,0.30);
        --mon-font: 'Inter', system-ui, sans-serif;
        --mon-mono: 'JetBrains Mono', 'Consolas', monospace;
        --mon-radius: 10px;
        --mon-radius-sm: 6px;
        --mon-radius-xs: 4px;
      }

      /* Conteúdo interno do modal herda vars e melhora legibilidade */
      #mon-op-modal-body .mon-stat-card { box-shadow: none; }
      #mon-op-modal-body .mon-stat-card-num { font-size: 24px; }
      #mon-op-modal-body .mon-stat-card-label { font-size: 11px; }
      #mon-op-modal-body .mon-list-panel-title { font-size: 11.5px !important; }
      #mon-op-modal-body .mon-list-row-name { font-size: 13px !important; }
      #mon-op-modal-body .mon-list-panel-body { max-height: 280px !important; }
      #mon-op-modal-body .mon-actions { border-radius: 10px; }
      #mon-op-modal-body .mon-send-btn { font-size: 12px; padding: 7px 14px; }
      #mon-op-modal-body .mon-detail-header { margin-bottom: 16px; }
      #mon-op-modal-body .mon-key-chip { font-size: 12.5px; padding: 4px 12px; }
      #mon-op-modal-body .mon-copy-btn { font-size: 12px; padding: 5px 12px; }
      #mon-op-modal-body .mon-lists-grid { gap: 14px !important; }

      /* Responsividade */
      @media (max-width: 1200px) {
        #mon-panel.mon-v2 { width: 90vw !important; }
      }
      @media (max-width: 960px) {
        #mon-panel.mon-v2 { width: 100vw !important; }
      }
    `;
    document.head.appendChild(s);
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // COMPORTAMENTOS V2 — drawer / rail / agrupamento temporal / linha-card
  // Estes hooks substituem renderTable e toggleRow.
  // ══════════════════════════════════════════════════════════════════════════════

  // Estado V2
  let _monV2Selected = null;       // chave da op selecionada no drawer
  let _monV2DrawerPinned = false;  // se true, não fecha ao re-render
  let _monLayoutMode = (localStorage.getItem('_monLayoutMode') || 'normal'); // 'normal' | 'compact'
  // Rastreia listeners de close dos dropdowns para limpeza quando o modal é re-renderizado
  const _monDropListeners = [];
  window._monRegisterDropClose = function(fn) { _monDropListeners.push(fn); };
  window._monCleanDropListeners = function() {
    while (_monDropListeners.length) {
      try { document.removeEventListener('click', _monDropListeners.pop()); } catch(e) {}
    }
  };

  // Navegação no rail
  window._monNavView = function(view, btn) {
    // Atualiza estado visual
    document.querySelectorAll('.mon-rail-item').forEach(b => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
    // Dispara função correspondente (mantém o modal existente como "view")
    if (view === 'ops') {
      // já estamos na view principal
      return;
    }
    if (view === 'hist'      && window._monAbrirHistorico) return window._monAbrirHistorico();
    if (view === 'saida-antecipada' && window._monAbrirSaidaAntecipada) return window._monAbrirSaidaAntecipada();
    if (view === 'faltas'    && window._monAbrirFaltas)    return window._monAbrirFaltas();
    if (view === 'relturno'  && window._monAbrirRelTurno)  return window._monAbrirRelTurno();
    if (view === 'relescala' && window._monAbrirRelEscala) return window._monAbrirRelEscala();
    if (view === 'hora-extra' && window._monAbrirRelatorios) return window._monAbrirRelatorios('he');
    if (view === 'relatorios' && window._monAbrirRelatorios) return window._monAbrirRelatorios();
  };

  // Reverte rail para "Operações" quando um modal-view for fechado
  window._monRailVoltarOps = function() {
    document.querySelectorAll('.mon-rail-item').forEach(b => b.classList.remove('is-active'));
    const opsBtn = document.querySelector('.mon-rail-item[data-view="ops"]');
    if (opsBtn) opsBtn.classList.add('is-active');
  };

  // Observa fechamentos de modais "view" (templates, rel turno) que se removem
  // do DOM para resetar o rail. Atributo data-display ESC tratado por _monFechar*.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // Se algum modal de view estiver aberto, fecha e reseta o rail
      const visibleModals = ['mon-hist-modal','mon-faltas-modal','mon-rel-modal','mon-rel-escala-modal','mon-rel-combinado-modal','mon-sa-modal']
        .map(id => document.getElementById(id))
        .filter(m => m && getComputedStyle(m).display !== 'none');
      if (visibleModals.length) {
        visibleModals.forEach(m => { try { m.style.display = 'none'; } catch(_) {} });
        window._monRailVoltarOps();
      }
    }
  });

  // Polling leve: se nenhum modal-view está visível, mantém "Operações" ativo
  setInterval(() => {
    const railOps = document.querySelector('.mon-rail-item[data-view="ops"]');
    if (!railOps) return;
    // Usa style.display em vez de getComputedStyle para evitar forçar layout recalc
    const anyView = ['mon-hist-modal','mon-faltas-modal','mon-rel-modal']
      .some(id => {
        const m = document.getElementById(id);
        return m && m.style.display !== 'none' && m.style.display !== '';
      });
    if (!anyView) {
      const anyActive = document.querySelector('.mon-rail-item.is-active');
      if (anyActive && anyActive !== railOps) {
        window._monRailVoltarOps();
      }
    }
  }, 1200);

  // Drawer
  window._monDrawerOpen = function(op) {
    // Compatibilidade: mantém estado interno do drawer para que o código existente funcione
    const dr = document.getElementById('mon-drawer');
    const body = document.getElementById('mon-drawer-body');
    const titleEl = document.getElementById('mon-drawer-title');
    const subEl = document.getElementById('mon-drawer-sub');
    if (dr) dr.dataset.open = '1';
    if (titleEl) titleEl.textContent = (op.sigla || op.chave) + (op.hora ? '  ·  ' + op.hora : '');
    if (subEl)   subEl.textContent   = op.chave;
    // Não renderiza renderDetail no drawer quando o modal premium está ativo,
    // evitando IDs duplicados que quebram os botões inline do modal.
    // O drawer fica como referência interna mas o conteúdo visível é o modal.
    if (body) body.innerHTML = '';

    _monV2Selected = op.chave;
    if (typeof _monSaveState === 'function') _monSaveState();

    // Abre o modal premium
    window._monOpModalOpen(op);

    // Marca linha selecionada
    _monMarkSelectedRow();
  };

  window._monDrawerClose = function() {
    // FIX v60.65: usa flag para sinalizar a _monOpModalClose que NAO deve zerar
    // _monV2Selected (o drawer ja cuida disso aqui, na ordem correta).
    // Sem a flag, _monOpModalClose zeraria _monV2Selected antes do poll da nova op
    // verificar se ainda e a op correta, cancelando o poll prematuramente e deixando
    // o modal sem conteudo/botoes ao abrir outra op logo em seguida.
    window._monDrawerCloseInProgress = true;
    try {
      const dr = document.getElementById('mon-drawer');
      if (dr) dr.dataset.open = '0';
      _monV2Selected = null;
      _monV2DrawerPinned = false;
      const pin = document.getElementById('mon-drawer-pin');
      if (pin) pin.classList.remove('is-active');
      _monMarkSelectedRow();
      // FIX: cancela poll pendente ao fechar o drawer para evitar escrita tardia no modal
      const modal = document.getElementById('mon-op-modal');
      if (modal && modal._monActivePoll) { clearInterval(modal._monActivePoll); modal._monActivePoll = null; }
      window._monOpModalClose();
    } finally {
      window._monDrawerCloseInProgress = false;
    }
  };

  // ── MODAL DE DETALHE PREMIUM ────────────────────────────────────────────────

  window._monOpModalOpen = function(op) {
    const modal = document.getElementById('mon-op-modal');
    const modalBody = document.getElementById('mon-op-modal-body');
    const siglaEl = document.getElementById('mon-op-modal-sigla');
    const chaveEl = document.getElementById('mon-op-modal-chave');
    const horaEl  = document.getElementById('mon-op-modal-hora');
    const liderEl = document.getElementById('mon-op-modal-lider');
    const liveEl  = document.getElementById('mon-op-modal-live');
    const statusEl= document.getElementById('mon-op-modal-status');
    if (!modal) return;

    // Preenche header
    if (siglaEl) siglaEl.textContent = op.sigla || op.chave || '—';
    if (chaveEl) chaveEl.textContent = op.chave || '';
    if (horaEl)  horaEl.textContent  = op.hora ? '🕐 ' + op.hora : '';
    if (liderEl) liderEl.textContent = op.lider ? '👤 ' + op.lider : '';
    // FIX: marca o modalBody com o id da op atual para que polls/fetches antigos
    // possam verificar se ainda são a op correta antes de escrever no DOM
    if (modalBody) modalBody.dataset.opId = op.id || '';

    // Badge ao vivo
    if (liveEl) {
      const _bucket2 = (typeof _monBucketForOp === 'function') ? _monBucketForOp(op) : '';
      liveEl.innerHTML = _bucket2 === 'running' ? '<span class="mon-live-badge"><span class="lc"></span><span class="lr"></span>AO VIVO</span>' : '';
    }

    // Badge status — clicável quando há diff (entrou/saiu desde envio)
    if (statusEl) {
      try {
        const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
        const temDados = d && d !== 'loading';
        statusEl.innerHTML = (typeof situacaoBadge === 'function') ? situacaoBadge(temDados ? d : null, op) : '';
        // Adiciona onclick para rolar até a seção de diff no corpo do modal
        statusEl.style.cursor = 'pointer';
        statusEl.title = 'Ver mudanças de escala';
        statusEl.onclick = function() {
          const body = document.getElementById('mon-op-modal-body');
          if (!body) return;
          // Procura os elementos de diff (entrou/saiu) dentro do modal body
          const diffEl = body.querySelector('[id^="mon-diff-"]');
          if (diffEl) {
            diffEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Abre o diff se estiver fechado
            const parent = diffEl.parentElement;
            if (parent) {
              const trigger = parent.previousElementSibling;
              if (trigger && diffEl.style.display === 'none') trigger.click();
            }
          } else {
            // Sem diff ativo: rola para o topo da lista de escalados/faltando
            const listPanel = body.querySelector('.mon-list-panel');
            if (listPanel) listPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };
      } catch(e) { statusEl.innerHTML = ''; }
    }

    // Conteúdo
    if (modalBody) {
      // FIX: cancela qualquer poll anterior antes de abrir nova op
      // Sem isso, dois polls rodavam simultaneamente e escreviam conteúdo um sobre o outro
      if (modal._monActivePoll) {
        clearInterval(modal._monActivePoll);
        modal._monActivePoll = null;
      }

      const cached = (typeof apontCache !== 'undefined') && apontCache[op.id];
      if (cached && cached !== 'loading') {
        if (window._monCleanDropListeners) window._monCleanDropListeners();
        try { modalBody.innerHTML = (typeof renderDetail === 'function') ? renderDetail(op) : '<div style="color:var(--mon-text-faint);padding:40px;text-align:center">Sem dados</div>'; } catch(e) {}
      } else {
        modalBody.innerHTML = '<div style="display:flex;align-items:center;gap:10px;color:var(--mon-text-dim);font-size:13px;justify-content:center;padding:48px 0"><div class="mon-loading-spinner"></div>Carregando dados…</div>';
        // Garante que a op está no topo da fila de fetch
        enfileirarUrgente(op, () => {});
        // Poll até os dados chegarem
        // FIX: captura opId e opChave no momento do disparo para evitar stale closure
        // (se o usuário trocar de op antes do fetch terminar, op da closure já estava errada)
        const _pollOpId    = op.id;
        const _pollOpChave = op.chave;
        const _pollFromHist = op._fromHist;
        // ops do histórico (_fromHist) não estão na lista principal — ignora checagem de _monV2Selected
        const poll = setInterval(() => {
          // FIX: cancela se a op selecionada mudou (usuário abriu outra op)
          if (!_pollFromHist && _monV2Selected !== _pollOpChave) { clearInterval(poll); if (modal._monActivePoll === poll) modal._monActivePoll = null; return; }
          const c = (typeof apontCache !== 'undefined') && apontCache[_pollOpId];
          if (c && c !== 'loading') {
            clearInterval(poll);
            if (modal._monActivePoll === poll) modal._monActivePoll = null;
            // FIX: verifica novamente se a op ainda é a selecionada no momento de escrever
            // (fetch assíncrono pode ter terminado depois de outra op ser aberta)
            if (!_pollFromHist && _monV2Selected !== _pollOpChave) return;
            const b = document.getElementById('mon-op-modal-body');
            // FIX: verifica data-op-id no modal body para garantir que é a op certa
            if (b && b.dataset.opId !== _pollOpId) return;
            if (b) {
              if (window._monCleanDropListeners) window._monCleanDropListeners();
              try { b.innerHTML = renderDetail(op); } catch(e) {}
              // FIX v60.65: sincroniza dataHash para que renderTableV2 nao re-renderize
              // imediatamente apos o poll completar (evita destruir botoes durante clique).
              // Sem isso, renderTableV2 via MutationObserver disparava ~150ms depois,
              // via _newHash diferente do dataHash vazio, re-renderizava o modal e podia
              // destruir o DOM de um botao no exato momento em que o usuario clicava nele.
              try {
                if (c && c !== 'loading') {
                  const _h = JSON.stringify({ apt: c.apontado, esc: c.escalado, conf: c.todosConfirmados, lista: c.listaEnviada, colabs: (c.colaboradores||[]).length, vales: (c.vales||[]).length });
                  b.dataset.dataHash = _h;
                }
              } catch(e) {}
            }
            // Atualiza status badge no header e reaplica onclick
            const sEl = document.getElementById('mon-op-modal-status');
            if (sEl) try {
              sEl.innerHTML = (typeof situacaoBadge === 'function') ? situacaoBadge(c, op) : '';
              sEl.style.cursor = 'pointer';
              sEl.title = 'Ver mudanças de escala';
              sEl.onclick = function() {
                const body2 = document.getElementById('mon-op-modal-body');
                if (!body2) return;
                const diffEl = body2.querySelector('[id^="mon-diff-"]');
                if (diffEl) {
                  diffEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  const parent = diffEl.parentElement;
                  if (parent) { const trigger = parent.previousElementSibling; if (trigger && diffEl.style.display === 'none') trigger.click(); }
                } else {
                  const listPanel = body2.querySelector('.mon-list-panel');
                  if (listPanel) listPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              };
            } catch(e) {}
            if (typeof updateMetrics === 'function') updateMetrics();
          }
        }, 500);
        modal._monActivePoll = poll;
        setTimeout(() => { clearInterval(poll); if (modal._monActivePoll === poll) modal._monActivePoll = null; }, 40000);
      }
    }

    modal.style.display = 'flex';
    // FIX v60.65: registra timestamp de abertura do modal para proteger a janela entre
    // o clique na linha (mouse fora do modal) e o mouse entrar no modal-box.
    // renderTableV2 usa isso para suprimir re-renders nos primeiros 400ms apos abertura,
    // evitando destruir o DOM dos botoes enquanto o usuario esta clicando.
    window._monModalOpenedAt = Date.now();
    // Trava re-render enquanto mouse está sobre o modal (evita botão sumir no clique)
    const _modalBox = modal.querySelector('#mon-op-modal-box');
    if (_modalBox && !_modalBox._monHoverBound) {
      _modalBox._monHoverBound = true;
      _modalBox.addEventListener('mouseenter',  () => { window._monModalHovered   = true; });
      _modalBox.addEventListener('mouseleave',  () => { window._monModalHovered   = false; });
      // mousedown/mouseup: bloqueia re-render durante qualquer clique mesmo que mouseleave dispare antes do click
      _modalBox.addEventListener('mousedown',   () => { window._monModalMouseDown = true; });
      document .addEventListener('mouseup',     () => { window._monModalMouseDown = false; }, { capture: true });
    }
    // Aplica dark mode se ativo
    try {
      if (document.getElementById('mon-panel') && document.getElementById('mon-panel').classList.contains('mon-dark')) {
        document.body.classList.add('mon-dark-mode');
      }
    } catch(e) {}
  };

  window._monOpModalClose = function() {
    const modal = document.getElementById('mon-op-modal');
    if (modal) modal.style.display = 'none';
    window._monModalHovered   = false;
    window._monModalMouseDown = false;
    window._monModalOpenedAt  = 0; // FIX v60.65: reseta janela de protecao ao fechar
    // FIX v60.65: so zera _monV2Selected quando chamado diretamente (nao via _monDrawerClose).
    // Quando _monDrawerClose chama esta funcao, ele ja zerou _monV2Selected antes, na ordem
    // correta. Se zeramos de novo aqui durante um _monDrawerOpen subsequente (ex: usuario fecha
    // pelo X e abre outra op), o poll da nova op veria _monV2Selected === null e cancelaria,
    // deixando o modal sem conteudo e sem botoes.
    if (!window._monDrawerCloseInProgress) {
      _monV2Selected = null;
      _monMarkSelectedRow();
      if (typeof _monSaveState === 'function') _monSaveState();
    }
  };

  // Fecha modal ao clicar no backdrop
  // FIX v60.65: chama _monDrawerClose (e nao _monOpModalClose diretamente) para garantir
  // que _monV2Selected e o poll ativo sejam limpos corretamente antes de fechar o modal.
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('mon-op-modal');
    if (modal && e.target === modal) window._monDrawerClose();
  });

  // Fecha modal com ESC (adiciona ao keydown listener existente)
  // FIX v60.65: chama _monDrawerClose (e nao _monOpModalClose) para garantir limpeza
  // completa de _monV2Selected e do poll ativo, pelo mesmo motivo que o backdrop e o botao X.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('mon-op-modal');
      if (modal && modal.style.display !== 'none') { window._monDrawerClose(); return; }
    }
  });

  window._monDrawerTogglePin = function(btn) {
    _monV2DrawerPinned = !_monV2DrawerPinned;
    if (btn) btn.classList.toggle('is-active', _monV2DrawerPinned);
  };

  function _monMarkSelectedRow() {
    document.querySelectorAll('.mon-row-v2').forEach(r => {
      r.classList.toggle('is-selected', r.dataset.chave === _monV2Selected);
    });
  }

  // Agrupamento temporal
  function _monBucketForOp(op) {
    if (!op || !op.hora) return 'later';

    // Se já está marcada como concluída (todos confirmados), vai pro grupo "done"
    try {
      if (typeof apontCache !== 'undefined') {
        const d = apontCache[op.id];
        if (d && d !== 'loading' && d.todosConfirmados === true) return 'done';
      }
    } catch(e) {}

    // v70.81: usa timestamp real (data+hora) para decidir o grupo.
    // Ops que já passaram (ts < agora) → sempre 'past' ou 'running', NUNCA reposicionadas.
    // O wraparound (+1440min) foi removido — causava ops de madrugada (ex: 01:00)
    // aparecerem no grupo "Hoje · mais tarde" depois das 05:00.
    const ts = _opTs(op);
    if (ts > 0) {
      const agora = Date.now();
      const diffMs = ts - agora;
      const diffMin = Math.round(diffMs / 60000);

      if (diffMin <= 0) {
        // Já passou — verifica se ainda está "ao vivo" (dentro da janela de 1h)
        try {
          if (typeof dentroJanela1h === 'function' && dentroJanela1h(op)) return 'running';
        } catch(e) {}
        return 'past';
      }
      if (diffMin <= 60)  return 'now';    // próxima 1h
      if (diffMin <= 240) return 'soon';   // próximas 4h
      return 'later';
    }

    // Fallback sem timestamp (chave não parseável): usa só hora do dia
    const [h, m] = op.hora.split(':').map(Number);
    if (isNaN(h)) return 'later';
    const agora2 = new Date();
    const agoraMin = agora2.getHours() * 60 + agora2.getMinutes();
    const opMin = h * 60 + (m || 0);
    const diff = opMin - agoraMin;
    if (diff <= 0) {
      try {
        if (typeof dentroJanela1h === 'function' && dentroJanela1h(op)) return 'running';
      } catch(e) {}
      return 'past';
    }
    if (diff <= 60)  return 'now';
    if (diff <= 240) return 'soon';
    return 'later';
  }

  const _monBuckets = [
    { key: 'past',    icon: '🔴', name: 'Operações em Andamento', cls: 'is-past-priority' },
    { key: 'running', icon: '🟠', name: 'Agora · Em Andamento',   cls: 'is-urgent' },
    { key: 'now',     icon: '⏱',  name: 'Próxima hora',           cls: 'is-soon' },
    { key: 'soon',    icon: '⏰',  name: 'Próximas 4 horas',       cls: 'is-soon' },
    { key: 'later',   icon: '📅', name: 'Hoje · mais tarde',      cls: '' },
    { key: 'done',    icon: '✅', name: 'Concluídas',              cls: 'is-done' },
  ];

  // Calcula ETA legível ("em 12min", "em 2h30", "há 8min")
  function _monEta(op) {
    if (!op || !op.hora) return '';
    // Usa _opTs para obter o timestamp real da op (data+hora), evitando o bug
    // de wraparound (+1440min) para ops que passaram há mais de 4h no mesmo dia
    // (ex: op de 01:00 vista às 05:44 → diff=-284 → erroneamente virava "em 19h16min")
    const ts = _opTs(op);
    if (ts > 0) {
      const diffMs = ts - Date.now();
      const diffM = Math.round(diffMs / 60000);
      if (diffM === 0) return 'agora';
      if (diffM > 0) {
        if (diffM < 60) return 'em ' + diffM + 'min';
        const hh = Math.floor(diffM/60), mm = diffM%60;
        return 'em ' + hh + 'h' + (mm > 0 ? mm + 'min' : '');
      }
      const ad = -diffM;
      if (ad < 60) return 'há ' + ad + 'min';
      const hh = Math.floor(ad/60), mm = ad%60;
      return 'há ' + hh + 'h' + (mm > 0 ? mm + 'min' : '');
    }
    // Fallback: só hora do dia (sem data), com correção de virada de meia-noite
    const [h, m] = op.hora.split(':').map(Number);
    if (isNaN(h)) return '';
    const agora = new Date();
    const agoraMin = agora.getHours() * 60 + agora.getMinutes();
    const opMin = h * 60 + (m || 0);
    let diff = opMin - agoraMin;
    if (diff < -240) diff += 1440;
    if (diff === 0) return 'agora';
    if (diff > 0) {
      if (diff < 60) return 'em ' + diff + 'min';
      const hh2 = Math.floor(diff/60), mm2 = diff%60;
      return 'em ' + hh2 + 'h' + (mm2 > 0 ? mm2 + 'min' : '');
    }
    const ad = -diff;
    if (ad < 60) return 'há ' + ad + 'min';
    const hh2 = Math.floor(ad/60), mm2 = ad%60;
    return 'há ' + hh2 + 'h' + (mm2 > 0 ? mm2 + 'min' : '');
  }

  // Render de linha para tabela compacta estilo data-grid
  function _monRowCompactHTML(op) {
    const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
    const temDados = d && d !== 'loading';
    const emJanela = (typeof dentroJanela1h === 'function') ? dentroJanela1h(op) : false;

    const escVal = temDados ? (d.escalado || 0) : 0;
    const aptVal = temDados ? (d.apontado  || 0) : 0;
    const sol    = op.qtd || 0;
    const escPct = sol > 0 ? Math.round((escVal / sol) * 100) : 0;
    const aptPct = sol > 0 ? Math.round((aptVal / sol) * 100) : 0;

    const escCor = escPct >= 100 ? 'var(--mon-green)' : escPct > 0 ? 'var(--mon-amber)' : 'var(--mon-border2)';
    const aptCor = aptPct >= 100 ? 'var(--mon-green)' : aptPct > 0 ? 'var(--mon-amber)' : 'var(--mon-border2)';

    const bucket = (typeof _monBucketForOp === 'function') ? _monBucketForOp(op) : '';
    const isLive = bucket === 'running';
    const liveBadge = isLive ? '<span class="mon-r-now-badge" style="font-size:9px;padding:1px 5px;margin-left:4px">Ao vivo</span>' : '';

    // state attr
    let stateAttr = 'none';
    let hlClass = '';
    try {
      if (temDados && d.todosConfirmados) stateAttr = 'completo';
      else if (temDados && aptVal > 0 && aptVal < sol) stateAttr = 'parcial';
      else if (temDados && escVal >= sol && sol > 0) stateAttr = 'esc-ok';
      else if (temDados && escVal > 0 && escVal < sol) stateAttr = 'esc-inc';
      else if (temDados && escVal === 0 && sol > 0) stateAttr = 'nenhum';
      if (temDados && sol > 0 && aptVal >= sol) hlClass = 'is-hl-verde';
    } catch(e) {}

    const escBar = temDados
      ? `<span style="font-family:var(--mon-mono);font-size:17px;font-weight:900;color:${escCor};letter-spacing:-0.5px">${escVal}<span style="font-size:13px;font-weight:500;color:var(--mon-text-faint)">/${sol}</span></span>`
      : `<span style="font-family:var(--mon-mono);font-size:15px;font-weight:700;color:var(--mon-text-faint)">…/${sol}</span>`;

    const aptBar = emJanela && temDados
      ? `<span style="font-family:var(--mon-mono);font-size:17px;font-weight:900;color:${aptCor};letter-spacing:-0.5px">${aptVal}<span style="font-size:13px;font-weight:500;color:var(--mon-text-faint)">/${sol}</span></span>`
      : `<span style="font-family:var(--mon-mono);font-size:15px;color:var(--mon-text-faint)">—</span>`;

    // Bolinha vermelha de mudança de escala
    let escDot = '';
    try {
      const _d2 = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      const _esc2 = _d2 && _d2 !== 'loading' ? (_d2.escalados || []) : null;
      const _temSnap2 = !!(typeof escaladosSnapshot !== 'undefined' && escaladosSnapshot[op.id]);
      const _diff2 = (_esc2 && (typeof snapDiff === 'function') && (_d2.listaEnviada || _temSnap2)) ? snapDiff(op.id, _esc2) : null;
      if (_diff2 && !_diff2._soSaiu) escDot = '<span class="mon-esc-change-dot" style="margin-left:4px;vertical-align:middle" title="Alguém entrou na escala desde o último envio"></span>';
    } catch(e) {}

    let statusBadge = '';
    try {
      const rawStatus = (typeof situacaoBadge === 'function') ? situacaoBadge(temDados ? d : null, op) : '';
      // Se é report enviado (todosConfirmados), substitui pelo emoji ✔️
      if (temDados && d && d.todosConfirmados) {
        statusBadge = '<span title="Report enviado" style="cursor:default;font-size:15px;display:inline-flex;align-items:center;vertical-align:middle;line-height:1" aria-label="Report enviado">✔️</span>';
      } else {
        statusBadge = rawStatus;
      }
    } catch(e) {}
    let escEnvBadge = '';
    try {
      const raw = (typeof escalaEnviadaBadge === 'function') ? escalaEnviadaBadge(op) : '';
      // Só mostra escala enviada se NÃO tem report (report já substitui)
      const temReport = temDados && d && d.todosConfirmados;
      escEnvBadge = (raw && !temReport) ? '<span title="Escala enviada" style="cursor:default;font-size:13px;display:inline-flex;align-items:center;vertical-align:middle;line-height:1" aria-label="Escala enviada">✅</span>' : '';
    } catch(e) {}

    const hl = s => {
      if (!window.filterText || !s) return s || '';
      const re = new RegExp('(' + window.filterText.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
      return s.replace(re, '<mark style="background:rgba(251,191,36,0.35);border-radius:2px">$1</mark>');
    };

    return `<tr data-chave="${op.chave}" data-state="${stateAttr}" class="${hlClass}" style="cursor:pointer">
      <td><span class="mon-ct-chave">${hl(op.chave||'')}</span>${escDot}</td>
      <td><span class="mon-ct-sigla">${hl(op.sigla||'')}${liveBadge}</span></td>
      <td class="mon-ct-hora">${op.hora||'—'}</td>
      <td class="mon-ct-lider">${(() => {
        let _lds;
        try {
          const _d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
          _lds = (_d && _d !== 'loading' && _d.lideres && _d.lideres.length > 0) ? _d.lideres : (op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : ['—']));
        } catch(e) {
          _lds = (op.lider ? [op.lider] : ['—']);
        }
        const _title = _lds.join(', ');
        if (_lds.length > 1) {
          return `<span title="${_title}">${_lds.map(n => hl((n||'').split(' ')[0])).join('<span class="mon-r-lider-sep">/</span>')}</span>`;
        }
        return `<span title="${_title}">${hl((_lds[0]||'—').split(' ')[0])}</span>`;
      })()}</td>
      <td>${escBar}</td>
      <td>${aptBar}</td>
      <td class="mon-ct-status">${statusBadge}</td>
      <td style="text-align:center;vertical-align:middle;width:32px">${escEnvBadge}</td>
    </tr>`;
  }

  // Render V2: agrupa as ops em buckets e emite cards-linha
  function renderTableV2() {
    if (typeof operations === 'undefined') return false;
    const groupsEl = document.getElementById('mon-groups');
    if (!groupsEl) return false;
    // Throttle: não roda mais de 1x por 100ms
    const _now = Date.now();
    if (renderTableV2._lastRun && (_now - renderTableV2._lastRun) < 100) {
      clearTimeout(renderTableV2._throttleTimer);
      renderTableV2._throttleTimer = setTimeout(() => renderTableV2(), 120);
      return false;
    }
    renderTableV2._lastRun = _now;

    // Suspende render durante scroll para evitar jank (DOM rebuild interrompe a rolagem)
    if (renderTableV2._scrolling) {
      clearTimeout(renderTableV2._scrollPendingTimer);
      renderTableV2._scrollPendingTimer = setTimeout(() => renderTableV2(), 200);
      return false;
    }

    // Atualiza contagens dos chips
    if (typeof apontCache !== 'undefined') {
      function countForFilter(f) {
        return operations.filter(op => {
          if (op._fromHist) return false;
          const d = apontCache[op.id];
          if (!d || d === 'loading') return f !== 'completo' && f !== 'parcial';
          const escOk = d.escalado >= d.solicitado;
          const aptOk = d.apontado >= d.solicitado;
          if (f === 'all')            return true;
          if (f === 'completo')       return aptOk && escOk;
          if (f === 'parcial')        return d.apontado > 0 && !aptOk;
          if (f === 'esc')            return d.apontado === 0 && escOk;
          if (f === 'esc_inc')        return d.escalado > 0 && !escOk;
          if (f === 'nenhum')         return d.apontado === 0 && d.escalado === 0;
          if (f === 'esc_inc_nenhum') return !escOk;
          return true;
        }).length;
      }
      const chipMap = {
        'all': '.mon-chip--all', 'completo': '.mon-chip--completo',
        'parcial': '.mon-chip--parcial', 'esc': '.mon-chip--esc',
        'esc_inc': '.mon-chip--esc-inc', 'nenhum': '.mon-chip--nenhum',
        'esc_inc_nenhum': '.mon-chip--esc-inc-nenhum',
      };
      const chipLabels = {
        'all': 'Todos', 'completo': 'Completo', 'parcial': 'Parcial',
        'esc': 'Esc. ok', 'esc_inc': 'Esc. inc.', 'nenhum': 'Nenhum',
        'esc_inc_nenhum': 'Inc.+Nenhum',
      };
      Object.entries(chipMap).forEach(([f, sel]) => {
        const btn = document.querySelector(`#mon-status-chips ${sel}`);
        if (btn) {
          const n = countForFilter(f);
          // Mantém pontinho + label + contagem
          const dotHtml = btn.querySelector('.mon-chip-dot') ? btn.querySelector('.mon-chip-dot').outerHTML : '';
          btn.innerHTML = dotHtml + chipLabels[f] + ' <span style="opacity:0.65;font-weight:600">' + n + '</span>';
        }
      });
    }

    if (operations.length === 0) {
      groupsEl.innerHTML = '<div class="mon-list-empty-v2"><div class="ic">📭</div>Nenhuma operação carregada ainda.</div>';
      if (typeof updateMetrics === 'function') updateMetrics();
      return true;
    }

    const visibleOps = (typeof getVisibleOps === 'function') ? getVisibleOps() : operations;

    // Atualiza placeholder
    const inp = document.getElementById('mon-filter-input');
    if (inp && (!window.filterText)) inp.placeholder = `Filtrar por chave, sigla ou líder…  (${operations.length} ops)`;
    // Mostra/esconde botão limpar busca
    try {
      const clr = document.getElementById('mon-filter-clear');
      if (clr) clr.style.display = (inp && inp.value) ? 'inline-flex' : 'none';
    } catch(e) {}

    if (visibleOps.length === 0) {
      groupsEl.innerHTML = '<div class="mon-list-empty-v2"><div class="ic">🔍</div>Nenhuma operação corresponde ao filtro atual.</div>';
      if (typeof updateMetrics === 'function') updateMetrics();
      return true;
    }

    // Agrupa
    const buckets = { now: [], soon: [], later: [], past: [], running: [], done: [] };
    visibleOps.forEach(op => {
      const b = _monBucketForOp(op);
      buckets[b].push(op);
    });

    // Monta HTML
    let html = '';

    if (_monLayoutMode === 'compact') {

      // ── LAYOUT COMPACTO: mesma lógica de buckets do modo normal, sem headers de grupo ──
      // 'past' e 'running' unificados em "Em Andamento"
      const andamentoOps = [...(buckets['past'] || []), ...(buckets['running'] || [])];
      // Ordena pela data+hora completa extraída da chave (mais antiga primeiro)
      andamentoOps.sort((a, b) => _opTs(a) - _opTs(b));

      const compactBuckets = [
        { key: '_andamento', ops: andamentoOps,           icon: '🔴', name: 'Em Andamento',    cls: 'is-past-priority' },
        { key: 'now',        ops: buckets['now']  || [],  icon: '⏱',  name: 'Próxima hora',    cls: 'is-soon' },
        { key: 'soon',       ops: buckets['soon'] || [],  icon: '⏰', name: 'Próximas 4 horas', cls: 'is-soon' },
        { key: 'later',      ops: buckets['later']|| [],  icon: '📅', name: 'Hoje · mais tarde', cls: '' },
        { key: 'done',       ops: buckets['done'] || [],  icon: '✅', name: 'Concluídas',       cls: 'is-done' },
      ];

      let tableRows = '';
      compactBuckets.forEach(meta => {
        if (!meta.ops || meta.ops.length === 0) return;
        tableRows += meta.ops.map(op => _monRowCompactHTML(op)).join('');
      });
      html = `<div class="mon-group" data-bucket="compact">
        <table class="mon-compact-table" id="mon-compact-tbl">
          <thead><tr>
            <th>Chave</th>
            <th>Sigla</th>
            <th>Hora</th>
            <th>Líder</th>
            <th>Esc / Sol</th>
            <th>Apt / Sol</th>
            <th>Status</th>
            <th style="width:32px;text-align:center"></th>
          </tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>`;
    } else {

      // ── LAYOUT NORMAL: grupos por bucket ──
      // 'past' e 'running' são unificados num único grupo "Em Andamento"
      const andamentoOps = [...(buckets['past'] || []), ...(buckets['running'] || [])];
      // Ordena pela data+hora completa extraída da chave (mais antiga primeiro)
      andamentoOps.sort((a, b) => _opTs(a) - _opTs(b));

      if (andamentoOps.length > 0) {
        const bucketKey = 'running';
        const isCollapsed = _monCollapsedBuckets.has(bucketKey);
        html += `<div class="mon-group" data-bucket="${bucketKey}">
          <div class="mon-group-hdr is-past-priority ${isCollapsed ? 'is-collapsed' : ''}" data-bucket-key="${bucketKey}" onclick="window._monToggleBucket('${bucketKey}',this)">
            <span class="g-ic">🔴</span>
            <span class="g-name">Em Andamento</span>
            <span class="g-count">${andamentoOps.length}</span>
            <span class="g-line"></span>
            <span class="g-chevron">${isCollapsed ? '▶' : '▼'}</span>
          </div>
          <div class="mon-group-rows" style="display:${isCollapsed ? 'none' : 'block'}">${andamentoOps.map(op => _monRowV2Html(op)).join('')}</div>
        </div>`;
      }

      _monBuckets.filter(m => m.key !== 'past' && m.key !== 'running').forEach(meta => {
        const ops = buckets[meta.key];
        if (!ops || ops.length === 0) return;
        const isCollapsed = _monCollapsedBuckets.has(meta.key);
        html += `<div class="mon-group" data-bucket="${meta.key}">
          <div class="mon-group-hdr ${meta.cls} ${isCollapsed ? 'is-collapsed' : ''}" data-bucket-key="${meta.key}" onclick="window._monToggleBucket('${meta.key}',this)">
            <span class="g-ic">${meta.icon}</span>
            <span class="g-name">${meta.name}</span>
            <span class="g-count">${ops.length}</span>
            <span class="g-line"></span>
            <span class="g-chevron">${isCollapsed ? '▶' : '▼'}</span>
          </div>
          <div class="mon-group-rows" style="display:${isCollapsed ? 'none' : 'block'}">${ops.map(op => _monRowV2Html(op)).join('')}</div>
        </div>`;
      });
    }
    groupsEl.classList.toggle('is-compact', _monLayoutMode === 'compact');
    groupsEl.innerHTML = html;
    const colhdr = document.querySelector('#mon-panel .mon-list-colhdr');
    if (colhdr) colhdr.classList.toggle('is-compact', _monLayoutMode === 'compact');

    // Liga handlers (delegação simples por linha)
    // FIX: substituído por event delegation instalada UMA vez (ver abaixo)
    // Não adiciona addEventListener em cada .mon-row-v2 individual — isso criava
    // memory leak: elementos destruídos mas listeners ainda referenciados em closures

    // Delegação de clique para tabela compacta — tratada pelo listener do groupsEl
    // (instalado uma vez em _installV2Hooks via _groupsEl._monRowDelegated)
    // Não é necessário adicionar listener no compactTbl: o groupsEl já delega para tr[data-chave]

    // Restaura seleção
    _monMarkSelectedRow();

    // Se há op selecionada no modal, refresca seu conteúdo APENAS se os dados mudaram
    if (_monV2Selected && !_monV2DrawerPinned) {
      const opSel = operations.find(o => o.chave === _monV2Selected);
      if (opSel) {
        const modalBody = document.getElementById('mon-op-modal-body');
        if (modalBody && typeof renderDetail === 'function') {
          // FIX: garante que o modalBody ainda exibe a op correta antes de re-renderizar
          // (pode ter sido trocado por outra op entre o disparo e a execução deste render)
          // Não usa return — apenas pula o bloco de re-render, métricas continuam atualizando
          const _opIdMatch = !modalBody.dataset.opId || modalBody.dataset.opId === String(opSel.id);
          if (_opIdMatch) {
            const d = (typeof apontCache !== 'undefined') && apontCache[opSel.id];
            if (d && d !== 'loading') {
              // Só re-renderiza se a versão dos dados mudou (evita destruir dropdowns abertos)
              const _newHash = JSON.stringify({ apt: d.apontado, esc: d.escalado, conf: d.todosConfirmados, lista: d.listaEnviada, colabs: (d.colaboradores||[]).length, vales: (d.vales||[]).length });
              // Protege o re-render enquanto mouse está sobre o modal OU há mousedown ativo (clique em andamento)
              // FIX v60.65: também protege nos 400ms após o modal abrir — janela entre o clique
              // na linha (mouse fora do modal) e o cursor entrar no modal-box. Sem essa janela,
              // renderTableV2 podia re-renderizar o modal logo apos o poll completar, destruindo
              // o DOM dos botoes no exato momento em que o usuario clicava neles.
              const _recemAbriu = window._monModalOpenedAt && (Date.now() - window._monModalOpenedAt) < 400;
              const _estaInteragindo = window._monModalHovered || window._monModalMouseDown || _recemAbriu;
              if (modalBody.dataset.dataHash !== _newHash && !_estaInteragindo) {
                modalBody.dataset.dataHash = _newHash;
                // Limpa listeners de dropdown pendentes e fecha dropdowns abertos
                if (window._monCleanDropListeners) window._monCleanDropListeners();
                modalBody.querySelectorAll('.mon-xls-menu.open').forEach(m => m.classList.remove('open'));
                try { modalBody.innerHTML = renderDetail(opSel); } catch(e) {}
              }
            }
          }
        }
        // Drawer body fica vazio para não duplicar IDs inline do renderDetail
        const body = document.getElementById('mon-drawer-body');
        if (body) body.innerHTML = '';
      } else {
        // op sumiu (mudou de página) → fecha modal
        window._monDrawerClose();
      }
    }

    if (typeof updateMetrics === 'function') updateMetrics();
    try { if (typeof _monSyncBotaoVoltar === 'function') _monSyncBotaoVoltar(); } catch(e) {}
    try { if (typeof snapEnsureLoaded === 'function') snapEnsureLoaded(() => setTimeout(_updateSnapDots, 300)); } catch(e) {}
    return true;
  }

  function _monRowV2Html(op) {
    const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
    const temDados = d && d !== 'loading';
    const emJanela = (typeof naJanela === 'function') ? naJanela(op) : true;

    const _escEfetivo = temDados ? (d.escalado || 0) : 0;
    const escPct = temDados && op.qtd > 0 ? Math.min(100, Math.round((_escEfetivo / op.qtd) * 100)) : 0;
    const aptPct = temDados && emJanela && op.qtd > 0 ? Math.min(100, Math.round((d.apontado / op.qtd) * 100)) : 0;
    const escCor = (typeof colorForPct === 'function') ? colorForPct(escPct) : 'var(--mon-text)';
    const aptCor = (typeof colorForAptPct === 'function') ? colorForAptPct(aptPct) : 'var(--mon-text)';

    // Estado para faixa lateral
    const _nenhum  = temDados && d.escalado === 0 && d.apontado === 0;
    const _escOk   = temDados && d.escalado >= d.solicitado;
    const _aptOk   = temDados && d.apontado >= d.solicitado;
    let stateAttr = '';
    if (!temDados) stateAttr = '';
    else if (_nenhum) stateAttr = 'nenhum';
    else if (_aptOk && _escOk) stateAttr = 'completo';
    else if (!_escOk && d.escalado > 0) stateAttr = 'esc-inc';
    else if (_escOk && d.apontado === 0) stateAttr = 'esc-ok';
    else stateAttr = 'parcial';

    // Highlight (verde / nenhum-urgente / inc-urgente)
    const _hlVerde = temDados && d.solicitado > 0 && d.apontado >= d.solicitado;
    const _falta1h30 = (() => {
      if (!op.hora) return false;
      const [h, m] = op.hora.split(':').map(Number);
      if (isNaN(h)) return false;
      const agora = new Date();
      const agoraMin = agora.getHours() * 60 + agora.getMinutes();
      const opMin = h * 60 + (m || 0);
      let diff = opMin - agoraMin;
      if (diff < -180) diff += 1440;
      return diff <= 90;
    })();
    const _escVal = op.escAtual >= 0 ? op.escAtual : (temDados ? (d.escalado || 0) : -1);
    const _solVal = op.qtd || (temDados ? (d.solicitado || 0) : 0);
    const _hlNenhum = !_hlVerde && _falta1h30 && _solVal > 0 && _escVal === 0;
    const _hlInc    = !_hlVerde && _falta1h30 && _solVal > 0 && _escVal > 0 && _escVal < _solVal;

    let rowClasses = 'mon-row-v2';
    if (_hlVerde)  rowClasses += ' is-hl-verde';
    else if (_hlNenhum) rowClasses += ' is-hl-nenhum';
    else if (_hlInc)    rowClasses += ' is-hl-inc';

    // Highlight do texto filtrado
    const hl = (txt) => {
      if (!window.filterText) return txt;
      const q = String(window.filterText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return String(txt || '').replace(new RegExp('(' + q + ')', 'gi'), '<mark style="background:rgba(129,140,248,0.3);color:var(--mon-indigo);border-radius:2px;padding:0 2px">$1</mark>');
    };

    // Badge "Ao vivo" / "Em breve"
    const _isLive = (typeof dentroJanela1h === 'function') ? dentroJanela1h(op) : false;
    const _reportEnv = temDados && d.todosConfirmados === true;
    const _bucket = (typeof _monBucketForOp === 'function') ? _monBucketForOp(op) : '';
    const nowBadge = _reportEnv ? '' :
      _bucket === 'running' ? '<span class="mon-r-now-badge">Ao vivo</span>' :
      _bucket === 'now' ? '<span class="mon-r-soon-badge">Em breve</span>' : '';

    // Dot de mudança de escala
    let escDot = '';
    try {
      const _d2 = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      const _esc2 = _d2 && _d2 !== 'loading' ? (_d2.escalados || []) : null;
      const _temSnap2 = (typeof escaladosSnapshot !== 'undefined') && !!escaladosSnapshot[op.id];
      const _diff2 = (_esc2 && (typeof snapDiff === 'function') && (_d2.listaEnviada || _temSnap2)) ? snapDiff(op.id, _esc2) : null;
      if (_diff2 && !_diff2._soSaiu) escDot = '<span class="mon-esc-change-dot" title="Alguém entrou na escala desde o último envio"></span>';
    } catch(e) {}

    // Botão observação
    let obsClasses = 'mon-r-obs';
    let obsBadgeHtml = '';
    try {
      const _obsData = window._monObsCache && window._monObsCache[op.id];
      const _obsReportEnv = temDados && d.todosConfirmados;
      if (_obsData && _obsData.texto && !_obsReportEnv) obsClasses += ' has-obs';
      const jaViu = (typeof _monObsVistas !== 'undefined') && _monObsVistas.has && _monObsVistas.has(op.id);
      const temObs = _obsData && _obsData.texto && !_obsReportEnv;
      if (temObs && !jaViu) obsBadgeHtml = '<span class="mon-obs-badge"></span>';
    } catch(e) {}

    // ETA
    const eta = _monEta(op);
    const etaCls = (stateAttr === 'completo') ? ''
                 : _hlNenhum ? 'is-urgent'
                 : _hlInc ? 'is-urgent'
                 : (_isLive ? 'is-soon' : '');

    // Status badge (reaproveita situacaoBadge)
    let statusBadge = '';
    try {
      // Se report já foi enviado, escalaEnviadaBadge já cobre — não duplica com "✓ Completo"
      if (!temDados || !d.todosConfirmados) {
        statusBadge = (typeof situacaoBadge === 'function') ? situacaoBadge(temDados ? d : null, op) : '';
      }
    } catch(e) {}

    // Escala enviada / Report enviado badge
    let escEnvBadge = '';
    try {
      escEnvBadge = (typeof escalaEnviadaBadge === 'function') ? escalaEnviadaBadge(op) : '';
    } catch(e) {}

    // Ações inline (1 botão: abrir OP — Report disponível no modal de detalhe)
    let actHtml = '';
    if (op.id) {
      const opIdEsc = String(op.id);
      actHtml = `
        <button class="mon-r-act-btn" title="Abrir OP no TSI"
          onclick="event.stopPropagation();(function(){if(typeof loadiframe==='function'){loadiframe('planejamento-operacional-edit${opIdEsc}_3','Editar Planejamento',570,'modal1500');if(window.$){$('#modal1500').modal('show');setTimeout(function(){var backdrop=document.querySelector('.modal-backdrop');if(backdrop)backdrop.style.zIndex='9999990';var modalEl=document.getElementById('modal1500');if(modalEl)modalEl.style.zIndex='9999991';},80);}}var _p=document.getElementById('mon-panel');if(window._monMinimize&&_p&&_p.dataset.minimized!=='1')window._monMinimize();})()">🔎</button>
      `;
    }

    // ── Circular gauge helper ─────────────────────────────────────────────────
    const _mkCircleGauge = (val, total, pct, cor, label) => {
      const R = 24, C = 2 * Math.PI * R;
      const dash = Math.max(0, Math.min(C, (pct / 100) * C));
      const gap  = C - dash;
      // fundo do anel mais suave
      const trackColor = 'var(--mon-border2)';
      return `<div class="mon-r-circ" title="${label}: ${val}/${total} (${pct}%)">
        <svg width="60" height="60" viewBox="0 0 60 60" style="display:block;flex-shrink:0;overflow:visible">
          <circle cx="30" cy="30" r="${R}" fill="none" stroke="${trackColor}" stroke-width="4"/>
          <circle cx="30" cy="30" r="${R}" fill="none" stroke="${cor}" stroke-width="4.5"
            stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
            stroke-linecap="round"
            transform="rotate(-90 30 30)"
            style="transition:stroke-dasharray 0.4s cubic-bezier(0.4,0,0.2,1)"/>
          <text x="30" y="26" text-anchor="middle" dominant-baseline="middle"
            style="font-size:16px;font-weight:900;fill:${cor};font-family:var(--mon-mono);letter-spacing:-0.5px">${val}</text>
          <text x="30" y="42" text-anchor="middle" dominant-baseline="middle"
            style="font-size:11px;font-weight:700;fill:var(--mon-text-dim);font-family:var(--mon-mono)">/${total}</text>
        </svg>
        <span class="mon-r-circ-lbl" style="color:${cor}">${pct}%</span>
      </div>`;
    };

    // Coluna progresso escala (circular)
    const escCol = op.id ? (temDados
      ? _mkCircleGauge(_escEfetivo, op.qtd, escPct, escCor, 'Escalados')
      : `<span class="mon-r-prog-loading">…/${op.qtd}</span>`)
      : '<span class="mon-r-prog-na">—</span>';

    // Coluna progresso apontamento (circular)
    const aptCol = emJanela ? (temDados
      ? _mkCircleGauge(d.apontado, op.qtd, aptPct, aptCor, 'Apontados')
      : `<span class="mon-r-prog-loading">…/${op.qtd}</span>`)
      : '<span class="mon-r-prog-na" title="Fora da janela de apontamento">—</span>';

    const _lideresLista = (() => {
      try {
        const _d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
        if (_d && _d !== 'loading' && _d.lideres && _d.lideres.length > 0) return _d.lideres;
      } catch(e) {}
      return op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : ['—']);
    })();
    const ldr = _lideresLista.length > 1
      ? _lideresLista.map(n => hl((n || '').split(' ')[0])).join('<span class="mon-r-lider-sep">/</span>')
      : hl(_lideresLista[0]);
    const ldrTitle = _lideresLista.length > 1 ? _lideresLista.join(', ') : (_lideresLista[0] || '');
    const sgl = hl(op.sigla || '');
    const chv = hl(op.chave || '');

    return `<div class="${rowClasses}" data-chave="${op.chave}" data-state="${stateAttr}">
      <div class="mon-r-id">
        <div class="mon-r-id-top">
          <span class="mon-r-sigla">${sgl}</span>
          ${nowBadge}
          ${escDot}
          <button class="${obsClasses}" title="Observações"
            onclick="event.stopPropagation();window._monAbrirObs('${op.id}',this)">💬${obsBadgeHtml}</button>
        </div>
        <div class="mon-r-chave" title="${op.chave || ''}">${chv}</div>
        <div class="mon-r-lider${_lideresLista.length > 1 ? ' is-multi' : ''}" title="${ldrTitle}">${ldr}</div>
      </div>

      <div class="mon-r-time">
        <span class="mon-r-time-hh">${op.hora || '—'}</span>
        <span class="mon-r-time-eta ${etaCls}">${eta}</span>
      </div>

      ${escCol}
      ${aptCol}

      <div class="mon-r-status">${statusBadge}${escEnvBadge}</div>

      <div class="mon-r-act">${actHtml}</div>
    </div>`;
  }

  window.toggleRowV2 = function toggleRowV2(op) {
    if (_monV2Selected === op.chave) {
      window._monDrawerClose();
    } else {
      window._monDrawerOpen(op);
    }
  }

  // Hook: substitui o comportamento de renderTable e toggleRow do código original
  // sem precisar reescrever as funções (pelo `delegation pattern`).
  // O código antigo chama `renderTable()` e `toggleRow(op,idx)`. Aqui interceptamos.
  function _installV2Hooks() {
    if (window._monV2HooksInstalled) return;
    window._monV2HooksInstalled = true;

    // Monkey-patch global renderTable: o original ainda popula #mon-tbody (oculto),
    // mas nós também populamos #mon-groups com a nova UI. Como ambas as funções
    // estão no escopo do IIFE, fazemos um wrapper externo via setInterval suave
    // que sincroniza após cada render.

    // Em vez de monkey-patch (impossível pra closures), capturamos o sinal via
    // observação do tbody — sempre que o tbody mudar, chamamos renderTableV2.
    // FIX: usa flag _monV2Rendering para evitar loop infinito tbody→renderTableV2→renderTable→tbody→...
    const tbody = document.getElementById('mon-tbody');
    if (tbody) {
      let _v2ObsGuard = false;
      const mo = new MutationObserver(() => {
        if (_v2ObsGuard) return; // FIX: evita re-entrada causada pelo próprio render
        clearTimeout(window._monRenderV2Timer);
        // Se está scrollando, agenda render para depois que parar
        const delay = window._monIsScrolling ? 400 : 150;
        window._monRenderV2Timer = setTimeout(() => {
          _v2ObsGuard = true;
          try { renderTableV2(); } catch(e) { console.warn('[mon v2] renderTableV2 fail', e); }
          // Libera a guarda após o ciclo de mutations causadas pelo render terminar
          setTimeout(() => { _v2ObsGuard = false; }, 0);
        }, delay);
      });
      mo.observe(tbody, { childList: true });
      // Primeiro render
      setTimeout(() => { try { renderTableV2(); } catch(e) {} }, 50);
    }

    // Detecta scroll no container de ops para suspender re-renders
    const _groupsContainer = document.getElementById('mon-table-wrap');
    if (_groupsContainer && !_groupsContainer._monScrollRenderBound) {
      _groupsContainer._monScrollRenderBound = true;
      // Otimizações de scroll CSS aplicadas diretamente no container
      _groupsContainer.style.scrollBehavior = 'auto';
      _groupsContainer.style.webkitOverflowScrolling = 'touch';
      _groupsContainer.style.overscrollBehavior = 'contain';
      let _scrollEndTimer = null;
      _groupsContainer.addEventListener('scroll', () => {
        window._monIsScrolling = true;
        clearTimeout(_scrollEndTimer);
        _scrollEndTimer = setTimeout(() => {
          window._monIsScrolling = false;
          // Renderiza agora que o scroll parou, se houver render pendente
          clearTimeout(window._monRenderV2Timer);
          window._monRenderV2Timer = setTimeout(() => {
            try { renderTableV2(); } catch(e) {}
          }, 50);
        }, 200);
      }, { passive: true });
    }
  }

  // ── PAINEL ────────────────────────────────────────────────────────────────────
  function createPanel() {
    if (document.getElementById('mon-panel')) return;
    injectStyles();
    injectStylesV2();

    const p = document.createElement('div');
    p.id = 'mon-panel';
    p.classList.add('mon-v2');
    p.style.cssText = `
      position:fixed;top:0;right:0;width:clamp(660px, 52vw, 960px);height:100vh;
      z-index:99998;display:none;flex-direction:column;overflow:hidden;
      border-radius:0 0 0 18px;
    `;

    const r = 20, circ = 2 * Math.PI * r;
    const notifState = !('Notification' in window) ? 'off' :
      Notification.permission === 'granted' ? 'on' :
      Notification.permission === 'denied'  ? 'off' : 'default';
    const notifLabel = notifState === 'on' ? '🔔 Notif. ativa' : notifState === 'off' ? '🔕 Bloqueado' : '🔔 Ativar notif.';

    p.innerHTML = `
      <!-- ============ HEADER ENXUTO ============ -->
      <div id="mon-header" class="mon-hd-v2">
        <div class="mon-hd-brand">
          <div class="mon-logo">
            <div class="mon-logo-icon"><img src="data:image/jpeg;base64,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" alt="TSI" onerror="this.style.display='none';this.parentElement.textContent='M'" /></div>
            <div class="mon-logo-text">
              <div class="mon-logo-title">Ferramenta <span style="color:var(--mon-accent)">Brendo's</span></div>
              <div class="mon-logo-sub" id="mon-sub">Inicializando…</div>
            </div>
          </div>
        </div>

        <!-- SAUDAÇÃO (só visível expandido) -->
        <div id="mon-saudacao" style="display:flex;flex-direction:column;justify-content:center;line-height:1.25;min-width:0;overflow:hidden;">
          <div id="mon-saudacao-nome" style="font-size:11.5px;font-weight:600;color:var(--mon-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
          <div id="mon-saudacao-frase" style="font-size:10px;color:var(--mon-text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-style:italic;"></div>
        </div>

        <!-- TICKER removido -->

        <div class="mon-hd-spacer"></div>

        <div class="mon-hd-actions">
          <span id="mon-live" class="mon-status-pill" data-state="offline">
            <span class="mon-status-dot"></span>
            <span>Offline</span>
          </span>

          <div class="mon-refresh-pill" id="mon-refresh-pill" title="Próxima atualização automática">
            <span id="mon-hg-icon" style="font-size:11px;">⏳</span>
            <span id="mon-hg-count" style="font-family:var(--mon-mono);font-size:11px;font-weight:600;color:var(--mon-text-dim);">—</span>
            <button id="mon-refresh-btn" class="mon-hd-icon-btn" onclick="window._monRefresh()" title="Atualizar tudo agora">🔄</button>
          </div>

          <button id="mon-notif-hist-btn" class="mon-hd-icon-btn" onclick="window._monAbrirHistoricoNotif()" title="Notificações" style="position:relative;font-size:16px;">
            🔔
            <span id="mon-notif-hist-badge" style="display:none;position:absolute;top:2px;right:2px;min-width:16px;height:16px;background:#ef4444;color:#fff;border-radius:8px;font-size:9px;font-weight:700;line-height:16px;text-align:center;padding:0 3px;"></span>
          </button>

          <div class="mon-avatar-wrap" title="Progresso de carregamento">
            <img id="mon-avatar-img" src="${AVATAR_URL}" />
            <div id="mon-progress-overlay"></div>
            <div id="mon-progress-text" style="display:none">0%</div>
            <svg width="44" height="44" style="position:absolute;top:0;left:0;transform:rotate(-90deg);z-index:4">
              <circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--mon-border)" stroke-width="2.5"/>
              <circle id="mon-progress-circle" cx="22" cy="22" r="${r}" fill="none" stroke="var(--mon-amber)" stroke-width="2.5" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" style="transition:stroke-dashoffset 0.4s ease,stroke 0.4s ease"/>
            </svg>
          </div>

          <button id="mon-busca-colab-btn" class="mon-hd-icon-btn" onclick="window._monAbrirBuscaColab()" title="Buscar colaborador">🔍</button>
          <button id="mon-layout-btn" class="mon-hd-icon-btn" onclick="window._monToggleLayout()" title="Alternar layout">⊞</button>
          <button id="mon-theme-btn" class="mon-hd-icon-btn" onclick="window._monToggleTheme()" title="Alternar tema claro/escuro">🌙</button>
          <button class="mon-hd-icon-btn mon-hd-icon-btn--danger" onclick="window._monFechar()" title="Fechar" style="width:32px;height:32px;border-radius:6px;background:#0d1b2a;border:1.5px solid rgba(180,200,230,0.35);color:#e8edf2;font-size:17px;font-weight:700;font-family:'Arial Black','Segoe UI',sans-serif;box-shadow:0 0 6px rgba(100,160,255,0.25),inset 0 1px 2px rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;padding:0;" onmouseover="this.style.background='#162032';this.style.color='#fff';this.style.boxShadow='0 0 10px rgba(100,160,255,0.4)';" onmouseout="this.style.background='#0d1b2a';this.style.color='#e8edf2';this.style.boxShadow='0 0 6px rgba(100,160,255,0.25)';">&#10005;</button>

          <!-- legados (mantidos invisíveis para retro-compat das funcs antigas) -->
          <button id="mon-notif-btn" class="mon-hdr-btn" data-state="${notifState}" style="display:none" onclick="window._monPedirNotif()">${notifLabel}</button>
        </div>
      </div>

      <!-- ============ BODY: RAIL + MAIN + DRAWER ============ -->
      <div id="mon-body" class="mon-body-v2" style="display:flex;flex:1;overflow:hidden;min-height:0">

        <!-- RAIL DE NAVEGAÇÃO -->
        <aside class="mon-rail" id="mon-rail">
          <button class="mon-rail-item is-active" data-view="ops" onclick="window._monNavView('ops',this)" title="Operações">
            <span class="mon-rail-ic">📊</span>
            <span class="mon-rail-lbl">Operações</span>
          </button>
          <button class="mon-rail-item" data-view="hist" onclick="window._monNavView('hist',this)" title="Histórico de reports">
            <span class="mon-rail-ic">🕐</span>
            <span class="mon-rail-lbl">Histórico</span>
          </button>
          <button class="mon-rail-item" data-view="faltas" onclick="window._monNavView('faltas',this)" title="Relatório de faltas">
            <span class="mon-rail-ic">📋</span>
            <span class="mon-rail-lbl">Faltas</span>
          </button>
          <button class="mon-rail-item" data-view="relatorios" onclick="window._monNavView('relatorios',this)" title="Relatórios">
            <span class="mon-rail-ic">📁</span>
            <span class="mon-rail-lbl">Relatórios</span>
          </button>

          <div style="flex:1"></div>

          <div class="mon-rail-sep"></div>

          <button class="mon-rail-item" onclick="window._monAbrirConfiguracoes()" title="Configurações">
            <span class="mon-rail-ic">⚙️</span>
            <span class="mon-rail-lbl">Config.</span>
          </button>
        </aside>

        <!-- COLUNA PRINCIPAL -->
        <section class="mon-main">

          <!-- KPIs INLINE (agora acima dos filtros) -->
          <div id="mon-metrics" class="mon-kpis-v2">
            <div class="mon-kpi" data-tone="neutral">
              <span class="mon-kpi-dot"></span>
              <span class="mon-kpi-lbl">Total</span>
              <span class="mon-kpi-val" id="m-total">—</span>
            </div>
            <div class="mon-kpi" data-tone="green">
              <span class="mon-kpi-dot"></span>
              <span class="mon-kpi-lbl">Completas</span>
              <span class="mon-kpi-val" id="m-ok">—</span>
            </div>
            <div class="mon-kpi" data-tone="amber">
              <span class="mon-kpi-dot"></span>
              <span class="mon-kpi-lbl">Parciais</span>
              <span class="mon-kpi-val" id="m-inc">—</span>
            </div>
            <div class="mon-kpi" data-tone="red">
              <span class="mon-kpi-dot"></span>
              <span class="mon-kpi-lbl">Sem apt.</span>
              <span class="mon-kpi-val" id="m-zero">—</span>
            </div>
            <div class="mon-kpis-spacer"></div>
            <div class="mon-kpis-hint" id="mon-kpis-hint">Atualizado agora · clique numa OP para abrir detalhes</div>
          </div>

          <!-- TOOLBAR CONSOLIDADA (filtros + busca abaixo dos KPIs) -->
          <div class="mon-toolbar mon-toolbar-v3">

            <!-- Linha 1: Chips de status + páginas -->
            <div class="mon-toolbar-row mon-toolbar-row--chips">
              <div id="mon-status-chips" class="mon-tb-chips">
                <button class="mon-chip mon-chip--all is-active" onclick="window._monSetStatusFilter('all',this)">Todos</button>
                <button class="mon-chip mon-chip--completo" onclick="window._monSetStatusFilter('completo',this)"><span class="mon-chip-dot" style="background:var(--mon-green)"></span>Completo</button>
                <button class="mon-chip mon-chip--parcial"  onclick="window._monSetStatusFilter('parcial',this)"><span class="mon-chip-dot" style="background:var(--mon-amber)"></span>Parcial</button>
                <button class="mon-chip mon-chip--esc"      onclick="window._monSetStatusFilter('esc',this)"><span class="mon-chip-dot" style="background:var(--mon-blue)"></span>Esc. ok</button>
                <button class="mon-chip mon-chip--esc-inc"  onclick="window._monSetStatusFilter('esc_inc',this)"><span class="mon-chip-dot" style="background:var(--mon-red)"></span>Esc. inc.</button>
                <button class="mon-chip mon-chip--nenhum"   onclick="window._monSetStatusFilter('nenhum',this)"><span class="mon-chip-dot" style="background:#7f0000"></span>Nenhum</button>
                <button class="mon-chip mon-chip--esc-inc-nenhum" onclick="window._monSetStatusFilter('esc_inc_nenhum',this)"><span class="mon-chip-dot" style="background:linear-gradient(90deg,var(--mon-red) 50%,#7f0000 50%)"></span>Inc.+Nenhum</button>
              </div>

              <div id="mon-esc-subfilter" style="display:none;align-items:center;gap:6px;padding:4px 8px;background:var(--mon-blue-bg);border:1px solid var(--mon-blue-border);border-radius:8px">
                <span style="font-size:10.5px;color:var(--mon-blue);font-weight:600">📋 Esc. ok</span>
                <span style="font-size:10.5px;color:var(--mon-text-faint)">→</span>
                <button id="mon-sub-esc-enviada" class="mon-chip" onclick="window._monToggleEscEnviada(this)" style="font-size:10.5px;padding:3px 9px">Não enviadas</button>
              </div>

              <div class="mon-tb-divider" style="height:22px"></div>

              <button id="mon-lote-btn" class="mon-chip" onclick="window._monAbrirLote()" title="Enviar escala/report de múltiplas ops de uma vez" style="display:inline-flex;align-items:center;gap:5px;background:var(--mon-accent-bg);border-color:var(--mon-accent-border);color:var(--mon-accent);font-weight:700;">
                ⚡ Envio em lote
              </button>

              <div class="mon-tb-divider" style="height:22px"></div>

              <div class="mon-tb-pages" title="Quantas páginas carregar do TSI">
                <span class="mon-tb-pages-lbl">Páginas</span>
                <button class="mon-pag-btn is-active" onclick="window._monSetPaginas(1,this)" title="Só página 1 (30 ops)">30</button>
                <button class="mon-pag-btn" onclick="window._monSetPaginas(2,this)" title="Páginas 1 e 2 (até 60 ops)">60</button>
                <button class="mon-pag-btn" onclick="window._monSetPaginas(99,this)" title="Todas as páginas disponíveis">Todas</button>
              </div>
            </div>

            <!-- Linha 2: Campo de busca (abaixo dos filtros) -->
            <div class="mon-toolbar-row mon-toolbar-row--search">
              <div class="mon-tb-search mon-tb-search-full">
                <span class="mon-filter-icon">⌕</span>
                <input id="mon-filter-input" type="text" placeholder="Filtrar por chave, sigla ou líder…"
                  oninput="window._monSetFilter(this.value)" autocomplete="off" spellcheck="false" />
                <button id="mon-filter-clear" onclick="window._monClearFilter()" title="Limpar">✕</button>
              </div>
            </div>

          </div>

          <!-- LISTA (mantém #mon-table-wrap e #mon-table para compat) -->
          <div id="mon-table-wrap" class="mon-list-wrap">
            <!-- Cabeçalho de colunas estilo "data table" -->
            <div class="mon-list-colhdr">
              <div class="mon-col-id">Operação</div>
              <div class="mon-col-time mon-th-sort" data-col="hora" onclick="window._monToggleSort('hora',this)">Horário <span class="mon-sort-arrow"></span></div>
              <div class="mon-col-prog mon-th-sort" data-col="esc" onclick="window._monToggleSort('esc',this)">Escala <span class="mon-sort-arrow"></span></div>
              <div class="mon-col-prog mon-th-sort" data-col="apt" onclick="window._monToggleSort('apt',this)">Apt. <span class="mon-sort-arrow"></span></div>
              <div class="mon-col-status mon-th-sort" data-col="status" onclick="window._monToggleSort('status',this)">Status <span class="mon-sort-arrow"></span></div>
              <div class="mon-col-act">Ações</div>
            </div>

            <!-- Tabela legada (oculta visualmente, mas mantida para que renderTable() funcione) -->
            <table id="mon-table" style="display:none">
              <thead>
                <tr>
                  <th style="width:20%">Chave</th>
                  <th style="width:8%">Sigla</th>
                  <th class="center" style="width:10%">Esc</th>
                  <th class="center" style="width:10%">Apt</th>
                  <th style="width:6%">Hora</th>
                  <th style="width:12%">Líder</th>
                  <th class="center" style="width:16%">Status</th>
                  <th style="width:18%"></th>
                </tr>
              </thead>
              <tbody id="mon-tbody"></tbody>
            </table>

            <!-- Container do novo render agrupado por janela temporal -->
            <div id="mon-groups"></div>
          </div>
        </section>

        <!-- DRAWER LATERAL DE DETALHE — oculto (compatibilidade interna) -->
        <aside id="mon-drawer" class="mon-drawer" data-open="0" style="display:none!important;width:0!important;min-width:0!important;overflow:hidden!important;border:none!important;">
          <div class="mon-drawer-hdr" style="display:none">
            <div class="mon-drawer-hdr-left">
              <span class="mon-drawer-back" onclick="window._monDrawerClose()" title="Voltar">←</span>
              <div>
                <div class="mon-drawer-title" id="mon-drawer-title">Selecione uma operação</div>
                <div class="mon-drawer-sub" id="mon-drawer-sub">Clique numa linha à esquerda</div>
              </div>
            </div>
            <div class="mon-drawer-hdr-right">
              <button class="mon-hd-icon-btn" id="mon-drawer-pin" onclick="window._monDrawerTogglePin(this)" title="Fixar painel aberto">📌</button>
              <button class="mon-hd-icon-btn" onclick="window._monDrawerClose()" title="Fechar">✕</button>
            </div>
          </div>
          <div class="mon-drawer-body" id="mon-drawer-body"></div>
        </aside>
      </div>

      <!-- ============ MODAL DE DETALHE DA OPERAÇÃO ============ -->
      <div id="mon-op-modal" style="display:none;position:fixed;inset:0;z-index:999997;background:rgba(0,0,0,0.55);align-items:center;justify-content:center;font-family:var(--mon-font);">
        <div id="mon-op-modal-box" style="background:var(--mon-bg);border-radius:14px;width:860px;max-width:96vw;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;animation:mon-fadein 0.1s ease;box-shadow:0 24px 80px rgba(0,0,0,0.45),0 0 0 1px var(--mon-border);">
          <!-- Modal Header -->
          <div id="mon-op-modal-hdr" style="display:flex;align-items:center;gap:10px;padding:14px 20px 12px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0;">
            <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span id="mon-op-modal-sigla" style="font-size:17px;font-weight:800;color:var(--mon-text);letter-spacing:-0.4px;"></span>
                <span id="mon-op-modal-live"></span>
                <span id="mon-op-modal-status"></span>
              </div>
              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <span id="mon-op-modal-chave" style="font-family:var(--mon-mono);font-size:11.5px;color:var(--mon-accent);font-weight:600;background:var(--mon-accent-bg);border:1px solid var(--mon-accent-border);padding:2px 9px;border-radius:5px;"></span>
                <span id="mon-op-modal-hora" style="font-family:var(--mon-mono);font-size:13px;font-weight:700;color:var(--mon-text-dim);"></span>
                <span id="mon-op-modal-lider" style="font-size:12px;color:var(--mon-text-dim);"></span>
              </div>
            </div>
            <button onclick="window._monDrawerClose()" style="width:32px;height:32px;border-radius:8px;border:1px solid var(--mon-border2);background:transparent;color:var(--mon-text-faint);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.1s,color 0.1s;" onmouseover="this.style.background='var(--mon-red-bg)';this.style.color='var(--mon-red)';this.style.borderColor='var(--mon-red-border)'" onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)';this.style.borderColor='var(--mon-border2)'">✕</button>
          </div>
          <!-- Modal Body -->
          <div id="mon-op-modal-body" style="flex:1;overflow-y:auto;padding:20px 22px;min-height:0;">
            <div style="color:var(--mon-text-faint);font-size:13px;text-align:center;padding:40px 0;">Carregando…</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(p);
    // Aplica tema salvo
    try {
      if (localStorage.getItem(THEME_KEY) === 'dark') {
        p.classList.add('mon-dark');
        document.body.classList.add('mon-dark-mode');
        const tb = document.getElementById('mon-theme-btn');
        if (tb) tb.textContent = '☀️';
      }
    } catch(e) {}
    initControls(p);
    _monIniciarSaudacao();
    _installV2Hooks();
    // FIX: instala event delegation para .mon-row-v2 E tr[data-chave] (tabela compacta) UMA VEZ no groupsEl
    // Evita adicionar addEventListener em cada linha individualmente a cada render (memory leak)
    // e resolve o problema do compactTbl._monDelegated ser perdido a cada innerHTML = (elemento destruído)
    const _groupsEl = document.getElementById('mon-groups');
    if (_groupsEl && !_groupsEl._monRowDelegated) {
      _groupsEl._monRowDelegated = true;
      _groupsEl.addEventListener('click', e => {
        // Modo normal: linha .mon-row-v2
        const rowV2 = e.target.closest('.mon-row-v2');
        if (rowV2) {
          if (e.target.closest('.mon-r-obs') || e.target.closest('.mon-r-act-btn')) return;
          const chave = rowV2.dataset.chave;
          const op = (typeof operations !== 'undefined') && operations.find(o => o.chave === chave);
          if (op && typeof toggleRowV2 === 'function') toggleRowV2(op);
          return;
        }
        // Modo compacto: linha tr[data-chave] dentro de #mon-compact-tbl
        const tr = e.target.closest('tr[data-chave]');
        if (tr) {
          const chave = tr.dataset.chave;
          const op = (typeof operations !== 'undefined') && operations.find(o => o.chave === chave);
          if (op && typeof toggleRowV2 === 'function') toggleRowV2(op);
        }
      });
    }
    setTimeout(() => { if (typeof window._monApplyLayoutBtn === 'function') window._monApplyLayoutBtn(); }, 100);

    // ── MODAL BIOMETRIA PRÓPRIO DO MONITOR ──────────────────────────────────────
    if (!document.getElementById('mon-bio-modal')) {
      const bm = document.createElement('div');
      bm.id = 'mon-bio-modal';
      bm.innerHTML = `
        <div id="mon-bio-box">
          <div id="mon-bio-header">
            <span>Visualizar Biometria</span>
            <button id="mon-bio-close" onclick="window._monFecharBio()">✕</button>
          </div>
          <div id="mon-bio-body">
            <div id="mon-bio-loading">Carregando…</div>
          </div>
        </div>`;
      bm.addEventListener('click', e => { if (e.target === bm) window._monFecharBio(); });
      document.body.appendChild(bm);
    }

    // ── MODAL FALTAS ───────────────────────────────────────────────────────────
    if (!document.getElementById('mon-faltas-modal')) {
      const fm = document.createElement('div');
      fm.id = 'mon-faltas-modal';
      fm.style.cssText = [
        'display:none;position:fixed;inset:0;z-index:999999;',
        'align-items:center;justify-content:center;',
        'background:rgba(0,0,0,0.55);',
        'font-family:var(--mon-font);',
      ].join('');
      fm.innerHTML = `
        <div id="mon-faltas-box" style="
          background:var(--mon-bg);border-radius:14px;
          width:700px;max-width:96vw;max-height:90vh;
          display:flex;flex-direction:column;overflow:hidden;
          animation:mon-fadein 0.15s ease;
          box-shadow:0 24px 80px rgba(0,0,0,0.45),0 0 0 1px var(--mon-border);
        ">

          <!-- HEADER -->
          <div style="
            padding:14px 20px 13px;flex-shrink:0;
            border-bottom:1px solid var(--mon-border);
            background:var(--mon-surface);
            display:flex;align-items:center;gap:12px;
          ">
            <span style="font-size:20px;line-height:1">❌</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:700;color:var(--mon-text);letter-spacing:-0.2px">Relatório de Faltas</div>
              <div id="mon-faltas-header-sub" style="font-size:11px;color:var(--mon-text-faint);margin-top:1px">Faltas registradas pelo monitor</div>
            </div>
            <button onclick="window._monAdicionarFaltaManual()" style="
              height:30px;padding:0 11px;border-radius:6px;
              border:1px solid var(--mon-border2);background:var(--mon-surface2);
              color:var(--mon-text-dim);font-size:11px;font-weight:600;cursor:pointer;
              font-family:var(--mon-font);display:flex;align-items:center;gap:5px;
              transition:background 0.1s,color 0.1s;flex-shrink:0;white-space:nowrap;
            " onmouseover="this.style.background='var(--mon-accent-bg)';this.style.color='var(--mon-accent)';this.style.borderColor='var(--mon-accent-border)'" onmouseout="this.style.background='var(--mon-surface2)';this.style.color='var(--mon-text-dim)';this.style.borderColor='var(--mon-border2)'">+ Adicionar</button>
            <button onclick="window._monLimparFaltas()" style="
              height:30px;padding:0 11px;border-radius:6px;
              border:1px solid rgba(220,38,38,0.3);background:var(--mon-red-bg);
              color:var(--mon-red);font-size:11px;font-weight:600;cursor:pointer;
              font-family:var(--mon-font);display:flex;align-items:center;gap:5px;
              transition:background 0.1s,color 0.1s;flex-shrink:0;white-space:nowrap;
            " onmouseover="this.style.background='var(--mon-red)';this.style.color='#fff'" onmouseout="this.style.background='var(--mon-red-bg)';this.style.color='var(--mon-red)'">🗑 Limpar tudo</button>
            <button onclick="window._monFecharFaltas()" style="
              width:32px;height:32px;border-radius:8px;border:1px solid var(--mon-border2);
              background:transparent;color:var(--mon-text-faint);font-size:16px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;flex-shrink:0;
              transition:background 0.1s,color 0.1s;
            " onmouseover="this.style.background='var(--mon-red-bg)';this.style.color='var(--mon-red)';this.style.borderColor='rgba(220,38,38,0.3)'" onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)';this.style.borderColor='var(--mon-border2)'">✕</button>
          </div>

          <!-- FILTROS -->
          <div style="
            padding:11px 20px;flex-shrink:0;
            border-bottom:1px solid var(--mon-border);
            background:var(--mon-surface);
            display:flex;align-items:center;gap:8px;flex-wrap:wrap;
          ">
            <span style="font-size:11px;font-weight:600;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap">Turno</span>
            <button onclick="window._monSelecionarTurno(1)" id="mon-faltas-t1" style="height:28px;padding:0 11px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--mon-font);transition:background 0.1s,color 0.1s,border-color 0.1s">T1 · 06~14</button>
            <button onclick="window._monSelecionarTurno(2)" id="mon-faltas-t2" style="height:28px;padding:0 11px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--mon-font);transition:background 0.1s,color 0.1s,border-color 0.1s">T2 · 14~21:30</button>
            <button onclick="window._monSelecionarTurno(3)" id="mon-faltas-t3" style="height:28px;padding:0 11px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--mon-font);transition:background 0.1s,color 0.1s,border-color 0.1s">T3 · 21:30~06</button>
            <div style="width:1px;height:20px;background:var(--mon-border);margin:0 2px;flex-shrink:0"></div>
            <span style="font-size:11px;color:var(--mon-text-faint);white-space:nowrap">De</span>
            <input id="mon-faltas-data-ini" type="date" style="height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:12px;font-family:var(--mon-font)" />
            <input id="mon-faltas-hora-ini" type="text" placeholder="00:00" maxlength="5" style="width:56px;height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:12px;font-family:var(--mon-font);text-align:center" />
            <span style="font-size:11px;color:var(--mon-text-faint);white-space:nowrap">até</span>
            <input id="mon-faltas-data-fim" type="date" style="height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:12px;font-family:var(--mon-font)" />
            <input id="mon-faltas-hora-fim" type="text" placeholder="23:59" maxlength="5" style="width:56px;height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:12px;font-family:var(--mon-font);text-align:center" />
            <button onclick="window._monFiltrarFaltas()" style="height:28px;padding:0 13px;border-radius:6px;border:1px solid var(--mon-accent-border);background:var(--mon-accent-bg);color:var(--mon-accent);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--mon-font);transition:background 0.1s,color 0.1s" onmouseover="this.style.background='var(--mon-accent)';this.style.color='#fff'" onmouseout="this.style.background='var(--mon-accent-bg)';this.style.color='var(--mon-accent)'">Filtrar</button>
            <button onclick="['mon-faltas-data-ini','mon-faltas-hora-ini','mon-faltas-data-fim','mon-faltas-hora-fim'].forEach(function(id){document.getElementById(id).value='';});document.querySelectorAll('#mon-faltas-t1,#mon-faltas-t2,#mon-faltas-t3').forEach(function(b){b.style.background='var(--mon-surface2)';b.style.color='var(--mon-text-dim)';b.style.borderColor='var(--mon-border2)';});window._monFiltrarFaltas();" style="height:28px;padding:0 10px;border-radius:6px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);font-size:11px;cursor:pointer;font-family:var(--mon-font);transition:color 0.1s" onmouseover="this.style.color='var(--mon-text)'" onmouseout="this.style.color='var(--mon-text-faint)'">Limpar</button>
          </div>

          <!-- LISTA DE FALTAS -->
          <div id="mon-faltas-body" style="flex:1;overflow-y:auto;padding:16px 20px;min-height:100px;display:flex;flex-direction:column;gap:6px"></div>

          <!-- FOOTER: RELATÓRIO -->
          <div style="
            padding:14px 20px;border-top:1px solid var(--mon-border);
            background:var(--mon-surface);flex-shrink:0;
          ">
            <div style="font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Relatório WhatsApp</div>
            <pre id="mon-faltas-pre" style="
              font-size:11.5px;color:var(--mon-text-dim);font-family:var(--mon-mono);
              white-space:pre-wrap;background:var(--mon-surface2);
              border:1px solid var(--mon-border);border-radius:8px;
              padding:10px 12px;margin:0 0 10px;
              max-height:150px;overflow-y:auto;line-height:1.6;
            "></pre>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <span id="mon-faltas-total" style="font-size:13px;font-weight:700;color:var(--mon-red)"></span>
              <button onclick="window._monCopiarFaltas(this)" style="
                height:32px;padding:0 18px;border-radius:7px;border:none;
                background:var(--mon-green);color:#fff;font-size:12px;font-weight:700;
                cursor:pointer;font-family:var(--mon-font);
                display:flex;align-items:center;gap:6px;
                transition:opacity 0.1s;
              " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">📋 Copiar relatório</button>
            </div>
          </div>

        </div>`;
      fm.addEventListener('click', e => { if (e.target === fm) window._monFecharFaltas(); });
      document.body.appendChild(fm);
    }
  }

  window._monFecharBio = function() {
    const m = document.getElementById('mon-bio-modal');
    if (m) { m.classList.remove('open'); m.style.zIndex = ''; }
  };

  window._monZoomFoto = function(src, label) {
    let z = document.getElementById('mon-foto-zoom');
    if (!z) {
      z = document.createElement('div');
      z.id = 'mon-foto-zoom';
      z.innerHTML = '<img id="mon-foto-zoom-img"><span id="mon-foto-zoom-label"></span>';
      z.onclick = () => z.classList.remove('open');
      document.body.appendChild(z);
    }
    z.style.zIndex = '2147483647';
    document.getElementById('mon-foto-zoom-img').src = src;
    document.getElementById('mon-foto-zoom-label').textContent = label;
    z.classList.add('open');
  };

  // ── BUSCA DE COLABORADOR ─────────────────────────────────────────────────────
  window._monAbrirBuscaColab = function() {
    let overlay = document.getElementById('mon-busca-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mon-busca-overlay';
      overlay.innerHTML = `
        <div id="mon-busca-box">
          <div id="mon-busca-header">
            <span style="font-size:15px;">🔍</span>
            <input id="mon-busca-input" placeholder="Buscar colaborador pelo nome…" autocomplete="off" spellcheck="false"/>
            <button id="mon-busca-close" onclick="window._monFecharBuscaColab()">✕</button>
          </div>
          <div id="mon-busca-results"><div id="mon-busca-empty" style="display:none"></div></div>
          <div id="mon-busca-hint">Resultados em tempo real · clique na linha para abrir a operação</div>
        </div>`;
      overlay.addEventListener('mousedown', function(e) {
        if (e.target === overlay) window._monFecharBuscaColab();
      });
      document.body.appendChild(overlay);

      document.getElementById('mon-busca-input').addEventListener('input', function() {
        window._monBuscaColabRender(this.value.trim());
      });
      document.getElementById('mon-busca-input').addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window._monFecharBuscaColab();
      });
    }
    overlay.classList.add('open');
    const inp = document.getElementById('mon-busca-input');
    inp.value = '';
    document.getElementById('mon-busca-results').innerHTML = '<div id="mon-busca-empty" style="display:none"></div>';
    setTimeout(() => inp.focus(), 60);
  };

  window._monBuscaItemClick = function(hi) {
    // Fecha o overlay primeiro
    window._monFecharBuscaColab();
    // Recupera o hit pelo índice — evita type mismatch de id no find inline
    const hits = window._monBuscaHitsAtual;
    if (!hits || !hits[hi]) return;
    const op = hits[hi].op;
    if (!op) return;
    // Abre o drawer/modal da op
    setTimeout(function() {
      if (typeof window._monDrawerOpen === 'function') {
        window._monDrawerOpen(op);
      } else if (typeof toggleRow === 'function') {
        toggleRow(op, 0);
      }
    }, 50); // pequeno delay para o overlay fechar antes de abrir o modal
  };

    window._monFecharBuscaColab = function() {
    const o = document.getElementById('mon-busca-overlay');
    if (o) o.classList.remove('open');
  };

  window._monBuscaColabRender = function(query) {
    const resultsEl = document.getElementById('mon-busca-results');
    if (!resultsEl) return;

    if (!query || query.length < 2) {
      resultsEl.innerHTML = '<div id="mon-busca-empty" style="padding:20px;text-align:center;color:var(--mon-text-faint);font-size:12px;">Digite ao menos 2 letras para buscar</div>';
      return;
    }

    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const hits = [];

    // Varrer todas as ops e seus escalados em cache
    (typeof operations !== 'undefined' ? operations : []).forEach(op => {
      const d = apontCache[op.id];
      if (!d || d === 'loading') return;
      const escalados = d.escalados || [];
      const colaboradores = d.colaboradores || [];
      const apontadosCPF = new Set(colaboradores.map(c => c.cpf));
      const faltandoCPF  = new Set((d.faltasConfirmadas || []).map(f => f.cpf || f.chave));

      escalados.forEach(e => {
        const nomeNorm = (e.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if (!nomeNorm.includes(q)) return;

        let status = 'pendente';
        if (apontadosCPF.has(e.cpf)) status = 'apontado';
        else if (faltandoCPF.has(e.cpf)) status = 'faltando';

        hits.push({ op, nome: e.nome || '—', cpf: e.cpf, tipo: e.tipo || '', status });
      });
    });

    if (hits.length === 0) {
      resultsEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--mon-text-faint);font-size:12px;">Nenhum colaborador encontrado em operações carregadas</div>';
      return;
    }

    // Highlight match
    function hl(nome) {
      const idx = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').indexOf(q);
      if (idx < 0) return nome;
      return nome.slice(0, idx) + '<mark>' + nome.slice(idx, idx + query.length) + '</mark>' + nome.slice(idx + query.length);
    }

    const badgeClass = { apontado: '', faltando: 'faltando', pendente: 'pendente' };
    const badgeLabel = { apontado: '✅ Apontado', faltando: '❌ Faltando', pendente: '⏳ Escalado' };

    const html = hits.slice(0, 40).map((h, _hi) => {
      const op = h.op;
      const sigla = op.sigla || op.site || '—';
      const hora  = op.hora  || '—';
      const chave = op.chave || '—';
      const cpfLimpo = (h.cpf || '').replace(/[\s.\-]/g, '');
      const cpfHtml  = cpfLimpo
        ? `<span class="mon-busca-cpf mon-copiavel"
             onclick="event.stopPropagation();window._monCopiar('${cpfLimpo}','CPF')"
             title="Clique para copiar o CPF">🪪 ${h.cpf}</span>`
        : '';
      const nomeHtml = `<span class="mon-copiavel"
             onclick="event.stopPropagation();window._monCopiar('${h.nome}','${h.nome}')"
             title="Clique para copiar o nome">${hl(h.nome)}</span>`;
      return `<div class="mon-busca-item" data-hi="${_hi}" onclick="event.stopPropagation();window._monBuscaItemClick(${_hi})">
        <div class="mon-busca-item-info">
          <div class="mon-busca-nome">${nomeHtml}${h.tipo ? ' <span style="font-size:10px;opacity:.6">· '+h.tipo+'</span>' : ''}</div>
          <div class="mon-busca-op">${sigla} · ${chave} · ${hora} ${cpfHtml}</div>
        </div>
        <span class="mon-busca-badge ${badgeClass[h.status]}">${badgeLabel[h.status]}</span>
      </div>`;
    }).join('');
    window._monBuscaHitsAtual = hits;

    const extra = hits.length > 40 ? `<div style="padding:8px 14px;font-size:11px;color:var(--mon-text-faint);text-align:center">+${hits.length - 40} resultados — refine a busca</div>` : '';
    resultsEl.innerHTML = html + extra;
  };

  // ── fim busca colaborador ──────────────────────────────────────────────────

    // Cache de origem (v2/v3) da biometria, por bioUrl — evita refetch ao reabrir a lista.
    // Guarda a Promise (não só o valor final) para que chamadas concorrentes à mesma URL
    // (re-render do painel antes do fetch anterior responder) reusem a mesma requisição
    // em vez de disparar fetches duplicados que podiam nunca resolver no elemento certo.
    window._monBioOrigemCache = window._monBioOrigemCache || {};
    window._monBioOrigem = function(bioUrl, cb) {
      if (!bioUrl) { cb('—'); return; }
      let p = window._monBioOrigemCache[bioUrl];
      if (!p) {
        p = fetch('https://tsi-app.com/' + bioUrl, { credentials: 'include' })
          .then(r => r.text())
          .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const textoEl = doc.querySelector('.card-body, .modal-body, form, body');
            const texto = textoEl ? (textoEl.innerText || textoEl.textContent) : '';
            return (texto.match(/[Oo]rigem[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';
          })
          .catch(() => {
            // Não cacheia falha — permite tentar de novo na próxima renderização
            delete window._monBioOrigemCache[bioUrl];
            return '—';
          });
        window._monBioOrigemCache[bioUrl] = p;
      }
      p.then(cb);
    };

    window._monAbrirBio = function(bioUrl) {
    const m = document.getElementById('mon-bio-modal');
    if (!m) return;
    const body = document.getElementById('mon-bio-body');
    body.innerHTML = '<div id="mon-bio-loading">Carregando…</div>';
    const listaAberto  = document.getElementById('mon-lista-modal');
    const histDetAberto = document.getElementById('mon-hist-det-modal');
    const emModalAlto   = (listaAberto && listaAberto.classList.contains('open'))
                       || (histDetAberto && histDetAberto.style.display !== 'none');
    m.style.zIndex = emModalAlto ? '10000000' : '9999999';
    m.classList.add('open');

    fetch('https://tsi-app.com/' + bioUrl, { credentials: 'include' })
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Fotos — img 0 = biometria do momento, img 1 = cadastro facial
        const allImgs = [...doc.querySelectorAll('img')].filter(i => {
          const s = i.src || i.getAttribute('src') || '';
          return s.includes('cloudfront') || s.includes('facial') || s.includes('biometry') || s.includes('registry');
        });
        const fotoBio      = allImgs.find(i => (i.alt || '').toLowerCase().includes('biometria') || (i.src||'').includes('biometry')) ;
        const fotoCadastro = allImgs.find(i => i !== fotoBio);
        const fotoB = fotoBio?.src || fotoBio?.getAttribute('src') || '';
        const fotoC = fotoCadastro?.src || fotoCadastro?.getAttribute('src') || '';

        // Dados texto
        const textoEl = doc.querySelector('.card-body, .modal-body, form, body');
        const texto = textoEl ? textoEl.innerText || textoEl.textContent : '';

        // Lat/Lng
        const latMatch  = texto.match(/[Ll]atitude[:\s]+(-?\d+\.\d+)/);
        const lngMatch  = texto.match(/[Ll]ongitude[:\s]+(-?\d+\.\d+)/);
        const lat = latMatch?.[1] || '';
        const lng = lngMatch?.[1] || '';

        // Campos
        const chave  = (texto.match(/[Cc]have[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';
        const nome   = (texto.match(/[Nn]ome[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';
        const cpf    = (texto.match(/CPF[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';
        const dh     = (texto.match(/[Dd]ata\/[Hh]ora[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';
        const origem = (texto.match(/[Oo]rigem[:\s]+([^\n]+)/) || [])[1]?.trim() || '—';

        const photoHtml = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            ${fotoB ? `<img src="${fotoB}" onerror="this.style.display='none'" onclick="window._monZoomFoto(this.src,'Biometria')" style="width:110px;height:110px;object-fit:cover;border-radius:6px;border:2px solid var(--mon-border);cursor:zoom-in">` : '<div style="width:110px;height:110px;background:var(--mon-surface3);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--mon-text-faint);font-size:10px">Sem foto</div>'}
            <span style="font-size:10px;font-weight:600;color:var(--mon-text-dim)">Biometria</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            ${fotoC ? `<img src="${fotoC}" onerror="this.style.display='none'" onclick="window._monZoomFoto(this.src,'Cadastro Facial')" style="width:110px;height:110px;object-fit:cover;border-radius:6px;border:2px solid var(--mon-border);cursor:zoom-in">` : '<div style="width:110px;height:110px;background:var(--mon-surface3);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--mon-text-faint);font-size:10px">Sem cadastro</div>'}
            <span style="font-size:10px;font-weight:600;color:var(--mon-text-dim)">Cadastro Facial</span>
          </div>`;

        const mapHtml = lat && lng
          ? `<div style="position:relative;border-radius:6px;overflow:hidden;border:1px solid var(--mon-border);">
              <iframe
                src="https://www.google.com/maps?q=${lat},${lng}&t=k&z=18&output=embed"
                style="width:100%;height:240px;border:none;display:block;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Localizacao no Google Maps (satelite)">
              </iframe>
              <a href="https://www.google.com/maps?q=${lat},${lng}&t=k&z=18" target="_blank" rel="noopener"
                style="position:absolute;bottom:6px;right:6px;font-size:10px;font-weight:600;color:#fff;background:rgba(0,0,0,0.55);padding:2px 8px;border-radius:4px;text-decoration:none;backdrop-filter:blur(2px);">
                🗺️ Abrir no Maps
              </a>
            </div>
            <div style="text-align:center;font-size:10px;color:var(--mon-text-faint);margin-top:3px;">📍 ${lat}, ${lng}</div>`
          : `<div style="height:80px;display:flex;align-items:center;justify-content:center;color:var(--mon-text-faint);font-size:12px">Coordenadas não disponíveis</div>`;

        body.innerHTML = `
          <div id="mon-bio-photos">
            ${photoHtml}
            <div id="mon-bio-info">
              <div><strong>Chave:</strong> ${chave}</div>
              <div><strong>Nome:</strong> ${nome}</div>
              <div><strong>CPF:</strong> ${cpf}</div>
              <div style="margin-top:6px;padding:6px 10px;background:var(--mon-amber-bg);border:1px solid var(--mon-amber-border);border-radius:6px;font-size:13px;font-weight:700;color:var(--mon-amber)">🕐 ${dh}</div>
              <div style="margin-top:6px"><strong>Origem:</strong> ${origem}</div>
              ${lat ? `<div><strong>Lat:</strong> ${lat} &nbsp; <strong>Lng:</strong> ${lng}</div>` : ''}
            </div>
          </div>
          ${mapHtml}`;
      })
      .catch(() => {
        document.getElementById('mon-bio-body').innerHTML = '<div style="padding:20px;color:var(--mon-red);text-align:center">Erro ao carregar biometria</div>';
      });
  };

  // ── BADGES ────────────────────────────────────────────────────────────────────
  function colorForPct(pct) {
    if (pct >= 100) return 'var(--mon-green)';
    if (pct > 0)    return 'var(--mon-indigo)';
    return 'var(--mon-red)';
  }
  function colorForAptPct(pct) {
    if (pct >= 100) return 'var(--mon-green)';
    if (pct > 0)    return 'var(--mon-amber)';
    return 'var(--mon-text-faint)'; // zero apontados → neutro (nunca vermelho)
  }

  // Retorna escalado descontando as faltas confirmadas
  function escaladoEfetivo(d) {
    if (!d || d === 'loading') return 0;
    // Linhas riscadas (falta) já foram excluídas no parser da escala
    return d.escalado || 0;
  }

  function escaladoBadge(d, qtd) {
    if (!d || d === 'loading') return `<span class="mon-prog-pending">…/${qtd}</span>`;
    const esc = escaladoEfetivo(d);
    const pct = qtd > 0 ? Math.min(100, Math.round((esc / qtd) * 100)) : 0;
    const cor = colorForPct(pct);
    return `
      <div class="mon-prog-cell">
        <div class="mon-prog-num" style="color:${cor}">${esc}<span style="color:var(--mon-text-dim);font-size:12px;font-weight:500">/${qtd}</span></div>
        <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${pct}%;background:${cor}"></div></div>
      </div>`;
  }

  function apontBadge(d, qtd) {
    if (!d || d === 'loading') return `<span class="mon-prog-pending">…/${qtd}</span>`;
    const pct = qtd > 0 ? Math.min(100, Math.round((d.apontado / qtd) * 100)) : 0;
    const cor = colorForAptPct(pct);
    return `
      <div class="mon-prog-cell">
        <div class="mon-prog-num" style="color:${cor}">${d.apontado}<span style="color:var(--mon-text-dim);font-size:12px;font-weight:500">/${qtd}</span></div>
        <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${pct}%;background:${cor}"></div></div>
      </div>`;
  }

  function escalaEnviadaBadge(op) {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return '';
    if (d.todosConfirmados) return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#1d4ed8;background:rgba(29,78,216,0.09);border:1px solid rgba(29,78,216,0.28);border-radius:99px;padding:2px 7px;white-space:nowrap;" title="Report enviado"><i class="ti ti-circle-check" style="font-size:11px" aria-hidden="true"></i> Report enviado</span>';
    if (d.listaEnviada) return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#0a7c57;background:rgba(10,124,87,0.1);border:1px solid rgba(10,124,87,0.28);border-radius:99px;padding:2px 7px;white-space:nowrap;" title="Escala enviada"><i class="ti ti-circle-check" style="font-size:11px" aria-hidden="true"></i> Esc. enviada</span>';
    return '';
  }

  function escBarraBadge(escalado, solicitado, cor, bgCor) {
    const pct = solicitado > 0 ? Math.min(100, Math.round((escalado / solicitado) * 100)) : 0;
    return `<div style="display:inline-flex;align-items:center;gap:6px;max-width:100%">
      <div style="width:40px;height:6px;background:var(--mon-surface3);border-radius:3px;overflow:hidden;flex-shrink:0">
        <div style="height:100%;width:${pct}%;background:${cor};border-radius:3px"></div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${cor};background:${bgCor};padding:2px 8px;border-radius:99px;white-space:nowrap">${escalado}/${solicitado}</span>
    </div>`;
  }

  function situacaoBadge(d, op) {
    if (!d || d === 'loading') return '<span class="mon-status-badge neutro">—</span>';
    const escOk = d.escalado >= d.solicitado;
    const aptOk = d.apontado >= d.solicitado;
    if (d._soEscala) {
      if (d.escalado === 0) return '<span class="mon-status-badge nenhum">✗ Nenhum</span>';
      return escBarraBadge(d.escalado, d.solicitado, escOk ? 'var(--mon-blue)' : 'var(--mon-red)', escOk ? 'var(--mon-blue-bg)' : 'var(--mon-red-bg)');
    }
    if (aptOk && escOk) return '<span class="mon-status-badge completo">✓ Completo</span>';
    if (d.apontado === 0 && d.escalado === 0) return '<span class="mon-status-badge nenhum">✗ Nenhum</span>';
    const listaEnviada = d.listaEnviada || (op && apontCache[op.id] && apontCache[op.id].listaEnviada);
    if (d.apontado === 0 && (listaEnviada || escOk))
      return escBarraBadge(d.escalado, d.solicitado, escOk ? 'var(--mon-blue)' : 'var(--mon-red)', escOk ? 'var(--mon-blue-bg)' : 'var(--mon-red-bg)');
    if (d.apontado === 0)
      return escBarraBadge(d.escalado, d.solicitado, 'var(--mon-red)', 'var(--mon-red-bg)');
    return `<span class="mon-status-badge parcial">△ Apt ${d.apontado}/${d.solicitado}</span>`;
  }

  // ── MÉTRICAS ──────────────────────────────────────────────────────────────────
  // FIX: debounce aplicado — updateMetrics era chamada dezenas de vezes por segundo
  // (uma vez por fetch completado). Com 30 ops e MAX_CONCURRENT=10, isso causava
  // thrashing de DOM desnecessário. Debounce de 80ms agrupa todas as chamadas em uma só.
  let _updateMetricsTimer = null;
  function updateMetrics() {
    clearTimeout(_updateMetricsTimer);
    _updateMetricsTimer = setTimeout(_updateMetricsNow, 80);
  }
  function _updateMetricsNow() {
    let ok = 0, inc = 0, zero = 0;
    operations.forEach(op => {
      if (!naJanela(op)) return;
      const d = apontCache[op.id];
      if (!d || d === 'loading') return;
      if (d.apontado === 0) zero++;
      else if (d.apontado >= d.solicitado) ok++;
      else inc++;
    });
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    s('m-total', operations.length);
    s('m-ok',    ok);
    s('m-inc',   inc);
    s('m-zero',  zero);
    // Atualiza ticker se estiver minimizado
    if (minimized) tickerUpdate();
  }

  function setLive(state, label) {
    const el = document.getElementById('mon-live');
    if (!el) return;
    el.dataset.state = state;
    el.querySelector('span:last-child').textContent = label;
  }

  // ── VALES: executa o onclick real capturado do sistema ───────────────────────
  const _MON_REOPEN_VALES_KEY = '_monReopenVales';
  const _MON_REOPEN_HIST_KEY  = '_monReopenHist';
  const _MON_REOPEN_OP_KEY   = '_monReopenOp';
  const _MON_REOPEN_PANEL_KEY = '_monReopenPanel';
  const _MON_STATE_KEY        = '_monState'; // estado contínuo: sobrevive a qualquer reload do TSI

  // Salva estado atual do monitor (chamado sempre que algo muda)
  function _monSaveState() {
    try {
      const panel = document.getElementById('mon-panel');
      const panelOpen = panel && panel.style.display !== 'none';
      const opId = _monV2Selected ? (operations.find(o => o.chave === _monV2Selected) || {}).id || null : null;
      sessionStorage.setItem(_MON_STATE_KEY, JSON.stringify({
        panelOpen:  !!panelOpen,
        opId:       opId || null,
        page:       window.location.href,
        monPaginas: typeof monPaginas !== 'undefined' ? monPaginas : 1
      }));
    } catch(e) {}
  }
  window._monSaveState = _monSaveState;

  window._monExecAdtoOnclick = function(onclick) {
    try {
      const match = onclick.match(/loadiframe\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*\)/);
      if (match && typeof loadiframe === 'function') {
        loadiframe(match[1], match[2], parseInt(match[3]), match[4]);
        if (window.$) {
          window.$('#' + match[4]).modal('show');

          setTimeout(() => {
            const valesModal = document.getElementById('mon-vales-modal');
            const modalEl    = document.getElementById(match[4]);
            if (modalEl) {
              modalEl.style.zIndex = '10000001';
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.style.zIndex = '10000000';
            }
            if (valesModal) valesModal.style.zIndex = '9999990';

            // Salva o opId no beforeunload — só dispara se a página vai recarregar de verdade.
            // Não usar hidden.bs.modal para salvar porque ele dispara ANTES do reload.
            const box  = document.getElementById('mon-vales-box');
            const opId = box ? box.dataset.opId : null;

            const _salvarReopen = function() {
              if (opId) {
                try { sessionStorage.setItem(_MON_REOPEN_VALES_KEY, opId); } catch(e) {}
                // Usa dataset.fromHistDet do modal de vales (mais confiável que checar display,
                // pois o hist-det-modal é escondido quando vales abre)
                const valesM = document.getElementById('mon-vales-modal');
                const _fromHist = valesM && valesM.dataset.fromHistDet === '1';
                if (_fromHist) {
                  try { sessionStorage.setItem(_MON_REOPEN_HIST_KEY, opId); } catch(e) {}
                  try { sessionStorage.setItem('_monReopenHistView', '1'); } catch(e) {}
                }
              }
            };
            window.addEventListener('beforeunload', _salvarReopen);

            // Ao fechar o modal: restaura z-index e remove o listener
            window.$('#' + match[4]).one('hidden.bs.modal', function() {
              if (valesModal) valesModal.style.zIndex = '9999999';
              window.removeEventListener('beforeunload', _salvarReopen);
            });
          }, 80);
        }
        return;
      }
      (new Function(onclick))();
    } catch(e) {
      console.warn('[Monitor] Erro ao executar onclick ADTO:', e);
    }
  };

  // ── GERAR FALTA (abre modal nativo do sistema sobrepondo o monitor) ──────────
  const _MON_REOPEN_FALTA_KEY = '_monReopenFalta';

  window._monGerarFalta = function(onclick, opId) {
    try {
      // Salva opId para reabrir após o reload que o sistema faz ao confirmar a falta
      const _salvarReopen = function() {
        try { sessionStorage.setItem(_MON_REOPEN_OP_KEY,    JSON.stringify({ opId, page: window.location.href })); } catch(e) {}
        try { sessionStorage.setItem(_MON_REOPEN_PANEL_KEY, '1'); } catch(e) {}
      };
      window.addEventListener('beforeunload', _salvarReopen);

      // Tenta executar via loadiframe (padrão do sistema)
      const match = onclick.match(/loadiframe\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*\)/);
      if (match && typeof loadiframe === 'function') {
        loadiframe(match[1], match[2], parseInt(match[3]), match[4]);
        if (window.$) {
          window.$('#' + match[4]).modal('show');
          setTimeout(() => {
            const modalEl = document.getElementById(match[4]);
            if (modalEl) {
              modalEl.style.zIndex = '10000001';
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.style.zIndex = '10000000';
            }
            // Se o modal fechar sem reload (cancelou), remove o listener
            window.$('#' + match[4]).one('hidden.bs.modal', function() {
              window.removeEventListener('beforeunload', _salvarReopen);
            });
          }, 80);
        }
        return;
      }
      // Fallback: executa o onclick diretamente
      (new Function(onclick))();
    } catch(e) {
      console.warn('[Monitor] Erro ao executar Gerar Falta:', e);
    }
  };

  // ── ABRIR MODAL DE AÇÃO (apontados / escalados / faltando) ───────────────────
  // Injeta banner com nome da pessoa no modal nativo do TSI.
  // Funciona tanto em modais com iframe (escalaE, apontamentoE, pedidoAPTdel)
  // quanto em modais Bootstrap sem iframe (escalaF — "Gerar Falta").
  window._monInjetarNome = function(modalId, nome) {
    if (!nome) return;
    const BANNER_ID  = '_mon_nome_banner';
    const BANNER_CSS = [
      'position:sticky', 'top:0', 'z-index:9999',
      'background:#1e3a5f', 'color:#fff',
      'font-size:13px', 'font-weight:700',
      'padding:7px 14px', 'letter-spacing:0.01em',
      'border-bottom:2px solid #3b82f6',
      'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
      'display:flex', 'align-items:center', 'gap:8px',
      'margin-bottom:8px'
    ].join(';');
    const bannerHTML = '<span style="font-size:15px;line-height:1">\uD83D\uDC64</span><span>' + nome + '</span>';

    var tentarInjetar = function(tentativas) {
      var modalEl = document.getElementById(modalId);
      if (!modalEl) return;

      // Caso 1: modal tem iframe (escalaE, apontamentoE, pedidoAPTdel)
      var ifr = modalEl.querySelector('iframe');
      if (ifr) {
        var injetarNoIframe = function() {
          try {
            var iDoc = ifr.contentDocument || ifr.contentWindow.document;
            if (!iDoc || iDoc.readyState === 'loading') {
              if (tentativas > 0) setTimeout(function() { tentarInjetar(tentativas - 1); }, 200);
              return;
            }
            if (iDoc.getElementById(BANNER_ID)) return;
            var el = iDoc.createElement('div');
            el.id = BANNER_ID;
            el.style.cssText = BANNER_CSS;
            el.innerHTML = bannerHTML;
            if (iDoc.body) iDoc.body.insertBefore(el, iDoc.body.firstChild);
          } catch(e) {
            if (tentativas > 0) setTimeout(function() { tentarInjetar(tentativas - 1); }, 200);
          }
        };
        if (ifr.contentDocument && ifr.contentDocument.readyState !== 'loading') {
          injetarNoIframe();
        } else {
          ifr.addEventListener('load', injetarNoIframe, { once: true });
        }
        return;
      }

      // Caso 2: modal sem iframe — injeta direto no .modal-body (ex: Gerar Falta)
      var body = modalEl.querySelector('.modal-body');
      if (body) {
        if (body.querySelector('#' + BANNER_ID)) return;
        var el2 = document.createElement('div');
        el2.id = BANNER_ID;
        el2.style.cssText = BANNER_CSS;
        el2.innerHTML = bannerHTML;
        body.insertBefore(el2, body.firstChild);
        return;
      }

      // Nenhum dos dois encontrado ainda — retry
      if (tentativas > 0) setTimeout(function() { tentarInjetar(tentativas - 1); }, 150);
    };

    setTimeout(function() { tentarInjetar(15); }, 100);
  };

  // Abre modal nativo via loadiframe com z-index correto, reopen salvo e banner de nome.
  window._monOpenModal = function(url, titulo, largura, modalId, nome, opId) {
    if (typeof loadiframe !== 'function') return;

    // Captura URL do planejamento ANTES de qualquer ação
    var _paginaAtual = window.location.href;

    loadiframe(url, titulo, largura, modalId);

    if (window.$) {
      window.$('#' + modalId).modal('show');
      setTimeout(function() {
        var modalEl = document.getElementById(modalId);
        if (modalEl) modalEl.style.zIndex = '10000001';
        var backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.style.zIndex = '10000000';

        if (opId) {
          window.addEventListener('beforeunload', function _salvarReopen() {
            window._monSuppressStateSave = true;
            try {
              var _stRaw = sessionStorage.getItem(_MON_STATE_KEY);
              var _st = _stRaw ? JSON.parse(_stRaw) : {};
              _st.page = _paginaAtual;
              sessionStorage.setItem(_MON_STATE_KEY, JSON.stringify(_st));
            } catch(e) {}
            try { sessionStorage.setItem(_MON_REOPEN_OP_KEY, JSON.stringify({ opId: opId, page: _paginaAtual })); } catch(e) {}
            try { sessionStorage.setItem(_MON_REOPEN_PANEL_KEY, '1'); } catch(e) {}
            window.removeEventListener('beforeunload', _salvarReopen);
          });
        }
      }, 80);
    }

    if (nome) window._monInjetarNome(modalId, nome);
  };

  // Executa o loadiframe com parâmetros extraídos do onclick original.
  window._monOpenViaOnclick = function(onclick, nome, opId) {
    var m = onclick.match(/loadiframe\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*,\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*\)/);
    if (!m) return;
    window._monOpenModal(m[1], m[2], parseInt(m[3]), m[4], nome, opId);
  };

  // Abre URL derivada reutilizando tamanho/modalId do onclick original.
  window._monOpenDerivedUrl = function(newUrl, onclick, nome, opId) {
    var m = onclick.match(/loadiframe\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*,\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*\)/);
    if (!m) return;
    window._monOpenModal(newUrl, m[2], parseInt(m[3]), m[4], nome, opId);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────
  function renderTable() {
    const tbody = document.getElementById('mon-tbody');
    if (!tbody) return;
    // NÃO limpa tbody de uma vez — reconcilia por chave para evitar flickering

    // ── Contagens por filtro ─────────────────────────────────────────────────
    function countForFilter(f) {
      return operations.filter(op => {
        const d = apontCache[op.id];
        if (!d || d === 'loading') return f !== 'completo' && f !== 'parcial';
        const escOk = d.escalado >= d.solicitado;
        const aptOk = d.apontado >= d.solicitado;
        if (f === 'all')            return true;
        if (f === 'completo')       return aptOk && escOk;
        if (f === 'parcial')        return d.apontado > 0 && !aptOk;
        if (f === 'esc')            return d.apontado === 0 && escOk;
        if (f === 'esc_inc')        return d.escalado > 0 && !escOk;
        if (f === 'nenhum')         return d.apontado === 0 && d.escalado === 0;
        if (f === 'esc_inc_nenhum') return !escOk;
        return true;
      }).length;
    }
    const chipMap = {
      'all': '.mon-chip--all',
      'completo': '.mon-chip--completo',
      'parcial': '.mon-chip--parcial',
      'esc': '.mon-chip--esc',
      'esc_inc': '.mon-chip--esc-inc',
      'nenhum': '.mon-chip--nenhum',
      'esc_inc_nenhum': '.mon-chip--esc-inc-nenhum',
    };
    const chipLabels = {
      'all': 'Todos',
      'completo': '✓ Completo',
      'parcial': '△ Parcial',
      'esc': 'Esc. ok',
      'esc_inc': '⚠ Esc. inc.',
      'nenhum': '✗ Nenhum',
      'esc_inc_nenhum': '⚠+✗ Inc. + Nenhum',
    };
    Object.entries(chipMap).forEach(([f, sel]) => {
      const btn = document.querySelector(`#mon-status-chips ${sel}`);
      if (btn) {
        const n = countForFilter(f);
        btn.textContent = `${chipLabels[f]} ${n}`;
      }
    });

    // ────────────────────────────────────────────────────────────────────────

    if (operations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Nenhuma operação encontrada</td></tr>`;
      updateMetrics();
      return;
    }
    // Limpa placeholder caso exista
    const _placeholder = tbody.querySelector('tr td[colspan]');
    if (_placeholder && operations.length > 0) tbody.innerHTML = '';

    const visibleOps = getVisibleOps();

    // Atualiza contador no input placeholder
    const inp = document.getElementById('mon-filter-input');
    if (inp && !filterText) inp.placeholder = `Filtrar por chave, sigla ou site… (${operations.length} ops)`;

    if (visibleOps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Nenhuma operação corresponde ao filtro</td></tr>`;
      updateMetrics();
      return;
    }
    // Limpa placeholder caso exista antes de renderizar
    const _ph = tbody.querySelector('tr td[colspan]');
    if (_ph) tbody.innerHTML = '';

    visibleOps.forEach((op, idx) => {
      const isExp    = expanded.has(op.chave);
      const d        = apontCache[op.id];
      const emJanela = naJanela(op);
      const temDados = d && d !== 'loading';

      const _escEfetivo = temDados ? (d.escalado || 0) : 0;
      const escPct = temDados && op.qtd > 0 ? Math.min(100, Math.round((_escEfetivo / op.qtd) * 100)) : 0;
      const aptPct = temDados && emJanela && op.qtd > 0 ? Math.min(100, Math.round((d.apontado / op.qtd) * 100)) : 0;
      const escCor = colorForPct(escPct);
      const aptCor = colorForAptPct(aptPct);

      // Highlight do texto filtrado
      const hl = (txt) => {
        if (!filterText) return txt;
        const q = filterText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return txt.replace(new RegExp('(' + q + ')', 'gi'), '<mark style="background:rgba(129,140,248,0.3);color:var(--mon-indigo);border-radius:2px">$1</mark>');
      };

      // Borda lateral de status
      const _nenhum  = temDados && d.escalado === 0 && d.apontado === 0;
      const _escOk   = temDados && d.escalado >= d.solicitado;
      const _aptOk   = temDados && d.apontado >= d.solicitado;
      const _bordaCor = !temDados ? 'transparent'
        : (_nenhum)          ? 'var(--mon-red)'
        : (_aptOk && _escOk) ? 'var(--mon-green)'
        : (!_escOk)          ? 'var(--mon-amber)'
        : 'var(--mon-blue)';

      // ── HIGHLIGHT DE LINHA ──────────────────────────────────────────────────
      // Verde: apt >= sol
      // Vermelho grave: nenhum escalado, falta < 1h30 (op.hora)
      // Vermelho: escala incompleta, falta < 1h30
      const _hlVerde = temDados && d.solicitado > 0 && d.apontado >= d.solicitado;

      const _falta1h30 = (() => {
        if (!op.hora) return false;
        const [h, m] = op.hora.split(':').map(Number);
        if (isNaN(h)) return false;
        const agora = new Date();
        const agoraMin = agora.getHours() * 60 + agora.getMinutes();
        const opMin = h * 60 + (m || 0);
        let diff = opMin - agoraMin;
        if (diff < -180) diff += 1440;
        return diff <= 90;
      })();

      const _escVal = op.escAtual >= 0 ? op.escAtual : (temDados ? (d.escalado || 0) : -1);
      const _solVal = op.qtd || (temDados ? (d.solicitado || 0) : 0);

      const _hlNenhum = !_hlVerde && _falta1h30 && _solVal > 0 && _escVal === 0;
      const _hlInc    = !_hlVerde && _falta1h30 && _solVal > 0 && _escVal > 0 && _escVal < _solVal;

      const tr = document.createElement('tr');
      tr.className = 'op-row' + (isExp ? ' is-expanded' : '');
      tr.dataset.chave = op.chave;
      tr.style.borderLeft = '3px solid ' + _bordaCor;

      if (_hlVerde) {
        tr.classList.add('hl-verde');
        tr.dataset.hlBg = 'rgba(10,124,87,0.13)';
        tr.style.borderLeft = '4px solid #0a7c57';
        tr.style.boxShadow  = 'inset 0 0 0 1px rgba(10,124,87,0.18)';
      } else if (_hlNenhum) {
        tr.dataset.hlBg = 'linear-gradient(90deg,rgba(127,0,0,0.07) 0%,rgba(185,28,28,0.02) 100%)';
        tr.style.borderLeft = '4px solid #7f0000';
      } else if (_hlInc) {
        tr.dataset.hlBg = 'linear-gradient(90deg,rgba(185,28,28,0.05) 0%,rgba(185,28,28,0.01) 100%)';
        tr.style.borderLeft = '3px solid var(--mon-red)';
      }

      tr.innerHTML = `
        <td style="position:relative"><div style="display:flex;align-items:center;gap:5px;"><span class="mon-chave" title="${op.chave}" style="display:inline;min-width:0;overflow:hidden;text-overflow:ellipsis;">${hl(op.chave)}</span>${(() => { const _bkt = (typeof _monBucketForOp === 'function') ? _monBucketForOp(op) : ''; const _reportEnv = (apontCache[op.id] && apontCache[op.id] !== 'loading' && apontCache[op.id].todosConfirmados === true); return (_bkt === 'running' && !_reportEnv) ? '<span class="mon-live-badge" title="Operação em andamento"><span class="lr"></span><span class="lc"></span>AO VIVO</span>' : (_bkt === 'now' && !_reportEnv) ? '<span class="mon-r-soon-badge">Em breve</span>' : ''; })()}${(() => { const _d2 = apontCache[op.id]; const _esc2 = _d2 && _d2 !== 'loading' ? (_d2.escalados || []) : null; const _temSnap2 = !!escaladosSnapshot[op.id]; const _diff2 = _esc2 && (_d2.listaEnviada || _temSnap2) ? snapDiff(op.id, _esc2) : null; return (_diff2 && !_diff2._soSaiu) ? '<span class="mon-esc-change-dot" style="margin-left:5px;vertical-align:middle" title="Alguém entrou na escala desde o último envio"></span>' : ''; })()}</div><span class="mon-obs-wrap" style="position:absolute;right:-10px;top:50%;transform:translateY(-50%)"><button class="mon-obs-btn" onclick="event.stopPropagation();window._monAbrirObs('${op.id}',this)" title="Observações">💬</button></span></td>
        <td><span class="mon-sigla">${hl(op.sigla)}</span></td>
        <td>
          ${op.id
            ? (temDados
                ? `<div class="mon-prog-cell">
                     <div class="mon-prog-num" style="color:${escCor}">${_escEfetivo}<span style="color:var(--mon-text-dim);font-size:12px;font-weight:500">/${op.qtd}</span></div>
                     <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${escPct}%;background:${escCor}"></div></div>
                   </div>`
                : `<span class="mon-prog-pending">…/${op.qtd}</span>`)
            : '<span class="mon-prog-na">—</span>'}
        </td>
        <td>
          ${emJanela
            ? (temDados
                ? `<div class="mon-prog-cell">
                     <div class="mon-prog-num" style="color:${aptCor}">${d.apontado}<span style="color:var(--mon-text-dim);font-size:12px;font-weight:500">/${op.qtd}</span></div>
                     <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${aptPct}%;background:${aptCor}"></div></div>
                   </div>`
                : `<span class="mon-prog-pending">…/${op.qtd}</span>`)
            : '<span class="mon-prog-na">—</span>'}
        </td>
        <td><span class="mon-hora">${op.hora}</span></td>
        <td>${(() => {
          // Líderes: mesma prioridade usada no relatório — d.lideres (escala) > op.liderCompleto/op.lider
          const _lds = (temDados && d.lideres && d.lideres.length > 0)
            ? d.lideres
            : (op.liderCompleto ? [op.liderCompleto] : (op.lider ? [op.lider] : []));
          if (_lds.length === 0) return '<span class="mon-lider">—</span>';
          if (_lds.length === 1) return `<span class="mon-lider">${hl(_lds[0])}</span>`;
          const _primeiros = _lds.map(l => (l || '').split(' ')[0]);
          return `<span class="mon-lider mon-lider-multi" title="${_lds.join(', ')}">${_primeiros.map(n => hl(n)).join('<span class="mon-lider-sep">·</span>')}</span>`;
        })()}</td>
        <td style="text-align:center">
          ${situacaoBadge(temDados ? d : null, op)}
        </td>
        <td style="padding-right:4px">${escalaEnviadaBadge(op)}</td>
      `;
      // injeta vars de obs no template (já renderizado acima via innerHTML)
      // precisamos reprocessar o botão de obs com os dados corretos
      const _obsData      = window._monObsCache && window._monObsCache[op.id];
      const _obsReportEnv = temDados && d.todosConfirmados;
      const obsBtn = tr.querySelector('.mon-obs-btn');
      const obsWrap = tr.querySelector('.mon-obs-wrap');
      if (obsBtn) {
        if (_obsData && _obsData.texto && !_obsReportEnv) {
          obsBtn.classList.add('has-obs');
        } else {
          obsBtn.classList.remove('has-obs');
        }
      }
      // Badge vermelho se tem obs e ainda não foi vista
      if (obsWrap) {
        const jaViu = _monObsVistas.has(op.id);
        const temObs = _obsData && _obsData.texto && !_obsReportEnv;
        const badge = obsWrap.querySelector('.mon-obs-badge');
        if (temObs && !jaViu) {
          if (!badge) {
            const b = document.createElement('span');
            b.className = 'mon-obs-badge';
            obsWrap.appendChild(b);
          }
        } else {
          if (badge) badge.remove();
        }
      }
      tr.onclick = () => toggleRow(op, idx);
      if (tr.dataset.hlBg) {
        tr.querySelectorAll('td').forEach(td => { td.style.background = tr.dataset.hlBg; });
      }

      // Reconciliação: reusa tr existente ou insere nova sem destruir tudo
      const existingTr = tbody.querySelector('tr.op-row[data-chave="' + op.chave + '"]');
      if (existingTr) {
        // Atualiza conteúdo sem remover o elemento (evita flickering)
        existingTr.className    = tr.className;
        existingTr.style.cssText = tr.style.cssText;
        existingTr.dataset.hlBg  = tr.dataset.hlBg || '';
        existingTr.innerHTML     = tr.innerHTML;
        existingTr.onclick       = tr.onclick;
        if (tr.dataset.hlBg) {
          existingTr.querySelectorAll('td').forEach(td => { td.style.background = tr.dataset.hlBg; });
        }
        // Reposiciona se a ordem mudou
        const expectedPrev = idx === 0 ? null : tbody.querySelector('tr.op-row[data-chave="' + visibleOps[idx-1].chave + '"]');
        const actualPrev = existingTr.previousElementSibling
          ? (existingTr.previousElementSibling.classList.contains('op-detail')
              ? existingTr.previousElementSibling.previousElementSibling
              : existingTr.previousElementSibling)
          : null;
        if (actualPrev !== expectedPrev) {
          if (expectedPrev) expectedPrev.after(existingTr);
          else tbody.prepend(existingTr);
        }
      } else {
        // Nova op — insere na posição correta
        const prevOp = idx === 0 ? null : tbody.querySelector('tr.op-row[data-chave="' + visibleOps[idx-1].chave + '"]');
        if (prevOp) {
          const afterPrev = prevOp.nextElementSibling && prevOp.nextElementSibling.classList.contains('op-detail')
            ? prevOp.nextElementSibling : prevOp;
          afterPrev.after(tr);
        } else {
          tbody.prepend(tr);
        }
      }

      // Linha de detalhe expandida
      if (isExp) {
        let det = tbody.querySelector('#det-' + op.chave);
        if (!det) {
          det = document.createElement('tr');
          det.id = 'det-' + op.chave;
          det.className = 'op-detail';
          const opTr = tbody.querySelector('tr.op-row[data-chave="' + op.chave + '"]');
          if (opTr) opTr.after(det);
          else tbody.appendChild(det);
        }
        det.innerHTML = `<td colspan="10"><div class="mon-detail-inner">${renderDetail(op)}</div></td>`;
      } else {
        const det = tbody.querySelector('#det-' + op.chave);
        if (det) det.remove();
      }
    });

    // Remove linhas de ops que não estão mais no visibleOps
    const visibleChaves = new Set(visibleOps.map(o => o.chave));
    [...tbody.querySelectorAll('tr.op-row')].forEach(tr => {
      if (!visibleChaves.has(tr.dataset.chave)) {
        const det = tbody.querySelector('#det-' + tr.dataset.chave);
        if (det) det.remove();
        tr.remove();
      }
    });

    // Se tbody estava vazio antes (primeiro render), força innerHTML para limpar qualquer placeholder
    if (visibleOps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--mon-text-faint);font-size:13px">Nenhuma operação corresponde ao filtro</td></tr>`;
    }

    updateMetrics();
    _monSyncBotaoVoltar();
    // Restaura bolinhas após re-render — garante snap carregado e aguarda fetches
    snapEnsureLoaded(() => setTimeout(_updateSnapDots, 300));
  }

  function renderDetail(op) {
    const d = apontCache[op.id];
    if (!d || d === 'loading') return `
      <div class="mon-loading-detail">
        <div class="mon-loading-spinner"></div>
        Carregando dados…
      </div>`;

    const _escEfetivo = d.escalado || 0;
    const escPct = op.qtd > 0 ? Math.min(100, Math.round((_escEfetivo / op.qtd) * 100)) : 0;
    const aptPct = op.qtd > 0 ? Math.min(100, Math.round((d.apontado / op.qtd) * 100)) : 0;
    const escCor = colorForPct(escPct);
    const aptCor = colorForAptPct(aptPct);

    const chaveEsc = op.chave.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const _idSuffix = op._fromHist ? '_h' : '';

    let html = `
      <div class="mon-detail-header">
        <span class="mon-key-chip">${op.chave}</span>
        <button class="mon-copy-btn"
          onclick="event.stopPropagation();(function(btn){navigator.clipboard.writeText('${chaveEsc}').then(()=>{btn.textContent='✓ Copiado';btn.style.color='var(--mon-green)';setTimeout(()=>{btn.textContent='⎘ Copiar chave';btn.style.color='';},1800)}).catch(()=>{btn.textContent='✗ Erro';setTimeout(()=>{btn.textContent='⎘ Copiar chave';btn.style.color='';},1800)})})(this)">
          ⎘ Copiar chave
        </button>
        <button class="mon-copy-btn mon-open-btn" onclick="event.stopPropagation();(function(){var _doOpen=function(){if(typeof loadiframe==='function'){loadiframe('planejamento-operacional-edit${op.id}_3','Editar Planejamento',570,'modal1500');if(window.$){$('#modal1500').modal('show');setTimeout(function(){var backdrop=document.querySelector('.modal-backdrop');if(backdrop)backdrop.style.zIndex='9999990';var modalEl=document.getElementById('modal1500');if(modalEl)modalEl.style.zIndex='9999991';},80);}}};var el=window._monLinkEls&&window._monLinkEls['${op.id}'];if(el){_doOpen();}else{_doOpen();}var _p=document.getElementById('mon-panel');if(window._monMinimize&&_p&&_p.dataset.minimized!=='1')window._monMinimize();var _hd=document.getElementById('mon-hist-det-modal');if(_hd)_hd.style.display='none';})()">🔎 Abrir OP</button>
      </div>

      <div id="mon-conv-wrap-${op.id}${_idSuffix}" style="margin-bottom:10px;border:1px solid var(--mon-border);border-radius:8px;overflow:hidden;">
        <div onclick="event.stopPropagation();window._monToggleConv('${op.id}','${_idSuffix}')"
          style="display:flex;align-items:center;gap:7px;padding:6px 12px;cursor:pointer;user-select:none;background:var(--mon-surface);transition:background 0.15s"
          onmouseover="this.style.background='var(--mon-surface2)'" onmouseout="this.style.background='var(--mon-surface)'">
          <span style="font-size:12px;line-height:1">👥</span>
          <span style="font-size:11px;font-weight:700;color:var(--mon-text-dim);letter-spacing:0.2px">CONVOCAÇÃO</span>
          <span style="font-size:10px;color:var(--mon-text-faint);font-weight:500">Advisor · Qtde · Extra</span>
          <span id="mon-conv-arr-${op.id}${_idSuffix}" style="margin-left:auto;font-size:10px;color:var(--mon-text-faint);transition:transform 0.2s">▼</span>
        </div>
        <div id="mon-conv-body-${op.id}${_idSuffix}" style="display:none;border-top:1px solid var(--mon-border)"></div>
      </div>

      <div id="mon-anot-wrap-${op.id}${_idSuffix}" style="margin-bottom:10px;border:1px solid var(--mon-border);border-radius:8px;overflow:hidden;">
        <div onclick="event.stopPropagation();window._monToggleAnot('${op.id}','${_idSuffix}')"
          style="display:flex;align-items:center;gap:7px;padding:6px 12px;cursor:pointer;user-select:none;background:var(--mon-surface);transition:background 0.15s"
          onmouseover="this.style.background='var(--mon-surface2)'" onmouseout="this.style.background='var(--mon-surface)'">
          <span style="font-size:12px;line-height:1">📝</span>
          <span style="font-size:11px;font-weight:700;color:var(--mon-text-dim);letter-spacing:0.2px">ANOTAÇÕES</span>
          <span style="font-size:10px;color:var(--mon-text-faint);font-weight:500">Planejamento</span>
          <span id="mon-anot-arr-${op.id}${_idSuffix}" style="margin-left:auto;font-size:10px;color:var(--mon-text-faint);transition:transform 0.2s">▼</span>
        </div>
        <div id="mon-anot-body-${op.id}${_idSuffix}" style="display:none;border-top:1px solid var(--mon-border)"></div>
      </div>

      <div class="mon-stat-card" style="display:grid;grid-template-columns:1fr 1px 1fr;margin-bottom:14px;padding:0;overflow:hidden;">
        <div style="padding:13px 15px;">
          <div class="mon-stat-card-header">
            <span class="mon-stat-card-label">Escalados</span>
            <span style="font-size:10px;font-weight:600;color:${escCor};background:${escPct>=100?'var(--mon-blue-bg)':'var(--mon-surface3)'};padding:1px 7px;border-radius:99px">${escPct}%</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:3px;margin-bottom:8px">
            <span class="mon-stat-card-num" style="color:${escCor}">${_escEfetivo}</span>
            <span class="mon-stat-card-sub">/${op.qtd}</span>
          </div>
          <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${escPct}%;background:${escCor}"></div></div>
        </div>
        <div style="background:var(--mon-border);"></div>
        <div style="padding:13px 15px;">
          <div class="mon-stat-card-header">
            <span class="mon-stat-card-label">Apontados</span>
            <span style="font-size:10px;font-weight:600;color:${aptCor};background:${aptPct>=100?'var(--mon-green-bg)':'var(--mon-surface3)'};padding:1px 7px;border-radius:99px">${aptPct}%</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:3px;margin-bottom:8px">
            <span class="mon-stat-card-num" style="color:${aptCor}">${d.apontado}</span>
            <span class="mon-stat-card-sub">/${op.qtd}</span>
          </div>
          <div class="mon-prog-bar"><div class="mon-prog-fill" style="--bar-w:${aptPct}%;background:${aptCor}"></div></div>
        </div>
      </div>
    `;


    const pdfLinks = d.pdfLinks || [], xlsLinks = d.xlsLinks || [];
    const qtdApt = d.apontado || 0;
    const temEscala = d.escalado > 0;
    const escalaAtualizada = d.listaEnviada === true;
    const escalaPrevia     = !escalaAtualizada && d.escalado > 0 && d.escalado < (d.solicitado || 0);

    // Para ops do histórico: usa closest() para evitar getElementById com IDs potencialmente duplicados
    // e não registra no _monDropListeners (que é limpo pelo modal normal no re-render)
    const _mkToggle = op._fromHist
      ? (id, otherId) => `event.stopPropagation();(function(btn){var m=btn.closest('.mon-xls-menu');if(!m)return;var opening=!m.classList.contains('open');if(opening){var actions=m.closest('.mon-actions');if(actions)actions.querySelectorAll('.mon-xls-menu.open').forEach(function(x){if(x!==m)x.classList.remove('open');});}m.classList.toggle('open');if(opening){var close=function(ev){if(!m.contains(ev.target)){m.classList.remove('open');document.removeEventListener('click',close,true);}};setTimeout(function(){document.addEventListener('click',close,true);},0);};})(this)`
      // FIX: adiciona null-guard em m para quando o modal é re-renderizado com dropdown aberto
      : (id, otherId) => `event.stopPropagation();(function(){var m=document.getElementById('${id}');if(!m)return;var opening=!m.classList.contains('open');if(opening&&'${otherId}'){var o=document.getElementById('${otherId}');if(o)o.classList.remove('open');}m.classList.toggle('open');var close=function(ev){if(!m.contains(ev.target)){m.classList.remove('open');document.removeEventListener('click',close);}};if(opening)setTimeout(function(){document.addEventListener('click',close);if(window._monRegisterDropClose)window._monRegisterDropClose(close);},0);})()`;
    const _mkClose = op._fromHist
      ? (id) => `(function(btn){var m=btn.closest('.mon-xls-menu');if(m)m.classList.remove('open');})(this);`
      // FIX: null-guard — getElementById pode retornar null se modal foi re-renderizado; sem o guard a ação seguinte não executa
      : (id) => `(function(){var _m=document.getElementById('${id}');if(_m)_m.classList.remove('open');})();`;

    // ops do histórico ganham sufixo _h para evitar IDs duplicados com o modal normal
    const menuReportId  = `report-menu-${op.id}${_idSuffix}`;
    const menuEscalaId  = `escala-menu-${op.id}${_idSuffix}`;
    const labelWppReport = d.todosConfirmados ? 'Report WhatsApp (atualizado)' : 'Report WhatsApp';
    const gmailSvg = '<svg width="13" height="10" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;flex-shrink:0"><path d="M0 3.6L12 11.4L24 3.6V16.8C24 17.46 23.46 18 22.8 18H1.2C0.54 18 0 17.46 0 16.8V3.6Z" fill="#EA4335"/><path d="M0 3.6L12 11.4L24 3.6" fill="#FBBC05"/><path d="M0 1.2C0 0.54 0.54 0 1.2 0H22.8C23.46 0 24 0.54 24 1.2V3.6L12 11.4L0 3.6V1.2Z" fill="#4285F4"/><path d="M0 3.6V1.2C0 0.54 0.54 0 1.2 0L12 7.8L0 3.6Z" fill="#34A853"/><path d="M24 3.6V1.2C24 0.54 23.46 0 22.8 0L12 7.8L24 3.6Z" fill="#EA4335"/></svg>';

    html += `<div class="mon-actions">

      <!-- REPORT -->
      <div class="mon-xls-menu" id="${menuReportId}">
        <button class="mon-send-btn mon-menu-btn--report" onclick="${_mkToggle(menuReportId, menuEscalaId)}">📋 Report ▾</button>
        <div class="mon-xls-dropdown">
          <div class="mon-drop-group-label">Confirmação</div>
          <button class="mon-drop-item mon-drop-item--confirm" onclick="event.stopPropagation();${_mkClose(menuReportId)}if(confirm('Confirmar envio de report?'))window._monEnviarReport('${op.id}',this)" title="Preenche P1–P11 e coloca ${qtdApt} apontamentos no P10">✅ Report enviado</button>
          <div class="mon-drop-group-label">Gerar</div>
          <button class="mon-drop-item" onclick="event.stopPropagation();${_mkClose(menuReportId)}window._monGerarRelatorio('${op.id}',this)">📲 ${labelWppReport}</button>
          <button class="mon-drop-item" onclick="event.stopPropagation();${_mkClose(menuReportId)}window._monPrintApontamentos('${op.id}',this)">🖨️ Print apontamentos</button>
        </div>
      </div>

      <!-- ESCALA -->
      ${temEscala ? `<div class="mon-xls-menu" id="${menuEscalaId}">
        <button class="mon-send-btn mon-menu-btn--escala" onclick="${_mkToggle(menuEscalaId, menuReportId)}">📋 Escala ▾</button>
        <div class="mon-xls-dropdown">
          <div class="mon-drop-group-label">Confirmação</div>
          <button class="mon-drop-item mon-drop-item--confirm" onclick="event.stopPropagation();${_mkClose(menuEscalaId)}if(confirm('Confirmar envio de escala?'))window._monEnviarEscala('${op.id}',this)">✅ Escala enviada</button>
          <div class="mon-drop-group-label">Comunicação</div>
          <button class="mon-drop-item" onclick="event.stopPropagation();${_mkClose(menuEscalaId)}window._monGerarMsgEscala('${op.id}',this)">💬 ${escalaAtualizada ? 'Msg escala (atualizada)' : escalaPrevia ? 'Msg prévia WA' : 'Msg escala WA'}</button>
          <button class="mon-drop-item" onclick="event.stopPropagation();${_mkClose(menuEscalaId)}window._monAbrirGmailEscala('${op.id}',this)" onmouseenter="(function(btn){var emails=window._monEmailsDaOpById&&window._monEmailsDaOpById('${op.id}');btn.title=emails&&emails.length?'Para: '+emails.join(', '):'⚠ Nenhum destinatário cadastrado';})(this)">${gmailSvg} ${escalaAtualizada ? 'Gmail (atualizado)' : 'Gmail escala'}</button>
        </div>
      </div>` : ''}

      <!-- LISTA P/ ASSINATURAS (intocado) -->
      ${pdfLinks.length === 1 ? `<button class="mon-dl-btn" onmouseenter="(function(btn){var t=window._monPdfLabelByIdx&&window._monPdfLabelByIdx('${op.id}',0);if(t)btn.title=t;})(this)" onclick="event.stopPropagation();window._monAbrirPdf('${op.id}',0)">📄 Lista p/ Assinaturas</button>` : ''}
      ${pdfLinks.length > 1 ? `<div class="mon-xls-menu" id="pdf-menu-${op.id}${_idSuffix}"><button class="mon-dl-btn" title="${pdfLinks.map((l,i)=>(i+1)+'. '+(l.label||'Líder '+(i+1))).join('&#10;')}" onclick="event.stopPropagation();var m=document.getElementById('pdf-menu-${op.id}${_idSuffix}');if(m){m.classList.toggle('open');var close=function(ev){if(!m.contains(ev.target)){m.classList.remove('open');document.removeEventListener('click',close);}};setTimeout(function(){document.addEventListener('click',close);if(window._monRegisterDropClose)window._monRegisterDropClose(close);},0);}">📄 Assinaturas (${pdfLinks.length}) ▾</button><div class="mon-xls-dropdown">${pdfLinks.map((l,i)=>`<button class="mon-drop-item" onclick="event.stopPropagation();(function(){var _pm=document.getElementById('pdf-menu-${op.id}${_idSuffix}');if(_pm)_pm.classList.remove('open');})();window._monAbrirPdf('${op.id}',${i})">📄 ${l.label||'Assinatura'}</button>`).join('')}<button class="mon-drop-item" style="border-top:1px solid var(--mon-border);margin-top:3px;padding-top:9px;color:var(--mon-accent);font-weight:600;" onclick="event.stopPropagation();(function(){var _pm=document.getElementById('pdf-menu-${op.id}${_idSuffix}');if(_pm)_pm.classList.remove('open');})();window._monMergePdfAssinaturas('${op.id}','${op.chave}',this)">📎 Mesclar tudo (${pdfLinks.length} PDFs)</button></div></div>` : ''}

      <!-- XLS (intocado) -->
      ${xlsLinks.length > 0 ? `<div class="mon-xls-menu" id="xls-menu-${op.id}${_idSuffix}"><button class="mon-dl-btn" onclick="event.stopPropagation();var m=document.getElementById('xls-menu-${op.id}${_idSuffix}');if(m){m.classList.toggle('open');var close=function(ev){if(!m.contains(ev.target)){m.classList.remove('open');document.removeEventListener('click',close);}};setTimeout(function(){document.addEventListener('click',close);if(window._monRegisterDropClose)window._monRegisterDropClose(close);},0);}">📊 XLS ▾</button><div class="mon-xls-dropdown">${xlsLinks.map(l=>`<a href="https://tsi-app.com/${l.href}" target="_blank" onclick="event.stopPropagation();(function(){var _xm=document.getElementById('xls-menu-${op.id}${_idSuffix}');if(_xm)_xm.classList.remove('open');})();">${l.label}</a>`).join('')}</div></div>` : ''}

    </div>`;

    // ── BOTÃO VALES (antes das listas) ────────────────────────────────────────
    const valesTop = d.vales || [];
    if (valesTop.length > 0) {
      const opIdTop = op.id;
      const trGeradosTop  = valesTop.filter(v => v.adtoTr && v.adtoTr.op).length;
      const alGeradosTop  = valesTop.filter(v => v.adtoAl && v.adtoAl.op).length;
      const trPagosTop    = valesTop.filter(v => v.adtoTr && v.adtoTr.op && v.adtoTr.pago).length;
      const alPagosTop    = valesTop.filter(v => v.adtoAl && v.adtoAl.op && v.adtoAl.pago).length;

      const badgeTrTop = trGeradosTop > 0
        ? `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:${trPagosTop===trGeradosTop?'var(--mon-green-bg)':'var(--mon-amber-bg)'};color:${trPagosTop===trGeradosTop?'var(--mon-green)':'var(--mon-amber)'};border:1px solid ${trPagosTop===trGeradosTop?'var(--mon-green-border)':'var(--mon-amber-border)'}">TR ${trPagosTop}/${trGeradosTop}</span>`
        : `<span style="font-size:10px;color:var(--mon-text-faint)">TR —</span>`;
      const badgeAlTop = alGeradosTop > 0
        ? `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:${alPagosTop===alGeradosTop?'var(--mon-green-bg)':'var(--mon-amber-bg)'};color:${alPagosTop===alGeradosTop?'var(--mon-green)':'var(--mon-amber)'};border:1px solid ${alPagosTop===alGeradosTop?'var(--mon-green-border)':'var(--mon-amber-border)'}">AL ${alPagosTop}/${alGeradosTop}</span>`
        : `<span style="font-size:10px;color:var(--mon-text-faint)">AL —</span>`;

      const valesJsonTop = JSON.stringify(valesTop).replace(/"/g, '&quot;');
      const opLabelTop = (op.sigla || '') + (op.site ? ' · ' + op.site : '') + (op.hora ? ' · ' + op.hora : '');

      html += `
      <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <button class="mon-send-btn" onclick="event.stopPropagation();window._monAbrirVales('${opIdTop}',this.dataset.vales,'${opLabelTop.replace(/'/g,"\\'")}');" data-vales="${valesJsonTop}"
          style="display:inline-flex;align-items:center;gap:7px;padding:5px 11px;">
          <span style="font-size:12px;line-height:1">💳</span>
          <span style="font-size:11.5px;font-weight:600;color:var(--mon-text)">Vales</span>
          <span style="width:1px;height:12px;background:var(--mon-border2);margin:0 1px"></span>
          ${badgeTrTop}
          ${badgeAlTop}
        </button>
        ${(() => {
          // Pega advisors únicos direto dos escalados (quem aparece na lista de assinatura)
          const _escAdv = (d.escalados || [])
            .map(e => (e.advisor || '').trim())
            .filter(Boolean);
          const _lids = [...new Set(_escAdv)];
          if (!_lids.length) return '';
          const _opId = op.id;
          if (_lids.length === 1) {
            const _n = _lids[0];
            return `<button onclick="event.stopPropagation();window._monWppAbrirModal('${_opId}','${_n.replace(/'/g,"\\'")}')"
              style="display:inline-flex;align-items:center;gap:5px;padding:5px 11px;background:none;border:1.5px solid #25D366;border-radius:7px;cursor:pointer;color:#25D366;font-size:11.5px;font-weight:600;transition:background 0.15s"
              onmouseenter="this.style.background='rgba(37,211,102,0.08)'" onmouseleave="this.style.background='none'">
              📲 ${_n}
            </button>`;
          }
          const _ddId = 'wpp-dd-' + _opId;
          const _items = _lids.map(n =>
            `<div onclick="event.stopPropagation();document.getElementById('${_ddId}').style.display='none';window._monWppAbrirModal('${_opId}','${n.replace(/'/g,"\\'")}')"
              style="padding:7px 14px;font-size:12px;cursor:pointer;white-space:nowrap;color:var(--mon-text,#1a1a2e)"
              onmouseenter="this.style.background='rgba(37,211,102,0.10)'" onmouseleave="this.style.background='none'">
              📲 ${n}
            </div>`
          ).join('');
          return `<div style="position:relative">
            <button onclick="event.stopPropagation();var dd=document.getElementById('${_ddId}');dd.style.display=dd.style.display==='block'?'none':'block'"
              style="display:inline-flex;align-items:center;gap:5px;padding:5px 11px;background:none;border:1.5px solid #25D366;border-radius:7px;cursor:pointer;color:#25D366;font-size:11.5px;font-weight:600;transition:background 0.15s"
              onmouseenter="this.style.background='rgba(37,211,102,0.08)'" onmouseleave="this.style.background='none'">
              📲 Líderes ▾
            </button>
            <div id="${_ddId}" style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:var(--mon-surface,#fff);border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.13);z-index:9999;min-width:200px;overflow:hidden">
              ${_items}
            </div>
          </div>`;
        })()}
      </div>`;
    }

    const faltando = d.faltando || [];
    const colab = d.colaboradores || [];

    if (colab.length === 0 && faltando.length === 0) {
      html += '<div class="mon-empty-detail">Sem dados de escala/apontamento.</div>';
    } else {
      html += `<div class="mon-lists-grid">`;

      // ── APONTADOS (esquerda) ──
      html += `
        <div class="mon-list-panel mon-list-panel--ok">
          <div class="mon-list-panel-header" onclick="event.stopPropagation();window._monAbrirListaModal('apt','${op.id}')" style="cursor:pointer" title="Ver todos os apontados">
            <span class="mon-list-panel-dot" style="background:var(--mon-green)"></span>
            <span class="mon-list-panel-title">Apontados</span>
            <span class="mon-list-panel-count" style="background:var(--mon-green-bg);color:var(--mon-green)">${colab.length}</span>
            ${colab.length > 0 ? `
              <span id="apt-sort-rec-${op.id}${_idSuffix}" onclick="event.stopPropagation();(function(){var b=document.getElementById('apt-sort-rec-${op.id}${_idSuffix}');var on=b.dataset.on==='1';b.dataset.on=on?'0':'1';b.style.background=on?'':'var(--mon-green-bg)';b.style.color=on?'var(--mon-text-dim)':'var(--mon-green)';b.style.borderColor=on?'var(--mon-border2)':'var(--mon-green)';var list=document.getElementById('apt-list-${op.id}${_idSuffix}');var rows=[...list.querySelectorAll('.mon-list-row')];rows.sort((a,b)=>on?(a.dataset.nome||'').localeCompare(b.dataset.nome||''):(b.dataset.ts||0)-(a.dataset.ts||0)).forEach(r=>list.appendChild(r));})();" style="margin-left:auto;display:inline-flex;align-items:center;cursor:pointer;user-select:none;background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;color:var(--mon-text-dim);transition:all 0.15s" title="Ordenar por mais recente">🕐 Recente</span>
              <span id="adv-sort-${op.id}${_idSuffix}" onclick="event.stopPropagation();(function(){var b=document.getElementById('adv-sort-${op.id}${_idSuffix}');var on=b.dataset.on==='1';b.dataset.on=on?'0':'1';b.style.color=on?'':'var(--mon-accent)';b.style.transform=on?'':'rotate(180deg)';var list=document.getElementById('apt-list-${op.id}${_idSuffix}');var rows=[...list.querySelectorAll('.mon-list-row')];rows.sort((a,b)=>on?(a.dataset.nome||'').localeCompare(b.dataset.nome||''):(a.dataset.tipo==='ADVISOR'?-1:b.dataset.tipo==='ADVISOR'?1:(a.dataset.nome||'').localeCompare(b.dataset.nome||''))).forEach(r=>list.appendChild(r));})();" style="display:inline-flex;align-items:center;cursor:pointer;user-select:none;background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:12px;font-weight:700;color:var(--mon-text-dim);transition:transform 0.2s,color 0.2s" title="Mostrar advisors primeiro">▼</span>
            ` : ''}
          </div>
          <div id="apt-list-${op.id}${_idSuffix}" class="mon-list-panel-body">`;
      if (colab.length === 0) {
        html += `<div class="mon-list-empty">Nenhum apontamento ainda</div>`;
      } else {
        colab.forEach(c => {
          const kmColor = c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green)' : 'var(--mon-red)') : '';
          const kmBg    = c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green-bg)' : 'var(--mon-red-bg)') : '';
          const kmBorder= c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green-border,rgba(22,163,74,0.25))' : 'var(--mon-red-border,rgba(220,38,38,0.25))') : '';
          const kmTag = c.dist > 0 ? `<span class="mon-list-row-tipo" style="background:${kmBg};color:${kmColor};border:1px solid ${kmBorder};border-radius:4px;padding:1px 6px;font-weight:600">📍 ${c.dist.toFixed(2)} km</span>` : '';
          const bioUrl = c.bioOnclick ? (c.bioOnclick.match(/loadiframe\('([^']+)'/) || [])[1] || '' : '';
          const mapBtn = bioUrl
            ? `<button onclick="event.stopPropagation();window._monAbrirBio('${bioUrl}')" style="background:none;border:none;cursor:pointer;font-size:15px;padding:0 2px;opacity:0.75;transition:opacity 0.15s" title="Visualizar Biometria" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.75'">🗺️</button>`
            : '';
          const excluirBtn = '';
          const _origemId = 'mon-origem-' + Math.random().toString(36).slice(2, 9);
          const origemTag = bioUrl
            ? `<span class="mon-list-row-tipo" id="${_origemId}" style="background:var(--mon-surface2);color:var(--mon-text-faint);border:1px solid var(--mon-border2);border-radius:4px;padding:1px 6px;font-weight:600">…</span>`
            : '';
          if (bioUrl) {
            window._monBioOrigem(bioUrl, (origem) => {
              const el = document.getElementById(_origemId);
              if (!el) return;
              const o = (origem || '').toLowerCase();
              if (o.includes('v2')) {
                el.textContent = 'v2';
                el.style.color = 'var(--mon-green)';
                el.style.background = 'var(--mon-green-bg)';
                el.style.borderColor = 'var(--mon-green-border,rgba(22,163,74,0.25))';
              } else if (o.includes('v3')) {
                el.textContent = 'v3';
                el.style.color = 'var(--mon-red)';
                el.style.background = 'var(--mon-red-bg)';
                el.style.borderColor = 'var(--mon-red-border,rgba(220,38,38,0.25))';
              } else {
                el.textContent = origem;
              }
            });
          }
          // Calcula timestamp do inicio para sort por recente
          const _aptTs = (() => { try { const [hh,mi]=(c.inicio||'').split(':').map(Number); if(isNaN(hh))return 0; const n=new Date(); n.setHours(hh,mi||0,0,0); return n.getTime(); } catch(e){return 0;} })();
          html += `
            <div class="mon-list-row" data-adv="${c.advisor||''}" data-nome="${c.nome||''}" data-tipo="${c.tipo||''}" data-ts="${_aptTs}">
              <div class="mon-list-row-name mon-copiavel" onclick="event.stopPropagation();window._monCopiar('${c.nome}','${c.nome}')" title="Clique para copiar o nome">${c.nome}</div>
              <div class="mon-list-row-meta">
                <span class="mon-list-row-tipo">${c.tipo||'—'}</span>
                ${c.cpf ? `<span class="mon-list-row-tipo mon-copiavel" style="color:var(--mon-text-faint);font-family:var(--mon-mono);font-size:10px" onclick="event.stopPropagation();window._monCopiar('${c.cpf}','CPF')" title="Clique para copiar o CPF">🪪 ${c.cpf}</span>` : ''}
                ${c.advisor ? `<span class="mon-list-row-tipo" style="color:var(--mon-text-dim)">👤 ${c.advisor.split(' ')[0]}</span>` : ''}
                <span class="mon-list-row-time">${c.inicio}</span>
                ${kmTag}
                ${origemTag}
                ${mapBtn}
                ${excluirBtn}
              </div>
            </div>`;
        });
      }
      html += `</div></div>`;

      // ── FALTANDO ou ESCALADOS (direita) ──
      // Regra: antes de 1h da operação → mostra lista de Escalados
      //        dentro de 1h (ou depois) → mostra Faltando
      const mostrarFaltando = dentroJanela1h(op);
      // Calcula tempo restante para exibir no header
      const _tempoRestante = (() => {
        if (!op.chave) return '';
        const matchD = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
        if (!matchD) return '';
        const [hh, mm] = (op.hora || '').split(':').map(Number);
        if (isNaN(hh)) return '';
        const opDate = new Date(parseInt(matchD[3]), parseInt(matchD[2])-1, parseInt(matchD[1]), hh, mm||0, 0);
        const diffMs = opDate - new Date();
        const diffM = Math.round(diffMs / 60000);
        if (diffM < 0) return '';
        if (diffM < 60) return `⏱ ${diffM}min`;
        const h = Math.floor(diffM/60), m = diffM%60;
        return `⏱ ${h}h${m > 0 ? m+'min' : ''}`;
      })();

      if (mostrarFaltando) {

        // ── modo FALTANDO — ordenado por datacad (mais recente primeiro) ──
        const faltandoOrdenado = [...faltando].sort((a, b) => {
          const parseDate = s => { try { const [dt,t]=(s||'').split(' ');const[dd,mm,aa]=dt.split('/');const[hh,mi]=(t||'00:00').split(':');return new Date(aa,mm-1,dd,hh,mi); } catch(e){return new Date(0);} };
          return parseDate(b.datacad) - parseDate(a.datacad);
        });
        let sortado = false;
        const _escaladosAtuais = d.escalados || [];
        const _diffFalt = d.listaEnviada ? snapDiff(op.id, _escaladosAtuais) : null;
        html += `
          <div class="mon-list-panel mon-list-panel--warn">
            <div class="mon-list-panel-header" onclick="event.stopPropagation();window._monAbrirListaModal('falt','${op.id}')" style="cursor:pointer" title="Ver todos os faltando">
              <span class="mon-list-panel-dot" style="background:var(--mon-red)"></span>
              <span class="mon-list-panel-title">Faltando</span>
              <span class="mon-list-panel-count" style="background:var(--mon-red-bg);color:var(--mon-red)">${faltando.length}</span>
              ${(_diffFalt && !_diffFalt._soSaiu) ? `<span class="mon-esc-change-dot" style="margin-left:2px"></span>` : ''}
              ${(d.faltasConfirmadas||[]).length > 0 ? '<span onclick="event.stopPropagation();var b=document.getElementById(\'fc-'+op.id+_idSuffix+'\');var a=this.querySelector(\'.fc-arr\');if(b.style.display===\'none\'){b.style.display=\'block\';a.style.transform=\'rotate(180deg)\';}else{b.style.display=\'none\';a.style.transform=\'\';}" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;user-select:none;margin-left:auto;background:var(--mon-red-bg);border:1px solid var(--mon-red-border,rgba(220,38,38,0.25));border-radius:5px;padding:2px 8px;font-size:10px;font-weight:700;color:var(--mon-red)">⚠ Faltas ('+((d.faltasConfirmadas||[]).length)+')<span class="fc-arr" style="transition:transform 0.2s;font-size:9px">▼</span></span>' : ''}
              ${faltando.length > 0 ? `<span id="sort-btn-${op.id}${_idSuffix}" onclick="event.stopPropagation();var b=document.getElementById('sort-btn-${op.id}${_idSuffix}');var isSorted=b.dataset.sorted==='1';b.dataset.sorted=isSorted?'0':'1';b.style.color=isSorted?'':'var(--mon-accent)';b.style.transform=isSorted?'':'rotate(180deg)';var list=document.getElementById('falt-list-${op.id}${_idSuffix}');var rows=[...list.querySelectorAll('.mon-list-row')];rows.sort((a,b)=>isSorted?0:(b.dataset.ts||0)-(a.dataset.ts||0)).forEach(r=>list.appendChild(r));" style="display:inline-flex;align-items:center;cursor:pointer;user-select:none;${(d.faltasConfirmadas||[]).length===0?'margin-left:auto;':'margin-left:6px;'}background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:12px;font-weight:700;color:var(--mon-text-dim);transition:transform 0.2s,color 0.2s" title="Ordenar por horário de cadastro">▼</span>` : ''}
            </div>
            ${_diffFalt ? `<div style="border-bottom:1px solid var(--mon-border)">
              <div onclick="event.stopPropagation();var b=document.getElementById('mon-diff-falt-${op.id}${_idSuffix}');var open=b.style.display==='block';b.style.display=open?'none':'block';this.querySelector('.mon-diff-arr').style.transform=open?'':'rotate(180deg)';" style="display:flex;align-items:center;gap:6px;padding:6px 12px;cursor:pointer;user-select:none;background:var(--mon-red-bg);border-bottom:1px solid var(--mon-red-border,rgba(185,28,28,0.2));font-size:11px;font-weight:600;color:var(--mon-red)">
                🔴 Alterado desde o envio${_diffFalt.saiu.length > 0 ? ' · '+_diffFalt.saiu.length+' saiu' : ''}${_diffFalt.entrou.length > 0 ? ' · '+_diffFalt.entrou.length+' entrou' : ''}
                <span class="mon-diff-arr" style="margin-left:auto;font-size:10px;transition:transform .2s">▼</span>
              </div>
              <div id="mon-diff-falt-${op.id}${_idSuffix}" style="display:none">
                ${_diffFalt.saiu.map(e => `<div style="display:flex;align-items:center;gap:7px;padding:6px 12px;border-bottom:1px solid var(--mon-border)"><span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:var(--mon-red-bg);color:var(--mon-red);flex-shrink:0">saiu</span><span style="font-size:11px;font-weight:600;color:var(--mon-text);flex:1">${e.nome}</span><span style="font-size:10px;color:var(--mon-text-faint)">${e.tipo||''}</span></div>`).join('')}
                ${_diffFalt.entrou.map(e => `<div style="display:flex;align-items:center;gap:7px;padding:6px 12px;border-bottom:1px solid var(--mon-border)"><span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:var(--mon-green-bg);color:var(--mon-green);flex-shrink:0">entrou</span><span style="font-size:11px;font-weight:600;color:var(--mon-text);flex:1">${e.nome}</span><span style="font-size:10px;color:var(--mon-text-faint)">${e.tipo||''}</span>${e.hrEntrou ? `<span style="font-size:10px;font-weight:600;color:var(--mon-accent);background:var(--mon-accent-bg);padding:1px 6px;border-radius:99px;flex-shrink:0">🕐 ${e.hrEntrou}</span>` : ''}</div>`).join('')}
              </div>
            </div>` : ''}
            <div id="fc-${op.id}${_idSuffix}" style="display:none;padding:6px 10px;border-bottom:1px solid var(--mon-border)">
              ${(d.faltasConfirmadas||[]).map(c => '<div class="mon-list-row" style="background:var(--mon-red-bg);border-radius:6px;margin-bottom:3px;border:none"><div class="mon-list-row-name mon-copiavel" style="color:var(--mon-red)" onclick="event.stopPropagation();window._monCopiar('+c.nome+','+c.nome+')" title="Clique para copiar">'+c.nome+'</div><div class="mon-list-row-meta"><span class="mon-list-row-tipo">'+(c.tipo||'—')+'</span>'+(c.cpf ? '<span class="mon-list-row-tipo mon-copiavel" style="color:var(--mon-text-faint);font-family:var(--mon-mono);font-size:10px" onclick="event.stopPropagation();window._monCopiar(\''+c.cpf+'\',\'CPF\')" title="Clique para copiar o CPF">🪪 '+c.cpf+'</span>' : '')+(c.inicio ? '<span class="mon-list-row-tipo">🕐 '+c.inicio+'</span>' : '')+'</div></div>').join('')}
            </div>
            <div id="falt-list-${op.id}${_idSuffix}" class="mon-list-panel-body">`;
        if (faltando.length === 0) {
          html += `<div class="mon-list-empty" style="color:var(--mon-green)">✓ Todos apontados</div>`;
        } else {
          const parseTs = s => { try { const [dt,t]=(s||'').split(' ');const[dd,mm,aa]=dt.split('/');const[hh,mi]=(t||'00:00').split(':');return new Date(aa,mm-1,dd,hh,mi).getTime(); } catch(e){return 0;} };
          faltando.forEach(c => {
            const ts = parseTs(c.datacad);
            const faltaBtnHtml = '';
            html += `
              <div class="mon-list-row" data-ts="${ts}">
                <div class="mon-list-row-name mon-copiavel" style="color:var(--mon-red)" onclick="event.stopPropagation();window._monCopiar('${c.nome}','${c.nome}')" title="Clique para copiar o nome">${c.nome}</div>
                <div class="mon-list-row-meta">
                  <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:4px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text)">${c.tipo||'—'}</span>
                  ${c.cpf ? `<span class="mon-list-row-tipo mon-copiavel" style="color:var(--mon-text-faint);font-family:var(--mon-mono);font-size:10px" onclick="event.stopPropagation();window._monCopiar('${c.cpf}','CPF')" title="Clique para copiar o CPF">🪪 ${c.cpf}</span>` : ''}
                  ${c.tr ? `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:4px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text)">${c.tr}</span>` : ''}
                  ${c.advisor ? `<span class="mon-list-row-tipo" style="color:var(--mon-text-secondary)">👤 ${c.advisor}</span>` : ''}
                  ${c.datacad ? `<span class="mon-list-row-tipo" style="color:var(--mon-text-secondary)">🕐 ${c.datacad}</span>` : ''}
                  ${faltaBtnHtml}
                </div>
              </div>`;
          });
        }
        html += `</div></div>`;
      } else {

        // ── modo ESCALADOS (falta mais de 1h) ──
        const escalados = d.escalados || [];
        const parseTs = s => { try { const [dt,t]=(s||'').split(' ');const[dd,mm,aa]=dt.split('/');const[hh,mi]=(t||'00:00').split(':');return new Date(aa,mm-1,dd,hh,mi).getTime(); } catch(e){return 0;} };
        const escEfetivo = escalados.length; // linhas riscadas (falta) já excluídas no parser
        const _diffEsc = d.listaEnviada ? snapDiff(op.id, escalados) : null;
        html += `
          <div class="mon-list-panel mon-list-panel--ok">
            <div class="mon-list-panel-header" onclick="event.stopPropagation();window._monAbrirListaModal('esc','${op.id}')" style="cursor:pointer" title="Ver todos os escalados">
              <span class="mon-list-panel-dot" style="background:var(--mon-accent)"></span>
              <span class="mon-list-panel-title">Escalados</span>
              <span class="mon-list-panel-count" style="background:var(--mon-accent-bg);color:var(--mon-accent)">${escEfetivo}</span>
              ${(_diffEsc && !_diffEsc._soSaiu) ? `<span class="mon-esc-change-dot" style="margin-left:2px"></span>` : ''}
              ${_tempoRestante ? `<span style="font-size:10px;font-weight:600;color:var(--mon-accent);background:var(--mon-accent-bg);padding:2px 8px;border-radius:99px;white-space:nowrap">${_tempoRestante}</span>` : ''}
              ${escalados.length > 0 ? `<span id="esc-sort-btn-${op.id}${_idSuffix}" onclick="event.stopPropagation();var b=document.getElementById('esc-sort-btn-${op.id}${_idSuffix}');var isSorted=b.dataset.sorted==='1';b.dataset.sorted=isSorted?'0':'1';b.style.color=isSorted?'':'var(--mon-accent)';b.style.transform=isSorted?'':'rotate(180deg)';var list=document.getElementById('esc-list-${op.id}${_idSuffix}');var rows=[...list.querySelectorAll('.mon-list-row')];rows.sort((a,b)=>isSorted?0:(b.dataset.ts||0)-(a.dataset.ts||0)).forEach(r=>list.appendChild(r));" style="display:inline-flex;align-items:center;cursor:pointer;user-select:none;margin-left:auto;background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:12px;font-weight:700;color:var(--mon-text-dim);transition:transform 0.2s,color 0.2s" title="Ordenar por horário de cadastro">▼</span>` : ''}
            </div>
            ${_diffEsc ? `<div style="border-bottom:1px solid var(--mon-border)">
              <div onclick="event.stopPropagation();var b=document.getElementById('mon-diff-esc-${op.id}${_idSuffix}');var open=b.style.display==='block';b.style.display=open?'none':'block';this.querySelector('.mon-diff-arr').style.transform=open?'':'rotate(180deg)';" style="display:flex;align-items:center;gap:6px;padding:6px 12px;cursor:pointer;user-select:none;background:var(--mon-red-bg);border-bottom:1px solid var(--mon-red-border,rgba(185,28,28,0.2));font-size:11px;font-weight:600;color:var(--mon-red)">
                🔴 Alterado desde o envio${_diffEsc.saiu.length > 0 ? ' · '+_diffEsc.saiu.length+' saiu' : ''}${_diffEsc.entrou.length > 0 ? ' · '+_diffEsc.entrou.length+' entrou' : ''}
                <span class="mon-diff-arr" style="margin-left:auto;font-size:10px;transition:transform .2s">▼</span>
              </div>
              <div id="mon-diff-esc-${op.id}${_idSuffix}" style="display:none">
                ${_diffEsc.saiu.map(e => `<div style="display:flex;align-items:center;gap:7px;padding:6px 12px;border-bottom:1px solid var(--mon-border)"><span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:var(--mon-red-bg);color:var(--mon-red);flex-shrink:0">saiu</span><span style="font-size:11px;font-weight:600;color:var(--mon-text);flex:1">${e.nome}</span><span style="font-size:10px;color:var(--mon-text-faint)">${e.tipo||''}</span></div>`).join('')}
                ${_diffEsc.entrou.map(e => `<div style="display:flex;align-items:center;gap:7px;padding:6px 12px;border-bottom:1px solid var(--mon-border)"><span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;background:var(--mon-green-bg);color:var(--mon-green);flex-shrink:0">entrou</span><span style="font-size:11px;font-weight:600;color:var(--mon-text);flex:1">${e.nome}</span><span style="font-size:10px;color:var(--mon-text-faint)">${e.tipo||''}</span>${e.hrEntrou ? `<span style="font-size:10px;font-weight:600;color:var(--mon-accent);background:var(--mon-accent-bg);padding:1px 6px;border-radius:99px;flex-shrink:0">🕐 ${e.hrEntrou}</span>` : ''}</div>`).join('')}
              </div>
            </div>` : ''}
            <div id="esc-list-${op.id}${_idSuffix}" class="mon-list-panel-body">`;
        if (escalados.length === 0) {
          html += `<div class="mon-list-empty">Nenhum escalado</div>`;
        } else {
          escalados.forEach(c => {
            const ts = parseTs(c.datacad);
            const faltaBtnHtml2 = '';
            html += `
              <div class="mon-list-row" data-ts="${ts}">
                <div class="mon-list-row-name mon-copiavel" onclick="event.stopPropagation();window._monCopiar('${c.nome}','${c.nome}')" title="Clique para copiar o nome">${c.nome}</div>
                <div class="mon-list-row-meta">
                  <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:4px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text)">${c.tipo||'—'}</span>
                  ${c.cpf ? `<span class="mon-list-row-tipo mon-copiavel" style="color:var(--mon-text-faint);font-family:var(--mon-mono);font-size:10px" onclick="event.stopPropagation();window._monCopiar('${c.cpf}','CPF')" title="Clique para copiar o CPF">🪪 ${c.cpf}</span>` : ''}
                  ${c.tr ? `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:4px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text)">${c.tr}</span>` : ''}
                  ${c.advisor ? `<span class="mon-list-row-tipo" style="color:var(--mon-text-secondary)">👤 ${c.advisor}</span>` : ''}
                  ${c.datacad ? `<span class="mon-list-row-tipo" style="color:var(--mon-text-secondary)">🕐 ${c.datacad}</span>` : ''}
                  ${faltaBtnHtml2}
                </div>
              </div>`;
          });
        }
        html += `</div></div>`;
      }

      html += `</div>`;
    }

    return html;
  }

  // ── MODAL VALES ──────────────────────────────────────────────────────────────
  window._monAbrirVales = function(opId, valesRaw, label) {
    let vales;
    try { vales = JSON.parse(valesRaw); } catch(e) { return; }

    // Cria estrutura do modal uma vez
    let modal = document.getElementById('mon-vales-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mon-vales-modal';
      modal.style.cssText = [
        'display:none;position:fixed;inset:0;z-index:10000001;',
        'align-items:center;justify-content:center;',
        'background:rgba(0,0,0,0.5);',
        'font-family:var(--mon-font);'
      ].join('');
      modal.innerHTML = `
        <div id="mon-vales-box" style="
          background:var(--mon-bg);border-radius:12px;
          width:680px;max-width:96vw;max-height:88vh;
          display:flex;flex-direction:column;overflow:hidden;
          animation:mon-fadein 0.18s ease;
          box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px var(--mon-border);
        ">
          <!-- HEADER -->
          <div style="
            padding:14px 18px 12px;flex-shrink:0;
            border-bottom:1px solid var(--mon-border);
            background:var(--mon-surface);
            display:flex;align-items:center;gap:10px;
          ">
            <span style="font-size:18px;line-height:1">💳</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:700;color:var(--mon-text);letter-spacing:-0.2px">Vales / Adiantamentos</div>
              <div id="mon-vales-label" style="font-size:11px;color:var(--mon-text-faint);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
            </div>
            <button id="mon-vales-img-btn" onclick="window._monGerarRelatorioVales(this)" style="
              height:30px;padding:0 11px;border-radius:6px;
              border:1px solid var(--mon-accent-border);background:var(--mon-accent-bg);
              color:var(--mon-accent);font-size:11px;font-weight:600;cursor:pointer;
              display:flex;align-items:center;gap:5px;white-space:nowrap;
              transition:background 0.1s,color 0.1s;flex-shrink:0;
            " onmouseover="this.style.background='var(--mon-accent)';this.style.color='#fff'" onmouseout="this.style.background='var(--mon-accent-bg)';this.style.color='var(--mon-accent)'">📸 Print Escala</button>
            <button onclick="window._monFecharVales()" style="
              width:30px;height:30px;border-radius:6px;
              border:1px solid var(--mon-border);background:transparent;
              color:var(--mon-text-faint);font-size:16px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
              transition:background 0.1s,color 0.1s;
            " onmouseover="this.style.background='var(--mon-surface2)';this.style.color='var(--mon-text)'" onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)'">✕</button>
          </div>
          <!-- RESUMO BARRA -->
          <div id="mon-vales-resumo" style="padding:10px 18px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0;display:flex;gap:10px;"></div>
          <!-- LISTA -->
          <div id="mon-vales-body" style="flex:1;overflow-y:auto;padding:0;"></div>
        </div>`;
      modal.addEventListener('click', e => { if (e.target === modal) window._monFecharVales(); });
      document.body.appendChild(modal);
    }

    // Label da operação
    const lbl = document.getElementById('mon-vales-label');
    if (lbl) lbl.textContent = label || '';

    // Guarda opId para o botão de print acessar
    const box = document.getElementById('mon-vales-box');
    if (box) box.dataset.opId = opId;

    // Contadores
    const trTotal  = vales.filter(v => v.adtoTr).length;
    const alTotal  = vales.filter(v => v.adtoAl).length;
    const trGerados = vales.filter(v => v.adtoTr && v.adtoTr.op).length;
    const alGerados = vales.filter(v => v.adtoAl && v.adtoAl.op).length;
    const trPagos   = vales.filter(v => v.adtoTr && v.adtoTr.op && v.adtoTr.pago).length;
    const alPagos   = vales.filter(v => v.adtoAl && v.adtoAl.op && v.adtoAl.pago).length;

    // ── Barra de resumo ──────────────────────────────────────────────────────
    const mkResumoCard = (tipo, gerados, pagos, total) => {
      const pct = gerados > 0 ? Math.round((pagos / gerados) * 100) : 0;
      const cor = pagos === gerados && gerados > 0 ? 'var(--mon-green)' : gerados > 0 ? 'var(--mon-amber)' : 'var(--mon-text-faint)';
      const bg  = pagos === gerados && gerados > 0 ? 'var(--mon-green-bg)' : gerados > 0 ? 'var(--mon-amber-bg)' : 'var(--mon-surface2)';
      const brd = pagos === gerados && gerados > 0 ? 'var(--mon-green-border)' : gerados > 0 ? 'var(--mon-amber-border)' : 'var(--mon-border)';
      return `
        <div style="flex:1;background:${bg};border:1px solid ${brd};border-radius:8px;padding:8px 12px;">
          <div style="display:flex;align-items:baseline;gap:5px;margin-bottom:5px;">
            <span style="font-size:11px;font-weight:700;color:${cor};letter-spacing:0.3px;text-transform:uppercase">ADTO ${tipo}</span>
            <span style="font-size:18px;font-weight:700;color:${cor};line-height:1;margin-left:auto">${pagos}<span style="font-size:12px;font-weight:500;color:var(--mon-text-faint)">/${gerados}</span></span>
          </div>
          <div style="height:4px;background:var(--mon-border);border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${cor};border-radius:2px;transition:width 0.4s ease;"></div>
          </div>
          <div style="font-size:10px;color:var(--mon-text-faint);margin-top:4px">${gerados === 0 ? 'Nenhum gerado' : pagos === gerados ? '✓ Todos pagos' : `${gerados - pagos} pendente${gerados-pagos>1?'s':''}`}</div>
        </div>`;
    };

    const resumo = document.getElementById('mon-vales-resumo');
    if (resumo) resumo.innerHTML = mkResumoCard('TR', trGerados, trPagos, trTotal) + mkResumoCard('AL', alGerados, alPagos, alTotal);

    // ── Célula de ADTO ───────────────────────────────────────────────────────
    const mkAdtoCell = (adto, tipo) => {
      if (!adto) return `<td style="padding:8px 12px;text-align:center;color:var(--mon-text-faint);font-size:11px">—</td>`;

      if (adto.op) {
        const pago = adto.pago;
        const cor  = pago ? 'var(--mon-green)' : 'var(--mon-amber)';
        const bg   = pago ? 'var(--mon-green-bg)' : 'var(--mon-amber-bg)';
        const brd  = pago ? 'var(--mon-green-border)' : 'var(--mon-amber-border)';
        return `<td style="padding:8px 12px;text-align:center;">
          <span style="display:inline-flex;flex-direction:column;align-items:center;gap:1px;
            background:${bg};border:1px solid ${brd};border-radius:6px;padding:4px 10px;min-width:90px;">
            <span style="font-size:11px;font-weight:700;color:${cor}">${pago ? '✓ Pago' : '⏳ Gerado'}</span>
            <span style="font-size:10px;color:var(--mon-text-faint);font-family:var(--mon-mono)">#${adto.op}</span>
          </span>
        </td>`;
      }

      if (adto.onclick) {
        const oc = adto.onclick.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        return `<td style="padding:8px 12px;text-align:center;">
          <button onclick="window._monExecAdtoOnclick('${oc}')" style="
            padding:5px 12px;border-radius:6px;cursor:pointer;font-family:var(--mon-font);
            border:1px solid var(--mon-accent-border);background:var(--mon-accent-bg);
            color:var(--mon-accent);font-size:11px;font-weight:600;transition:background 0.1s,color 0.1s;
          " onmouseover="this.style.background='var(--mon-accent)';this.style.color='#fff'"
             onmouseout="this.style.background='var(--mon-accent-bg)';this.style.color='var(--mon-accent)'">
            + Gerar ${tipo}
          </button>
        </td>`;
      }

      return `<td style="padding:8px 12px;text-align:center;color:var(--mon-text-faint);font-size:11px">—</td>`;
    };

    const body = document.getElementById('mon-vales-body');
    if (!body) return;

    body.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-family:var(--mon-font);">
        <thead>
          <tr style="background:var(--mon-surface2);">
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid var(--mon-border);">#</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid var(--mon-border);">Prestador</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid var(--mon-border);width:130px">ADTO TR</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid var(--mon-border);width:130px">ADTO AL</th>
          </tr>
        </thead>
        <tbody>
          ${vales.map((v, i) => `
            <tr style="border-bottom:1px solid var(--mon-border);transition:background 0.1s;"
                onmouseover="this.style.background='var(--mon-surface2)'"
                onmouseout="this.style.background=''">
              <td style="padding:8px 12px;font-size:11px;color:var(--mon-text-faint);font-family:var(--mon-mono);white-space:nowrap">${i+1}</td>
              <td style="padding:8px 12px;">
                <div style="font-size:12px;font-weight:600;color:var(--mon-text)">${v.nome}</div>
                <div style="font-size:10px;color:var(--mon-text-faint);margin-top:1px">${v.tipo||'—'}</div>
              </td>
              ${mkAdtoCell(v.adtoTr,'TR')}
              ${mkAdtoCell(v.adtoAl,'AL')}
            </tr>`).join('')}
        </tbody>
      </table>`;

    // Marca se foi aberto a partir do modal de detalhe do histórico
    const histDet = document.getElementById('mon-hist-det-modal');
    const _fromHistDet = histDet && histDet.style.display !== 'none';
    modal.dataset.fromHistDet = _fromHistDet ? '1' : '';
    // Esconde o histórico enquanto vales está aberto — evita conflito de z-index com dropdowns
    if (_fromHistDet) histDet.style.display = 'none';

    modal.style.display = 'flex';
  };

  window._monFecharVales = function() {
    const m = document.getElementById('mon-vales-modal');
    if (!m) return;
    const fromHist = m.dataset.fromHistDet === '1';
    m.style.display = 'none';
    m.dataset.fromHistDet = '';
    if (fromHist) {
      const histDet = document.getElementById('mon-hist-det-modal');
      if (histDet) histDet.style.display = 'flex';
    }
  };

  // ── MODAL LISTA (apontados / escalados / faltando) ────────────────────────────
  window._monAbrirListaModal = function(tipo, opId) {
    const d  = apontCache[opId];
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!d || d === 'loading' || !op) return;

    // Monta lista e config por tipo
    let itens = [], titulo = '', dotCor = '', countCor = '', countBg = '';
    if (tipo === 'apt') {
      itens    = d.colaboradores || [];
      titulo   = 'Apontados';
      dotCor   = 'var(--mon-green)';
      countCor = 'var(--mon-green)';
      countBg  = 'var(--mon-green-bg)';
    } else if (tipo === 'esc') {
      itens    = d.escalados || [];
      titulo   = 'Escalados';
      dotCor   = 'var(--mon-accent)';
      countCor = 'var(--mon-accent)';
      countBg  = 'var(--mon-accent-bg)';
    } else {
      itens    = d.faltando || [];
      titulo   = 'Faltando';
      dotCor   = 'var(--mon-red)';
      countCor = 'var(--mon-red)';
      countBg  = 'var(--mon-red-bg)';
    }

    // Cria modal uma única vez
    let modal = document.getElementById('mon-lista-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mon-lista-modal';
      modal.innerHTML = `
        <div id="mon-lista-box">
          <div id="mon-lista-header">
            <span id="mon-lista-dot" style="width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block"></span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px">
                <span id="mon-lista-titulo" style="font-size:13px;font-weight:700;color:var(--mon-text);letter-spacing:-0.2px"></span>
                <span id="mon-lista-count" style="font-size:11px;font-weight:700;padding:1px 9px;border-radius:99px;border:1px solid"></span>
              </div>
              <div id="mon-lista-sub" style="font-size:11px;color:var(--mon-text-faint);margin-top:2px"></div>
            </div>
            <span id="mon-lista-sort-btn" onclick="window._monToggleSortLista()" title="Últimos cadastrados primeiro" style="display:none;align-items:center;cursor:pointer;user-select:none;background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;color:var(--mon-text-dim);transition:transform 0.2s,color 0.2s,background 0.15s;flex-shrink:0;margin-right:4px" onmouseover="this.style.background='var(--mon-surface3)'" onmouseout="this.style.background='var(--mon-surface2)'">🕐 Recentes</span>
            <span id="mon-lista-advisor-btn" onclick="window._monToggleSortAdvisor()" title="Ordenar por advisor" style="display:inline-flex;align-items:center;cursor:pointer;user-select:none;background:var(--mon-surface2);border:1px solid var(--mon-border2);border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;color:var(--mon-text-dim);transition:color 0.2s,background 0.15s,border-color 0.15s;flex-shrink:0;margin-right:4px">👤 Advisor</span>
            <button onclick="window._monFecharListaModal()" style="width:30px;height:30px;border-radius:6px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.1s,color 0.1s;flex-shrink:0" onmouseover="this.style.background='var(--mon-surface2)';this.style.color='var(--mon-text)'" onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)'">✕</button>
          </div>
          <div style="padding:10px 14px;border-bottom:1px solid var(--mon-border);background:var(--mon-surface);flex-shrink:0">
            <input id="mon-lista-filtro" type="text" placeholder="Filtrar por nome…"
              style="width:100%;box-sizing:border-box;padding:7px 12px;border-radius:7px;border:1px solid var(--mon-border2);background:var(--mon-bg);color:var(--mon-text);font-size:12px;font-family:var(--mon-font);outline:none;transition:border-color 0.15s"
              oninput="window._monFiltrarLista(this.value)"
              onfocus="this.style.borderColor='var(--mon-accent)'"
              onblur="this.style.borderColor='var(--mon-border2)'"
            />
          </div>
          <div id="mon-lista-body" style="flex:1;overflow-y:auto;padding:0"></div>
        </div>`;
      modal.addEventListener('click', e => { if (e.target === modal) window._monFecharListaModal(); });
      document.body.appendChild(modal);
    }

    // Armazena itens e tipo no modal para o filtro acessar
    modal._monItens = itens;
    modal._monTipo  = tipo;
    modal._monOpId  = opId;

    // Preenche header
    document.getElementById('mon-lista-dot').style.background   = dotCor;
    document.getElementById('mon-lista-titulo').textContent      = titulo;
    const countEl = document.getElementById('mon-lista-count');
    countEl.textContent      = itens.length;
    countEl.style.color      = countCor;
    countEl.style.background = countBg;
    countEl.style.borderColor= countCor;
    document.getElementById('mon-lista-sub').textContent = (op.sigla || '') + (op.site ? ' · ' + op.site : '') + (op.hora ? ' · ' + op.hora : '');

    // Botão de ordenação — só pra esc e falt
    const sortBtn = document.getElementById('mon-lista-sort-btn');
    if (sortBtn) {
      if (tipo === 'esc' || tipo === 'falt') {
        sortBtn.style.display = 'inline-flex';
        sortBtn.dataset.sorted = '0';
        sortBtn.style.color     = 'var(--mon-text-dim)';
        sortBtn.style.transform = '';
        sortBtn.title = 'Últimos cadastrados primeiro';
      } else {
        sortBtn.style.display = 'none';
      }
    }

    // Reseta estado de ordenação no modal
    modal._monSorted = false;

    // Limpa filtro e renderiza
    const filtroEl = document.getElementById('mon-lista-filtro');
    if (filtroEl) filtroEl.value = '';
    modal._monAdvisorFiltro = '';
    modal._monSortedAdvisor = false;
    const advBtn = document.getElementById('mon-lista-advisor-btn');
    if (advBtn) { advBtn.style.color = 'var(--mon-text-dim)'; advBtn.style.borderColor = 'var(--mon-border2)'; advBtn.style.background = 'var(--mon-surface2)'; }
    window._monFiltrarLista('');

    modal.classList.add('open');
    setTimeout(() => { if (filtroEl) filtroEl.focus(); }, 80);
  };

  window._monFecharListaModal = function() {
    const m = document.getElementById('mon-lista-modal');
    if (m) m.classList.remove('open');
    // fecha dropdown advisor se aberto
    const drop = document.getElementById('mon-lista-advisor-drop');
    if (drop) drop.style.display = 'none';
  };

  window._monToggleSortAdvisor = function() {
    const modal = document.getElementById('mon-lista-modal');
    const btn   = document.getElementById('mon-lista-advisor-btn');
    if (!modal || !btn) return;
    modal._monSortedAdvisor = !modal._monSortedAdvisor;
    btn.style.color      = modal._monSortedAdvisor ? '#fff' : 'var(--mon-text-dim)';
    btn.style.background = modal._monSortedAdvisor ? 'var(--mon-accent)' : 'var(--mon-surface2)';
    btn.style.borderColor= modal._monSortedAdvisor ? 'var(--mon-accent)' : 'var(--mon-border2)';
    const filtroEl = document.getElementById('mon-lista-filtro');
    window._monFiltrarLista(filtroEl ? filtroEl.value : '');
  };

  window._monToggleSortLista = function() {
    const modal  = document.getElementById('mon-lista-modal');
    const btn    = document.getElementById('mon-lista-sort-btn');
    if (!modal || !btn) return;
    modal._monSorted = !modal._monSorted;
    btn.dataset.sorted = modal._monSorted ? '1' : '0';
    btn.style.color     = modal._monSorted ? '#fff' : 'var(--mon-text-dim)';
    btn.style.background= modal._monSorted ? 'var(--mon-accent)' : 'var(--mon-surface2)';
    btn.style.borderColor= modal._monSorted ? 'var(--mon-accent)' : 'var(--mon-border2)';
    const filtroEl = document.getElementById('mon-lista-filtro');
    window._monFiltrarLista(filtroEl ? filtroEl.value : '');
  };

  window._monFiltrarLista = function(q) {
    const modal = document.getElementById('mon-lista-modal');
    const body  = document.getElementById('mon-lista-body');
    if (!modal || !body) return;

    const itens = modal._monItens || [];
    const tipo  = modal._monTipo;
    const opId  = modal._monOpId;
    const termo = (q || '').toLowerCase().trim();
    const sorted = !!modal._monSorted;
    const sortedAdvisor = !!modal._monSortedAdvisor;

    let filtrados = termo ? itens.filter(c => (c.nome || '').toLowerCase().includes(termo)) : [...itens];


    // Ordena por datacad (mais recente primeiro) quando ativo
    if (sorted && (tipo === 'esc' || tipo === 'falt')) {
      const parseTs = s => { try { const [dt,t]=(s||'').split(' ');const[dd,mm,aa]=dt.split('/');const[hh,mi]=(t||'00:00').split(':');return new Date(aa,mm-1,dd,hh,mi).getTime(); } catch(e){return 0;} };
      filtrados = [...filtrados].sort((a, b) => parseTs(b.datacad) - parseTs(a.datacad));
    }

    // Filtra só advisors quando ativo
    if (sortedAdvisor) {
      filtrados = filtrados.filter(c => (c.tipo || '').toLowerCase().includes('advisor'));
    }

    // Atualiza contador
    const countEl = document.getElementById('mon-lista-count');
    if (countEl) countEl.textContent = filtrados.length;

    if (filtrados.length === 0) {
      body.innerHTML = `<div style="padding:28px;text-align:center;color:var(--mon-text-faint);font-size:12px">${termo ? 'Nenhum resultado para "' + q + '"' : 'Nenhum item'}</div>`;
      return;
    }

    const hl = txt => {
      if (!termo) return txt;
      const re = new RegExp('(' + termo.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
      return (txt || '').replace(re, '<mark style="background:rgba(79,70,229,0.15);color:var(--mon-accent);border-radius:2px;padding:0 1px">$1</mark>');
    };

    const E = s => `<span class="mon-lista-emoji">${s}</span>`;

    // botões reutilizáveis
    const mkBioBtn = (bioOnclick) => {
      const bioUrl = bioOnclick ? (bioOnclick.match(/loadiframe\('([^']+)'/) || [])[1] || '' : '';
      return bioUrl
        ? `<button onclick="event.stopPropagation();window._monAbrirBio('${bioUrl}')" title="Visualizar Biometria" style="background:none;border:none;cursor:pointer;font-size:14px;padding:0 1px;opacity:0.75;line-height:1;transition:opacity 0.15s" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.75'">${E('🗺️')}</button>`
        : '';
    };

    const _btnStyle = 'background:none;border:none;cursor:pointer;font-size:13px;padding:0 2px;opacity:0.75;line-height:1;transition:opacity 0.15s;flex-shrink:0';
    const _btnHover = "onmouseover=\"this.style.opacity='1'\" onmouseout=\"this.style.opacity='0.75'\"";

    // Apontados: botões Editar (✏️) e Excluir (🗑️)
    // Editar → modal1500 (490px) | Excluir → parâmetros originais do onclick (modal500, 250px)
    const mkExcluirBtn = (excluirOnclick, nome) => {
      if (!excluirOnclick) return '';
      const delMatch = excluirOnclick.match(/pedidoAPTdel_([A-Za-z0-9+/=]+)_1_N_D/);
      if (!delMatch) return '';
      const b64     = delMatch[1];
      const editUrl = `apontamentoE_${b64}_1`;
      const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const nomeEsc = esc(nome || '');
      const opIdEsc = esc(opId || '');
      // Editar usa modal1500 (490px) — tamanho real da tela de edição de apontamento
      return `<button onclick="event.stopPropagation();window._monOpenModal('${esc(editUrl)}','',490,'modal1500','${nomeEsc}','${opIdEsc}')" title="Editar apontamento" style="${_btnStyle}" ${_btnHover}>${E('✏️')}</button>`
           + `<button onclick="event.stopPropagation();window._monOpenViaOnclick('${esc(excluirOnclick)}','${nomeEsc}','${opIdEsc}')" title="Excluir apontamento" style="${_btnStyle}" ${_btnHover}>${E('🗑️')}</button>`;
    };

    // Escalados / Faltando: botões Editar (✏️) e Gerar Falta (⚠️)
    // Editar → modal700 (400px) | Falta → parâmetros originais do onclick (modal500, 250px)
    const mkFaltaBtn = (faltaOnclick, nome) => {
      if (!faltaOnclick) return '';
      const faltaMatch = faltaOnclick.match(/escalaF_([A-Za-z0-9+/=]+)_([A-Za-z0-9+/=]+)_0/);
      if (!faltaMatch) return '';
      const editUrl = `escalaE_${faltaMatch[1]}_${faltaMatch[2]}`;
      const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const nomeEsc = esc(nome || '');
      const opIdEsc = esc(opId || '');
      // Editar usa modal700 (400px) — tamanho real da tela de edição de escala
      return `<button onclick="event.stopPropagation();window._monOpenModal('${esc(editUrl)}','',400,'modal700','${nomeEsc}','${opIdEsc}')" title="Editar escala" style="${_btnStyle}" ${_btnHover}>${E('✏️')}</button>`
           + `<button onclick="event.stopPropagation();window._monOpenViaOnclick('${esc(faltaOnclick)}','${nomeEsc}','${opIdEsc}')" title="Gerar falta" style="${_btnStyle}" ${_btnHover}>${E('⚠️')}</button>`;
    };

    const cards = filtrados.map(c => {
      if (tipo === 'apt') {
        const kmColor  = c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green)' : 'var(--mon-red)') : '';
        const kmBg     = c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green-bg)' : 'var(--mon-red-bg)') : '';
        const kmBorder = c.dist > 0 ? (c.dist < 1 ? 'var(--mon-green-border,rgba(22,163,74,0.25))' : 'var(--mon-red-border,rgba(220,38,38,0.25))') : '';
        const kmTag = c.dist > 0
          ? `<span class="mon-lista-card-badge" style="color:${kmColor};background:${kmBg};border-color:${kmBorder}">${E('📍')} ${c.dist.toFixed(2)} km</span>`
          : '';
        const horaTag = c.inicio
          ? `<span class="mon-lista-card-badge" style="color:var(--mon-amber);background:var(--mon-amber-bg);border-color:var(--mon-amber-border);font-family:var(--mon-mono)">${c.inicio}</span>`
          : '';
        const bioUrl = c.bioOnclick ? (c.bioOnclick.match(/loadiframe\('([^']+)'/) || [])[1] || '' : '';
        const origemId = 'mon-origem-' + Math.random().toString(36).slice(2, 9);
        if (bioUrl) {
          window._monBioOrigem(bioUrl, (origem) => {
            const el = document.getElementById(origemId);
            if (!el) return;
            const o = (origem || '').toLowerCase();
            if (o.includes('v2')) {
              el.textContent = 'v2';
              el.style.color = 'var(--mon-green)';
              el.style.background = 'var(--mon-green-bg)';
              el.style.borderColor = 'var(--mon-green-border,rgba(22,163,74,0.25))';
            } else if (o.includes('v3')) {
              el.textContent = 'v3';
              el.style.color = 'var(--mon-red)';
              el.style.background = 'var(--mon-red-bg)';
              el.style.borderColor = 'var(--mon-red-border,rgba(220,38,38,0.25))';
            } else {
              el.textContent = origem;
            }
          });
        }
        const origemTag = bioUrl
          ? `<span class="mon-lista-card-badge" id="${origemId}" style="color:var(--mon-text-faint);background:var(--mon-surface2);border-color:var(--mon-border2)">…</span>`
          : '';
        return `<div class="mon-lista-card">
          <div style="display:flex;align-items:flex-start;gap:6px">
            <div class="mon-lista-card-name" style="flex:1;min-width:0" title="${c.nome}">${hl(c.nome)}</div>
            ${mkBioBtn(c.bioOnclick)}
            ${mkExcluirBtn(c.excluirOnclick, c.nome)}
          </div>
          <div class="mon-lista-card-meta">
            <span class="mon-lista-card-tag">${c.tipo||'—'}</span>
            ${c.advisor ? `<span class="mon-lista-card-tag">${E('👤')} ${c.advisor.split(' ')[0]}</span>` : ''}
            ${horaTag}
            ${kmTag}
            ${origemTag}
          </div>
        </div>`;
      } else if (tipo === 'esc') {
        return `<div class="mon-lista-card">
          <div style="display:flex;align-items:flex-start;gap:6px">
            <div class="mon-lista-card-name" style="flex:1;min-width:0" title="${c.nome}">${hl(c.nome)}</div>
            ${mkFaltaBtn(c.faltaOnclick, c.nome)}
          </div>
          <div class="mon-lista-card-meta">
            <span class="mon-lista-card-tag">${c.tipo||'—'}</span>
            ${c.advisor ? `<span class="mon-lista-card-tag">${E('👤')} ${c.advisor}</span>` : ''}
            ${c.datacad ? `<span class="mon-lista-card-tag">${E('🕐')} ${c.datacad}</span>` : ''}
          </div>
        </div>`;
      } else {
        return `<div class="mon-lista-card">
          <div style="display:flex;align-items:flex-start;gap:6px">
            <div class="mon-lista-card-name red" style="flex:1;min-width:0" title="${c.nome}">${hl(c.nome)}</div>
            ${mkFaltaBtn(c.faltaOnclick, c.nome)}
          </div>
          <div class="mon-lista-card-meta">
            <span class="mon-lista-card-tag">${c.tipo||'—'}</span>
            ${c.advisor ? `<span class="mon-lista-card-tag">${E('👤')} ${c.advisor}</span>` : ''}
            ${c.datacad ? `<span class="mon-lista-card-tag">${E('🕐')} ${c.datacad}</span>` : ''}
          </div>
        </div>`;
      }
    });

    body.innerHTML = `<div id="mon-lista-grid">${cards.join('')}</div>`;
  };

  // ── PRINT ESCALA (a partir do modal de vales) ─────────────────────────────────
  // Cópia exata do _monPrintApontamentos — só muda a URL (pedidoEescala)
  // e o crop: pega a tabela inteira de prestadores, da borda esquerda à direita.
  window._monGerarRelatorioVales = function(btnEl) {
    const box = document.getElementById('mon-vales-box');
    if (!box) return;
    const opId = box.dataset.opId;
    const d  = apontCache[opId];
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!d || d === 'loading' || !op) { alert('Aguarde os dados carregarem.'); return; }
    const href = d.eaptHref ? d.eaptHref.replace('pedidoEapt', 'pedidoEescala') : null;
    if (!href) { alert('Clique em ↻ Atualizar para habilitar o print desta operação.'); return; }

    const origHTML = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = '⏳ Carregando…';

    const fail = (msg) => {
      btnEl.innerHTML = '✗ ' + msg;
      setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.disabled = false; }, 3500);
    };

    const printIfr = document.createElement('iframe');
    printIfr.id = '_mon_print_escala_ifr';
    printIfr.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      'width:1800px',
      'height:1200px',
      'opacity:0',
      'pointer-events:none',
      'border:none',
      'z-index:-1',
    ].join(';');
    document.body.appendChild(printIfr);

    const cleanup = () => { try { document.body.removeChild(printIfr); } catch(e) {} };
    const safetyTimeout = setTimeout(() => { cleanup(); fail('Timeout ao carregar'); }, 30000);

    printIfr.onload = () => {
      setTimeout(() => {
        try {
          const ifrDoc = printIfr.contentDocument || printIfr.contentWindow.document;
          const ifrWin = printIfr.contentWindow;

          const script = ifrDoc.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = () => {
            setTimeout(() => {
              try {
                // Tabela de escala (com .table-bordered)
                const tbl = ifrDoc.querySelector('table.tables.table-fixed.card-table.table-bordered')
                         || ifrDoc.querySelector('table.tables.table-fixed.card-table')
                         || ifrDoc.querySelector('table.card-table')
                         || ifrDoc.querySelector('table');

                if (!tbl) { clearTimeout(safetyTimeout); cleanup(); fail('Tabela não encontrada'); return; }

                // Crop: usa offsetTop/offsetLeft absolutos (iframe fora da tela, getBoundingClientRect dá coords erradas)
                function getAbsOffset(el) {
                  let top = 0, left = 0;
                  while (el) { top += el.offsetTop || 0; left += el.offsetLeft || 0; el = el.offsetParent; }
                  return { top, left };
                }

                const tblOff  = getAbsOffset(tbl);
                const lastRow = tbl.querySelector('tbody tr:last-child');
                const lastOff = lastRow ? getAbsOffset(lastRow) : null;
                const lastH   = lastRow ? (lastRow.offsetHeight || 0) : 0;

                // cropLeft = coluna NOME; cropRight = fim do ADTO. AL
                let cropLeft  = tblOff.left;
                let rightEdge = 0;
                tbl.querySelectorAll('thead th, thead td').forEach(function(th) {
                  const txt = (th.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
                  const off = getAbsOffset(th);
                  if (txt === 'nome' && cropLeft === tblOff.left) cropLeft = off.left;
                  if (txt.includes('adto') && txt.includes('al')) {
                    const edge = off.left + (th.offsetWidth || 0);
                    if (edge > rightEdge) rightEdge = edge;
                  }
                });
                if (rightEdge === 0) rightEdge = tblOff.left + tbl.offsetWidth;

                const cropTop    = Math.max(0, tblOff.top - 6);
                const cropBottom = lastOff ? (lastOff.top + lastH + 6) : (tblOff.top + tbl.offsetHeight + 6);
                const cropRight  = rightEdge + 4;

                btnEl.innerHTML = '📸 Gerando…';

                ifrWin.html2canvas(ifrDoc.body, {
                  backgroundColor: '#ffffff',
                  scale: 4,
                  useCORS: true,
                  allowTaint: true,
                  logging: false,
                  scrollX: 0,
                  scrollY: 0,
                  windowWidth: ifrDoc.body.scrollWidth,
                  windowHeight: ifrDoc.body.scrollHeight,
                }).then(canvas => {
                  clearTimeout(safetyTimeout);

                  const scale = 4;
                  const sx = Math.round(Math.max(0, cropLeft)  * scale);
                  const sy = Math.round(Math.max(0, cropTop)   * scale);
                  const sw = Math.max(1, Math.round((cropRight  - cropLeft) * scale));
                  const sh = Math.max(1, Math.round((cropBottom - cropTop)  * scale));

                  const cropCanvas2 = document.createElement('canvas');
                  cropCanvas2.width  = sw;
                  cropCanvas2.height = sh;
                  cropCanvas2.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

                  _monMontagem(cropCanvas2, opId).then(out => {
                    const dataUrl = out.toDataURL('image/png');

                    const doDownload = () => {
                      const a = document.createElement('a');
                      a.href = dataUrl;
                      a.download = 'escala_' + (op.chave || opId) + '_' + new Date().toISOString().slice(0,16).replace(/[T:]/g,'-') + '.png';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    };

                    const onSuccess = () => {
                      btnEl.innerHTML = '✅ Print copiado!';
                      btnEl.style.color = 'var(--mon-green)';
                      setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
                    };
                    const onDownloaded = () => {
                      btnEl.innerHTML = '✅ Baixado!';
                      btnEl.style.color = 'var(--mon-green)';
                      setTimeout(() => { btnEl.innerHTML = origHTML; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
                    };

                    if (navigator.clipboard && navigator.clipboard.write) {
                      fetch(dataUrl).then(r => r.blob()).then(blob => {
                        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                          .then(onSuccess)
                          .catch(() => { doDownload(); onDownloaded(); });
                      }).catch(() => { doDownload(); onDownloaded(); });
                    } else {
                      doDownload();
                      onDownloaded();
                    }

                    cleanup();
                  });
                }).catch(e => {
                  clearTimeout(safetyTimeout);
                  cleanup();
                  fail('Erro canvas: ' + e.message);
                });
              } catch(e) {
                clearTimeout(safetyTimeout);
                cleanup();
                fail('Erro: ' + e.message);
              }
            }, 50);
          };
          script.onerror = () => { clearTimeout(safetyTimeout); cleanup(); fail('Erro ao carregar html2canvas'); };
          ifrDoc.head.appendChild(script);
        } catch(e) {
          clearTimeout(safetyTimeout);
          cleanup();
          fail('Erro de acesso ao iframe: ' + e.message);
        }
      }, 150);
    };

    printIfr.src = 'https://tsi-app.com/' + href;
  };

  window._monFecharDetalhe = function() {
    expanded.clear();
    renderTable();
  };

  function _monSyncBotaoVoltar() {
    let btn = document.getElementById('mon-voltar-fixed');
    if (expanded.size === 0) {
      if (btn) btn.remove();
      return;
    }
    const wrap = document.getElementById('mon-table-wrap');
    if (!wrap) return;
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'mon-voltar-fixed';
      btn.innerHTML = '← Voltar';
      btn.onclick = function(e) { e.stopPropagation(); window._monFecharDetalhe(); };
      btn.style.cssText = 'position:fixed;z-index:2147483647;padding:5px 14px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:12px;font-weight:600;font-family:var(--mon-font);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.18);transition:background 0.15s,color 0.15s;';
      btn.onmouseover = function() { this.style.background = 'var(--mon-surface3)'; this.style.color = 'var(--mon-text)'; };
      btn.onmouseout  = function() { this.style.background = 'var(--mon-surface2)'; this.style.color = 'var(--mon-text-dim)'; };
      document.body.appendChild(btn);
    }
    const r = wrap.getBoundingClientRect();
    btn.style.top   = (r.top + 8) + 'px';
    btn.style.right = (window.innerWidth - r.right + 10) + 'px';
  }

  // ── VISIBILIDADE DAS MÉTRICAS ────────────────────────────────────────────────
  function _metricsHide() {
    const m = document.getElementById('mon-metrics');
    if (m) m.classList.add('mon-metrics-hidden');
  }
  function _metricsShow() {
    // Só mostra se não há expansão aberta e o scroll está no topo
    if (expanded.size > 0) return;
    const wrap = document.getElementById('mon-table-wrap');
    if (wrap && wrap.scrollTop > 10) return;
    const m = document.getElementById('mon-metrics');
    if (m) m.classList.remove('mon-metrics-hidden');
  }

  function _initMetricsScroll() {
    const wrap = document.getElementById('mon-table-wrap');
    if (!wrap || wrap._monScrollBound) return;
    wrap._monScrollBound = true;
    wrap.addEventListener('scroll', () => {
      const m = document.getElementById('mon-metrics');
      if (!m) return;
      if (wrap.scrollTop > 10) {
        m.classList.add('mon-metrics-hidden');
      } else if (expanded.size === 0) {
        m.classList.remove('mon-metrics-hidden');
      }
      // Sinaliza que o usuario esta scrollando — suspende re-render para evitar jank
      if (typeof renderTableV2 === 'function') {
        renderTableV2._scrolling = true;
        clearTimeout(renderTableV2._scrollEndTimer);
        renderTableV2._scrollEndTimer = setTimeout(() => {
          renderTableV2._scrolling = false;
        }, 150);
      }
    }, { passive: true });
  }

  function toggleRow(op, idx) {
    // V2: o detalhe abre num drawer lateral, não inline
    if (typeof window._monDrawerOpen === 'function') {
      if (window._monV2Selected === op.chave) {
        window._monDrawerClose();
      } else {
        window._monDrawerOpen(op);
      }
      return;
    }
    // Fallback (caso V2 não tenha carregado por algum motivo)
    const isOpen = expanded.has(op.chave);
    expanded.clear();
    if (!isOpen) {
      expanded.add(op.chave);
      _metricsHide();
    } else {
      _metricsShow();
    }
    renderTable();
  }

  // ── TOGGLE ────────────────────────────────────────────────────────────────────
  function toggleMonitor() {
    if (!document.getElementById('mon-panel')) createPanel();
    const p   = document.getElementById('mon-panel');
    const btn = document.getElementById('btn-mon');
    const RADAR_HTML = '<span class="mon-fab-badge"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
    if (p.style.display === 'none' || !p.style.display) {
      p.style.display = 'flex'; p.style.flexDirection = 'column';
      btn.innerHTML = RADAR_HTML;
    } else {
      p.style.display = 'none';
      btn.innerHTML = RADAR_HTML;
    }
    if (typeof _monSaveState === 'function') _monSaveState();
  }

  // ── AMPULHETA ANIMADA (countdown visual) ──────────────────────────────────────
  let _hgInterval = null;

  function startCountdown(totalSec) {
    if (totalSec === undefined) {
      const agora = new Date();
      totalSec = 60 - agora.getSeconds();
    }
    if (totalSec <= 0) totalSec = 60;

    if (_hgInterval) clearInterval(_hgInterval);

    let remaining = totalSec;
    // Alterna entre ⏳ e ⌛ para dar sensação de movimento
    let flip = false;

    const tick = () => {
      const count = document.getElementById('mon-hg-count');
      const icon  = document.getElementById('mon-hg-icon');
      if (!count) return;

      count.textContent = remaining + 's';
      if (icon) {
        flip = !flip;
        icon.textContent = flip ? '⌛' : '⏳';
      }
      remaining--;

      if (remaining < 0) {
        clearInterval(_hgInterval);
        _hgInterval = null;
        if (count) count.textContent = '—';
        if (icon)  icon.textContent  = '⏳';
      }
    };

    tick();
    _hgInterval = setInterval(tick, 1000);
  }

  // ── TIMER ALINHADO AO MINUTO FECHADO ─────────────────────────────────────────
  let _alignTimeout = null;

  function scheduleAlignedRefresh() {
    if (refreshTimer)  clearInterval(refreshTimer);
    if (_alignTimeout) clearTimeout(_alignTimeout);
    refreshTimer   = null;
    _alignTimeout  = null;

    // Cada usuário tem seu próprio ciclo de 60s a partir de quando abriu o monitor.
    // Isso distribui as requisições ao TSI ao longo do tempo (evita thundering herd).
    const REFRESH_MS = 130 * 1000; // 130s — reduz carga no servidor TSI
    startCountdown(130);
    refreshTimer = setInterval(() => {
      // Pausa se monitor minimizado
      const panel = document.getElementById('mon-panel');
      if (panel && panel.dataset.minimized === '1') { startCountdown(130); return; }
      silentRefresh();
      startCountdown(130);
    }, REFRESH_MS);
  }



  function startMonitor() {
    window._monRunning = true;
    monCarregarContatos();
    fetchOperations();
    scheduleAlignedRefresh();
    startWatchdog();
    // Carrega observações e snapshot de escalados no startup (igual ao manualRefresh)
    _obsLoad(() => renderTable());
    snapLoadRemote(() => setTimeout(_updateSnapDots, 500));

    // Fecha modal de lista com ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const m = document.getElementById('mon-lista-modal');
        if (m && m.classList.contains('open')) { m.classList.remove('open'); }
      }
    });
  }

  // ── DETECTA PÁGINA ATUAL DA URL ─────────────────────────────────────────────
  function getCurrentPageSuffix() {
    const match = window.location.href.match(/planejamento-operacional(_\d+)?/);
    if (!match) return '';
    return match[1] || ''; // ex: '' = pag1, '_2' = pag2, '_3' = pag3, etc.
  }

  function getCurrentPageUrl() {
    const suffix = getCurrentPageSuffix();
    return 'https://tsi-app.com/planejamento-operacional' + suffix;
  }

  function fetchOperations() {
    setLive('sync', 'Sincronizando…');

    const finalizar = (opsAll) => {
      const seen = new Set();
      const ops  = opsAll.filter(o => { if (seen.has(o.chave)) return false; seen.add(o.chave); return true; });

      const savedCache = cacheLoad();
      const prevCache  = apontCache;

      // Preserva ops _fromHist ao substituir operations
      const _histOps2 = operations.filter(o => o._fromHist && !ops.find(n => n.id === o.id));
      operations  = ops.concat(_histOps2);
      window._monOps = operations;
      apontCache  = {};
      ops.forEach(o => {
        if (o.id) {
          const mem = prevCache[o.id];
          const ses = savedCache[o.id];
          if (mem && mem !== 'loading') apontCache[o.id] = mem;
          else if (ses) apontCache[o.id] = ses;
        }
      });

      expanded    = new Set([...expanded].filter(c => ops.some(o => o.chave === c)));
      monitoradas = new Set();
      fetchQueue  = [];
      inQueue     = new Set();

      const opsComId = ops.filter(o => o.id);
      opsComId.forEach(o => { if (dentroJanela(o)) monitoradas.add(monKey(o)); });
      renderTable();
      setLive('live', 'Ao vivo');
      const sub = document.getElementById('mon-sub');
      if (sub) sub.textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR');

      const total = opsComId.length;
      let loaded = 0;

      opsComId.forEach(op => {
        if (apontCache[op.id]) {
          apontCache[op.id]._stale = true;
          loaded++;
        }
      });
      updateProgress(loaded, total);
      if (loaded > 0) updateMetrics();

      opsComId.forEach((op) => {
        const hadCache = !!apontCache[op.id];
        enfileirar(op, (novo) => {
          if (dentroJanela(op)) monitoradas.add(monKey(op));
          if (!hadCache) loaded++;
          updateProgress(loaded, total);
          updateCells(op, novo, null);
          updateMetrics();
          cacheSave();
          // Quando todos os fetches iniciais terminarem, garantir bolinhas corretas
          if (loaded >= total) setTimeout(_updateSnapDots, 100);
        }, true);
      });
    };

    // Aguarda a tabela ter linhas — usa MutationObserver + polling como fallback
    const _executarFinalizar = async (opsDoc) => {
      if (monPaginas >= 2) {
        // Busca pág 2, 3, 4... até não encontrar mais ops
        const todasOps = [...opsDoc];
        let pagNum = 2;
        while (true) {
          const pagUrl = 'https://tsi-app.com/planejamento-operacional_' + pagNum;
          try {
            const docN = await fetchDoc(pagUrl);
            const opsPagN = parseOpsFromDoc(docN);
            console.log('[Monitor] Ops pág.' + pagNum + ':', opsPagN.length);
            if (opsPagN.length === 0) break; // página vazia — fim da paginação
            todasOps.push(...opsPagN);
            if (pagNum === 2) _pag2LastFetch = Date.now();
            pagNum++;
          } catch(e) {
            console.warn('[Monitor] Falha ao buscar pág.' + pagNum + ', parando paginação');
            break;
          }
        }
        finalizar(todasOps);
      } else {
        finalizar(opsDoc);
      }
    };

    let _fetchDone = false;
    const _tryParse = () => {
      if (_fetchDone) return;
      const opsDoc = parseOpsFromDoc(document);
      if (opsDoc.length > 0) {
        _fetchDone = true;
        if (_tbodyObserver) { _tbodyObserver.disconnect(); _tbodyObserver = null; }
        console.log('[Monitor] Ops encontradas na página:', opsDoc.length);
        _executarFinalizar(opsDoc);
      }
    };

    // MutationObserver: dispara assim que o tbody mudar (linhas aparecerem)
    // FIX: observa apenas o tbody ou o container da tabela, não document.body com subtree
    // (subtree:true no body inteiro disparava para qualquer mudança do monitor, criando loop)
    const _tbodyTarget = document.getElementById('mon-tbody') || document.querySelector('table tbody') || document.body;
    const _tbodyObs_opts = _tbodyTarget === document.body
      ? { childList: true }
      : { childList: true, subtree: true };
    let _tbodyObserver = new MutationObserver(() => _tryParse());
    _tbodyObserver.observe(_tbodyTarget, _tbodyObs_opts);

    // Polling de segurança: tenta a cada 1s por até 60s
    let _pollTentativas = 0;
    const _poll = () => {
      if (_fetchDone) return;
      _tryParse();
      _pollTentativas++;
      if (_pollTentativas < 60) {
        setTimeout(_poll, 1000);
      } else {
        if (_tbodyObserver) { _tbodyObserver.disconnect(); _tbodyObserver = null; }
        if (!_fetchDone) {
          console.warn('[Monitor] Nenhuma op encontrada após 60s');
          finalizar([]);
        }
      }
    };
    setTimeout(_poll, 500);
  }

  // ── SELETOR DE PÁGINAS ────────────────────────────────────────────────────────
  window._monSetPaginas = function(n, btnEl) {
    monPaginas = n;
    document.querySelectorAll('.mon-pag-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    manualRefresh();
  };

  // ── DETECTA NAVEGAÇÃO SPA (mudança de URL sem reload) ────────────────────────
  function watchPageNavigation() {
    let lastUrl = window.location.href;
    // CORREÇÃO: flag para evitar duplo disparo quando MutationObserver e pushState/replaceState
    // detectam a mesma navegação simultaneamente, causando race condition e loop de páginas
    let _navHandled = false;
    let _navHandledTimer = null;

    const _handleNavChange = (currentUrl, origem) => {
      if (currentUrl === lastUrl) return;
      if (_navHandled) return; // já foi tratado por outro mecanismo neste ciclo
      lastUrl = currentUrl;
      _navHandled = true;
      if (_navHandledTimer) clearTimeout(_navHandledTimer);
      _navHandledTimer = setTimeout(() => { _navHandled = false; }, 500);

      if (!currentUrl.includes('planejamento-operacional')) return;
      console.log('[Monitor] Navegação detectada (' + origem + '):', currentUrl);
      setTimeout(() => {
        iframesInUse = {};
        fetchQueue   = [];
        inQueue      = new Set();
        apontCache   = {};
        fetchOperations();
      }, origem === 'mutation' ? 5000 : 3000);
    };

    // Observa apenas o tbody principal (muito mais leve que document.body subtree)
    // para detectar troca de página SPA
    // FIX: não usa MutationObserver no body para detecção de navegação — o monitor
    // renderiza cards constantemente no body, causando falsos positivos de "navegação"
    // que resetavam o apontCache e perdiam dados. Detecção agora é só via pushState/replaceState.
    // MutationObserver apenas como último fallback se ambos os métodos de history API falharem.
    const _navTarget = document.getElementById('mon-tbody') || document.body;
    let _lastUrlCheck = window.location.href;
    const observer = new MutationObserver(() => {
      // FIX: verifica a URL diretamente em vez de confiar na mutation
      // Só processa se a URL realmente mudou (evita falsos positivos do render do monitor)
      const currentUrl = window.location.href;
      if (currentUrl !== _lastUrlCheck) {
        _lastUrlCheck = currentUrl;
        _handleNavChange(currentUrl, 'mutation');
      }
    });

    // FIX: observa apenas o _navTarget (tbody ou body sem subtree) não o body inteiro
    // O tbody é mais específico; se for body, usa childList sem subtree (já estava assim)
    observer.observe(_navTarget, { childList: true });

    // Também intercepta pushState/replaceState (navegação SPA via history API)
    const origPush    = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);

    history.pushState = function(...args) {
      origPush(...args);
      setTimeout(() => {
        const url = window.location.href;
        _handleNavChange(url, 'pushState');
      }, 100);
    };

    history.replaceState = function(...args) {
      origReplace(...args);
      setTimeout(() => {
        const url = window.location.href;
        _handleNavChange(url, 'replaceState');
      }, 100);
    };
  }

  // ── INIT ──────────────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', function() {
    if (window._monSuppressStateSave) return;
    if (typeof _monSaveState === 'function') _monSaveState();
  });

  _loadFirebaseAndInit(() => {
  setTimeout(() => {
    ensureIframes();
    injectButton();
    createPanel();
    _initMetricsScroll();

    // ── Perf: limpa will-change do header após a animação de entrada (120ms)
    // para não manter camadas compositor desnecessárias
    setTimeout(() => {
      const hdr = document.querySelector('#mon-panel .mon-hd-v2');
      if (hdr) hdr.style.willChange = 'auto';
      const tb = document.querySelector('#mon-panel .mon-toolbar-v3');
      if (tb) tb.style.willChange = 'auto';
    }, 300);

    // ── Restaura monPaginas ANTES de startMonitor para que fetchOperations use o valor correto ──
    try {
      const _stateRawEarly = sessionStorage.getItem(_MON_STATE_KEY);
      if (_stateRawEarly) {
        const _stateEarly = JSON.parse(_stateRawEarly);
        if (_stateEarly.monPaginas && _stateEarly.monPaginas > 1) {
          monPaginas = _stateEarly.monPaginas;
          // Marca o botão correto como ativo
          setTimeout(function() {
            document.querySelectorAll('.mon-pag-btn').forEach(function(b) {
              b.classList.toggle('active', parseInt(b.dataset.pag || b.textContent) === monPaginas);
            });
          }, 500);
          console.log('[Monitor] Restaurando monPaginas:', monPaginas);
        }
      }
    } catch(e) {}

    if (!window._monRunning) startMonitor();
    watchPageNavigation();
    if (Notification.permission === 'default') pedirPermissaoNotificacao();

    // ── Restaura estado completo do monitor após qualquer reload do TSI ──────────
    try {
      const _stateRaw = sessionStorage.getItem(_MON_STATE_KEY);
      if (_stateRaw) {
        const _state = JSON.parse(_stateRaw);

        // Restaura página (se era pag2, pag3 etc. e agora estamos em pag1)
        // CORREÇÃO: só redireciona se veio de reload interno do sistema (não de navegação voluntária entre páginas),
        // evitando o loop onde salvar página 1 no beforeunload fazia o sistema "puxar" de volta à página 1
        // ao navegar para página 2, 3, etc.
        const _veioDeReloadInternoParaPagina = sessionStorage.getItem(_MON_REOPEN_PANEL_KEY) === '1'
          || sessionStorage.getItem(_MON_REOPEN_VALES_KEY)
          || sessionStorage.getItem(_MON_REOPEN_HIST_KEY)
          || sessionStorage.getItem(_MON_REOPEN_OP_KEY);
        if (_state.page && _veioDeReloadInternoParaPagina && !window.location.href.includes(_state.page.replace(/https?:\/\/[^/]+/, ''))) {
          // Navega para a página certa antes de continuar (apenas em reloads internos)
          window.location.href = _state.page;
        } else {
          // Abre painel se estava aberto — SÓ se veio de reload interno do sistema
          // (evita monitor abrir sozinho ao entrar manualmente na página)
          const _veioDeReloadInterno = sessionStorage.getItem(_MON_REOPEN_PANEL_KEY) === '1'
            || sessionStorage.getItem(_MON_REOPEN_VALES_KEY)
            || sessionStorage.getItem(_MON_REOPEN_HIST_KEY)
            || sessionStorage.getItem(_MON_REOPEN_OP_KEY);
          if (_state.panelOpen && _veioDeReloadInterno) {
            const panel = document.getElementById('mon-panel');
            const btn   = document.getElementById('btn-mon');
            if (panel && (panel.style.display === 'none' || !panel.style.display)) {
              panel.style.display = 'flex';
              panel.style.flexDirection = 'column';
              if (btn) btn.style.display = 'none';
            }
          }

          // Reabre op se havia uma aberta — aguarda dados completos
          // v60.70: PULA esta reabertura via drawer se veio de enviar escala/report.
          // Nesse caso, o bloco específico abaixo (_MON_REOPEN_OP_KEY) cuida da
          // reabertura sem abrir o drawer (apenas expande a linha inline),
          // conforme o fix do v60.66. Sem este guard, os dois fluxos rodavam
          // em paralelo: o drawer abria por cima e a renderTable() rodava no meio,
          // deixando os botões com handlers órfãos — exigindo refresh manual.
          const _ehReopenDeEscalaReport = !!sessionStorage.getItem(_MON_REOPEN_OP_KEY);
          if (_state.opId && !_ehReopenDeEscalaReport) {
            let _stTentativas = 0;
            const _stPoll = setInterval(function() {
              _stTentativas++;
              const _stOp = operations.find(o => o.id === _state.opId);
              if (_stOp) {
                const _stCached = apontCache[_state.opId];
                const _stTemDados = _stCached && _stCached !== 'loading' && typeof _stCached.apontado === 'number';
                if (!_stTemDados && _stTentativas < 100) return;
                clearInterval(_stPoll);
                if (typeof window._monDrawerOpen === 'function') {
                  window._monDrawerOpen(_stOp);
                  setTimeout(() => {
                    const row = document.querySelector('.mon-row-v2[data-chave="' + _stOp.chave + '"]');
                    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 200);
                }
              }
              if (_stTentativas > 120) clearInterval(_stPoll);
            }, 500);
          }
        }
      }
    } catch(e) {}

    // Restaura estado minimizado se estava assim antes do reload
    try {
      if (sessionStorage.getItem(MINIM_KEY) === '1') {
        const panel = document.getElementById('mon-panel');
        if (panel) {
          panel.style.display = 'flex';
          panel.style.flexDirection = 'column';
        }
        window._monMinimize(); // entra no estado minimizado
      }
    } catch(e) {}

    // Abre o painel automaticamente se veio de um reload de escala/report
    try {
      if (sessionStorage.getItem(_MON_REOPEN_PANEL_KEY) === '1') {
        sessionStorage.removeItem(_MON_REOPEN_PANEL_KEY);
        const panel = document.getElementById('mon-panel');
        const btn   = document.getElementById('btn-mon');
        if (panel && panel.style.display === 'none') {
          panel.style.display = 'flex';
          panel.style.flexDirection = 'column';
          if (btn) btn.style.display = 'none';
        }
      }
    } catch(e) {}

    // ── Reabre op expandida se a página recarregou após enviar escala/report ──
    try {
      const reopenOpRaw = sessionStorage.getItem(_MON_REOPEN_OP_KEY);
      if (reopenOpRaw) {
        sessionStorage.removeItem(_MON_REOPEN_OP_KEY);
        const { opId: reopenId, page: reopenPage } = JSON.parse(reopenOpRaw);
        // Se estiver na página errada, navega primeiro
        if (reopenPage && !window.location.href.includes(reopenPage.replace(/https?:\/\/[^/]+/, ''))) {
          window.location.href = reopenPage;
        } else {
          let tentativas = 0;
          const poll = setInterval(function() {
            tentativas++;
            const op = operations.find(o => o.id === reopenId);
            if (op) {
              // Aguarda o cache ter dados reais (não só 'loading') antes de abrir o modal
              // Isso evita abrir com dados incompletos onde os botões ficam sem onclick
              const cached = apontCache[reopenId];
              const temDados = cached && cached !== 'loading' && typeof cached.apontado === 'number';
              if (!temDados && tentativas < 100) return; // ainda carregando, aguarda
              clearInterval(poll);
              // Após enviar escala/report: só rola até a linha, sem expandir
              // (expanded.add causava o botão "← Voltar" órfão no painel V2)
              setTimeout(() => {
                const row = document.querySelector('.mon-row-v2[data-chave="' + op.chave + '"]');
                if (row) {
                  row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  row.style.transition = 'background 0.3s';
                  row.style.background = 'rgba(99,102,241,0.18)';
                  setTimeout(() => { row.style.background = ''; }, 1200);
                }
              }, 200);
            }
            if (tentativas > 120) clearInterval(poll);
          }, 500);
        }
      }
    } catch(e) {}

    // ── Reabre modal de vales se a página recarregou após gerar um vale ──
    try {
      const reopenOpId  = sessionStorage.getItem(_MON_REOPEN_VALES_KEY);
      const reopenHistId = sessionStorage.getItem(_MON_REOPEN_HIST_KEY);
      if (reopenOpId) {
        sessionStorage.removeItem(_MON_REOPEN_VALES_KEY);
        sessionStorage.removeItem(_MON_REOPEN_HIST_KEY);
        console.log('[Monitor] Reopen vales para opId:', reopenOpId, '| fromHist:', !!reopenHistId);
        // Se veio do historico: aguarda _reportHistCarregar terminar antes de abrir
        if (reopenHistId && typeof window._monAbrirDoHistorico === 'function') {
          const _abrirHistComDados = function() {
            // Injeta op do historico em operations se necessario
            let opHist = operations.find(function(o) { return o.id === reopenOpId; });
            if (!opHist) {
              const hist = _reportHist.find(function(e) { return e.opId === reopenOpId; });
              if (hist) {
                opHist = { id: hist.opId, chave: hist.chave, sigla: hist.sigla || '', site: hist.site || '', hora: hist.hora || '', lider: (hist.lideres && hist.lideres[0]) || '', liderCompleto: (hist.lideres && hist.lideres[0]) || '', qtd: hist.solicitado || 0, status: '', time: '', bubbles: [], escAtual: -1, _fromHist: true };
                operations.push(opHist);
              }
            } else {
              // Garante _fromHist mesmo em reopen múltiplos (2ª, 3ª vez)
              opHist._fromHist = true;
            }
            console.log('[Monitor] Abrindo modal do historico após carregar dados:', reopenHistId);
            // Limpa cache para forçar re-fetch com dados frescos (vale pode ter mudado)
            if (opHist) delete apontCache[opHist.id];
            // Abre o histórico — ele faz o fetch internamente
            window._monAbrirDoHistorico(reopenHistId);
            // Aguarda o cache ficar pronto (preenchido pelo _monAbrirDoHistorico) e abre vales
            var _valesTentativas = 0;
            var _valesPoll = setInterval(function() {
              _valesTentativas++;
              var dHist = apontCache[reopenOpId];
              if (dHist && dHist !== 'loading') {
                clearInterval(_valesPoll);
                if (dHist.vales && dHist.vales.length > 0) {
                  console.log('[Monitor] Cache carregado, abrindo painel de vales');
                  var label = (opHist ? opHist.sigla + ' | ' + opHist.site + ' · ' + opHist.hora : '');
                  window._monAbrirVales(reopenOpId, JSON.stringify(dHist.vales), label);
                }
              }
              if (_valesTentativas > 80) clearInterval(_valesPoll); // timeout 40s
            }, 500);
          };
          // Bug fix: aguarda _reportHistCarregar antes de abrir (evita _reportHist vazio)
          if (_reportHist && _reportHist.length > 0) {
            _abrirHistComDados();
          } else {
            _reportHistCarregar(_abrirHistComDados);
          }
          return;
        }

        // Fluxo normal (nao veio do historico)
        let tentativas = 0;
        const poll = setInterval(function() {
          tentativas++;
          const op = operations.find(function(o) { return o.id === reopenOpId; });
          const d  = apontCache[reopenOpId];
          if (op && d && d !== 'loading' && d.eaptHref) {
            clearInterval(poll);
            renderTable();
            console.log('[Monitor] Reabrindo modal de vales, vales:', d.vales && d.vales.length);
            if (d.vales && d.vales.length > 0) {
              const label = op.sigla + ' | ' + op.site + ' · ' + op.hora;
              const dFresh = apontCache[reopenOpId];
              const valesFresh = (dFresh && dFresh !== 'loading' && dFresh.vales) ? dFresh.vales : d.vales;
              window._monAbrirVales(reopenOpId, JSON.stringify(valesFresh), label);
            }
          }
          if (tentativas > 120) {
            clearInterval(poll);
            console.warn('[Monitor] Reopen vales timeout — op não carregou:', reopenOpId);
          }
        }, 500);
      }
    } catch(e) { console.error('[Monitor] Reopen vales erro:', e); }
  }, 2000);

  // ── Inicialização dos dados Firebase (deve ocorrer após _fbDb estar pronto) ──
  // Faltas, obs, histórico e snapshots precisam do Firebase conectado — por isso
  // ficam aqui dentro do callback, e não no fluxo síncrono do script (onde _fbDb ainda é null).
  _faltasLoad();

  _obsLoad(() => {
    // Remove do set de vistas ops que não têm mais obs (limpas)
    Object.keys(window._monObsCache || {}).forEach(id => {
      const o = window._monObsCache[id];
      if (!o || !o.texto) _monObsVistas.delete(id);
    });
    _obsVistasSave();
    if (operations.length > 0) renderTable();
  });

  _reportHistCarregar(() => {});

  snapLoadRemote(() => {
    if (operations.length > 0) renderTable();
  });

  _carregarContatosLideres();

  }); // fim _loadFirebaseAndInit

  // ══════════════════════════════════════════════════════════════════════════════
  // ADDON v20: MENSAGEM DE ESCALA (WA) + GMAIL DE ESCALA
  // ══════════════════════════════════════════════════════════════════════════════

  // ── CONTATOS (Firebase — migrado do Supabase) ────────────────────────────────
  let _monContatos = null;

  function monCarregarContatos() {
    try {
      const local = localStorage.getItem('tsi_contatos');
      if (local) _monContatos = JSON.parse(local);
    } catch(e) {}
    _fbDb.ref('tsi_contatos').once('value')
      .then(snap => {
        const val = snap.val();
        if (!val || typeof val !== 'object' || Object.keys(val).length === 0) return;
        // Firebase guarda { CHAVE: { nome, emails } } — mesmo formato interno
        _monContatos = val;
        try { localStorage.setItem('tsi_contatos', JSON.stringify(_monContatos)); } catch(e) {}
      })
      .catch(() => {});
  }

  function monEmailsDaOp(op) {
    if (!_monContatos || !op.chave) return [];
    const chaveUp = op.chave.toUpperCase();
    const unidade = Object.keys(_monContatos).find(k => chaveUp.startsWith(k.toUpperCase()));
    if (!unidade) return [];
    const u = _monContatos[unidade];
    return (u && Array.isArray(u.emails)) ? u.emails : [];
  }

  // Expõe lookup por opId para uso no tooltip inline do botão Gmail
  window._monEmailsDaOpById = function(opId) {
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!op) return [];
    return monEmailsDaOp(op);
  };

  // ── GERENCIADOR DE CONTATOS ───────────────────────────────────────────────────
  window._monAbrirGerenciarContatos = function() {
    const old = document.getElementById('mon-contatos-modal');
    if (old) old.remove();

    // Cópia local dos contatos para edição
    const contatos = JSON.parse(JSON.stringify(_monContatos || {}));

    // ── Monta estrutura fixa do modal (só o #mgc-body é atualizado) ──
    const overlay = document.createElement('div');
    overlay.id = 'mon-contatos-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:var(--mon-font,system-ui,sans-serif)';

    const box = document.createElement('div');
    box.style.cssText = 'background:var(--mon-bg,#fff);border-radius:16px;width:600px;max-width:96vw;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.4),0 0 0 1px var(--mon-border,#e0e0e0)';

    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:16px 20px 14px;border-bottom:1px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);flex-shrink:0;">
        <span style="font-size:20px;">📧</span>
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:700;color:var(--mon-text,#222);">Gerenciar Destinatários</div>
          <div style="font-size:11px;color:var(--mon-text-faint,#888);margin-top:1px;">E-mails por unidade para envio de escala via Gmail</div>
        </div>
        <button id="mgc-close" style="width:30px;height:30px;border-radius:8px;border:1px solid var(--mon-border2,#ccc);background:transparent;color:var(--mon-text-faint,#888);font-size:16px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <div id="mgc-body" style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;"></div>
      <div style="display:flex;align-items:center;gap:8px;padding:12px 20px;border-top:1px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);flex-shrink:0;">
        <button id="mgc-add" style="height:34px;padding:0 14px;border-radius:8px;border:1px solid var(--mon-accent-border,rgba(79,70,229,0.3));background:var(--mon-accent-bg,rgba(79,70,229,0.07));color:var(--mon-accent,#4f46e5);font-size:13px;font-weight:600;cursor:pointer;">+ Nova Unidade</button>
        <div style="flex:1;"></div>
        <span id="mgc-status" style="font-size:12px;color:var(--mon-text-faint,#888);"></span>
        <button id="mgc-save" style="height:34px;padding:0 18px;border-radius:8px;border:none;background:var(--mon-green,#16a34a);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">💾 Salvar</button>
      </div>`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const mgcBody   = box.querySelector('#mgc-body');
    const btnAdd    = box.querySelector('#mgc-add');
    const btnSave   = box.querySelector('#mgc-save');
    const btnClose  = box.querySelector('#mgc-close');
    const statusEl  = box.querySelector('#mgc-status');

    // ── Fecha ao clicar no overlay (fora do box) ──
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    btnClose.addEventListener('click', function() { overlay.remove(); });

    // ── Cria uma row DOM para uma unidade ──
    function criarRow(chave, nome, emailsArr) {
      const row = document.createElement('div');
      row.className = 'mgc-row';
      row.dataset.chave = chave;
      row.style.cssText = 'background:var(--mon-surface,#fff);border:1px solid var(--mon-border,#e0e0e0);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;';

      const topo = document.createElement('div');
      topo.style.cssText = 'display:flex;align-items:center;gap:8px;';

      const inpChave = document.createElement('input');
      inpChave.className = 'mgc-chave-input';
      inpChave.value = chave;
      inpChave.placeholder = 'Chave (ex: POAMEL)';
      inpChave.style.cssText = 'font-family:var(--mon-mono,monospace);font-size:12px;font-weight:700;color:var(--mon-accent,#4f46e5);background:var(--mon-accent-bg,rgba(79,70,229,0.08));border:1px solid var(--mon-accent-border,rgba(79,70,229,0.25));border-radius:6px;padding:4px 9px;width:120px;text-transform:uppercase;';

      const inpNome = document.createElement('input');
      inpNome.className = 'mgc-nome-input';
      inpNome.value = nome || '';
      inpNome.placeholder = 'Nome da unidade';
      inpNome.style.cssText = 'flex:1;font-size:13px;background:var(--mon-surface2,#f7f7f7);border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;padding:5px 10px;color:var(--mon-text,#222);';

      const btnDel = document.createElement('button');
      btnDel.className = 'mgc-del-btn';
      btnDel.title = 'Remover unidade';
      btnDel.textContent = '✕';
      btnDel.style.cssText = 'width:28px;height:28px;border-radius:6px;border:1px solid var(--mon-red-border,#fca5a5);background:var(--mon-red-bg,rgba(220,38,38,0.06));color:var(--mon-red,#dc2626);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
      btnDel.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm('Remover unidade "' + inpChave.value + '"?')) {
          row.remove();
        }
      });

      topo.appendChild(inpChave);
      topo.appendChild(inpNome);
      topo.appendChild(btnDel);

      const txtEmails = document.createElement('textarea');
      txtEmails.className = 'mgc-emails-input';
      txtEmails.rows = 3;
      txtEmails.placeholder = 'Um e-mail por linha';
      txtEmails.value = emailsArr.join('\n');
      txtEmails.style.cssText = 'width:100%;box-sizing:border-box;font-family:var(--mon-mono,monospace);font-size:12px;background:var(--mon-surface2,#f7f7f7);border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;padding:8px 10px;color:var(--mon-text,#222);resize:vertical;';

      row.appendChild(topo);
      row.appendChild(txtEmails);
      return row;
    }

    // ── Renderiza rows iniciais ──
    Object.keys(contatos).sort().forEach(function(chave) {
      const u = contatos[chave];
      mgcBody.appendChild(criarRow(chave, u.nome || '', u.emails || []));
    });

    // ── Botão Nova Unidade ──
    btnAdd.addEventListener('click', function(e) {
      e.stopPropagation();
      const novaChave = 'NOVA';
      const row = criarRow(novaChave, '', []);
      mgcBody.appendChild(row);
      row.querySelector('.mgc-chave-input').focus();
      row.querySelector('.mgc-chave-input').select();
      setTimeout(function() { mgcBody.scrollTop = mgcBody.scrollHeight; }, 30);
    });

    // ── Botão Salvar ──
    btnSave.addEventListener('click', async function(e) {
      e.stopPropagation();
      // Coleta estado atual de todas as rows
      const novoContatos = {};
      let ok = true;
      mgcBody.querySelectorAll('.mgc-row').forEach(function(row) {
        const chave = row.querySelector('.mgc-chave-input').value.trim().toUpperCase();
        const nome  = row.querySelector('.mgc-nome-input').value.trim();
        const emailsRaw = row.querySelector('.mgc-emails-input').value;
        const emails = emailsRaw.split('\n').map(function(e){ return e.trim(); }).filter(Boolean);
        if (chave) novoContatos[chave] = { nome: nome, emails: emails };
      });

      btnSave.disabled = true;
      btnSave.textContent = 'Salvando…';
      statusEl.textContent = '';
      statusEl.style.color = 'var(--mon-text-faint,#888)';

      try {
        // Salva todos os contatos de uma vez no Firebase
        await _fbDb.ref('tsi_contatos').set(novoContatos);

        // Remove chaves deletadas individualmente
        const chavesAtuais = Object.keys(novoContatos);
        const chavesAntigas = Object.keys(_monContatos || {});
        const deletadas = chavesAntigas.filter(c => !chavesAtuais.includes(c));
        for (const chave of deletadas) {
          await _fbDb.ref('tsi_contatos/' + chave).remove();
        }

        _monContatos = novoContatos;
        try { localStorage.setItem('tsi_contatos', JSON.stringify(_monContatos)); } catch(err) {}
        btnSave.textContent = '✅ Salvo!';
        statusEl.style.color = 'var(--mon-green,#16a34a)';
        statusEl.textContent = 'Contatos atualizados com sucesso.';
        setTimeout(function() {
          btnSave.disabled = false;
          btnSave.textContent = '💾 Salvar';
          statusEl.textContent = '';
        }, 2500);
        if (false) { throw new Error('unreachable'); }
      } catch(err) {
        btnSave.disabled = false;
        btnSave.textContent = '💾 Salvar';
        statusEl.style.color = 'var(--mon-red,#dc2626)';
        statusEl.textContent = '⚠ Erro ao salvar. Tente novamente.';
      }
    });
  };

  // ── FIM GERENCIADOR DE CONTATOS ───────────────────────────────────────────────

  // ── MENSAGENS AUTOMÁTICAS DE ESCALA / APONTAMENTOS ───────────────────────────

  function _monWppSaudacao() {
    const h = new Date().getHours();
    return h >= 0 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  // Gera mensagem de escala incompleta
  window._monWppMsgEscalaIncompleta = function(op, escalado, solicitado, nomeLider) {
    const faltam = solicitado - escalado;
    const saudacao = _monWppSaudacao();
    const nome = _wppNomeProprio((nomeLider || op.liderCompleto || op.lider || '').split('/')[0].trim().split(' ')[0]);
    const data = op.dataOp || '';
    const hora = op.hora || '';
    const sigla = op.sigla || op.chave || '';
    return (
      `${saudacao} ${nome}! 👋\n` +
      `Consta aqui em nosso sistema que a escala da operação *${sigla}* do dia *${data} às ${hora}* está incompleta, ` +
      `temos *${escalado}/${solicitado} escalados*, faltando *${faltam} colaborador${faltam > 1 ? 'es' : ''}*.\n\n` +
      `Como está o andamento da captação do time? Ficamos à disposição para ajudar no que precisar, ` +
      `qualquer problema sinalize com antecedência para passarmos a visibilidade ao cliente. 🙏`
    );
  };

  // Gera mensagem de escala não lançada
  window._monWppMsgEscalaNaoLancada = function(op, solicitado, nomeLider) {
    const saudacao = _monWppSaudacao();
    const nome = _wppNomeProprio((nomeLider || op.liderCompleto || op.lider || '').split('/')[0].trim().split(' ')[0]);
    const data = op.dataOp || '';
    const hora = op.hora || '';
    const sigla = op.sigla || op.chave || '';
    return (
      `${saudacao} ${nome}! 👋\n` +
      `Consta aqui em nosso sistema que a operação *${sigla}* do dia *${data} às ${hora}* ainda não possui escala lançada, ` +
      `são *${solicitado} colaborador${solicitado > 1 ? 'es' : ''}* solicitados e nenhum foi escalado até o momento.\n\n` +
      `Como está o andamento da captação? Ficamos à disposição para ajudar no que precisar, ` +
      `qualquer problema sinalize com antecedência para passarmos a visibilidade ao cliente. 🙏`
    );
  };

  // Gera mensagem de pendência de apontamentos
  window._monWppMsgApontamentos = function(op, apontado, solicitado, nomeLider) {
    const saudacao = _monWppSaudacao();
    const nome = _wppNomeProprio((nomeLider || op.liderCompleto || op.lider || '').split('/')[0].trim().split(' ')[0]);
    const data = op.dataOp || '';
    const hora = op.hora || '';
    const sigla = op.sigla || op.chave || '';
    return (
      `${saudacao} ${nome}! 👋\n` +
      `Em relação aos apontamentos da operação *${sigla}* do dia *${data} às ${hora}*, ` +
      `contamos com *${apontado}/${solicitado} registrados*. Poderia nos atualizar em relação ao restante?\n\n` +
      `Ficamos à disposição para ajudar no que precisar. 🙏`
    );
  };

  // Abre modal com a mensagem gerada e botão de envio via WhatsApp
  window._monWppMsgModal = function(op, tipo, dadosD, nomeLider) {
    const d = dadosD || (apontCache[op.id] && apontCache[op.id] !== 'loading' ? apontCache[op.id] : null);
    if (!d) return;

    // nomeLider passado explicitamente (líder clicado) tem prioridade
    const liderNome = nomeLider || (op.liderCompleto || op.lider || '').split('/')[0].trim();

    let texto = '';
    if (tipo === 'incompleta') {
      texto = window._monWppMsgEscalaIncompleta(op, d.escalado || 0, d.solicitado || op.qtd || 0, liderNome);
    } else if (tipo === 'nao_lancada') {
      texto = window._monWppMsgEscalaNaoLancada(op, d.solicitado || op.qtd || 0, liderNome);
    } else if (tipo === 'apontamentos') {
      texto = window._monWppMsgApontamentos(op, d.apontado || 0, d.solicitado || op.qtd || 0, liderNome);
    }
    if (!texto) return;

    const found = _wppBuscarTel(liderNome);
    const telLimpo = found && found.tel ? found.tel.replace(/\D/g, '') : '';

    const antigo = document.getElementById('mon-wpp-msg-modal');
    if (antigo) antigo.remove();

    const overlay = document.createElement('div');
    overlay.id = 'mon-wpp-msg-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--mon-bg,#fff);border-radius:14px;width:480px;max-width:96vw;box-shadow:0 8px 40px rgba(0,0,0,0.25);overflow:hidden;font-family:inherit">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--mon-border,#e0e0e0)">
          <span style="font-size:14px;font-weight:700;color:var(--mon-text,#1a1a2e)">📲 Mensagem para o Líder</span>
          <button onclick="document.getElementById('mon-wpp-msg-modal').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--mon-text-faint,#aaa)">✕</button>
        </div>
        <div style="padding:16px 20px">
          <textarea id="mon-wpp-msg-txt" rows="8"
            style="width:100%;box-sizing:border-box;font-family:inherit;font-size:13px;line-height:1.6;background:var(--mon-surface2,#f7f7f7);border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:10px 12px;color:var(--mon-text,#1a1a2e);resize:vertical"
          >${texto}</textarea>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button onclick="navigator.clipboard.writeText(document.getElementById('mon-wpp-msg-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>this.textContent='📋 Copiar',1800)})"
              style="flex:1;padding:9px;border-radius:8px;border:1.5px solid var(--mon-border,#e0e0e0);background:none;color:var(--mon-text,#444);font-size:13px;font-weight:600;cursor:pointer">
              📋 Copiar
            </button>
            ${telLimpo
              ? `<button onclick="window.open('https://wa.me/55${telLimpo}?text='+encodeURIComponent(document.getElementById('mon-wpp-msg-txt').value),'_blank')"
                  style="flex:2;padding:9px;border:none;border-radius:8px;background:#25D366;color:#fff;font-size:13px;font-weight:700;cursor:pointer">
                  WhatsApp →
                </button>`
              : `<button onclick="window._monWppAbrirModal('${op.id}','${nomeLider.replace(/'/g,"\\'")}');document.getElementById('mon-wpp-msg-modal').remove()"
                  style="flex:2;padding:9px;border:none;border-radius:8px;background:#25D366;color:#fff;font-size:13px;font-weight:700;cursor:pointer">
                  Cadastrar número →
                </button>`
            }
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);
  };

  // ── GERENCIADOR DE CONTATOS DOS LÍDERES ──────────────────────────────────────
  window._monAbrirGerenciarLideres = function() {
    const antigo = document.getElementById('mon-lideres-modal');
    if (antigo) { antigo.remove(); return; }

    // Agrupa líderes do _WPP_NOME_TEL (já carregado da nuvem + hardcoded)
    const lideres = Object.values(_WPP_NOME_TEL).slice().sort((a, b) => a.nome.localeCompare(b.nome));

    const overlay = document.createElement('div');
    overlay.id = 'mon-lideres-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:var(--mon-font,system-ui,sans-serif)';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    const box = document.createElement('div');
    box.style.cssText = 'background:var(--mon-bg,#fff);border-radius:16px;width:560px;max-width:96vw;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.4),0 0 0 1px var(--mon-border,#e0e0e0)';

    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:16px 20px 14px;border-bottom:1px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);flex-shrink:0">
        <span style="font-size:20px">📲</span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--mon-text,#222)">Contatos dos Líderes</div>
          <div style="font-size:11px;color:var(--mon-text-faint,#888);margin-top:1px">WhatsApp para mensagens de escala e apontamentos</div>
        </div>
        <button id="mgl-close" style="width:30px;height:30px;border-radius:8px;border:1px solid var(--mon-border2,#ccc);background:transparent;color:var(--mon-text-faint,#888);font-size:16px;cursor:pointer">✕</button>
      </div>
      <div id="mgl-body" style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:8px"></div>
      <div style="display:flex;align-items:center;gap:8px;padding:12px 20px;border-top:1px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);flex-shrink:0">
        <button id="mgl-add" style="height:34px;padding:0 14px;border-radius:8px;border:1px solid var(--mon-accent-border,rgba(79,70,229,0.3));background:var(--mon-accent-bg,rgba(79,70,229,0.07));color:var(--mon-accent,#4f46e5);font-size:13px;font-weight:600;cursor:pointer">+ Novo Líder</button>
        <div style="flex:1"></div>
        <span id="mgl-status" style="font-size:12px;color:var(--mon-text-faint,#888)"></span>
        <button id="mgl-save" style="height:34px;padding:0 18px;border-radius:8px;border:none;background:var(--mon-green,#16a34a);color:#fff;font-size:13px;font-weight:700;cursor:pointer">💾 Salvar</button>
      </div>`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const mglBody  = box.querySelector('#mgl-body');
    const btnAdd   = box.querySelector('#mgl-add');
    const btnSave  = box.querySelector('#mgl-save');
    const btnClose = box.querySelector('#mgl-close');
    const statusEl = box.querySelector('#mgl-status');

    btnClose.addEventListener('click', () => overlay.remove());

    function criarRow(nome, tel) {
      const row = document.createElement('div');
      row.className = 'mgl-row';
      row.style.cssText = 'display:flex;align-items:center;gap:8px;background:var(--mon-surface,#fff);border:1px solid var(--mon-border,#e0e0e0);border-radius:10px;padding:10px 14px';

      const inpNome = document.createElement('input');
      inpNome.className = 'mgl-nome';
      inpNome.value = nome || '';
      inpNome.placeholder = 'Nome completo';
      inpNome.style.cssText = 'flex:2;font-size:13px;background:var(--mon-surface2,#f7f7f7);border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;padding:6px 10px;color:var(--mon-text,#222)';

      const inpTel = document.createElement('input');
      inpTel.className = 'mgl-tel';
      inpTel.value = tel || '';
      inpTel.placeholder = 'Ex: 11 99999-0000';
      inpTel.type = 'tel';
      inpTel.style.cssText = 'flex:1;font-size:13px;background:var(--mon-surface2,#f7f7f7);border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;padding:6px 10px;color:var(--mon-text,#222)';

      const btnDel = document.createElement('button');
      btnDel.textContent = '✕';
      btnDel.title = 'Remover';
      btnDel.style.cssText = 'width:28px;height:28px;border-radius:6px;border:1px solid var(--mon-red-border,#fca5a5);background:var(--mon-red-bg,rgba(220,38,38,0.06));color:var(--mon-red,#dc2626);cursor:pointer;font-size:14px;flex-shrink:0';
      btnDel.addEventListener('click', () => {
        if (confirm('Remover "' + inpNome.value + '"?')) row.remove();
      });

      row.appendChild(inpNome);
      row.appendChild(inpTel);
      row.appendChild(btnDel);
      return row;
    }

    // Renderiza líderes existentes
    lideres.forEach(l => mglBody.appendChild(criarRow(l.nome, l.tel)));

    btnAdd.addEventListener('click', () => {
      const row = criarRow('', '');
      mglBody.appendChild(row);
      row.querySelector('.mgl-nome').focus();
      setTimeout(() => { mglBody.scrollTop = mglBody.scrollHeight; }, 30);
    });

    btnSave.addEventListener('click', async () => {
      const novoLideres = {};
      mglBody.querySelectorAll('.mgl-row').forEach(row => {
        const nome = row.querySelector('.mgl-nome').value.trim();
        const tel  = row.querySelector('.mgl-tel').value.trim();
        if (nome && tel) novoLideres[_wppNorm(nome)] = { nome, tel };
      });

      btnSave.disabled = true;
      btnSave.textContent = 'Salvando…';
      statusEl.textContent = '';

      try {
        if (!_fbDb) throw new Error('Firebase não disponível');
        await _fbDb.ref('tsi_lideres_contatos').set(novoLideres);

        // Atualiza cache local
        Object.keys(_WPP_NOME_TEL).forEach(k => delete _WPP_NOME_TEL[k]);
        Object.entries(novoLideres).forEach(([k, v]) => { _WPP_NOME_TEL[k] = v; });
        try { localStorage.setItem('tsi_lideres_contatos', JSON.stringify(novoLideres)); } catch(e) {}

        statusEl.style.color = 'var(--mon-green,#16a34a)';
        statusEl.textContent = 'Contatos salvos com sucesso.';
        btnSave.textContent = '✅ Salvo!';
        setTimeout(() => { btnSave.disabled = false; btnSave.textContent = '💾 Salvar'; statusEl.textContent = ''; }, 2500);
      } catch(e) {
        btnSave.disabled = false;
        btnSave.textContent = '💾 Salvar';
        statusEl.style.color = 'var(--mon-red,#dc2626)';
        statusEl.textContent = '⚠ Erro ao salvar. Tente novamente.';
      }
    });
  };

  // Carrega contatos dos líderes do Firebase na inicialização
  function _carregarContatosLideres() {
    try {
      const local = localStorage.getItem('tsi_lideres_contatos');
      if (local) {
        const parsed = JSON.parse(local);
        Object.entries(parsed).forEach(([k, v]) => { if (v.nome && v.tel) _WPP_NOME_TEL[k] = v; });
      }
    } catch(e) {}
    if (!_fbDb) return;
    _fbDb.ref('tsi_lideres_contatos').once('value')
      .then(snap => {
        const val = snap.val();
        if (!val || typeof val !== 'object') return;
        Object.entries(val).forEach(([k, v]) => { if (v.nome && v.tel) _WPP_NOME_TEL[k] = v; });
        try { localStorage.setItem('tsi_lideres_contatos', JSON.stringify(val)); } catch(e) {}
      })
      .catch(() => {});
  }

  // ── FIM GERENCIADOR DE LÍDERES ────────────────────────────────────────────────

  // ── MODAL DE CONFIGURAÇÕES ────────────────────────────────────────────────────
  window._monAbrirConfiguracoes = function() {
    const old = document.getElementById('mon-config-modal');
    if (old) { old.remove(); return; }

    const notifState = Notification.permission;
    const notifLabel = notifState === 'granted' ? '🔔 Notificações ativas' : '🔕 Ativar notificações';

    const overlay = document.createElement('div');
    overlay.id = 'mon-config-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999998;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--mon-bg,#fff);border-radius:14px;width:360px;max-width:95vw;box-shadow:0 8px 40px rgba(0,0,0,0.25);border:1px solid var(--mon-border,#e0e0e0);overflow:hidden">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--mon-border,#e0e0e0)">
          <span style="font-size:15px;font-weight:700;color:var(--mon-text,#1a1a2e)">⚙️ Configurações</span>
          <button onclick="document.getElementById('mon-config-modal').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--mon-text-faint,#aaa);padding:2px 6px">✕</button>
        </div>

        <!-- Itens -->
        <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px">

          <!-- Notificações -->
          <button onclick="window._monPedirNotif();document.getElementById('mon-config-modal').remove()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">${notifState === 'granted' ? '🔔' : '🔕'}</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">${notifLabel}</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Alertas sonoros de apontamento completo</div>
            </div>
          </button>

          <!-- Gerenciar e-mail -->
          <button onclick="window._monAbrirGerenciarContatos();document.getElementById('mon-config-modal').remove()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">📧</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">Destinatários de e-mail</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Gerenciar quem recebe os relatórios</div>
            </div>
          </button>

          <!-- Contatos dos Líderes -->
          <button onclick="window._monAbrirGerenciarLideres();document.getElementById('mon-config-modal').remove()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">📲</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">Contatos dos Líderes</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Gerenciar WhatsApp para mensagens de escala</div>
            </div>
          </button>

          <!-- Dark Mode -->
          <button onclick="window._monToggleTheme();const btn=this.querySelector('.dm-lbl');const isDark=document.getElementById('mon-panel')&&document.getElementById('mon-panel').classList.contains('mon-dark');btn.textContent=isDark?'🌙 Modo escuro ativo':'☀️ Modo claro ativo';"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">${document.getElementById('mon-panel')&&document.getElementById('mon-panel').classList.contains('mon-dark')?'🌙':'☀️'}</span>
            <div>
              <div class="dm-lbl" style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">${document.getElementById('mon-panel')&&document.getElementById('mon-panel').classList.contains('mon-dark')?'🌙 Modo escuro ativo':'☀️ Modo claro ativo'}</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Alternar tema claro / escuro</div>
            </div>
          </button>

          <!-- Histórico de Notificações -->
          <button onclick="document.getElementById('mon-config-modal').remove();window._monAbrirHistoricoNotif()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">🔔</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">Histórico de notificações</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Ver e limpar alertas recebidos</div>
            </div>
          </button>

          <!-- Saúde do servidor TSI -->
          <button onclick="window._monAbrirSaudeTSI();document.getElementById('mon-config-modal').remove()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.background='var(--mon-surface2)'" onmouseleave="this.style.background='var(--mon-surface,#fafafa)'">
            <span style="font-size:22px">📊</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-text,#1a1a2e)">Saúde do servidor TSI</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Requisições, tempo de resposta e erros</div>
            </div>
          </button>

          <!-- Limpar bolinhas SAP -->
          <button onclick="window._monLimparBolinhas();document.getElementById('mon-config-modal').remove()"
            style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;border:1.5px solid var(--mon-red-border,rgba(185,28,28,0.28));background:var(--mon-red-bg,rgba(185,28,28,0.06));cursor:pointer;text-align:left;width:100%"
            onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'">
            <span style="font-size:22px">🔴</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--mon-red,#b91c1c)">Limpar snapshots SAP</div>
              <div style="font-size:11px;color:var(--mon-text-faint,#888)">Apaga as bolinhas vermelhas de escala</div>
            </div>
          </button>

        </div>

        <div style="padding:12px 16px;border-top:1px solid var(--mon-border,#e0e0e0)">
          <button onclick="document.getElementById('mon-config-modal').remove()"
            style="width:100%;padding:9px;border-radius:8px;border:1.5px solid var(--mon-border,#e0e0e0);background:none;color:var(--mon-text-faint,#888);font-size:13px;cursor:pointer">
            Fechar
          </button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
  };

  // ── PAINEL DE SAÚDE DO SERVIDOR TSI ──────────────────────────────────────────
  window._monAbrirSaudeTSI = function() {
    const antigo = document.getElementById('mon-saude-modal');
    if (antigo) { antigo.remove(); return; }

    const total   = _diag.tsi.total;
    const erros   = _diag.tsi.erros;
    const tempos  = _diag.tsi.tempos;
    const avg     = tempos.length ? Math.round(tempos.reduce((a,b)=>a+b,0)/tempos.length) : 0;
    const max     = tempos.length ? Math.max(...tempos) : 0;
    const min     = tempos.length ? Math.min(...tempos) : 0;
    const p95     = tempos.length >= 5
      ? [...tempos].sort((a,b)=>a-b)[Math.floor(tempos.length * 0.95)]
      : avg;
    const uptime  = Math.round((Date.now() - _diag.inicio) / 60000);
    const txErro  = total > 0 ? ((erros/total)*100).toFixed(1) : '0.0';
    // Req/min: média dos últimos 5 minutos ou contador do minuto atual
    const rpm = _diag.tsi.porMinuto;
    const reqMinAtual = rpm.length > 0
      ? Math.round(rpm.slice(-5).reduce((a,b)=>a+b.n,0) / Math.min(rpm.length,5))
      : _diag.tsi._minAtual;

    const saude   = erros === 0 && avg < 2000 ? '🟢 Normal'
                  : erros === 0 && avg < 5000 ? '🟡 Lento'
                  : erros > 0  && avg < 5000  ? '🟡 Com erros'
                  : '🔴 Sobrecarregado';
    const corSaude = saude.includes('🟢') ? '#16a34a'
                   : saude.includes('🟡') ? '#d97706'
                   : '#dc2626';

    // Sparkline de tempos de resposta
    let spark = '';
    if (tempos.length >= 2) {
      const last = tempos.slice(-40);
      const maxT = Math.max(...last) || 1;
      const W = 280, H = 50;
      const pts = last.map((t,i) => {
        const x = Math.round(i/(last.length-1)*W);
        const y = Math.round(H - (t/maxT)*H);
        return x+','+y;
      }).join(' ');
      spark = `<div style="margin:10px 0 4px;font-size:11px;opacity:.6">Tempo de resposta (últimas ${last.length} req)</div>
        <svg width="${W}" height="${H}" style="display:block;border-radius:4px;background:var(--mon-surface,#f5f5f5)">
          <polyline points="${pts}" fill="none" stroke="${corSaude}" stroke-width="1.5"/>
        </svg>`;
    }

    const overlay = document.createElement('div');
    overlay.id = 'mon-saude-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    // Sparkline de tempo de resposta
    let sparkTempos = '';
    if (tempos.length >= 2) {
      const last = tempos.slice(-50);
      const maxT = Math.max(...last) || 1;
      const W = 300, H = 50;
      const pts = last.map((t,i) => {
        const x = Math.round(i/(last.length-1)*W);
        const y = Math.round(H - (t/maxT)*H);
        return x+','+y;
      }).join(' ');
      // Linha de referência em 2000ms
      const ref2s = Math.round(H - (2000/maxT)*H);
      sparkTempos = `
        <div style="margin:10px 0 4px;font-size:11px;opacity:.5">Tempo de resposta — últimas ${last.length} requisições</div>
        <svg width="${W}" height="${H}" style="display:block;border-radius:4px;background:var(--mon-surface,#f5f5f5);width:100%">
          ${ref2s > 0 && ref2s < H ? `<line x1="0" y1="${ref2s}" x2="${W}" y2="${ref2s}" stroke="#d97706" stroke-width="1" stroke-dasharray="4,3" opacity=".5"/>` : ''}
          <polyline points="${pts}" fill="none" stroke="${corSaude}" stroke-width="1.5"/>
        </svg>
        <div style="font-size:10px;opacity:.4;text-align:right">linha laranja = 2s</div>`;
    }

    // Sparkline req/min
    let sparkReqMin = '';
    if (rpm.length >= 2) {
      const maxN = Math.max(...rpm.map(p=>p.n)) || 1;
      const W = 300, H = 40;
      const pts = rpm.map((p,i) => {
        const x = Math.round(i/(rpm.length-1)*W);
        const y = Math.round(H - (p.n/maxN)*H);
        return x+','+y;
      }).join(' ');
      sparkReqMin = `
        <div style="margin:10px 0 4px;font-size:11px;opacity:.5">Req/min — histórico (${rpm.length} min)</div>
        <svg width="${W}" height="${H}" style="display:block;border-radius:4px;background:var(--mon-surface,#f5f5f5);width:100%">
          <polyline points="${pts}" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
        </svg>`;
    }

    // Último erro
    const ue = _diag.tsi.ultimoErro;
    const ultimoErroHtml = ue
      ? `<div style="background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2);border-radius:8px;padding:10px;margin-top:8px">
          <div style="font-size:11px;font-weight:700;color:#dc2626">⚠️ Último erro</div>
          <div style="font-size:11px;opacity:.7;margin-top:4px">HTTP ${ue.status} — ${new Date(ue.ts).toLocaleTimeString('pt-BR')}</div>
          <div style="font-size:10px;opacity:.5;word-break:break-all;margin-top:2px">${ue.url.replace('https://tsi-app.com/','')}</div>
        </div>`
      : '';

    // Última requisição
    const ultimaReqStr = _diag.tsi.ultimaReq
      ? new Date(_diag.tsi.ultimaReq).toLocaleTimeString('pt-BR')
      : '—';

    const bytesKB = Math.round(_diag.tsi.bytes / 1024);
    const bytesMB = (bytesKB / 1024).toFixed(2);

    overlay.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--mon-bg,#fff);border-radius:14px;width:380px;max-width:96vw;max-height:90vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.25);border:1px solid var(--mon-border,#e0e0e0)">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--mon-border,#e0e0e0);position:sticky;top:0;background:var(--mon-bg,#fff);z-index:1">
          <span style="font-size:15px;font-weight:700;color:var(--mon-text,#1a1a2e)">📊 Saúde do servidor TSI</span>
          <button onclick="document.getElementById('mon-saude-modal').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--mon-text-faint,#aaa);padding:2px 6px">✕</button>
        </div>

        <div style="padding:16px 20px">

          <!-- Status geral -->
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <div style="font-size:28px;font-weight:800;color:${corSaude}">${saude}</div>
            <div style="font-size:11px;opacity:.5">Monitor ativo há ${uptime} min<br>Última req: ${ultimaReqStr}</div>
          </div>

          <!-- Grid de métricas -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px">
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Total req</div>
              <div style="font-size:18px;font-weight:700;color:var(--mon-text,#1a1a2e)">${total}</div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Req/min</div>
              <div style="font-size:18px;font-weight:700;color:var(--mon-text,#1a1a2e)">${reqMinAtual}</div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Erros</div>
              <div style="font-size:18px;font-weight:700;color:${erros>0?'#dc2626':'#16a34a'}">${erros}<span style="font-size:10px"> (${txErro}%)</span></div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Tempo médio</div>
              <div style="font-size:18px;font-weight:700;color:${avg<2000?'#16a34a':avg<5000?'#d97706':'#dc2626'}">${avg}<span style="font-size:10px">ms</span></div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Tempo mín</div>
              <div style="font-size:18px;font-weight:700;color:var(--mon-text,#1a1a2e)">${min}<span style="font-size:10px">ms</span></div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Tempo máx</div>
              <div style="font-size:18px;font-weight:700;color:var(--mon-text,#1a1a2e)">${max}<span style="font-size:10px">ms</span></div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">P95</div>
              <div style="font-size:18px;font-weight:700;color:var(--mon-text,#1a1a2e)">${p95}<span style="font-size:10px">ms</span></div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Dedup</div>
              <div style="font-size:18px;font-weight:700;color:#60a5fa">${_diag.tsi.cancelados}</div>
            </div>
            <div style="background:var(--mon-surface,#f5f5f5);border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:10px;opacity:.5;margin-bottom:2px">Dados baixados</div>
              <div style="font-size:14px;font-weight:700;color:var(--mon-text,#1a1a2e)">${bytesKB > 1024 ? bytesMB + ' MB' : bytesKB + ' KB'}</div>
            </div>
          </div>

          <!-- Gráficos -->
          ${sparkTempos}
          ${sparkReqMin}
          ${ultimoErroHtml}

          <div style="font-size:10px;opacity:.35;margin-top:10px;text-align:center">Dados coletados desde o último reload • Feche e reabra para atualizar</div>
        </div>

        <div style="padding:12px 16px;border-top:1px solid var(--mon-border,#e0e0e0)">
          <button onclick="document.getElementById('mon-saude-modal').remove()"
            style="width:100%;padding:9px;border-radius:8px;border:1.5px solid var(--mon-border,#e0e0e0);background:none;color:var(--mon-text-faint,#888);font-size:13px;cursor:pointer">
            Fechar
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  };

  // ── FIM MODAL DE CONFIGURAÇÕES ────────────────────────────────────────────────

  // ── HISTÓRICO DE NOTIFICAÇÕES ─────────────────────────────────────────────────
  window._monAtualizarBadgeNotifHist = function() {
    const badge = document.getElementById('mon-notif-hist-badge');
    if (!badge) return;
    const arr = _notifHistLoad();
    const unread = arr.filter(e => !e.lida).length;
    if (unread > 0) {
      badge.style.display = 'block';
      badge.textContent = unread > 99 ? '99+' : String(unread);
    } else {
      badge.style.display = 'none';
    }
  };

  window._monAbrirHistoricoNotif = function() {
    const old = document.getElementById('mon-notif-hist-modal');
    if (old) { old.remove(); return; }

    // Marca todas como lidas ao abrir
    const arr = _notifHistLoad();
    arr.forEach(e => e.lida = true);
    _notifHistSave(arr);
    window._monAtualizarBadgeNotifHist();

    const overlay = document.createElement('div');
    overlay.id = 'mon-notif-hist-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999998;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--mon-bg,#fff);border-radius:14px;width:440px;max-width:96vw;max-height:80vh;box-shadow:0 8px 40px rgba(0,0,0,0.25);border:1px solid var(--mon-border,#e0e0e0);overflow:hidden;display:flex;flex-direction:column">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--mon-border,#e0e0e0);flex-shrink:0">
          <span style="font-size:15px;font-weight:700;color:var(--mon-text,#1a1a2e)">🔔 Notificações</span>
          <div style="display:flex;align-items:center;gap:8px">
            <button id="mon-notif-hist-clear-btn" onclick="window._monLimparHistoricoNotif()" title="Limpar histórico"
              style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface,#fafafa);color:var(--mon-text-faint,#888);cursor:pointer">
              🗑 Limpar
            </button>
            <button onclick="document.getElementById('mon-notif-hist-modal').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--mon-text-faint,#aaa);padding:2px 6px">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div id="mon-notif-hist-body" style="flex:1;overflow-y:auto;padding:8px 10px 12px"></div>
      </div>`;

    document.body.appendChild(overlay);
    window._monRenderNotifHist();
  };

  window._monRenderNotifHist = function() {
    const body = document.getElementById('mon-notif-hist-body');
    if (!body) return;
    const arr = _notifHistLoad();

    if (arr.length === 0) {
      body.innerHTML = '<div style="padding:32px;text-align:center;color:var(--mon-text-faint,#aaa);font-size:13px">Nenhuma notificação ainda</div>';
      return;
    }

    const TIPO_COR = {
      op_completa:    { bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.35)', text: '#065f46' },
      escala_completa:{ bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.35)', text: '#1e3a8a' },
      esc_entrou:     { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.30)',  text: '#991b1b' },
      esc_saiu:       { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.35)', text: '#78350f' },
    };

    body.innerHTML = arr.map((e, i) => {
      const cor = TIPO_COR[e.tipo] || { bg: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.12)', text: 'inherit' };
      const corpo = (e.corpo || '').replace(/\n/g, '<br>');
      return `<div style="margin:4px 0;padding:10px 12px;border-radius:9px;border:1px solid ${cor.border};background:${cor.bg};display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:18px;flex-shrink:0;margin-top:1px">${e.icone || '🔔'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:${cor.text};margin-bottom:2px">${e.titulo || ''}</div>
          <div style="font-size:11px;color:var(--mon-text-dim,#555);line-height:1.45">${corpo}</div>
          <div style="font-size:10px;color:var(--mon-text-faint,#aaa);margin-top:4px">🕐 ${e.horaStr || ''}</div>
        </div>
      </div>`;
    }).join('');
  };

  window._monLimparHistoricoNotif = function() {
    if (!confirm('Limpar todo o histórico de notificações?')) return;
    _notifHistSave([]);
    window._monAtualizarBadgeNotifHist();
    window._monRenderNotifHist();
  };

  // Inicializa badge ao carregar
  setTimeout(window._monAtualizarBadgeNotifHist, 500);

  // ── FIM HISTÓRICO DE NOTIFICAÇÕES ────────────────────────────────────────────

  // Expõe label do pdfLink para tooltip inline dos botões de assinatura
  window._monPdfLabelByIdx = function(opId, idx) {
    const d = apontCache[opId];
    if (!d || d === 'loading') return '';
    const l = (d.pdfLinks || [])[idx];
    return l && l.label ? '👤 ' + l.label : '';
  };

  // ── NOME DO USUÁRIO LOGADO ────────────────────────────────────────────────────
  function _monCopiar(texto, label) {
    try {
      navigator.clipboard.writeText(texto).then(() => {
        _monToastCopy(label || texto);
      }).catch(() => {
        // fallback
        const el = document.createElement('textarea');
        el.value = texto;
        el.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        _monToastCopy(label || texto);
      });
    } catch(e) {}
  }

  function _monToastCopy(label) {
    let t = document.getElementById('_mon_copy_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_mon_copy_toast';
      t.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#1e293b;color:#e2e8f0;font-size:13px;font-weight:700;padding:10px 18px;border-radius:10px;border:1px solid #334155;z-index:2147483647;pointer-events:none;transition:opacity 0.2s;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.28);display:flex;align-items:center;gap:8px;';
      document.body.appendChild(t);
    }
    t.textContent = '📋 Copiado: ' + label;
    t.style.opacity = '1';
    clearTimeout(t._monTimer);
    t._monTimer = setTimeout(() => { t.style.opacity = '0'; }, 1800);
  }

  function monNomeUsuario() {
    try {
      const el = document.querySelector('.headertop-nomeappsub');
      if (!el) return '';
      const nomeCompleto = el.textContent.trim();
      const primeiro = nomeCompleto.split(' ')[0] || '';
      return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
    } catch(e) { return ''; }
  }

  // ── SAUDAÇÃO DO DIA ───────────────────────────────────────────────────────────
  function _monIniciarSaudacao() {
    const elNome  = document.getElementById('mon-saudacao-nome');
    const elFrase = document.getElementById('mon-saudacao-frase');
    if (!elNome || !elFrase) return;

    const hora     = new Date().getHours();
    const nome     = monNomeUsuario() || 'Operador';
    const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

    elNome.textContent  = saudacao + ', ' + nome + ' 👋';
    elFrase.textContent = '✨ Bom plantão hoje!';
  }

  // ── SAUDAÇÃO ──────────────────────────────────────────────────────────────────
  function monSaudacao() {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  function monDataHoje() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return dd + '/' + mm + '/' + d.getFullYear();
  }

  // Extrai a data da chave da operação (ex: SRRDHL17052026... → "17/05/2026")
  // Fallback para monDataHoje() se a chave não tiver data válida
  function monDataDaOp(op) {
    if (op && op.chave) {
      const m = op.chave.match(/(\d{2})(\d{2})(\d{4})\d{4}$/);
      if (m) return m[1] + '/' + m[2] + '/' + m[3];
    }
    return monDataHoje();
  }

  function monHoraFormatada(hora) {
    if (!hora) return '';
    return hora.replace(':', 'h').replace(/h00$/, 'h');
  }

  function monHoraAssunto(hora) {
    if (!hora) return '';
    return hora.replace(':', 'H');
  }

  // ── MENSAGEM WHATSAPP DE ESCALA ───────────────────────────────────────────────
  window._monGerarMsgEscala = function(opId, btnEl) {
    const d  = apontCache[opId];
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!op) return;

    const atualizada = d && d !== 'loading' && d.listaEnviada === true;
    const previa     = !atualizada && d && d !== 'loading' && d.escalado > 0 && d.escalado < (d.solicitado || 0);
    const data       = monDataDaOp(op);
    const hora       = monHoraFormatada(op.hora);
    const saudacao   = monSaudacao();

    const texto = atualizada
      ? saudacao + ', time. Segue a escala TSI *atualizada* de *' + data + '* às *' + hora + '*.'
      : previa
        ? saudacao + ', time. Segue *Prévia* da escala TSI de *' + data + '* às *' + hora + '*.'
        : saudacao + ', time. Segue a escala TSI de *' + data + '* às *' + hora + '*.';

    navigator.clipboard.writeText(texto)
      .then(() => {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copiado!';
        btnEl.style.color = 'var(--mon-green)';
        _monToast('✅ Mensagem de escala copiada!', 'success');
        setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; }, 2500);
      })
      .catch(() => { prompt('Copie a mensagem:', texto); });
  };

  // ── MERGE PDF ASSINATURAS ─────────────────────────────────────────────────────

  // ── ABRIR PDF ASSINATURA (sempre pega do cache atualizado) ───────────────────
  window._monAbrirPdf = function(opId, idx) {
    const d = apontCache[opId];
    if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
    const links = d.pdfLinks || [];
    const l = links[idx];
    if (!l) { alert('Link n o encontrado.'); return; }
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    const _histEntry = !op ? _reportHist.find(e => String(e.opId) === String(opId)) : null;
    const chave = op ? op.chave : (_histEntry ? _histEntry.chave : null); // FIX: null em vez de opId (evita ID numérico como nome)
    const atualizada = d.listaEnviada === true;
    const _escPrevia = !atualizada && d.escalado > 0 && d.escalado < (d.solicitado || 0);
    const prefixo = atualizada ? 'ESCALA ATUALIZADA' : _escPrevia ? 'PRÉVIA ESCALA' : 'ESCALA';
    const sufixo = links.length > 1 ? ' [' + String(idx + 1).padStart(2, '0') + ']' : '';
    const _chaveLabel = chave || ('OP-' + String(opId)); // FIX: nunca usa ID numérico puro como nome
    const nomeArq = prefixo + ' - ' + _chaveLabel + sufixo + '.pdf';
    fetch('https://tsi-app.com/' + l.href, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
      .then(blob => {
        // For a download como octet-stream para o browser n o abrir inline
        const forcedBlob = new Blob([blob], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(forcedBlob);
        const a = document.createElement('a');
        a.href = url; a.download = nomeArq;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      })
      .catch(e => alert('Erro ao baixar PDF: ' + e.message));
  };

  // ── MERGE PDF ASSINATURAS (sempre pega do cache atualizado) ──────────────────
  window._monMergePdfAssinaturas = async function(opId, chave, btnEl) {
    const d = apontCache[opId];
    if (!d || d === 'loading') { alert('Aguarde os dados carregarem.'); return; }
    const hrefs = (d.pdfLinks || []).map(l => l.href);
    if (hrefs.length < 2) { alert('Menos de 2 PDFs disponíveis.'); return; }

    const orig = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = '⏳ Mesclando…';
    try {
      // Merger de PDF puro em JS — sem biblioteca externa.
      // Funciona para PDFs gerados pelo mesmo sistema (estrutura simples/linear).
      // Estratégia: baixa cada PDF, extrai as páginas via regex no xref/body,
      // renumera objetos e monta um novo PDF com todas as páginas em sequência.
      const enc = new TextEncoder();
      const dec = new TextDecoder('latin1'); // PDFs são binários latin1

      // Baixa todos os PDFs como ArrayBuffer
      const buffers = [];
      for (let i = 0; i < hrefs.length; i++) {
        btnEl.innerHTML = `⏳ Baixando ${i + 1}/${hrefs.length}…`;
        const url = 'https://tsi-app.com/' + hrefs[i];
        const resp = await fetch(url, { credentials: 'include' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status + ' ao baixar PDF ' + (i + 1));
        buffers.push(await resp.arrayBuffer());
      }

      btnEl.innerHTML = '⏳ Mesclando…';

      // Helper: converte ArrayBuffer → string latin1
      function buf2str(ab) {
        const arr = new Uint8Array(ab);
        let s = '';
        for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
        return s;
      }

      // Helper: string latin1 → Uint8Array
      function str2buf(s) {
        const arr = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i) & 0xff;
        return arr;
      }

      // Parseia um PDF simples e retorna { objects, pageRefs, mediaBox }
      // onde objects é Map<id_str, raw_object_string>
      function parsePdf(str) {
        const objects = new Map();
        // Captura todos os "N G obj ... endobj"
        const objRe = /(\d+)\s+(\d+)\s+obj\s*([\s\S]*?)endobj/g;
        let m;
        while ((m = objRe.exec(str)) !== null) {
          const key = m[1] + '_' + m[2];
          objects.set(key, { id: parseInt(m[1]), gen: parseInt(m[2]), raw: m[3].trim() });
        }

        // Encontra o objeto Pages (Type /Pages) e coleta refs das páginas
        let pageRefs = [];
        let mediaBox = null;
        for (const [, obj] of objects) {
          if (/\/Type\s*\/Pages\b/.test(obj.raw)) {
            // Extrai Kids
            const kids = obj.raw.match(/\/Kids\s*\[([^\]]+)\]/);
            if (kids) {
              const refs = [...kids[1].matchAll(/(\d+)\s+\d+\s+R/g)].map(r => parseInt(r[1]));
              pageRefs = refs;
            }
            // Extrai MediaBox se presente
            const mb = obj.raw.match(/\/MediaBox\s*\[([^\]]+)\]/);
            if (mb) mediaBox = mb[0];
          }
        }

        return { objects, pageRefs, mediaBox };
      }

      // Parseia cada PDF
      const pdfs = buffers.map(buf => parsePdf(buf2str(buf)));

      // Calcula offset base de renumeração de objetos para cada PDF
      // Reserva obj 1 para Catalog, obj 2 para Pages do merged
      let nextId = 3;
      const remaps = []; // remaps[pdfIdx] = Map<oldId, newId>

      for (const pdf of pdfs) {
        const remap = new Map();
        for (const [, obj] of pdf.objects) {
          remap.set(obj.id, nextId++);
        }
        remaps.push(remap);
      }

      // Função que reescreve referências "N G R" dentro de uma string de objeto
      function rewriteRefs(raw, remap) {
        return raw.replace(/(\d+)\s+(\d+)\s+R/g, (full, id, gen) => {
          const newId = remap.get(parseInt(id));
          return newId !== undefined ? newId + ' 0 R' : full;
        });
      }

      // Monta corpo do PDF mesclado
      let body = '%PDF-1.4\n';
      const offsets = new Map(); // id → byte offset

      const addObj = (id, raw) => {
        offsets.set(id, body.length);
        body += id + ' 0 obj\n' + raw + '\nendobj\n';
      };

      // Coleta todos os pageRefs do merged (com novos ids)
      const allPageNewIds = [];
      for (let pi = 0; pi < pdfs.length; pi++) {
        const pdf = pdfs[pi];
        const remap = remaps[pi];
        for (const oldPageId of pdf.pageRefs) {
          allPageNewIds.push(remap.get(oldPageId));
        }
      }

      // Objeto Pages do merged (id=2)
      const firstMediaBox = pdfs.find(p => p.mediaBox)?.mediaBox || '/MediaBox [0 0 595 842]';
      addObj(2,
        '<< /Type /Pages\n' +
        '   /Kids [' + allPageNewIds.map(id => id + ' 0 R').join(' ') + ']\n' +
        '   /Count ' + allPageNewIds.length + '\n' +
        '   ' + firstMediaBox + '\n>>'
      );

      // Adiciona todos os objetos de todos os PDFs, reescrevendo refs
      // Páginas recebem /Parent 2 0 R
      for (let pi = 0; pi < pdfs.length; pi++) {
        const pdf = pdfs[pi];
        const remap = remaps[pi];
        const pageIdSet = new Set(pdf.pageRefs);

        for (const [, obj] of pdf.objects) {
          // Pula o objeto Pages original (será substituído pelo merged)
          if (/\/Type\s*\/Pages\b/.test(obj.raw)) continue;
          // Pula Catalog original
          if (/\/Type\s*\/Catalog\b/.test(obj.raw)) continue;

          const newId = remap.get(obj.id);
          let raw = rewriteRefs(obj.raw, remap);

          // Se for uma página, atualiza /Parent para o Pages do merged (id=2)
          if (pageIdSet.has(obj.id)) {
            raw = raw.replace(/\/Parent\s+\d+\s+\d+\s+R/, '/Parent 2 0 R');
            if (!/\/Parent/.test(raw)) {
              // Insere /Parent se não existia
              raw = raw.replace('<<', '<< /Parent 2 0 R');
            }
          }

          addObj(newId, raw);
        }
      }

      // Catalog (id=1)
      addObj(1, '<< /Type /Catalog /Pages 2 0 R >>');

      // xref table
      const xrefOffset = body.length;
      body += 'xref\n0 ' + (nextId) + '\n';
      body += '0000000000 65535 f \n';
      for (let id = 1; id < nextId; id++) {
        const off = offsets.get(id);
        if (off !== undefined) {
          body += String(off).padStart(10, '0') + ' 00000 n \n';
        } else {
          body += '0000000000 65535 f \n';
        }
      }

      // trailer
      body += 'trailer\n<< /Size ' + nextId + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';

      // Download
      const blob = new Blob([str2buf(body)], { type: 'application/octet-stream' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      const atualizada = d.listaEnviada === true;
      const _escPreviaM = !atualizada && d.escalado > 0 && d.escalado < (d.solicitado || 0);
      const prefixoM = atualizada ? 'ESCALA ATUALIZADA' : _escPreviaM ? 'PRÉVIA ESCALA' : 'ESCALA';
      a.download = prefixoM + ' - ' + (chave || 'merged') + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      btnEl.innerHTML = '✅ Baixado!';
      btnEl.style.color = 'var(--mon-green)';
      setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; btnEl.disabled = false; }, 2500);
    } catch(e) {
      console.error('[Monitor] Merge PDF erro:', e);
      btnEl.innerHTML = '✗ Erro: ' + e.message.slice(0, 35);
      setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; btnEl.disabled = false; }, 4000);
    }
  };

  // ── GMAIL DE ESCALA ───────────────────────────────────────────────────────────
  window._monAbrirGmailEscala = function(opId, btnEl) {
    const d  = apontCache[opId];
    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    if (!op) return;

    const atualizada  = d && d !== 'loading' && d.listaEnviada === true;
    const data        = monDataDaOp(op);
    const horaExib    = monHoraFormatada(op.hora);
    const horaAssunto = monHoraAssunto(op.hora);
    const nome        = monNomeUsuario();
    const assinatura  = '\n\nAtenciosamente,\n' + (nome ? nome + '\n' : '') + 'Assistente de Planejamento | TSI';

    const emails = monEmailsDaOp(op);
    const to     = emails.join(',');

    if (emails.length === 0) {
      const orig = btnEl.innerHTML;
      btnEl.innerHTML = '⚠ Sem destinatários';
      btnEl.style.color = 'var(--mon-amber)';
      btnEl.style.borderColor = 'var(--mon-amber-border)';
      setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; btnEl.style.borderColor = ''; }, 3500);
      return;
    }

    const assunto = atualizada
      ? 'TSI - ESCALA ATUALIZADA | ' + data + ' | ' + horaAssunto
      : 'TSI - ESCALA | ' + data + ' | ' + horaAssunto;

    const saudacaoEmail = monSaudacao();
    const corpo = atualizada
      ? saudacaoEmail + ',\n\nEncaminho a versão atualizada da escala TSI referente ao dia ' + data + ', turno das ' + horaExib + '. Pedimos que desconsiderem a versão anterior.\n\nQualquer dúvida, estou à disposição.' + assinatura
      : saudacaoEmail + ',\n\nEncaminho a escala TSI referente ao dia ' + data + ', turno das ' + horaExib + ', para conhecimento e organização das atividades.\n\nSolicito a conferência das informações. Qualquer dúvida, estou à disposição.' + assinatura;

    const url = 'https://mail.google.com/mail/?view=cm&fs=1'
      + (to ? '&to=' + encodeURIComponent(to) : '')
      + '&su=' + encodeURIComponent(assunto)
      + '&body=' + encodeURIComponent(corpo);

    window.open(url, '_blank');

    const orig = btnEl.innerHTML;
    btnEl.innerHTML = '✅ Gmail aberto!';
    btnEl.style.color = 'var(--mon-green)';
    setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; }, 3000);
  };

  // ── OBS BALÃO ────────────────────────────────────────────────────────────────
  window._monObsCache = {};
  let _obsPopover = null;
  let _obsCurrentOpId = null;

  // IDs de obs já abertas — persiste no localStorage
  const _OBS_VISTAS_KEY = '_monObsVistas';
  function _obsVistasLoad() {
    try { return new Set(JSON.parse(localStorage.getItem(_OBS_VISTAS_KEY) || '[]')); } catch(e) { return new Set(); }
  }
  function _obsVistasSave() {
    try { localStorage.setItem(_OBS_VISTAS_KEY, JSON.stringify([..._monObsVistas])); } catch(e) {}
  }
  const _monObsVistas = _obsVistasLoad();

  // Timestamps da ultima obs conhecida por opId neste PC
  // Formato: { opId: 'DD/MM HH:MM' } — salvo em localStorage
  const _OBS_TS_KEY = '_monObsTs_' + _hoje;
  // Limpa chaves de dias anteriores
  (function() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('_monObsTs_') && k !== _OBS_TS_KEY) localStorage.removeItem(k);
      });
    } catch(e) {}
  })();
  function _obsTsLoad() { try { return JSON.parse(localStorage.getItem(_OBS_TS_KEY) || '{}'); } catch(e) { return {}; } }
  function _obsTsSave(ts) { try { localStorage.setItem(_OBS_TS_KEY, JSON.stringify(ts)); } catch(e) {} }
  let _obsTs = _obsTsLoad();
  // Marca um opId como visto com o timestamp atual da obs
  function _obsTsMarcar(opId, data) { _obsTs[opId] = data || ''; _obsTsSave(_obsTs); }

  // obs → Supabase (ver _sbGet/_sbSet)

  // ── SNAP BIN — mesmo bin das obs (chave "escaladosSnap") ──────────────────────
  // (constantes declaradas na seção de ESTADO, antes de snapLoadRemote)

  // ── FALTAS BIN (JSONBin separado, compartilhado) ──────────────────────────────
  // faltas → Supabase (ver _sbGet/_sbSet)

  let _faltasCache = {}; // { chave: { ...registro } }

  function _faltasLoad(cb) {
    _sbGet('faltas', data => {
      _faltasCache = data || {};
      _faltasAtualizarBotao();
      if (cb) cb(_faltasCache);
    });
  }

  function _faltasSave(faltas, cb) {
    _faltasCache = faltas;
    _faltasAtualizarBotao();
    _sbSet('faltas', faltas, cb);
  }

  function _faltasAtualizarBotao() {
    const btn = document.getElementById('mon-faltas-btn');
    if (!btn) return;
    const total = Object.values(_faltasCache).reduce((s, r) => s + (r.faltas || 0), 0);
    btn.textContent = total > 0 ? '📋 Faltas (' + total + ')' : '📋 Faltas';
  }

  function _faltasRegistrar(op, entregueCount, cb) {
    const nome = monNomeUsuario() || 'Anônimo';
    const agora = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
    const dataOp = monDataDaOp(op);
    const d = apontCache[op.id];
    const escalado = (d && d.escalado != null) ? d.escalado : op.qtd;
    const faltas = Math.max(0, op.qtd - entregueCount);
    if (faltas === 0) { if (cb) cb(); return; }
    const registro = {
      chave: op.chave,
      hora: op.hora || '—',
      dataOp,
      solicitado: op.qtd,
      escalado,
      entregue: entregueCount,
      faltas,
      registradoEm: agora,
      registradoPor: nome
    };
    const novasFaltas = Object.assign({}, _faltasCache, { [op.chave]: registro });
    _faltasSave(novasFaltas, cb);
  }

  window._monAbrirFaltas = function() {
    _faltasLoad(() => _faltasRenderModal());
    const modal = document.getElementById('mon-faltas-modal');
    if (modal) { modal.style.display = 'flex'; _faltasRenderModal(); }
  };

  window._monFecharFaltas = function() {
    const modal = document.getElementById('mon-faltas-modal');
    if (modal) modal.style.display = 'none';
    if (window._monRailVoltarOps) window._monRailVoltarOps();
  };

  window._monLimparFaltas = function() {
    if (!confirm('Limpar todos os registros de faltas? Isso afeta todos os usuários.')) return;
    _faltasSave({}, () => {
      _faltasRenderModal();
    });
  };

  window._monRemoverFalta = function(chave) {
    if (!chave || !_faltasCache[chave]) return;
    const novasFaltas = Object.assign({}, _faltasCache);
    delete novasFaltas[chave];
    _faltasSave(novasFaltas, () => {
      _faltasRenderModal();
    });
  };

  window._monFiltrarFaltas = function() {
    _faltasRenderModal();
  };

  window._monEditarFalta = function(chave) {
    const r = _faltasCache[chave];
    if (!r) return;
    const card = document.getElementById('mon-falta-card-' + chave.replace(/[^a-zA-Z0-9]/g, '_'));
    if (!card) return;
    const badge = card.querySelector('.mon-falta-badge');
    const editArea = card.querySelector('.mon-falta-edit-area');
    const editBtn = card.querySelector('.mon-falta-edit-btn');
    if (!badge || !editArea) return;
    // toggle: se já aberto, fecha
    if (editArea.style.display !== 'none') {
      editArea.style.display = 'none';
      badge.style.display = '';
      if (editBtn) editBtn.title = 'Editar quantidade';
      return;
    }
    editArea.style.display = 'flex';
    badge.style.display = 'none';
    if (editBtn) editBtn.title = 'Cancelar edição';
    const input = editArea.querySelector('input');
    if (input) { input.value = r.faltas; input.focus(); input.select(); }
  };

  window._monSalvarEditFalta = function(chave) {
    const r = _faltasCache[chave];
    if (!r) return;
    const card = document.getElementById('mon-falta-card-' + chave.replace(/[^a-zA-Z0-9]/g, '_'));
    if (!card) return;
    const input = card.querySelector('.mon-falta-edit-input');
    if (!input) return;
    const novoVal = parseInt(input.value, 10);
    if (isNaN(novoVal) || novoVal < 0) { input.focus(); return; }
    const nome = monNomeUsuario() || 'Anônimo';
    const agora = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
    const editLog = r.editLog ? [...r.editLog] : [];
    editLog.push({ de: r.faltas, para: novoVal, por: nome, em: agora });
    const novasFaltas = Object.assign({}, _faltasCache, {
      [chave]: Object.assign({}, r, { faltas: novoVal, editLog })
    });
    _faltasSave(novasFaltas, () => { _faltasRenderModal(); });
  };

  window._monCopiarFaltas = function(btnEl) {
    const texto = _faltasGerarTexto();
    if (!texto) { alert('Nenhuma falta para copiar.'); return; }
    navigator.clipboard.writeText(texto)
      .then(() => {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copiado!';
        setTimeout(() => { btnEl.innerHTML = orig; }, 2500);
      })
      .catch(() => { prompt('Copie o relatório:', texto); });
  };

  // Turnos: T1 06:00~14:00, T2 14:00~21:30, T3 21:30~06:00 (T3 cruza meia-noite)
  window._monSelecionarTurno = function(t) {
    const dataIniEl = document.getElementById('mon-faltas-data-ini');
    const dataFimEl = document.getElementById('mon-faltas-data-fim');
    const horaIniEl = document.getElementById('mon-faltas-hora-ini');
    const horaFimEl = document.getElementById('mon-faltas-hora-fim');
    if (!dataIniEl) return;

    // Data de início é manual — usa o que já está preenchido ou hoje
    const dataIniVal = dataIniEl.value || new Date().toISOString().slice(0,10);
    dataIniEl.value = dataIniVal;

    const turnos = {
      1: { hIni: '06:00', hFim: '14:00', addDay: 0 },
      2: { hIni: '14:00', hFim: '21:30', addDay: 0 },
      3: { hIni: '21:30', hFim: '06:00', addDay: 1 }
    };
    const turno = turnos[t];
    if (!turno) return;

    // Data fim: T3 = data início + 1 dia; T1/T2 = mesma data
    const dIni = new Date(dataIniVal + 'T00:00:00');
    const dFim = new Date(dIni);
    dFim.setDate(dFim.getDate() + turno.addDay);

    if (horaIniEl) horaIniEl.value = turno.hIni;
    if (horaFimEl) horaFimEl.value = turno.hFim;
    if (dataFimEl) dataFimEl.value = dFim.toISOString().slice(0,10);

    // Destaca botão ativo
    [1,2,3].forEach(function(n) {
      const btn = document.getElementById('mon-faltas-t' + n);
      if (!btn) return;
      if (n === t) {
        btn.style.background = 'var(--mon-red-bg)';
        btn.style.color = 'var(--mon-red)';
        btn.style.borderColor = 'rgba(220,38,38,0.3)';
      } else {
        btn.style.background = 'var(--mon-surface2)';
        btn.style.color = 'var(--mon-text-dim)';
        btn.style.borderColor = 'var(--mon-border2)';
      }
    });
    window._monFiltrarFaltas();
  };

  function _faltasFiltradas() {
    const dataIni = (document.getElementById('mon-faltas-data-ini') || {}).value || '';
    const horaIni = (document.getElementById('mon-faltas-hora-ini') || {}).value || '';
    const dataFim = (document.getElementById('mon-faltas-data-fim') || {}).value || '';
    const horaFim = (document.getElementById('mon-faltas-hora-fim') || {}).value || '';
    const registros = Object.values(_faltasCache);
    if (!dataIni && !dataFim) return registros;

    // Converte dataOp DD/MM/YYYY → YYYY-MM-DD
    const toISO = s => {
      const p = (s || '').split('/');
      return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : '';
    };

    // Monta datetime de comparação: se hora não preenchida, usa 00:00 pra início e 23:59 pra fim
    const dtIni = dataIni ? new Date(dataIni + 'T' + (horaIni || '00:00') + ':00').getTime() : null;
    const dtFim = dataFim ? new Date(dataFim + 'T' + (horaFim || '23:59') + ':00').getTime() : null;

    return registros.filter(r => {
      const iso = toISO(r.dataOp || '');
      if (!iso) return true; // sem data no registro, deixa passar
      // Hora da op: usa r.hora se válido, senão '00:00'
      const horaR = (r.hora && r.hora !== '—') ? r.hora : '00:00';
      const dtR = new Date(iso + 'T' + horaR + ':00').getTime();
      if (dtIni && dtR < dtIni) return false;
      if (dtFim && dtR > dtFim) return false;
      return true;
    });
  }

  function _faltasGerarTexto() {
    const lista = _sortLista(_faltasFiltradas().filter(r => r.faltas > 0));
    if (lista.length === 0) return '';

    const datasUnicas = [...new Set(lista.map(r => r.dataOp))].sort((a, b) => {
      const toISO = s => { const [d,m,y] = s.split('/'); return y+'-'+m+'-'+d; };
      return toISO(a).localeCompare(toISO(b));
    });
    const datasStr = datasUnicas.length > 1
      ? datasUnicas[0] + ' - ' + datasUnicas[datasUnicas.length - 1]
      : datasUnicas[0];

    const totalFaltas = lista.reduce((s, r) => s + r.faltas, 0);
    const sep = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    const linhas = [
      '📋 *RELATÓRIO DE FALTAS* 📋',
      '',
      '📅 *' + datasStr + '*',
      ''
    ];
    lista.forEach(r => {
      linhas.push('❌ *' + r.chave + '*');
      // Se tem sub-linhas, gera uma por motivo
      if (r.linhas && r.linhas.length > 0) {
        r.linhas.forEach(function(l) {
          const q = (l.qtd||1);
          const qtdStr = String(q).padStart(2,'0') + (q === 1 ? ' falta' : ' faltas');
          linhas.push('└➤ *' + qtdStr + '* por ' + (l.motivo || _MOTIVOS_FALTA[0]));
        });
      } else {
        const motivo = (window._faltasMotivos && window._faltasMotivos[r.chave]) || _MOTIVOS_FALTA[0];
        const qtd = r.faltas === 1 ? '01 falta' : String(r.faltas).padStart(2,'0') + ' faltas';
        linhas.push('└➤ *' + qtd + '* por ' + motivo);
      }
      linhas.push(sep);
    });
    linhas.push('➡️ *TOTAL: ' + String(totalFaltas).padStart(2,'0') + ' FALTA' + (totalFaltas !== 1 ? 'S' : '') + '*');
    return linhas.join('\n');
  }

  // Exposta globalmente para o onchange do select poder chamar
  window._faltasGerarTextoAtual = _faltasGerarTexto;

  function _sortLista(lista) {
    const toISO = s => { const p = (s||'').split('/'); return p.length === 3 ? p[2]+'-'+p[1]+'-'+p[0] : ''; };
    return [...lista].sort((a, b) => {
      const dtA = (toISO(a.dataOp||'') + 'T' + (a.hora && a.hora !== '—' ? a.hora : '00:00'));
      const dtB = (toISO(b.dataOp||'') + 'T' + (b.hora && b.hora !== '—' ? b.hora : '00:00'));
      return dtA.localeCompare(dtB);
    });
  }

  // Motivos escolhidos por operação (em memória, reseta ao fechar/abrir)
  if (!window._faltasMotivos) window._faltasMotivos = {};

  const _MOTIVOS_FALTA = [
    'desistência sem reposição',
    'sem aderência'
  ];

  window._monAdicionarFaltaManual = function() {
    // Remove form anterior se existir
    const old = document.getElementById('mon-falta-manual-form');
    if (old) { old.remove(); return; }

    const body = document.getElementById('mon-faltas-body');
    if (!body) return;

    const form = document.createElement('div');
    form.id = 'mon-falta-manual-form';
    form.style.cssText = 'background:var(--mon-surface);border:1.5px solid var(--mon-accent-border,rgba(99,102,241,0.3));border-radius:10px;padding:14px 16px;margin-bottom:8px;display:flex;flex-direction:column;gap:10px;animation:mon-fadein 0.12s ease';
    form.innerHTML =
      '<div style="font-size:12px;font-weight:700;color:var(--mon-accent,#6366f1);text-transform:uppercase;letter-spacing:.05em">+ Adicionar falta manualmente</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:8px">' +
        '<div>' +
          '<label style="font-size:10px;font-weight:700;color:var(--mon-text-faint);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em">Chave da op</label>' +
          '<input id="mon-fm-chave" type="text" placeholder="Ex: SVCCAS" autocomplete="off"' +
            ' style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--mon-border2);border-radius:7px;background:var(--mon-surface2);color:var(--mon-text);font-size:13px;font-weight:700;font-family:var(--mon-font);outline:none;text-transform:uppercase"/>' +
        '</div>' +
        '<div>' +
          '<label style="font-size:10px;font-weight:700;color:var(--mon-text-faint);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em">Hora</label>' +
          '<input id="mon-fm-hora" type="text" placeholder="Ex: 06:00" maxlength="5" autocomplete="off"' +
            ' style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--mon-border2);border-radius:7px;background:var(--mon-surface2);color:var(--mon-text);font-size:13px;font-family:var(--mon-font);outline:none;font-family:var(--mon-mono)"/>' +
        '</div>' +
        '<div>' +
          '<label style="font-size:10px;font-weight:700;color:var(--mon-text-faint);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em">Qtd faltas</label>' +
          '<input id="mon-fm-qtd" type="number" min="1" max="999" value="1"' +
            ' style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--mon-border2);border-radius:7px;background:var(--mon-surface2);color:var(--mon-red,#dc2626);font-size:14px;font-weight:800;font-family:var(--mon-mono);outline:none;text-align:center"/>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button onclick="(function(){var f=document.getElementById(\'mon-falta-manual-form\');if(f)f.remove();})()"' +
          ' style="height:30px;padding:0 14px;border-radius:7px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--mon-font)">Cancelar</button>' +
        '<button onclick="window._monSalvarFaltaManual()"' +
          ' style="height:30px;padding:0 16px;border-radius:7px;border:none;background:var(--mon-green,#16a34a);color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--mon-font)">Salvar</button>' +
      '</div>';

    // Insere no topo da lista
    body.insertBefore(form, body.firstChild);
    body.scrollTop = 0;
    document.getElementById('mon-fm-chave')?.focus();

    // Enter no ultimo campo salva
    document.getElementById('mon-fm-qtd')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') window._monSalvarFaltaManual();
    });
    document.getElementById('mon-fm-hora')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('mon-fm-qtd')?.focus();
    });
    document.getElementById('mon-fm-chave')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('mon-fm-hora')?.focus();
    });
    document.getElementById('mon-fm-chave')?.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
    });
  };

  window._monSalvarFaltaManual = function() {
    const chave = (document.getElementById('mon-fm-chave')?.value || '').trim().toUpperCase();
    const hora  = (document.getElementById('mon-fm-hora')?.value  || '').trim() || '00:00';
    const qtd   = Math.max(1, parseInt(document.getElementById('mon-fm-qtd')?.value) || 1);

    if (!chave) {
      const inp = document.getElementById('mon-fm-chave');
      if (inp) { inp.style.borderColor='var(--mon-red,#dc2626)'; inp.focus(); }
      return;
    }

    const agora = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
    const nome  = (typeof monNomeUsuario === 'function' ? monNomeUsuario() : null) || 'Manual';
    const hoje  = (function() {
      const d = new Date();
      return d.getDate().toString().padStart(2,'0') + '/' +
             (d.getMonth()+1).toString().padStart(2,'0') + '/' +
             d.getFullYear();
    })();

    const registro = {
      chave,
      hora,
      dataOp: hoje,
      solicitado: qtd,
      escalado: qtd,
      entregue: 0,
      faltas: qtd,
      registradoEm: agora,
      registradoPor: nome + ' (manual)'
    };

    const novas = Object.assign({}, _faltasCache, { [chave]: registro });
    _faltasSave(novas, function() {
      const form = document.getElementById('mon-falta-manual-form');
      if (form) form.remove();
      _faltasRenderModal();
    });
  };


  // Atualiza qtd ou motivo de uma sub-linha e salva
  window._monFaltaUpdateLinha = function(chave, li, campo, valor) {
    const r = _faltasCache[chave]; if (!r) return;
    if (!r.linhas || r.linhas.length === 0) {
      r.linhas = [{ qtd: r.faltas, motivo: (window._faltasMotivos && window._faltasMotivos[chave]) || _MOTIVOS_FALTA[0] }];
    }
    if (!r.linhas[li]) return;
    r.linhas[li][campo] = valor;
    // Recalcula total
    r.faltas = r.linhas.reduce(function(s, l) { return s + (l.qtd||1); }, 0);
    const novas = Object.assign({}, _faltasCache, { [chave]: r });
    _faltasSave(novas, function() {
      document.getElementById('mon-faltas-pre').textContent = _faltasGerarTexto();
      const tot = document.getElementById('mon-faltas-total');
      const totalGeral = Object.values(_faltasCache).reduce(function(s,x){ return s+(x.faltas||0); }, 0);
      if (tot) tot.textContent = String(totalGeral).padStart(2,'0') + ' falta' + (totalGeral !== 1 ? 's' : '') + ' no total';
      // Atualiza badge do card
      const chaveId = chave.replace(/[^a-zA-Z0-9]/g, '_');
      const badge = document.querySelector('#mon-falta-card-' + chaveId + ' .mon-falta-badge');
      if (badge) badge.textContent = String(r.faltas).padStart(2,'0') + (r.faltas === 1 ? ' falta' : ' faltas');
    });
  };

  // Adiciona nova sub-linha ao registro
  window._monFaltaAddLinha = function(chave) {
    const r = _faltasCache[chave]; if (!r) return;
    if (!r.linhas || r.linhas.length === 0) {
      r.linhas = [{ qtd: r.faltas, motivo: (window._faltasMotivos && window._faltasMotivos[chave]) || _MOTIVOS_FALTA[0] }];
    }
    r.linhas.push({ qtd: 1, motivo: _MOTIVOS_FALTA[0] });
    r.faltas = r.linhas.reduce(function(s, l) { return s + (l.qtd||1); }, 0);
    const novas = Object.assign({}, _faltasCache, { [chave]: r });
    _faltasSave(novas, function() { _faltasRenderModal(); });
  };

  // Remove uma sub-linha (mínimo 1)
  window._monFaltaRemoverLinha = function(chave, li) {
    const r = _faltasCache[chave]; if (!r) return;
    if (!r.linhas || r.linhas.length <= 1) return;
    r.linhas.splice(li, 1);
    r.faltas = r.linhas.reduce(function(s, l) { return s + (l.qtd||1); }, 0);
    const novas = Object.assign({}, _faltasCache, { [chave]: r });
    _faltasSave(novas, function() { _faltasRenderModal(); });
  };


  function _faltasRenderModal() {
    const body = document.getElementById('mon-faltas-body');
    if (!body) return;
    const lista = _sortLista(_faltasFiltradas().filter(r => r.faltas > 0));
    const totalFaltas = lista.reduce((s, r) => s + r.faltas, 0);

    if (lista.length === 0) {
      body.innerHTML = '<div style="text-align:center;padding:48px 20px;color:var(--mon-text-faint);font-size:13px;display:flex;flex-direction:column;align-items:center;gap:10px"><span style="font-size:32px;opacity:0.3">📋</span><span>Nenhuma falta registrada para este período.</span></div>';
      const pre = document.getElementById('mon-faltas-pre');
      if (pre) pre.textContent = '';
      const tot = document.getElementById('mon-faltas-total');
      if (tot) tot.textContent = '';
      return;
    }

    // Cards
    body.innerHTML = lista.map(r => {
      const chaveId = r.chave.replace(/[^a-zA-Z0-9]/g, '_');
      const faltasLabel = String(r.faltas).padStart(2,'0') + (r.faltas === 1 ? ' falta' : ' faltas');
      const badge = `<span class="mon-falta-badge" style="background:var(--mon-red-bg);border:1px solid var(--mon-red-border,rgba(220,38,38,0.25));color:var(--mon-red);border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap">${faltasLabel}</span>`;
      const editLog = r.editLog || [];
      const editLogHtml = editLog.length > 0
        ? `<div style="margin-top:8px;padding:6px 10px;border-radius:6px;background:var(--mon-surface2);border:1px solid var(--mon-border);font-size:10.5px;color:var(--mon-text-faint);line-height:1.7">`
          + editLog.map(e => `<span style="display:block">✏️ <b style="color:var(--mon-text-dim)">${e.por}</b> alterou de <b>${e.de}</b> → <b>${e.para}</b> <span style="opacity:0.6">· ${e.em}</span></span>`).join('')
          + `</div>`
        : '';

      // Sub-linhas de motivo — garante ao menos uma
      const subLinhas = (r.linhas && r.linhas.length > 0)
        ? r.linhas
        : [{ qtd: r.faltas, motivo: (window._faltasMotivos && window._faltasMotivos[r.chave]) || _MOTIVOS_FALTA[0] }];

      const subLinhasHtml = subLinhas.map((l, li) => {
        const sopts = _MOTIVOS_FALTA.map(m =>
          `<option value="${m}" ${m === (l.motivo||_MOTIVOS_FALTA[0]) ? 'selected' : ''}>${m}</option>`
        ).join('');
        return `<div class="mon-falta-sublinha" style="display:flex;align-items:center;gap:6px;margin-top:6px">
          <input type="number" min="1" max="999" value="${l.qtd||1}"
            onchange="window._monFaltaUpdateLinha('${r.chave}',${li},'qtd',+this.value)"
            style="width:52px;height:28px;padding:0 6px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-red,#dc2626);font-size:13px;font-weight:700;font-family:var(--mon-mono);text-align:center"/>
          <select onchange="window._monFaltaUpdateLinha('${r.chave}',${li},'motivo',this.value)"
            style="flex:1;padding:5px 8px;border-radius:6px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:11.5px;font-family:var(--mon-font);cursor:pointer">
            ${sopts}
          </select>
          ${subLinhas.length > 1
            ? `<button onclick="window._monFaltaRemoverLinha('${r.chave}',${li})" title="Remover esta linha"
                style="width:24px;height:24px;border-radius:5px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center"
                onmouseover="this.style.color='var(--mon-red)';this.style.borderColor='rgba(220,38,38,0.3)'"
                onmouseout="this.style.color='var(--mon-text-faint)';this.style.borderColor='var(--mon-border)'">✕</button>`
            : '<div style="width:24px"></div>'}
        </div>`;
      }).join('');

      return `<div id="mon-falta-card-${chaveId}" style="display:flex;flex-direction:column;padding:11px 14px;background:var(--mon-surface);border:1px solid var(--mon-border);border-radius:9px;">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="color:var(--mon-red);font-size:16px;flex-shrink:0">❌</span>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="font-size:13px;font-weight:700;color:var(--mon-text)">${r.chave}</span>
              <span style="background:var(--mon-surface2);border:1px solid var(--mon-border);color:var(--mon-text-dim);border-radius:99px;padding:1px 8px;font-size:11px;font-weight:600;font-family:var(--mon-mono)">${r.hora}</span>
            </div>
            <div style="font-size:11px;color:var(--mon-text-faint);margin-top:3px">
              Registrado em <b style="color:var(--mon-text-dim)">${r.registradoEm}</b> por <b style="color:var(--mon-text-dim)">${r.registradoPor}</b>
              &nbsp;·&nbsp; Sol: <b>${r.solicitado}</b> · Entregue: <b>${r.entregue}</b>
            </div>
            ${subLinhasHtml}
            <button onclick="window._monFaltaAddLinha('${r.chave}')"
              style="margin-top:7px;padding:3px 10px;border-radius:6px;border:1px dashed var(--mon-border2);background:transparent;color:var(--mon-text-faint);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--mon-font);transition:color .1s,border-color .1s"
              onmouseover="this.style.color='var(--mon-accent,#6366f1)';this.style.borderColor='var(--mon-accent,#6366f1)'"
              onmouseout="this.style.color='var(--mon-text-faint)';this.style.borderColor='var(--mon-border2)'">+ motivo diferente</button>
          </div>
          ${badge}
          <button onclick="window._monRemoverFalta('${r.chave}')" title="Remover esta falta"
            style="flex-shrink:0;width:30px;height:30px;border-radius:6px;border:1px solid var(--mon-border);background:transparent;color:var(--mon-text-faint);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.1s,color 0.1s,border-color 0.1s"
            onmouseover="this.style.background='var(--mon-red-bg)';this.style.color='var(--mon-red)';this.style.borderColor='rgba(220,38,38,0.3)'"
            onmouseout="this.style.background='transparent';this.style.color='var(--mon-text-faint)';this.style.borderColor='var(--mon-border)'">✕</button>
        </div>
        ${editLogHtml}
      </div>`;
    }).join('');

    // Bloco texto
    const pre = document.getElementById('mon-faltas-pre');
    if (pre) pre.textContent = _faltasGerarTexto();
    const tot = document.getElementById('mon-faltas-total');
    if (tot) tot.textContent = String(totalFaltas).padStart(2,'0') + ' falta' + (totalFaltas !== 1 ? 's' : '') + ' no total';
    const sub = document.getElementById('mon-faltas-header-sub');
    if (sub) sub.textContent = lista.length > 0
      ? lista.length + ' operaç' + (lista.length === 1 ? 'ão' : 'ões') + ' · ' + totalFaltas + ' falta' + (totalFaltas !== 1 ? 's' : '') + ' no total'
      : 'Faltas registradas pelo monitor';
  }

  // Nota: _faltasLoad() é chamado dentro do _loadFirebaseAndInit (após Firebase conectar)

  // Cria popover no DOM (uma vez)
  function _obsEnsurePopover() {
    if (_obsPopover) return;
    _obsPopover = document.createElement('div');
    _obsPopover.className = 'mon-obs-popover';
    _obsPopover.id = 'mon-obs-popover';
    _obsPopover.innerHTML = `
      <div class="mon-obs-header">
        <span class="mon-obs-title">💬 Observações</span>
        <button class="mon-obs-close" onclick="window._monFecharObs()">✕</button>
      </div>
      <textarea class="mon-obs-textarea" id="mon-obs-text" placeholder="Digite uma observação..."></textarea>
      <div class="mon-obs-meta" id="mon-obs-meta"></div>
      <div class="mon-obs-actions">
        <button class="mon-obs-save" onclick="window._monSalvarObs()">Salvar</button>
        <button class="mon-obs-hist-btn" onclick="window._monToggleObsHist()">Histórico</button>
      </div>
      <div class="mon-obs-hist" id="mon-obs-hist"></div>
    `;
    document.body.appendChild(_obsPopover);

    // fecha ao clicar fora
    document.addEventListener('click', function(e) {
      if (_obsPopover && _obsPopover.classList.contains('open') && !_obsPopover.contains(e.target)) {
        window._monFecharObs();
      }
    });
  }

  // Carrega obs do Supabase
  // Flag para ignorar a primeira carga (nao notificar obs que ja existiam ao abrir o monitor)
  let _obsCarregouPelaVez = false;

  function _obsLoad(cb) {
    _sbGet('obs', data => {
      const novo = data || {};
      const novidades = [];

      if (_obsCarregouPelaVez) {
        // Ciclos seguintes: compara o timestamp da obs com o que este PC ja conhecia
        Object.entries(novo).forEach(([opId, obsNova]) => {
          if (!obsNova || !obsNova.texto) return;
          const tsConhecido = _obsTs[opId]; // ultima data que este PC viu
          const tsNova = obsNova.data || '';
          // Notifica se: nunca viu esta obs OU o timestamp mudou (obs editada/nova)
          const eNova = !tsConhecido || tsNova !== tsConhecido;
          // Não notifica se o autor é o próprio usuário logado
          const euMesmo = obsNova.autor && monNomeUsuario() && obsNova.autor === monNomeUsuario();
          if (eNova && !euMesmo) {
            // Remove do set de vistas para o badge aparecer
            _monObsVistas.delete(opId);
            _obsVistasSave();
            novidades.push({ opId, obs: obsNova });
          }
        });
      } else {
        // Primeira carga: apenas registra os timestamps atuais sem notificar
        Object.entries(novo).forEach(([opId, obsNova]) => {
          if (obsNova && obsNova.texto && obsNova.data) {
            _obsTs[opId] = obsNova.data;
          }
        });
        _obsTsSave(_obsTs);
        _obsCarregouPelaVez = true;
      }

      window._monObsCache = novo;

      if (novidades.length > 0) {
        // Atualiza timestamps das novidades para nao re-notificar no proximo ciclo
        novidades.forEach(({ opId, obs }) => { _obsTsMarcar(opId, obs.data || ''); });
        const op = operations.find(o => o.id === novidades[0].opId);
        const chave = op ? (op.sigla || op.chave) : novidades[0].opId;
        const autor = novidades[0].obs.autor || 'Alguem';
        const extra = novidades.length > 1 ? ' (+' + (novidades.length - 1) + ' mais)' : '';
        _monToast(autor + ' comentou em ' + chave + extra, 'obs');
      }

      if (cb) cb(novo);
    });
  }

  // Salva obs no Supabase
  function _obsSave(obs, cb) {
    window._monObsCache = obs;
    _sbSet('obs', obs, cb);
  }

  window._monAbrirObs = function(opId, btnEl) {
    _obsEnsurePopover();
    _obsCurrentOpId = opId;

    // Marca como vista e remove badge
    _monObsVistas.add(opId);
    _obsVistasSave();
    // Salva timestamp desta obs como "ja vista neste PC"
    const _obsVista = window._monObsCache && window._monObsCache[opId];
    if (_obsVista && _obsVista.data) _obsTsMarcar(opId, _obsVista.data);
    const wrap = btnEl.closest('.mon-obs-wrap');
    if (wrap) { const b = wrap.querySelector('.mon-obs-badge'); if (b) b.remove(); }

    // Posiciona o popover perto do botão
    const rect = btnEl.getBoundingClientRect();
    const pop = _obsPopover;
    pop.style.top  = (rect.bottom + 6) + 'px';
    pop.style.left = Math.min(rect.left, window.innerWidth - 296) + 'px';

    // Reseta hist
    const hist = document.getElementById('mon-obs-hist');
    if (hist) hist.classList.remove('open');

    const op = _monFindOp(opId); // FIX: coerção de tipo string/number
    const d  = apontCache[opId];
    const reportEnv = d && d.todosConfirmados;

    const obsData = window._monObsCache[opId] || { texto: '', log: [] };

    const textarea = document.getElementById('mon-obs-text');
    const meta     = document.getElementById('mon-obs-meta');

    if (reportEnv) {
      textarea.value = '';
      textarea.placeholder = 'Obs oculta — report já enviado.';
      textarea.disabled = true;
      meta.textContent = '';
    } else {
      textarea.value = obsData.texto || '';
      textarea.disabled = false;
      textarea.placeholder = 'Digite uma observação...';
      if (obsData.autor && obsData.data) {
        meta.textContent = 'Editado por ' + obsData.autor + ' às ' + obsData.data;
      } else {
        meta.textContent = '';
      }
    }

    // Histórico
    const histEl = document.getElementById('mon-obs-hist');
    if (histEl) {
      const log = obsData.log || [];
      if (log.length === 0) {
        histEl.innerHTML = '<div class="mon-obs-hist-item">Nenhum histórico ainda.</div>';
      } else {
        histEl.innerHTML = [...log].reverse().map(entry =>
          `<div class="mon-obs-hist-item"><strong>${entry.autor}</strong> · ${entry.data}<br>${entry.texto}</div>`
        ).join('');
      }
    }

    pop.classList.add('open');
    if (!reportEnv) textarea.focus();
  };

  window._monFecharObs = function() {
    if (_obsPopover) _obsPopover.classList.remove('open');
    _obsCurrentOpId = null;
  };

  window._monToggleObsHist = function() {
    const hist = document.getElementById('mon-obs-hist');
    if (hist) hist.classList.toggle('open');
  };

  window._monSalvarObs = function() {
    if (!_obsCurrentOpId) return;
    const textarea = document.getElementById('mon-obs-text');
    const texto = (textarea.value || '').trim();
    const nome  = monNomeUsuario() || 'Anônimo';
    const agora = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });

    const obs = window._monObsCache || {};
    const anterior = obs[_obsCurrentOpId] || { texto: '', log: [] };
    const log = anterior.log || [];

    // Só loga se o texto mudou
    if (texto !== anterior.texto && anterior.texto) {
      log.push({ texto: anterior.texto, autor: anterior.autor || '?', data: anterior.data || '?' });
      if (log.length > 20) log.shift(); // mantém max 20 entradas
    }

    if (texto) {
      obs[_obsCurrentOpId] = { texto, autor: nome, data: agora, log };
    } else {
      // texto vazio = apaga a obs (mantém log)
      obs[_obsCurrentOpId] = { texto: '', autor: nome, data: agora, log };
    }

    const saveBtn = _obsPopover.querySelector('.mon-obs-save');
    saveBtn.textContent = 'Salvando…';
    saveBtn.disabled = true;

    _obsSave(obs, () => {
      saveBtn.textContent = 'Salvo ✓';
      setTimeout(() => { saveBtn.textContent = 'Salvar'; saveBtn.disabled = false; }, 1500);
      // Atualiza meta
      const meta = document.getElementById('mon-obs-meta');
      if (meta) meta.textContent = texto ? ('Editado por ' + nome + ' às ' + agora) : '';
      // Atualiza botão na linha
      const btns = document.querySelectorAll('.mon-obs-btn');
      btns.forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + _obsCurrentOpId + "'")) {
          b.classList.toggle('has-obs', !!texto);
        }
      });
      renderTable();
    });
  };

  // Nota: _obsLoad(), _reportHistCarregar() e snapLoadRemote() são chamados dentro do _loadFirebaseAndInit

  // ── FEATURE: WhatsApp do Líder ────────────────────────────────────────────
  const _WPP_LID_DADOS = [
    {lideres:[{nome:'Georgia de Almeida de Lima',tel:'27 99991-0588'},{nome:'Vinícius de Almeida Pereira',tel:'18 99812-1723'}]},
    {lideres:[{nome:'Layane Abelardo Lopes Moreno',tel:'67 99290-2361'},{nome:'Mirian de Souza dos Santos',tel:'27 98856-0061'},{nome:'Ruth Dorneles Mendes Daltio',tel:'27 98810-6113'}]},
    {lideres:[{nome:'Bruna Alves Malta',tel:'28 99254-4396'}]},
    {lideres:[{nome:'Cícero Amorim dos Santos',tel:'31 98834-3579'}]},
    {lideres:[{nome:'Brenda Martins',tel:'32 9195-9828'}]},
    {lideres:[{nome:'Aline Dourado',tel:'35 9871-0813'}]},
    {lideres:[{nome:'Elidiane Salete',tel:'46 9115-8918'}]},
    {lideres:[{nome:'Cristieli Fernanda Lutke',tel:'41 99625-2698'}]},
    {lideres:[{nome:'Elaine Cristina',tel:'42 9936-4367'}]},
    {lideres:[{nome:'Patricia Silva de Sousa',tel:'47 9680-4674'}]},
    {lideres:[{nome:'Gabrieli Petry Ribeiro',tel:'51 8187-9301'}]},
    {lideres:[{nome:'Max Willian Leal Andrade',tel:'37 9946-7234'}]},
    {lideres:[{nome:'Edmar',tel:'31 95563840'}]},
    {lideres:[{nome:'Aline Dourado Pereira',tel:'35 99871-0813'}]},
    {lideres:[{nome:'Samara',tel:'31 8217-2859'}]},
    {lideres:[{nome:'Amanda Cristina Barreto Silva',tel:'35 99939-3371'}]},
    {lideres:[{nome:'David Estevao dos Santos',tel:'35 91002-5725'},{nome:'Eduardo Paulino da Silva',tel:'35 99850-9495'}]},
    {lideres:[{nome:'Fernando Rodrigues Luiz',tel:'11 98868-5671'}]},
    {lideres:[{nome:'Caio Cezar Franca dos Santos',tel:'11 97463-6183'},{nome:'Glaucia Pereira da Silva',tel:'35 99188-5743'}]},
    {lideres:[{nome:'Franciele Fernanda Batista',tel:'55 9179-3157'}]},
    {lideres:[{nome:'Marla Rodrigues',tel:'54 9653-7758'}]},
    {lideres:[{nome:'Andreia Lima do Amarante Pinho',tel:'54 9634-1083'}]},
    {lideres:[{nome:'Ana Flávia Farias de Souza',tel:'53 92000-2893'}]},
    {lideres:[{nome:'Eni Gonçalves Cardoso',tel:'51 9634-9942'}]},
    {lideres:[{nome:'Vivian Pereira da Costa',tel:'41 99598-6635'},{nome:'Ana Cristiny Camargo',tel:'41 99897-4978'},{nome:'Bruna Pereira',tel:'41 9616-1518'},{nome:'Thais Pinheiro',tel:'41 99933-7126'}]},
    {lideres:[{nome:'Olando Jean',tel:'45 8404-1623'}]},
    {lideres:[{nome:'Marilin Rodriguez',tel:'45 9831-2325'}]},
    {lideres:[{nome:'Nicolle Lopes',tel:'49 9923-0240'}]},
    {lideres:[{nome:'Patricia Silva',tel:'47 9680-4674'}]},
  ];

  // ── JSONBin (mesmo BD do index.html) ─────────────────────────────────────
  const _WPP_BIN_ID  = '69dd9cfa36566621a8ae40e1';
  const _WPP_BIN_KEY = '$2a$10$re7SEj86dL3mQnxKBMLFvu7f566NmQucI1RwyW5t9tfYCrCQUExt.';
  const _WPP_BIN_URL = 'https://api.jsonbin.io/v3/b/' + _WPP_BIN_ID;

  const _WPP_NOME_TEL = {};

  function _wppNorm(s) {
    return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
  }

  _WPP_LID_DADOS.forEach(u => {
    (u.lideres||[]).forEach(l => { if(l.nome&&l.tel) _WPP_NOME_TEL[_wppNorm(l.nome)]={nome:l.nome,tel:l.tel}; });
  });

  function _wppCarregarLideresNuvem() {
    fetch(_WPP_BIN_URL + '/latest', { headers: { 'X-Master-Key': _WPP_BIN_KEY } })
      .then(r => {
        if (!r.ok) return null; // ignora 403 e outros erros silenciosamente
        return r.json();
      })
      .then(j => {
        if (!j) return;
        const lids = (j.record && j.record.lideres) || {};
        Object.values(lids).forEach(u => {
          (u.lideres||[]).forEach(l => { if(l.nome&&l.tel) _WPP_NOME_TEL[_wppNorm(l.nome)]={nome:l.nome,tel:l.tel}; });
        });
      }).catch(() => {});
  }

  // Carrega na inicialização e repete a cada 5 minutos (acompanha o ciclo de atualização)
  _wppCarregarLideresNuvem();
  setInterval(_wppCarregarLideresNuvem, 5 * 60 * 1000);

  // Mapa opId → nomeLider (preenchido por _monWppAbrirModal antes de abrir o modal de número)
  const _wppOpMap = {};

  // ── PONTO DE ENTRADA: clique no botão do líder ────────────────────────────────
  window._monWppAbrirModal = function(opId, nomeLider) {
    if (!nomeLider) return;
    _wppOpMap[opId] = { nomeLider };

    // Busca op e dados em cache
    const op = operations.find(o => o.id === opId) || { id: opId, lider: nomeLider, liderCompleto: nomeLider };
    // Garante que o nome do líder clicado está sempre disponível no op
    if (!op.liderCompleto && nomeLider) op.liderCompleto = nomeLider;
    if (!op.lider && nomeLider) op.lider = nomeLider;
    const d  = apontCache[opId] && apontCache[opId] !== 'loading' ? apontCache[opId] : null;

    const found = _wppBuscarTel(nomeLider);

    if (found && found.tel) {
      // Número cadastrado → detecta situação e mostra mensagem
      const escalado   = (d && d.escalado)   || 0;
      const solicitado = (d && d.solicitado) || op.qtd || 0;
      const apontado   = (d && d.apontado)   || 0;
      const listaEnviada = d && d.listaEnviada;

      let tipo = null;
      if (!listaEnviada) {
        // Escala ainda não enviada
        if (escalado === 0) tipo = 'nao_lancada';
        else if (escalado < solicitado) tipo = 'incompleta';
      } else {
        // Escala enviada → verifica apontamentos
        if (apontado < solicitado) tipo = 'apontamentos';
      }

      if (tipo) {
        window._monWppMsgModal(op, tipo, d, nomeLider);
      } else {
        // Situação ok, abre WhatsApp direto
        const telLimpo = found.tel.replace(/\D/g, '');
        window.open('https://wa.me/55' + telLimpo, '_blank');
      }
      return;
    }

    // Número não cadastrado → pede ao usuário
    const antigo = document.getElementById('mon-wpp-modal');
    if (antigo) antigo.remove();

    const overlay = document.createElement('div');
    overlay.id = 'mon-wpp-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = _wppModalPedirNumeroHTML(opId, _wppNomeProprio(nomeLider));
    document.body.appendChild(overlay);
    const inp = document.getElementById('mon-wpp-tel-inp');
    if (inp) setTimeout(() => inp.focus(), 80);
  };

  function _wppMatch(a, b) {
    if (!a||!b) return false;
    if (a.includes(b)||b.includes(a)) return true;
    const wa=a.split(' '), wb=b.split(' ');
    const [menor,maior]=wa.length<=wb.length?[wa,wb]:[wb,wa];
    return menor.every(w=>w.length>1&&maior.includes(w));
  }

  function _wppBuscarTel(nomeLider) {
    if (!nomeLider) return null;
    const norm=_wppNorm(nomeLider);
    if (_WPP_NOME_TEL[norm]) return _WPP_NOME_TEL[norm];
    for (const [k,v] of Object.entries(_WPP_NOME_TEL)) { if (_wppMatch(norm,k)) return v; }
    return null;
  }

  function _wppRnd(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

  function _wppSaudacao() {
    const h=new Date().getHours();
    return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  }

  function _wppNomeProprio(s) {
    const prep = new Set(['de','da','do','das','dos','e','a','o','em','na','no']);
    return (s||'').toLowerCase().split(' ').map((w,i) =>
      i===0||!prep.has(w) ? w.charAt(0).toUpperCase()+w.slice(1) : w
    ).join(' ');
  }
  function _wppPad(n) { return String(n).padStart(2,'0'); }

  // Gera mensagem localmente com templates variados
  function _wppModalPedirNumeroHTML(opId, nomeLider) {
    return `<div onclick="event.stopPropagation()" style="background:var(--mon-surface,#fff);border-radius:14px;padding:24px 28px;width:340px;max-width:95vw;box-shadow:0 8px 40px rgba(0,0,0,0.25);font-family:inherit">
      <div style="font-size:13px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">WhatsApp do Líder</div>
      <div style="font-size:15px;font-weight:600;color:var(--mon-text,#1a1a2e);margin-bottom:6px">📲 ${nomeLider}</div>
      <div style="font-size:12px;color:var(--mon-text-faint,#888);margin-bottom:16px">Número não cadastrado. Informe o WhatsApp para continuar.</div>
      <input id="mon-wpp-tel-inp" type="tel" placeholder="Ex: 11 99999-0000" autofocus
        style="width:100%;box-sizing:border-box;padding:9px 12px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;font-size:14px;background:var(--mon-surface2,#f5f5f5);color:var(--mon-text,#1a1a2e);outline:none;margin-bottom:14px"
        onkeydown="if(event.key==='Enter')window._wppConfirmarNumero('${opId}')" />
      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('mon-wpp-modal').remove()"
          style="flex:1;padding:9px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);font-size:13px;cursor:pointer">Cancelar</button>
        <button onclick="window._wppConfirmarNumero('${opId}')"
          style="flex:2;padding:9px;border:none;border-radius:8px;background:#25D366;color:#fff;font-size:13px;font-weight:700;cursor:pointer">Continuar →</button>
      </div>
    </div>`;
  }

  function _wppCadastrarLider(chaveOp, nomeLider, tel) {
    if (!chaveOp || !nomeLider || !tel) return;
    const chave = chaveOp.replace(/\d/g,'').toUpperCase();
    fetch(_WPP_BIN_URL + '/latest', { headers: { 'X-Master-Key': _WPP_BIN_KEY } })
      .then(r => r.json())
      .then(j => {
        const rec = j.record || {};
        const lids = rec.lideres || {};
        const unidade = lids[chave] || { chave, site: chave, lideres: [] };
        const jaExiste = (unidade.lideres || []).some(l => _wppNorm(l.nome) === _wppNorm(nomeLider));
        if (!jaExiste) {
          unidade.lideres = [...(unidade.lideres || []), { nome: nomeLider, tel }];
          lids[chave] = unidade;
          rec.lideres = lids;
          fetch(_WPP_BIN_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': _WPP_BIN_KEY },
            body: JSON.stringify(rec)
          }).then(() => {
            _WPP_NOME_TEL[_wppNorm(nomeLider)] = { nome: nomeLider, tel };
          }).catch(() => {});
        }
      }).catch(() => {});
  }

  window._wppConfirmarNumero = function(opId) {
    const inp=document.getElementById('mon-wpp-tel-inp');
    const tel=(inp?inp.value.trim():'');
    if (!tel){if(inp)inp.focus();return;}
    const telLimpo=tel.replace(/\D/g,'');
    const {nomeLider}=_wppOpMap[opId]||{};
    _wppCadastrarLider(opId, nomeLider, tel);
    const overlay=document.getElementById('mon-wpp-modal');
    if (overlay) overlay.remove();
    window.open('https://wa.me/55'+telLimpo,'_blank');
  };



  // ── RELATÓRIO DE ESCALA (mantido para compatibilidade — abre modal combinado) ─
  window._monAbrirRelEscala = function() { window._monAbrirRelatorios('escala'); };

  // ── MODAL COMBINADO: RELATÓRIOS ──────────────────────────────────────────────

  window._monAbrirRelatorios = function(abaInicial) {
    const antigo = document.getElementById('mon-rel-combinado-modal');
    if (antigo) antigo.remove();

    const overlay = document.createElement('div');
    overlay.id = 'mon-rel-combinado-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999998;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px);padding:16px';
    overlay.onclick = e => { if (e.target === overlay) { overlay.remove(); window._monRailVoltarOps(); } };

    const now = new Date();
    const pad2 = n => String(n).padStart(2,'0');
    const todayStr = now.getFullYear() + '-' + pad2(now.getMonth()+1) + '-' + pad2(now.getDate());
    const nowHHMM = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    const defaultHoraRef = pad2(Math.floor(Math.ceil((now.getHours()*60+now.getMinutes())/30)*30/60)%24) + ':' + pad2(Math.ceil((now.getHours()*60+now.getMinutes())/30)*30%60);

    // Turno atual para aba turno
    const turno = (function() {
      const t = now.getHours()*60+now.getMinutes();
      if (t >= 6*60 && t < 13*60+40) return 1;
      if (t >= 13*60+40 && t < 21*60+40) return 2;
      return 3;
    })();

    overlay.innerHTML = `<div onclick="event.stopPropagation()" style="background:var(--mon-surface,#fff);border-radius:14px;width:1100px;max-width:99vw;max-height:97vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,0.25);font-family:inherit;overflow:hidden">

      <!-- Header com abas -->
      <div style="display:flex;align-items:stretch;justify-content:space-between;border-bottom:1px solid var(--mon-border,#e0e0e0);flex-shrink:0;padding:0 20px">
        <div style="display:flex;gap:4px;align-items:flex-end">
          <button id="rel-comb-tab-turno" onclick="window._relCombSetAba('turno')"
            style="padding:16px 22px 14px;border:none;border-bottom:2px solid transparent;background:none;font-size:14px;font-weight:700;cursor:pointer;color:var(--mon-text-faint,#888);transition:all 0.15s">
            📝 Rel. Turno
          </button>
          <button id="rel-comb-tab-escala" onclick="window._relCombSetAba('escala')"
            style="padding:16px 22px 14px;border:none;border-bottom:2px solid transparent;background:none;font-size:14px;font-weight:700;cursor:pointer;color:var(--mon-text-faint,#888);transition:all 0.15s">
            📢 Escala Pendente
          </button>
          <button id="rel-comb-tab-saida" onclick="window._relCombSetAba('saida')"
            style="padding:16px 22px 14px;border:none;border-bottom:2px solid transparent;background:none;font-size:14px;font-weight:700;cursor:pointer;color:var(--mon-text-faint,#888);transition:all 0.15s">
            🚨 Saídas
          </button>
          <button id="rel-comb-tab-he" onclick="window._relCombSetAba('he')"
            style="padding:16px 22px 14px;border:none;border-bottom:2px solid transparent;background:none;font-size:14px;font-weight:700;cursor:pointer;color:var(--mon-text-faint,#888);transition:all 0.15s">
            ⏱️ H. Extra
          </button>
          <button id="rel-comb-tab-pedidos" onclick="window._relCombSetAba('pedidos')"
            style="padding:16px 22px 14px;border:none;border-bottom:2px solid transparent;background:none;font-size:14px;font-weight:700;cursor:pointer;color:var(--mon-text-faint,#888);transition:all 0.15s">
            📦 Pedidos
          </button>
        </div>
        <button onclick="document.getElementById('mon-rel-combinado-modal').remove();window._monRailVoltarOps()"
          style="background:none;border:none;cursor:pointer;font-size:22px;color:var(--mon-text-faint,#aaa);padding:0 4px">✕</button>
      </div>

      <!-- ABA TURNO -->
      <div id="rel-comb-aba-turno" style="display:flex;flex-direction:column;flex:1;overflow:hidden">
        <div style="overflow-y:auto;padding:24px 28px;flex:1;min-height:0;display:flex;gap:24px;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div style="display:flex;gap:10px;margin-bottom:18px;align-items:center">
              ${[1,2,3].map(t => `<button onclick="window._relSetTurno(${t})" id="rel-tbtn-${t}"
                style="padding:7px 18px;border-radius:7px;border:1.5px solid ${t===turno?'var(--mon-green,#16a34a)':'var(--mon-border,#e0e0e0)'};background:${t===turno?'var(--mon-green,#16a34a)':'none'};color:${t===turno?'#fff':'var(--mon-text-faint,#888)'};font-size:14px;font-weight:700;cursor:pointer">T${t}</button>`).join('')}
              <span style="font-size:13px;color:var(--mon-text-faint,#888)" id="rel-turno-info">${['','06:00–14:00','13:40–21:40','21:40–06:00'][turno]}</span>
            </div>

            <div style="margin-bottom:20px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                <span style="font-size:14px;font-weight:700;color:var(--mon-red,#dc2626)">📋 Faltas <span id="rel-total-f" style="font-size:12px;background:rgba(220,38,38,0.1);padding:2px 9px;border-radius:10px">00</span></span>
                <button onclick="window._relAddFalta()" style="font-size:13px;padding:5px 14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;background:none;color:var(--mon-text-faint,#888);cursor:pointer">+ Adicionar</button>
              </div>
              <div id="rel-lista-f" style="max-height:30vh;overflow-y:auto;padding-right:2px"></div>
            </div>

            <div style="margin-bottom:20px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                <span style="font-size:14px;font-weight:700;color:var(--mon-amber,#d97706)">❌ Não entregue <span id="rel-total-ne" style="font-size:12px;background:rgba(217,119,6,0.1);padding:2px 9px;border-radius:10px">00</span></span>
                <button onclick="window._relAddNE()" style="font-size:13px;padding:5px 14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;background:none;color:var(--mon-text-faint,#888);cursor:pointer">+ Adicionar</button>
              </div>
              <div id="rel-lista-ne" style="max-height:22vh;overflow-y:auto;padding-right:2px"></div>
            </div>

            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                <span style="font-size:14px;font-weight:700;color:var(--mon-blue,#2563eb)">⚠️ Pontos de atenção</span>
                <button onclick="window._relAddPonto()" style="font-size:13px;padding:5px 14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;background:none;color:var(--mon-text-faint,#888);cursor:pointer">+ Adicionar</button>
              </div>
              <div id="rel-lista-p" style="max-height:22vh;overflow-y:auto;padding-right:2px"></div>
            </div>
          </div>

          <div style="width:300px;flex-shrink:0">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Prévia</div>
            <div style="display:flex;gap:6px;margin-bottom:8px">
              <button id="rel-tab-plan" onclick="window._relVerTab('plan')"
                style="flex:1;padding:7px;border-radius:7px;border:1.5px solid var(--mon-green,#16a34a);background:rgba(22,163,74,0.1);font-size:12px;font-weight:700;color:var(--mon-green,#16a34a);cursor:pointer">💚 Planejamento</button>
              <button id="rel-tab-rep" onclick="window._relVerTab('rep')"
                style="flex:1;padding:7px;border-radius:7px;border:1.5px solid var(--mon-border,#e0e0e0);background:none;font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);cursor:pointer">⚠️ Report</button>
            </div>
            <div style="background:var(--mon-wa-bg,#ECE5DD);border-radius:10px;padding:10px;max-height:calc(97vh - 300px);overflow-y:auto">
              <div style="display:flex;justify-content:flex-end">
                <div style="max-width:98%;background:var(--mon-wa-bubble,#DCF8C6);border-radius:8px 0 8px 8px;padding:10px 12px 8px;box-shadow:0 1px 2px rgba(0,0,0,.15)">
                  <pre id="rel-preview" style="white-space:pre-wrap;font-size:13px;line-height:1.6;color:var(--mon-wa-text,#1a1a2e);word-break:break-word;min-height:50px;font-family:inherit;margin:0;background:transparent">—</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="padding:14px 28px;border-top:1px solid var(--mon-border,#e0e0e0);flex-shrink:0;display:flex;gap:8px;align-items:center">
          <button onclick="window._relRecarregarFaltas()"
            style="padding:11px 18px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);font-size:14px;font-weight:600;cursor:pointer">
            🔄 Recarregar faltas
          </button>
          <button onclick="window._relGerar()"
            style="padding:11px 22px;border:none;border-radius:8px;background:var(--mon-green,#16a34a);color:#fff;font-size:14px;font-weight:700;cursor:pointer">
            ⚡ Gerar
          </button>
          <button onclick="window._relCopiarAtivo()" id="rel-turno-btn-copiar"
            style="flex:1;padding:11px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text,#1a1a2e);font-size:14px;font-weight:700;cursor:pointer">
            📋 Copiar
          </button>
          <button onclick="window._relLimparRascunho()" title="Limpar todos os dados do relatório de turno"
            style="padding:11px 16px;border:1.5px solid var(--mon-red,#dc2626);border-radius:8px;background:none;color:var(--mon-red,#dc2626);font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap"
            onmouseover="this.style.background='var(--mon-red,#dc2626)';this.style.color='#fff'"
            onmouseout="this.style.background='none';this.style.color='var(--mon-red,#dc2626)'">
            🗑 Limpar
          </button>
        </div>
      </div>

      <!-- ABA ESCALA -->
      <div id="rel-comb-aba-escala" style="display:none;flex-direction:column;flex:1;overflow:hidden">
        <div style="overflow-y:auto;padding:24px 28px;flex:1;display:flex;gap:24px">

          <!-- Filtros -->
          <div style="flex:1;min-width:0">
            <div style="background:var(--mon-surface2,#f8f8f8);border-radius:10px;padding:16px;margin-bottom:18px;border:1px solid var(--mon-border,#e0e0e0)">
              <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">🔍 Filtro de período</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);display:block;margin-bottom:4px">DATA INÍCIO</label>
                  <input type="date" id="rel-esc-data-ini" value="${todayStr}"
                    style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);display:block;margin-bottom:4px">DATA FIM</label>
                  <input type="date" id="rel-esc-data-fim" value="${todayStr}"
                    style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);display:block;margin-bottom:4px">HORA INÍCIO</label>
                  <input type="time" id="rel-esc-hora-ini" value="05:00"
                    style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);display:block;margin-bottom:4px">HORA FIM</label>
                  <input type="time" id="rel-esc-hora-fim" value="16:00"
                    style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box">
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <button onclick="window._relEscalaPresset('hoje')" style="padding:5px 12px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:6px;background:none;font-size:12px;color:var(--mon-text-faint,#888);cursor:pointer">Hoje</button>
                <button onclick="window._relEscalaPresset('t1')" style="padding:5px 12px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:6px;background:none;font-size:12px;color:var(--mon-text-faint,#888);cursor:pointer">T1 06–14</button>
                <button onclick="window._relEscalaPresset('t2')" style="padding:5px 12px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:6px;background:none;font-size:12px;color:var(--mon-text-faint,#888);cursor:pointer">T2 13:40–21:40</button>
                <button onclick="window._relEscalaPresset('t3')" style="padding:5px 12px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:6px;background:none;font-size:12px;color:var(--mon-text-faint,#888);cursor:pointer">T3 21:40–06:00+1</button>
              </div>
              <button onclick="window._relEscalaGerar()" style="width:100%;padding:10px;border:none;border-radius:8px;background:var(--mon-green,#16a34a);color:#fff;font-size:14px;font-weight:700;cursor:pointer">
                ⚡ Gerar relatório
              </button>
            </div>

            <div style="font-size:12px;color:var(--mon-text-faint,#888);margin-bottom:12px">
              Operações com <b>escala incompleta</b> ou <b>sem escala (nenhum)</b> no período selecionado.
            </div>
            <div id="rel-esc-lista" style="font-size:13px;color:var(--mon-text-faint,#888);font-style:italic;max-height:300px;overflow-y:auto">
              Defina o período e clique em Gerar.
            </div>
          </div>

          <!-- Preview WA -->
          <div style="width:280px;flex-shrink:0">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Prévia WhatsApp</div>
            <div style="background:var(--mon-wa-bg,#ECE5DD);border-radius:10px;padding:10px;max-height:420px;overflow-y:auto">
              <div style="display:flex;justify-content:flex-end">
                <div style="max-width:98%;background:var(--mon-wa-bubble,#DCF8C6);border-radius:8px 0 8px 8px;padding:10px 12px 8px;box-shadow:0 1px 2px rgba(0,0,0,.15)">
                  <pre id="rel-esc-preview" style="white-space:pre-wrap;font-size:13px;line-height:1.65;color:var(--mon-wa-text,#1a1a2e);word-break:break-word;min-height:50px;font-family:inherit;margin:0;background:transparent">—</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="padding:14px 28px;border-top:1px solid var(--mon-border,#e0e0e0);flex-shrink:0">
          <button onclick="window._relEscalaCopiar()" id="rel-esc-btn-copiar" disabled
            style="width:100%;padding:11px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);font-size:14px;font-weight:700;cursor:not-allowed;opacity:0.5">
            📋 Copiar para WhatsApp
          </button>
        </div>
      </div>

      <!-- ABA SAÍDAS -->
      <div id="rel-comb-aba-saida" style="display:none;flex-direction:column;flex:1;overflow:hidden">
        <div style="overflow-y:auto;padding:24px 28px;flex:1">

          <!-- Filtro de horário -->
          <div style="background:var(--mon-surface2,#f8f8f8);border-radius:10px;padding:16px;margin-bottom:18px;border:1px solid var(--mon-border,#e0e0e0)">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">🔍 Filtrar por horário de início</div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="display:flex;flex-direction:column;gap:4px;flex:1">
                <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888)">DE</label>
                <input id="mon-sa-hora-ini" type="time" value="00:00"
                  style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box;font-family:var(--mon-mono,monospace)">
              </div>
              <div style="color:var(--mon-text-faint,#888);margin-top:16px;font-size:16px">→</div>
              <div style="display:flex;flex-direction:column;gap:4px;flex:1">
                <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888)">ATÉ</label>
                <input id="mon-sa-hora-fim" type="time" value="23:59"
                  style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box;font-family:var(--mon-mono,monospace)">
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <label style="font-size:11px;color:transparent">.</label>
                <button onclick="window._monSaPreview()"
                  style="padding:8px 14px;border-radius:7px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface2,#f8f8f8);color:var(--mon-text-dim,#555);font-size:12px;cursor:pointer;white-space:nowrap">
                  👁 Ver ops
                </button>
              </div>
            </div>
            <div id="mon-sa-preview" style="min-height:24px;font-size:11px;color:var(--mon-text-faint,#888);font-style:italic">
              Clique em "Ver ops" para pré-visualizar ou clique direto em Verificar.
            </div>
          </div>

          <!-- Resultado -->
          <div id="mon-sa-resultado" style="display:none;margin-bottom:16px;max-height:300px;overflow-y:auto;border:1px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:14px"></div>

          <!-- Ações -->
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button onclick="window._monVerificarSaidas()"
              style="padding:10px 22px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:700;background:var(--mon-accent,#6366f1);color:#fff">
              🔍 Verificar
            </button>
            <button id="mon-sa-btn-copiar" onclick="window._monSaCopiarPlanilha()" style="display:none;padding:10px 22px;border-radius:8px;border:1.5px solid var(--mon-accent,#6366f1);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-accent-bg,rgba(99,102,241,.12));color:var(--mon-accent,#6366f1)">
              📋 Copiar Planilha
            </button>
            <button id="mon-sa-btn-excel" onclick="window._monExportarSaidas()" style="display:none;padding:10px 22px;border-radius:8px;border:1.5px solid var(--mon-green,#16a34a);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-green-bg,rgba(22,163,74,.1));color:var(--mon-green,#16a34a)">
              📥 Relatório Excel
            </button>
          </div>
        </div>
      </div>

      <!-- ABA HORA EXTRA -->
      <div id="rel-comb-aba-he" style="display:none;flex-direction:column;flex:1;overflow:hidden">
        <div style="overflow-y:auto;padding:24px 28px;flex:1">

          <!-- Filtro de horário -->
          <div style="background:var(--mon-surface2,#f8f8f8);border-radius:10px;padding:16px;margin-bottom:18px;border:1px solid var(--mon-border,#e0e0e0)">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">🔍 Filtrar por horário de início</div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="display:flex;flex-direction:column;gap:4px;flex:1">
                <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888)">DE</label>
                <input id="mon-he-hora-ini" type="time" value="00:00"
                  style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box;font-family:var(--mon-mono,monospace)">
              </div>
              <div style="color:var(--mon-text-faint,#888);margin-top:16px;font-size:16px">→</div>
              <div style="display:flex;flex-direction:column;gap:4px;flex:1">
                <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888)">ATÉ</label>
                <input id="mon-he-hora-fim" type="time" value="23:59"
                  style="width:100%;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);box-sizing:border-box;font-family:var(--mon-mono,monospace)">
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <label style="font-size:11px;color:transparent">.</label>
                <button onclick="window._monHePreview()"
                  style="padding:8px 14px;border-radius:7px;border:1.5px solid var(--mon-border,#e0e0e0);background:var(--mon-surface2,#f8f8f8);color:var(--mon-text-dim,#555);font-size:12px;cursor:pointer;white-space:nowrap">
                  👁 Ver ops
                </button>
              </div>
            </div>
            <div id="mon-he-preview" style="min-height:24px;font-size:11px;color:var(--mon-text-faint,#888);font-style:italic">
              Clique em "Ver ops" para pré-visualizar ou clique direto em Verificar.
            </div>
          </div>

          <!-- Resultado -->
          <div id="mon-he-resultado" style="display:none;margin-bottom:16px;max-height:300px;overflow-y:auto;border:1px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:14px"></div>

          <!-- Ações -->
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button onclick="window._monVerificarHoraExtra()"
              style="padding:10px 22px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:700;background:var(--mon-accent,#6366f1);color:#fff">
              🔍 Verificar
            </button>
            <button id="mon-he-btn-copiar" onclick="window._monHeCopiarPlanilha()" style="display:none;padding:10px 22px;border-radius:8px;border:1.5px solid var(--mon-accent,#6366f1);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-accent-bg,rgba(99,102,241,.12));color:var(--mon-accent,#6366f1)">
              📋 Copiar Planilha
            </button>
            <button id="mon-he-btn-excel" onclick="window._monExportarHoraExtra()" style="display:none;padding:10px 22px;border-radius:8px;border:1.5px solid var(--mon-green,#16a34a);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-green-bg,rgba(22,163,74,.1));color:var(--mon-green,#16a34a)">
              📥 Relatório Excel
            </button>
            <button id="mon-he-btn-atribuir" onclick="window._monHeAbrirAtribuicao()" style="display:none;padding:10px 22px;border-radius:8px;border:1.5px solid var(--mon-purple,#a855f7);cursor:pointer;font-size:13px;font-weight:600;background:rgba(168,85,247,.12);color:var(--mon-purple,#a855f7)">
              ⚡ Atribuir HE
            </button>
          </div>
        </div>
      </div>

      <!-- ABA PEDIDOS -->
      <div id="rel-comb-aba-pedidos" style="display:none;flex-direction:column;flex:1;overflow:hidden">
        <div style="overflow-y:auto;padding:24px 28px;flex:1">

          <!-- Upload do XLSX -->
          <div style="background:var(--mon-surface2,#f8f8f8);border-radius:10px;padding:16px;margin-bottom:18px;border:1px solid var(--mon-border,#e0e0e0)">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">📤 Upload do XLSX de Solicitações</div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <input id="mon-ped-file" type="file" accept=".xlsx,.xls"
                style="flex:1;min-width:240px;padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);cursor:pointer">
              <button onclick="window._monPedProcessar()"
                style="padding:10px 22px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:700;background:var(--mon-accent,#6366f1);color:#fff;white-space:nowrap">
                🔍 Processar
              </button>
            </div>
            <div id="mon-ped-status" style="margin-top:10px;font-size:12px;color:var(--mon-text-faint,#888);font-style:italic">
              Selecione o XLSX exportado do TSI (com colunas CHAVE, SITE, DATA, SOLICITADO, ESCALADO, ENTREGUE).
            </div>
          </div>

          <!-- Filtros + opções (aparece após processar) -->
          <div id="mon-ped-filtros" style="display:none;background:var(--mon-surface2,#f8f8f8);border-radius:10px;padding:16px;margin-bottom:18px;border:1px solid var(--mon-border,#e0e0e0)">
            <div style="font-size:12px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">📅 Filtro e arquivos a gerar</div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap">
              <div style="display:flex;flex-direction:column;gap:4px">
                <label style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888)">DATA</label>
                <input id="mon-ped-filtro-data" type="date"
                  style="padding:8px 10px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);font-family:var(--mon-mono,monospace)">
              </div>
            </div>
            <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mon-text-dim,#555);cursor:pointer">
                <input id="mon-ped-chk-faltas" type="checkbox" checked> Faltas
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mon-text-dim,#555);cursor:pointer">
                <input id="mon-ped-chk-top3" type="checkbox" checked> Top 3 (faltas + a mais)
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mon-text-dim,#555);cursor:pointer">
                <input id="mon-ped-chk-pedidos" type="checkbox" checked> Pedidos (com cores)
              </label>
            </div>
            <button onclick="window._monPedGerar()"
              style="padding:10px 22px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:700;background:var(--mon-green,#16a34a);color:#fff">
              📥 Gerar XLSX
            </button>
          </div>

          <!-- Resumo (aparece após gerar) -->
          <div id="mon-ped-resumo" style="display:none;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
            <div style="background:var(--mon-surface2,#f8f8f8);border:1px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em">Total</div>
              <div id="mon-ped-stat-total" style="font-size:22px;font-weight:800;color:var(--mon-text,#1a1a2e);margin-top:4px">0</div>
            </div>
            <div style="background:#fde8e8;border:1px solid #f5c6c6;border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:11px;font-weight:700;color:#c0392b;text-transform:uppercase;letter-spacing:.05em">Faltas</div>
              <div id="mon-ped-stat-faltas" style="font-size:22px;font-weight:800;color:#c0392b;margin-top:4px">0</div>
            </div>
            <div style="background:#e8f5e9;border:1px solid #b8d8b9;border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:11px;font-weight:700;color:#1d6a2e;text-transform:uppercase;letter-spacing:.05em">A Mais</div>
              <div id="mon-ped-stat-amais" style="font-size:22px;font-weight:800;color:#1d6a2e;margin-top:4px">0</div>
            </div>
            <div style="background:var(--mon-surface2,#f8f8f8);border:1px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:11px;font-weight:700;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.05em">OK</div>
              <div id="mon-ped-stat-ok" style="font-size:22px;font-weight:800;color:var(--mon-text,#1a1a2e);margin-top:4px">0</div>
            </div>
          </div>

          <!-- Log de execução -->
          <div id="mon-ped-log" style="display:none;background:var(--mon-surface2,#f8f8f8);border:1px solid var(--mon-border,#e0e0e0);border-radius:8px;padding:12px;font-family:var(--mon-mono,monospace);font-size:12px;color:var(--mon-text-dim,#555);max-height:200px;overflow-y:auto"></div>
        </div>
      </div>
    </div>`;

    document.body.appendChild(overlay);

    // Ativa aba solicitada
    window._relCombSetAba(abaInicial || 'turno');

    // Carrega dados do turno
    const _initTurno = () => {
      const rascunho = window._relCarregarRascunho ? window._relCarregarRascunho() : null;
      const turnoFinal = (rascunho && rascunho.turno) ? rascunho.turno : turno;

      // Popula estado centralizado
      _rel.turno  = turnoFinal;
      _rel.ne     = (rascunho && rascunho.ne)     ? rascunho.ne     : [];
      _rel.pontos = (rascunho && rascunho.pontos) ? rascunho.pontos : [];
      _rel.txtPlan = ''; _rel.txtRep = ''; _rel.tabAtiva = 'plan';
      _relTurnoSel = turnoFinal; // compat

      // Botões de turno
      ;[1,2,3].forEach(function(i) {
        const b = document.getElementById('rel-tbtn-'+i);
        if (!b) return;
        b.style.background  = i===turnoFinal ? 'var(--mon-green,#16a34a)' : 'none';
        b.style.color       = i===turnoFinal ? '#fff' : 'var(--mon-text-faint,#888)';
        b.style.borderColor = i===turnoFinal ? 'var(--mon-green,#16a34a)' : 'var(--mon-border,#e0e0e0)';
      });
      const infoEl = document.getElementById('rel-turno-info');
      if (infoEl) infoEl.textContent = ['','06:00–14:00','13:40–21:40','21:40–06:00'][turnoFinal];

      // Renderiza NE e Pontos (síncronos)
      _relReRender('ne');
      _relReRender('p');

      // Auto-save nos inputs
      ['rel-lista-f','rel-lista-ne','rel-lista-p'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', function() { setTimeout(window._relSalvarRascunho, 400); });
      });

      // Faltas: async (Supabase), usa rascunho se disponível
      _faltasLoad(function() {
        _rel.faltas = (rascunho && rascunho.faltas && rascunho.faltas.length > 0)
          ? rascunho.faltas
          : (window._relColetarFaltas ? window._relColetarFaltas() : []);
        _relFaltas = _rel.faltas; // compat
        _relReRender('f');
      });
    };
    _initTurno();
  };

  // Troca de aba do modal combinado
  window._relCombSetAba = function(aba) {
    const abas = ['turno', 'escala', 'saida', 'he', 'pedidos'];
    abas.forEach(a => {
      const abaEl = document.getElementById('rel-comb-aba-' + a);
      const tabEl = document.getElementById('rel-comb-tab-' + a);
      if (!abaEl || !tabEl) return;
      const ativo = a === aba;
      abaEl.style.display = ativo ? 'flex' : 'none';
      tabEl.style.color = ativo ? 'var(--mon-green,#16a34a)' : 'var(--mon-text-faint,#888)';
      tabEl.style.borderBottom = ativo ? '2px solid var(--mon-green,#16a34a)' : '2px solid transparent';
    });
    if (aba === 'saida' && window._monSaPreview) {
      // Preenche horários sugeridos com base nas ops e faz preview automático
      const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => o.id);
      const horas = ops.map(o => o.hora).filter(Boolean).sort();
      const iniEl = document.getElementById('mon-sa-hora-ini');
      const fimEl = document.getElementById('mon-sa-hora-fim');
      if (iniEl && horas.length) iniEl.value = horas[0];
      if (fimEl && horas.length) fimEl.value = horas[horas.length - 1];
      window._monSaResultados = null;
      setTimeout(window._monSaPreview, 80);
    }
    if (aba === 'he' && window._monHePreview) {
      // Preenche horários sugeridos com base nas ops e faz preview automático
      const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => o.id);
      const horas = ops.map(o => o.hora).filter(Boolean).sort();
      const iniEl = document.getElementById('mon-he-hora-ini');
      const fimEl = document.getElementById('mon-he-hora-fim');
      if (iniEl && horas.length) iniEl.value = horas[0];
      if (fimEl && horas.length) fimEl.value = horas[horas.length - 1];
      window._monHeResultados = null;
      setTimeout(window._monHePreview, 80);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════

  // ── MÓDULO: RELATÓRIO DE PEDIDOS (upload XLSX) ───────────────────────────
  // Lê o XLSX de Solicitações exportado do TSI, filtra por data e gera:
  //   1) faltas_DDMM.xlsx   — pedidos com entregue < solicitado  (vermelho)
  //   2) top3_DDMM.xlsx     — top 3 faltas + top 3 a mais
  //   3) pedidos_DDMM.xlsx  — todos do dia com cores (verde/amarelo/vermelho)
  // Colunas do XLSX de entrada: CHAVE, CLIENTE, SITE, FAIXA, TIPO PGTO,
  //   DATA, HORA, CONTA, SOLICITADO, ESCALADO, ENTREGUE, TIME, ADVISOR, ...
  // ══════════════════════════════════════════════════════════════════════════

  // Dados lidos do arquivo ficam aqui
  window._monPedDados = [];

  // ── Lê o XLSX usando a API nativa (FileReader + ZIP manual) ──────────────
  // Usa SheetJS via CDN se disponível, senão fallback manual
  window._monPedProcessar = async function() {
    const fileInput = document.getElementById('mon-ped-file');
    const statusEl  = document.getElementById('mon-ped-status');
    const filtrosEl = document.getElementById('mon-ped-filtros');
    const resumoEl  = document.getElementById('mon-ped-resumo');
    const logEl     = document.getElementById('mon-ped-log');

    if (!fileInput || !fileInput.files.length) {
      if (statusEl) statusEl.textContent = '⚠️ Selecione um arquivo XLSX primeiro.';
      return;
    }

    if (statusEl) statusEl.textContent = '⏳ Lendo arquivo...';
    if (logEl) { logEl.style.display = 'none'; logEl.innerHTML = ''; }
    if (resumoEl) resumoEl.style.display = 'none';
    if (filtrosEl) filtrosEl.style.display = 'none';

    const file = fileInput.files[0];

    try {
      // Carrega SheetJS dinamicamente se não estiver disponível
      if (typeof XLSX === 'undefined') {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }

      const buf  = await file.arrayBuffer();
      const wb   = XLSX.read(buf, { type: 'array' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      // Achar linha de cabeçalho (que tem "CHAVE")
      let hdrIdx = rows.findIndex(r => r.some(c => String(c).trim().toUpperCase() === 'CHAVE'));
      if (hdrIdx < 0) throw new Error('Cabeçalho CHAVE não encontrado');

      const hdr = rows[hdrIdx].map(c => String(c).trim().toUpperCase());
      const col = name => hdr.indexOf(name);

      const iChave   = col('CHAVE');
      const iSite    = col('SITE') >= 0 ? col('SITE') : col('CLIENTE');
      const iCliente = col('CLIENTE');
      const iStatus  = col('STATUS');
      const iData    = col('DATA');
      const iSolic   = col('SOLICITADO');
      const iEsc     = col('ESCALADO');
      const iEnt     = col('ENTREGUE');

      const dados = [];
      for (let i = hdrIdx + 1; i < rows.length; i++) {
        const r = rows[i];
        const chave = String(r[iChave] || '').trim();
        if (!chave) continue;

        // ── Ignora: STATUS = "Cancelada" ou CLIENTE = "TSI ADM" ──
        const status  = iStatus  >= 0 ? String(r[iStatus]  || '').trim() : '';
        const cliente = iCliente >= 0 ? String(r[iCliente] || '').trim() : '';
        if (status.toLowerCase()  === 'cancelada') continue;
        if (cliente.toUpperCase() === 'TSI ADM')   continue;

        const solicitado = parseInt(r[iSolic], 10) || 0;
        const escalado   = parseInt(r[iEsc],   10) || 0;
        const entregue   = parseInt(r[iEnt],   10) || 0;

        // DATA vem como "26/05/2026" ou número serial Excel
        let dataStr = '';
        const rawData = r[iData];
        if (rawData) {
          if (typeof rawData === 'number') {
            // Serial Excel → JS Date
            const d = new Date(Math.round((rawData - 25569) * 86400 * 1000));
            const dd = String(d.getUTCDate()).padStart(2,'0');
            const mm = String(d.getUTCMonth()+1).padStart(2,'0');
            const yy = d.getUTCFullYear();
            dataStr = dd + '/' + mm + '/' + yy;
          } else {
            dataStr = String(rawData).trim();
          }
        }

        dados.push({ chave, site: String(r[iSite]||'').trim(), data: dataStr, solicitado, escalado, entregue, diff: entregue - solicitado });
      }

      window._monPedDados = dados;

      // Sugerir data do primeiro registro
      const primeiraData = dados[0]?.data || '';
      const dataInput = document.getElementById('mon-ped-filtro-data');
      if (dataInput && primeiraData) {
        const parts = primeiraData.split('/');
        if (parts.length === 3) dataInput.value = parts[2] + '-' + parts[1] + '-' + parts[0];
      }

      const totalLidos   = rows.length - hdrIdx - 1;
      const ignorados    = totalLidos - dados.length;
      const msgIgnorados = ignorados > 0 ? ` (${ignorados} ignorados: Cancelada / TSI ADM)` : '';
      if (statusEl) statusEl.textContent = '✅ ' + dados.length + ' registros lidos' + msgIgnorados + '. Selecione a data e clique em Gerar XLSX.';
      if (filtrosEl) filtrosEl.style.display = 'block';
      if (logEl) {
        logEl.style.display = 'block';
        logEl.innerHTML = '<div style="color:#16a34a">✓ Arquivo lido: ' + dados.length + ' registros válidos' + msgIgnorados + '</div>';
      }

    } catch (e) {
      if (statusEl) statusEl.textContent = '✗ Erro: ' + e.message;
      console.error('[Pedidos]', e);
    }
  };

  // ── Gerar os XLSXs a partir dos dados já lidos ───────────────────────────
  window._monPedGerar = function() {
    const dados   = window._monPedDados || [];
    const logEl   = document.getElementById('mon-ped-log');
    const resumoEl= document.getElementById('mon-ped-resumo');

    const log = msg => {
      if (!logEl) return;
      logEl.style.display = 'block';
      const d = document.createElement('div');
      d.textContent = msg;
      logEl.appendChild(d);
      logEl.scrollTop = logEl.scrollHeight;
    };

    if (!dados.length) { log('⚠️ Nenhum dado carregado. Faça o upload primeiro.'); return; }

    // Pegar data do filtro
    const dataInputVal = (document.getElementById('mon-ped-filtro-data')?.value || '').trim();
    let filtDDMM = ''; // "2605"
    let dataTitulo = ''; // "26/05"
    if (dataInputVal) {
      const [y, m, d] = dataInputVal.split('-');
      filtDDMM   = d + m;
      dataTitulo = d + '/' + m;
    }

    // Filtrar por data se selecionada
    const filtradas = filtDDMM
      ? dados.filter(r => {
          // r.data = "26/05/2026" — pega DD+MM
          const parts = r.data.split('/');
          const ddmm = (parts[0]||'') + (parts[1]||'');
          return ddmm === filtDDMM;
        })
      : dados;

    log('Filtradas para ' + (dataTitulo || 'todas as datas') + ': ' + filtradas.length + ' registros');

    if (!filtradas.length) { log('⚠️ Nenhum registro para essa data.'); return; }

    // Ordenar por data/hora crescente — a chave do TSI tem 12 dígitos DDMMAAAAHHMM na parte numérica
    // Regex busca o bloco de 12 dígitos precedido por letras (prefixo do site, ex: MLMG15XXXX),
    // garantindo que dígitos do nome do site (ex: "15" em MLMG15) não sejam capturados.
    const sortKey = r => {
      const chave = String(r.chave || '');
      // Tenta casar: qualquer prefixo alfanumérico seguido de exatamente 12 dígitos (DDMMAAAAHHMM)
      // O \b garante que pegamos um bloco de 12 dígitos e não parte de uma sequência maior.
      const m = chave.match(/[A-Za-z](\d{12})(?!\d)/) || chave.match(/(\d{12})(?!\d)/);
      if (m) {
        const s = m[1]; // DDMMAAAAHHMM
        return s.slice(4,8) + s.slice(2,4) + s.slice(0,2) + s.slice(8,12); // AAAAMMDDHHMM
      }
      // Fallback: usar campo data se chave não tiver formato esperado
      const parts = String(r.data || '').split('/');
      if (parts.length === 3) return parts[2] + parts[1] + parts[0];
      return '';
    };
    filtradas.sort((a,b) => sortKey(a).localeCompare(sortKey(b)));

    const faltas      = filtradas.filter(r => r.diff < 0).sort((a,b) => a.diff - b.diff);
    const aMais       = filtradas.filter(r => r.diff > 0).sort((a,b) => b.diff - a.diff);
    // Para "faltas" e "aMais" no relatório principal, manter ordem cronológica
    const faltasCron  = filtradas.filter(r => r.diff < 0);
    const top3Faltas  = faltas.slice(0, 3);
    const top3AMais   = aMais.slice(0, 3);

    const setStat = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    if (resumoEl) resumoEl.style.display = 'grid';
    setStat('mon-ped-stat-total',  filtradas.length);
    setStat('mon-ped-stat-faltas', faltas.length);
    setStat('mon-ped-stat-amais',  aMais.length);
    setStat('mon-ped-stat-ok',     filtradas.length - faltas.length - aMais.length);

    const gerarFaltas  = document.getElementById('mon-ped-chk-faltas')?.checked !== false;
    const gerarTop3    = document.getElementById('mon-ped-chk-top3')?.checked !== false;
    const gerarPedidos = document.getElementById('mon-ped-chk-pedidos')?.checked !== false;

    const dt = dataTitulo.replace('/', '') || 'todos';

    // ── Totais ──
    const totSolic = faltas.reduce((a,r) => a + r.solicitado, 0);
    const totEsc   = faltas.reduce((a,r) => a + r.escalado,   0);
    const totEnt   = faltas.reduce((a,r) => a + r.entregue,   0);
    const totDiff  = faltas.reduce((a,r) => a + r.diff,       0);

    // ══════════════════════════════════════════════════════════════════════════
    // GERADOR XLSX — MODELO DE REFERÊNCIA (Relatório_de_Faltas.xlsx / TOP_3.xlsx)
    // Usa SheetJS (já carregado acima) para gerar o XLSX com fidelidade ao modelo.
    // ══════════════════════════════════════════════════════════════════════════

    // ── helpers de estilo reutilizáveis ──────────────────────────────────────
    function _pedStyleRef() {
      // Retorna funções que criam objetos de célula prontos para SheetJS com estilos
      // compatíveis com o modelo de referência (sem SheetJS PRO — usamos escrita manual
      // do XML de estilos via _monPedGerarXlsx que já existe).
      // Retorna apenas os metadados; o renderizador já sabe os índices.
      return true;
    }

    // ── ARQUIVO 1: Faltas — modelo Relatório_de_Faltas.xlsx ──────────────────
    // Layout: col C=margem(3.57), D=Chave(22.29), E=Site(57.71), F=Solicitado(18.71),
    //         G=Escalado, H=Apontamentos, I=Entregues, J=margem(3.71)
    // Row 1–2: padding, Row 3: título mesclado D2:I2 bold medium-border,
    // Row 4: cabeçalho thin-border, Row 5+: dados, última: Total
    if (gerarFaltas) {
      const abaFaltas = {
        nome: 'Faltas',
        dataTitulo: dataTitulo,
        rows: faltasCron.map((r, i) => Object.assign(
          [null, r.chave, r.site, r.solicitado, r.escalado, r.entregue, r.diff, null],
          {_type:'data'}
        )),
      };
      _monPedGerarXlsxRef([abaFaltas], 'faltas_' + dt + '.xlsx');      log('✓ faltas_' + dt + '.xlsx gerado');
    }

    // ── ARQUIVO 2: Top 3 — modelo TOP_3.xlsx ─────────────────────────────────
    // Layout: col A=margem(2.71), B=Chave(26.71), C=Site(49.29), D=Solic(14.14),
    //         E=Entregue(11.71), F=NoShow/AMais(17.86), G=Observações(65.29),
    //         H=Ações(39.14), I=margem(3.71)
    // Estrutura:
    //   Rows 1–4: fundo escuro (cinza #595959) — margem superior + lateral
    //   Row 5: título "NO SHOW" mesclado B5:H5, 14pt bold, fundo escuro
    //   Row 6: cabeçalho CHAVE|SITE|SOLICITADO|ENTREGUE|NO SHOW|OBSERVAÇÕES|AÇÕES, 12pt bold
    //   Rows 7–9: dados top3 faltas (zebra F4F7EE / branco)
    //   Row 9 (se sem faltas): "SEM FALTAS" mesclado B9:H9
    //   Row 10: linha vazia escura (separador)
    //   Row 11: título "A MAIS" mesclado B11:H11, 14pt bold, fundo escuro
    //   Row 12: cabeçalho com "A MAIS" na col F
    //   Rows 13–15: dados top3 a mais (zebra com verde #EDF7E6 / #F5FBF0)
    //   Rows 16+: fundo escuro (margem inferior)
    if (gerarTop3) {
      // Monta linhas NO SHOW (top3 maiores faltas)
      const rowsNS = top3Faltas.map((r, i) =>
        Object.assign([null, r.chave, r.site, r.solicitado, r.entregue, r.diff, '', ''], {_type:'noshow'})
      );
      // Monta linhas A MAIS (top3 maiores a mais)
      const rowsAM = top3AMais.map((r, i) =>
        Object.assign([null, r.chave, r.site, r.solicitado, r.entregue, '+'+r.diff, '', ''], {_type:'amais'})
      );
      const abaTop3 = {
        nome: 'Top3',
        rows: [...rowsNS, ...rowsAM],
      };
      _monPedGerarXlsxRef([abaTop3], 'top3_' + dt + '.xlsx');      log('✓ top3_' + dt + '.xlsx gerado');
    }

    // ── ARQUIVO 3: Pedidos com cores ──
    if (gerarPedidos) {
      const totPS = filtradas.reduce((a,r) => a + r.solicitado, 0);
      const totPE = filtradas.reduce((a,r) => a + r.escalado,   0);
      const totPEnt = filtradas.reduce((a,r) => a + r.entregue, 0);

      // Diff com sinal: "-2", "+2" ou "0"
      const fmtDiff = r => {
        if (r.diff > 0) return '+' + r.diff;
        return r.diff;
      };

      // Estilo por célula — neutro/vermelho/verde dependendo da condição da coluna
      const cellStyle = (cond, i) => {
        const z = i % 2 === 0;
        if (cond === 'neg') return z ? 'negZebra' : 'neg';
        if (cond === 'pos') return z ? 'posZebra' : 'pos';
        return z ? 'zebra' : 'normal';
      };
      const cellStyleLeft = i => i % 2 === 0 ? 'zebraLeft' : 'normalLeft';

      const abaPed = {
        nome: 'Pedidos',
        widths: [22, 50, 14, 13, 16, 14],
        merges: [{ s:{r:0,c:0}, e:{r:0,c:5} }],
        rows: [
          [{ v:'RELATÓRIO DE PEDIDOS - ' + dataTitulo, s:'titleBlue' },{v:'',s:'titleBlue'},{v:'',s:'titleBlue'},{v:'',s:'titleBlue'},{v:'',s:'titleBlue'},{v:'',s:'titleBlue'}],
          [{ v:'CHAVE', s:'hdr' },{ v:'SITE', s:'hdr' },{ v:'SOLICITADO', s:'hdr' },{ v:'ESCALADO', s:'hdr' },{ v:'ENTREGUE', s:'hdr' },{ v:'DIFERENÇA', s:'hdr' }],
          ...filtradas.map((r,i) => {
            const escCond = r.escalado < r.solicitado ? 'neg' : 'neutro';
            const apCond  = r.diff < 0 ? 'neg' : (r.diff > 0 ? 'pos' : 'neutro');
            const diffCond = apCond;
            return [
              { v:r.chave,      s:cellStyle('neutro', i) },
              { v:r.site,       s:cellStyleLeft(i) },
              { v:r.solicitado, s:cellStyle('neutro', i) },
              { v:r.escalado,   s:cellStyle(escCond, i) },
              { v:r.entregue,   s:cellStyle(apCond, i) },
              { v:fmtDiff(r),   s:cellStyle(diffCond, i) },
            ];
          }),
          [{v:'',s:'sep'},{v:'',s:'sep'},{v:'',s:'sep'},{v:'',s:'sep'},{v:'',s:'sep'},{v:'',s:'sep'}],
          [{ v:'TOTAL', s:'total' },{ v:'', s:'total' },{ v:totPS, s:'totalNum' },{ v:totPE, s:'totalNum' },{ v:totPEnt, s:'totalNum' },{ v:'', s:'total' }],
        ]
      };
      _monPedGerarXlsx([abaPed], 'pedidos_' + dt + '.xlsx');
      log('✓ pedidos_' + dt + '.xlsx gerado');
    }
  };

  // ── Gerador XLSX com estilos ─────────────────────────────────────────────
  function _monPedGerarXlsx(abas, nomeArq) {
    const esc = v => String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    const STYLES = {
      titleRed:0, titleGreen:1, titleBlue:16,
      hdr:2, hdrLeft:3,
      normal:4, normalLeft:5, zebra:6, zebraLeft:7,
      neg:8, negZebra:9, pos:10, posZebra:11,
      sep:12, total:13, totalNum:14, totalNeg:15,
      pedOk:17, pedOkLeft:18, pedFalta:19, pedFaltaLeft:20, pedMais:21, pedMaisLeft:22,
      obsAcoes:24,
    };

    // ── IDENTIDADE VISUAL CORPORATIVA — Olive Drab Executive Theme v2 ────────
    // Inspiração: planilha operacional com bordas valorizadas, separações claras,
    // presença visual forte — porém mais elegante e refinada.
    // Paleta: #6B8E23 Olive Drab como cor-âncora. Fundo branco dominante.
    //
    // FONTS (10 slots) — Courier New em todo o sistema
    //  0 = corpo centro   — 10pt regular  #1A1A2E (quase-preto)
    //  1 = título         — 12pt bold     #FFFFFF  (branco sobre Olive escuro)
    //  2 = cabeçalho col  — 9pt bold      #FFFFFF  (branco puro — max contraste)
    //  3 = negativo       — 10pt bold     #8B1A1A  (vermelho executivo)
    //  4 = positivo       — 10pt bold     #1A4D0F  (verde profundo)
    //  5 = corpo esq      — 10pt regular  #1A1A2E
    //  6 = total label    — 10pt bold     #FFFFFF  (sobre Olive escuro footer)
    //  7 = separador      — 6pt  regular  #FFFFFF  (invisível)
    //  8 = total número   — 10pt bold     #FFFFFF
    //  9 = negZebra       — 10pt bold     #6B0000  (vermelho profundo)
    //
    // FILLS (15 slots)
    //  0  = none        (OOXML obrigatório)
    //  1  = gray125     (OOXML obrigatório)
    //  2  = título      #3A5212  (Olive muito escuro — header principal)
    //  3  = cabeçalho   #6B8E23  (Olive Drab puro)
    //  4  = branco      #FFFFFF
    //  5  = zebra       #F4F7EE  (off-white com toque oliva)
    //  6  = footer      #3A5212  (espelha título)
    //  7  = negWhite    #FFF5F5  (vermelho ultra-suave)
    //  8  = posWhite    #F5FBF0  (verde ultra-suave)
    //  9  = negZebra    #FFECEC  (vermelho claro)
    // 10  = posZebra    #EDF7E6  (verde claro)
    // 11  = sep         #FFFFFF  (branco — linha espaçadora invisível)
    // 12  = titleMid    #4F6E1A  (Olive intermediário — titleBlue)
    // 13  = titleDark   #2E4410  (Olive escuro — titleGreen)
    // 14  = colDefault  #FFFFFF  (branco para limpar fundo de colunas)
    //
    // BORDERS (5 slots) — bordas mais valorizadas e presentes
    //  0 = none
    //  1 = medium corpo  — medium #A8B89A (cinza-oliva médio — borda valorizada)
    //  2 = footer top    — thick  #6B8E23 (linha Olive grossa de fechamento)
    //  3 = título        — medium #8AAD30 na bottom (detalhe golden-olive)
    //  4 = obs/acoes     — medium #A8B89A + dashed bottom (coluna editável)
    //
    // cellXfs (25 slots):
    //  0=titleRed  1=titleGreen  2=hdr      3=hdrLeft
    //  4=normal    5=normalLeft  6=zebra    7=zebraLeft
    //  8=neg       9=negZebra   10=pos     11=posZebra
    // 12=sep      13=total      14=totalNum 15=totalNeg
    // 16=titleBlue 17=pedOk    18=pedOkLeft 19=pedFalta 20=pedFaltaLeft
    // 21=pedMais  22=pedMaisLeft 23=colDefault 24=obsAcoes
    const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +

'<fonts count="11">' +
/* 0 corpo centro */ '<font><sz val="10"/><name val="Cambria"/><color rgb="FF1A1A2E"/></font>' +
/* 1 título bold  */ '<font><sz val="12"/><b/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
/* 2 hdr bold     */ '<font><sz val="9"/><b/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
/* 3 neg bold     */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FFC00000"/></font>' +
/* 4 pos bold     */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FF1A4D0F"/></font>' +
/* 5 corpo esq    */ '<font><sz val="10"/><name val="Cambria"/><color rgb="FF1A1A2E"/></font>' +
/* 6 total label  */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
/* 7 separador    */ '<font><sz val="6"/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
/* 8 total num    */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
/* 9 negZebra     */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FFC00000"/></font>' +
/* 10 totalNeg on dark — branco bold sobre Olive escuro, máximo contraste */ '<font><sz val="10"/><b/><name val="Cambria"/><color rgb="FFFFFFFF"/></font>' +
'</fonts>' +

'<fills count="15">' +
/* 0  none    */ '<fill><patternFill patternType="none"/></fill>' +
/* 1  gray125 */ '<fill><patternFill patternType="gray125"/></fill>' +
/* 2  título  */ '<fill><patternFill patternType="solid"><fgColor rgb="FF3A5212"/></patternFill></fill>' +
/* 3  hdr     */ '<fill><patternFill patternType="solid"><fgColor rgb="FF6B8E23"/></patternFill></fill>' +
/* 4  branco  */ '<fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/></patternFill></fill>' +
/* 5  zebra   */ '<fill><patternFill patternType="solid"><fgColor rgb="FFF4F7EE"/></patternFill></fill>' +
/* 6  footer  */ '<fill><patternFill patternType="solid"><fgColor rgb="FF3A5212"/></patternFill></fill>' +
/* 7  negW    */ '<fill><patternFill patternType="solid"><fgColor rgb="FFFFE0E0"/></patternFill></fill>' +
/* 8  posW    */ '<fill><patternFill patternType="solid"><fgColor rgb="FFF5FBF0"/></patternFill></fill>' +
/* 9  negZ    */ '<fill><patternFill patternType="solid"><fgColor rgb="FFFFC8C8"/></patternFill></fill>' +
/* 10 posZ    */ '<fill><patternFill patternType="solid"><fgColor rgb="FFEDF7E6"/></patternFill></fill>' +
/* 11 sep     */ '<fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/></patternFill></fill>' +
/* 12 titleMid*/ '<fill><patternFill patternType="solid"><fgColor rgb="FF4F6E1A"/></patternFill></fill>' +
/* 13 titleDk */ '<fill><patternFill patternType="solid"><fgColor rgb="FF2E4410"/></patternFill></fill>' +
/* 14 colDef  */ '<fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/></patternFill></fill>' +
'</fills>' +

'<borders count="5">' +
/* 0 none */
'<border><left/><right/><top/><bottom/><diagonal/></border>' +
/* 1 corpo medium — borda escura grafite-oliva */
'<border>' +
  '<left style="medium"><color rgb="FF4A5E3A"/></left>' +
  '<right style="medium"><color rgb="FF4A5E3A"/></right>' +
  '<top style="thin"><color rgb="FF6B7D5A"/></top>' +
  '<bottom style="thin"><color rgb="FF6B7D5A"/></bottom>' +
  '<diagonal/>' +
'</border>' +
/* 2 footer — thick Olive no topo, medium escuro nas laterais */
'<border>' +
  '<left style="medium"><color rgb="FF3A5212"/></left>' +
  '<right style="medium"><color rgb="FF3A5212"/></right>' +
  '<top style="thick"><color rgb="FF4A6218"/></top>' +
  '<bottom style="medium"><color rgb="FF4A6218"/></bottom>' +
  '<diagonal/>' +
'</border>' +
/* 3 título — bottom medium dourado-oliva escuro */
'<border>' +
  '<left/><right/><top/>' +
  '<bottom style="medium"><color rgb="FF6B8E23"/></bottom>' +
  '<diagonal/>' +
'</border>' +
/* 4 obs/ações — lateral escura + dashed bottom Olive */
'<border>' +
  '<left style="medium"><color rgb="FF4A5E3A"/></left>' +
  '<right style="medium"><color rgb="FF4A5E3A"/></right>' +
  '<top style="thin"><color rgb="FF6B7D5A"/></top>' +
  '<bottom style="dashed"><color rgb="FF4A6218"/></bottom>' +
  '<diagonal/>' +
'</border>' +
'</borders>' +

'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFill="0"/></cellStyleXfs>' +

'<cellXfs count="25">' +
/* 0  titleRed  — Olive muito escuro, centro */ '<xf numFmtId="0" fontId="1" fillId="2" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 1  titleGreen — Olive escuro,    centro */ '<xf numFmtId="0" fontId="1" fillId="13" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 2  hdr centro  */ '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
/* 3  hdrLeft     */ '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
/* 4  normal      */ '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 5  normalLeft  */ '<xf numFmtId="0" fontId="5" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>' +
/* 6  zebra       */ '<xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 7  zebraLeft   */ '<xf numFmtId="0" fontId="5" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>' +
/* 8  neg         */ '<xf numFmtId="0" fontId="3" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 9  negZebra    */ '<xf numFmtId="0" fontId="9" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 10 pos         */ '<xf numFmtId="0" fontId="4" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 11 posZebra    */ '<xf numFmtId="0" fontId="4" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 12 sep         */ '<xf numFmtId="0" fontId="7" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 13 total label */ '<xf numFmtId="0" fontId="6" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 14 totalNum    */ '<xf numFmtId="0" fontId="8" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 15 totalNeg    */ '<xf numFmtId="0" fontId="10" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 16 titleBlue   */ '<xf numFmtId="0" fontId="1" fillId="12" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 17 pedOk       */ '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 18 pedOkLeft   */ '<xf numFmtId="0" fontId="5" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>' +
/* 19 pedFalta    */ '<xf numFmtId="0" fontId="3" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 20 pedFaltaLeft*/ '<xf numFmtId="0" fontId="3" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>' +
/* 21 pedMais     */ '<xf numFmtId="0" fontId="4" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
/* 22 pedMaisLeft */ '<xf numFmtId="0" fontId="4" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>' +
/* 23 colDefault  */ '<xf numFmtId="0" fontId="0" fillId="14" borderId="0" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
/* 24 obsAcoes    — campo editável: branco, borda valorizada + dashed bottom */
'<xf numFmtId="0" fontId="5" fillId="4" borderId="4" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1" wrapText="1"/></xf>' +
'</cellXfs>' +
'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
'</styleSheet>';

    const allStrings = [];
    const strIdx = {};
    const getSI = s => { const k = String(s==null?'':s); if (strIdx[k]===undefined){strIdx[k]=allStrings.length;allStrings.push(k);} return strIdx[k]; };

    const sheetsData = abas.map(aba => {
      const rows = aba.rows;
      const cols = aba.widths || [];
      let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<sheetPr><tabColor rgb="FF6B8E23"/></sheetPr>' +
        '<sheetViews><sheetView showGridLines="0" workbookViewId="0">' +
        '<selection activeCell="A1" sqref="A1"/>' +
        '</sheetView></sheetViews>' +
        '<sheetFormatPr defaultColWidth="8" defaultRowHeight="22" customHeight="1" s="0"/>';

      if (cols.length) {
        xml += '<cols>';
        // Colunas de dados: largura customizada + fill branco (s=23)
        cols.forEach((w,i) => { xml += '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1" style="23"/>'; });
        // Todas as colunas restantes: forçar fill branco para eliminar fundo verde
        xml += '<col min="'+(cols.length+1)+'" max="16384" width="8" style="23"/>';
        xml += '</cols>';
      } else {
        // Sem colunas definidas: ainda assim forçar fundo branco em toda a sheet
        xml += '<cols><col min="1" max="16384" width="8" style="23"/></cols>';
      }

      // sheetData PRIMEIRO (ordem exigida pelo schema OOXML do Excel)
      xml += '<sheetData>';
      rows.forEach((row, ri) => {
        // título mais imponente, cabeçalho espaçoso, corpo arejado — estética executiva
        let ht = 22;
        if (ri === 0) ht = 36;        // título — presença máxima
        else if (ri === 1) ht = 28;   // cabeçalho — hierarquia clara
        xml += '<row r="'+(ri+1)+'" ht="'+ht+'" customHeight="1">';
        row.forEach((cell, ci) => {
          const col = ci;
          const toCol = n => { let s=''; n++; while(n>0){s=String.fromCharCode(65+(n-1)%26)+s;n=Math.floor((n-1)/26);} return s; };
          const addr = toCol(col) + (ri+1);
          const sIdx = STYLES[cell.s] !== undefined ? STYLES[cell.s] : 4;
          const val  = cell.v;
          if (val === '' || val == null) {
            xml += '<c r="'+addr+'" s="'+sIdx+'"/>';
          } else if (typeof val === 'number') {
            xml += '<c r="'+addr+'" t="n" s="'+sIdx+'"><v>'+val+'</v></c>';
          } else {
            const si = getSI(val);
            xml += '<c r="'+addr+'" t="s" s="'+sIdx+'"><v>'+si+'</v></c>';
          }
        });
        xml += '</row>';
      });
      // Linhas brancas explícitas após os dados: garante que linhas visíveis vazias
      // não herdem o fill verde do estilo de coluna
      const toColUtil = n => { let s=''; n++; while(n>0){s=String.fromCharCode(65+(n-1)%26)+s;n=Math.floor((n-1)/26);} return s; };
      const lastDataRow = rows.length;
      const numBlankRows = 50;
      for (let br = 1; br <= numBlankRows; br++) {
        const rNum = lastDataRow + br;
        xml += '<row r="'+rNum+'" ht="22" customHeight="1" s="23" customFormat="1">';
        xml += '</row>';
      }
      xml += '</sheetData>';

      // mergeCells DEPOIS de sheetData (ordem do schema)
      if (aba.merges && aba.merges.length) {
        xml += '<mergeCells count="'+aba.merges.length+'">';
        aba.merges.forEach(m => {
          const toCol = n => { let s=''; n++; while(n>0){s=String.fromCharCode(65+(n-1)%26)+s;n=Math.floor((n-1)/26);} return s; };
          xml += '<mergeCell ref="'+toCol(m.s.c)+(m.s.r+1)+':'+toCol(m.e.c)+(m.e.r+1)+'"/>';
        });
        xml += '</mergeCells>';
      }

      xml += '</worksheet>';
      return { nome: aba.nome, xml };
    });

    const sstXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'+allStrings.length+'" uniqueCount="'+allStrings.length+'">' +
      allStrings.map(s => '<si><t xml:space="preserve">'+esc(s)+'</t></si>').join('') + '</sst>';

    const wbXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
      sheetsData.map((s,i) => '<sheet name="'+esc(s.nome)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+3)+'"/>').join('') + '</sheets></workbook>';

    const wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      sheetsData.map((s,i) => '<Relationship Id="rId'+(i+3)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('') +
      '</Relationships>';

    const pkgRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      sheetsData.map((_,i) => '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('') + '</Types>';

    const enc = s => { const b=new TextEncoder().encode(s); return b; };
    const files = [
      { name:'[Content_Types].xml',            data:enc(contentTypes) },
      { name:'_rels/.rels',                     data:enc(pkgRels) },
      { name:'xl/workbook.xml',                 data:enc(wbXml) },
      { name:'xl/_rels/workbook.xml.rels',      data:enc(wbRels) },
      { name:'xl/sharedStrings.xml',            data:enc(sstXml) },
      { name:'xl/styles.xml',                   data:enc(stylesXml) },
      ...sheetsData.map((s,i) => ({ name:'xl/worksheets/sheet'+(i+1)+'.xml', data:enc(s.xml) })),
    ];

    // CRC32
    const crc32 = data => {
      let c=0xFFFFFFFF;
      const t=new Uint32Array(256);
      for(let i=0;i<256;i++){let v=i;for(let j=0;j<8;j++)v=v&1?(0xEDB88320^(v>>>1)):v>>>1;t[i]=v;}
      for(let i=0;i<data.length;i++)c=t[(c^data[i])&0xFF]^(c>>>8);
      return (c^0xFFFFFFFF)>>>0;
    };

    const fileList = files.map(f => {
      const name = new TextEncoder().encode(f.name);
      const crc  = crc32(f.data);
      const lfh  = new Uint8Array(30+name.length);
      const lv   = new DataView(lfh.buffer);
      lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x800,true);
      lv.setUint16(8,0,true); lv.setUint16(10,0,true); lv.setUint16(12,0,true);
      lv.setUint32(14,crc,true); lv.setUint32(18,f.data.length,true); lv.setUint32(22,f.data.length,true);
      lv.setUint16(26,name.length,true); lv.setUint16(28,0,true);
      lfh.set(name,30);
      return { name, data:f.data, lfh, crc, size:f.data.length };
    });

    let offset=0;
    const cds = fileList.map(f => {
      const cd=new Uint8Array(46+f.name.length); const v=new DataView(cd.buffer);
      v.setUint32(0,0x02014b50,true); v.setUint16(4,20,true); v.setUint16(6,20,true);
      v.setUint16(8,0x800,true); v.setUint16(10,0,true); v.setUint16(12,0,true); v.setUint16(14,0,true);
      v.setUint32(16,f.crc,true); v.setUint32(20,f.size,true); v.setUint32(24,f.size,true);
      v.setUint16(28,f.name.length,true); v.setUint16(30,0,true); v.setUint16(32,0,true);
      v.setUint16(34,0,true); v.setUint16(36,0,true);
      v.setUint32(38,0,true); v.setUint32(42,offset,true);
      cd.set(f.name,46);
      offset += 30+f.name.length+f.size;
      return cd;
    });

    const cdSize=cds.reduce((a,c)=>a+c.length,0);
    const eocd=new Uint8Array(22); const ev=new DataView(eocd.buffer);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(4,0,true); ev.setUint16(6,0,true);
    ev.setUint16(8,fileList.length,true); ev.setUint16(10,fileList.length,true);
    ev.setUint32(12,cdSize,true); ev.setUint32(16,offset,true); ev.setUint16(20,0,true);

    const parts=[...fileList.flatMap(f=>[f.lfh,f.data]),...cds,eocd];
    const total=parts.reduce((a,p)=>a+p.length,0);
    const zip=new Uint8Array(total); let pos=0;
    parts.forEach(p=>{zip.set(p,pos);pos+=p.length;});

    const blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=nomeArq; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  }

// ── GERADOR XLSX — MODELO DE REFERÊNCIA (template base64) ────────────────
  // Estratégia: carrega os arquivos modelo como template, substitui apenas os
  // valores dinâmicos via SheetJS (styles ficam 100% intactos do original).

  // ──────────────────────────────────────────────────────────────────────────
  const _MON_FALTAS_TEMPLATE = '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';
  const _MON_TOP3_TEMPLATE   = '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';

  function _b64ToArr(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
  }

  function _monPedGerarXlsxRef(abas, nomeArq) {
    // abas[0].nome determina qual template usar
    const isFaltas = nomeArq.startsWith('faltas_');
    const b64 = isFaltas ? _MON_FALTAS_TEMPLATE : _MON_TOP3_TEMPLATE;
    const buf = _b64ToArr(b64);
    const wb  = XLSX.read(buf, { type:'array', cellStyles:true });
    const ws  = wb.Sheets[wb.SheetNames[0]];

    // Helper: escreve valor em célula preservando estilo existente
    const setCell = (addr, val) => {
      if (!ws[addr]) ws[addr] = {};
      const existing = ws[addr].s; // guarda estilo
      if (typeof val === 'number') {
        ws[addr] = { t:'n', v:val, s:existing };
      } else if (val == null || val === '') {
        ws[addr] = { t:'z', s:existing };
      } else {
        ws[addr] = { t:'s', v:String(val), s:existing };
      }
    };

    const aba = abas[0];
    const rows = aba.rows;

    if (isFaltas) {

      // ── Relatório de Faltas ──────────────────────────────────────────────
      // Estrutura do modelo:
      //   D2:I2 = título (merge)
      //   D4=Chave: E4=Site: F4=Solicitado: G4=Escalado: H4=Apontamentos: I4=Entregues:
      //   D5:I5 = 1a linha de dados
      //   D6:I6 = 2a linha de dados  (modelo tem 2 dados)
      //   D7:I7 = Total (com fórmula SUM)
      //
      // Temos faltasCron.length linhas; precisamos inserir/remover linhas do modelo.
      // Abordagem: reescrevemos célula a célula usando a 1a linha de dados como template de estilo.

      // Atualiza título
      const dtTitulo = aba.dataTitulo || '';
      setCell('D2', ' Relatório de Faltas – ' + dtTitulo);

      // Linhas de dados: o modelo tem 2 (rows 5 e 6).
      // Nossas linhas de dados ficam em aba.rows (já montadas pelo chamador):
      //   rows[0] = [null, chave0, site0, solic0, esc0, ent0, diff0, null]  (col D=idx1 .. I=idx6)
      // Mapeamento: col D=idx1, E=idx2, F=idx3, G=idx4, H=idx5, I=idx6
      // Colunas Excel: D, E, F, G, H, I
      const colLetters = ['D','E','F','G','H','I'];

      const dataRows = rows.filter(r => r && r._type === 'data');
      const nData = dataRows.length;

      // Garante que ws tem linhas suficientes copiando o estilo da row 5
      // para as linhas extras (6, 7, ... antes do total)
      // O modelo tem dados nas rows 5 e 6, total na row 7.
      // Se nData > 2, precisamos inserir rows. Se nData < 2, deixamos vazias.

      // Total row no modelo = row 7 (para 2 dados). Para nData dados, total = row (5 + nData).
      const totalExcelRow = 5 + nData;

      // Preenche dados
      for (let i = 0; i < nData; i++) {
        const excelRow = 5 + i;
        const r = dataRows[i];
        // Copia estilo da row modelo (row 5 ou 6 dependendo do zebra)
        const modelRow = (i % 2 === 0) ? 5 : 6;
        colLetters.forEach((col, ci) => {
          const modelAddr = col + modelRow;
          const targetAddr = col + excelRow;
          // Clona estilo do modelo
          if (ws[modelAddr]) {
            ws[targetAddr] = ws[targetAddr] || {};
            ws[targetAddr].s = ws[modelAddr].s;
          }
        });
        // r = [margemC, chave, site, solic, esc, ent, diff, margemJ]
        setCell('D'+excelRow, r[1]); // chave
        setCell('E'+excelRow, r[2]); // site
        setCell('F'+excelRow, r[3]); // solicitado
        setCell('G'+excelRow, r[4]); // escalado
        setCell('H'+excelRow, r[5]); // entregue
        setCell('I'+excelRow, r[6]); // diff
      }

      // Move total para a row correta
      const modelTotalRow = 7;
      if (totalExcelRow !== modelTotalRow) {
        // Copia estilo e fórmulas do total para nova posição
        colLetters.forEach(col => {
          const src = col + modelTotalRow;
          const dst = col + totalExcelRow;
          if (ws[src]) {
            ws[dst] = ws[dst] || {};
            ws[dst].s = ws[src].s;
            ws[dst].t = ws[src].t;
            ws[dst].v = ws[src].v;
            ws[dst].f = ws[src].f;
          }
        });
        // Atualiza fórmulas do total para o range correto
        const dataStart = 5;
        const dataEnd = totalExcelRow - 1;
        setCell('D'+totalExcelRow, 'Total:');
        ['F','G','H','I'].forEach(col => {
          const addr = col + totalExcelRow;
          if (ws[addr]) {
            ws[addr].t = 'n';
            ws[addr].f = 'SUM('+col+dataStart+':'+col+dataEnd+')';
            ws[addr].v = undefined;
          }
        });
        // Apaga linhas do modelo que ficaram abaixo (limpa rows antigas)
        for (let r = totalExcelRow + 1; r <= 20; r++) {
          colLetters.forEach(col => { delete ws[col+r]; });
        }
      } else {
        // Atualiza fórmulas mesmo no modelo (para o range correto)
        ['F','G','H','I'].forEach(col => {
          const addr = col + modelTotalRow;
          if (ws[addr]) {
            ws[addr].f = 'SUM('+col+'5:'+col+(totalExcelRow-1)+')';
          }
        });
      }

      // Atualiza ref do ws
      ws['!ref'] = 'A1:J' + (totalExcelRow + 2);

    } else {

      // ── TOP 3 ────────────────────────────────────────────────────────────
      // Estrutura do modelo TOP_3.xlsx:
      //   Rows 1–4: fundo escuro (margem/header)
      //   Row 5: "NO SHOW" merge B5:H5
      //   Row 6: cabeçalho (CHAVE|CHAVE|SOLICITADO|ENTREGUE|NO SHOW|OBSERVAÇÕES|AÇÕES)
      //   Row 7: 1º dado NO SHOW (zebra)
      //   Row 8: 2º dado NO SHOW (branco)
      //   Row 9: "SEM FALTAS" merge B9:H9 (usado quando não há dados)
      //   Row 10: fundo escuro (separador)
      //   Row 11: "A MAIS" merge B11:H11
      //   Row 12: cabeçalho A MAIS
      //   Row 13: 1º dado A MAIS (zebra)
      //   Row 14: 2º dado A MAIS (branco)
      //   Row 15: 3º dado A MAIS (zebra)
      //   Rows 16+: fundo escuro (margem inferior)
      //
      // Colunas: A=margem, B=Chave, C=Site, D=Solic, E=Entregue, F=NoShow/AMais,
      //          G=Observações, H=Ações, I=margem

      const noShowRows = rows.filter(r => r && r._type === 'noshow');
      const aMaisRows  = rows.filter(r => r && r._type === 'amais');

      const colsData = ['B','C','D','E','F','G','H'];

      // ── Bloco NO SHOW ──────────────────────────────────────────────────
      if (noShowRows.length === 0) {
        // Mantém "SEM FALTAS" no merge B9:H9 — mas precisa estar na row logo após cabeçalho
        // Row 7 = "SEM FALTAS" (usando estilo de B9 do modelo)
        // Limpa rows 7 e 8 de dados
        colsData.forEach(col => {
          if (ws['A9'] && ws[col+'9']) {
            ws[col+'7'] = ws[col+'7'] || {};
            ws[col+'7'].s = ws[col+'9'].s;
          }
          delete ws[col+'8'];
        });
        // Copia o merge "SEM FALTAS" para row 7
        if (ws['B9']) { ws['B7'] = { ...ws['B9'], v:'SEM FALTAS' }; }
        // Remove merge original de B9 e adiciona em B7
        ws['!merges'] = (ws['!merges'] || []).filter(m => !(m.s.r===8 && m.s.c===1));
        ws['!merges'].push({s:{r:6,c:1},e:{r:6,c:7}});
      } else {
        // Preenche dados no show (model rows 7 e 8, depois continua)
        // Remove merge "SEM FALTAS"
        ws['!merges'] = (ws['!merges'] || []).filter(m => !(m.s.r===8 && m.s.c===1));
        for (let i = 0; i < Math.min(noShowRows.length, 3); i++) {
          const excelRow = 7 + i;
          const modelRow = (i % 2 === 0) ? 7 : 8;
          const r = noShowRows[i];
          colsData.forEach((col, ci) => {
            if (ws[col+modelRow]) {
              ws[col+excelRow] = ws[col+excelRow] || {};
              ws[col+excelRow].s = ws[col+modelRow].s;
            }
          });
          // r = [margemA, chave, site, solic, ent, diff, obs, acoes, margemI]
          setCell('B'+excelRow, r[1]);
          setCell('C'+excelRow, r[2]);
          setCell('D'+excelRow, r[3]);
          setCell('E'+excelRow, r[4]);
          setCell('F'+excelRow, r[5]); // diff (negativo)
          setCell('G'+excelRow, r[6]); // obs
          setCell('H'+excelRow, r[7]); // ações
        }
      }

      // ── Bloco A MAIS ───────────────────────────────────────────────────
      // No modelo, A MAIS começa na row 13 (após rows 10=sep, 11=titulo, 12=hdr)
      for (let i = 0; i < Math.min(aMaisRows.length, 3); i++) {
        const excelRow = 13 + i;
        const modelRow = (i % 2 === 0) ? 13 : 14;
        const r = aMaisRows[i];
        colsData.forEach(col => {
          if (ws[col+modelRow]) {
            ws[col+excelRow] = ws[col+excelRow] || {};
            ws[col+excelRow].s = ws[col+modelRow].s;
          }
        });
        setCell('B'+excelRow, r[1]);
        setCell('C'+excelRow, r[2]);
        setCell('D'+excelRow, r[3]);
        setCell('E'+excelRow, r[4]);
        setCell('F'+excelRow, r[5]); // +diff
        setCell('G'+excelRow, r[6]); // obs
        setCell('H'+excelRow, r[7]); // ações
      }
    }

    // Download
    const out  = XLSX.write(wb, { bookType:'xlsx', type:'array', cellStyles:true });
    const blob = new Blob([out], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = nomeArq; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

    // ── FIM MÓDULO RELATÓRIO DE PEDIDOS ──────────────────────────────────────

  // Presets de horário para aba escala
  window._relEscalaPresset = function(tipo) {
    const now = new Date();
    const pad2 = n => String(n).padStart(2,'0');
    const todayStr = now.getFullYear() + '-' + pad2(now.getMonth()+1) + '-' + pad2(now.getDate());
    const tomorrowDate = new Date(now); tomorrowDate.setDate(tomorrowDate.getDate()+1);
    const tomorrowStr = tomorrowDate.getFullYear() + '-' + pad2(tomorrowDate.getMonth()+1) + '-' + pad2(tomorrowDate.getDate());
    const iniEl = document.getElementById('rel-esc-data-ini');
    const fimEl = document.getElementById('rel-esc-data-fim');
    const hIniEl = document.getElementById('rel-esc-hora-ini');
    const hFimEl = document.getElementById('rel-esc-hora-fim');
    if (!iniEl||!fimEl||!hIniEl||!hFimEl) return;
    if (tipo==='hoje')  { iniEl.value=todayStr; fimEl.value=todayStr; hIniEl.value='00:00'; hFimEl.value='23:59'; }
    if (tipo==='t1')    { iniEl.value=todayStr; fimEl.value=todayStr; hIniEl.value='06:00'; hFimEl.value='14:00'; }
    if (tipo==='t2')    { iniEl.value=todayStr; fimEl.value=todayStr; hIniEl.value='13:40'; hFimEl.value='21:40'; }
    if (tipo==='t3')    { iniEl.value=todayStr; fimEl.value=tomorrowStr; hIniEl.value='21:40'; hFimEl.value='06:00'; }
  };

  window._relEscalaGerar = function() {
    const dataIniEl  = document.getElementById('rel-esc-data-ini');
    const dataFimEl  = document.getElementById('rel-esc-data-fim');
    const horaIniEl  = document.getElementById('rel-esc-hora-ini');
    const horaFimEl  = document.getElementById('rel-esc-hora-fim');
    if (!dataIniEl) return;

    const dataIni = dataIniEl.value;  // YYYY-MM-DD
    const dataFim = dataFimEl ? dataFimEl.value : dataIni;
    const horaIni = horaIniEl ? horaIniEl.value : '00:00';
    const horaFim = horaFimEl ? horaFimEl.value : '23:59';

    // Mostra loading enquanto busca pág 2
    const lista = document.getElementById('rel-esc-lista');
    const preview = document.getElementById('rel-esc-preview');
    const btnCopiar = document.getElementById('rel-esc-btn-copiar');
    if (lista) lista.innerHTML = '<span style="color:var(--mon-text-faint,#888)">⏳ Buscando operações (pág. 1 + 2)…</span>';
    if (preview) preview.textContent = '';
    if (btnCopiar) { btnCopiar.disabled = true; btnCopiar.style.opacity = '0.4'; }

    // Helper: filtra ops do período pelo horário (mesma lógica usada em _relEscalaProcessar)
    const toMin = hhmm => { if (!hhmm) return 0; const [h,m] = hhmm.split(':').map(Number); return h*60+(m||0); };
    const opNoPeriodo = (op) => {
      if (!op.hora) return false;
      const opMin  = toMin(op.hora);
      const iniMin = toMin(horaIni);
      const fimMin = toMin(horaFim);
      return iniMin <= fimMin
        ? (opMin >= iniMin && opMin <= fimMin)
        : (opMin >= iniMin || opMin <= fimMin);
    };

    // Sempre busca pág 1 (document atual) + pág 2, independente da seleção do painel
    const opsPag1 = (typeof parseOpsFromDoc !== 'undefined') ? parseOpsFromDoc(document) : ((typeof operations !== 'undefined') ? operations : []);
    fetchDoc('https://tsi-app.com/planejamento-operacional_2')
      .then(doc2 => (typeof parseOpsFromDoc !== 'undefined') ? parseOpsFromDoc(doc2) : [])
      .catch(() => [])
      .then(opsPag2 => {
        const ops = [...opsPag1, ...opsPag2];

        // ── ANALISA ESCALA DAS OPS DO PERÍODO ANTES DE GERAR O RELATÓRIO ─────
        // Sem isso, ops sem cache (ou em 'loading') eram marcadas como pendentes
        // sem nunca terem sido consultadas de verdade.
        const candidatas = ops.filter(opNoPeriodo);

        if (candidatas.length === 0) {
          // Nenhuma op no período — segue direto pro processar (vai exibir "sem pendências")
          _relEscalaProcessar(ops, dataIni, dataFim, horaIni, horaFim);
          return;
        }

        // Identifica quais candidatas precisam de fetch (cache vazio, loading, ou _soEscala)
        const precisaFetch = candidatas.filter(op => {
          const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
          return !d || d === 'loading';
        });

        if (lista) lista.innerHTML = `<span style="color:var(--mon-text-faint,#888)">🔍 Analisando escala de ${candidatas.length} operação(ões) do período… (${precisaFetch.length} sem cache)</span>`;

        if (precisaFetch.length === 0) {
          // Tudo já em cache, segue direto
          _relEscalaProcessar(ops, dataIni, dataFim, horaIni, horaFim);
          return;
        }

        // Busca em paralelo os dados reais de cada candidata sem cache
        if (typeof fetchApontamentos !== 'function') {
          // fallback: sem função disponível, processa com o que tem
          _relEscalaProcessar(ops, dataIni, dataFim, horaIni, horaFim);
          return;
        }

        let restantes = precisaFetch.length;
        let concluidas = 0;
        const atualizaLoading = () => {
          if (lista) lista.innerHTML = `<span style="color:var(--mon-text-faint,#888)">🔍 Analisando escala… (${concluidas}/${precisaFetch.length})</span>`;
        };
        atualizaLoading();

        // Timeout de segurança — não trava se alguma requisição pendurar
        let finalizou = false;
        const finalizar = () => {
          if (finalizou) return;
          finalizou = true;
          _relEscalaProcessar(ops, dataIni, dataFim, horaIni, horaFim);
        };
        const safetyTimer = setTimeout(finalizar, 30000); // 30s máx

        precisaFetch.forEach(op => {
          try {
            fetchApontamentos(op, () => {
              concluidas++;
              atualizaLoading();
              restantes--;
              if (restantes <= 0) {
                clearTimeout(safetyTimer);
                finalizar();
              }
            });
          } catch (e) {
            restantes--;
            if (restantes <= 0) {
              clearTimeout(safetyTimer);
              finalizar();
            }
          }
        });
      });
  };

  window._relEscalaProcessar = function(ops, dataIni, dataFim, horaIni, horaFim) {
    const toMin = hhmm => { if (!hhmm) return 0; const [h,m] = hhmm.split(':').map(Number); return h*60+(m||0); };
    const toDateMin = (dateStr, hhmm) => { const d = new Date(dateStr + 'T00:00:00'); return d.getTime() + toMin(hhmm)*60000; };

    const tsIni = toDateMin(dataIni, horaIni);
    const tsEnd = toDateMin(dataFim, horaFim);

    // Filtra operações cujo horário cai no range
    // Como op.data não é extraída da tabela, comparamos só pelos minutos do dia
    const pendentes = ops.filter(op => {
      if (!op.hora) return false;
      const opMin  = toMin(op.hora);
      const iniMin = toMin(horaIni);
      const fimMin = toMin(horaFim);
      // turno normal (ex: 06:00–14:00) ou vira-madrugada (ex: 21:40–06:00)
      const inRange = iniMin <= fimMin
        ? (opMin >= iniMin && opMin <= fimMin)          // mesmo dia
        : (opMin >= iniMin || opMin <= fimMin);          // vira meia-noite
      if (!inRange) return false;

      // Verifica escala pendente — usa dados reais do cache (já buscados por _relEscalaGerar)
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      // Sem dados ainda (loading/null) → marca como pendente com indicador de "sem dados"
      // (acontece se fetch falhou ou timeout estourou)
      if (!d || d === 'loading') return true;
      const escalado = d.escalado || 0;
      const solicitado = d.solicitado || op.qtd || 0;
      // escala ok somente se escalado >= solicitado E solicitado > 0
      const escOk = solicitado > 0 && escalado >= solicitado;
      return !escOk;
    });

    const lista = document.getElementById('rel-esc-lista');
    const preview = document.getElementById('rel-esc-preview');
    const btnCopiar = document.getElementById('rel-esc-btn-copiar');
    const fmtPeriodo = `${dataIni.split('-').reverse().join('/')} ${horaIni} → ${dataFim.split('-').reverse().join('/')} ${horaFim}`;

    if (pendentes.length === 0) {
      if (lista) lista.innerHTML = '<span style="color:var(--mon-green,#16a34a);font-style:normal;font-weight:700">✅ Nenhuma pendência de escala nesse período.</span>';
      const txt = `✅ Sem pendências de escala para o período ${fmtPeriodo}.`;
      if (preview) preview.textContent = txt;
      if (btnCopiar) { btnCopiar.disabled=false; btnCopiar.style.opacity='1'; btnCopiar.style.cursor='pointer'; btnCopiar.style.color='var(--mon-green,#16a34a)'; btnCopiar.style.borderColor='var(--mon-green,#16a34a)'; }
      window._relEscalaTexto = txt;
      return;
    }

    const linhas = pendentes.map(op => {
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      const escalado = (d && d !== 'loading') ? (d.escalado || 0) : 0;
      const solicitado = (d && d !== 'loading') ? (d.solicitado || op.qtd || 0) : (op.qtd || 0);
      const wppIds = op.wppLideres || [];
      const wppStr = wppIds.length > 0 ? ' @' + wppIds.join(' @') : '';
      const status = escalado === 0 ? '– Sem escala' : `– Escala incompleta (${escalado}/${solicitado})`;
      return `*${op.chave}* ${op.hora || ''} ${status}${wppStr}`;
    });

    let txt = `🚨🚨 *ESCALAS PENDENTES - ATENÇÃO* 🚨🚨\n\n📅 ${fmtPeriodo}\n\n`;
    txt += linhas.join('\n');
    txt += '\n\n—\n⚠️ *Atenção:* Em caso de qualquer dificuldade ou imprevisto, avisar o quanto antes para repasse ao cliente.';
    window._relEscalaTexto = txt;

    if (lista) lista.innerHTML = pendentes.map(op => {
      const d = (typeof apontCache !== 'undefined') ? apontCache[op.id] : null;
      const esc = (d && d !== 'loading') ? (d.escalado || 0) : 0;
      const sol = (d && d !== 'loading') ? (d.solicitado || op.qtd || 0) : (op.qtd || 0);
      const cor = esc === 0 ? 'var(--mon-red,#dc2626)' : 'var(--mon-amber,#d97706)';
      const label = esc === 0 ? 'Sem escala' : `Incompleta ${esc}/${sol}`;
      return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--mon-border,#e0e0e0)">
        <span style="color:${cor};font-size:14px">●</span>
        <span style="font-weight:700;font-size:13px;color:var(--mon-text,#1a1a2e)">${op.chave}</span>
        <span style="font-size:12px;font-family:var(--mon-mono,monospace);color:var(--mon-text-faint,#888)">${op.hora||''}</span>
        <span style="font-size:12px;color:${cor};font-weight:600">${label}</span>
      </div>`;
    }).join('');

    if (preview) preview.innerHTML = txt
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>');
    if (btnCopiar) { btnCopiar.disabled=false; btnCopiar.style.opacity='1'; btnCopiar.style.cursor='pointer'; btnCopiar.style.color='var(--mon-text,#1a1a2e)'; btnCopiar.style.borderColor='var(--mon-border,#e0e0e0)'; }
  };

  window._relEscalaCopiar = function() {
    const txt = window._relEscalaTexto;
    if (!txt) return;
    navigator.clipboard.writeText(txt).catch(() => prompt('Copie:', txt));
    const btn = document.getElementById('rel-esc-btn-copiar');
    if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copiado!'; setTimeout(() => btn.textContent = orig, 1500); }
  };

  window._relCopiarAtivo = function() {
    // Se ainda não gerou, gera agora automaticamente
    if (!_relTxtPlan) window._relGerar();
    const txt = _relTabAtiva === 'rep' ? _relTxtRep : _relTxtPlan;
    if (!txt) return;
    navigator.clipboard.writeText(txt).catch(() => prompt('Copie:', txt));
    const btn = document.getElementById('rel-turno-btn-copiar');
    if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copiado!'; setTimeout(() => btn.textContent = orig, 1500); }
  };

  // ── FIM RELATÓRIOS COMBINADOS ─────────────────────────────────────────────

  // ── RELATÓRIO DE TURNO ───────────────────────────────────────────────────

  function _relTurnoAtual() {
    const h = new Date().getHours(), m = new Date().getMinutes();
    const total = h * 60 + m;
    if (total >= 6*60 && total < 13*60+40) return 1;
    if (total >= 13*60+40 && total < 21*60+40) return 2;
    return 3;
  }

  function _relFmtData(d) {
    return String(d.getDate()).padStart(2,'0') + '/' +
           String(d.getMonth()+1).padStart(2,'0') + '/' +
           d.getFullYear();
  }

  function _relDataTurno(t) {
    const h = new Date();
    if (t === 3) {
      const o = new Date(h); o.setDate(o.getDate()-1);
      return _relFmtData(o) + ' - ' + _relFmtData(h);
    }
    return _relFmtData(h);
  }

  window._relColetarFaltas = function _relColetarFaltas() {
    // Lê exclusivamente do painel de faltas (Supabase via _faltasCache)
    // Ordena cronologicamente (mesma lógica do modal de Faltas) para
    // preservar a ordem do turno ao importar no relatório.
    const registros = Object.values(_faltasCache || {}).filter(r => r && r.chave && r.faltas > 0);
    return _sortLista(registros).map(r => ({ chave: r.chave, qtd: r.faltas, obs: '' }));
  }

  window._monAbrirRelTurno = function() {
    // Redireciona para o modal combinado, aba turno
    if (window._monAbrirRelatorios) return window._monAbrirRelatorios('turno');
  };

  function _relPad2(n) { return String(n).padStart(2,'0'); }

  function _relModalHTML(turno, data, faltas) {
    const faltasHTML = '';  // renderizado via JS após append

    return `<div onclick="event.stopPropagation()" style="background:var(--mon-surface,#fff);border-radius:16px;width:1080px;max-width:98vw;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 12px 48px rgba(0,0,0,0.28);font-family:inherit">

      <!-- Header -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:26px 34px 20px;border-bottom:1px solid var(--mon-border,#e0e0e0);flex-shrink:0">
        <div>
          <div style="font-size:22px;font-weight:800;color:var(--mon-text,#1a1a2e);letter-spacing:-0.01em">📝 Relatório de Turno</div>
          <div style="display:flex;gap:10px;margin-top:12px;align-items:center;flex-wrap:wrap">
            ${[1,2,3].map(t => `<button onclick="window._relSetTurno(${t})" id="rel-tbtn-${t}"
              style="padding:8px 20px;border-radius:8px;border:1.5px solid ${t===turno?'var(--mon-green,#16a34a)':'var(--mon-border,#e0e0e0)'};background:${t===turno?'var(--mon-green,#16a34a)':'none'};color:${t===turno?'#fff':'var(--mon-text-faint,#888)'};font-size:14px;font-weight:700;cursor:pointer;transition:all .15s">T${t}</button>`).join('')}
            <span style="font-size:14px;color:var(--mon-text-faint,#888);margin-left:4px" id="rel-turno-info">${['','06:00–14:00','13:40–21:40','21:40–06:00'][turno]}</span>
            <span style="font-size:14px;color:var(--mon-text-faint,#888)">· ${data}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button onclick="window._relRecarregarFaltas()" title="Recarregar faltas do monitor"
            style="padding:8px 14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);font-size:13px;cursor:pointer;transition:all .15s"
            onmouseover="this.style.borderColor='var(--mon-green,#16a34a)';this.style.color='var(--mon-green,#16a34a)'"
            onmouseout="this.style.borderColor='var(--mon-border,#e0e0e0)';this.style.color='var(--mon-text-faint,#888)'">
            🔄 Recarregar faltas
          </button>
          <button onclick="document.getElementById('mon-rel-modal').remove()" style="background:none;border:none;cursor:pointer;font-size:26px;color:var(--mon-text-faint,#aaa);line-height:1;padding:0 4px">✕</button>
        </div>
      </div>

      <!-- Body -->
      <div style="overflow-y:auto;padding:28px 34px;flex:1;display:flex;gap:32px">

        <!-- Coluna esquerda: inputs -->
        <div style="flex:1;min-width:0">

          <!-- Faltas -->
          <div style="margin-bottom:28px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <span style="font-size:16px;font-weight:800;color:var(--mon-red,#dc2626);display:inline-flex;align-items:center;gap:10px">📋 Faltas <span id="rel-total-f" style="font-size:13px;font-weight:700;background:rgba(220,38,38,0.1);padding:3px 12px;border-radius:12px">00</span></span>
              <button onclick="window._relAddFalta()" style="font-size:13px;padding:7px 16px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);cursor:pointer;font-weight:600;transition:all .15s"
                onmouseover="this.style.borderColor='var(--mon-red,#dc2626)';this.style.color='var(--mon-red,#dc2626)'"
                onmouseout="this.style.borderColor='var(--mon-border,#e0e0e0)';this.style.color='var(--mon-text-faint,#888)'">+ Adicionar</button>
            </div>
            <div id="rel-lista-f" data-tipo="f">${faltasHTML}</div>
          </div>

          <!-- Não entregue -->
          <div style="margin-bottom:28px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <span style="font-size:16px;font-weight:800;color:var(--mon-amber,#d97706);display:inline-flex;align-items:center;gap:10px">❌ Não entregue <span id="rel-total-ne" style="font-size:13px;font-weight:700;background:rgba(217,119,6,0.1);padding:3px 12px;border-radius:12px">00</span></span>
              <button onclick="window._relAddNE()" style="font-size:13px;padding:7px 16px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);cursor:pointer;font-weight:600;transition:all .15s"
                onmouseover="this.style.borderColor='var(--mon-amber,#d97706)';this.style.color='var(--mon-amber,#d97706)'"
                onmouseout="this.style.borderColor='var(--mon-border,#e0e0e0)';this.style.color='var(--mon-text-faint,#888)'">+ Adicionar</button>
            </div>
            <div id="rel-lista-ne" data-tipo="ne"></div>
          </div>

          <!-- Pontos de atenção -->
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <span style="font-size:16px;font-weight:800;color:var(--mon-blue,#2563eb);display:inline-flex;align-items:center;gap:10px">⚠️ Pontos de atenção</span>
              <button onclick="window._relAddPonto()" style="font-size:13px;padding:7px 16px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:8px;background:none;color:var(--mon-text-faint,#888);cursor:pointer;font-weight:600;transition:all .15s"
                onmouseover="this.style.borderColor='var(--mon-blue,#2563eb)';this.style.color='var(--mon-blue,#2563eb)'"
                onmouseout="this.style.borderColor='var(--mon-border,#e0e0e0)';this.style.color='var(--mon-text-faint,#888)'">+ Adicionar</button>
            </div>
            <div id="rel-lista-p" data-tipo="p"></div>
          </div>
        </div>

        <!-- Coluna direita: preview -->
        <div style="width:360px;flex-shrink:0">
          <div style="font-size:12px;font-weight:800;color:var(--mon-text-faint,#888);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Prévia</div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <button id="rel-tab-plan" onclick="window._relVerTab('plan')"
              style="flex:1;padding:10px;border-radius:8px;border:1.5px solid var(--mon-green,#16a34a);background:rgba(22,163,74,0.1);font-size:13px;font-weight:700;color:var(--mon-green,#16a34a);cursor:pointer">💚 Planejamento</button>
            <button id="rel-tab-rep" onclick="window._relVerTab('rep')"
              style="flex:1;padding:10px;border-radius:8px;border:1.5px solid var(--mon-border,#e0e0e0);background:none;font-size:13px;font-weight:700;color:var(--mon-text-faint,#888);cursor:pointer">⚠️ Report</button>
          </div>
          <div style="background:var(--mon-wa-bg,#ECE5DD);border-radius:12px;padding:14px;max-height:520px;overflow-y:auto">
            <div style="display:flex;justify-content:flex-end">
              <div style="max-width:98%;background:var(--mon-wa-bubble,#DCF8C6);border-radius:8px 0 8px 8px;padding:12px 14px 10px;box-shadow:0 1px 2px rgba(0,0,0,.15)">
                <div id="rel-preview" style="white-space:pre-wrap;font-size:14px;line-height:1.65;color:var(--mon-wa-text,#1a1a2e);word-break:break-word"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="display:flex;gap:12px;padding:20px 34px;border-top:1px solid var(--mon-border,#e0e0e0);flex-shrink:0">
        <button onclick="window._relGerar()" style="flex:1;padding:14px;border:none;border-radius:9px;background:var(--mon-green,#16a34a);color:#fff;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:.01em;transition:filter .15s"
          onmouseover="this.style.filter='brightness(1.08)'" onmouseout="this.style.filter='none'">⚡ Gerar</button>
        <button onclick="window._relCopiar('plan')" id="rel-btn-copiar-plan" disabled style="flex:1;padding:14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:9px;background:none;color:var(--mon-text-faint,#888);font-size:14px;font-weight:600;cursor:not-allowed;opacity:0.5">Copiar planejamento</button>
        <button onclick="window._relCopiar('rep')" id="rel-btn-copiar-rep" disabled style="flex:1;padding:14px;border:1.5px solid var(--mon-border,#e0e0e0);border-radius:9px;background:none;color:var(--mon-text-faint,#888);font-size:14px;font-weight:600;cursor:not-allowed;opacity:0.5">Copiar report</button>
      </div>
    </div>`;
  }

  // ── ESTADO DO RELATÓRIO DE TURNO ────────────────────────────────────────────
  // Fonte única de verdade — evita dessincronização entre variáveis locais e window.*
  const _rel = {
    faltas:   [],   // [{chave, qtd, obs}]
    ne:       [],   // [{chave, obs}]
    pontos:   [],   // [{chave, obs}]
    turno:    1,
    txtPlan:  '',
    txtRep:   '',
    tabAtiva: 'plan'
  };

  // ── PERSISTÊNCIA ─────────────────────────────────────────────────────────────
  const _REL_STORAGE_KEY = '_monRelTurnoRascunho';

  window._relSalvarRascunho = function() {
    try {
      localStorage.setItem(_REL_STORAGE_KEY, JSON.stringify({
        faltas: _rel.faltas, ne: _rel.ne, pontos: _rel.pontos,
        turno: _rel.turno, ts: Date.now()
      }));
    } catch(e) {}
  };

  window._relCarregarRascunho = function() {
    try { const r = localStorage.getItem(_REL_STORAGE_KEY); return r ? JSON.parse(r) : null; }
    catch(e) { return null; }
  };

  window._relLimparRascunho = function() {
    if (!confirm('Limpar o relat\u00f3rio de turno? Os dados ser\u00e3o apagados permanentemente.')) return;
    try { localStorage.removeItem(_REL_STORAGE_KEY); } catch(e) {}
    _rel.faltas = []; _rel.ne = []; _rel.pontos = [];
    _rel.txtPlan = ''; _rel.txtRep = '';
    _relReRender('f'); _relReRender('ne'); _relReRender('p');
    const prev = document.getElementById('rel-preview');
    if (prev) prev.textContent = '\u2014';
    const btn = document.getElementById('rel-turno-btn-copiar');
    if (btn) btn.disabled = true;
  };

  window._relRecarregarFaltas = function() {
    const btn = document.querySelector('[onclick="window._relRecarregarFaltas()"]');
    if (btn) { btn.textContent = '\u23f3 Carregando...'; btn.disabled = true; }
    _faltasLoad(() => {
      _rel.faltas = _relColetarFaltas ? _relColetarFaltas() : [];
      _relReRender('f');
      if (btn) { btn.textContent = '\ud83d\udd04 Recarregar faltas'; btn.disabled = false; }
    });
  };

  window._relSetTurno = function(t) {
    _rel.turno = t; _relTurnoSel = t;
    [1,2,3].forEach(i => {
      const b = document.getElementById('rel-tbtn-'+i);
      if (!b) return;
      b.style.background  = i===t ? 'var(--mon-green,#16a34a)' : 'none';
      b.style.color       = i===t ? '#fff' : 'var(--mon-text-faint,#888)';
      b.style.borderColor = i===t ? 'var(--mon-green,#16a34a)' : 'var(--mon-border,#e0e0e0)';
    });
    const info = document.getElementById('rel-turno-info');
    if (info) info.textContent = ['','06:00\u201314:00','13:40\u201321:40','21:40\u201306:00'][t];
    setTimeout(window._relSalvarRascunho, 200);
  };

  window._relAdjQtd = function(idx, delta) {
    const f = _rel.faltas[idx]; if (!f) return;
    f.qtd = Math.max(1, (f.qtd||1) + delta);
    const el = document.getElementById('relqtd-f-'+idx);
    if (el) el.textContent = _relPad2(f.qtd);
    _relAtualizarTotalF();
    setTimeout(window._relSalvarRascunho, 200);
  };

  // L\u00ea inputs do DOM e sincroniza com o array
  function _relSnap(tipo) {
    if (tipo === 'f') {
      _rel.faltas.forEach((f, i) => {
        f.chave = (document.getElementById('relch-f-'+i)?.value  ?? f.chave ?? '').trim();
        f.obs   = (document.getElementById('relobs-f-'+i)?.value ?? f.obs   ?? '').trim();
      });
    } else if (tipo === 'ne') {
      _rel.ne.forEach((n, i) => {
        n.chave = (document.getElementById('relch-ne-'+i)?.value  ?? n.chave ?? '').trim();
        n.obs   = (document.getElementById('relobs-ne-'+i)?.value ?? n.obs   ?? '').trim();
      });
    } else if (tipo === 'p') {
      _rel.pontos.forEach((p, i) => {
        p.chave = (document.getElementById('relch-p-'+i)?.value  ?? p.chave ?? '').trim();
        p.obs   = (document.getElementById('relobs-p-'+i)?.value ?? p.obs   ?? '').trim();
      });
    }
  }

  function _relAtualizarTotalF() {
    const el = document.getElementById('rel-total-f');
    if (el) el.textContent = _relPad2(_rel.faltas.reduce((a,f)=>a+(f.qtd||1),0));
  }
  function _relAtualizarTotalNE() {
    const el = document.getElementById('rel-total-ne');
    if (el) el.textContent = _relPad2(_rel.ne.length);
  }

  // Re-renderiza uma lista inteira
  function _relReRender(tipo) {
    if (tipo === 'f') {
      const lista = document.getElementById('rel-lista-f'); if (!lista) return;
      lista.innerHTML = '';
      _rel.faltas.forEach((f, i) => lista.appendChild(_relMkCardFalta(i, f)));
      _relAtualizarTotalF();
    } else if (tipo === 'ne') {
      const lista = document.getElementById('rel-lista-ne'); if (!lista) return;
      lista.innerHTML = '';
      _rel.ne.forEach((n, i) => lista.appendChild(_relMkCardNE(i, n)));
      _relAtualizarTotalNE();
    } else if (tipo === 'p') {
      const lista = document.getElementById('rel-lista-p'); if (!lista) return;
      lista.innerHTML = '';
      _rel.pontos.forEach((p, i) => lista.appendChild(_relMkCardPonto(i, p)));
    }
    setTimeout(window._relSalvarRascunho, 150);
  }

  // ── CONSTRU\u00c7\u00c3O DOS CARDS ──────────────────────────────────────────────────────
  function _relMkCardFalta(idx, f) {
    const div = document.createElement('div');
    div.id = 'relcard-f-'+idx;
    div.dataset.tipo = 'f'; div.dataset.idx = String(idx);
    div.style.cssText = 'display:flex;align-items:stretch;gap:10px;background:var(--mon-surface2,#f5f5f5);border-left:4px solid var(--mon-red,#dc2626);border-radius:10px;padding:12px 14px;margin-bottom:8px;transition:opacity .15s,box-shadow .15s';
    const chVal  = (f.chave||'').replace(/"/g,'&quot;');
    const obsVal = (f.obs||'').replace(/"/g,'&quot;');
    div.innerHTML =
      '<div class="rel-drag-handle" style="display:flex;align-items:center;justify-content:center;width:18px;cursor:grab;color:var(--mon-text-faint,#bbb);font-size:18px;user-select:none;flex-shrink:0">\u22ee\u22ee</div>' +
      '<div style="flex:1;min-width:0">' +
        '<input type="text" id="relch-f-'+idx+'" value="'+chVal+'" placeholder="Chave da unidade"' +
          ' style="width:100%;box-sizing:border-box;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;padding:8px 11px;font-size:15px;font-weight:700;background:var(--mon-surface,#fff);color:var(--mon-text);outline:none;margin-bottom:8px"/>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
          '<span style="font-size:13px;color:var(--mon-text-faint,#888)">Qtd:</span>' +
          '<button onclick="window._relAdjQtd('+idx+',-1)" style="width:28px;height:28px;border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;background:var(--mon-surface,#fff);cursor:pointer;font-size:16px;color:var(--mon-text)">\u2212</button>' +
          '<span id="relqtd-f-'+idx+'" style="font-size:16px;font-weight:800;color:var(--mon-red,#dc2626);min-width:26px;text-align:center">'+_relPad2(f.qtd||1)+'</span>' +
          '<button onclick="window._relAdjQtd('+idx+',1)" style="width:28px;height:28px;border:1px solid var(--mon-border,#e0e0e0);border-radius:6px;background:var(--mon-surface,#fff);cursor:pointer;font-size:16px;color:var(--mon-text)">+</button>' +
        '</div>' +
        '<input type="text" id="relobs-f-'+idx+'" placeholder="Observa\u00e7\u00e3o (opcional)" value="'+obsVal+'"' +
          ' style="width:100%;box-sizing:border-box;padding:8px 11px;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);outline:none"/>' +
      '</div>' +
      '<button onclick="window._relRemItem(\'f\','+idx+')" style="background:none;border:none;cursor:pointer;color:var(--mon-text-faint,#aaa);font-size:18px;padding:0 4px;flex-shrink:0;align-self:flex-start">\u2715</button>';
    _relApplyDnD(div);
    return div;
  }

  function _relMkCardNE(idx, n) {
    const div = document.createElement('div');
    div.id = 'relcard-ne-'+idx;
    div.dataset.tipo = 'ne'; div.dataset.idx = String(idx);
    div.style.cssText = 'display:flex;align-items:stretch;gap:10px;background:var(--mon-surface2,#f5f5f5);border-left:4px solid var(--mon-amber,#d97706);border-radius:10px;padding:12px 14px;margin-bottom:8px;transition:opacity .15s,box-shadow .15s';
    const chVal  = (n.chave||'').replace(/"/g,'&quot;');
    const obsVal = (n.obs||'').replace(/"/g,'&quot;');
    div.innerHTML =
      '<div class="rel-drag-handle" style="display:flex;align-items:center;justify-content:center;width:18px;cursor:grab;color:var(--mon-text-faint,#bbb);font-size:18px;user-select:none;flex-shrink:0">\u22ee\u22ee</div>' +
      '<div style="flex:1;min-width:0">' +
        '<input type="text" id="relch-ne-'+idx+'" placeholder="Chave da unidade" value="'+chVal+'"' +
          ' style="width:100%;box-sizing:border-box;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;padding:8px 11px;font-size:15px;font-weight:700;background:var(--mon-surface,#fff);color:var(--mon-text);outline:none;margin-bottom:8px"/>' +
        '<input type="text" id="relobs-ne-'+idx+'" placeholder="Observa\u00e7\u00e3o (opcional)" value="'+obsVal+'"' +
          ' style="width:100%;box-sizing:border-box;padding:8px 11px;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);outline:none"/>' +
      '</div>' +
      '<button onclick="window._relRemItem(\'ne\','+idx+')" style="background:none;border:none;cursor:pointer;color:var(--mon-text-faint,#aaa);font-size:18px;padding:0 4px;flex-shrink:0;align-self:flex-start">\u2715</button>';
    _relApplyDnD(div);
    return div;
  }

  function _relMkCardPonto(idx, p) {
    const div = document.createElement('div');
    div.id = 'relcard-p-'+idx;
    div.dataset.tipo = 'p'; div.dataset.idx = String(idx);
    div.style.cssText = 'display:flex;align-items:stretch;gap:10px;background:var(--mon-surface2,#f5f5f5);border-left:4px solid var(--mon-blue,#2563eb);border-radius:10px;padding:12px 14px;margin-bottom:8px;transition:opacity .15s,box-shadow .15s';
    const chVal  = (p.chave||'').replace(/"/g,'&quot;');
    const obsVal = (p.obs||'').replace(/"/g,'&quot;');
    div.innerHTML =
      '<div class="rel-drag-handle" style="display:flex;align-items:center;justify-content:center;width:18px;cursor:grab;color:var(--mon-text-faint,#bbb);font-size:18px;user-select:none;flex-shrink:0">\u22ee\u22ee</div>' +
      '<div style="flex:1;min-width:0">' +
        '<input type="text" id="relch-p-'+idx+'" placeholder="Chave da unidade (opcional)" value="'+chVal+'"' +
          ' style="width:100%;box-sizing:border-box;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;padding:8px 11px;font-size:15px;font-weight:700;background:var(--mon-surface,#fff);color:var(--mon-text);outline:none;margin-bottom:8px"/>' +
        '<input type="text" id="relobs-p-'+idx+'" placeholder="Descri\u00e7\u00e3o do ponto de aten\u00e7\u00e3o (obrigat\u00f3ria)" value="'+obsVal+'"' +
          ' style="width:100%;box-sizing:border-box;padding:8px 11px;border:1px solid var(--mon-border,#e0e0e0);border-radius:7px;font-size:13px;background:var(--mon-surface,#fff);color:var(--mon-text,#1a1a2e);outline:none"/>' +
      '</div>' +
      '<button onclick="window._relRemItem(\'p\','+idx+')" style="background:none;border:none;cursor:pointer;color:var(--mon-text-faint,#aaa);font-size:18px;padding:0 4px;flex-shrink:0;align-self:flex-start">\u2715</button>';
    _relApplyDnD(div);
    return div;
  }

  // Aliases de compat usados em outros pontos do c\u00f3digo
  window._relCardFalta  = (idx, chave, qtd, obs) => _relMkCardFalta(idx, {chave:chave||'', qtd:qtd||1, obs:obs||''});
  window._relCardNE     = (idx) => _relMkCardNE(idx, _rel.ne[idx] || {});
  window._relCardPonto  = (idx) => _relMkCardPonto(idx, _rel.pontos[idx] || {});

  // ── ADD / REMOVE ──────────────────────────────────────────────────────────────
  window._relAddFalta = function() {
    _relSnap('f');
    const idx = _rel.faltas.length;
    _rel.faltas.push({ chave:'', qtd:1, obs:'' });
    const lista = document.getElementById('rel-lista-f');
    if (!lista) return;
    const card = _relMkCardFalta(idx, _rel.faltas[idx]);
    lista.appendChild(card);
    lista.scrollTop = lista.scrollHeight;
    card.querySelector('input')?.focus();
    _relAtualizarTotalF();
    setTimeout(window._relSalvarRascunho, 200);
  };

  window._relAddNE = function() {
    _relSnap('ne');
    const idx = _rel.ne.length;
    _rel.ne.push({ chave:'', obs:'' });
    const lista = document.getElementById('rel-lista-ne');
    if (!lista) return;
    const card = _relMkCardNE(idx, _rel.ne[idx]);
    lista.appendChild(card);
    lista.scrollTop = lista.scrollHeight;
    card.querySelector('input')?.focus();
    _relAtualizarTotalNE();
    setTimeout(window._relSalvarRascunho, 200);
  };

  window._relAddPonto = function() {
    _relSnap('p');
    const idx = _rel.pontos.length;
    _rel.pontos.push({ chave:'', obs:'' });
    const lista = document.getElementById('rel-lista-p');
    if (!lista) return;
    const card = _relMkCardPonto(idx, _rel.pontos[idx]);
    lista.appendChild(card);
    lista.scrollTop = lista.scrollHeight;
    card.querySelector('input')?.focus();
    setTimeout(window._relSalvarRascunho, 200);
  };

  window._relRemItem = function(tipo, idx) {
    const t = tipo === 'f' ? 'f' : tipo === 'ne' ? 'ne' : 'p';
    _relSnap(t);
    if (t==='f')  _rel.faltas.splice(idx, 1);
    if (t==='ne') _rel.ne.splice(idx, 1);
    if (t==='p')  _rel.pontos.splice(idx, 1);
    _relReRender(t);
    setTimeout(window._relSalvarRascunho, 100);
  };

  // ── DRAG-AND-DROP ─────────────────────────────────────────────────────────────
  let _dndTipo = null, _dndIdx = null, _dndCanDrag = false;

  function _relApplyDnD(card) {
    card.addEventListener('mousedown', function(e) {
      const h = card.querySelector('.rel-drag-handle');
      _dndCanDrag = !!(h && (e.target === h || h.contains(e.target)));
      card.draggable = _dndCanDrag;
      if (h) h.style.cursor = _dndCanDrag ? 'grabbing' : 'grab';
    });
    card.addEventListener('mouseup', function() {
      card.draggable = true;
      const h = card.querySelector('.rel-drag-handle');
      if (h) h.style.cursor = 'grab';
    });
    card.addEventListener('dragstart', function(e) {
      if (!_dndCanDrag) { e.preventDefault(); return; }
      _dndTipo = card.dataset.tipo;
      _dndIdx  = parseInt(card.dataset.idx, 10);
      card.style.opacity = '0.4';
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', card.id); } catch(_) {}
    });
    card.addEventListener('dragend', function() {
      card.style.opacity = '1';
      _dndTipo = null; _dndIdx = null;
      document.querySelectorAll('[data-tipo]').forEach(function(c) {
        c.style.borderTop = ''; c.style.borderBottom = '';
      });
    });
    card.addEventListener('dragover', function(e) {
      if (!_dndTipo || _dndTipo !== card.dataset.tipo) return;
      e.preventDefault();
      const mid = card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2;
      card.style.borderTop    = e.clientY < mid ? '2px solid var(--mon-green,#16a34a)' : '';
      card.style.borderBottom = e.clientY < mid ? '' : '2px solid var(--mon-green,#16a34a)';
    });
    card.addEventListener('dragleave', function() {
      card.style.borderTop = ''; card.style.borderBottom = '';
    });
    card.addEventListener('drop', function(e) {
      e.preventDefault();
      if (!_dndTipo || _dndTipo !== card.dataset.tipo) return;
      const tipo = _dndTipo, from = _dndIdx;
      const to   = parseInt(card.dataset.idx, 10);
      if (from === to) return;
      const mid  = card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2;
      const acima = e.clientY < mid;
      _relSnap(tipo);
      const arr  = tipo==='f' ? _rel.faltas : tipo==='ne' ? _rel.ne : _rel.pontos;
      const item = arr.splice(from, 1)[0];
      let alvo   = from < to ? to - 1 : to;
      if (!acima) alvo++;
      alvo = Math.max(0, Math.min(arr.length, alvo));
      arr.splice(alvo, 0, item);
      _relReRender(tipo);
    });
  }

  // ── FIM DnD ───────────────────────────────────────────────────────────────────

  window._relGerar = function() {
    _relSnap('f'); _relSnap('ne'); _relSnap('p');
    const t    = 'T' + (_rel.turno || _relTurnoAtual());
    const data = _relDataTurno(_rel.turno || _relTurnoAtual());
    let totalF = 0, linhasF = [], linhasNE = [], linhasP = [];
    _rel.faltas.forEach(function(f) {
      const ch = (f.chave||'').trim().toUpperCase();
      if (!ch) return;
      totalF += (f.qtd||1);
      linhasF.push('*'+ch+'* - '+_relPad2(f.qtd||1)+(f.obs?' \u2013 '+f.obs:''));
    });
    _rel.ne.forEach(function(n) {
      const ch = (n.chave||'').trim().toUpperCase();
      if (!ch) return;
      linhasNE.push('*'+ch+'*'+(n.obs?' \u2013 '+n.obs:''));
    });
    _rel.pontos.forEach(function(p) {
      const ob = (p.obs||'').trim();
      if (!ob) return;
      const ch = (p.chave||'').trim().toUpperCase();
      linhasP.push((ch ? '*'+ch+'* \u2013 ' : '')+ob);
    });
    _relTxtPlan = '\uD83D\uDC9A *RELAT\u00d3RIO VERDE \u2013 '+t+'* \uD83D\uDC9A\n\n' +
                  '\uD83D\uDCC5 *Data:* '+data+'\n\n' +
                  '*Total de faltas registradas: '+_relPad2(totalF)+'*';
    if (linhasF.length)  _relTxtPlan += '\n\n'+linhasF.join('\n');
    _relTxtPlan += '\n\n\u274C *N\u00e3o entregue: '+_relPad2(linhasNE.length)+'*';
    if (linhasNE.length) _relTxtPlan += '\n\n'+linhasNE.join('\n');
    _relTxtPlan += '\n\n\u26A0 *Pontos de Aten\u00e7\u00e3o \u2013 '+t+'*';
    _relTxtPlan += linhasP.length ? '\n\n'+linhasP.join('\n\n') : '\n\nSem ocorr\u00eancias.';
    _relTxtPlan += '\n\nAcompanhar planejamento e cobrar l\u00edderes.';
    _relTxtRep = '\uD83D\uDC9A *PASSAGEM DE PLANT\u00c3O - '+t+'* \uD83D\uDC9A\n\n' +
                 '\u26A0 *Pontos de Aten\u00e7\u00e3o \u2013 '+t+'*\n\n';
    _relTxtRep += linhasP.length ? linhasP.join('\n\n') : 'Sem ocorr\u00eancias.';
    _relTxtRep += '\n\nAcompanhar planejamento e cobrar l\u00edderes.';
    _rel.txtPlan = _relTxtPlan; _rel.txtRep = _relTxtRep;
    window._relVerTab('plan');
    ['rel-btn-copiar-plan','rel-btn-copiar-rep','rel-turno-btn-copiar'].forEach(function(id) {
      const b = document.getElementById(id);
      if (b) { b.disabled=false; b.style.opacity='1'; b.style.cursor='pointer'; }
    });
  };

  window._relVerTab = function(aba) {
    _rel.tabAtiva = aba; _relTabAtiva = aba;
    const prev = document.getElementById('rel-preview');
    if (prev) prev.textContent = aba==='plan' ? _relTxtPlan : _relTxtRep;
    const p = document.getElementById('rel-tab-plan');
    const r = document.getElementById('rel-tab-rep');
    if (p) { p.style.background=aba==='plan'?'rgba(22,163,74,0.1)':'none'; p.style.borderColor=aba==='plan'?'var(--mon-green,#16a34a)':'var(--mon-border,#e0e0e0)'; p.style.color=aba==='plan'?'var(--mon-green,#16a34a)':'var(--mon-text-faint,#888)'; }
    if (r) { r.style.background=aba==='rep'?'rgba(220,38,38,0.08)':'none'; r.style.borderColor=aba==='rep'?'var(--mon-red,#dc2626)':'var(--mon-border,#e0e0e0)'; r.style.color=aba==='rep'?'var(--mon-red,#dc2626)':'var(--mon-text-faint,#888)'; }
  };

  window._relCopiarAtivo = function() {
    if (!_relTxtPlan) window._relGerar();
    const txt = (_rel.tabAtiva === 'rep') ? _relTxtRep : _relTxtPlan;
    if (!txt) return;
    navigator.clipboard.writeText(txt).catch(function() { prompt('Copie:', txt); });
    const btn = document.getElementById('rel-turno-btn-copiar');
    if (btn) { const orig=btn.textContent; btn.textContent='Copiado \u2713'; setTimeout(function(){btn.textContent=orig;},1800); }
  };

  // Vari\u00e1veis de compat (usadas em outros m\u00f3dulos do c\u00f3digo)
  let _relFaltas   = _rel.faltas;
  let _relNE       = _rel.ne;
  let _relPontos   = _rel.pontos;
  let _relTurnoSel = _rel.turno;
  let _relTxtPlan  = '';
  let _relTxtRep   = '';
  let _relTabAtiva = 'plan';


  window._relCopiar = function(aba) {
    const txt = aba==='plan' ? _relTxtPlan : _relTxtRep;
    if (!txt) return;
    navigator.clipboard.writeText(txt).catch(() => prompt('Copie:', txt));
    const btn = document.getElementById('rel-btn-copiar-'+aba);
    if (btn) { const orig=btn.textContent; btn.textContent='Copiado ✓'; setTimeout(()=>btn.textContent=orig,1500); }
  };

  // ── FIM RELATÓRIO DE TURNO ───────────────────────────────────────────────

  // ── MÓDULO: SAÍDA ANTECIPADA ─────────────────────────────────────────────────

  function _saHoraParaMin(str) {
    if (!str) return -1;
    const m = String(str).match(/(\d{1,2}):(\d{2})/);
    if (!m) return -1;
    return parseInt(m[1]) * 60 + parseInt(m[2]);
  }

  // 10H = 600min (cravado); qualquer outro = h*60+20
  function _saCargaParaMin(carga) {
    if (!carga) return -1;
    const m = String(carga).match(/^(\d+)D(\d+)H$/i);
    if (!m) return -1;
    const h = parseInt(m[2]);
    return h === 10 ? 600 : h * 60 + 20;
  }

  // Verifica se o encerramento esperado já passou (com suporte a virada de meia-noite)
  function _saJaPassou(encMin) {
    if (encMin < 0) return false;
    const agora   = new Date();
    const agoraMin = agora.getHours() * 60 + agora.getMinutes();
    let diff = agoraMin - encMin;
    if (diff < -840) diff += 1440;
    return diff >= 0;
  }

  // Retorna minutos de antecipação (positivo = saiu antes do esperado)
  function _saAntecipacaoMin(encMin, terminoMin) {
    if (encMin < 0 || terminoMin < 0) return null;
    let diff = encMin - terminoMin;
    if (diff >  840) diff -= 1440;
    if (diff < -840) diff += 1440;
    return diff;
  }

  window._monAbrirSaidaAntecipada = function() {
    let modal = document.getElementById('mon-sa-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mon-sa-modal';
      modal.style.cssText = 'position:fixed;inset:0;z-index:9999995;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(3px)';
      document.body.appendChild(modal);
    }

    const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => o.id);
    const totalOps = ops.length;

    // Sugere horário com base nas ops carregadas — pega a menor e maior hora
    let sugestaoIni = '00:00', sugestaoFim = '23:59';
    if (ops.length > 0) {
      const horas = ops.map(o => o.hora).filter(Boolean).sort();
      if (horas.length > 0) {
        sugestaoIni = horas[0];
        sugestaoFim = horas[horas.length - 1];
      }
    }

    modal.innerHTML = `
      <div style="background:var(--mon-bg);border-radius:12px;width:min(520px,96vw);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.4);border:1px solid var(--mon-border)">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--mon-border)">
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--mon-text)">🚨 Saídas Antecipadas</div>
            <div style="font-size:11px;color:var(--mon-text-faint);margin-top:2px">${totalOps} operações carregadas no Monitor</div>
          </div>
          <button onclick="window._monFecharSaidaAntecipada()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--mon-text-faint);padding:4px 8px;border-radius:4px">✕</button>
        </div>

        <!-- Filtro de horário -->
        <div style="padding:20px;border-bottom:1px solid var(--mon-border)">
          <div style="font-size:12px;font-weight:600;color:var(--mon-text-dim);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.4px">Filtrar operações pelo horário de início</div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="display:flex;flex-direction:column;gap:4px;flex:1">
              <label style="font-size:11px;color:var(--mon-text-faint)">De</label>
              <input id="mon-sa-hora-ini" type="time" value="${sugestaoIni}"
                style="padding:8px 10px;border-radius:7px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:14px;font-family:var(--mon-mono);font-weight:600;width:100%">
            </div>
            <div style="color:var(--mon-text-faint);margin-top:16px;font-size:16px">→</div>
            <div style="display:flex;flex-direction:column;gap:4px;flex:1">
              <label style="font-size:11px;color:var(--mon-text-faint)">Até</label>
              <input id="mon-sa-hora-fim" type="time" value="${sugestaoFim}"
                style="padding:8px 10px;border-radius:7px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:14px;font-family:var(--mon-mono);font-weight:600;width:100%">
            </div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <label style="font-size:11px;color:transparent">.</label>
              <button onclick="window._monSaPreview()"
                style="padding:8px 14px;border-radius:7px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text-dim);font-size:12px;cursor:pointer;white-space:nowrap">
                👁 Ver ops
              </button>
            </div>
          </div>

          <!-- Preview das ops filtradas -->
          <div id="mon-sa-preview" style="margin-top:12px;min-height:28px">
            <div style="font-size:11px;color:var(--mon-text-faint);font-style:italic">Clique em "Ver ops" para pré-visualizar ou clique direto em Verificar.</div>
          </div>
        </div>

        <!-- Resultado -->
        <div id="mon-sa-resultado" style="display:none;padding:14px 20px;border-bottom:1px solid var(--mon-border);max-height:240px;overflow-y:auto"></div>

        <!-- Footer -->
        <div style="padding:14px 20px;display:flex;align-items:center;gap:10px">
          <button onclick="window._monVerificarSaidas()"
            style="padding:9px 22px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-accent);color:#fff"
            onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            🔍 Verificar
          </button>
          <button id="mon-sa-btn-copiar" onclick="window._monSaCopiarPlanilha()" style="display:none;padding:9px 22px;border-radius:7px;border:1px solid var(--mon-accent);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-accent-bg,rgba(99,102,241,.12));color:var(--mon-accent)"
            onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            📋 Copiar Planilha
          </button>
          <button id="mon-sa-btn-excel" onclick="window._monExportarSaidas()" style="display:none;padding:9px 22px;border-radius:7px;border:1px solid var(--mon-green);cursor:pointer;font-size:13px;font-weight:600;background:var(--mon-green-bg);color:var(--mon-green)"
            onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            📥 Relatório Excel
          </button>
          <button onclick="window._monFecharSaidaAntecipada()"
            style="margin-left:auto;padding:9px 16px;border-radius:7px;border:1px solid var(--mon-border);cursor:pointer;font-size:13px;background:none;color:var(--mon-text-faint)">
            Fechar
          </button>
        </div>
      </div>`;

    modal.style.display = 'flex';
    window._monSaResultados = null;
    // Faz preview automático ao abrir
    setTimeout(window._monSaPreview, 80);
  };

  window._monFecharSaidaAntecipada = function() {
    const m = document.getElementById('mon-sa-modal');
    if (m) m.style.display = 'none';
  };

  // Filtra ops pelo intervalo de hora e exibe preview
  window._monSaPreview = function() {
    const iniEl = document.getElementById('mon-sa-hora-ini');
    const fimEl = document.getElementById('mon-sa-hora-fim');
    const prev  = document.getElementById('mon-sa-preview');
    if (!iniEl || !fimEl || !prev) return;

    const minIni = _saHoraParaMin(iniEl.value);
    const minFim = _saHoraParaMin(fimEl.value);
    const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => o.id && o.hora);

    const filtradas = ops.filter(o => {
      const h = _saHoraParaMin(o.hora);
      if (h < 0) return false;
      // Suporte a virada de dia (ex: 22:00 → 06:00)
      if (minIni <= minFim) return h >= minIni && h <= minFim;
      return h >= minIni || h <= minFim;
    });

    if (filtradas.length === 0) {
      prev.innerHTML = '<div style="font-size:12px;color:var(--mon-amber);">⚠️ Nenhuma operação nesse intervalo de horário.</div>';
      return;
    }

    const chips = filtradas.map(o =>
      `<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:99px;background:var(--mon-surface2);border:1px solid var(--mon-border);font-size:11px;font-family:var(--mon-mono)">
        <span style="color:var(--mon-amber)">${o.hora}</span>
        <span style="color:var(--mon-text-dim)">${o.sigla || o.chave}</span>
      </span>`
    ).join(' ');

    prev.innerHTML = `
      <div style="font-size:11px;color:var(--mon-green);font-weight:600;margin-bottom:6px">✓ ${filtradas.length} operação${filtradas.length > 1 ? 'ões' : ''} no intervalo</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">${chips}</div>`;
  };

  // Busca colaboradores diretamente do pedidoEapt de uma op, retorna Promise<Array>
  // Usa a mesma lógica de apontados: busca eaptHref real via planejamento-operacional-edit
  function _saFetchColabs(op) {
    const _extrairHora = (raw) => {
      if (!raw) return '';
      const m = raw.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
      return m ? m[1] + ':' + m[2] : '';
    };

    const _fetchEapt = (eaptHref, escalados) => {
      console.log('[SA] _fetchEapt → buscando:', eaptHref);
      return fetchDoc('https://tsi-app.com/' + eaptHref).then(doc3 => {
        const colabs = [];
        const tbl3 = doc3.querySelector('table.tables.table-fixed.card-table');
        if (!tbl3) { console.warn('[SA] tabela não encontrada no eapt:', eaptHref); return colabs; }

        // Loga todos os headers para debug
        const headRows = [...tbl3.querySelectorAll('thead tr')];
        console.log('[SA] thead rows:', headRows.length);
        headRows.forEach((tr, ri) => {
          [...tr.querySelectorAll('th,td')].forEach((th, ci) => {
            console.log(`[SA] thead[${ri}][${ci}] colspan=${th.getAttribute('colspan')||1} → "${th.textContent.replace(/\s+/g,' ').trim()}"`);
          });
        });

        // Detecta a coluna DATA do TÉRMINO OPORTUNIDADE pelo header.
        let colTermino = -1;
        if (headRows.length >= 2) {
          let baseTermino = -1;
          let ci0 = 0;
          headRows[0].querySelectorAll('th,td').forEach(th => {
            const txt = (th.textContent || '').replace(/\s+/g,' ').toLowerCase().trim();
            const cs  = parseInt(th.getAttribute('colspan') || '1');
            if (baseTermino === -1 && (txt.includes('término') || txt.includes('termino'))) baseTermino = ci0;
            ci0 += cs;
          });
          console.log('[SA] baseTermino (ROW0):', baseTermino);
          if (baseTermino >= 0) {
            let ci1 = 0;
            headRows[1].querySelectorAll('th,td').forEach(th => {
              const txt = (th.textContent || '').replace(/\s+/g,' ').toLowerCase().trim();
              const cs  = parseInt(th.getAttribute('colspan') || '1');
              if (colTermino === -1 && ci1 >= baseTermino && txt.includes('data')) colTermino = ci1;
              ci1 += cs;
            });
            if (colTermino === -1) colTermino = baseTermino;
          }
        } else if (headRows.length === 1) {
          let ci = 0;
          headRows[0].querySelectorAll('th,td').forEach(th => {
            const txt = (th.textContent || '').replace(/\s+/g,' ').toLowerCase().trim();
            const cs  = parseInt(th.getAttribute('colspan') || '1');
            if (colTermino === -1 && (txt.includes('término') || txt.includes('termino'))) colTermino = ci;
            ci += cs;
          });
        }
        console.log('[SA] colTermino final:', colTermino);

        tbl3.querySelectorAll('tbody tr').forEach((row, ri) => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 10) return;
          const nome = cells[0]?.textContent?.trim();
          const cpf  = cells[1]?.textContent?.trim();
          if (!nome || nome.length < 3) return;

          // Loga todas as células da linha para debug
          console.log(`[SA] row[${ri}] ${nome} — ${cells.length} células:`);
          [...cells].forEach((td, ci) => {
            const v = td.textContent.replace(/\s+/g,' ').trim();
            if (v) console.log(`  cells[${ci}]: "${v}"`);
          });

          // FALTA pode aparecer em qualquer célula da linha
          const isFalta = [...cells].some(td => (td.textContent || '').trim() === 'FALTA');
          if (isFalta) { console.log(`[SA] row[${ri}] ${nome} → FALTA, ignorado`); return; }

          // Término
          let termino = colTermino >= 0 ? _extrairHora(cells[colTermino]?.textContent?.trim()) : '';
          console.log(`[SA] row[${ri}] ${nome} → termino via colTermino[${colTermino}]:`, termino);
          if (!termino) {
            termino = _extrairHora(cells[12]?.textContent?.trim());
            console.log(`[SA] row[${ri}] ${nome} → termino via cells[12]:`, termino);
          }
          if (!termino) {
            for (let ci = 11; ci < Math.min(cells.length, 20); ci++) {
              const raw = (cells[ci]?.textContent || '').trim();
              const hora = _extrairHora(raw);
              if (hora && raw.length > 4 && raw.length < 25 && !/^[\d.,]+\s*km/i.test(raw)) {
                termino = hora;
                console.log(`[SA] row[${ri}] ${nome} → termino via varredura cells[${ci}]:`, termino);
                break;
              }
            }
          }
          if (!termino) console.warn(`[SA] row[${ri}] ${nome} → SEM TÉRMINO, linha ignorada`);

          // Carga
          let carga = '';
          if (escalados && escalados.length) {
            const esc = escalados.find(e => e.cpf === cpf);
            if (esc) carga = esc.carga || '';
          }
          if (!carga) {
            for (let ci = 0; ci < cells.length; ci++) {
              const txt = (cells[ci]?.textContent || '').trim();
              if (/^\d+D\d+H$/i.test(txt)) { carga = txt.toUpperCase(); break; }
            }
          }
          // Fallback: usa a carga horária da operação (coluna CARGA HORÁRIA da tabela principal)
          if (!carga && op.cargaHoraria) carga = op.cargaHoraria;
          console.log(`[SA] row[${ri}] ${nome} → termino="${termino}" carga="${carga}"`);

          // Extrai editUrl do botão de excluir da linha (pedidoAPTdel_<b64>_1_N_D)
          let editUrl = '';
          row.querySelectorAll('a[onclick],button[onclick]').forEach(btn => {
            const oc = btn.getAttribute('onclick') || '';
            const m  = oc.match(/pedidoAPTdel_([A-Za-z0-9+/=]+)_1_N_D/);
            if (m && !editUrl) editUrl = 'apontamentoE_' + m[1] + '_1';
          });

          colabs.push({ nome, cpf, termino, carga, editUrl });
        });

        console.log('[SA] colabs extraídos:', colabs.length, colabs);
        return colabs;
      }).catch(err => { console.error('[SA] erro no fetchEapt:', err); return []; });
    };

    // Se cache já tem eaptHref e escalados, usa diretamente (evita fetch extra)
    const cached = apontCache[op.id];
    if (cached && cached !== 'loading' && cached.eaptHref) {
      return _fetchEapt(cached.eaptHref, cached.escalados || []);
    }

    // Senão, replica a lógica de apontados: busca a página edit para pegar os hrefs reais
    return fetchDoc('https://tsi-app.com/planejamento-operacional-edit' + op.id + '_1')
      .then(doc => {
        let eaptHref, escalaHref;
        const eaptLink   = doc.querySelector('a[href*="pedidoEapt"]');
        const escalaLink = doc.querySelector('a[href*="pedidoEescala"]');
        if (eaptLink)   eaptHref   = eaptLink.getAttribute('href');
        if (escalaLink) escalaHref = escalaLink.getAttribute('href');
        if (!eaptHref || !escalaHref) {
          const eg = doc.querySelector('a[href*="pedidoEgeral"]');
          if (eg) {
            if (!eaptHref)   eaptHref   = eg.getAttribute('href').replace('pedidoEgeral', 'pedidoEapt');
            if (!escalaHref) escalaHref = eg.getAttribute('href').replace('pedidoEgeral', 'pedidoEescala');
          }
        }
        if (!eaptHref) return [];
        // Se não há escala disponível, busca o eapt direto sem carga
        if (!escalaHref) return _fetchEapt(eaptHref, []);
        // Busca a tabela de escala para extrair a carga individual de cada colaborador
        return fetchDoc('https://tsi-app.com/' + escalaHref).then(doc2 => {
          const escaladosLocal = [];
          const escTbl = doc2.querySelector('table.tables.table-fixed.card-table.table-bordered')
                      || doc2.querySelector('table.tables.table-fixed.card-table')
                      || doc2.querySelector('table');
          if (escTbl) {
            escTbl.querySelectorAll('tbody tr').forEach(row => {
              if (row.classList.contains('strikethrough')) return;
              if (row.querySelector('td.strikethrough')) return;
              const cells = row.querySelectorAll('td');
              if (cells.length < 5) return;
              const cpf = cells[3]?.textContent?.trim();
              if (!cpf) return;
              let cargaEscalado = '';
              row.querySelectorAll('td.autosize, td[class*="autosize"]').forEach(td => {
                const txt = td.textContent.trim();
                if (/^\d+D\d+H$/i.test(txt)) cargaEscalado = txt.toUpperCase();
              });
              if (cargaEscalado) escaladosLocal.push({ cpf, carga: cargaEscalado });
            });
          }
          return _fetchEapt(eaptHref, escaladosLocal);
        }).catch(() => _fetchEapt(eaptHref, []));
      }).catch(() => []);
  }

  window._monVerificarSaidas = function() {
    const iniEl = document.getElementById('mon-sa-hora-ini');
    const fimEl = document.getElementById('mon-sa-hora-fim');
    if (!iniEl || !fimEl) return;

    const minIni = _saHoraParaMin(iniEl.value);
    const minFim = _saHoraParaMin(fimEl.value);

    const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => {
      if (!o.id || !o.hora) return false;
      const h = _saHoraParaMin(o.hora);
      if (h < 0) return false;
      if (minIni <= minFim) return h >= minIni && h <= minFim;
      return h >= minIni || h <= minFim;
    });

    const res = document.getElementById('mon-sa-resultado');
    if (ops.length === 0) {
      if (res) { res.style.display = 'block'; res.innerHTML = '<div style="color:var(--mon-amber);font-size:13px">⚠️ Nenhuma operação encontrada nesse intervalo de horário.</div>'; }
      return;
    }

    // Mostra loading enquanto busca
    if (res) {
      res.style.display = 'block';
      res.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mon-text-faint)"><div class="mon-loading-spinner" style="width:14px;height:14px;border-width:2px"></div>Buscando apontamentos das ' + ops.length + ' operações…</div>';
    }
    const btnExcel = document.getElementById('mon-sa-btn-excel');
    if (btnExcel) btnExcel.style.display = 'none';

    const LIMITE_MIN = 50;

    // Busca em lotes de 5 para não sobrecarregar o servidor
    const LOTE = 5;
    const _fetchEmLotes = async (lista) => {
      const resultado = [];
      for (let i = 0; i < lista.length; i += LOTE) {
        const lote = lista.slice(i, i + LOTE);
        const parcial = await Promise.all(lote.map(op => _saFetchColabs(op).then(colabs => ({ op, colabs }))));
        resultado.push(...parcial);
        if (res) {
          const prog = Math.min(i + LOTE, lista.length);
          res.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mon-text-faint)"><div class="mon-loading-spinner" style="width:14px;height:14px;border-width:2px"></div>Buscando… ' + prog + '/' + lista.length + ' operações</div>';
        }
      }
      return resultado;
    };

    _fetchEmLotes(ops).then(resultadosOps => {
        const resultados = [];
        const resumoOps  = [];

        resultadosOps.forEach(({ op, colabs }) => {
          if (!colabs || colabs.length === 0) {
            resumoOps.push({ op, status: 'sem_dados', qtd: 0 });
            return;
          }

          let qtdFlag = 0;       // saídas antecipadas reais (com termino)
          let qtdPendente = 0;   // ainda não saiu (sem termino) — informativo, não conta como flag
          let encEsperadoOp = ''; // encerramento esperado da op (calculado do primeiro colab com carga válida)
          const opIniMin = _saHoraParaMin(op.hora);
          console.log(`[SA] op "${op.sigla}" hora="${op.hora}" opIniMin=${opIniMin} — ${colabs.length} colab(s)`);
          colabs.forEach(c => {
            if (!c.carga) {
              console.warn(`[SA]   ${c.nome} → pulado (sem carga horária)`);
              return;
            }
            if (opIniMin < 0) { console.warn(`[SA]   ${c.nome} → opIniMin inválido`); return; }
            const duracaoMin = _saCargaParaMin(c.carga);
            if (duracaoMin < 0) { console.warn(`[SA]   ${c.nome} → carga inválida: \"${c.carga}\"`); return; }
            const encMin = (opIniMin + duracaoMin) % 1440;
            const encStr = ('0' + Math.floor(encMin / 60)).slice(-2) + ':' + ('0' + (encMin % 60)).slice(-2);
            if (!encEsperadoOp) encEsperadoOp = encStr; // guarda o primeiro encerramento válido

            if (!c.termino) {
              // Sem registro de saída:
              // - Se faltam > 50min para o encerramento previsto: "ainda não saiu" (cedo demais pra saber)
              // - Se já passaram os 50min: ignora (não saiu antecipado, tudo ok)
              const agora = new Date();
              const agoraMin = agora.getHours() * 60 + agora.getMinutes();
              let minutosAteEnc = encMin - agoraMin;
              if (minutosAteEnc < -840) minutosAteEnc += 1440;
              if (minutosAteEnc > 840)  minutosAteEnc -= 1440;
              if (minutosAteEnc > LIMITE_MIN) {
                // Ainda faltam mais de 50min — cedo demais, exibe como "ainda não saiu"
                console.warn(`[SA]   ${c.nome} → sem término, faltam ${minutosAteEnc}min → ainda não saiu`);
                qtdPendente++;
                resultados.push({
                  chave: op.chave, sigla: op.sigla || '', horaOp: op.hora || '',
                  nome: c.nome, cpf: c.cpf, carga: c.carga,
                  inicio: op.hora, terminoReal: null,
                  encEsperado: encStr, antecipacao: null, aindaNaoSaiu: true
                });
              } else {
                // Já passou o tempo — sem saída registrada mas dentro do normal, ignora
                console.warn(`[SA]   ${c.nome} → sem término mas encerramento já passou/próximo (${minutosAteEnc}min) → ok`);
              }
              return;
            }

            const terminoMin  = _saHoraParaMin(c.termino);
            const antecipacao = _saAntecipacaoMin(encMin, terminoMin);
            console.log(`[SA]   ${c.nome} → carga=${c.carga} duracao=${duracaoMin}min encEsperado=${encStr} terminoReal=${c.termino} antecipacao=${antecipacao}min ${antecipacao >= LIMITE_MIN ? '🚨 FLAG' : '✅ ok'}`);
            if (antecipacao === null || antecipacao < LIMITE_MIN) return;
            qtdFlag++;
            resultados.push({
              chave: op.chave, sigla: op.sigla || '', horaOp: op.hora || '',
              nome: c.nome, cpf: c.cpf, carga: c.carga,
              inicio: op.hora, terminoReal: c.termino,
              encEsperado: encStr, antecipacao, aindaNaoSaiu: false
            });
          });

          resumoOps.push({ op, status: qtdFlag > 0 ? 'pendencia' : 'ok', qtd: qtdFlag, qtdPendente, encEsperado: encEsperadoOp });
        });

        window._monSaResultados = { resultados, resumoOps };

        const totalFlag  = resultados.length;
        const opsComPend = resumoOps.filter(r => r.status === 'pendencia').length;
        if (btnExcel) btnExcel.style.display = totalFlag > 0 ? 'inline-flex' : 'none';
        const btnCopiar = document.getElementById('mon-sa-btn-copiar');
        if (btnCopiar) btnCopiar.style.display = totalFlag > 0 ? 'inline-flex' : 'none';

        // Monta função copiar planilha (CHAVE, SIGLA, HORA INÍCIO, CARGA HORÁRIA, ENCERRAMENTO, STATUS)
        window._monSaCopiarPlanilha = function() {
          const dados = window._monSaResultados;
          if (!dados) return;
          const linhas = [['CHAVE','SIGLA','HORA INÍCIO','CARGA HORÁRIA','ENCERRAMENTO','STATUS']];
          dados.resumoOps.forEach(r => {
            const status = r.status === 'pendencia' ? 'PENDENTE' : r.status === 'sem_dados' ? 'SEM DADOS' : 'OK';
            const enc = r.encEsperado || '';
            linhas.push([r.op.chave, r.op.sigla || '', r.op.hora || '', r.op.cargaHoraria || '', enc, status]);
          });
          const tsv = linhas.map(l => l.join('\t')).join('\n');
          const btn = document.getElementById('mon-sa-btn-copiar');
          navigator.clipboard.writeText(tsv).then(() => {
            if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar Planilha'; }, 2000); }
          }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = tsv; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta);
            if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar Planilha'; }, 2000); }
          });
        };

        let html = '';
        if (totalFlag === 0) {
          html = '<div style="display:flex;align-items:center;gap:8px;color:var(--mon-green);font-size:13px;font-weight:600">✅ Nenhuma saída antecipada detectada nas operações do intervalo.</div>';
        } else {
          const colabsPorOp = {};
          resultados.forEach(r => {
            if (!colabsPorOp[r.chave]) colabsPorOp[r.chave] = [];
            colabsPorOp[r.chave].push(r);
          });

          html = `<div style="font-size:13px;font-weight:700;color:var(--mon-red);margin-bottom:10px">
            🚨 ${totalFlag} colaborador${totalFlag > 1 ? 'es saíram' : ' saiu'} mais de 50 min antes em ${opsComPend} operação${opsComPend > 1 ? 'ões' : ''}.
          </div><div style="display:flex;flex-direction:column;gap:6px">`;

          resumoOps.forEach(r => {
            const cor   = r.status === 'pendencia' ? 'var(--mon-red)' : r.status === 'sem_dados' ? 'var(--mon-text-faint)' : 'var(--mon-green)';
            const icone = r.status === 'pendencia' ? '⚠️' : r.status === 'sem_dados' ? '❓' : '✅';
            const labelBase = r.status === 'pendencia' ? `${r.qtd} saída${r.qtd > 1 ? 's' : ''} antecipada${r.qtd > 1 ? 's' : ''}` : r.status === 'sem_dados' ? 'sem dados' : 'OK';
            const labelPend = r.qtdPendente > 0 ? ` · ⏳ ${r.qtdPendente} ainda não saiu` : '';
            const label = labelBase + labelPend;

            // Encerramento esperado da op (disponível para OK e PENDENTE)
            const encEsperado = r.encEsperado || '';
            const encTag = encEsperado
              ? `<span style="font-family:var(--mon-mono);color:var(--mon-text-faint);font-size:10px;display:flex;align-items:center;gap:3px">
                  <span style="color:var(--mon-amber)">→</span> enc. <span style="color:var(--mon-text-dim);font-weight:600">${encEsperado}</span>
                </span>`
              : '';

            html += `<div style="border:1px solid var(--mon-border);border-radius:7px;overflow:hidden">
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;padding:6px 10px;background:var(--mon-surface2)">
                <span>${icone}</span>
                <span style="font-family:var(--mon-mono);color:var(--mon-amber);font-size:11px;min-width:40px">${r.op.hora || ''}</span>
                ${encTag}
                <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:11px;min-width:80px">${r.op.sigla || ''}</span>
                <span style="color:var(--mon-text-faint);font-size:10px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.op.chave}</span>
                <span style="color:${cor};font-weight:700;font-size:12px;white-space:nowrap">${label}</span>
              </div>`;

            const colabs = colabsPorOp[r.op.chave] || [];
            if (colabs.length > 0) {
              html += `<div style="padding:4px 0">`;
              colabs.forEach(c => {
                const partes = c.nome.split(' ');
                const primeiroNome = partes[0];
                const resto = partes.slice(1).join(' ');
                if (c.aindaNaoSaiu) {
                  // Ainda não registrou saída — exibe previsão mas sem horário real
                  html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 10px;font-size:11px;border-top:1px solid var(--mon-border)">
                    <span style="color:var(--mon-amber)">⏳</span>
                    <span style="font-weight:600;color:var(--mon-text);flex:1">${primeiroNome} <span style="font-weight:400;color:var(--mon-text-dim)">${resto}</span></span>
                    <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:10px">prev. ${c.encEsperado}</span>
                    <span style="font-family:var(--mon-mono);color:var(--mon-amber);font-weight:700;font-size:11px">ainda não saiu</span>
                  </div>`;
                } else {
                  html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 10px;font-size:11px;border-top:1px solid var(--mon-border)">
                    <span style="color:var(--mon-red)">↩</span>
                    <span style="font-weight:600;color:var(--mon-text);flex:1">${primeiroNome} <span style="font-weight:400;color:var(--mon-text-dim)">${resto}</span></span>
                    <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:10px">prev. ${c.encEsperado}</span>
                    <span style="font-family:var(--mon-mono);color:var(--mon-red);font-weight:700;font-size:11px">saiu ${c.terminoReal}</span>
                    <span style="background:rgba(239,68,68,.15);color:var(--mon-red);border-radius:4px;padding:1px 5px;font-size:10px;font-weight:700">-${c.antecipacao}min</span>
                  </div>`;
                }
              });
              html += `</div>`;
            }
            html += `</div>`;
          });
          html += '</div>';
        }

        if (res) { res.style.display = 'block'; res.innerHTML = html; }
      });
  };

  window._monExportarSaidas = function() {
    const dados = window._monSaResultados;
    if (!dados) return;

    const nomeArq = 'saidas_antecipadas_' + new Date().toISOString().slice(0,10) + '.xlsx';

    // ── Gerador de XLSX nativo via SpreadsheetML (suporta cores e formatação sem lib extra) ──
    function _gerarXlsx(abas) {
      const esc = v => String(v == null ? '' : v)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

      // Coleta todas as strings únicas para a shared strings table
      const allStrings = [];
      const strIdx = {};
      const getSI = s => {
        const k = String(s == null ? '' : s);
        if (strIdx[k] === undefined) { strIdx[k] = allStrings.length; allStrings.push(k); }
        return strIdx[k];
      };

      // Pré-carrega strings de todas as abas
      abas.forEach(aba => {
        aba.rows.forEach(row => row.forEach(cell => {
          if (typeof cell.v !== 'number') getSI(cell.v);
        }));
      });

      // Shared strings
      const sst = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${allStrings.length}" uniqueCount="${allStrings.length}">
${allStrings.map(s => `<si><t xml:space="preserve">${esc(s)}</t></si>`).join('')}
</sst>`;

      // Estilos — Verde Sóbrio
      // Fonts: 0=corpo(#1A2D24) 1=hdr(branco bold) 2=neg(#993C1D bold) 3=pos(#0F6E56 bold) 4=amber(#7A4F00 bold)
      // Fills: 0=none 1=gray125 2=titulo(#1A3326) 3=subhdr(#234235) 4=ok(#EAF8F0) 5=pendente(#FEF9E7) 6=negBg(#FFF0EE) 7=zebra(#F5FBF7)
      // Borders: 0=none 1=thin(#D1EAE0)
      // cellXfs — mesmos índices usados no código (s:1..s:11):
      //  0=normal  1=hdrAzul→verde  2=hdrVerm→verde  3=ok  4=okBold  5=pendente  6=pendenteBold
      //  7=dado  8=dadoZebra  9=fonteMono  10=negBold  11=negBoldZebra
      const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="11"/><name val="Calibri"/><color rgb="FF1A2D24"/></font>
    <font><sz val="11"/><b/><name val="Calibri"/><color rgb="FFFFFFFF"/></font>
    <font><sz val="11"/><b/><name val="Calibri"/><color rgb="FF993C1D"/></font>
    <font><sz val="11"/><b/><name val="Calibri"/><color rgb="FF0F6E56"/></font>
    <font><sz val="11"/><b/><name val="Calibri"/><color rgb="FF7A4F00"/></font>
  </fonts>
  <fills count="8">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1A3326"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF234235"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFEAF8F0"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEF9E7"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFF0EE"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF5FBF7"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD1EAE0"/></left><right style="thin"><color rgb="FFD1EAE0"/></right><top style="thin"><color rgb="FFD1EAE0"/></top><bottom style="thin"><color rgb="FFD1EAE0"/></bottom><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="12">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="4" fillId="5" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0"><alignment horizontal="left" vertical="center" indent="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="7" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
</styleSheet>`;

      const colLetter = i => String.fromCharCode(65 + i);

      // Gera cada aba
      const sheetXmls = abas.map(aba => {
        const colWidths = aba.widths ? aba.widths.map(w => `<col min="${aba.widths.indexOf(w)+1}" max="${aba.widths.indexOf(w)+1}" width="${w}" customWidth="1"/>`).join('') : '';
        const rowsXml = aba.rows.map((row, ri) => {
          const cells = row.map((cell, ci) => {
            const ref = colLetter(ci) + (ri + 1);
            const s = cell.s !== undefined ? ` s="${cell.s}"` : '';
            if (typeof cell.v === 'number') {
              return `<c r="${ref}"${s} t="n"><v>${cell.v}</v></c>`;
            } else {
              const si = getSI(cell.v);
              return `<c r="${ref}"${s} t="s"><v>${si}</v></c>`;
            }
          }).join('');
          return `<row r="${ri+1}">${cells}</row>`;
        }).join('');
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${colWidths}</cols>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
      });

      // Workbook
      const wbXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${abas.map((a,i) => `<sheet name="${esc(a.nome)}" sheetId="${i+1}" r:id="rId${i+2}"/>`).join('')}
  </sheets>
</workbook>`;

      const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId${abas.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
  ${abas.map((a,i) => `<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}
</Relationships>`;

      const pkgRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

      const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${abas.map((a,i) => `<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

      // Monta ZIP em memória (implementação mínima sem lib)
      function strToUint8(s) {
        const buf = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      function encodeUtf8(s) { return new TextEncoder().encode(s); }

      // CRC32
      const crcTable = (() => {
        const t = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
          let c = i;
          for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
          t[i] = c;
        }
        return t;
      })();
      function crc32(data) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < data.length; i++) c = crcTable[(c ^ data[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
      }

      // Zip entry
      function zipEntry(path, data) {
        const name = encodeUtf8(path);
        const crc  = crc32(data);
        const size = data.length;
        const lfh = new Uint8Array(30 + name.length);
        const view = new DataView(lfh.buffer);
        view.setUint32(0, 0x04034b50, true); // sig
        view.setUint16(4, 20, true);           // version needed
        view.setUint16(6, 0x800, true);        // flags (UTF-8)
        view.setUint16(8, 0, true);            // compression (stored)
        view.setUint16(10, 0, true);           // mod time
        view.setUint16(12, 0, true);           // mod date
        view.setUint32(14, crc, true);
        view.setUint32(18, size, true);
        view.setUint32(22, size, true);
        view.setUint16(26, name.length, true);
        view.setUint16(28, 0, true);
        lfh.set(name, 30);
        return { lfh, data, name, crc, size };
      }

      const files = [
        ['[Content_Types].xml', ct],
        ['_rels/.rels', pkgRels],
        ['xl/workbook.xml', wbXml],
        ['xl/_rels/workbook.xml.rels', wbRels],
        ['xl/styles.xml', styles],
        ['xl/sharedStrings.xml', sst],
        ...abas.map((a, i) => [`xl/worksheets/sheet${i+1}.xml`, sheetXmls[i]])
      ].map(([p, s]) => zipEntry(p, encodeUtf8(s)));

      // Central directory + EOCD
      let offset = 0;
      const cds = files.map(f => {
        const name = f.name;
        const cd = new Uint8Array(46 + name.length);
        const v = new DataView(cd.buffer);
        v.setUint32(0, 0x02014b50, true);
        v.setUint16(4, 20, true); v.setUint16(6, 20, true);
        v.setUint16(8, 0x800, true);
        v.setUint16(10, 0, true); v.setUint16(12, 0, true); v.setUint16(14, 0, true);
        v.setUint32(16, f.crc, true);
        v.setUint32(20, f.size, true); v.setUint32(24, f.size, true);
        v.setUint16(28, name.length, true);
        v.setUint16(30, 0, true); v.setUint16(32, 0, true);
        v.setUint16(34, 0, true); v.setUint16(36, 0, true);
        v.setUint32(38, 0, true); v.setUint32(42, offset, true);
        cd.set(name, 46);
        offset += 30 + name.length + f.size;
        return cd;
      });

      const cdSize = cds.reduce((a, c) => a + c.length, 0);
      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
      ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
      ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true);
      ev.setUint16(20, 0, true);

      const parts = [...files.flatMap(f => [f.lfh, f.data]), ...cds, eocd];
      const total = parts.reduce((a, p) => a + p.length, 0);
      const zip = new Uint8Array(total);
      let pos = 0;
      parts.forEach(p => { zip.set(p, pos); pos += p.length; });

      const blob = new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = nomeArq; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    // ── Monta os dados das abas ──

    // Estilos: 1=cabeçalho azul, 2=cabeçalho vermelho, 3=ok verde, 4=ok verde bold,
    //          5=pendente amarelo, 6=pendente amarelo bold, 7=dado normal, 8=dado zebra,
    //          10=vermelho bold centro, 11=vermelho bold centro zebra

    // Aba 1 — Resumo por Operação (igual à planilha da imagem)
    const colsResumo = ['CHAVE','SIGLA','HORA INÍCIO','CARGA HORÁRIA','ENCERRAMENTO','STATUS'];
    const rowsResumo = dados.resumoOps.map(r => {
      const enc    = r.encEsperado || '';
      const status = r.status === 'pendencia' ? 'PENDENTE' : r.status === 'sem_dados' ? 'SEM DADOS' : 'OK';
      return [r.op.chave, r.op.sigla || '', r.op.hora || '', r.op.cargaHoraria || '', enc, status];
    });

    const abaResumo = {
      nome: 'Resumo por Operação',
      widths: [34, 10, 12, 14, 14, 12],
      rows: [
        colsResumo.map(v => ({ v, s: 1 })),   // cabeçalho azul
        ...rowsResumo.map(r => {
          const st = r[5];
          const sBase = st === 'OK' ? 3 : st === 'PENDENTE' ? 5 : 7;
          const sBold = st === 'OK' ? 4 : st === 'PENDENTE' ? 6 : 7;
          return r.map((v, ci) => ({ v, s: ci === 5 ? sBold : sBase }));
        })
      ]
    };

    // Aba 2 — Colaboradores detalhados
    const colsColab = ['Operação','Sigla','Hora Início','Carga','Nome','CPF','Entrada','Saída Real','Enc. Esperado','Antecipação (min)'];
    const rowsColab = dados.resultados.map(r => [r.chave, r.sigla, r.horaOp, r.carga, r.nome, r.cpf, r.inicio, r.terminoReal, r.encEsperado, r.antecipacao]);

    const abaColab = {
      nome: 'Colaboradores',
      widths: [30, 10, 12, 12, 32, 16, 12, 12, 16, 16],
      rows: [
        colsColab.map(v => ({ v, s: 2 })),   // cabeçalho vermelho
        ...rowsColab.map((r, i) => {
          const zebra = i % 2 === 0;
          return r.map((v, ci) => ({
            v,
            s: ci === 7 ? (zebra ? 10 : 11)      // saída real — vermelho bold
             : ci === 9 ? (zebra ? 10 : 11)       // antecipação — vermelho bold
             : zebra ? 8 : 7                       // zebra normal
          }));
        })
      ]
    };

    _gerarXlsx([abaResumo, abaColab]);
  };

    // ── FIM MÓDULO SAÍDA ANTECIPADA ──────────────────────────────────────────────

  // ── MÓDULO: HORA EXTRA ───────────────────────────────────────────────────────

  // Retorna minutos de hora extra (positivo = saiu DEPOIS do esperado)
  function _heHoraExtraMin(encMin, terminoMin) {
    if (encMin < 0 || terminoMin < 0) return null;
    let diff = terminoMin - encMin;
    if (diff >  840) diff -= 1440;
    if (diff < -840) diff += 1440;
    return diff;
  }

  window._monHePreview = function() {
    const iniEl = document.getElementById('mon-he-hora-ini');
    const fimEl = document.getElementById('mon-he-hora-fim');
    const prev  = document.getElementById('mon-he-preview');
    if (!iniEl || !fimEl || !prev) return;

    const minIni = _saHoraParaMin(iniEl.value);
    const minFim = _saHoraParaMin(fimEl.value);
    const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => o.id && o.hora);

    const filtradas = ops.filter(o => {
      const h = _saHoraParaMin(o.hora);
      if (h < 0) return false;
      if (minIni <= minFim) return h >= minIni && h <= minFim;
      return h >= minIni || h <= minFim;
    });

    if (filtradas.length === 0) {
      prev.innerHTML = '<div style="font-size:12px;color:var(--mon-amber);">⚠️ Nenhuma operação nesse intervalo de horário.</div>';
      return;
    }

    const chips = filtradas.map(o =>
      `<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:99px;background:var(--mon-surface2);border:1px solid var(--mon-border);font-size:11px;font-family:var(--mon-mono)">
        <span style="color:var(--mon-amber)">${o.hora}</span>
        <span style="color:var(--mon-text-dim)">${o.sigla || o.chave}</span>
      </span>`
    ).join(' ');

    prev.innerHTML = `
      <div style="font-size:11px;color:var(--mon-green);font-weight:600;margin-bottom:6px">✓ ${filtradas.length} operação${filtradas.length > 1 ? 'ões' : ''} no intervalo</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">${chips}</div>`;
  };

  window._monVerificarHoraExtra = function() {
    const iniEl = document.getElementById('mon-he-hora-ini');
    const fimEl = document.getElementById('mon-he-hora-fim');
    if (!iniEl || !fimEl) return;

    const minIni = _saHoraParaMin(iniEl.value);
    const minFim = _saHoraParaMin(fimEl.value);

    const ops = (typeof operations !== 'undefined' ? operations : []).filter(o => {
      if (!o.id || !o.hora) return false;
      const h = _saHoraParaMin(o.hora);
      if (h < 0) return false;
      if (minIni <= minFim) return h >= minIni && h <= minFim;
      return h >= minIni || h <= minFim;
    });

    const res = document.getElementById('mon-he-resultado');
    if (ops.length === 0) {
      if (res) { res.style.display = 'block'; res.innerHTML = '<div style="color:var(--mon-amber);font-size:13px">⚠️ Nenhuma operação encontrada nesse intervalo de horário.</div>'; }
      return;
    }

    if (res) {
      res.style.display = 'block';
      res.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mon-text-faint)"><div class="mon-loading-spinner" style="width:14px;height:14px;border-width:2px"></div>Buscando apontamentos das ' + ops.length + ' operações…</div>';
    }
    const btnExcel = document.getElementById('mon-he-btn-excel');
    if (btnExcel) btnExcel.style.display = 'none';

    const LIMITE_MIN = 50;
    const LOTE = 5;

    const _fetchEmLotesHe = async (lista) => {
      const resultado = [];
      for (let i = 0; i < lista.length; i += LOTE) {
        const lote = lista.slice(i, i + LOTE);
        const parcial = await Promise.all(lote.map(op => _saFetchColabs(op).then(colabs => ({ op, colabs }))));
        resultado.push(...parcial);
        if (res) {
          const prog = Math.min(i + LOTE, lista.length);
          res.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mon-text-faint)"><div class="mon-loading-spinner" style="width:14px;height:14px;border-width:2px"></div>Buscando… ' + prog + '/' + lista.length + ' operações</div>';
        }
      }
      return resultado;
    };

    _fetchEmLotesHe(ops).then(resultadosOps => {
      const resultados = [];
      const resumoOps  = [];

      resultadosOps.forEach(({ op, colabs }) => {
        if (!colabs || colabs.length === 0) {
          resumoOps.push({ op, status: 'sem_dados', qtd: 0, encEsperado: '' });
          return;
        }

        let qtdFlag = 0;
        const opIniMin = _saHoraParaMin(op.hora);
        let encEsperadoOp = '';

        colabs.forEach(c => {
          if (!c.carga || opIniMin < 0) return;
          const duracaoMin = _saCargaParaMin(c.carga);
          if (duracaoMin < 0) return;

          const encMin = (opIniMin + duracaoMin) % 1440;
          const encStr = ('0' + Math.floor(encMin / 60)).slice(-2) + ':' + ('0' + (encMin % 60)).slice(-2);
          if (!encEsperadoOp) encEsperadoOp = encStr;

          // Sem saída registrada → ainda trabalhando, não classifica como hora extra
          if (!c.termino) return;

          const terminoMin = _saHoraParaMin(c.termino);
          const horaExtra  = _heHoraExtraMin(encMin, terminoMin);
          console.log(`[HE]   ${c.nome} → encEsperado=${encStr} terminoReal=${c.termino} horaExtra=${horaExtra}min ${horaExtra >= LIMITE_MIN ? '🚨 FLAG' : '✅ ok'}`);

          if (horaExtra === null || horaExtra < LIMITE_MIN) return;
          qtdFlag++;
          resultados.push({
            chave: op.chave, sigla: op.sigla || '', horaOp: op.hora || '',
            nome: c.nome, cpf: c.cpf, carga: c.carga,
            inicio: op.hora, terminoReal: c.termino,
            encEsperado: encStr, horaExtra,
            editUrl: c.editUrl || ''
          });
        });

        resumoOps.push({ op, status: qtdFlag > 0 ? 'pendencia' : 'ok', qtd: qtdFlag, encEsperado: encEsperadoOp });
      });

      window._monHeResultados = { resultados, resumoOps };

      const totalFlag  = resultados.length;
      const opsComPend = resumoOps.filter(r => r.status === 'pendencia').length;
      if (btnExcel) btnExcel.style.display = totalFlag > 0 ? 'inline-flex' : 'none';
      const btnCopiar = document.getElementById('mon-he-btn-copiar');
      if (btnCopiar) btnCopiar.style.display = totalFlag > 0 ? 'inline-flex' : 'none';
      const btnAtribuir = document.getElementById('mon-he-btn-atribuir');
      if (btnAtribuir) btnAtribuir.style.display = totalFlag > 0 ? 'inline-flex' : 'none';

      window._monHeCopiarPlanilha = function() {
        const dados = window._monHeResultados;
        if (!dados) return;
        const linhas = [['CHAVE','SIGLA','HORA INÍCIO','CARGA HORÁRIA','ENC. PREVISTO','SAÍDA REAL','H.E. (min)']];
        dados.resultados.forEach(r => {
          linhas.push([r.chave, r.sigla, r.horaOp, r.carga, r.encEsperado, r.terminoReal, r.horaExtra]);
        });
        const tsv = linhas.map(l => l.join('\t')).join('\n');
        const btn = document.getElementById('mon-he-btn-copiar');
        navigator.clipboard.writeText(tsv).then(() => {
          if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar Planilha'; }, 2000); }
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = tsv; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
          if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar Planilha'; }, 2000); }
        });
      };

      let html = '';
      if (totalFlag === 0) {
        html = '<div style="display:flex;align-items:center;gap:8px;color:var(--mon-green);font-size:13px;font-weight:600">✅ Nenhuma hora extra detectada nas operações do intervalo.</div>';
      } else {
        const colabsPorOp = {};
        resultados.forEach(r => {
          if (!colabsPorOp[r.chave]) colabsPorOp[r.chave] = [];
          colabsPorOp[r.chave].push(r);
        });

        html = `<div style="font-size:13px;font-weight:700;color:var(--mon-amber);margin-bottom:10px">
          ⏱️ ${totalFlag} colaborador${totalFlag > 1 ? 'es ficaram' : ' ficou'} mais de 50 min além do previsto em ${opsComPend} operação${opsComPend > 1 ? 'ões' : ''}.
        </div><div style="display:flex;flex-direction:column;gap:6px">`;

        resumoOps.forEach(r => {
          const cor   = r.status === 'pendencia' ? 'var(--mon-amber)' : r.status === 'sem_dados' ? 'var(--mon-text-faint)' : 'var(--mon-green)';
          const icone = r.status === 'pendencia' ? '⏱️' : r.status === 'sem_dados' ? '❓' : '✅';
          const label = r.status === 'pendencia' ? `${r.qtd} hora${r.qtd > 1 ? 's extras' : ' extra'}` : r.status === 'sem_dados' ? 'sem dados' : 'OK';

          const encTag = r.encEsperado
            ? `<span style="font-family:var(--mon-mono);color:var(--mon-text-faint);font-size:10px;display:flex;align-items:center;gap:3px">
                <span style="color:var(--mon-amber)">→</span> enc. <span style="color:var(--mon-text-dim);font-weight:600">${r.encEsperado}</span>
              </span>`
            : '';

          html += `<div style="border:1px solid var(--mon-border);border-radius:7px;overflow:hidden">
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;padding:6px 10px;background:var(--mon-surface2)">
              <span>${icone}</span>
              <span style="font-family:var(--mon-mono);color:var(--mon-amber);font-size:11px;min-width:40px">${r.op.hora || ''}</span>
              ${encTag}
              <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:11px;min-width:80px">${r.op.sigla || ''}</span>
              <span style="color:var(--mon-text-faint);font-size:10px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.op.chave}</span>
              <span style="color:${cor};font-weight:700;font-size:12px;white-space:nowrap">${label}</span>
            </div>`;

          const colabs = colabsPorOp[r.op.chave] || [];
          if (colabs.length > 0) {
            html += `<div style="padding:4px 0">`;
            colabs.forEach(c => {
              const partes = c.nome.split(' ');
              const primeiroNome = partes[0];
              const resto = partes.slice(1).join(' ');
              html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 10px;font-size:11px;border-top:1px solid var(--mon-border)">
                <span style="color:var(--mon-amber)">↪</span>
                <span style="font-weight:600;color:var(--mon-text);flex:1">${primeiroNome} <span style="font-weight:400;color:var(--mon-text-dim)">${resto}</span></span>
                <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:10px">prev. ${c.encEsperado}</span>
                <span style="font-family:var(--mon-mono);color:var(--mon-amber);font-weight:700;font-size:11px">saiu ${c.terminoReal}</span>
                <span style="background:rgba(245,158,11,.15);color:var(--mon-amber);border-radius:4px;padding:1px 5px;font-size:10px;font-weight:700">+${c.horaExtra}min</span>
              </div>`;
            });
            html += `</div>`;
          }
          html += `</div>`;
        });
        html += '</div>';
      }

      if (res) { res.style.display = 'block'; res.innerHTML = html; }
    });
  };

  window._monExportarHoraExtra = function() {
    const dados = window._monHeResultados;
    if (!dados) return;

    const nomeArq = 'horas_extras_' + new Date().toISOString().slice(0,10) + '.xlsx';

    function _gerarXlsxHe(abas) {
      const esc = v => String(v == null ? '' : v)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const cell = (v, s) => `<Cell ss:StyleID="s${s}"><Data ss:Type="String">${esc(v)}</Data></Cell>`;
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:x="urn:schemas-microsoft-com:office:excel">
<Styles>
  <Style ss:ID="s1"><Font ss:Bold="1"/><Interior ss:Color="#1e293b" ss:Pattern="Solid"/><Font ss:Color="#f8fafc" ss:Bold="1"/></Style>
  <Style ss:ID="s2"><Interior ss:Color="#f8fafc" ss:Pattern="Solid"/></Style>
  <Style ss:ID="s3"><Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/></Style>
  <Style ss:ID="s10"><Font ss:Bold="1" ss:Color="#b45309"/><Interior ss:Color="#f8fafc" ss:Pattern="Solid"/></Style>
  <Style ss:ID="s11"><Font ss:Bold="1" ss:Color="#b45309"/><Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/></Style>
</Styles>
${abas.map(aba => `<Worksheet ss:Name="${esc(aba.nome)}"><Table>
${aba.cabecalho.map(c => `<Row>${c.map(v => cell(v, 1)).join('')}</Row>`).join('')}
${aba.linhas.map((l, i) => `<Row>${l.map((v, ci) => cell(v, aba.estilos ? aba.estilos(i, ci) : (i%2===0?2:3))).join('')}</Row>`).join('')}
</Table></Worksheet>`).join('')}
</Workbook>`;
      const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nomeArq;
      a.click();
    }

    const abaColab = {
      nome: 'Horas Extras',
      cabecalho: [['CHAVE','SIGLA','HORA INÍCIO','CARGA HORÁRIA','ENC. PREVISTO','SAÍDA REAL','H.E. (min)']],
      linhas: dados.resultados.map(r => [r.chave, r.sigla, r.horaOp, r.carga, r.encEsperado, r.terminoReal, r.horaExtra]),
      estilos: (ri, ci) => (ci === 5 || ci === 6) ? (ri%2===0 ? 10 : 11) : (ri%2===0 ? 2 : 3)
    };
    const abaResumo = {
      nome: 'Resumo por Op',
      cabecalho: [['CHAVE','SIGLA','HORA INÍCIO','ENC. PREVISTO','QTD H.E.']],
      linhas: dados.resumoOps.map(r => [r.op.chave, r.op.sigla||'', r.op.hora||'', r.encEsperado||'', r.qtd])
    };

    _gerarXlsxHe([abaColab, abaResumo]);
  };

  // ── ATRIBUIÇÃO EM MASSA DE HE ────────────────────────────────────────────────

  // Arredonda para HE: < 50min = 0, >= 50min = arredonda para cima (hora cheia)
  function _heArredondar(minutos) {
    if (minutos < 50) return 0;
    return Math.ceil(minutos / 60);
  }

  window._monHeAbrirAtribuicao = function() {
    const dados = window._monHeResultados;
    if (!dados || !dados.resultados.length) return;

    const comUrl = dados.resultados.filter(r => r.editUrl);
    const semUrl = dados.resultados.filter(r => !r.editUrl);

    let modal = document.getElementById('mon-he-attr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mon-he-attr-modal';
      modal.style.cssText = 'position:fixed;inset:0;z-index:99999970;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);padding:16px';
      document.body.appendChild(modal);
    }

    const COLW = '16px 1fr 90px 70px 70px 70px 70px 90px';

    const headerRow = `<div style="display:grid;grid-template-columns:${COLW};gap:10px;align-items:center;padding:8px 14px;font-size:10.5px;font-weight:700;color:var(--mon-text-faint);text-transform:uppercase;letter-spacing:.04em;background:var(--mon-surface2);border-bottom:1px solid var(--mon-border);position:sticky;top:0;z-index:1">
      <span></span>
      <span>Colaborador</span>
      <span>Chave</span>
      <span>Início</span>
      <span>Enc. prev.</span>
      <span>Saída real</span>
      <span>H.E. detect.</span>
      <span>H.E. a atribuir</span>
    </div>`;

    const rows = comUrl.map((r, i) => {
      const he = _heArredondar(r.horaExtra);
      const zebra = i % 2 === 0 ? 'var(--mon-surface,transparent)' : 'var(--mon-surface2,rgba(0,0,0,0.015))';
      return `<div style="display:grid;grid-template-columns:${COLW};gap:10px;align-items:center;padding:7px 14px;border-bottom:1px solid var(--mon-border);font-size:12px;background:${zebra}" id="mon-he-attr-row-${i}">
        <input type="checkbox" id="mon-he-chk-${i}" checked style="width:15px;height:15px;cursor:pointer;accent-color:var(--mon-purple,#a855f7)">
        <label for="mon-he-chk-${i}" style="cursor:pointer;color:var(--mon-text);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.nome}">${r.nome}</label>
        <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.chave || ''}">${r.chave || '—'}</span>
        <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:11px">${r.horaOp || r.inicio || '—'}</span>
        <span style="font-family:var(--mon-mono);color:var(--mon-text-dim);font-size:11px">${r.encEsperado || '—'}</span>
        <span style="font-family:var(--mon-mono);color:var(--mon-amber);font-weight:700;font-size:11px">${r.terminoReal || '—'}</span>
        <span style="font-family:var(--mon-mono);color:var(--mon-text-faint);font-size:10.5px">+${r.horaExtra}min</span>
        <span style="display:flex;align-items:center;gap:5px">
          <input type="number" id="mon-he-val-${i}" value="${he}" min="0" max="24" step="1"
            style="width:50px;padding:4px 6px;border-radius:5px;border:1px solid var(--mon-border2);background:var(--mon-surface2);color:var(--mon-text);font-size:13px;font-family:var(--mon-mono);font-weight:700;text-align:center">
          <span style="font-size:11px;color:var(--mon-text-faint)">h</span>
        </span>
      </div>`;
    }).join('');

    const avisoSemUrl = semUrl.length > 0
      ? `<div style="padding:10px 14px;font-size:11.5px;color:var(--mon-amber);background:rgba(245,158,11,.08);border-top:1px solid var(--mon-border)">
          ⚠️ ${semUrl.length} colaborador(es) sem link de apontamento identificado não serão atribuídos: ${semUrl.map(r => r.nome.split(' ')[0]).join(', ')}
        </div>`
      : '';

    modal.innerHTML = `
      <div style="background:var(--mon-bg);border-radius:14px;width:min(960px,98vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.5);border:1px solid var(--mon-border)">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--mon-border);flex-shrink:0">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--mon-text)">⚡ Atribuir H. Extra em Massa</div>
            <div style="font-size:11.5px;color:var(--mon-text-faint);margin-top:2px">${comUrl.length} colaborador(es) com apontamento identificado</div>
          </div>
          <button onclick="document.getElementById('mon-he-attr-modal').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--mon-text-faint);padding:4px 8px;border-radius:4px">✕</button>
        </div>

        <div style="padding:9px 22px;border-bottom:1px solid var(--mon-border);display:flex;gap:8px;align-items:center;flex-shrink:0">
          <span style="font-size:11.5px;color:var(--mon-text-faint)">Regra: 50min ou mais = 1h (arredonda para cima). Edite individualmente se necessário.</span>
          <button onclick="document.querySelectorAll('[id^=mon-he-chk-]').forEach(function(c){c.checked=true})" style="margin-left:auto;padding:4px 12px;border-radius:5px;border:1px solid var(--mon-border);background:none;font-size:11.5px;cursor:pointer;color:var(--mon-text-dim)">Todos</button>
          <button onclick="document.querySelectorAll('[id^=mon-he-chk-]').forEach(function(c){c.checked=false})" style="padding:4px 12px;border-radius:5px;border:1px solid var(--mon-border);background:none;font-size:11.5px;cursor:pointer;color:var(--mon-text-dim)">Nenhum</button>
        </div>

        <div style="overflow-y:auto;flex:1;min-height:0">
          ${headerRow}
          ${rows}
          ${avisoSemUrl}
        </div>

        <div id="mon-he-attr-progress" style="display:none;padding:10px 22px;font-size:12px;color:var(--mon-text-faint);border-top:1px solid var(--mon-border);flex-shrink:0"></div>

        <div style="padding:16px 22px;display:flex;align-items:center;gap:10px;border-top:1px solid var(--mon-border);flex-shrink:0">
          <button id="mon-he-attr-btn-conf" onclick="window._monHeAtribuirEmMassa()"
            style="padding:10px 24px;border-radius:8px;border:none;cursor:pointer;font-size:13.5px;font-weight:700;background:var(--mon-purple,#a855f7);color:#fff"
            onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            Confirmar e Gravar
          </button>
          <button onclick="document.getElementById('mon-he-attr-modal').style.display='none'"
            style="padding:10px 18px;border-radius:8px;border:1px solid var(--mon-border);cursor:pointer;font-size:13.5px;background:none;color:var(--mon-text-faint)">
            Cancelar
          </button>
        </div>
      </div>`;

    modal.style.display = 'flex';
    window._monHeAttrColabs = comUrl;
  };


  window._monHeAtribuirEmMassa = async function() {
    const colabs   = window._monHeAttrColabs || [];
    const progress = document.getElementById('mon-he-attr-progress');
    const btnConf  = document.getElementById('mon-he-attr-btn-conf');
    if (btnConf) { btnConf.disabled = true; btnConf.style.opacity = '0.5'; btnConf.textContent = 'Gravando...'; }
    if (progress) progress.style.display = 'block';

    let ok = 0, err = 0, skip = 0;

    for (let i = 0; i < colabs.length; i++) {
      const chk = document.getElementById('mon-he-chk-' + i);
      if (!chk || !chk.checked) { skip++; continue; }

      const valEl = document.getElementById('mon-he-val-' + i);
      const he    = valEl ? (parseFloat(String(valEl.value).replace(',','.')) || 0) : 0;
      const c     = colabs[i];

      if (progress) progress.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<div class="mon-loading-spinner" style="width:12px;height:12px;border-width:2px"></div>' +
        'Gravando ' + (i + 1 - skip) + '/' + (colabs.length - skip) + ' \u2014 ' + c.nome.split(' ')[0] + '...</div>';

      try {
        // 1. Busca o formulario
        const doc = await fetchDoc('https://tsi-app.com/' + c.editUrl);
        const form = doc.querySelector('form');
        if (!form) throw new Error('form nao encontrado');

        // 2. Coleta todos os campos do form (ignora disabled, como um submit real faria)
        const body = new URLSearchParams();
        form.querySelectorAll('input,select,textarea').forEach(function(el) {
          if (!el.name || el.disabled) return;
          if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.checked) body.append(el.name, el.value);
          } else {
            body.append(el.name, el.value);
          }
        });

        // 2b. Inclui o botão de submit (ex: submitF) — um clique real no botão
        // "Gravar" envia name=value desse botão junto; sem ele o backend pode
        // não reconhecer a submissão como válida e ignorar a gravação.
        const btnSubmit = form.querySelector('button[type="submit"][name]:not([disabled])');
        if (btnSubmit && btnSubmit.name) body.append(btnSubmit.name, btnSubmit.value || '');

        // 3. Sobrescreve o campo HE com o valor escolhido
        // qtdHE é <input type="number"> (HTML5) — exige ponto decimal, NUNCA vírgula.
        // Enviar com vírgula faz o backend rejeitar/ignorar o valor silenciosamente.
        body.set('qtdHE', he.toFixed(2));

        // 4. POST para o action do form
        var action = form.getAttribute('action') || c.editUrl;
        var fullAction = action.startsWith('http') ? action : 'https://tsi-app.com/' + action.replace(/^\//, '');
        var resp = await fetch(fullAction, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });

        if (!resp.ok) throw new Error('HTTP ' + resp.status);

        // 5. Confere se o valor realmente foi gravado, reabrindo a página de edição
        const docCheck = await fetchDoc(fullAction);
        const campoCheck = docCheck.querySelector('#qtdHE, [name="qtdHE"]');
        const valorGravado = campoCheck ? parseFloat(String(campoCheck.value).replace(',','.')) : null;
        if (valorGravado === null || Math.abs(valorGravado - he) > 0.01) {
          throw new Error('valor não confirmado no servidor (esperado ' + he + ', encontrado ' + valorGravado + ')');
        }

        ok++;

        var row = document.getElementById('mon-he-attr-row-' + i);
        if (row) row.style.background = 'rgba(22,163,74,0.08)';

      } catch(e) {
        err++;
        console.error('[HE] erro ao gravar', c.nome, e);
        var row = document.getElementById('mon-he-attr-row-' + i);
        if (row) row.style.background = 'rgba(239,68,68,0.08)';
      }

      // Pausa entre requests
      if (i < colabs.length - 1) await new Promise(function(r) { setTimeout(r, 400); });
    }

    if (progress) {
      var partes = [];
      if (ok)   partes.push('<span style="color:var(--mon-green)">OK: ' + ok + ' gravado(s)</span>');
      if (err)  partes.push('<span style="color:var(--mon-red)">Erro: ' + err + '</span>');
      if (skip) partes.push('<span style="color:var(--mon-text-faint)">Pulados: ' + skip + '</span>');
      progress.innerHTML = partes.join(' &nbsp;&middot;&nbsp; ');
    }
    if (btnConf) { btnConf.disabled = false; btnConf.style.opacity = '1'; btnConf.textContent = 'Confirmar e Gravar'; }
  };

  // ── FIM MÓDULO HORA EXTRA ────────────────────────────────────────────────────

})();
