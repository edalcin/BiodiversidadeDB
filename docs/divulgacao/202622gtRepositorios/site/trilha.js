// Hub: perfil de elevação da trilha, caminhante, faixa de selos. Também os ajudantes de DOM usados por paradas.js.
import { telas, fontes, ui } from "./dados.js?v=2026-11-14a";

const NS = "http://www.w3.org/2000/svg";

function montar(e, attrs, filhos) {
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) e.setAttribute(k, v);
  e.append(...filhos.flat(Infinity).filter((f) => f != null && f !== false));
  return e;
}
export const el = (tag, attrs = {}, ...filhos) => montar(document.createElement(tag), attrs, filhos);
export const svg = (tag, attrs = {}, ...filhos) => montar(document.createElementNS(NS, tag), attrs, filhos);
export const icone = (nome) => el("i", { class: `bx ${nome}`, "aria-hidden": "true" });

// Mini-marcação de dados.js: `código`, _itálico_, **forte**. Só cria elementos; nunca innerHTML.
export function rico(texto) {
  const partes = [];
  let i = 0;
  for (const m of texto.matchAll(/`([^`]+)`|\*\*([^*]+)\*\*|(?<!\w)_([^_]+)_(?!\w)/g)) {
    if (m.index > i) partes.push(texto.slice(i, m.index));
    partes.push(m[1] != null ? el("code", {}, m[1]) : m[2] != null ? el("strong", {}, m[2]) : el("em", {}, m[3]));
    i = m.index + m[0].length;
  }
  if (i < texto.length) partes.push(texto.slice(i));
  return partes;
}

export const rota = (tela, passo = 0, extra) =>
  tela === "hub" ? "#/" : `#/${tela}${passo || extra != null ? `/${passo}` : ""}${extra != null ? `/${extra}` : ""}`;

// --- Perfil: viewBox 1600×900. x = ordem (não é tempo); y = 720 − 5 × altitude (plano, seção 7.1).
const INICIO = [64, 670];
const PARADA = { 1: [256, 595], 2: [464, 495], 3: [672, 380], 4: [880, 245], 5: [1088, 420], 6: [1296, 580] };
const FIM_ONLINE = [1056, 270];
const NEVOA = [[1472, 572], [1512, 562], [1552, 552], [1590, 545]];
const CAMINHO = [[0, 690], INICIO, ...Object.values(PARADA), ...NEVOA, [1640, 540]];
const CRISTA = [[0, 640], [64, 622], [256, 548], [464, 448], [672, 333], [880, 198], [1056, 232], [1200, 330], [1400, 430], [1600, 470]];
const SERRA = [[0, 500], [180, 430], [380, 470], [560, 360], [760, 300], [980, 150], [1180, 240], [1340, 330], [1480, 300], [1600, 360]];
const N = 24; // amostras por trecho

const cr = (a, b, c, d, u) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u);
// ponytail: a trilha passa exatamente pelos pontos (Catmull-Rom), então as paradas usam as coordenadas direto, sem getPointAtLength().
function amostrar(pts) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let k = 0; k < N; k++) out.push([cr(p0[0], p1[0], p2[0], p3[0], k / N), cr(p0[1], p1[1], p2[1], p3[1], k / N)]);
  }
  out.push(pts.at(-1));
  return out;
}
const linha = (pts) => "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
const encosta = (pts, dy = 0) => `${linha(pts.map(([x, y]) => [x, y + dy]))} L1600,900 L0,900 Z`;

const caminho = amostrar(CAMINHO);
const iP6 = N * 7; // índice da parada 6 em `caminho` (7 trechos antes dela)
const altura = (x) => (caminho.find((p) => p[0] >= x) || caminho.at(-1))[1];

