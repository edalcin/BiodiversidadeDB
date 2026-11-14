// As 6 paradas. Cada cena é função pura de (tela, passo, extra): a URL é o estado, todo controle é um link.
import { telas, auge, prompt, colecoes, perguntas, ui } from "./dados.js?v=2026-11-14a";
import { el, svg, rico, rota, icone, miniTrilha } from "./trilha.js?v=2026-11-14a";

const noPasso = (x, p) => p >= (x.de ?? 0) && p <= (x.ate ?? Infinity);
const fmt = (n) => n.toLocaleString("pt-BR");
const blaze = (n, mini) => el("span", { class: `blaze${mini ? " mini" : ""}` }, String(n));

function citacao(c) {
  if (c.nota) return el("p", { class: "nota" }, rico(c.nota));
  if (c.numeros) return el("p", { class: "numeros" }, c.numeros.map((n) => el("q", {}, n)), el("cite", {}, c.fonte));
  return el("blockquote", { class: "cit" }, el("p", {}, rico(c.texto)), el("cite", {}, c.fonte));
}

const esquerda = (t, p, ...mais) =>
  el("div", { class: "esq" }, el("p", { class: "mensagem" }, rico(t.mensagem)), t.citacoes.filter((c) => noPasso(c, p)).map(citacao), mais);
const duas = (esq, ...dir) => el("div", { class: "corpo" }, esq, el("div", { class: "dir" }, dir));

function quebrar(texto, max) {
  const linhas = [""];
  for (const palavra of texto.split(" ")) {
    if (linhas.at(-1) && (linhas.at(-1) + " " + palavra).length > max) linhas.push(palavra);
    else linhas[linhas.length - 1] += (linhas.at(-1) ? " " : "") + palavra;
  }
  return linhas;
}
// Texto de várias linhas centrado em (x, y). 20 unidades de SVG = 1rem em todos os desenhos das paradas.
const textoSvg = (linhas, x, y, classe, passo = 19) =>
  linhas.map((l, i) => svg("text", { class: classe, x, y: y + 5 + (i - (linhas.length - 1) / 2) * passo }, l));
// Aceso não depende só de cor: selo com o bx-check (fonte Boxicons dentro do SVG) no canto do nó.
const selado = (x, y) => svg("g", { class: "selado" }, svg("circle", { cx: x, cy: y, r: 12 }), svg("text", { x, y: y + 7 }, "\uea41"));

// --- Grafo de coleções (4.2 e 4.3). Posições fixas, escritas à mão: [x, y, largura].
const NOS = { invasoras: [110, 60, 130], taxa: [350, 170, 110], floraAmeacada: [650, 60, 190], faunaAmeacada: [650, 250, 160], occurrences: [390, 350, 150], ucs: [90, 350, 80] };
const DESLOC = [[64, 0], [0, 0], [0, 0], [0, 0], [0, -27]]; // rótulo de cada ligação: ao lado da linha quando ela é vertical ou horizontal

