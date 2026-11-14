---
type: Research Note
generated: { by: claude-code/fable-5-2, at: 2026-11-14T00:00:00Z }
title: "Plataforma de publicação e formatos candidatos para a apresentação do Biodiversidade.Online"
description: "Levantamento do web root web.dalc.in (nginx/PHP atrás de Cloudflare), padrões das pastas interativas existentes, 4 formatos candidatos para uma apresentação dinâmica e as restrições técnicas do implementador."
date: 2026-11-14
tags: [divulgacao, apresentacao, web.dalc.in, nginx, cloudflare, scrollytelling, pwa, mermaid]
---

# Plataforma e formatos candidatos

> **Escopo.** Só pesquisa: nada foi criado, alterado ou apagado em `S:/appsdata/web.dalc.in/` (acesso somente leitura). Uma única exceção de rede: `HEAD` em 4 URLs públicas de `https://web.dalc.in/faunabr/` para ver cabeçalhos reais.
> **Convenção de fontes.** `WEB:` = caminho sob `S:/appsdata/web.dalc.in/`. `CONF:` = `S:/appsdata/web-conf/nginx-site.conf`. `SEG:` = `WEB:seguranca/PLANO-EXECUCAO-202608.md` ou `RELATORIO-SEGURANCA-202608.md`. Afirmações não verificadas estão marcadas `[INFERÊNCIA]`.
> **Vocabulário.** Termos do projeto conforme `CONTEXT.md` (Fonte IPT, Harmonização, Execução, Tabela de extensão).

---

## 1. Como o web root funciona

### 1.1 Resumo executivo

| Pergunta | Resposta | Fonte |
|---|---|---|
| Como uma subpasta é servida? | Qualquer pasta sob o root vira `https://web.dalc.in/<pasta>/`. `index.html`/`index.php` é o índice. Não há roteamento, nem build, nem deploy separado. | `CONF:` bloco `server` default (`root /var/www/html; index index.php index.html index.htm; try_files $uri $uri/ /index.php?$args;`); SEG linha 97 |
| URL pública | `https://web.dalc.in/<pasta>/…` | SEG linha 99 ("URL pública `https://web.dalc.in`"); resposta `200` observada em `https://web.dalc.in/faunabr/` |
| Quem serve | Container `nginx-Php8` (imagem `tangramor/nginx-php8-fpm`, PHP 8.5.7, nginx 1.31.1), com um único bind-mount `/mnt/user/Storage/appsdata/web.dalc.in` → `/var/www/html` (rw). | SEG linhas 95-97 |
| Exposição | Só pelo container `CloudflaredTunnel` (outbound-only). Todo tráfego passa pelo Cloudflare (WAF, HSTS, Access, cache de borda). | SEG linha 100 |
| Deploy | **A pasta é o site ao vivo.** Escrever os arquivos em `S:/appsdata/web.dalc.in/<pasta>/` (share Windows do Unraid) publica na hora. Não há CI, nem `git pull` no servidor. | bind-mount acima; ausência de qualquer script de deploy no web root (`ls`); `[INFERÊNCIA]` quanto a "nenhum processo externo": nenhum foi encontrado |
| `git` dentro do web root | Os repositórios `.git` foram removidos da árvore servida (eram baixáveis). Só sobrou `dashboards/asilo/.git`. Os projetos vivem em repo próprio e são copiados para o web root. | SEG `PROXIMOS-PASSOS-202608.md` §1 ("10 repositórios `.git` ... removidos"); `WEB:dashboards/asilo/.git` ainda existe |
| PHP | PHP 8.5 via php-fpm (`fastcgi_pass php:9000`). Muitas pastas usam PHP (`mermaid`, `news`, `ativos`, `cairo`, `etf`, `natal2025`). As pastas mais "estáticas" (`faunabr`, `gene`, `manualOMP`) não precisam. | `CONF:` `location ~ \.php$`; SEG linha 96 |
| Limite de upload / body | `CONF:` **não** define `client_max_body_size`. A imagem define `client_max_body_size 100m` e `gzip on`. `[INFERÊNCIA]`: o `nginx.conf` do container equivale ao do repo da imagem, não foi inspecionado dentro do container. | `https://github.com/tangramor/nginx-php8-fpm/blob/master/Dockerfile` (linhas ~12-29 do bloco `nginx.conf`) |
| Limite de tamanho de arquivo servido | Nenhum limite visível em `CONF:`. Já há arquivos grandes servidos: `gene/data` 15 MB, `faunabr/completude` 11 MB, `natal2025/musica3.mp3`. Cloudflare Free não comprime/cacheia tudo, ver §1.3. | `du -sh` no web root |
| MIME | `CONF:` não tem tipos próprios. Usa `mime.types` do nginx. No `mime.types` upstream, `.js`→`application/javascript`, `.json`→`application/json`, `.wasm`→`application/wasm`, `.woff2`→`font/woff2`, `.svg`→`image/svg+xml`. **Não há entrada para `.mjs`.** Cabeçalhos reais observados confirmam `.js` e `.json`. | `https://raw.githubusercontent.com/nginx/nginx/master/conf/mime.types` (0 ocorrências de `mjs`); `HEAD https://web.dalc.in/faunabr/comum/comum.js` → `Content-Type: application/javascript`; `HEAD .../grafo/data/grafo.json` → `application/json` |

> **Consequência do MIME (importante).** Módulos ES exigem MIME de JavaScript e o servidor manda `X-Content-Type-Options: nosniff` (observado). Um `.mjs` serviria `application/octet-stream` e seria **recusado pelo navegador** `[INFERÊNCIA: não testado, extensão ausente do mime.types upstream; a imagem Alpine pode divergir]`. Regra segura: **módulos ES sempre com extensão `.js`**, como o `faunabr` faz (`WEB:faunabr/grafo/grafo.js` com `<script type="module">`).

### 1.2 Regras de bloqueio que podem pegar arquivos da apresentação

Há duas camadas independentes, as duas por **substring/extensão** no caminho. Nomear arquivos errado derruba a apresentação com `403`.

