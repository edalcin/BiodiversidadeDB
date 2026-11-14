---
type: Research Note
title: "Números da base no auge (fase MongoDB + ChatBB)"
description: "Contagens medidas de espécies, ocorrências e fontes temáticas na base MongoDB, lidas do cache do dashboard versionado no git, com a consulta que gerou cada número."
tags: [numeros, chatbb, mongodb, dashboard, especies, ocorrencias, pesquisa]
status: stable
generated: { by: claude-code/fable-5-2, at: 2026-11-14T00:00:00Z }
sources:
  - id: cache-v60
    resource: "git show v6.0:packages/web/cache/dashboard-data.json"
    title: "Cache do dashboard na tag v6.0 (lastUpdated 2025-08-21T13:22:29Z)"
  - id: cache-final
    resource: "git show 20e32a3^:packages/web/cache/dashboard-data.json"
    title: "Cache do dashboard, última versão (lastUpdated 2025-11-03T17:03:16Z)"
  - id: consultas
    resource: "git show v6.0:packages/web/src/lib/mongo.ts"
    title: "Funções de contagem do dashboard"
  - id: readme-v50
    resource: "git show v5.0:README.md"
    title: "README v5.0, linha 22"
---

# Números da base no auge

## Contagem usada na apresentação: 2025-08-21

Fonte: cache do dashboard na tag `v6.0`.[^cache-v60] É a contagem medida mais próxima das versões do ChatBB (v5.0 a v6.0).

| Item | Total | Plantae | Fungi | Animalia | Consulta |
|---|---|---|---|---|---|
| Espécies (nomes aceitos) | **196.314** | 53.264 | 8.468 | 134.582 | `taxa.countDocuments({kingdom, taxonomicStatus: 'NOME_ACEITO'})` |
| Registros de ocorrência | **8.984.456** | 5.659.707 | 240.586 | 3.084.163 | `ocorrencias.countDocuments({kingdom})` |
| Espécies com avaliação de risco | 10.851 | 9.420 | 24 | 1.407 | coleções `cncfloraPlantae`, `cncfloraFungi`, `faunaAmeacada`, sem a categoria "não avaliada" |
| Espécies invasoras | 485 | 212 | 0 | 273 | `invasoras.countDocuments({kingdom})` |

Consultas em `packages/web/src/lib/mongo.ts`.[^consultas]

Leitura correta de cada número:

- **Espécies**: a coleção `taxa` só guardava táxons-folha (espécie, subespécie, variedade, forma). O número é de nomes aceitos. Sinônimos ficam fora.
- **Ocorrências**: só registros com `kingdom` igual a Plantae, Fungi ou Animalia. Registros sem reino ficam fora.
- **Avaliação de risco**: inclui categorias sem ameaça (LC, DD, NT). Dizer "avaliadas", não "ameaçadas". Flora: LC 3.802, EN 2.164, DD 1.396, VU 836, CR 729, NT 493.
- **UCs**: o cache não traz contagem. O número 3.185 vem do CSV do CNUC (ver [ingestão](./ingestao.md), §2.5).

Maiores coleções por ocorrências, na mesma contagem: Plantae — Rio de Janeiro Botanical Garden 824.025, Museu Botânico Municipal 329.873, Universidade de Brasília 274.772. Animalia — Museu Paraense Emílio Goeldi 245.922, Museu Nacional do Rio de Janeiro 207.196, Fiocruz 205.845.

## Números declarados nos READMEs

| Tag | Declaração |
|---|---|
| v5.0 | "Cerca de 12 milhões de registros de ocorrência da fauna e flora, provenientes de cerca de 490 repositórios (IPTs)"[^readme-v50] |
| v4.0, v6.0 | "mais de 290 mil nomes" |

Os números declarados são maiores que os medidos. O repositório não explica a diferença. `[INFERÊNCIA]`: "290 mil nomes" inclui sinônimos; "12 milhões" inclui registros sem reino.

## Contagem que não se deve usar: 2025-11-03

Última versão do cache.[^cache-final]

| Item | Total | Plantae | Fungi | Animalia |
|---|---|---|---|---|
| Espécies (nomes aceitos) | 394.678 | 107.050 | 17.128 | 270.500 |
| Registros de ocorrência | 9.965.521 | 7.263.398 | 810.450 | 1.891.673 |

A consulta de espécies é a mesma de 2025-08-21, e os três reinos têm quase exatamente o dobro. `[INFERÊNCIA]`: táxons duplicados depois do refactor "Transforma ao ingerir" (`097a0c8`, 2025-11-03). Não usar na apresentação.

[^cache-v60]: Cache do dashboard na tag v6.0 (lastUpdated 2025-08-21T13:22:29Z)
[^cache-final]: Cache do dashboard, última versão (lastUpdated 2025-11-03T17:03:16Z)
[^consultas]: Funções de contagem do dashboard
[^readme-v50]: README v5.0, linha 22
