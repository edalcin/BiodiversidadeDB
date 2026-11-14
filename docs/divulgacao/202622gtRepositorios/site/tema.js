// Script clássico e bloqueante: define o tema antes da primeira pintura (sem piscar).
(function () {
  var salvo = null;
  try {
    salvo = localStorage.getItem("tema");
  } catch (e) {}
  document.documentElement.dataset.theme = salvo || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
})();