**nginx** (`CONF:` ambos os `server`):
- `location ~ /\. { deny all; }` → qualquer caminho com segmento começando em ponto (`/.git`, `/.env`, `/.well-known`, e também `/.app/...`).
- `location ^~ /seguranca/` e `/conf/` → `deny`.
- `location ~* \.(sqlite|sqlite3|db|db3|bak|log|ini|conf|zip|tar|gz|m3u|sql|save|deleted\.\d+)$` → `deny` (a extensão final).
- `location ~ ^/(kandev/uploads|md/data|mermaid/dados)/` → `deny`.

**Cloudflare WAF** (regras `web-block-dotfiles`, `web-block-db-log-config`, `web-block-archives-media`, publicadas com `contains`, porque `ends_with` não existe no plano Free) bloqueiam qualquer caminho que **contenha**: `/.env`, `/.git`, `/.claude`, `/.remember`, `/.htaccess`, `/.gitignore`, `.sqlite`, `.db`, `.bak`, `.log`, `.ini`, `.conf`, `.zip`, `.m3u` (SEG §1.1 "Regra 1/2/3", linhas 138-180).

**O que isso quer dizer para nomear arquivos** `[INFERÊNCIA: deduzida das expressões `contains`, não testada com URLs de exemplo]`:

| Evitar | Porque | Alternativa |
|---|---|---|
| `x.db.json`, `dados.db`, `snapshot.dbf` | contém `.db` | `dados-release.json` (sem ponto antes de `db`) |
| `logo.png` é seguro, mas `site.logo.svg`, `app.login.js`, `x.logic.js` | `.log` aparece como substring depois de um ponto | `site-logo.svg`, `login.js` |
| `app.config.js`, `app.init.js`, `x.inicio.js` | `.conf` e `.ini` como substring (`.config`, `.init`, `.inicio`) | `config.js`, `inicio.js` (sem ponto antes do nome) |
| `pacote.zip`, `.zip.js` | `.zip` | não publicar ZIP; usar arquivos soltos |
| `dados.duckdb` | passa nos dois filtros (`.duckdb` não contém `.db`; a regex do nginx exige ponto antes de `db`) | ok; ver §3.4 |
| pastas `_work/`, `.app/` | `.app/` cai no `deny` de dotfile; `_work/` serve | use `_work/` só se aceitável ser público (`manualOMP/_work` é servido) |

### 1.3 Cache e CDN (observado)

`HEAD` em 4 URLs públicas de `faunabr` (2026-11-14):

| URL | Cache-Control | `cf-cache-status` | Encoding |
|---|---|---|---|
| `/faunabr/` (HTML) | (nenhum) | `DYNAMIC` | `br` |
| `/faunabr/comum/comum.js` | `max-age=14400` (4 h) | `MISS` | `br` |
| `/faunabr/comum/vendor/cytoscape.min.js` | `max-age=14400` | `MISS` | `br` |
| `/faunabr/grafo/data/grafo.json` (1,2 MB) | (nenhum) | `DYNAMIC` | `br` |

- O Cloudflare cacheia `.js`/`.css` por 4 h. `etf/index.php` documenta a armadilha: *"O Cloudflare guarda app.js/app.css por 4 h: sem ?v=, depois de publicar, a página nova roda com o JS velho."* (`WEB:etf/index.php`). `faunabr` resolve com `?v=<hash>` no import: `import { iniciar } from "../comum/comum.js?v=0bc27a7"` (`WEB:faunabr/grafo/grafo.js`, linha 1) e `<script type="module" src="grafo.js?v=0bc27a7">` (`WEB:faunabr/grafo/index.html`).
- JSON e HTML são `DYNAMIC` (não cacheados na borda por padrão) e saem comprimidos em Brotli, ou seja, dados em JSON grande são aceitáveis. `[INFERÊNCIA]`: compressão feita pelo Cloudflare, não pelo origin.
- O Cloudflare cacheou "bloqueios" antigos e exigiu *cache-busting* ao testar (SEG linha 164).

### 1.4 Acesso: público ou atrás do Cloudflare Access?

- Pastas **com Cloudflare Access** (login `edalcin@gmail.com`): `news`, `kandev`, `ativos`, `mermaid`, `gene` e outros (`chartDB`, `cyberchef`, `grist`). SEG linha 60.
- Pastas **sem Access** (públicas na prática): `faunabr` (confirmado por `HEAD` 200 anônimo), `natal2025`, `cairo` (PIN próprio), `blog`, `manualOMP` e `dashboards/aposentadoria` (`[INFERÊNCIA]`: não há política Access listada para elas).
- **Decisão pendente do dono:** a apresentação precisa ser pública (aberta em sala de reunião, em qualquer máquina) ou ficar atrás do Access (exige login do Google na hora)? Em sala de reunião, Access é um risco de falha ao vivo. Ver §5, dúvidas.

### 1.5 Vizinhos em `S:/appsdata/` e `web.dalc.in/`

- `S:/appsdata/web-conf/` guarda `nginx-site.conf` e dois `.bak-2026-08-11-*`. Hoje a fonte de verdade fica aqui; SEG linha 112-120 ainda cita `conf/nginx-site.conf` dentro do web root e que o `/start.sh` da imagem copia a config para `/etc/nginx/conf.d/default.conf` a cada boot, de modo que `nginx -s reload` sozinho não aplica mudança (use `docker restart nginx-Php8`). `[INFERÊNCIA]`: `web-conf/` substituiu `web.dalc.in/conf/` (a pasta `conf/` não existe mais no web root; não foi verificado o bind-mount novo). Não é relevante para o implementador da apresentação, que **não deve** tocar em nginx.
- `web.dalc.in/seguranca/` → `deny all`. Não publicar nada ali.
- `web.dalc.in/index.html` contém só `Oi!`. Não há página-índice de portfólio onde a apresentação precise se registrar. `[INFERÊNCIA]`
- `eduardo.dalc.in` é outro `server_name` com `root /var/www/html/blog` (`CONF:` primeiro bloco). Não é o alvo.

---

## 2. Padrões das pastas interativas existentes

Medições: `du -sh` no web root; bibliotecas e padrões lidos nos arquivos citados.

