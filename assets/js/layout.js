let campoBusca, resultadosBusca;
let todosPokemons = [];

// Capitaliza a primeira letra de uma string
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// Valida o termo e navega para a página do Pokémon
function executarAcaoBusca(termo) {
  const termoBusca = termo.trim().toLowerCase();
  const encontrado = todosPokemons.some((p) => p.name === termoBusca);

  if (encontrado) {
    window.location.href = `pokemon.html?name=${termoBusca}`;
  } else {
    resultadosBusca.innerHTML = `<li>Pokémon não encontrado</li>`;
  }
}


// Inicializa eventos de busca
function inicializarBusca() {
  campoBusca = document.getElementById("search-input");
  resultadosBusca = document.getElementById("search-results");

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.trim();
    buscarPokemon(termo);
  });

  resultadosBusca.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-name]");
    if (li) {
      executarAcaoBusca(li.dataset.name);
    }
  });

  document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();
    executarAcaoBusca(campoBusca.value);
  });

  campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executarAcaoBusca(campoBusca.value);
    }
  });
}


// Carrega lista de todos os Pokémons
async function carregarListaPokemons() {
  try {
    const resposta = await fetch(`${BASE_URL}/pokemon?limit=1000`);
    const dados = await resposta.json();
    todosPokemons = dados.results;
  } catch (erro) {
    console.error("Erro ao carregar lista de pokémons:", erro);
  }
}


// Busca Pokémons pelo termo digitado
async function buscarPokemon(termo) {
  if (!termo) {
    resultadosBusca.classList.add("hidden");
    resultadosBusca.innerHTML = "";
    return;
  }

  try {
    const correspondencias = todosPokemons
      .filter((p) => p.name.includes(termo.toLowerCase()))
      .slice(0, 5);

    if (correspondencias.length === 0) {
      resultadosBusca.innerHTML = `<li>Nenhum Pokémon encontrado</li>`;
      resultadosBusca.classList.remove("hidden");
      return;
    }

    const detalhes = await Promise.all(
      correspondencias.map((p) => pokeApi.buscarPokemonCompleto(p))
    );

    resultadosBusca.innerHTML = detalhes
      .map(
        (pkm) => `
          <li data-name="${pkm.name}" class="${pkm.type}">
            <img src="${pkm.cover}" alt="cover ${pkm.name}">
            <span>${capitalizar(pkm.name)}</span>
          </li>
        `
      )
      .join("");

    resultadosBusca.classList.remove("hidden");
  } catch (erro) {
    console.error(erro);
    resultadosBusca.innerHTML = `<li>Erro ao buscar</li>`;
    resultadosBusca.classList.remove("hidden");
  }
}


// Carrega layout (header/footer) e inicializa busca
async function carregarLayout() {
  const resposta = await fetch("layout.html");
  const html = await resposta.text();
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
