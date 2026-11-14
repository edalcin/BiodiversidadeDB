// Checagem de dados.js e dos arquivos do site (plano, seção 9.1). Uso: node verificar-dados.js
// Não vai para o web root.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { telas, fontes, auge, prompt, colecoes, perguntas } from "./site/dados.js";

const site = fileURLToPath(new URL("./site/", import.meta.url));
const ler = (nome) => readFileSync(site + nome, "utf8");

// Tempo e contagens
assert.equal(telas.reduce((s, t) => s + t.minutos, 0), 20, "a soma de minutos deve ser 20");
const paradas = telas.filter((t) => /^\d$/.test(t.id));
assert.equal(paradas.length, 6, "6 paradas");
assert.deepEqual(telas.map((t) => t.passos), [1, 4, 7, 6, 19, 3, 10, 4], "passos por tela (plano, tabela 7.3)");
assert.equal(prompt.blocos.length, 7, "7 blocos de prompt");
assert.equal(prompt.ligacoes.length, 5, "5 ligações");
assert.equal(perguntas.length, 14, "14 perguntas");
assert.deepEqual(perguntas.map((q) => q.destaque).filter(Boolean).sort(), [1, 2, 3, 4], "destaques 1 a 4, sem repetição");

// Passos declarados batem com o conteúdo que cada cena percorre
const [, p1, p2, p3, p4, p5, p6, fecho] = telas;
assert.equal(p1.passos, 1 + p1.interacao.faixas.length);
assert.equal(p2.passos, 1 + p2.interacao.placas.length);
assert.equal(p3.passos, 1 + p3.interacao.cartoes.length);
assert.equal(p4.passos, p4.secoes.reduce((s, x) => s + x.passos, 0));
assert.equal(p4.secoes[1].passos, p4.fluxo.length);
assert.equal(p4.secoes[2].passos, prompt.blocos.length + 2, "7 blocos + grafo do bloco 6 + lições");
assert.equal(p4.secoes[3].passos, 1 + 4, "lista + 4 destaques");
assert.equal(p5.passos, 1 + p5.interacao.estados.length);
assert.equal(p6.passos, p6.interacao.etapas.length + 2, "8 etapas + detalhe da etapa 6 + grafias");
assert.equal(fecho.passos, fecho.marcos.length + 1);
for (const t of paradas) {
  for (let p = 0; p < t.passos; p++) {
    const n = (t.ingestao || []).filter((x) => p >= (x.de ?? 0) && p <= (x.ate ?? Infinity)).length;
    assert.ok(n <= 3, `parada ${t.id}, passo ${p}: ${n} itens de ingestão (máximo 3)`);
  }
}

// Auge: os reinos somam o total
for (const k of ["especies", "ocorrencias"]) {
  const { total, ...reinos } = auge[k];
  assert.equal(Object.values(reinos).reduce((s, n) => s + n, 0), total, `auge.${k}: soma dos reinos ≠ total`);
}
assert.equal(auge.tematicas.length, 4);

// Coleções citadas existem no grafo
const nos = new Set(colecoes.map((c) => c.id));
for (const l of prompt.ligacoes) assert.ok(nos.has(l.de) && nos.has(l.para), `ligação ${l.de} → ${l.para}: coleção fora do grafo`);
for (const q of perguntas) for (const c of q.colecoes) assert.ok(nos.has(c), `pergunta "${q.texto}": coleção ${c} fora do grafo`);

// Selos: existem e seguem a tabela do roteiro, seção 4
const ids = new Set(fontes.map((f) => f.id));
const dois = ["especies", "ocorrencias"];
const cinco = [...dois, "ameacadas", "invasoras", "ucs"];
const esperado = { hub: [], 1: dois, 2: dois, 3: cinco, 4: cinco, 5: dois, 6: dois, fecho: dois };
for (const t of telas) {
  for (const s of [...t.selos, ...(t.aCaminho || [])]) assert.ok(ids.has(s), `tela ${t.id}: selo ${s} não existe`);
  assert.deepEqual(t.selos, esperado[t.id], `selos da tela ${t.id}`);
}
assert.deepEqual(fecho.aCaminho, ["ameacadas", "invasoras", "ucs"]);

// Sem respostas e sem inferência na tela
assert.ok(!JSON.stringify({ telas, auge, prompt, perguntas }).includes("INFERÊNCIA"), "texto marcado [INFERÊNCIA] não vai para a tela");
for (const q of perguntas) assert.deepEqual(Object.keys(q).filter((k) => !["texto", "colecoes", "destaque", "nota"].includes(k)), [], "pergunta com campo extra (resposta?)");

// VERSAO igual em todos os pontos
const sw = ler("sw.js");
const VERSAO = sw.match(/const VERSAO = "([^"]+)"/)[1];
const fontesJs = ["index.html", "app.js", "trilha.js", "paradas.js"];
for (const nome of fontesJs) {
  const vs = [...ler(nome).matchAll(/\?v=([\w.-]+)/g)].map((m) => m[1]);
  assert.ok(vs.length > 0, `${nome}: nenhum ?v=`);
  for (const x of vs) assert.equal(x, VERSAO, `${nome}: ?v=${x} ≠ VERSAO ${VERSAO}`);
}
for (const nome of fontesJs) {
  for (const m of ler(nome).matchAll(/(?:from\s+|src=|href=)"([^"?]+\.(?:js|css))(\?v=[^"]*)?"/g)) {
    assert.ok(m[2], `${nome}: ${m[1]} sem ?v=`);
  }
}

// Lista do sw.js = arquivos do site; nomes permitidos pelo WAF e pelo nginx (plano, seção 5)
const arquivos = readdirSync(site, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => (d.parentPath.slice(site.length) + "/" + d.name).replaceAll("\\", "/").replace(/^\//, ""));
const foraDoShell = ["sw.js", "vendor/boxicons/LICENSE"];
const v = `?v=${VERSAO}`; // usado pelo eval da lista abaixo
const shell = eval(sw.match(/const SHELL = (\[[\s\S]*?\]);/)[1]).map((u) => u.replace(/^\.\//, "").replace(/\?.*$/, "")).filter(Boolean);
assert.deepEqual(shell.sort(), arquivos.filter((a) => !foraDoShell.includes(a)).sort(), "lista do sw.js ≠ arquivos de site/");
for (const a of arquivos) {
  if (a === "vendor/boxicons/LICENSE") continue; // nome de origem da licença; o servidor não bloqueia
  assert.match(a, /^[a-z0-9./-]+$/, `${a}: só ASCII minúsculo e hífen`);
  assert.ok(!/\.(db|log|ini|conf|bak|zip|sqlite|m3u)/.test(a) && !a.endsWith(".mjs") && !/(^|\/)\./.test(a), `${a}: nome bloqueado`);
}

console.log(`ok: ${telas.reduce((s, t) => s + t.passos, 0)} passos, ${arquivos.length} arquivos, VERSAO ${VERSAO}`);