| Pasta | Tamanho | Arquivos | Bibliotecas | CDN? | PHP? | Build? | Tema claro/escuro | PWA/offline |
|---|---|---|---|---|---|---|---|---|
| `faunabr/` | 12 MB | multi-arquivo; `index.html` + `comum/` (`base.css`, `comum.js`) + um subdiretório por análise (`grafo/`, `completude/`) com `data/*.json` | `cytoscape.min.js` (435 KB) **vendored** em `comum/vendor/` | Só Matomo (`matomo.dalc.in`, assíncrono) | não | não | sim: `data-theme` + `localStorage("tema")` + `prefers-color-scheme` (`comum/comum.js`) | não |
| `gene/` | 23 MB (15 MB de `data/`) | `index.html` + `app.js` + `app.css` + `data/app.js` (dados embutidos) + `fonts/*.woff2` vendored | nenhuma biblioteca; fontes `AtkinsonHyperlegible`, `BricolageGrotesque` locais | não | não | **sim, de dados**: `scripts/build_data.py`, `extract.py`, `traduzir.py` geram `data/*` | sim: `data-theme` + `localStorage('theme')` (`index.html` linha 7) | não |
| `manualOMP/` | 457 KB | **arquivo único** `index.html` (189 KB, CSS+JS inline) | nenhuma | não | não | **sim**: `_work/build.py` gera o HTML a partir de `_work/in_*.json`/`out_*.json` | sim: `data-t` + `prefers-color-scheme` + `localStorage` (3 ocorrências) | não |
| `etf/` | 1,1 MB | `index.php` + `app.js` (25 KB) + `app.css` + `vendor/d3.v7.min.js` (281 KB) + `api/*.php` | d3 v7 **vendored** | não | sim (API, PIN, SQLite) | não | sim: `data-theme` + `prefers-color-scheme` | não |
| `news/` | 713 KB | `index.php` + `manifest.json` + `sw.js` + `favicon.svg` | nenhuma | não | sim (RSS, Gemini) | não | sim (auto + manual, `README`) | **sim**: `manifest.json` + `sw.js` (network-first na página, `start_url` e paths **absolutos** `/news/`) |
| `ativos/` | 187 KB | `index.php` (≈2 000 linhas) + `sw.js` + `manifest.json` | Tailwind (CDN), FontAwesome (CDN), Sortable (CDN) | **sim, 3 CDNs** | sim (+SQLite) | não | não verificado | sim (`sw.js` com path absoluto `/ativos/sw.js`) |
| `cairo/` | 6,6 MB | `index.php` + `theme.js` + `style.css` + `manifest.json` + `icons/` | nenhuma | não | sim (SQLite) | não | sim (`theme.js`, `localStorage('cairo-theme')`) | manifest; registra SW em `theme.js` |
| `mermaid/` | 120 KB | `index.php`, `handlers.php`, `mermaid-editor.js`, `style.css` | Mermaid 10.6.1 via **cdnjs** (`<script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/<versão>/mermaid.min.js">`) | **sim** | sim (CRUD de `.txt` em `dados/`) | não | `[INFERÊNCIA]` não verificado | não |
| `dashboards/` | 27 MB | uma pasta por painel: `asilo` (PWA com `sw.js`, paths relativos `./`), `aposentadoria` (1 `index.html` de 11 KB), `climaRio`, `health`, `peso`, `luz`, `sensor` | Google Charts (gstatic), jpgraph (`sensor`) | sim em `asilo` | maioria sim | não | `asilo` sim | `asilo` sim (`sw.js` cache-first, `./`) |
| `natal2025/` | 8,2 MB | `index.php` + 2 JPG + `musica3.mp3` | Tailwind (`cdn.tailwindcss.com`), Google Fonts | **sim** | trivial (só traduções) | não | não (tema escuro fixo) | não |
| `sandbox/grafo/` | 68 KB | `index.php`, `dados.php`, `dados.json` | vis.js | `[INFERÊNCIA]` provável CDN | sim | não | não | não |

### 2.1 Leituras relevantes

1. **Ninguém usa Boxicons.** `grep -rli boxicons` só achou resultados em `sisgenDatasheet.deletar/` (app descartado). Os projetos ativos usam FontAwesome (CDN, `ativos`) ou nenhum ícone. **Boxicons terá de ser vendored do zero** (ver §4.3 e §3.1).
2. **Só `faunabr`, `gene`, `etf` e `manualOMP` já seguem a regra "sem CDN"** (fontes e libs locais). `ativos`, `mermaid`, `natal2025` carregam de CDN e **falhariam offline**.
3. **Tema.** Padrão estável do dono: atributo `data-theme` (ou `data-t`) no `<html>` + `localStorage` + `prefers-color-scheme` como padrão + um botão. O trecho inline no `<head>` evita *flash* de tema errado: `WEB:gene/index.html` linha 7, `document.documentElement.dataset.theme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');`.
4. **`<script>` clássico vs módulo.** `gene` usa script clássico de propósito: `<!-- ponytail: scripts clássicos (não ES modules) para a página abrir também por file:// -->` (`WEB:gene/index.html`). `faunabr` usa módulos ES e `fetch("data/grafo.json")` (não funciona sob `file://`). Detalhe em §4.5.
5. **Dados pré-calculados.** `faunabr` e `gene` geram JSON/JS **antes** (scripts Python fora do servidor) e publicam arquivos estáticos. É o padrão a repetir para os releases e contagens do Biodiversidade.Online.
6. **Service Worker.** Há duas gerações. `news` e `ativos` fixam caminhos absolutos (`'/news/'`, `/ativos/sw.js`), o que quebra se a pasta for renomeada. `dashboards/asilo/sw.js` usa `./` (correto para subpasta). Copiar o de `asilo`, não o de `news`.
7. **Rastreamento.** `faunabr` inclui Matomo (`matomo.dalc.in`, `setSiteId 12`, `async`). Falha de rede não quebra a página, mas gera requisição externa. Decidir se a apresentação carrega o Matomo.

### 2.2 Melhores exemplos de conteúdo dinâmico, não formal