function grafo(acesos) {
  const neutro = !acesos; // neutro = mostra tudo, com todas as chaves (bloco 6 do prompt)
  const lit = (id) => !neutro && acesos.has(id);
  return svg(
    "svg",
    { class: `grafo${neutro ? " neutro" : ""}`, viewBox: "0 0 760 400", role: "img", "aria-label": ui.grafo },
    prompt.ligacoes.map((l, i) => {
      const [x1, y1] = NOS[l.de], [x2, y2] = NOS[l.para], [dx, dy] = DESLOC[i];
      const on = lit(l.de) && lit(l.para);
      return svg(
        "g",
        { class: `aresta${on ? " aceso" : ""}` },
        svg("line", { x1, y1, x2, y2 }),
        (neutro || on) && textoSvg(l.chave.split(/(?<=[↔⊂]) /), (x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy, "aresta-rotulo", 18),
      );
    }),
    colecoes.map((c) => {
      const [x, y, w] = NOS[c.id];
      const h = 24 + 20 * c.rotulo.length;
      const on = lit(c.id);
      return svg(
        "g",
        { class: `no${on ? " aceso" : ""}` },
        svg("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 5 }),
        textoSvg(c.rotulo, x, y, "no-rotulo", 20),
        on && selado(x + w / 2, y - h / 2),
      );
    }),
  );
}

// --- Parada 4: quatro seções em tela larga.
function auge40(t) {
  const bloco = ({ total, ...reinos }, rotulo) =>
    el(
      "div",
      { class: "auge-num" },
      el("strong", {}, fmt(total)),
      el("span", { class: "auge-rotulo" }, rotulo),
      el("span", { class: "auge-reinos" }, Object.entries(reinos).map(([r, n]) => `${ui.reinos[r]} ${fmt(n)}`).join(" · ")),
    );
  return [
    el("p", { class: "mensagem" }, t.mensagem),
    el("div", { class: "auge" }, bloco(auge.especies, auge.rotulos.especies), bloco(auge.ocorrencias, auge.rotulos.ocorrencias)),
    el("ul", { class: "tematicas" }, auge.tematicas.map((x) => el("li", {}, el("strong", {}, x.numero), ` ${x.rotulo}`))),
    el("p", { class: "nota-fixa" }, auge.nota),
  ];
}

const fluxo41 = (t, k) => [
  el("ol", { class: "fluxo" }, t.fluxo.map((e, i) => el("li", { class: "elo", "data-estado": i <= k ? "aceso" : "apagado" }, icone(e.icone), el("span", {}, rico(e.texto))))),
  el("div", { class: "fatos" }, t.fatos.map(citacao)),
];

function prompt42(t, k, p) {
  const PASSO = [0, 1, 2, 3, 4, 5, 7]; // passo local em que cada bloco abre; o 6 mostra o grafo do bloco 6; o 8, as lições
  const n = k === 6 ? 5 : PASSO.indexOf(k);
  const b = prompt.blocos[n];
  return [
    el("ol", { class: "blocos" }, prompt.blocos.map((x, i) =>
      el("li", {}, el("a", { class: "bloco", href: rota("4", p - k + PASSO[i]), "aria-current": i === n && "step", "data-foco": `bloco${i}` }, blaze(i + 1, true), x.titulo)),
    )),
    b
      ? el(
          "div",
          { class: `bloco-detalhe${k === 6 ? " com-grafo" : ""}` },
          el("div", {}, el("p", { class: "resumo" }, rico(b.resumo)), b.trechos.map((x) => el("blockquote", { class: "cit" }, el("p", {}, rico(x))))),
          k === 6 && grafo(null),
        )
      : el("ol", { class: "licoes" }, prompt.licoes.map((l) => el("li", {}, rico(l)))),
  ];
}

function perguntas43(t, k, p, extra) {
  const ativa = extra >= 1 && extra <= perguntas.length ? extra - 1 : perguntas.findIndex((q) => q.destaque === k);
  const q = perguntas[ativa];
  return el(
    "div",
    { class: "perg" },
    el("ol", { class: "perguntas" }, perguntas.map((x, i) =>
      el("li", {}, el("a", { class: "pergunta", href: rota("4", p, i + 1), "aria-current": i === ativa && "true", "data-foco": `q${i}` }, x.destaque ? blaze(x.destaque, true) : el("span"), el("span", {}, rico(x.texto)))),
    )),
    el(
      "div",
      { class: "perg-dir" },
      grafo(new Set(q?.colecoes)),
      el("p", { class: "nota" }, q?.nota ? rico(q.nota) : "\u00a0"),
      el("p", { class: "nota-fixa" }, t.secoes[3].nota),
      k === t.secoes[3].passos - 1 && el("p", { class: "fecho-parada" }, t.fechoParada),
    ),
  );
}

const CENAS = {
  1(t, p) {
    const i = t.interacao;
    if (p === 0) {
      return duas(
        esquerda(t, p),
        el("figure", { class: "diag2" }, el("div", { class: "diag2-nos" }, el("span", {}, i.diagrama.nos[0]), icone("bx-down-arrow-alt"), el("span", {}, i.diagrama.nos[1])), el("figcaption", {}, i.diagrama.legenda)),
      );
    }
    return duas(
      esquerda(t, p),
      el("ol", { class: "faixas" }, i.faixas.map((f, k) =>
        el("li", { class: "faixa", "data-estado": k < p ? "aceso" : "apagado" }, el("span", { class: "faixa-rotulo" }, f.rotulo), el("q", {}, f.numero), el("span", { class: "etiqueta" }, f.versao)),
      )),
      el("div", { class: "figura" },
        el("span", { class: "fig-lado" }, el("span", {}, icone("bx-table"), icone("bx-table"), icone("bx-table")), i.figura.antes),
        icone("bx-right-arrow-alt"),
        el("span", { class: "fig-lado" }, el("span", {}, icone("bx-code-curly")), i.figura.depois),
      ),
    );
  },

  2(t, p) {
    const ativa = t.interacao.placas[p - 1];
    return duas(
      esquerda(t, p),
      el("div", { class: "poste" },
        el("ol", { class: "placas" }, t.interacao.placas.map((x, k) =>
          el("li", {}, el("a", { class: "placa", href: rota("2", k + 1), "aria-current": k === p - 1 && "step", "data-foco": `placa${k}` }, x.rotulo)),
        )),
        ativa && el("div", { class: "painel" }, el("h2", {}, ativa.rotulo), el("p", { class: "painel-data" }, `${ui.chegou}: ${ativa.chegou}`), el("p", { class: "painel-texto" }, ativa.descricao)),
      ),
    );
  },

  3(t, p) {
    const i = t.interacao;
    const CENTRO = { taxa: [370, 150], occurrences: [570, 150] };
    const POS = [[110, 40], [110, 260], [370, 40], [370, 260], [800, 150]];
    const c = i.cartoes[p - 1];
    return duas(
      esquerda(t, p),
      svg(
        "svg",
        { class: "nascentes", viewBox: "0 0 920 300" },
        svg("line", { class: "elo-base", x1: 370, y1: 150, x2: 570, y2: 150 }),
        i.cartoes.map((x, k) => svg("line", { class: `aresta-n${k === p - 1 ? " aceso" : ""}`, x1: POS[k][0], y1: POS[k][1], x2: CENTRO[x.alvo][0], y2: CENTRO[x.alvo][1] })),
        i.centro.map((id) => {
          const [x, y] = CENTRO[id];
          const on = c?.alvo === id;
          return svg("g", { class: `no${on ? " aceso" : ""}` }, svg("rect", { x: x - 75, y: y - 24, width: 150, height: 48, rx: 5 }), textoSvg([id], x, y, "no-rotulo"), on && selado(x + 75, y - 24));
        }),
        i.cartoes.map((x, k) => {
          const [cx, cy] = POS[k];
          return svg(
            "a",
            { class: `cartao${k === p - 1 ? " aceso" : ""}`, href: rota("3", k + 1), "aria-current": k === p - 1 && "step", "data-foco": `cartao${k}` },
            svg("rect", { x: cx - 104, y: cy - 30, width: 208, height: 60, rx: 3 }),
            textoSvg(quebrar(x.rotulo, 20), cx, cy, "cartao-rotulo"),
            k === p - 1 && selado(cx + 104, cy - 30),
          );
        }),
      ),
      c && el("dl", { class: "ficha" }, ["origem", "numero", "chave", "limite"].map((k) => el("div", {}, el("dt", {}, ui[k]), el("dd", {}, rico(c[k]))))),
    );
  },

  4(t, p, extra) {
    let k = p, s = 0;
    while (k >= t.secoes[s].passos) k -= t.secoes[s++].passos;
    const sec = t.secoes[s];
    return el(
      "div",
      { class: `corpo larga sec-${s}` },
      el("div", { class: "sec-cab" }, el("h2", {}, sec.titulo), sec.subtitulo && el("p", {}, sec.subtitulo)),
      [auge40, fluxo41, prompt42, perguntas43][s](t, k, p, extra),
    );
  },

  5(t, p) {
    const i = t.interacao, lado = p - 1; // 0 = antes, 1 = depois
    if (p === 0) return duas(esquerda(t, p), el("div", { class: "lemas" }, i.lemas.map(citacao)));
    return duas(
      esquerda(t, p),
      el("div", { class: "seletor" }, i.estados.map((s, k) =>
        el("a", { class: "estado", href: rota("5", k + 1), "aria-current": k === lado && "true", "data-foco": `estado${k}` }, el("strong", {}, s.rotulo), ` ${s.marco}`),
      )),
      el("table", { class: "tabela" }, el("tbody", {}, i.linhas.map(([rotulo, ...v]) => el("tr", {}, el("th", { scope: "row" }, rotulo), el("td", {}, rico(v[lado])))))),
      lado === 1 && el("ul", { class: "adrs" }, i.adrs.map((a) => el("li", {}, el("span", { class: "etiqueta" }, `ADR ${a.n}`), el("strong", {}, rico(a.decisao)), el("span", {}, a.motivo)))),
    );
  },

  6(t, p) {
    const i = t.interacao;
    const PASSO = [0, 1, 2, 3, 4, 5, 7, 8]; // passo em que cada etapa abre; o 6 é o detalhe da etapa 6; o 9, as grafias
    const n = p === 6 ? 5 : PASSO.indexOf(p);
    const e = i.etapas[n];
    const linhas = (p === 6 ? e.detalhe : e?.exemplos) || [];
    const riacho = el(
      "ol",
      { class: "riacho" },
      i.etapas.map((x, k) => el("li", {}, el("a", { class: "etapa", href: rota("6", PASSO[k]), "aria-current": k === n && "step", "data-foco": `etapa${k}` }, blaze(k + 1, true), x.nome))),
      el("li", {}, el("a", { class: "etapa resto", href: rota("6", 9), "aria-current": p === 9 && "step", "data-foco": "etapa9" }, icone("bx-water"), i.grafias.titulo)),
    );
    const painel = e
      ? el(
          "div",
          { class: "painel registro" },
          el("h2", {}, blaze(n + 1, true), e.nome),
          el("p", { class: "painel-texto" }, rico(e.oque)),
          el("div", { class: "exemplos" },
            el("p", { class: "nota-fixa" }, i.rotuloExemplos),
            linhas.length
              ? linhas.map((x) => el("div", { class: `ex${x.rotulo ? " longo" : ""}` },
                  x.rotulo && el("span", { class: "ex-rotulo" }, rico(x.rotulo)),
                  el("span", { class: "ex-antes" }, x.antes ? rico(x.antes) : "—"),
                  icone("bx-right-arrow-alt"),
                  el("span", { class: "ex-depois" }, rico(x.depois)),
                ))
              : el("p", { class: "ex-vazio" }, "—"),
          ),
          p === 8 && el("p", { class: "resultado" }, icone("bx-data"), el("span", {}, rico(i.resultado))),
        )
      : el(
          "div",
          { class: "painel" },
          el("h2", {}, i.grafias.titulo),
          el("table", { class: "tabela grafias" },
            el("thead", {}, el("tr", {}, i.grafias.colunas.map((c) => el("th", { scope: "col" }, c)))),
            el("tbody", {}, i.grafias.linhas.map(([campo, n]) => el("tr", {}, el("th", { scope: "row" }, rico(campo)), el("td", {}, n)))),
          ),
          el("p", { class: "nota-fixa" }, i.grafias.nota),
        );
    return duas(el("div", { class: "esq" }, el("p", { class: "mensagem" }, rico(t.mensagem)), riacho), painel);
  },
};

function rodape(t, p) {
  const itens = (t.ingestao || []).filter((x) => noPasso(x, p));
  return el(
    "footer",
    { class: "pe" },
    itens.length > 0 && el("div", { class: "ingestao" }, el("h2", {}, ui.ingestao), el("ul", {}, itens.map((x) => el("li", {}, rico(x.texto))))),
    t.honesta && el("p", { class: "honesta" }, icone("bx-info-circle"), t.honesta),
    el("p", { class: "evidencia" }, `${ui.evidencia}: `, rico(t.evidencia)),
  );
}

export function desenharParada({ tela, passo, extra }) {
  const t = telas.find((x) => x.id === tela);
  return el(
    "section",
    { class: `parada parada-${tela}` },
    el("header", { class: "cab" }, blaze(tela), el("div", { class: "cab-titulo" }, el("h1", {}, t.titulo), el("p", { class: "marco" }, t.marco)), miniTrilha(tela)),
    CENAS[tela](t, passo, extra),
    rodape(t, passo),
  );
}