function sorteio(semente) {
  let s = semente;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function floresta() {
  const r = sorteio(11);
  const crista = amostrar(CRISTA);
  const copasCrista = crista.filter((_, i) => i % 3 === 0).map(([x, y]) => svg("circle", { class: "mata-meio", cx: x.toFixed(0), cy: (y + 8).toFixed(0), r: (13 + r() * 13).toFixed(0) }));
  const copasEncosta = Array.from({ length: 90 }, () => {
    const x = r() * 1600, topo = altura(x) + 34;
    return svg("circle", { class: "copa", cx: x.toFixed(0), cy: (topo + r() * (840 - topo)).toFixed(0), r: (12 + r() * 16).toFixed(0) });
  });
  const perto = [[-20, 800, 78], [70, 840, 60], [1610, 770, 86], [1525, 825, 62], [1440, 850, 48]];
  return {
    fundo: [svg("path", { class: "serra", d: encosta(amostrar(SERRA)) }), svg("path", { class: "mata-meio", d: encosta(crista) }), copasCrista],
    frente: [svg("path", { class: "encosta", d: encosta(caminho, 4) }), copasEncosta],
    perto: perto.map(([cx, cy, raio]) => svg("circle", { class: "mata-perto", cx, cy, r: raio })),
  };
}

function riacho() {
  const nascentes = [[1128, 404], [1166, 376], [1206, 398], [1244, 440], [1278, 470]];
  return [
    svg("ellipse", { class: "clareira", cx: 1296, cy: 596, rx: 118, ry: 15 }),
    nascentes.map(([x, y]) => [
      svg("path", { class: "agua fina", d: `M${x},${y} Q${(x + 1255) / 2 - 12},${(y + 520) / 2 + 14} 1255,520` }),
      svg("circle", { class: "nascente", cx: x, cy: y, r: 4 }),
    ]),
    svg("path", { class: "agua", d: "M1255,520 C1262,545 1272,560 1266,596 C1258,650 1238,700 1218,840" }),
  ];
}

function placa(x, y, titulo, data, classe = "") {
  const w = Math.max(titulo.length * 10.6, data.length * 8.4) + 30;
  return [
    svg("rect", { class: `placa-rect ${classe}`, x, y, width: w.toFixed(0), height: 54, rx: 3 }),
    svg("text", { class: "placa-t", x: x + 14, y: y + 23 }, titulo),
    svg("text", { class: "placa-d", x: x + 14, y: y + 44 }, data),
  ];
}
const larguraPlaca = (t) => Math.max(t.curto.length * 10.6, t.data.length * 8.4) + 30;

function ponto(t, atual) {
  const [x, y] = PARADA[t.id];
  const mirante = t.id === "4";
  const w = larguraPlaca(t);
  // posição da placa, escrita à mão: subida = abaixo à direita; mirante = acima; descida = abaixo à esquerda
  const [px, py] = mirante ? [x - w / 2, y - 172] : t.id === "5" ? [x - w - 30, y + 14] : [x + 28, y + 18];
  return svg(
    "a",
    { class: `ponto${atual ? " atual" : ""}`, href: rota(t.id), "aria-current": atual && "step", "aria-label": `${ui.parada} ${t.id}: ${t.curto}, ${t.data}` },
    svg("circle", { class: "marca", cx: x, cy: y, r: mirante ? 26 : 20 }),
    svg("text", { class: "ponto-num", x, y: y + 7 }, t.id),
    placa(px, py, t.curto, t.data),
  );
}

function caminhante([x, y]) {
  const traco = "M0,-40 V-20 M0,-20 L-8,0 M0,-20 L8,0 M0,-34 L11,-25 M13,-42 V0";
  return svg(
    "g",
    { class: "caminhante", transform: `translate(${x - 2},${y - 24})`, "aria-hidden": "true" },
    svg("path", { class: "halo-traco", d: traco }),
    svg("circle", { class: "halo-traco", cx: 0, cy: -47, r: 6 }),
    svg("rect", { class: "mochila", x: -10, y: -40, width: 8, height: 14, rx: 2 }),
    svg("path", { class: "traco", d: traco }),
    svg("circle", { class: "cabeca", cx: 0, cy: -47, r: 6 }),
  );
}

function nevoa(fecho, passo) {
  const marcos = NEVOA.map(([x, y], i) =>
    svg("rect", { class: `marco-nevoa${fecho && i < 3 && passo >= i ? " aceso" : ""}`, x: x - 8, y: y - 30, width: 16, height: 28, rx: 5 }),
  );
  if (!fecho) return marcos;
  const x = 1300, y = 322;
  return [
    marcos,
    svg("path", { class: "guia", d: `M1530,${y + 162} V522` }),
    svg("rect", { class: "placa-rect", x, y, width: 292, height: 162, rx: 3 }),
    svg("text", { class: "placa-d italico", x: x + 14, y: y + 26 }, fecho.rotuloMarcos),
    fecho.marcos.map((nome, i) => [
      svg("rect", { class: `marco-nevoa${passo >= i ? " aceso" : ""}`, x: x + 14, y: y + 40 + i * 30, width: 11, height: 18, rx: 3 }),
      svg("text", { class: `placa-t${passo >= i ? "" : " fraco"}`, x: x + 36, y: y + 55 + i * 30 }, nome),
    ]),
    svg("rect", { class: "marco-nevoa", x: x + 14, y: y + 130, width: 11, height: 18, rx: 3 }),
    svg("text", { class: "placa-d", x: x + 36, y: y + 144 }, fecho.outras),
  ];
}

// e = { tela, passo, mapa }. mapa = hub aberto com H no meio da apresentação.
export function desenharHub(e) {
  const hub = telas[0];
  const fecho = e.tela === "fecho" && !e.mapa ? telas.at(-1) : null;
  const onde = e.tela === "hub" ? INICIO : PARADA[e.tela] || PARADA[6];
  const mata = floresta();
  const desenho = svg(
    "svg",
    { viewBox: "0 0 1600 900", role: "img", "aria-labelledby": "hub-t hub-d" },
    svg("title", { id: "hub-t" }, hub.titulo),
    svg("desc", { id: "hub-d" }, hub.descricao),
    svg(
      "defs",
      {},
      svg("linearGradient", { id: "g-ceu", x1: 0, y1: 0, x2: 0, y2: 1 }, svg("stop", { class: "ceu-a", offset: 0 }), svg("stop", { class: "ceu-b", offset: 0.75 })),
      svg("linearGradient", { id: "g-nevoa", x1: 0, y1: 0, x2: 1, y2: 0 }, svg("stop", { class: "nevoa-a", offset: 0 }), svg("stop", { class: "nevoa-b", offset: 0.8 })),
      svg("radialGradient", { id: "g-halo" }, svg("stop", { class: "halo-a", offset: 0 }), svg("stop", { class: "halo-b", offset: 1 })),
    ),
    svg(
      "g",
      { "aria-hidden": "true" },
      svg("rect", { width: 1600, height: 900, fill: "url(#g-ceu)" }),
      svg("circle", { class: "halo", cx: 880, cy: 225, r: 190, fill: "url(#g-halo)" }),
      mata.fundo,
      svg("path", { class: "trilha-online", d: `M${PARADA[4]} C940,236 1000,262 ${FIM_ONLINE}` }),
      svg("path", { class: "trilha-fim", d: `M${FIM_ONLINE[0]},${FIM_ONLINE[1] - 12} v24` }),
      mata.frente,
      riacho(),
      svg("path", { class: "trilha-borda", d: linha(caminho.slice(N, iP6 + 1)) }),
      svg("path", { class: "trilha-chao", d: linha(caminho.slice(N, iP6 + 1)) }),
      svg("path", { class: "trilha-nevoa", d: linha(caminho.slice(iP6)) }),
      svg("path", { class: "mirante", d: "M880,247 H972 M906,224 H972 M914,224 V247 M943,224 V247 M972,224 V247 M972,247 L936,284" }),
      mata.perto,
      svg("rect", { x: 1360, width: 240, height: 900, fill: "url(#g-nevoa)" }),
      svg("path", { class: "guia", d: `M${FIM_ONLINE[0]},${FIM_ONLINE[1] - 12} V172` }),
    ),
    svg("text", { class: "fase", x: 330, y: 392 }, hub.fase1),
    svg("text", { class: "fase", x: 1245, y: 283 }, hub.fase2),
    svg("text", { class: "encerrado", x: 1022, y: 166 }, hub.encerrado),
    nevoa(fecho, e.passo),
    svg("circle", { class: "marca inicio", cx: INICIO[0], cy: INICIO[1], r: 9 }),
    placa(30, 704, hub.inicio.curto, hub.inicio.data),
    telas.filter((t) => PARADA[t.id]).map((t) => ponto(t, (e.mapa || fecho) && t.id === (fecho ? "6" : e.tela))),
    caminhante(onde),
  );

  const ultimo = fecho && e.passo === fecho.passos - 1;
  let texto;
  if (fecho) texto = [el("p", { class: "hub-mensagem" }, fecho.mensagem), ultimo && el("p", { class: "hub-frase" }, fecho.frase)];
  else if (!e.mapa) texto = [el("h1", {}, hub.titulo), el("p", { class: "hub-sub" }, hub.subtitulo), hub.assinatura.map((a) => el("p", { class: "hub-assina" }, a))];
  return el(
    "section",
    { class: "hub" },
    desenho,
    texto && el("div", { class: "hub-texto" }, texto),
    ultimo && el("div", { class: "hub-rodape" }, fecho.rodape.map((r) => el("p", {}, rico(r)))),
  );
}

// Faixa de selos: a tese sem palavras. Estado não depende só de cor (peso, borda, texto oculto).
export function desenharSelos(t) {
  return fontes.map((f) => {
    const estado = t.selos.includes(f.id) ? "aceso" : t.aCaminho?.includes(f.id) ? "contorno" : "apagado";
    const leitura = { aceso: ui.integrada, contorno: ui.aCaminho, apagado: ui.naoIntegrada }[estado];
    return el(
      "span",
      { class: "selo", "data-estado": estado },
      icone(f.icone),
      f.rotulo,
      estado === "contorno" ? el("small", {}, ui.aCaminho) : el("span", { class: "sr" }, ` (${leitura})`),
    );
  });
}

// Mini-trilha do cabeçalho das paradas: o mesmo perfil, 6 pontos, o atual destacado.
export function miniTrilha(atual) {
  const mini = ([x, y]) => [(x * 0.2 + 8).toFixed(1), (y * 0.1 - 12).toFixed(1)];
  return svg(
    "svg",
    { class: "mini", viewBox: "0 0 336 62", role: "group", "aria-label": ui.miniTrilha },
    svg("path", { class: "mini-linha", d: linha(caminho.slice(N, iP6 + 1).map(mini).map(([x, y]) => [+x, +y])) }),
    svg("path", { class: "mini-linha nevoa", d: linha(caminho.slice(iP6).map(mini).map(([x, y]) => [+x, +y])) }),
    telas.filter((t) => PARADA[t.id]).map((t) => {
      const [cx, cy] = mini(PARADA[t.id]);
      const eAtual = t.id === atual;
      return svg(
        "a",
        { href: rota(t.id), class: `mini-ponto${eAtual ? " atual" : ""}`, "aria-current": eAtual && "step", "aria-label": `${ui.parada} ${t.id}: ${t.curto}` },
        svg("circle", { cx, cy, r: eAtual ? 9 : 5 }),
        eAtual && svg("text", { x: cx, y: +cy + 4 }, t.id),
      );
    }),
  );
}
