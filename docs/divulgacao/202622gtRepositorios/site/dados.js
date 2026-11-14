// Todo o conteúdo de tela. Fonte: ../roteiro.md (citações e números são literais; não editar aqui sem editar lá).
// Mini-marcação lida por rico() em trilha.js: `código`, _itálico_, **forte**.

export const ui = {
  parada: "Parada",
  passo: "passo",
  de: "de",
  abertura: "abertura",
  fecho: "Fecho",
  trilha: "A trilha",
  ingestao: "Ingestão nesta época",
  evidencia: "Evidência",
  chegou: "Chegou",
  origem: "Origem",
  numero: "Número",
  chave: "Chave de ligação",
  limite: "Limite",
  aCaminho: "a caminho",
  integrada: "integrada",
  naoIntegrada: "não integrada",
  reinos: { animalia: "Animalia", plantae: "Plantae", fungi: "Fungi" },
  grafo: "Coleções do MongoDB e as chaves que ligam uma à outra",
  miniTrilha: "Paradas da trilha",
};

export const fontes = [
  { id: "especies", rotulo: "Espécies", icone: "bx-leaf" },
  { id: "ocorrencias", rotulo: "Ocorrências", icone: "bx-map-pin" },
  { id: "ameacadas", rotulo: "Ameaçadas", icone: "bx-error" },
  { id: "invasoras", rotulo: "Invasoras", icone: "bx-bug" },
  { id: "ucs", rotulo: "UCs", icone: "bx-landscape" },
];