| Exemplo | O que mostra | Por que servir de modelo |
|---|---|---|
| **`faunabr/`** | Análises interativas (grafo Cytoscape de grupos×taxonomistas, mapa de completude) com texto narrativo ("O que o Catálogo da Fauna do Brasil mostra sobre si mesmo") | É o único com tudo junto: ES modules, lib vendored, JSON pré-calculado, `?v=` anti-cache, tema, `metodo.html` explicando o método. **Melhor modelo estrutural.** |
| **`gene/`** (`spec.md` §1: "leitura de literatura", pt-BR, "Seu DNA, lido com calma") | Dados científicos para leigo, tom pessoal, `<dialog>` de detalhe, fontes locais | Melhor modelo de **tom** e de **acessibilidade** (Atkinson Hyperlegible, `OFL-*.txt` de licença). Está atrás de Access. |
| **`manualOMP/`** | Documento único, navegação lateral fixa, tema, busca de configurações | Melhor modelo de **entrega em um arquivo** (189 KB, gerado por `build.py`). |
| **`natal2025/`** | Página animada (neve, vidro fosco, música) | Melhor exemplo de **informalidade e tom afetivo**, mas anti-modelo técnico (Tailwind e Google Fonts via CDN, nada funciona offline). |
| **`mermaid/`** | Editor de diagramas Mermaid | Mostra que o dono já usa Mermaid; é um editor PHP, não um modelo de apresentação. |

Nenhuma pasta existente é uma apresentação com narrativa cronológica, nem um deck, nem scrollytelling. `[INFERÊNCIA]` baseada em listagem e leitura de `<head>`; não foi aberto cada `index` de `dashboards/*`.

---

## 3. Candidatos de formato (propostos, sem decisão)

Contexto: história cronológica do Biodiversidade.Online (v0.1-alpha 2024-01-04 → v6.1 2026-02-17, 9 releases, depois V7/MongoDB e DuckDB) para um público de biodiversidade, em tom não formal. Releases por `gh release list`: v0.1-alpha 2024-01-04, v0.2-alpha 2024-03-05, v4.0 2025-04-21, v4.0.1 2025-04-22, v5.0 2025-05-25, v5.1/v5.2 2025-07-12, v6.0 2025-09-22, v6.1 2026-02-17.

Regras do dono aplicadas a todos: HTML + JS ES modules + CSS, sem build, libs vendored (sem CDN), Boxicons único conjunto de ícones, tema claro/escuro, PWA/offline quando possível, diagramas Mermaid.

### 3.0 Suporte de navegador às APIs-chave (verificado em 2026-11-14)

| API | Chrome/Edge | Firefox | Safari | Status | Fonte |
|---|---|---|---|---|---|
| CSS scroll-driven animations (`animation-timeline: scroll()/view()`, `animation-range`) | 115 (2023-07) | **159 (2026-10-27)** | 26 (2025-09) | **Baseline "newly available" desde 2026-10-27**; "widely available" prevista 2029-04-27; marcado em Interop 2026 | https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline |
| View Transitions, mesmo documento (`document.startViewTransition`) | 111 | **144** | 18 | Baseline "newly available" (low) desde 2025-10-14 | https://github.com/web-platform-dx/web-features/blob/main/features/view-transitions.yml.dist |
| View Transitions entre documentos (`@view-transition`, MPA) | 126 | **não** | 18.2 | **Sem Baseline** | https://github.com/web-platform-dx/web-features/blob/main/features/cross-document-view-transitions.yml.dist |
| `IntersectionObserver` | tudo | tudo | tudo | Baseline **widely available** desde 2019-03-25 | https://github.com/web-platform-dx/web-features/blob/main/features/intersection-observer.yml.dist |
| Import maps | tudo | tudo | tudo | Baseline widely (2023-03-27) | `.../features/import-maps.yml.dist` |
| Service Workers | tudo | tudo | tudo | Baseline widely (2018-04-30) | `.../features/service-workers.yml.dist` |
| CSS scroll snap | tudo | tudo | tudo | Baseline widely (2020-01-15) | `.../features/scroll-snap.yml.dist` |

