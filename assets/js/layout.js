let searchInput, searchResults;
let allPokemons = [];


// Capitaliza a primeira letra de uma string
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// Valida o termo e navega para a página do Pokémon
function executarAcaoBusca(term) {
  const searchTerm = term.trim().toLowerCase();
  const found = allPokemons.some((p) => p.name === searchTerm);

  if (found) {
    window.location.href = `pokemon.html?name=${searchTerm}`;
  } else {
    searchResults.innerHTML = `<li>Pokémon não encontrado</li>`;
  }
}


// Inicializa eventos de busca
function inicializarBusca() {
  searchInput = document.getElementById("search-input");
  searchResults = document.getElementById("search-results");

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim();
    buscarPokemon(term);
  });

  searchResults.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-name]");
    if (li) {
      executarAcaoBusca(li.dataset.name);
    }
  });

  document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();
    executarAcaoBusca(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executarAcaoBusca(searchInput.value);
    }
  });
}


// Carrega lista de todos os Pokémons
async function carregarListaPokemons() {
  try {
    const res = await fetch(`${BASE_URL}/pokemon?limit=1000`);
    const data = await res.json();
    allPokemons = data.results;
  } catch (err) {
    console.error("Erro ao carregar lista de pokémons:", err);
  }
}


// Busca Pokémons pelo termo digitado
async function buscarPokemon(term) {
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
      matches.map((p) => pokeApi.buscarPokemonCompleto(p))
    );

    searchResults.innerHTML = details
      .map((pkm) => {
        return `
        <li data-name="${pkm.name}" class="${pkm.type}">
          <img src="${pkm.cover}" alt="cover ${pkm.name}">
          <span>${capitalizar(pkm.name)}</span>
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


// Carrega layout (header/footer) e inicializa busca
async function carregarLayout() {
  const res = await fetch("layout.html");
  const html = await res.text();
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  document.getElementById("header").replaceWith(tempDiv.querySelector("header"));
  document.getElementById("footer").replaceWith(tempDiv.querySelector("footer"));

  // Adiciona favicon se não existir
  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = "assets/images/Logo_Pokebola.png";
    document.head.appendChild(link);
  }

  inicializarBusca();
}


// Execução inicial
(async () => {
  await carregarLayout();
  await carregarListaPokemons();
})();