export const telas = [
  {
    id: "hub",
    passos: 1,
    minutos: 1,
    titulo: "A trilha da base integrada",
    subtitulo: "Biodiversidade.Online: de DWC2JSON ao DuckDB, 2022–2026",
    assinatura: ["Eduardo Dalcin · Henrique Pinheiro", "GT Repositórios · 26/11/2026"],
    descricao:
      "Perfil de uma serra coberta de floresta. A trilha sobe por três paradas até um mirante, o ChatBB. Um trecho tracejado continua no alto e termina. A trilha desce para uma clareira com riacho e segue para a névoa.",
    inicio: { curto: "Início da trilha", data: "2022-12-09" },
    fase1: "Fase 1 · on-line",
    fase2: "Fase 2 · dados locais",
    encerrado: "trecho on-line encerrado · 2026-05",
    selos: [],
  },
  {
    id: "1",
    passos: 4,
    minutos: 2.5,
    curto: "A semente",
    data: "2022-12 → 2024-03",
    titulo: "A semente: DWC2JSON",
    marco: "2022-12-09 (primeiro commit) → v0.1-alpha (2024-01-04) → v0.2-alpha (2024-03-05)",
    mensagem: 'Um conversor genérico de Darwin Core Archive para JSON aceitou qualquer "core". O escopo cresceu sozinho.',
    citacoes: [
      {
        de: 0,
        ate: 0,
        texto:
          "Criar uma ferramenta livre, gratuita e de código que ofereça os dados publicados pela Flora e Funga do Brasil em formato Darwin Core Archive no IPT, em formato JSON",
        fonte: "Objetivo da v0.1",
      },
      {
        de: 1,
        ate: 1,
        texto:
          "exige do {usuário, analista, cientista de dados, pesquisador etc} um esforço adicional para relacionar e integrar as diferentes tabelas",
        fonte: "O problema: a estrutura relacional do DwC-A (README v0.1)",
      },
      {
        de: 2,
        ate: 3,
        texto: "o código implementado era genérico o suficiente para reconhecer e automatizar a conversão de diferentes 'cores'",
        fonte: "A virada de escopo (README v0.2)",
      },
    ],
    interacao: {
      diagrama: { legenda: "O primeiro README do repositório, 2022-12-09", nos: ["Pega DwC do IPT", "Converte para JSON"] },
      faixas: [
        { rotulo: "Flora e Funga do Brasil", numero: "mais de 135.000 nomes científicos", versao: "v0.1" },
        { rotulo: "+ Catálogo Taxonômico da Fauna do Brasil", numero: "cerca de 278 mil nomes de espécie", versao: "v0.2" },
        {
          rotulo: "+ Ocorrências",
          numero: "cerca de 12 milhões de fichas de ocorrências, provenientes de 458 recursos publicados em 10 diferentes IPTs",
          versao: "v0.2",
        },
      ],
      figura: { antes: "1 core + N extensões, com JOINs", depois: "1 documento JSON" },
    },
    ingestao: [
      { ate: 1, texto: "Seleção: só táxons-folha (`ESPECIE`, `VARIEDADE`, `FORMA`, `SUB_ESPECIE`)." },
      { ate: 1, texto: "`canonicalName` calculado. Pula a Fonte IPT se a versão publicada não mudou." },
      {
        de: 2,
        texto: '"Matriz de seleção" para herbários publicados em mais de um IPT. Ordem: JABOT > REFLORA > speciesLink. Lista de 124 siglas.',
      },
      { texto: "Motor: Deno + TypeScript → MongoDB. Atualização por GitHub Actions." },
      { de: 2, texto: "\"todo o banco de dados é atualizado em poucos minutos, apenas clicando nas 'actions'\"" },
    ],
    evidencia: "`da275a7:README.md` · `v0.1-alpha:README.md` · `v0.2-alpha:README.md` · `v0.2-alpha:referencias/matrizSelecaoFontes.md`",
    selos: ["especies", "ocorrencias"],
  },
  {
    id: "2",
    passos: 7,
    minutos: 2.5,
    curto: "Base integrada",
    data: "2025-04",
    titulo: "Base de Dados Integrada + interface de acesso",
    marco: 'v4.0, 2025-04-21. Nome novo: "Base de Dados Integrada da Biodiversidade Brasileira (DwC2JSON V4.0)"',
    mensagem: "O produto deixou de ser o conversor. O produto passou a ser a base. A interface tornou a base visível.",
    citacoes: [
      {
        de: 0,
        ate: 0,
        texto:
          "Criação de uma base de dados em JSON da biodiversidade brasileira, integrando dados taxonômicos da flora, fungos e fauna com dados de ocorrência.",
        fonte: "Release v4.0",
      },
      { numeros: ["mais de 290 mil nomes", "15 diferentes IPTs", "493 conjuntos de dados de ocorrências"], fonte: "README v4.0" },
      { de: 1, ate: 5, nota: "Endereços da época: `dwc2json.dalc.in` (v4.0) e `biodiversidade.online` (v6.0)." },
      {
        de: 6,
        ate: 6,
        texto:
          "possibilitar a agregação de outros conjuntos de dados relevantes, como dados de espécies invasoras, dados de avaliação de risco de extinção",
        fonte: "A promessa que guia as próximas paradas (README v4.0)",
      },
    ],
    interacao: {
      placas: [
        { rotulo: "Busca e ficha de espécie", chegou: "2023-04", descricao: "Busca por gênero ou espécie; ficha do táxon" },
        { rotulo: "API", chegou: "2023-04 (OpenAPI em 2024-07)", descricao: "Táxon em JSON; ocorrências por espécie e por proximidade" },
        { rotulo: "Mapa de ocorrências", chegou: "2023-11", descricao: "Ocorrências por táxon; depois filtros e mapa por estado" },
        { rotulo: "Dashboard", chegou: "2024-06", descricao: "Contagens da base; depois ameaçadas e invasoras" },
        { rotulo: "Árvore taxonômica", chegou: "2025-03", descricao: "Navegação pela hierarquia" },
        { rotulo: "Calendário fenológico", chegou: "2025-09", descricao: "Floração por mês, derivada das ocorrências" },
      ],
    },
    ingestao: [
      { texto: 'Três "actions" todo domingo: flora, fauna e ocorrências. Agenda criada em 2024-03-27.' },
      { texto: "Campos derivados: `flatScientificName` e `geoPoint` (só com coordenadas válidas)." },
      { texto: 'Curadoria contra duplicação mantida: "matriz de seleção".' },
    ],
    evidencia: "`gh release view v4.0` · `v4.0:README.md` · `v4.0:atualizacao.md` · `pesquisa/historico.md` §3",
    selos: ["especies", "ocorrencias"],
  },
  {
    id: "3",
    passos: 6,
    minutos: 2,
    curto: "Fontes temáticas",
    data: "2024-01 → 2025-05",
    titulo: "Fontes temáticas",
    marco: "2024-01-13 (primeira lista de ameaçadas) → 2025-05 (cinco coleções de apoio)",
    mensagem:
      "As fontes temáticas não vêm de IPT nem em Darwin Core. Elas entram por CSV e se ligam por nome. É aqui que a base começa a responder perguntas de conservação.",
    citacoes: [],
    interacao: {
      centro: ["taxa", "occurrences"],
      cartoes: [
        {
          rotulo: "Espécies ameaçadas (flora e fauna)",
          origem: "Portaria MMA nº 148, de 7 de junho de 2022",
          numero: "4.467 espécies: 3.209 Plantae, 1.258 Animalia",
          chave: "`canonicalName`",
          limite: "Entrou em 2024-01; substituída em 2025-05",
          alvo: "taxa",
        },
        {
          rotulo: "Fauna ameaçada",
          origem: "MMA, Lista de Espécies Ameaçadas 2021",
          numero: "1.407 linhas",
          chave: "`canonicalName`",
          limite: "O arquivo tem linhas de nota editorial",
          alvo: "taxa",
        },
        {
          rotulo: "Flora e fungos ameaçados",
          origem: "CNCFlora/JBRJ, avaliações até 2022",
          numero: "9.444 espécies avaliadas: 9.420 plantas, 24 fungos",
          chave: '`taxonID` ↔ "Flora e Funga do Brasil ID"',
          limite: "Única ligação por identificador",
          alvo: "taxa",
        },
        {
          rotulo: "Espécies invasoras",
          origem: "Instituto Hórus",
          numero: "485 espécies: 273 animais, 212 plantas",
          chave: "`scientific_name` ↔ `canonicalName`",
          limite: "Cerca de 30 campos: impactos, controle, vetores",
          alvo: "taxa",
        },
        {
          rotulo: "Unidades de Conservação",
          origem: "CNUC/MMA, até março de 2025",
          numero: "3.185 UCs: 1.316 estaduais, 1.091 federais, 778 municipais",
          chave: '"Nome da UC" como trecho de `locality`',
          limite: "Ligação textual, não espacial",
          alvo: "occurrences",
        },
      ],
    },
    ingestao: [
      { texto: "Formato: CSV de órgãos federais e do Instituto Hórus. Não é DwC-A." },
      {
        texto:
          '2026-02-18: loaders CSV e enriquecimento "in-place". `taxa` ganha `threatStatus` e `invasiveStatus`. `occurrences` ganha `conservationUnits`.',
      },
      { texto: "Primeira consulta que cruzou fontes: invasoras em Parques Nacionais, 2024-03-28." },
    ],
    evidencia:
      "`pesquisa/ingestao.md` §2 (contagens feitas sobre os CSVs das tags) · `pesquisa/numeros-auge.md` · commits `4bb3493`, `4db83ed`, `e348e3a`, `7a4c3e7`",
    selos: ["especies", "ocorrencias", "ameacadas", "invasoras", "ucs"],
  },
  {
    id: "4",
    passos: 19,
    minutos: 5,
    curto: "O mirante: ChatBB",
    data: "2025-05 → 2026-02",
    titulo: "O mirante: ChatBB",
    marco: 'v5.0 (2025-05-25) → v5.1/v5.2 (2025-07-12) → v6.0 "Biodiversidade.Online" (2025-09-22) → v6.1 (2026-02-17)',
    mensagem:
      "No mirante se vê tudo de uma vez: uma pergunta em português cruza cinco fontes. Quem fazia a integração era um texto de 204 linhas.",
    secoes: [
      { titulo: "A base no auge", passos: 1 },
      { titulo: "Como funcionava", passos: 4 },
      {
        titulo: "O prompt era o mapa da integração",
        subtitulo: "204 linhas · última versão: 2026-02-18 · 44 commits de ajuste entre 2025-05 e 2025-12",
        passos: 9,
      },
      {
        titulo: "Perguntas feitas à base toda integrada",
        nota: "Exemplos reais publicados nos READMEs do projeto, 2025–2026. Caminho previsto pelas regras do prompt.",
        passos: 5,
      },
    ],
    fluxo: [
      { icone: "bx-message-dots", texto: "pergunta em português" },
      { icone: "bx-brain", texto: "LLM (chave de API do usuário)" },
      { icone: "bx-plug", texto: "MCP: `mongodb-mcp-server`, somente leitura, ferramentas `find` e `aggregate`" },
      { icone: "bx-data", texto: "7 coleções no MongoDB `dwc2json`" },
    ],
    fatos: [
      {
        texto:
          "se aproveita do protocolo MCP [...] para conectar a base de dados integrada da biodiversidade brasileira com a plataforma da OpenIA e criar o 'ChatBB - O Assistente Virtual Inteligente da Biodiversidade Brasileira'",
        fonte: "Release v5.0",
      },
      { nota: "Modelos: OpenAI `gpt-4.1-mini` na v5.0; Google Gemini na v5.1; no fim, OpenAI, Anthropic e Google." },
      { nota: "Primeiro commit do chat: 2025-05-14. Release: 2025-05-25. Onze dias." },
    ],
    fechoParada:
      "v6.0, 2025-09: o projeto vira Biodiversidade.Online. v6.1, 2026-02: três pontos de acesso — Dashboard, ChatBB e API REST.",
    evidencia:
      "`gh release view v5.0` · `20e32a3^:packages/web/src/prompts/prompt.md` · `20e32a3^:packages/web/src/pages/api/chat.ts` · `v6.0:packages/web/cache/dashboard-data.json`",
    selos: ["especies", "ocorrencias", "ameacadas", "invasoras", "ucs"],
  },
  {
    id: "5",
    passos: 3,
    minutos: 2.5,
    curto: "A virada",
    data: "2026-05 → 2026-09",
    titulo: "A virada: simplicidade e dados locais",
    marco: "Spec V7 (2026-05-06) → V7 em Go (2026-05-07) → DuckDB e script único (2026-09-14)",
    mensagem: "Hospedar ferramentas não era o importante. O importante é o conjunto de dados integrado. O projeto escolheu descer.",
    citacoes: [
      {
        texto:
          "O que era uma ferramenta on-line voltou-se para a criação de um conjunto de dados local e stand-alone. O foco era eliminar a responsabilidade de hospedar ferramentas e focar no que era importante: um conjunto de dados integrado e útil.",
        fonte: "Eduardo Dalcin, sobre a virada",
      },
    ],
    interacao: {
      lemas: [
        { texto: "Sem Docker, sem GitHub Actions, sem UI.", fonte: "Spec V7" },
        { texto: "Não há mais suite multi-contexto, banco compartilhado ou serviço hospedado", fonte: "README atual" },
      ],
      estados: [
        { rotulo: "Antes", marco: "v6.1, 2026-02" },
        { rotulo: "Depois", marco: "2026-09" },
      ],
      linhas: [
        ["Forma", "Suite on-line em 3 contextos: Aquisição, Transformação, Apresentação", "1 script Go"],
        ["Banco", "MongoDB compartilhado, hospedado", "1 arquivo `biodiversidade.duckdb`, local"],
        ["Acesso", "Dashboard, ChatBB, API REST", "SQL, na máquina de quem analisa"],
        ["Operação", "Docker, GitHub Actions, servidor web, chaves de LLM", "1 comando"],
        ["Modelo de dados", "Documentos JSON, campos livres", "Esquema fixo Darwin Core, tabelas"],
        ["Fontes", "Espécies, ocorrências, ameaçadas, invasoras, UCs", "Espécies e ocorrências"],
      ],
      adrs: [
        { n: "0001", decisao: "DuckDB em vez de SQLite", motivo: "Consulta analítica sobre dezenas de milhões de registros, em um arquivo" },
        { n: "0002", decisao: "Script único e sequencial", motivo: "Um arquivo DuckDB aceita uma conexão de escrita" },
        { n: "0003", decisao: "Esquema fixo Darwin Core", motivo: "Colunas definidas em vez de repasse livre de campos" },
        { n: "0004", decisao: "Tabelas normalizadas para extensões", motivo: "Cada extensão do táxon em tabela própria" },
        { n: "0005", decisao: "Atualização manual de `ipt_sources.csv`", motivo: "Hosts IPT caem; o inventário não bloqueia a ingestão" },
      ],
    },
    honesta: "Fontes temáticas: ainda não migradas. A migração está em curso. Elas voltam nas próximas versões.",
    ingestao: [
      { texto: "V7 (2026-05): três binários Go, ainda com MongoDB." },
      { texto: "Nasce a Harmonização PT→EN (2026-05-11) e o registro de cada Execução em `ingest_runs`." },
      { texto: "Em 2026-09-14 o MongoDB sai." },
    ],
    evidencia: "commit `9cd4337` · commits `20e32a3`, `b782b55`, `dd14da5` · `README.md` (HEAD) · `docs/adr/0001` a `0005`",
    selos: ["especies", "ocorrencias"],
  },
  {
    id: "6",
    passos: 10,
    minutos: 3,
    curto: "A clareira",
    data: "2026-10",
    titulo: "A clareira: ingestão hoje",
    marco: "HEAD, 2026-10",
    mensagem: "Um comando lê 785 Fontes IPT e grava um arquivo harmonizado em Darwin Core. Cada Execução fica registrada.",
    citacoes: [],
    interacao: {
      rotuloExemplos: "Exemplos dos testes do código",
      etapas: [
        { nome: "Nascentes", oque: "`ipt_sources.csv`: 785 Fontes IPT. 2 de táxons, 783 de ocorrências. 10 hosts IPT" },
        { nome: "Download", oque: "Baixa o DwC-A. Lê `eml.xml` e `meta.xml`" },
        {
          nome: "Pular",
          oque: "Se o `packageId` é igual ao da última Execução com sucesso, a fonte é pulada",
          exemplos: [{ depois: "status `skipped`" }],
        },
        {
          nome: "Seleção",
          oque: "Só táxons-folha: espécie, subespécie, variedade, forma",
          exemplos: [{ antes: "`GENERO`, `FAMILIA`", depois: "rejeitado" }],
        },
        {
          nome: "Tipos e esquema fixo",
          oque: "Datas, números, nulos. Campos fora do Darwin Core são descartados e contados",
          exemplos: [
            { antes: '`"2026-04-30"`', depois: "data" },
            { antes: '`"-23.5"`', depois: "número" },
            { antes: '`""`, `\\N`, `NULL`', depois: "omitido" },
          ],
        },
        {
          nome: "Harmonização do táxon",
          oque: "Tradução PT→EN, nomes derivados, extensões fundidas",
          exemplos: [
            { antes: "`NOME_ACEITO`", depois: "`accepted`" },
            { antes: "`ESPECIE`", depois: "`species`" },
            { antes: "`Paubrasilia` + `echinata`", depois: "`Paubrasilia echinata`" },
          ],
          detalhe: [
            {
              rotulo: "`flatScientificName`",
              antes: '"Paubrasilia echinata (Lam.) Gagnon, H.C.Lima & G.P.Lewis"',
              depois: "`paubrasiliaechinatalamgagnonhclimagplewis`",
            },
            {
              rotulo: "Distribuição",
              antes: "3 linhas da extensão (`BR-AL`, `BR-BA`, `BR-AL` repetida)",
              depois: "1 linha com `occurrence = [BR-AL, BR-BA]`, `origin = NATIVA`, `Endemism = Endemica`",
            },
          ],
        },
        {
          nome: "Ocorrências",
          oque: "Coordenada fora de −90..90 ou −180..180 é sinalizada. O registro fica",
          exemplos: [{ depois: "`hasSuspectCoordinates = true`" }],
        },
        {
          nome: "Gravação e auditoria",
          oque: "Upsert em lotes de 5.000. Remove o que a fonte não publica mais. Registra a Execução",
          exemplos: [{ depois: "linha em `ingest_runs`" }],
        },
      ],
      resultado: "`biodiversidade.duckdb`: `taxon` · `occurrence` · 6 Tabelas de extensão · `ingest_runs`",
      grafias: {
        titulo: "O que o riacho ainda carrega",
        colunas: ["Campo de ocorrência", "Grafias distintas"],
        linhas: [
          ["`stateProvince`", "7.729"],
          ["`country`", "955"],
          ["`county`", "16.276"],
          ["`sex`", "705"],
          ["`lifeStage`", '49 (entre elas "Adulto", "Adult", "adulto")'],
        ],
        nota: "Relatório de 2026-09-17 sobre 3.464.717 registros de ocorrência de uma carga local.",
      },
    },
    evidencia:
      "`ipt_sources.csv` (contagem em 2026-11-14) · `internal/ingest/*_test.go` · `reports/occurrence_unique_values.md` · `CONTEXT.md`",
    selos: ["especies", "ocorrencias"],
  },
  {
    id: "fecho",
    passos: 4,
    minutos: 1.5,
    titulo: "Próximas estações",
    mensagem: "A base integrada continua a ser o destino. Agora sobre uma fundação que não depende de servidor.",
    marcos: ["Espécies ameaçadas", "Espécies invasoras", "Unidades de Conservação"],
    rotuloMarcos: "voltam nas próximas versões",
    outras: "outras fontes",
    frase: "Integrar é o que gera informação. Hospedar não é.",
    rodape: [
      "`github.com/edalcin/BiodiversidadeDB` · DOI `10.5281/zenodo.18668804` · Eduardo Dalcin e Henrique Pinheiro",
      "Código do projeto: GPL v3. Conteúdo desta apresentação: CC BY 4.0.",
    ],
    selos: ["especies", "ocorrencias"],
    aCaminho: ["ameacadas", "invasoras", "ucs"],
  },
];

