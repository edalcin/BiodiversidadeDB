// Cache do shell para uso offline. VERSAO muda a cada publicação (plano, seção 6.10).
const VERSAO = "2026-11-14a";
const CACHE = `trilha-${VERSAO}`;
const v = `?v=${VERSAO}`;
const SHELL = [
  "./",
  "./index.html",
  `./estilo.css${v}`,
  `./tema.js${v}`,
  `./app.js${v}`,
  `./trilha.js${v}`,
  `./paradas.js${v}`,
  `./dados.js${v}`,
  "./manifest.json",
  "./icone.svg",
  `./vendor/boxicons/boxicons.min.css${v}`,
  "./vendor/boxicons/boxicons.woff2",
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (ev) => {
  const pedido = ev.request;
  // ponytail: a página (HTML) vai à rede primeiro e só cai no cache sem rede. Com cache-first no HTML,
  // uma publicação nova ficaria presa atrás do index antigo. O resto do shell é cache-first, com ?v= na URL.
  ev.respondWith(
    pedido.mode === "navigate"
      ? fetch(pedido).catch(() => caches.match("./"))
      : caches.match(pedido).then((r) => r || fetch(pedido)),
  );
});
