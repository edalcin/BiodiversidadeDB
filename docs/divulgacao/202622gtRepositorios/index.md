---
okf_version: "0.2"
---

# Apresentação para o GT Repositórios — 2026-11-26

Roteiro, plano e código de uma apresentação interativa sobre o Biodiversidade.Online: "A trilha da base integrada". Remoto, 20 minutos. Publicada em `https://web.dalc.in/202622gtRepositorios/`.

Estado em 2026-11-14: implementada e publicada (`VERSAO` `2026-11-14a`). O código está em `site/`. Para publicar de novo: trocar `VERSAO`, rodar `node verificar-dados.js`, copiar `site/` para o web root (plano, seção 10).

- [Plano de implementação](./plano-implementacao.md) - Arquitetura, arquivos, especificação das telas, fases, verificação e publicação. Ponto de entrada da sessão de implementação.
- [Roteiro](./roteiro.md) - Tese, decisões do autor, arco narrativo, tela-hub, 6 paradas, fecho, falas e evidências.
- [Pesquisa](./pesquisa/index.md) - Fatos do histórico git, da ingestão, do ChatBB e da plataforma web.
- [Log](./log.md) - Histórico de mudanças deste conjunto de documentos.
- `site/` - Código da apresentação (HTML, CSS e módulos ES, sem build). Todo o conteúdo de tela está em `site/dados.js`.
- `verificar-dados.js` - Checagem de `dados.js`, da `VERSAO` e dos nomes de arquivo. Não vai para o web root.
