---
type: Research Note
generated: { by: claude-code/fable-5-2, at: 2026-11-14T00:00:00Z }
title: "Histórico e evolução da proposta — de DWC2JSON ao script Go + DuckDB"
description: "Pesquisa cronológica (tags, releases, README, commits, ADRs) para a apresentação interativa sobre o Biodiversidade.Online"
date: 2026-11-14
tags: [historico, releases, dwc2json, chatbb, duckdb, biodiversidade-online]
---

# Histórico e evolução da proposta

Convenções de fonte: `tag:caminho` = `git show <tag>:<caminho>`; `hash` = commit; `release vX` = `gh release view vX`. `[INFERÊNCIA]` marca o que não está escrito em nenhuma fonte. Todas as datas são ISO.

> **Aviso de topologia git (importante para quem cita hashes).** As 10 tags **não são ancestrais de `HEAD`**: `git merge-base v6.1 HEAD` = `da275a7` (README de 2022-12-09). As tags ficam numa linhagem paralela; o `main` tem commits equivalentes com outros hashes (ex.: tag v6.1 = `edad8be` "docs: atualizar README para V6.1"; no `main` a mesma mensagem é `6a5e7dd`, árvores diferentes: `9dd613b` vs `35dc969`). Por isso, para os marcos pré-V7, cite **tag + caminho**; para V7/DuckDB, cite **hash do main**. Total: 769 commits (`git log | wc -l`).

## 1. Origem (2022-12 → 2023-12)

- **Primeiro commit**: `720df9d`, 2022-12-09, Eduardo Dalcin, "Initial commit". Repositório `edalcin/DarwinCoreJSON` (URLs nos READMEs: `github.com/edalcin/DarwinCoreJSON`, v0.2-alpha:README.md).
- **Ideia inicial** (`da275a7`, 2022-12-09, README "Darwin Core JSON"), um diagrama Mermaid de dois nós:
  ```mermaid
  graph TD
      A(Pega DwC do IPT) --> B(Converte para JSON)
  ```
  Esse é o gérmen visual de toda a história: IPT → conversão → base.
- 2022-12 a 2023-04: experimentos com `dwc.json`, `dwcOpt.json`, `problemas.md` (`3bcbca8`, 2023-04-13: "Problemas com o DwC da Flora": colunas redundantes em `distribution.txt` etc.).
- **Primeiro parser funcional**: `c551c37` (2023-04-20 "Cria parser de DwC para JSON"), `1c94c7b` (2023-04-22 "Primeiro parser funcional"), `b9aaa70` ("Processa zip por URL"). Web inicial em Astro+Deno-node: `bcba0f2`/`f51fcce` (2023-04-22). Dockerfile `64d5304` (2023-04-23); Cloud Run `a88ae1e` (2023-04-24); MongoDB `2a53191` (2023-04-28); interface paginada `396e89d` (2023-04-29).
- **Autores**: Eduardo Dalcin e Henrique Pinheiro (v0.1-alpha:README.md, linha 3; mantido até HEAD:README.md). Contribuições de Pinheiro aparecem como PRs `Phenome/issue4`, `Phenome/issue19` (`8e6b3f7`, `9c59a32`).
- **Mudança para Deno + Deno Deploy**: `9ed6bae` (2023-10-20 "Muda para deno"), `f7715bb` (2023-10-25 "Usa Deno deploy ao invés do cloud run"); logo/Reflora, Matomo (`07f7d9c`, 2023-10-30), mapa de ocorrências por táxon (`c58ba5b`, 2023-11-04); **ocorrências no MongoDB** (`58915b9`, 2023-11-05 "Importa ocorrências"); Fauna (`73018cc`, 2023-12-13 "Adiciona reino animal").
- O README v4 e v6 datam o início: "Este projeto iniciou em novembro de 2023" (v4.0:README.md; v6.0:README.md). Note a defasagem: o repositório existe desde 2022-12 e o parser, desde 2023-04 `[INFERÊNCIA: "novembro de 2023" refere-se ao início do projeto de integração de fontes, não do repositório]`.

### O que era "DWC2JSON"

- **Nome do README**: "___Darwin Core Archive to JSON___ - Flora e Funga do Brasil" (v0.1-alpha:README.md).
- **Propósito declarado** (v0.1-alpha:README.md, "Objetivo"): "Criar uma ferramenta livre, gratuita e de código que ofereça os dados publicados pela Flora e Funga do Brasil em formato Darwin Core Archive no IPT, em formato JSON" e oferecê-la em Docker.
- **Motivação**: a estrutura relacional do DwC-A "exige do {usuário, analista, cientista de dados, pesquisador etc} um esforço adicional para relacionar e integrar as diferentes tabelas"; JSON seria documento leve, auto-descritivo; consulta "sem o custo computacional gerado pelas JOINs"; a Flora e Funga tinha "mais de 135.000 nomes científicos". Destino: "sistema gerenciador de bancos de dados orientado à documentos, como o MongoDB".
- **Stack**: Deno + Astro (web), MongoDB, GitHub Actions (`update-mongodb-flora/fauna/occurrences.yml`, `deno-deploy*.yml`), Docker (v0.1-alpha: árvore de arquivos; `src/flora.ts`, `src/fauna.ts`, `src/ocorrencia.ts`, `src/lib/dwca.ts`, `web/`).
- **Demo**: "Clique aqui para acessar o DEMO" → `https://dwca2json.deno.dev/taxa/`.
- **Alvos de dados** v0.1: apenas Flora e Funga do Brasil (IPT do JBRJ, recurso `lista_especies_flora_brasil`). Já havia `referencias/sources.json` e `sourcesRepositorios/*.json` (inpa, jbrj, mpeg, museuNacional, reflora, sibbr, speciesLink, taxonline) apontando para as futuras fontes de ocorrência.