// Passo 4.0. Contagem medida: v6.0:packages/web/cache/dashboard-data.json (lastUpdated 2025-08-21).
export const auge = {
  data: "2025-08-21",
  especies: { total: 196314, animalia: 134582, plantae: 53264, fungi: 8468 },
  ocorrencias: { total: 8984456, plantae: 5659707, animalia: 3084163, fungi: 240586 },
  rotulos: { especies: "espécies (nomes aceitos)", ocorrencias: "registros de ocorrência" },
  tematicas: [
    { numero: "9.444", rotulo: "espécies com avaliação de risco da flora e dos fungos" },
    { numero: "1.407", rotulo: "da fauna" },
    { numero: "485", rotulo: "espécies invasoras" },
    { numero: "3.185", rotulo: "Unidades de Conservação" },
  ],
  nota: "Contagem do dashboard do projeto em 2025-08-21. Espécies: nomes aceitos de espécie e abaixo. Ocorrências: registros com reino informado.",
};

// Nós do grafo de coleções (passos 4.2 e 4.3). Posições em paradas.js.
export const colecoes = [
  { id: "taxa", rotulo: ["taxa"] },
  { id: "occurrences", rotulo: ["occurrences"] },
  { id: "floraAmeacada", rotulo: ["plantaeAmeacada", "fungiAmeacada"] },
  { id: "faunaAmeacada", rotulo: ["faunaAmeacada"] },
  { id: "invasoras", rotulo: ["invasoras"] },
  { id: "ucs", rotulo: ["ucs"] },
];

