let searchInput, searchResults;
let allPokemons = [];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função única para validar e navegar
function handleSearchAction(term) {
  const searchTerm = term.trim().toLowerCase();
  const found = allPokemons.some((p) => p.name === searchTerm);

  if (found) {
    window.location.href = `pokemon.html?name=${searchTerm}`;
  } else {
    searchResults.innerHTML = `<li>Pokémon não encontrado</li>`;
  }
}

function initSearch() {
  searchInput = document.getElementById("search-input");
  searchResults = document.getElementById("search-results");

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim();
    searchPokemon(term);
  });

  searchResults.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-name]");
    if (li) {
      handleSearchAction(li.dataset.name);
    }
  });

  document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();
    handleSearchAction(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchAction(searchInput.value);
    }
  });
}

async function loadPokemons() {
  try {
    const res = await fetch(`${BASE_URL}/pokemon?limit=1000`);
    const data = await res.json();
    allPokemons = data.results;
  } catch (err) {
    console.error("Erro ao carregar lista de pokémons:", err);
  }
}

async function searchPokemon(term) {
  if (!term) {
    searchResults.classList.add("hidden");
    searchResults.innerHTML = "";
    return;
  }

  try {
    const matches = allPokemons
      .filter((p) => p.name.includes(term.toLowerCase()))
      .slice(0, 5);

    if (matches.length === 0) {
      searchResults.innerHTML = `<li>Nenhum Pokémon encontrado</li>`;
      searchResults.classList.remove("hidden");
      return;
    }

    const details = await Promise.all(
      matches.map((p) => pokeApi.getDetailsPokemon(p))
    );

    searchResults.innerHTML = details
      .map((pkm) => {
        return `
        <li data-name="${pkm.name}" class="${pkm.type}">
          <img src="${pkm.cover}" alt="cover ${pkm.name}">
          <span>${capitalize(pkm.name)}</span>
        </li>
      `;
      })
      .join("");

    searchResults.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    searchResults.innerHTML = `<li>Erro ao buscar</li>`;
    searchResults.classList.remove("hidden");
  }
}

async function loadLayout() {
  const res = await fetch("layout.html");
  const html = await res.text();
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  document
    .getElementById("header")
    .replaceWith(tempDiv.querySelector("header"));
  document
    .getElementById("footer")
    .replaceWith(tempDiv.querySelector("footer"));

  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = "assets/images/Logo_Pokebola.png";
    document.head.appendChild(link);
  }

  initSearch();
}

(async () => {
  await loadLayout();
  await loadPokemons();
})();