## 2. Marcos (um por seção)

### 2.1 v0.1-alpha — "Primeiro release"
- **Data**: tag 2023-12-23 (`4d4c5b5`); release publicada 2024-01-04. **Título/nota**: "Primeiro release" / "Publicação do primeiro release para o Zenodo" (release v0.1-alpha).
- **README**: ver §1. Só flora; sem números de ocorrência; sem menção a LLM.
- **Componentes**: `src/` (importadores flora/fauna/ocorrência), `web/` Astro com `Map.astro`, `Taxon.astro`, `ocorrencias.tsx`; workflows de atualização do MongoDB; `referencias/dataHandling/herbariosDuplicadosRefloraJabot.csv` (primeira curadoria de duplicatas).
- **Por que o release**: arquivar no Zenodo (nota do release). DOI: o badge de v5.1 usa `zenodo.10458671` (v5.1:README.md) `[INFERÊNCIA: DOI do primeiro depósito/concept; a ligação 10458671↔v0.1 não está escrita]`.

### 2.2 v0.2-alpha — "Segundo Release para o Zenodo"
- **Data**: tag 2024-03-05 (`f32ca2c`); release 2024-03-05. Nota: "Com atualização da lista de IPTs para o formato CSV".
- **README** (v0.2-alpha:README.md, "Motivação e Justificativa - V.2"; o README antigo vira `README.v1.md`): "O início deste projeto tinha uma motivação e justificativa mais modesta… Entretanto, com o avançar do desenvolvimento da ferramenta, o escopo do projeto se ampliou." Três passos: Flora → Fauna ("surgiu a ideia de também incorporar os dados da fauna") → ocorrências ("o código implementado era genérico o suficiente para reconhecer e automatizar a conversão de diferentes 'cores'").
- **Números**: "cerca de 278 mil nomes de espécie e cerca de 12 milhões de fichas de ocorrências, provenientes de 458 recursos publicados em 10 diferentes IPTs". Frase-chave: "todo o banco de dados é atualizado em poucos minutos, apenas clicando nas 'actions'". "Estamos experimentado ofertar o acesso público ao banco de dados".
- **Mudanças vs. 0.1**: +Fauna, +ocorrências, +`referencias/agregacoes/*.js` (pipelines MongoDB: `contaOcorrenciasPorIPT`, `ocorrenciasComGeoPoints`, `taxaThreatStatus`, `animaliaAmeacados202402` – primeiras consultas de ameaça, fev/2024, `e2e5773`), `matrizSelecaoFontes.md` (`f0b3c82`, 2024-01-29: seleção de recursos duplicados entre IPTs), `occurrences.csv` (lista de recursos), `flatScientificName` (`00f3842`), `geoPoint` (`0e35d41`), API `plotOccurrences` (`referencias/api/exemplosAPI.md`: busca por espécie e por proximidade `maxDistance`, em metros).

### 2.3 v4.0 / v4.0.0 / v4.0.1 — "Base de Dados Integrada da Biodiversidade Brasileira"
- **Datas**: v4.0 e v4.0.0 em 2025-04-21 (`94533d5`, `a14a319`); release v4.0 2025-04-21T11:57; v4.0.1 `25ba6ed` release 2025-04-22. Release v4.0/v4.0.1 (mesmo texto): "Criação de uma base de dados em JSON da biodiversidade brasileira, integrando dados taxonômicos da flora, fungos e fauna com dados de ocorrência." Entre v4.0 e v4.0.1 só README muda (`8bf3320`, `463eade`, 2025-04-22) `[INFERÊNCIA: git diff --stat v4.0 v4.0.1 não foi inspecionado em detalhe]`. O README é renomeado: `# Base de Dados Integrada da Biodiversidade Brasileira # (DwC2JSON V4.0)`, DOI `zenodo.10782707`.
- **Histórico narrado no README** (v4.0:README.md): três etapas — Flora; Fauna ("mais de 290 mil nomes"); ocorrências "de 15 diferentes IPTs, 493 conjuntos de dados" com curadoria anti-duplicação ("matriz de seleção"). Diferencial: "todo o domingo 3 'actions' de atualização da base de dados no MongoDB são acionadas".
- **Interfaces citadas** (v4.0:README.md): Busca por gênero ou espécie `https://dwc2json.dalc.in/taxa`; APIs `/api`; Mapa `/mapa`; Dashboard `/dashboard` (migração do domínio deno.dev para `dwc2json.dalc.in`).
- **Visão** ("Versão atual da proposta"): base integrada "valioso, que pode: servir para gerar informação relevante para a conservação…; possibilitar a agregação de outros conjuntos de dados relevantes, como dados de espécies invasoras, dados de avaliação de risco de extinção, dados de interação…; ser utilizado para treinar modelos de inteligência artificial". "Evolução": "agregar qualidade nestes conjuntos de dados, em especial nos dados de ocorrência, notoriamente de baixa qualidade".
- **Arquitetura**: Deno/TS + Astro + MongoDB (2 coleções "taxa" e "ocorrencias") + Docker/GHCR + Actions semanais. Docs: `atualizacao.md` (diagrama Mermaid `stateDiagram-v2` das 3 actions), `esquema.md` (Mermaid `flowchart` das relações entre IPTs: SiBBr, JBRJ, JABOT, REFLORA, FIOCRUZ, CRIA, TAXONLINE…), `referencias/dashboard.md`.

