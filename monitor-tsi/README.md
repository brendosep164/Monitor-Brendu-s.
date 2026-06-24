# Monitor Operacional TSI

Monitor de apontamentos em tempo real para o TSI App — refatorado de 1 arquivo com 11.804 linhas para 26 arquivos organizados por responsabilidade.

---

## Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Build (gera o `.user.js` para o Tampermonkey)
```bash
npm run build
# → dist/monitor-tsi.user.js
```

### 3. Desenvolvimento (recompila ao salvar)
```bash
npm run dev
```

Instale o arquivo `dist/monitor-tsi.user.js` no Tampermonkey normalmente.

---

## Estrutura do projeto

```
src/
├── index.js                 ← Ponto de entrada — só inicialização
├── config.js                ← Todas as constantes e credenciais (único lugar!)
├── state.js                 ← Estado global centralizado
│
├── services/                ← Comunicação com APIs externas
│   ├── supabase.js          ← Leitura/escrita no Supabase (sbGet, sbSet)
│   ├── jsonbin.js           ← Contatos e líderes via JSONBin
│   └── fetch.js             ← Busca de páginas do TSI App + fila de concorrência
│
├── modules/                 ← Lógica de negócio
│   ├── operacoes.js         ← Parse do DOM, janela de monitoramento, isConcluida
│   ├── notificacoes.js      ← Notificações do browser (apt, escala, mudança)
│   ├── snapshot.js          ← Snapshot de escalados — bolinhas vermelhas (Supabase)
│   ├── historico.js         ← Histórico de reports (Supabase)
│   ├── faltas.js            ← Registro e relatório de faltas (Supabase)
│   ├── obs.js               ← Observações por operação — balão 💬 (Supabase)
│   ├── escala.js            ← Envio de escala via iframe
│   ├── report.js            ← Envio de report via iframe
│   ├── whatsapp.js          ← Geração de mensagens WhatsApp
│   ├── pdf.js               ← Download e merge de PDFs de assinatura
│   ├── gmail.js             ← E-mail de escala via Gmail
│   ├── fetchOperations.js   ← Polling de operações, paginação, navegação SPA
│   └── timer.js             ← Polling alinhado ao minuto fechado
│
├── ui/                      ← Interface do usuário
│   ├── panel.js             ← Painel principal + CSS variables + estilos base
│   ├── render.js            ← Tabela de operações (reconciliação sem flicker)
│   ├── filtros.js           ← Chips de filtro, sort, colapso de grupos
│   ├── toast.js             ← Mensagens flutuantes (success, error, obs)
│   ├── metricas.js          ← Contadores do rodapé
│   └── progress.js          ← Anel de progresso circular no avatar
│
└── utils/
    └── formatters.js        ← Funções puras: datas, horas, nomes, padding

dist/
└── monitor-tsi.user.js      ← Arquivo final gerado (instalar no Tampermonkey)

build.js                     ← Script de build com esbuild
package.json
```

---

## O que mudou vs. o arquivo original

| Antes | Depois |
|-------|--------|
| 1 arquivo, 11.804 linhas | 26 arquivos, ~150 linhas cada em média |
| Credenciais em 3 lugares diferentes | Tudo em `config.js` |
| Estado solto em ~30 variáveis globais | Centralizado em `state.js` com setters explícitos |
| Supabase chamado de qualquer lugar | Isolado em `services/supabase.js` |
| JSONBin duplicado com nomes diferentes | Unificado em `services/jsonbin.js` |
| `require()` e módulos misturados | ES Modules puros com `import/export` |
| Dependências circulares implícitas | Circulares resolvidas via `window.*` ou dynamic import |
| Sem build | `npm run build` via esbuild gera o `.user.js` final |

---

## Decisões de arquitetura

**Dependências circulares** foram resolvidas de duas formas:
- `render.js`, `fetchOperations.js` e outros expõem funções via `window._monXxx` para módulos que precisam delas sem criar ciclo
- Módulos que precisam importar dinamicamente (ex: `timer.js` chamando `fetchOperations`) usam `await import(...)`

**State centralizado**: o `state.js` não importa nenhum módulo de negócio — apenas `config.js`. Isso evita o ciclo `state → notificacoes → state` que existia antes.

**Serviços vs. Módulos**: a pasta `services/` contém apenas comunicação de rede (sem lógica de negócio). A pasta `modules/` contém lógica de negócio que usa os serviços.

---

## Segurança

As credenciais em `config.js` ainda ficam visíveis no código-fonte do GitHub. Para melhorar:

1. Criar uma API própria (Cloudflare Worker, Vercel Function, etc.)
2. O userscript chama a sua API, que chama o Supabase
3. As credenciais ficam só no servidor

---

## Regra de ouro para manutenção

Cada arquivo responde a uma pergunta em uma frase:
- **Onde mudo a URL do Supabase?** → `config.js`
- **Onde fica a lógica de faltas?** → `modules/faltas.js`
- **Onde fica o CSS do painel?** → `ui/panel.js`
- **Onde fica a lógica de notificação?** → `modules/notificacoes.js`
