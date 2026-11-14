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

A apresentação está implementada e publicada em <https://web.dalc.in/202622gtRepositorios/> (`VERSAO` `2026-11-14a`). Documentos e código em [`docs/divulgacao/202622gtRepositorios/`](./divulgacao/202622gtRepositorios/index.md).

**Falta:** revisão do autor (falas, frase final, números do auge) e ensaio com cronômetro.

### Como conduzir

| Tecla | Ação |
|---|---|
| `→`, `Espaço`, `PageDown`, `Enter` | Próximo passo |
| `←`, `PageUp` | Passo anterior |
| `H`, `Esc` | Abre e fecha a trilha, com o caminhante na parada atual |
| `1` a `6` | Vai para a parada |
| `T` | Tema claro ou escuro |
| `F` | Tela cheia |

A URL guarda o ponto da apresentação (`#/4/7` = parada 4, passo 8). Recarregar a página volta ao mesmo ponto. Um clique em uma placa, cartão, bloco ou pergunta abre esse item.

### Passos por tela

| Tela | Título | Tempo | Passos | Segundos por passo |
|---|---|---|---|---|
| Hub | A trilha (abertura) | 1:00 | 1 | 60 |
| 1 | A semente: DWC2JSON | 2:30 | 4 | 37 |
| 2 | Base de Dados Integrada + interface de acesso | 2:30 | 7 | 21 |
| 3 | Fontes temáticas | 2:00 | 6 | 20 |
| 4 | O mirante: ChatBB (auge da fase 1) | 5:00 | 19 | 16 |
| 5 | A virada: simplicidade e dados locais | 2:30 | 3 | 50 |
| 6 | A clareira: ingestão hoje | 3:00 | 10 | 18 |
| Fecho | Próximas estações (volta ao hub) | 1:30 | 4 | 22 |

Total: 54 passos em 20 minutos. O mirante tem quatro seções: a base no auge (1 passo), como funcionava (4), o prompt (9: 7 blocos, o grafo do bloco 6 e as 3 lições) e as perguntas (5: a lista e os 4 destaques). As seções "como funcionava" (11 s por passo) e "o prompt" (13 s por passo) são as mais densas: ensaiar primeiro.

### Como publicar uma mudança

1. Editar em `docs/divulgacao/202622gtRepositorios/site/`. O conteúdo de tela está todo em `dados.js`. Nunca editar no web root.
2. Trocar `VERSAO` (`2026-11-14a`) em `sw.js`, `index.html`, `app.js`, `trilha.js` e `paradas.js`.
3. Rodar `node docs/divulgacao/202622gtRepositorios/verificar-dados.js`.
4. Copiar o conteúdo de `site/` para `S:/appsdata/web.dalc.in/202622gtRepositorios/`.

### Pontos que o autor deve conhecer

- **Números no auge:** contagem do dashboard de 2025-08-21: **196.314** espécies (nomes aceitos) e **8.984.456** registros de ocorrência. O README v5.0 declara "cerca de 12 milhões"; o repositório não explica a diferença. Se houver contagem melhor, trocar `auge` em `dados.js`.
- **Respostas do ChatBB:** a tela mostra só as 14 perguntas e as coleções que cada uma cruza, com o rótulo "Caminho previsto pelas regras do prompt".
- **Faixa de selos (rodapé):** mostra quais das 5 fontes a base integrava na época da tela. No hub de abertura, todos ficam apagados (decisão do roteiro, seção 4); o autor viu e aprovou em 2026-11-14.
- **Cloudflare Web Analytics:** o Cloudflare injeta `static.cloudflareinsights.com/beacon.min.js` no HTML. Na verificação, a requisição desse script falhou; causa provável: a CSP da página (`script-src 'self'`). É a única requisição externa, e ela não carrega. Para eliminar a tentativa, desligar o Web Analytics do domínio no painel do Cloudflare.
- **Service worker:** a página (HTML) vai à rede primeiro e usa o cache só sem rede. O plano pedia cache-first para tudo; com cache-first no HTML, uma publicação nova ficava presa atrás do `index.html` antigo.
- **Sem rede na reunião:** abrir a URL uma vez com rede, antes. Depois a página abre do cache.

### Pendências do autor (nenhuma bloqueia)

1. URL do repositório no fecho: está `github.com/edalcin/BiodiversidadeDB`; o README manda clonar `biopinda/Biodiversidade-Online`.
2. Rever as falas (ficam no roteiro, fora da página) e a frase final ("Integrar é o que gera informação. Hospedar não é.").
3. Ensaio com cronômetro.
4. `git push` dos commits locais. O link do `<noscript>` para o roteiro no GitHub só funciona depois do push.

## Pendências do projeto (fora da apresentação)

- **README desatualizado:** diz 514 Fontes IPT (2 de táxons + 512 de ocorrências). O `ipt_sources.csv` tem 785 (2 + 783) desde `a708577`.
- **Fontes temáticas não migradas para o DuckDB:** espécies ameaçadas (CNCFlora, MMA), espécies invasoras (Instituto Hórus) e Unidades de Conservação (CNUC). Previstas para as próximas versões.
- **Ocorrências sem Harmonização de localidade:** `stateProvince` com 7.729 grafias e `country` com 955 (`reports/occurrence_unique_values.md`, 2026-09-17).
- **Seleção de herbários duplicados** (JABOT > REFLORA > speciesLink) não tem equivalente no código atual.
