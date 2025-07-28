// Configurações de cada geração (offset + limit).
const generationRanges = [
  { name: "Kanto", start: 0, limit: 151 },
  { name: "Johto", start: 151, limit: 100 },
  { name: "Hoenn", start: 251, limit: 135 },
  { name: "Sinnoh", start: 386, limit: 107 },
  { name: "Unova", start: 493, limit: 156 },
  { name: "Kalos", start: 649, limit: 72 },
  { name: "Alola", start: 721, limit: 86 },
  { name: "Galar", start: 807, limit: 98 },
  { name: "Paldea", start: 905, limit: 105 },
];

// Seleção de elementos do DOM.
const pokemonList = document.getElementById("pokemonList");
const generationTitle = document.getElementById("generationTitle");
const firstButton = document.getElementById("firstButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const lastButton = document.getElementById("lastButton");
const pageListContainer = document.getElementById("pageListContainer");

// Detecta mobile e define tamanho da janela de botões.
function isMobile() {
  return window.innerWidth < 600;
}
function getWindowSize() {
  return isMobile() ? 1 : 3;
}

// Extrai o índice da geração atual a partir da hash (#/generation/N).
function getGenIndexFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/");
  if (parts[0] === "generation") {
    const n = Number(parts[1]);
    if (!isNaN(n) && n >= 1 && n <= generationRanges.length) {
      return n - 1;
    }
  }
  return null;
}

// Delay utilitário para feedback visual
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Converte objeto Pokémon em elemento <li>
function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}">
      <a href="pokemon.html?name=${pokemon.name}">
        <div class="pokemon-item">
          <span class="name">${pokemon.name}</span>
          <span class="number">#${pokemon.id}</span>
        </div>
        <div class="detail">
          <ol class="types">
            ${pokemon.types
              .map((t) => `<li class="type ${t}">${t}</li>`)
              .join("")}
          </ol>
          <img src="${pokemon.cover}" alt="${pokemon.name}">
        </div>
      </a>
    </li>`;
}

// Renderiza os botões de página em torno do índice atual.
function renderPageButtons() {
  const total = generationRanges.length;
  const windowSize = getWindowSize();
  const start = Math.max(0, currentGenIndex - windowSize);
  const end = Math.min(total - 1, currentGenIndex + windowSize);

  pageListContainer.innerHTML = "";
  for (let idx = start; idx <= end; idx++) {
    const btn = document.createElement("button");
    btn.className =
      "page-btn" + (idx === currentGenIndex ? " current-page" : "");
    btn.textContent = idx + 1;
    btn.type = "button";
    btn.dataset.index = idx;
    btn.addEventListener("click", () => {
      currentGenIndex = idx;
      loadCurrentGeneration();
    });
    pageListContainer.append(btn);
  }
}

// Carrega a geração atual e atualiza a URL.
async function loadCurrentGeneration(push = true) {
  generationTitle.classList.add("hidden");
  [
    firstButton,
    previousButton,
    nextButton,
    lastButton,
    ...document.querySelectorAll(".page-btn"),
  ].forEach((btn) => (btn.disabled = true));

  window.scrollTo({ top: 0, behavior: "smooth" });
  pokemonList.innerHTML = `<li id="loadingIndicator">Carregando...</li>`;

  const { name, start: offset, limit } = generationRanges[currentGenIndex];
  const pokemons = await pokeApi.getPokemons(offset, limit);
  await delay(800);

  generationTitle.textContent = `${currentGenIndex + 1} – ${name}`;
  if (push) {
    location.hash = `/generation/${currentGenIndex + 1}`;
  }

  pokemonList.innerHTML = pokemons.map(convertPokemonToLi).join("");
  generationTitle.classList.remove("hidden");

  localStorage.setItem("currentGenIndex", currentGenIndex);
  updatePaginationControls();
}

// Atualiza estados dos botões de Paginação.
function updatePaginationControls() {
  const isFirst = currentGenIndex === 0;
  const isLast = currentGenIndex === generationRanges.length - 1;

  firstButton.disabled = isFirst;
  previousButton.disabled = isFirst;
  nextButton.disabled = isLast;
  lastButton.disabled = isLast;

  renderPageButtons();
  document.querySelectorAll(".page-btn").forEach((btn) => {
    const idx = Number(btn.dataset.index);
    btn.disabled = false;
    btn.classList.toggle("current-page", idx === currentGenIndex);
  });
}

// Ações/Listeners de navegação padrão.
firstButton.addEventListener("click", () => {
  currentGenIndex = 0;
  loadCurrentGeneration();
});
previousButton.addEventListener("click", () => {
  if (currentGenIndex > 0) {
    currentGenIndex--;
    loadCurrentGeneration();
  }
});
nextButton.addEventListener("click", () => {
  if (currentGenIndex < generationRanges.length - 1) {
    currentGenIndex++;
    loadCurrentGeneration();
  }
});
lastButton.addEventListener("click", () => {
  currentGenIndex = generationRanges.length - 1;
  loadCurrentGeneration();
});

// Ajusta paginação ao redimensionar a janela.
window.addEventListener("resize", updatePaginationControls);

// Lida com mudanças de hash.
window.addEventListener("hashchange", () => {
  const idx = getGenIndexFromHash();
  if (idx !== null && idx !== currentGenIndex) {
    currentGenIndex = idx;
    loadCurrentGeneration(false);
  }
});

// Inicialização: extrai do hash e, se não houver, tenta savedIndex.
const hashIndex  = getGenIndexFromHash();
const savedIndex = parseInt(localStorage.getItem("currentGenIndex"), 10);

let currentGenIndex;
if (hashIndex !== null) {
  currentGenIndex = hashIndex;
} else if (!isNaN(savedIndex) &&
           savedIndex >= 0 &&
           savedIndex < generationRanges.length) {
  currentGenIndex = savedIndex;
} else {
  currentGenIndex = 0;
}

loadCurrentGeneration();
