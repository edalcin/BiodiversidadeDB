---
type: Status Report
title: "Próximos passos"
description: "Estado atual do projeto e o que falta fazer. Ponto de partida de cada nova sessão."
tags: [status, proximos-passos, divulgacao, gt-repositorios]
status: stable
generated: { by: claude-code/fable-5-2, at: 2026-11-14T00:00:00Z }
---

# Próximos passos

Atualizado em 2026-11-14.

## Frente ativa: apresentação para o GT Repositórios (2026-11-26)

Roteiro e plano estão prontos em [`docs/divulgacao/202622gtRepositorios/`](./divulgacao/202622gtRepositorios/index.md), com commit `42f4cc6` no `main` (sem push). Não há mapa wayfinder no GitHub: o autor confirmou que não restava névoa.

**Falta:** implementar e publicar a apresentação. É trabalho de uma nova sessão (Opus 5.5).

### O que a sessão de implementação deve abrir

- [`plano-implementacao.md`](./divulgacao/202622gtRepositorios/plano-implementacao.md) — ponto de entrada. Traz arquitetura, arquivos, especificação de cada tela, fases com aceite, verificação e publicação. A seção 13 tem o prompt inicial para colar na nova sessão.
- [`roteiro.md`](./divulgacao/202622gtRepositorios/roteiro.md) — conteúdo: tese, decisões do autor, a trilha, 6 paradas, fecho, falas e evidências.
- [`pesquisa/`](./divulgacao/202622gtRepositorios/pesquisa/index.md) — 6 arquivos de fatos (histórico, ingestão, prompt final literal, 14 perguntas, números no auge, plataforma).

### Como ficou a apresentação

Remoto, Google Meet, 20 minutos. Tela-hub: trilha na floresta em perfil de elevação.

| Tela | Título | Tempo |
|---|---|---|
| Hub | A trilha (abertura) | 1:00 |
| 1 | A semente: DWC2JSON | 2:30 |
| 2 | Base de Dados Integrada + interface de acesso | 2:30 |
| 3 | Fontes temáticas | 2:00 |
| 4 | O mirante: ChatBB (auge da fase 1) | 5:00 |
| 5 | A virada: simplicidade e dados locais | 2:30 |
| 6 | A clareira: ingestão hoje | 3:00 |
| Fecho | Próximas estações (volta ao hub) | 1:30 |

O mirante tem quatro passos: números da base, como o chat funcionava, o prompt final em 7 blocos didáticos e as perguntas reais.

### Pontos que o autor deve conhecer

- **Números no auge:** contagem do dashboard de 2025-08-21: **196.314** espécies (nomes aceitos) e **8.984.456** registros de ocorrência. O README v5.0 declara "cerca de 12 milhões"; o repositório não explica a diferença. Se houver contagem melhor, trocar no passo 4.0 do roteiro.
- **Respostas do ChatBB:** não existem mais em lugar acessível (`trilium.dalc.in` não resolve). A tela mostra só as 14 perguntas e as coleções que cada uma cruza, com o rótulo "caminho previsto pelas regras do prompt".
- **Fontes temáticas:** a parada 5 diz em linha fixa que ainda não foram migradas para o DuckDB, com a declaração do autor sobre a virada.
- **Código da apresentação:** desenvolver em `docs/divulgacao/202622gtRepositorios/site/` e copiar para `S:/appsdata/web.dalc.in/202622gtRepositorios/` só depois da verificação. A pasta do web root é o site ao vivo.

### Pendências do autor (nenhuma bloqueia)

1. URL do repositório no fecho: está `github.com/edalcin/BiodiversidadeDB`; o README manda clonar `biopinda/Biodiversidade-Online`.
2. Rever as falas e a frase final ("Integrar é o que gera informação. Hospedar não é."). São proposta do roteiro.
3. Ensaio com cronômetro.
4. `git push` do commit `42f4cc6`.

Alternativa mais simples, se o prazo apertar: reveal.js vendorizado dá o mesmo conteúdo com menos código, mas perde a trilha como tela-hub.

## Pendências do projeto (fora da apresentação)

- **README desatualizado:** diz 514 Fontes IPT (2 de táxons + 512 de ocorrências). O `ipt_sources.csv` tem 785 (2 + 783) desde `a708577`.
- **Fontes temáticas não migradas para o DuckDB:** espécies ameaçadas (CNCFlora, MMA), espécies invasoras (Instituto Hórus) e Unidades de Conservação (CNUC). Previstas para as próximas versões.
- **Ocorrências sem Harmonização de localidade:** `stateProvince` com 7.729 grafias e `country` com 955 (`reports/occurrence_unique_values.md`, 2026-09-17).
- **Seleção de herbários duplicados** (JABOT > REFLORA > speciesLink) não tem equivalente no código atual.