**Ressalvas sobre scroll-driven animations** (https://nbellocam.dev/blog/scroll-driven-animations-produccion, 2026-11-01, blog de terceiros, não especificação):
- Firefox 159 acabou de sair; Firefox ESR e Safari ≤ 18 **não** suportam. A máquina da sala pode estar desatualizada. O autor recomenda `@supports (animation-timeline: view())` e que **o estado base seja o visível** (o "oculto" só no `from` dos keyframes).
- Em Safari 26.0-26.3 as animações rodam na thread principal; só a 26.4+ é *threaded*. Em Firefox, `view()` roda na thread principal. Para um texto com poucos elementos isso é aceitável.
- `timeline-scope` e `ScrollTimeline` via JS são as áreas menos interoperáveis. Ficar em timelines anônimos em CSS.
- Em impressão a animação fica inativa (por especificação), então o estado base visível também serve a "salvar como PDF".

### 3.1 Candidato A: Scrollytelling (rolagem conta a história)

Uma página longa, uma seção por marco da história; texto fixo/sticky de um lado e figura (Mermaid, contador, linha do tempo) do outro, que muda conforme a rolagem.

- **Técnica.** `position: sticky` + `IntersectionObserver` (troca o passo ativo) + CSS scroll-driven animations só como realce progressivo com `@supports`. Scroll snap opcional.
- **Para apresentador com projetor.** Médio. Rolar com `Espaço`/`PgDn`/setas funciona de forma nativa. Falta noção de "slide": difícil parar num ponto exato, difícil ensaiar, sem notas do apresentador (a menos que se construam). Bom se a pessoa fala de forma livre.
- **Leitura autoguiada depois.** **Muito alto.** É o formato natural de leitura, funciona no celular, imprime com o estado base visível.
- **Esforço.** Baixo-médio: 1 `index.html` + 1 `story.css` + 1 `story.js` + `data/releases.json`. Sem lib obrigatória.
- **Risco.** Baixo para o núcleo (IntersectionObserver é Baseline widely); médio para o efeito de scroll-driven em Firefox ESR/Safari antigo (cai para o estado base).
- **Peso vendored.** ~0 KB só com CSS/JS próprios. + Boxicons (~184 KB: `boxicons.min.css` 68 KB + `boxicons.woff2` 116 KB, v2.1.4 em jsDelivr). + Mermaid se renderizado ao vivo (ver §3.6).
- **Offline.** Fácil: manifest + SW precacheando poucos arquivos.
- **Modelo no web root.** `faunabr/` (estrutura) + `gene/` (tom).

### 3.2 Candidato B: Deck dirigido por teclado (estilo reveal.js, vendored)

Slides com setas, modo overview, notas do apresentador, fragmentos, tela cheia.

- **Técnica.** reveal.js 6.0.2 (MIT) vendored: `reveal.js` 119 KB, `reveal.mjs` 141 KB, `reveal.css` 54 KB, `reset.css` 0,6 KB, plugin `notes.js` 68 KB; tema: `theme/black.css` ou `white.css` **575 KB cada** (embute fontes/regras; ver nota) (tamanhos via https://data.jsdelivr.com/v1/packages/npm/reveal.js@6.0.2?structure=flat). Alternativa sem lib: ~150 linhas de JS próprio (setas, `hashchange`, `fullscreen`).
- **Para apresentador com projetor.** **Muito alto.** É o formato que o público e o apresentador esperam: setas, `F` tela cheia, `S` notas e cronômetro (precisa do plugin notes), `Esc` overview. Pode ensaiar e cronometrar.
- **Leitura autoguiada depois.** Médio. Slides têm menos contexto, a menos que se faça uma versão `?print-pdf` ou um modo "página" extra.
- **Esforço.** Baixo com reveal.js; médio com deck próprio (que controla tema claro/escuro e Boxicons sem sobrescrever CSS de tema).
- **Risco.** Baixo. Pontos de atenção: o tema CSS de 575 KB é grande (`[INFERÊNCIA]` por embutir fontes), o tema claro/escuro precisa de variáveis próprias (reveal tem temas separados, trocar por CSS próprio `data-theme`); o plugin de notas abre janela pop-up (bloqueada por alguns navegadores); `reveal.mjs` deve ser servido como `.js` (ver §1.1, MIME de `.mjs`) ou usar `reveal.js` UMD.
- **Peso vendored.** ~0,4 MB sem tema grande/plugins extras; ~1,2 MB com um tema e notes. + Boxicons ~184 KB.
- **Offline.** Fácil (muitos arquivos, poucos MB).
- **Modelo no web root.** nenhum; `manualOMP/` para o visual (navegação lateral e tema).

### 3.3 Candidato C: Linha do tempo interativa / "mapa de metrô" dos releases

Um diagrama horizontal (ou vertical no celular) com estações por release (v0.1-alpha → v6.1 → V7 → DuckDB) e ramais (processo de ingestão, fontes adicionais: espécies ameaçadas, invasoras, Unidades de Conservação). Clicar numa estação abre o detalhe (README da época, o que mudou, citação).

- **Técnica.** SVG/HTML gerado em JS a partir de `data/releases.json`; `<dialog>` para detalhe; teclas ←/→ navegam estações (serve de "deck"); `View Transitions` (mesmo documento) opcional na troca de estação. Ou Mermaid `timeline`/`gitGraph` como base estática. Cytoscape (como em `faunabr/grafo`) seria exagero para ≤ 12 nós `[INFERÊNCIA]`.
- **Para apresentador.** Alto: a estação é o "slide", a tela inteira mostra a história inteira (contexto). Bom para responder "e onde entra X?".
- **Leitura autoguiada.** Alto, se cada estação tiver texto suficiente; vira um índice visual.
- **Esforço.** Médio (desenho do mapa, responsivo, acessibilidade por teclado e leitor de tela). É o formato com mais design próprio.
- **Risco.** Médio: o layout "metrô" quebra em telas estreitas se não for pensado; o conteúdo depende de editar JSON em vez de texto corrido.
- **Peso vendored.** ~0 KB (JS/SVG próprios), Boxicons ~184 KB; Mermaid só se usar.
- **Offline.** Fácil.
- **Suporte.** View Transitions same-document: Chrome 111, Safari 18, Firefox 144 (Baseline newly, §3.0). **Não usar** `@view-transition` entre páginas (Firefox sem suporte).
- **Modelo no web root.** `faunabr/grafo` (interação), `gene/` (dialog).

### 3.4 Candidato D: História de dados explorável (JSON pré-calculado ou DuckDB-WASM)

Os números do projeto (contagens de táxons, ocorrências, Fontes IPT, Execuções por release) viram gráficos e tabelas que o público filtra. Duas variantes:

- **D1: JSON pré-calculado** (padrão de `faunabr`/`gene`). Um script **fora** do site (Go ou Python, rodado pelo autor) exporta `data/*.json` a partir do DuckDB (`SELECT … FROM ingest_runs`, `taxon`, `occurrence`). O navegador só desenha. Gráficos com JS próprio/SVG ou d3 (280 KB, já vendored em `etf/vendor/`).
- **D2: DuckDB-WASM** (consultas SQL no navegador sobre um arquivo `.duckdb` ou Parquet).
  - Peso: `duckdb-eh.wasm` **35,9 MB** + worker 0,77 MB + `duckdb-browser.mjs` 32 KB (v1.33.1-dev57.0 via jsDelivr API `https://data.jsdelivr.com/v1/packages/npm/@duckdb/duckdb-wasm@1.33.1-dev57.0?structure=flat`). Mais os dados.
  - O bundle `coi` (multi-thread) exige cabeçalhos COOP/COEP que `CONF:` não define. Usar o `eh`.
  - `.mjs` precisa virar `.js` no servidor (MIME) `[INFERÊNCIA]`; `application/wasm` já é mapeado (mime.types upstream).
  - `.duckdb` não é bloqueado por nginx nem WAF (ver §1.2). Parquet idem.
- **Para apresentador.** D1 alto se o painel é preparado ("clique aqui, veja isto"); D2 impressiona ("o próprio DuckDB roda no navegador, o mesmo motor do projeto") mas 36 MB na primeira carga em rede de sala de reunião é arriscado.
- **Leitura autoguiada.** Alto (explorar). Mas um dado explorável **sem narrativa** não é uma história; precisa de combinar com A ou C.
- **Esforço.** D1 médio (script de exportação + gráficos). D2 alto (WASM, worker, carga, cache de 36 MB, tratamento de erros).
- **Risco.** D1 baixo. D2 médio-alto (peso, memória, Safari/iOS, SW precisando guardar 36 MB; Cloudflare Free não é problema de tamanho para arquivo de origem `[INFERÊNCIA]`).
- **Peso vendored.** D1 ≈ 0-280 KB (+ dados). D2 ≈ 37 MB + dados.
- **Offline.** D1 fácil. D2 só com SW precacheando 36 MB (viável, mas pesado no primeiro acesso).
- **Observação de escopo.** Os dados de cada release não existem em formato estruturado único no repo; precisam ser extraídos de `gh release view` e dos relatórios; ver o trabalho de `HistoriaReleases`. `[INFERÊNCIA]`

### 3.5 Candidato E: Narrativa em "terminal / chat" (estilo ChatBB)

A história contada como uma conversa ou sessão de terminal: o apresentador "digita" comandos (`./biodiv ingest --tag flora`), a tela responde com saída simulada e mensagens; ou um chat falso com o "ChatBB" respondendo perguntas pré-gravadas. Tem eco direto com a história (a v5.x foi o ChatBB) e com a versão atual (ferramenta de linha de comando).

- **Técnica.** Roteiro em JSON (`passos[]` com `tipo: comando | saida | pergunta | resposta | pausa`), JS reproduz com efeito de digitação, controlado por `Espaço`/`→`; botão "pular". Ícones Boxicons. Tema claro/escuro (terminal sempre escuro por convenção? decidir).
- **Para apresentador.** Alto e memorável, bom como **abertura** ou **bloco curto**; esgotante como formato único de 20-30 min.
- **Leitura autoguiada.** Médio: transcript legível se houver modo "mostrar tudo". Acessibilidade exige `aria-live` com cuidado (texto digitado gradualmente prejudica leitores de tela; oferecer versão estática).
- **Esforço.** Baixo-médio (motor de reprodução ~100 linhas + roteiro).
- **Risco.** Baixo técnico; o risco é **de conteúdo**: saída simulada parecer real (anotar "simulação"); o chat do ChatBB não deve inventar respostas que o produto real não daria, `[INFERÊNCIA]` exige conferir com histórico em `HistoriaReleases`.
- **Peso vendored.** ~0 KB + Boxicons ~184 KB.
- **Offline.** Fácil.
- **Modelo no web root.** `mermaid/` e `natal2025` (informalidade); nada equivalente.

### 3.6 Mermaid na apresentação (vale para todos os candidatos)

A regra do dono é "diagramas em Mermaid". Em arquivos `.md` do repo isso é trivial. **Na página** há 3 caminhos:

| Caminho | Peso | Offline | Observação |
|---|---|---|---|
| (a) Mermaid ao vivo, vendored `mermaid.min.js` | **5,5 MB** (UMD, v12.3.0) | sim | Um arquivo, sem build, `securityLevel` configurável. Tema Mermaid precisa trocar junto com o tema da página (`mermaid.initialize({ theme })`, re-render ao trocar) |
| (b) Mermaid ESM com *chunks* (`mermaid.esm.min.mjs` 31 KB + 210 chunks, ~24,6 MB) | menor por diagrama (só carrega os chunks usados), mas **são `.mjs`** | sim, se todos os chunks forem vendored | **Cai na armadilha do MIME `.mjs`** (§1.1). Só com renomear/ajustar o nginx. Não recomendado |
| (c) SVG pré-renderizado a partir do `.mmd` (rodado uma vez fora do site) | ~KB por diagrama | sim | Troca de tema precisa de 2 SVGs ou variáveis CSS; **conflita com "sem imagens no repo"** se SVG contar como imagem (dúvida §5) |

Tamanhos: https://data.jsdelivr.com/v1/packages/npm/mermaid@12.3.0?structure=flat. A pasta `mermaid/` já existente carrega Mermaid 10.6.1 de CDN (não offline).

### 3.7 Comparação

Escala: ●●● alto/melhor, ●○○ baixo. Esforço e risco: ● = baixo, ●●● = alto.

| Critério | A. Scrollytelling | B. Deck por teclado | C. Metro dos releases | D1. Dados JSON | D2. DuckDB-WASM | E. Terminal/chat |
|---|---|---|---|---|---|---|
| Presenter + projetor | ●●○ | ●●● | ●●● | ●●○ | ●●○ | ●●○ (melhor como bloco) |
| Leitura autoguiada | ●●● | ●●○ | ●●● | ●●● | ●●● | ●●○ |
| Informalidade / tom | ●●● | ●●○ | ●●● | ●●○ | ●●○ | ●●● |
| Esforço | ● a ●● | ● a ●● | ●● | ●● | ●●● | ● a ●● |
| Risco técnico | ● a ●● (Firefox/Safari antigos) | ● | ●● | ● | ●●● | ● |
| Peso vendored | ~0 | 0,4-1,2 MB | ~0 | 0-0,3 MB (+dados) | ~37 MB (+dados) | ~0 |
| Offline fácil | ●●● | ●●● | ●●● | ●●● | ●○○ | ●●● |
| Combina com os demais | sim (base) | sim | sim | sim (complemento) | só como bônus | sim (abertura) |

> **Leitura da tabela (não é decisão).** Os formatos não são excludentes. Um arranjo comum é **A** (esqueleto de leitura) + **C** (mapa da seção cronológica) + **D1** (um ou dois painéis de dados), com **E** como abertura curta e atalhos de teclado herdados de **B** (←/→ pulam de seção). **D2** isolado é o de maior custo e menor ganho para uma sala de reunião.

---

## 4. Restrições técnicas do implementador

### 4.1 Caminhos e URLs

1. O site vive em **subpasta**: `https://web.dalc.in/<pasta>/`. **Nenhum caminho começando em `/`** (`/css/x.css`, `/sw.js`, `start_url: "/"`): quebra. Usar sempre relativos (`./`, `data/releases.json`, `../comum/x.js`). O web root já tem erros assim (`news/manifest.json` `"start_url": "/news/"`, `ativos/index.php` `register('/ativos/sw.js')`, `news/sw.js`).
2. Nome da pasta ainda **não decidido** (dúvida §5); como tudo é relativo, o nome pode mudar sem refatorar.
3. Index `index.html`: `try_files $uri $uri/ /index.php?$args` e `index index.php index.html` → a URL `https://web.dalc.in/<pasta>/` carrega o `index.html`. Sem `.php`, `index.php` na raiz do web root não interfere (não há `index.php` no root). `[INFERÊNCIA]`
4. Se um *fallback* de rota SPA (hash `#/secao`) for usado, **não** usar `history.pushState` com rotas "limpas" (`/<pasta>/releases/v5`): o `try_files` do nginx cai em `/index.php?$args` (`CONF:`) e a URL não resolve para a página `[INFERÊNCIA: não testado]`. Usar âncoras `#v5-0` ou parâmetros `?passo=3`.
5. Acentos em caminhos são frágeis; nomear arquivos em ASCII minúsculo com hífen.
6. **Nomes proibidos:** evitar `.db`, `.log`, `.ini`, `.conf`, `.bak`, `.zip`, `.sqlite`, `.m3u` como substring depois de ponto, e segmentos com ponto inicial (`/.x/`) (§1.2). Quem nomear `story.log.js` ou `.app/` toma `403`.

### 4.2 Módulos, scripts e MIME

1. ES modules com extensão **`.js`** (não `.mjs`), `<script type="module" src="app.js?v=HASH">` (padrão `faunabr`).
2. Imports relativos **com extensão explícita** (`./util.js`), sem *bare specifiers* (`import x from "reveal.js"`) a menos que haja `<script type="importmap">` local (import maps são Baseline widely, §3.0).
3. WASM: `application/wasm` está mapeado. Se for usar DuckDB-WASM, referenciar os `.wasm` por URL relativa, e **não** usar o bundle `coi` (precisa COOP/COEP).
4. Sem `npm`, sem bundler: as libs entram como arquivos em `vendor/<nome>/` com licença (padrão `faunabr/comum/vendor/`, `etf/vendor/`, `gene/fonts/OFL-*.txt`).

### 4.3 Bibliotecas e ícones

1. **Boxicons v2.1.4** (npm `boxicons`, licença CC-BY-4.0 / OFL-1.1 / MIT): vendored mínimo `css/boxicons.min.css` (68 KB) + `fonts/boxicons.woff2` (116 KB) e ajustar o `@font-face` para apontar o `.woff2` local; **descartar** `.eot`/`.svg`/`.ttf`/`.woff` (0,3-1,2 MB cada). Fonte: https://data.jsdelivr.com/v1/packages/npm/boxicons@2.1.4?structure=flat . O CSS de `boxicons.min.css` referencia `../fonts/`: manter a estrutura ou reescrever as URLs. `[INFERÊNCIA]` não verificado dentro do CSS.
2. **Sem CDN**: nem fontes (Google Fonts), nem Tailwind (`natal2025`), nem Mermaid (cdnjs), nem Matomo (decidir). Usar *font stack* do sistema (`faunabr/comum/base.css`: `"Iowan Old Style", … Georgia, serif`) ou `.woff2` locais com licença.
3. Mermaid: ver §3.6 (UMD vendored de 5,5 MB é o caminho que não depende de `.mjs`).
4. `mermaid/readme.md` descreve segurança do editor (CSRF, sanitização), mas **não se aplica** a páginas estáticas. Ao embutir Mermaid, usar `securityLevel: 'strict'` (padrão) para o conteúdo vindo de arquivos `.mmd` locais. `[INFERÊNCIA]`

### 4.4 Tema e acessibilidade

1. Copiar o padrão de `gene/index.html` linha 7 (script inline no `<head>` define `data-theme` antes de pintar) + `localStorage` + `prefers-color-scheme` + botão. Variáveis CSS por tema (`--bg`, `--fg`, …) como `faunabr/comum/base.css`.
2. `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }` (já em `faunabr/comum/base.css`). Obrigatório para scroll-driven e digitação.
3. `color-scheme: light|dark` por tema (já usado em `faunabr`).
4. Projetor: contraste alto, fonte ≥ 24-28 px no modo deck, `:focus-visible` visível, sem depender só de cor.
5. Estado base de qualquer animação de scroll deve ser **visível**; o "oculto" só no `from`. Sem JS ou sem suporte, a página inteira deve ler.

### 4.5 Offline, PWA e `file://`

1. **SW precisa de HTTPS ou localhost.** Em produção o Cloudflare dá HTTPS (HSTS `max-age=15552000`, SEG linha 28 e `HEAD` observado). Abrindo por `file://` **não há Service Worker**.
2. `manifest.json` com `start_url: "./"`, `scope: "./"`, ícones **próprios** (PNG/SVG pequenos: dúvida sobre "sem imagens no repo", §5). Copiar `dashboards/asilo/sw.js` (cache-first do *shell* com `./`) e **não** `news/sw.js`.
3. **Versionar o cache do SW** (`unraid-dashboard-v4` em `asilo`) e apagar caches antigos no `activate`; junto do `?v=` nos imports. Cloudflare guarda `.js`/`.css` por 4 h (§1.3), logo "publicar e ver na hora" falha sem `?v=`.
4. **Sem rede na sala:** (a) abrir antes uma vez com rede para o SW precachear; (b) ou levar a pasta no notebook e servir por `localhost` (`python -m http.server`) `[INFERÊNCIA]`; (c) `file://` só funciona com **scripts clássicos** e dados embutidos em `.js` (padrão de `gene`), porque módulos ES e `fetch()` de JSON são bloqueados sob `file://` (CORS de origem opaca) → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules (seção sobre testar localmente). `[INFERÊNCIA]` não testado nesta máquina.
5. Matomo e qualquer recurso externo precisam ser opcionais e assíncronos (`faunabr` já faz: carrega `matomo.js` com `async`).

### 4.6 Cache e versão

1. `?v=<hash>` em **todo** `.js`/`.css` referenciado (HTML, imports internos e `sw.js`). `etf/index.php` gera com `filemtime`; sem PHP, `faunabr` usa hash manual (`0bc27a7`) `[INFERÊNCIA]`: parece hash curto de commit, não confirmado. Em site estático puro **não há como gerar isso automaticamente**: ou se escreve à mão antes de copiar (a "build" fica na cabeça do autor), ou se usa um `index.php` mínimo como `etf`. Esta é uma tensão real com "sem build".
2. JSON e HTML não são cacheados na borda (`DYNAMIC`), mas o navegador pode cachear. Para dados pré-calculados, usar nome com versão (`releases-2026-11-14.json`) ou `?v=`.
3. Testar publicação com *cache-busting* (`?x=<timestamp>`), como já foi necessário (SEG linha 164).

### 4.7 Dados e conteúdo

1. Dados estáticos por pasta `data/` (padrão `faunabr`): `grafo.json` 1,2 MB, `completude.json` 1 MB, `valores.json` 2,3 MB são servidos sem problema.
2. Não publicar segredos nem arquivos de apoio sensíveis: `.env`, `config.php` (os `config.php` com PIN existem em outras pastas); `news/.env`, `etf/.env`, `apUrca/.env` existem localmente. A apresentação **não precisa de segredo algum**.
3. Todo o conteúdo e citações de README devem vir do repo `edalcin/BiodiversidadeDB` (tags e `docs/`); fontes históricas por `git show <tag>:<arquivo>`. Rodar os extratores **fora** do site.
4. Licença: `faunabr` publica "Dados e textos derivados sob CC BY 4.0" em rodapé. O README do projeto declara GPL v3 e DOI Zenodo 10.5281/zenodo.18668804 (`README.md`). Escolher a licença do conteúdo da apresentação e declará-la. `[INFERÊNCIA]`: não há decisão registrada.

### 4.8 Proibido / fora do alcance

- Não tocar `nginx-site.conf`, Cloudflare ou o container: qualquer ajuste de MIME (`.mjs`, COOP/COEP) exige SSH ao Unraid + `docker restart nginx-Php8` (SEG linhas 107-121) e **não** faz parte de uma apresentação estática.
- Sem build step: nada de Vite, npm, Sass, TypeScript, Tailwind CLI. Scripts de **geração de dados** (Python/Go) fora do site são aceitáveis (precedente: `gene/scripts/`, `manualOMP/_work/build.py`), desde que os **artefatos** sejam arquivos comuns.
- Sem imagens/screenshots no repo; diagramas só em Mermaid (ver dúvidas sobre SVG/ícones).

---

## 5. Dúvidas abertas (para o dono decidir)

1. **Público ou atrás do Cloudflare Access?** Em sala de reunião, Access exige login Google (risco ao vivo). Pastas públicas existentes: `faunabr`, `natal2025`.
2. **Nome e URL da pasta** (ex.: `https://web.dalc.in/biodiversidade-online/`).
3. **"Sem imagens" inclui SVG e ícones PWA?** Define se Mermaid pré-renderizado em SVG (§3.6 c) e `icons/` do manifest são possíveis.
4. **Mermaid ao vivo (5,5 MB vendored)** é aceitável para a carga inicial? Alternativa: só os diagramas essenciais pré-renderizados.
5. **Matomo** (`matomo.dalc.in`) entra? `faunabr` usa, `gene` não.
6. **`.mjs` no nginx:** não verificado em execução (extensão ausente do `mime.types` upstream); se alguém precisar de `.mjs`, é preciso testar uma URL real antes de planejar com ela.
7. **Gzip/Brotli:** observado `Content-Encoding: br` no edge, mas a configuração do origin não foi inspecionada dentro do container.
8. **Como o apresentador usará**: sozinho com teclado (B/C), rolando (A) ou ambos? Define o primeiro formato do §3.7.
9. **Licença do conteúdo** (CC BY 4.0 como `faunabr`? GPL v3 do código?).

## 6. Fontes

- Web root: `S:/appsdata/web.dalc.in/` (`faunabr/`, `gene/`, `manualOMP/`, `etf/`, `news/`, `ativos/`, `cairo/`, `mermaid/`, `dashboards/`, `natal2025/`, `sandbox/grafo/`, `seguranca/`).
- Config: `S:/appsdata/web-conf/nginx-site.conf` (+ `.bak-2026-08-11-pre-hardening`, `.bak-2026-08-11-seguranca`).
- Segurança/infra: `S:/appsdata/web.dalc.in/seguranca/PLANO-EXECUCAO-202608.md`, `RELATORIO-SEGURANCA-202608.md`, `PROXIMOS-PASSOS-202608.md`.
- Cabeçalhos HTTP: `curl -I` em 4 URLs de `https://web.dalc.in/faunabr/` em 2026-11-14.
- Suporte de navegador: https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations ; https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API ; https://github.com/web-platform-dx/web-features/tree/main/features (`view-transitions`, `cross-document-view-transitions`, `intersection-observer`, `import-maps`, `service-workers`, `scroll-snap`) ; https://nbellocam.dev/blog/scroll-driven-animations-produccion (blog, terceiros) ; https://web.dev/blog/web-platform-10-2026.
- nginx/imagem: https://raw.githubusercontent.com/nginx/nginx/master/conf/mime.types ; https://github.com/tangramor/nginx-php8-fpm/blob/master/Dockerfile .
- Tamanhos de bibliotecas: jsDelivr API `https://data.jsdelivr.com/v1/packages/npm/<pacote>@<versão>?structure=flat` para `reveal.js@6.0.2`, `mermaid@12.3.0`, `@duckdb/duckdb-wasm@1.33.1-dev57.0`, `boxicons@2.1.4`, `cytoscape@3.35.0`, `d3@7.9.0`; versões/licenças pelo registry npm `https://registry.npmjs.org/<pacote>/latest`.
- Releases: `gh release list` em `edalcin/BiodiversidadeDB` (9 releases, 2024-01-04 a 2026-02-17).
