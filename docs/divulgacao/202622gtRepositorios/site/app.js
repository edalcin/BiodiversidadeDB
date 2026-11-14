// Estado = URL. #/ hub · #/N parada · #/N/P passo · #/N/P/X extra (pergunta clicada) · #/fecho · #/h/N/P trilha aberta com H.
import { telas, ui } from "./dados.js?v=2026-11-14a";
import { desenharHub, desenharSelos, rota } from "./trilha.js?v=2026-11-14a";
import { desenharParada } from "./paradas.js?v=2026-11-14a";

const $ = (id) => document.getElementById(id);
const raiz = document.documentElement;
// A apresentação é uma lista linear de passos: uma tecla conduz tudo.
const seq = telas.flatMap((t) => Array.from({ length: t.passos }, (_, passo) => ({ tela: t.id, passo })));
let porPonteiro = false;

function ler() {
  let [a, b, c] = location.hash.replace(/^#\/?/, "").split("/");
  const mapa = a === "h";
  if (mapa) [a, b, c] = [b, c];
  const t = telas.find((x) => x.id === (a || "hub")) || telas[0];
  const passo = Math.min(Math.max(parseInt(b) || 0, 0), t.passos - 1);
  const extra = parseInt(c);
  return { t, tela: t.id, passo, extra: Number.isNaN(extra) ? undefined : extra, mapa: mapa && t.id !== "hub" };
}

function ligar(a, destino) {
  if (destino) a.setAttribute("href", destino);
  else a.removeAttribute("href");
  a.setAttribute("aria-disabled", String(!destino));
}

function desenhar() {
  const e = ler();
  const foco = porPonteiro ? null : document.activeElement?.dataset?.foco;
  const noHub = e.mapa || e.tela === "hub" || e.tela === "fecho";
  $("palco").dataset.paleta = e.tela === "4" && !e.mapa ? "ceu" : "mata";
  $("tela").replaceChildren(noHub ? desenharHub(e) : desenharParada(e));
  $("selos").replaceChildren(...desenharSelos(e.mapa || e.tela !== "fecho" ? { selos: e.t.selos } : e.t));

  const aqui = rota(e.tela, e.passo);
  const i = seq.findIndex((s) => s.tela === e.tela && s.passo === e.passo);
  ligar($("ant"), e.mapa ? aqui : seq[i - 1] && rota(seq[i - 1].tela, seq[i - 1].passo));
  ligar($("prox"), e.mapa ? aqui : seq[i + 1] && rota(seq[i + 1].tela, seq[i + 1].passo));
  ligar($("mapa"), e.mapa ? aqui : e.tela === "hub" ? null : `#/h/${e.tela}/${e.passo}`);
  $("conta").textContent = `${e.passo + 1}/${e.t.passos}`;

  const nome = e.tela === "hub" ? `${ui.trilha}, ${ui.abertura}` : e.mapa ? ui.trilha : `${e.tela === "fecho" ? ui.fecho : `${ui.parada} ${e.tela}`}: ${e.t.titulo}, ${ui.passo} ${e.passo + 1} ${ui.de} ${e.t.passos}`;
  $("anuncio").textContent = nome;
  document.title = e.tela === "hub" ? telas[0].titulo : `${e.t.titulo} · ${telas[0].titulo}`;
  if (foco) document.querySelector(`[data-foco="${foco}"]`)?.focus();
}

function alternarTema() {
  raiz.dataset.theme = raiz.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("tema", raiz.dataset.theme);
  } catch {} // sem armazenamento: o tema vale só para esta visita
}
const telaCheia = () => (document.fullscreenElement ? document.exitFullscreen() : raiz.requestFullscreen());

addEventListener("hashchange", desenhar);
addEventListener("pointerdown", () => (porPonteiro = true));
// Depois de um clique, o controle perde o foco: Espaço e Enter voltam a significar "próximo".
addEventListener("click", (ev) => porPonteiro && ev.target.closest?.("a, button")?.blur());
addEventListener("keydown", (ev) => {
  porPonteiro = false;
  if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
  const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
  if ((k === "Enter" || k === " ") && ev.target.closest?.("a[href], button")) return; // ativa o controle focado
  const ir = (id) => $(id).hasAttribute("href") && (location.hash = $(id).getAttribute("href"));
  if (["ArrowRight", " ", "PageDown", "Enter"].includes(k)) ir("prox");
  else if (["ArrowLeft", "PageUp"].includes(k)) ir("ant");
  else if (k === "h" || k === "Escape") ir("mapa");
  else if (k >= "1" && k <= "6") location.hash = rota(k);
  else if (k === "t") alternarTema();
  else if (k === "f") telaCheia();
  else return;
  ev.preventDefault();
});
$("tema").addEventListener("click", alternarTema);
$("cheia").addEventListener("click", telaCheia);

desenhar();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=2026-11-14a");