export const prompt = {
  linhas: 204,
  versao: "2026-02-18",
  blocos: [
    {
      titulo: "Papel",
      resumo: "Diz ao modelo quem ele é e de onde vêm os dados",
      trechos: ["Você é um assistente especializado em dados da fauna e flora do Brasil, criado por Eduardo Dalcin e Henrique Pinheiro"],
    },
    {
      titulo: "Escopo",
      resumo: "Fecha a porta para o que a base não sabe",
      trechos: [
        "Só responda sobre espécies brasileiras dos reinos _Animalia_, _Plantae_ ou _Fungi_",
        "Se perguntarem algo fora desse escopo, explique educadamente que não pode responder.",
      ],
    },
    {
      titulo: "Mapa dos dados",
      resumo:
        "Lista as 7 coleções e os campos essenciais de cada uma. É um dicionário de dados escrito para um leitor que não vê o banco",
      trechos: ["`canonicalName` - **CHAVE DE BUSCA** para relacionar com outras coleções"],
    },
    {
      titulo: "Gramática do nome científico",
      resumo: "Ensina a diferença entre `canonicalName` e `scientificName`",
      trechos: ["`genus` (nome do gênero) + `specificEpithet` (epíteto específico), formando o `canonicalName`"],
    },
    {
      titulo: "Roteiro de busca de espécie",
      resumo: "Três etapas: nome canônico; depois sinônimos, com busca aproximada; depois as fontes temáticas",
      trechos: ["Caso não encontre pelo `canonicalName`, consulte o campo `othernames[].scientificName`"],
    },
    {
      titulo: "15 regras de consulta",
      resumo: "Contagem só com `aggregate`. Só nomes aceitos. E as chaves que ligam cada fonte",
      trechos: ["Relacione `ucs.Nome da UC` com sub-strings em `occurrences.locality`"],
    },
    {
      titulo: "Estilo e raciocínio",
      resumo: "Formato da resposta e um plano privado de 5 passos",
      trechos: ["Se não houver dados suficientes, explique a limitação."],
    },
  ],
  ligacoes: [
    { de: "taxa", para: "occurrences", chave: "canonicalName" },
    { de: "taxa", para: "floraAmeacada", chave: "taxonID ↔ Flora e Funga do Brasil ID" },
    { de: "taxa", para: "faunaAmeacada", chave: "canonicalName" },
    { de: "invasoras", para: "taxa", chave: "scientific_name ↔ canonicalName" },
    { de: "ucs", para: "occurrences", chave: "Nome da UC ⊂ locality (texto)" },
  ],
  licoes: [
    "O prompt era documentação de integração. Quem escreve as regras de ligação para um LLM escreve o esquema que faltava.",
    "Quase toda ligação era por **nome**. Só uma era por identificador (`taxonID`). A qualidade do nome publicado decide o que se consegue cruzar.",
    "A ligação com as UCs era um trecho de texto em `locality`. Sem geometria. É o ponto mais fraco e o mais pedido.",
  ],
};

