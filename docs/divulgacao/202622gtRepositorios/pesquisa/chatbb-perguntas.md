---
type: Research Note
title: "ChatBB — exemplos de perguntas reais"
description: "As 14 perguntas de exemplo do ChatBB publicadas nos READMEs do projeto, com as coleções que cada pergunta cruza segundo as regras do prompt final."
tags: [chatbb, perguntas, integracao, pesquisa]
status: stable
generated: { by: claude-code/fable-5-2, at: 2026-11-14T00:00:00Z }
sources:
  - id: readme-v50
    resource: "git show v5.0:README.md"
    title: "README v5.0, linhas 26-37 (10 perguntas)"
  - id: readme-v52
    resource: "git show v5.2:README.md"
    title: "README v5.2, linha 38 (pergunta 11)"
  - id: chatbb-v61
    resource: "git show v6.1:docs/chatbb.md"
    title: "docs/chatbb.md v6.1, linhas 19-31 (perguntas 12 a 14)"
  - id: prompt
    resource: pesquisa/chatbb-prompt-final.md
    title: "Prompt final do ChatBB"
---

# ChatBB — exemplos de perguntas reais

## Regra de uso

- A apresentação mostra **somente as perguntas**. Decisão do autor (2026-11-14).
- As respostas originais não estão disponíveis. Os READMEs apontam para `https://trilium.dalc.in/share/<id>`. Esse host não resolve desde, no mínimo, 2026-11-14 (NXDOMAIN).
- O texto das perguntas é literal. Não corrigir a grafia ("Itatiata", "Qual as 10").
- A coluna "Coleções cruzadas" é o caminho que as regras do [prompt final](./chatbb-prompt-final.md) determinam para a pergunta. Não é o registro de uma execução. Na tela, usar o rótulo "caminho previsto pelas regras do prompt".

## Perguntas

| # | Pergunta (literal) | Primeira publicação | Coleções cruzadas | Regra do prompt |
|---|---|---|---|---|
| 1 | Me fale sobre o gênero vriesea | v5.0[^readme-v50] | `taxa`, `plantaeAmeacada`, `occurrences` | busca de espécie, etapas 1 a 3 |
| 2 | Quais as espécies invasoras de árvores ocorrem nos parques nacionais? | v5.0 | `invasoras`, `taxa`, `occurrences`, `ucs` | regras 8 e 12 |
| 3 | Quais as espécies de bromeliaceae ameaçadas de extinção que ocorrem em parques nacionais? | v5.0 | `taxa`, `plantaeAmeacada`, `occurrences`, `ucs` | regras 6 e 8 |
| 4 | Existe alguma espécie de mammalia invasora ocorrendo em parque nacional? | v5.0 | `invasoras`, `taxa`, `occurrences`, `ucs` | regras 8 e 12 |
| 5 | Mammalia no Parque Nacional de Itatiata | v5.0 | `taxa`, `occurrences`, `ucs` | regras 4 e 8 |
| 6 | Liste as espécies da fauna ameaçada que não estão na coleção taxa. Inclua as informações de filo e classe. | v5.0 | `faunaAmeacada`, `taxa` | regra 6 |
| 7 | Quais as espécies de cactus são endêmicas do rio de janeiro? | v5.0 | `taxa` (`distribution`) | regra 9 |
| 8 | Qual as 10 famílias de plantas mais coletadas por Filardi? | v5.0 | `occurrences` (`recordedBy`), `taxa` | regras 1 e 4 |
| 9 | Me fale sobre o parque de itatiaia | v5.0 | `ucs`, `occurrences` | regras 8 e 11 |
| 10 | Gostaria de saber mais sobre as espécies ameaçadas | v5.0 | `plantaeAmeacada`, `fungiAmeacada`, `faunaAmeacada` | regra 6 |
| 11 | Me fale sobre os parques nacionais. Quantos são em cada estado? | v5.2[^readme-v52] | `ucs` | regras 1 e 11 |
| 12 | Existem registros de coletas de plantas em terras indígenas com indicação de uso? | v6.1[^chatbb-v61] | `occurrences` (`locality`, `occurrenceRemarks`) | regra 10 |
| 13 | Me fale sobre a Caesalpinia echinata | v6.1 | `taxa` (sinônimo → nome aceito), `plantaeAmeacada`, `occurrences` | busca de espécie, etapa 2 (`othernames`) |
| 14 | Me fale sobre a restinga de massambaba | v6.1 | `occurrences` (`locality`), `ucs` | regras 8 e 10 |

## Destaques recomendados para a tela

Ordem de valor para a tese "o valor é cruzar fontes":

1. Pergunta 2: cruza 4 coleções. Invasoras (Instituto Hórus) + espécies + ocorrências + UCs (CNUC).
2. Pergunta 3: cruza 4 coleções. Ameaçadas (CNCFlora) + espécies + ocorrências + UCs.
3. Pergunta 4: o mesmo cruzamento da pergunta 2, para a fauna.
4. Pergunta 6: usa a base para auditar a base. Compara a lista de fauna ameaçada (MMA) com o Catálogo Taxonômico da Fauna do Brasil.
5. Pergunta 13: nome antigo (*Caesalpinia echinata*) leva ao nome aceito (*Paubrasilia echinata*). Liga o mirante à parada "Ingestão hoje", que usa a mesma espécie como exemplo.

## Lacunas

- Sem respostas originais. Ver "Regra de uso".
- "Coleções cruzadas" não foi verificado em execução. É dedução das regras do prompt.

[^readme-v50]: README v5.0, linhas 26-37 (10 perguntas)
[^readme-v52]: README v5.2, linha 38 (pergunta 11)
[^chatbb-v61]: docs/chatbb.md v6.1, linhas 19-31 (perguntas 12 a 14)