### 2.4 v5.0 — "ChatBB - O 'chat' da Biodiversidade Brasileira (DWC2JSON V5.0)"
- **Data**: tag 2025-05-25 (`d8c3f0a`); release 2025-05-25. Nota: "se aproveita do protocolo MCP, desenvolvido pela empresa Athropic, implementado recentemente pelos desenvolvedores do MongoDB, para conectar a base de dados integrada… com a plataforma da OpenIA e criar o 'ChatBB - O Assistente Virtual Inteligente da Biodiversidade Brasileira'".
- **README** (v5.0:README.md): "O 'ChatBB' é um assistente de inteligência artificial que usa um 'Large Language Models' (LLM) da empresa OpenIA… para interpretar e responder perguntas sobre espécies da biodiversidade brasileira e suas ocorrências, seu grau de ameaça, espécies invasoras e unidades de conservação". "O ChatBB ainda está em fase de testes e ajustes em seu 'prompt'".
- **Coleções ofertadas ao LLM**: Flora e Funga; Fauna; invasoras (Instituto Hórus); flora ameaçada (CNCFlora, até 2022); fauna ameaçada (MMA, 2021); UCs do CNUC (até março/2025); "Cerca de 12 milhões de registros… de cerca de 490 repositórios".
- **Mudanças vs. v4**: +`web/src/pages/api/chat.ts`, `Chat.tsx`, `chatbb/` (prompt, `fontes/cnuc_2025_03.csv`, `fauna-ameacada-2021.csv`), `chatbb.md`, e as **três fontes temáticas** (ameaçadas/invasoras/UCs) como coleções adicionais (prompts de 2025-05-18/20 a incluem). Marcador de que eram planejadas desde v4 ("espécies invasoras… risco de extinção"). Nota: no README antigo, `README.v1/v2/v4.md` preservados.
- **Por quê** (commits): "feat(chat): Adiciona funcionalidade de chat" `9ec062a` 2025-05-14; 34 commits entre 05-14 e 05-26 afinando o prompt (`c92fbd2`, `103d593` inclui UCs, `ef32f51` invasoras, `40b18ab` cncflora2022). Exemplos públicos de conversa em `trilium.dalc.in/share/...` (10 links).
- **Custo declarado**: LLM "OpenAI (4.1-mini)", chave de API própria do usuário, "valor mínimo… USD$5, mas com este valor é possível realizar milhares de consultas".

### 2.5 v5.1 e v5.2 — "ChatBB…" (mesma árvore)
- **Datas**: ambas apontam para `e735916` (2025-07-12 "Update README.md"); releases 2025-07-12T08:42 (v5.1) e 19:13 (v5.2). Notas v5.1: "Adição do Gemini / Mudança para a Biopinda"; v5.2: "Novo release para publicação no Zenodo após mudança para BioPinDa / Adição do Gemini".
- **Mudanças vs. v5.0** (`git diff --stat v5.0 v5.1`, 19 arquivos): `ModelSelector.tsx`, `PasswordInput.tsx`, `Chat.tsx` reescrito (478 linhas alteradas), `prompt.md` externo (`092c477`, 2025-07-10: "Substitui prompt do sistema por arquivo externo"), patch `@ai-sdk/google`. `4fccef3` (2025-05-17) "Adiciona Gemini"; `c5f48df`/`308cd58` (2025-07-09) ajustam modelos, padrão volta a gpt-4.1-mini.
- **README**: igual ao v5.0 + badge DOI e citação: "Henrique Pinheiro, & Eduardo Dalcin. (2025). edalcin/DarwinCoreJSON: ChatBB … (v5.0). Zenodo. https://doi.org/10.5281/zenodo.15511063". Menciona-se agora explícito em ChatBB "OpenAI (4.1-mini)".
- **Lacuna de evidência**: a nota "mudança para a Biopinda" aparece na release de 2025-07-12, mas o README da tag ainda cita `edalcin/DarwinCoreJSON`; a mudança de URLs para `biopinda/Biodiversidade-Online` está em `00ef6ef` (2025-08-19 "Atualizar todas as referências do repositório para novo endereço") e `475d73f` (2025-08-01). `[INFERÊNCIA: "BioPinDa" é a organização GitHub biopinda para onde o repositório migrou; a release foi editada depois]`.

### 2.6 v6.0 — "Biodiversidade.Online"
- **Data**: tag 2025-09-22 (`9ea6e50`); release 2025-09-22. Nota: "O projeto foi renomeado para 'Biodiversidade.Online - Uma Base de Dados Integrada da Biodiversidade Brasileira', agora com uma nova estrutura, voltada para 'Spec-Driven Development' (SDD)".
- **Commits do marco**: `b2d6da0` (2025-09-17 "Transforma em monorepo"), `daf6423` (2025-09-22 "Rename project to 'Biodiversidade.Online'"), `c25f774` (2025-09-22 "Constitui SpecKit"), `faae79d` (ruler + prettier). Agentes de IA no desenvolvimento: `.ruler/AGENTS.md`, "Implementação com GPT Codex" `2454f01` (2025-10-06).
- **README** (v6.0:README.md): "sistema automatizado de integração e processamento de dados de biodiversidade brasileira, desenvolvido em TypeScript executado com Bun… em uma base de dados MongoDB unificada". Arquitetura: `packages/ingest`, `packages/web` (Astro/Tailwind), `docs/`, workflows. Stack: Bun, TypeScript, MongoDB, GitHub Actions, Docker. O README lista "Versão Atual - V5.0" no corpo (inconsistência interna: título já V6).
- **Interfaces listadas** (todas sob `https://biodiversidade.online/`): `calendario-fenologico`, `taxa`, `api`, `mapa`, `dashboard`, `chat`; e protótipo `https://web.dalc.in/sandbox/meilisearch/` (busca com search engine intermediário).
- **Fontes** (v6.0): Flora e Funga, Fauna, Instituto Hórus, CNCFlora, MMA, CNUC, "~12 milhões de registros… ~490 repositórios IPT".
- **Aponta para fora**: projeto relacionado `edalcin/coletoresDWC2JSON` (canonicalização de coletores; `a52ada4`, 2025-09-19).
- **Citação**: DOI `zenodo.15261018` (v6.0:README.md).