// Texto literal dos READMEs (grafia original mantida). Sem respostas: decisão do autor.
// colecoes = caminho previsto pelas regras do prompt, não o registro de uma execução.
export const perguntas = [
  { texto: "Me fale sobre o gênero vriesea", colecoes: ["taxa", "floraAmeacada", "occurrences"], destaque: null },
  {
    texto: "Quais as espécies invasoras de árvores ocorrem nos parques nacionais?",
    colecoes: ["invasoras", "taxa", "occurrences", "ucs"],
    destaque: 1,
  },
  {
    texto: "Quais as espécies de bromeliaceae ameaçadas de extinção que ocorrem em parques nacionais?",
    colecoes: ["taxa", "floraAmeacada", "occurrences", "ucs"],
    destaque: 2,
  },
  {
    texto: "Existe alguma espécie de mammalia invasora ocorrendo em parque nacional?",
    colecoes: ["invasoras", "taxa", "occurrences", "ucs"],
    destaque: null,
  },
  { texto: "Mammalia no Parque Nacional de Itatiata", colecoes: ["taxa", "occurrences", "ucs"], destaque: null },
  {
    texto: "Liste as espécies da fauna ameaçada que não estão na coleção taxa. Inclua as informações de filo e classe.",
    colecoes: ["faunaAmeacada", "taxa"],
    destaque: 3,
  },
  {
    texto: "Quais as espécies de cactus são endêmicas do rio de janeiro?",
    colecoes: ["taxa"],
    nota: "`taxa`: campo `distribution`",
    destaque: null,
  },
  {
    texto: "Qual as 10 famílias de plantas mais coletadas por Filardi?",
    colecoes: ["occurrences", "taxa"],
    nota: "`occurrences`: campo `recordedBy`",
    destaque: null,
  },
  { texto: "Me fale sobre o parque de itatiaia", colecoes: ["ucs", "occurrences"], destaque: null },
  { texto: "Gostaria de saber mais sobre as espécies ameaçadas", colecoes: ["floraAmeacada", "faunaAmeacada"], destaque: null },
  { texto: "Me fale sobre os parques nacionais. Quantos são em cada estado?", colecoes: ["ucs"], destaque: null },
  {
    texto: "Existem registros de coletas de plantas em terras indígenas com indicação de uso?",
    colecoes: ["occurrences"],
    nota: "`occurrences`: campos `locality` e `occurrenceRemarks`",
    destaque: null,
  },
  {
    texto: "Me fale sobre a _Caesalpinia echinata_",
    colecoes: ["taxa", "floraAmeacada", "occurrences"],
    nota: "`taxa`: sinônimo → nome aceito",
    destaque: 4,
  },
  {
    texto: "Me fale sobre a restinga de massambaba",
    colecoes: ["occurrences", "ucs"],
    nota: "`occurrences`: campo `locality`",
    destaque: null,
  },
];
