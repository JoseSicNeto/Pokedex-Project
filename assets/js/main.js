// configurações de cada geração (offset + limit)
const generationRanges = [
  { name: "Kanto", start: 0, end: 151 },
  { name: "Johto", start: 151, end: 100 },
  { name: "Hoenn", start: 251, end: 135 },
  { name: "Sinnoh", start: 386, end: 107 },
  { name: "Unova", start: 493, end: 156 },
  { name: "Kalos", start: 649, end: 72 },
  { name: "Alola", start: 721, end: 86 },
  { name: "Galar", start: 807, end: 98 },
  { name: "Paldea", start: 905, end: 105 },
];

const pokemonList = document.getElementById("pokemonList");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const generationTitle = document.getElementById("generationTitle");

// índice atual (tenta recuperar do localStorage)
let currentGenIndex = 0;
const savedIndex = parseInt(localStorage.getItem("currentGenIndex"), 10);
if (
  !isNaN(savedIndex) &&
  savedIndex >= 0 &&
  savedIndex < generationRanges.length
) {
  currentGenIndex = savedIndex;
}

const generationCache = new Map();

// utilitário para delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// converte cada Pokémon em um <li>
function convertPokemonToLi(pokemon) {
  return `
      <li class="pokemon ${pokemon.types[0]}">
        <span class="number">#${pokemon.id}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">
            ${pokemon.types
              .map((t) => `<li class="type ${t}">${t}</li>`)
              .join("")}
          </ol>
          <img src="${pokemon.cover}" alt="${pokemon.name}">
        </div>
      </li>
    `;
}

async function loadCurrentGeneration() {
  previousButton.disabled = true;
  nextButton.disabled = true;
  const { name, start: offset, end: limit } = generationRanges[currentGenIndex];

  generationTitle.classList.add("hidden");

  // rola pro topo suavemente
  window.scrollTo({ top: 0, behavior: "smooth" });

  // feedback de carregamento
  pokemonList.innerHTML = `<li id="loadingIndicator">Carregando...</li>`;

  // key do cache
  const cacheKey = `${offset}_${limit}`;

  let pokemons;
  if (generationCache.has(cacheKey)) {
    pokemons = generationCache.get(cacheKey);
  } else {
    pokemons = await pokeApi.getPokemons(offset, limit);
    generationCache.set(cacheKey, pokemons);
  }

  await delay(800);

  generationTitle.textContent = `${currentGenIndex + 1} - ${name}`;
  generationTitle.classList.remove("hidden");
  
  pokemonList.innerHTML = pokemons.map(convertPokemonToLi).join("");
  updateButtons();
  localStorage.setItem("currentGenIndex", currentGenIndex);
}

function updateButtons() {
  const isFirst = currentGenIndex === 0;
  const isLast = currentGenIndex === generationRanges.length - 1;

  previousButton.style.visibility = isFirst ? "hidden" : "visible";
  nextButton.style.visibility = isLast ? "hidden" : "visible";

  previousButton.disabled = isFirst;
  nextButton.disabled = isLast;
}

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

loadCurrentGeneration();