### 2.7 v6.1 — "Base de Dados Integrada da Biodiversidade Brasileira - Versão 6.1" (Latest no GitHub)
- **Data**: tag 2026-02-17 (`edad8be`); release 2026-02-17. Nota: "Base de dados unificada…, integrando dados taxonômicos (flora, fauna), registros de ocorrência e dados de enriquecimento (espécies ameaçadas, invasoras, unidades de conservação), com acesso via Dashboard analítico, assistente conversacional (ChatBB) e REST API."
- **README** (v6.1:README.md, "Objetivo"): "Construir uma **base de dados unificada da biodiversidade brasileira**, … com acesso via **Dashboard analítico**, **assistente conversacional (ChatBB)** e **REST API**." Seção "Arquitetura C4": três contextos (Aquisição, Transformação, Apresentação) em Mermaid `graph TB`, com "🔜 Ameaçadas/Invasoras/UCs" marcadas como futuras no diagrama (embora já tivessem workflows `enrich-*` no mesmo dia: `7a4c3e7`, 2026-02-18).
- **Stack**: Bun, TypeScript, Astro + Astro Islands, Tailwind, MongoDB, "Claude API (Anthropic) via MCP", Swagger/OpenAPI, GitHub Actions "manuais", Docker.
- **Mudanças vs. v6.0**: `b41bf0e` (2026-02-17 "reestruturar projeto para V6.0 com arquitetura C4"): remove páginas `taxa`, `mapa`, `mapaocorrencia`, `calendario-fenologico`; `packages/transform`, `shared`; `d3511d5` (2026-02-06) remove Meilisearch e Speckit; GPL v3 (`812f104`, 2026-01-08).
- **Dashboard**: `402ef3a` (2025-12-21, "Dashboard Homepage (MVP)") após specs `29deaf8` (2025-12-20 "ChatBB v5.1 – Scope Redefinition"): três pontos de acesso — Dashboard (homepage), ChatBB (MCP), REST API (Swagger).
- **Enriquecimento "in-place"**: `7a4c3e7` (2026-02-18): "Abandona o pipeline de 2 estágios (taxa_ipt → taxa) e implementa enriquecimento diretamente nas coleções principais via $set/$unset"; loaders `loadFaunaAmeacada`, `loadPlantaeAmeacada`, `loadFungiAmeacada`, `loadInvasoras`, `loadCatalogoUCs`; campos `threatStatus`, `invasiveStatus`, `conservationUnits`.
- **Pós-tag** (ainda MongoDB/Astro): painel admin com PIN (`6cafb7b`, 02-18) simplificado (`f655eb6`); fluxo "smartLattes" para configurar IA no ChatBB (`1a8d816`, 02-19); remoção de `/tree` e `/taxon` (`b12a316`, `079d7cc`, 02-19); fix Anthropic no ChatBB (`b184eed`, 2026-02-21).
- DOI: `zenodo.18668804` (`38c5b12`, 2026-02-18).

### 2.8 V7 — suite Go + MongoDB (sem tag)
- **Período**: 2026-05-05 → 2026-09-13 (main). Spec: `9cd4337` (2026-05-06) "adicionar refatoração para contexto de aquisição apenas": "eliminar contextos de Enriquecimento e Apresentação, manter só Aquisição via 3 binários Go independentes para Windows que populam taxa/occurrences/ingest_runs no MongoDB dwc2json… Sem Docker, sem GitHub Actions, sem UI. Credenciais apenas em .env local." `specs/001-refactor-acquisition/` (spec, plan, research, data-model, contracts, 59 tarefas).
- **Implementação**: `63666df` (2026-05-07 "implementar contexto de aquisição Go (V7) — Phases 1-5": `internal/dwca`, `mongostore`, `ingest`, `cmd/update-fauna|flora|occurrences`, ~10MB cada); depois `20e32a3` ("remover contextos V6 — Astro/Bun/TS/workflows": remove `packages/`, workflows `update-mongodb-*`, `enrich-*`, docs); README V7 `1a7b436` (2026-05-07): "suite de aplicativos independentes que integram, curiam, enriquecem e apresentam dados… Cada contexto é um aplicativo autônomo que opera sobre um banco MongoDB compartilhado (`dwc2json`)"; tabela de contextos: Aquisição ✅ V7.0 Go CLI; Curadoria, Enriquecimento, Apresentação "🔜 Planejado".
- **Harmonização nasce**: `06fccd6` (2026-05-11) "harmonize PT->EN DwC values on taxa ingestion"; `64bace0` (05-07) extensões DwC-A na coleção `taxa` + filtro de rank; `4a0e930` (05-11) "skip ingest on identical packageId + final run report"; `39e28b2` ipt-compare; relatório final `.md` (`fcaa31e`, 05-14); `3cda789` (05-10) reorganiza em `contextos/aquisicao/`; `b782b55` (2026-05-20) remove definitivamente o código legado v6.1 (também resolve alerta Dependabot #51 do Astro).
- **Por que o pivot** (evidência): a própria mensagem de `9cd4337` (escopo único, sem UI/Docker/Actions); `b782b55` ("Legacy code had no operational value — project is now pure Go + MongoDB"); alertas Dependabot (`fda935b`, `3c1c7b4`). `[INFERÊNCIA: motivação de custo/manutenção de uma stack web+IA com dependências vulneráveis; o texto da spec `specs/001-refactor-acquisition/spec.md` não foi lido nesta pesquisa]`.

### 2.9 DuckDB, script único (HEAD)
- **Data**: `dd14da5`, 2026-09-14: "refactor: substituir MongoDB por DuckDB, colapsar suite em script unico". Motivos no corpo do commit: "Motor: DuckDB (ADR 0001), analitico/colunar, adequado a 512+ fontes IPT"; "Script unico e sequencial (ADR 0002)"; "Esquema fixo Darwin Core em vez de passthrough (ADR 0003)"; "Extensoes de taxon normalizadas em tabelas proprias (ADR 0004)"; "ipt_sources.csv unico substitui IPT_FAUNA_URL/IPT_FLORA_URL + occurrences.csv"; "Repo achatado… sem Docker/CI/Unraid (fora de escopo agora)".
- **README HEAD**: "uma ferramenta de linha de comando, de propósito único: um script Go que baixa Darwin Core Archives (DwC-A) publicados por fontes IPT — fauna, flora e 512 coleções de ocorrências — e grava um único arquivo DuckDB local, com dados harmonizados e nomeados segundo o padrão Darwin Core." "Não há mais suite multi-contexto, banco compartilhado ou serviço hospedado".
- **Números HEAD**: 514 fontes (2 `taxa` + 512 `ocorrencias`), verificado 2026-09-14; 8 tabelas (`taxon`, `occurrence`, 6 de extensão) + `ingest_runs`.
- **ADRs** (`docs/adr/`): 0001 DuckDB sobre SQLite (padrão analítico, "dezenas de milhões" de registros); 0002 script único sequencial (DuckDB aceita uma conexão de escrita); 0003 esquema fixo DwC; 0004 tabelas normalizadas para extensões; 0005 atualização manual de `ipt_sources.csv` via flag `-update-sources`, isolada por host (não acoplada à ingestão, pois hosts IPT caem).
- **Pós-dd14da5**: `5beac94` (09-14) remove scaffolding specify/openwiki, adiciona `AGENTS.md` e husky; `7290bc9` (09-17) retry de DNS no download; `ac51446` relatório `reports/occurrence_unique_values.md`; `a708577` (09-17) atualização manual de `ipt-sources`; `c0f6a41` (2026-10-28) bump `klauspost/compress` (Dependabot #65).
- **Vocabulário** (`CONTEXT.md`): Fonte IPT, Inventário do IPT, **Harmonização** ("normalizar um registro bruto… coerção de tipos, tradução PT→EN de valores canônicos, filtragem de táxons não-folha, e descarte de campos fora do padrão DwC"), **Execução (Ingest Run)**, Taxon/Occurrence, Tabela de extensão.
- **Licença/DOI**: GPL v3 (badge e `LICENSE`), DOI `zenodo.18668804`.

### 2.10 Processos de ingestão (como evoluíram)
| Fase | Limpeza/seleção | Harmonização | Fonte |
|---|---|---|---|
| v0.1 | exclui táxons não desejados (`2ed431d`, 2023-04-27); remove `vegetationType` redundante (`d0b217b`) | conversão DwC→JSON por "core" genérico | v0.1-alpha:src |
| v0.2–v4 | "matriz de seleção" de recursos duplicados entre IPTs (`f0b3c82`); remoção de herbários duplicados (`24b1e40`); `flatScientificName`, `canonicalName`, `geoPoint` | passthrough de campos DwC no documento JSON; extensões como campos aninhados | v4.0:README.md, `matrizSelecaoFontes.md` |
| v5–v6.1 | itens "raw" → transformados; nomes de estado harmonizados no mapa (`e05e440`, 2025-09-23) | transform/enrich in-place (v6.1 `7a4c3e7`) | v6.1:docs/funcionamento.md |
| V7 | filtro leaf-rank (`64bace0`), skip por `packageId` | PT→EN (`06fccd6`) | commits |
| HEAD | upsert idempotente + `delete-not-seen` + auditoria `ingest_runs`; coordenadas suspeitas sinalizadas, não descartadas | esquema fixo DwC, extensões normalizadas, deduplicação/merge de extensões | README HEAD, ADR 0003/0004 |

## 3. A interface de acesso (web)

| Parte | Chegou | Saiu | Evidência |
|---|---|---|---|
| Busca/ficha de espécie (`/taxa`, `/taxon/<id>`) | 2023-04-29 (`a9ac954`, `396e89d`) | `/taxon` removida 2026-02-19 (`b12a316`); `/taxa` legada removida em `b41bf0e` (2026-02-17) | README v4/v6.0; commits |
| API JSON (`/api`, `plotOccurrences`) | 2023-04 ("endpoint para taxon como json" `25c69ad`); OpenAPI 3.1 `f944437` (2024-07-01) | endpoints de `tree` removidos 2026-02-19 (`079d7cc`) | v0.2-alpha:referencias/api/exemplosAPI.md |
| Mapa de ocorrências por táxon | 2023-11-04 (`c58ba5b`) | — | commits |
| Mapa de distribuição/`/mapa` com filtros | 2023-11-05 `d03e5e8`, filtros `f9b7ef3` (2025-02-18); mapa por estado 2025-09-22 (`aaefa06`) | removido em `b41bf0e` (2026-02-17) | v4.0:README.md "Mapa de Distribuição" |
| Dashboard | página 2024-06-27 (`c8f3710`); abas/invasoras 2025-08-18; MVP "homepage" 2025-12-21 (`402ef3a`) | removido com a suite Web em `20e32a3` (2026-05-07) | v4.0:referencias/dashboard.md |
| Árvore taxonômica (`/tree`) | 2025-03-14 (`037e4dd`) | 2026-02-19 (`b12a316`) | commits |
| Calendário fenológico | 2025-09-08 (`e7b8684`) | 2026-02-17 (`b41bf0e`) | v6.0:README.md |
| ChatBB (`/chat`) | 2025-05-14 (`9ec062a`) | 2026-05-07 (`20e32a3`) | §4 |
| Meilisearch (protótipo `web.dalc.in/sandbox/meilisearch`) | ~2025-09-16 (`9e32e27`) | 2026-02-06 (`d3511d5`) | commits |
| Painel admin (PIN) | 2026-02-18 (`6cafb7b`) | simplificado 02-19 (`f655eb6`); removido `20e32a3` | commits |

- **Stack da web**: Astro (v4.x, 2023-12 `d5de081`; depois Astro Islands, React `*.tsx`, shadcn-style `ui/`), Tailwind, Deno (2023-10 → ≥2025-04 "Deno 2.x" `c7fee83`), depois Bun/Node (monorepo 2025-09). Mapas: componente `Map.astro`/`Map.tsx`; gráficos `Pie.astro`; árvore `Tree.tsx`; Swagger `SwaggerDocs.tsx` (v5.1:web/src/components).
- **URLs públicas nos docs**: `https://dwca2json.deno.dev/taxa/` (v0.1/v0.2; também `/mapa`, `/dashboard`, `/api/plotOccurrences?…`); `https://dwc2json.dalc.in/{taxa,api,mapa,dashboard}` (v4.0); `https://biodiversidade.online/{taxa,api,mapa,dashboard,chat,calendario-fenologico}` (v6.0:README.md); `https://web.dalc.in/sandbox/meilisearch/` (v6.0). Localhost `:4321` + `/api/docs` (v6.1). Rastreamento: Matomo (`07f7d9c`, 2023-10-30; `3648f05`, 2025-05-23).
- **Rotas do v6.1** (v6.1:docs/funcionamento.md §7.2): `/`, `/dashboard`, `/chat`, `/api/docs`, `/api/taxa`, `/api/occurrences`, `/api/occurrences/geojson`, `/api/dashboard/summary`, `/api/health`, `/api/chat`. Cache de dashboard pré-computado (§9).
- **Estado atual**: nenhuma interface web neste repositório (README HEAD: "Não há mais… serviço hospedado").

## 4. ChatBB

- **Chegada**: commit `9ec062a`, 2025-05-14 ("feat(chat): Adiciona funcionalidade de chat"); página própria `40fae26` (2025-05-20); release v5.0 em 2025-05-25.
- **Como foi descrito**: "assistente virtual inteligente da biodiversidade brasileira" (release v5.0); "O 'ChatBB' é um assistente de inteligência artificial…" (v5.0:README.md); v6.1:docs/chatbb.md: "usa um 'Large Language Models' (LLM) das empresas OpenIA e Google".
- **Como consulta o banco** (v5.0:web/src/pages/api/chat.ts; v6.1:docs/funcionamento.md §8): Vercel AI SDK (`streamText`) + MCP client por stdio rodando `npx mongodb-mcp-server` (`--readOnly` em v6.1), que expõe `find`/`aggregate` ao LLM; o LLM monta as queries sobre as coleções (`taxa`, `ocorrencias`, `invasoras`, `cncflora2022`, `ucs` no prompt de v5.1). Há `safeTools()` que protege chamadas (`5e2e460`, 2025-05-14). `[INFERÊNCIA: os nomes exatos das duas ferramentas MCP ficam em funcionamento.md §8.2, linha 696, só parcialmente lidos]`.
- **Provedores/modelos**: v5.0 só OpenAI `gpt-4.1-mini` (chave do usuário no browser); v5.1 +Google Gemini com `ModelSelector`; v6.1:docs/funcionamento.md lista OpenAI (GPT-4o-mini default, GPT-4o, o1) e Google (Gemini 2.0 Flash, 1.5 Pro) `[INFERÊNCIA: tabela datada, difere do default 4.1-mini de v5.1]`; README v6.1 cita "Claude API (Anthropic)"/`CLAUDE_API_KEY`; commit `b184eed` (2026-02-21) "fix Anthropic no ChatBB"; `1a8d816` fluxo "smartLattes" de configuração.
- **Prompt**: `chatbb/promptOtimizado.md` (v5.0) → `web/src/prompts/prompt.md` externo (v5.1, 292 linhas) e `chatbb/fontes/promptV1.txt`. Seções: "Função" (criado por Dalcin e Pinheiro), "Escopo" (só espécies brasileiras de Animalia/Plantae/Fungi), "Fonte de dados (MongoDB dwc2json)", categorias IUCN (EN, VU, NT, CR, LC, DD), regras de sinônimo (`00c5158`, `34232a1`). Evolução: 54 commits de ajuste de prompt entre 2025-05-14 e 2025-06-08.
- **Mudanças posteriores**: spec v5.1 (2025-12-20): ChatBB como um dos "three complementary access points" (Dashboard, ChatBB via MCP, REST API); `fix MCP` pós-monorepo (`0cffa85`, `8a09165`, 2025-09-18); MCP do MongoDB 1.0.0+ (`7942785`, 2025-10-06); remoção do histórico/`ChatHistoryList` não verificada.
- **Saída do repositório**: removido junto de toda a web em `20e32a3` (2026-05-07). `docs/chatbb.md` foi para `docs/legacy/chatbb.md` e depois deletado em `dd14da5`. Os docs **não dizem** para onde o ChatBB foi; README V7 apenas marca Apresentação (Dashboard, ChatBB, REST API) como "🔜 Planejado". Um caminho natural, citado em `CLAUDE.md`/`.mcp.json` do HEAD, é consultar o `.duckdb` por MCP `[INFERÊNCIA — não lido; verificar `.mcp.json` no HEAD]`.

## 5. Nomes, autores, DOIs, licença, instituições

**Nomes do projeto (cronologia)**: "Darwin Core JSON" (2022-12, `da275a7`) → "Darwin Core Archive to JSON – Flora e Funga do Brasil" (v0.1) → "Darwin Core Archive to JSON" / DWC2JSON (v0.2) → "Base de Dados Integrada da Biodiversidade Brasileira (DwC2JSON V4.0)" (v4.0) → "ChatBB – O 'chat' da Biodiversidade Brasileira (DwC2JSON V5.0)" (v5.0–v5.2) → "Biodiversidade.Online – Uma Base de Dados Integrada da Biodiversidade Brasileira" (v6.0, `daf6423`) → "Biodiversidade.Online V6.1" → "Biodiversidade.Online — Suite de Aplicativos…" (V7, `1a7b436`) → "Biodiversidade.Online — Base DuckDB de Espécies e Ocorrências" (HEAD, `CONTEXT.md`). Nome interno do banco MongoDB permaneceu `dwc2json` até V7 (v6.1:docs/funcionamento.md linha 29: "uma referência direta ao processo central").

**Repositório**: `edalcin/DarwinCoreJSON` → `biopinda/Biodiversidade-Online` (`b2899e3`/`00ef6ef`, 2025-08-19; imagem Docker `ghcr.io/biopinda/darwincorejson`/`biodiversidade-online`).

**Autores**: Eduardo Dalcin (`edalcin`) e Henrique Pinheiro (`Phenome`) em todos os READMEs. Co-autoria de agentes: commits marcados "Co-Authored-By: Claude Opus 4.6/4.7, Sonnet 4.6, Haiku 4.5" (V6.0→HEAD); "Implementação com GPT Codex" (`2454f01`).

**Zenodo DOIs** (conforme README de cada tag): `10.5281/zenodo.10458671` (badge v5.1, repo-level); `10.5281/zenodo.10782707` (v4.0); `10.5281/zenodo.15511063` (v5.0, citação); `10.5281/zenodo.15261018` (v6.0/v6.1 README); `10.5281/zenodo.18668804` (V6.1 → HEAD, `38c5b12`). `[INFERÊNCIA]`: 15261018 antecede 15511063 numericamente mas é citado depois (concept DOI?).

**Licença**: README v6.0 "software livre para a comunidade científica brasileira" (sem arquivo); **GPL v3** adicionada em 2026-01-08 (`812f104`). v6.1 tem `LICENSE`; HEAD tem badge GPL v3.

**Instituições/fontes nomeadas**: JBRJ (IPT institucional, Flora e Funga, Catálogo da Fauna); Reflora/JABOT; SiBBr; GBIF (formato DwC-A); INPA, MPEG, Museu Nacional, MUZUSP, FIOCRUZ, CRIA, TAXONLINE, speciesLink; CNCFlora (ameaçadas da flora, até 2022); MMA (fauna ameaçada 2021; CNUC/UCs, dados.mma.gov.br); Instituto Hórus (invasoras); IBGE (citado sobre qualidade de dados de biodiversidade, v4.0:README.md; códigos IBGE de estados em v6.1); Anthropic/MongoDB (MCP). "BioPinDa" = organização `biopinda` `[INFERÊNCIA]`.

## 6. Linha do tempo consolidada

| Data | Marco | Mudança em uma linha |
|---|---|---|
| 2022-12-09 | Primeiro commit (`720df9d`) | "Darwin Core JSON": IPT → JSON (diagrama de 2 nós) |
| 2023-04-22 | Primeiro parser + web | Parser DwC→JSON, Astro, Cloud Run, MongoDB |
| 2023-10-25 | Deno Deploy | Migra de Cloud Run para Deno + Deno Deploy |
| 2023-11-05 | Ocorrências | Importa ocorrências no MongoDB |
| 2023-12-13 | Fauna | Adiciona reino Animalia |
| 2024-01-04 | v0.1-alpha | Primeiro release (Zenodo), só Flora e Funga |
| 2024-03-05 | v0.2-alpha | 278 mil nomes, 12 mi ocorrências, 458 recursos, 10 IPTs |
| 2024-06-27 | Dashboard | Página `/dashboard` |
| 2025-04-21 | v4.0 | "Base de Dados Integrada…": 290 mil nomes, 15 IPTs, 493 recursos |
| 2025-05-14 | ChatBB (commit) | Chat com LLM via MCP + MongoDB |
| 2025-05-25 | v5.0 | ChatBB (OpenAI 4.1-mini) + invasoras, ameaçadas, UCs |
| 2025-07-12 | v5.1/v5.2 | Gemini, seletor de modelo, prompt externo, BioPinDa |
| 2025-08-19 | Novo repo | Migração para `biopinda/Biodiversidade-Online` |
| 2025-09-22 | v6.0 | Renomeado "Biodiversidade.Online"; monorepo; SDD (SpecKit) |
| 2025-12-20/21 | Spec v5.1 + Dashboard | Dashboard vira homepage; 3 pontos de acesso |
| 2026-01-08 | Licença | GPL v3 |
| 2026-02-17 | v6.1 | C4 (Aquisição, Transformação, Apresentação); enriquecimento in-place (02-18) |
| 2026-02-19 | Poda da web | `/tree` e `/taxon` removidos |
| 2026-05-06/07 | V7 | Go, 3 binários, MongoDB; remove Astro/Bun/Actions/Docker |
| 2026-05-11 | Harmonização PT→EN | `06fccd6`; skip por `packageId` |
| 2026-05-20 | Fim do legado | `b782b55` remove código v6.1 arquivado |
| 2026-09-14 | DuckDB/HEAD | `dd14da5`: um script Go, um `.duckdb`, 5 ADRs |

### Pontos de virada narrativos
1. **JSON em vez de relacional → fauna → ocorrências (2023)**: causa = generalidade do parser (v0.2-alpha:README.md: "O código implementado era genérico o suficiente…"). Evidência: `73018cc`, `58915b9`.
2. **De "ferramenta" a "base integrada" (v4.0, 2025-04)**: o produto passa a ser "os dois conjuntos de dados em formato JSON… 'taxa' e 'ocorrencias'" (v4.0:README.md) e se promete servir de base para IA e novos conjuntos temáticos.
3. **IA conversacional (v5.0, 2025-05)**: MCP do MongoDB torna possível "perguntar" ao banco; evidência: release v5.0 + `9ec062a`; consequência: três fontes temáticas entram como coleções (prompt).
4. **Mudança de casa e de nome (2025-08/09)**: `biopinda`, "Biodiversidade.Online", monorepo, SDD/SpecKit/agents (release v6.0).
5. **Reposicionamento (2025-12 → 2026-02)**: spec "Scope Redefinition" (`29deaf8`) corta mapas/árvore/busca/calendário e deixa Dashboard + ChatBB + API; v6.1 organiza em C4 e enriquece in-place (`7a4c3e7`).
6. **Corte de escopo para Aquisição (V7, 2026-05)**: `9cd4337` elimina Enriquecimento/Apresentação, "sem UI"; `20e32a3` e `b782b55` apagam a web. Causas visíveis: manutenção/segurança (Dependabot #51, `fda935b`) `[INFERÊNCIA]`.
7. **DuckDB + script único (2026-09)**: de documentos passthrough (MongoDB) para esquema fixo relacional; causa nos ADRs 0001–0004 (consulta analítica sobre dezenas de milhões de linhas; uma só conexão de escrita; harmonização exige colunas definidas).

## 7. Ativos visuais reutilizáveis

Nenhuma imagem/screenshot raster no histórico (`git log --diff-filter=A` só lista favicons e SVGs de logo). Reutilizáveis:
- **Mermaid** (reaproveitar como base de slides): `graph TD` de 2 nós (`da275a7`:README.md); `stateDiagram-v2` das 3 actions (v4.0:atualizacao.md); `flowchart LR` de relações entre IPTs (v4.0:esquema.md; v6.1:docs/esquema.md); `graph TB` C4 Aquisição/Transformação/Apresentação (v6.1:README.md); `C4Context` + C4 de containers da suite V7 (`1a7b436`:README.md); `C4Context` + `C4Container` do script único (HEAD:README.md).
- **SVG/logos**: `web/public/{favicon.svg,flora.svg,logoReflora.svg}` (v0.1-alpha), `animalia.svg`, `fungi.svg`, `plantae.svg` (v5.1+; v6.1: `packages/web/public/`).
- **Excalidraw**: `docs/images/biodiv.online.excalidraw` (v6.1; 4006 linhas, removido em `20e32a3`).
- **JSON schemas**: `docs/schema-dwc2json-{taxa,ocorrencias}-mongoDBJSON.json` (v6.1) — documentam o esquema MongoDB que o DuckDB substituiu.
- **Exemplos de conversas do ChatBB** (links Trilium em README v5.0, v6.1): úteis como "demonstração" sem screenshot.
- **Dados**: `referencias/occurrences.csv` (458 → 493 → ~505 → 512 linhas, curva de crescimento de fontes), `ipt_sources.csv` (HEAD).

## 8. Lacunas

- Hash do commit "Dashboard MVP" (`402ef3a`) e outros desta tabela vêm de `git log --grep`; a linhagem das tags ≠ `main` (aviso inicial). Não verificado se `main` contém os mesmos commits com hashes distintos.
- **Número de fontes por tag**: v6.1 (`~505` em funcionamento.md) vs "~490" no README; HEAD 512. Não medido contagem de linhas de `occurrences.csv` por tag.
- **Nomes das 2 ferramentas MCP** e detalhes de `CLAUDE_API_KEY`/Anthropic no ChatBB final: só parcialmente lidos.
- **Destino do ChatBB** após V7: nenhum doc responde.
- **Texto de `specs/001-refactor-acquisition/spec.md`** (motivação do V7) não lido; motivos citados vêm das mensagens de commit.
- **Relação DOI ↔ versão** (10458671, 15261018): só os badges; não consultado Zenodo.
- **v4.0 vs v4.0.1 vs v4.0.0** e **v5.1 vs v5.2**: v5.1 e v5.2 são o mesmo commit; v4.0.0/v4.0 diferem; diff v4.0→v4.0.1 limitado ao README (`git diff --stat` retornou sem destaque; não lido).
- **Datas de release vs. tag**: v0.1-alpha tag 2023-12-23, release 2024-01-04; v5.1/v5.2 releases editadas após a migração BioPinDa (2025-08-19).
- Sem verificação de URLs públicas (`biodiversidade.online`, `dwc2json.dalc.in`) — apenas citadas.
