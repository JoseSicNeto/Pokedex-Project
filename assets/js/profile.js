const urlParams = new URLSearchParams(window.location.search);
const pokemonNome = urlParams.get("name") || urlParams.get("id");

const botaoVoltar = document.getElementById("backBtn");
const indicadorCarregando = document.getElementById("loadingIndicator");
const secaoPerfil = document.getElementById("profile");

// Capitaliza a primeira letra de uma string
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// Aguarda um tempo em ms
function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// Carrega e exibe o perfil do Pokémon
async function carregarPerfilPokemon() {
  // Mostra loader e esconde perfil
  indicadorCarregando.classList.remove("hidden");
  secaoPerfil.classList.add("hidden");

  const pokemon = await pokeApi.buscarPokemonCompleto(pokemonNome);

  // Pequeno delay para suavizar transição
  await aguardar(600);

  secaoPerfil.className = `profile ${pokemon.type}`;

  // Nome e imagem
  document.getElementById("name").textContent = `#${pokemon.id} ${pokemon.name}`;
  document.getElementById("cover").src = pokemon.cover;
  document.getElementById("cover").alt = pokemon.name;

  // Tipos
  const tiposElemento = document.getElementById("types");
  tiposElemento.innerHTML = "";
  pokemon.types.forEach((tipo) => {
    const li = document.createElement("li");
    li.className = `type ${tipo}`;
    li.textContent = tipo;
    tiposElemento.appendChild(li);
  });

  // Medidas
  document.getElementById("height").textContent = `${(pokemon.height / 10).toFixed(2)} m`;
  document.getElementById("weight").textContent = `${(pokemon.weight / 10).toFixed(2)} kg`;

  // Habilidades
  document.getElementById("abilities").textContent = pokemon.abilities.join(", ");

  // Valores máximos para cálculo de barra de status
  const maxStats = {
    hp: 255,
    attack: 165,
    defense: 230,
    "special-attack": 154,
    "special-defense": 230,
    speed: 160,
  };

  // Evoluções
  const evolucaoTextoElemento = document.getElementById("evolutions");
  const evolucaoContainer = document.getElementById("evolutionChain");
  const cadeiaEvolucao = pokemon.evolutions || [];

  if (cadeiaEvolucao.length <= 1) {
    evolucaoTextoElemento.textContent = "None";
    evolucaoContainer.innerHTML = "";
  } else {
    evolucaoTextoElemento.textContent = cadeiaEvolucao.map(capitalizar).join(" → ");

    const detalhesEvolucao = await Promise.all(
      cadeiaEvolucao.map((nome) => pokeApi.buscarPokemonBasico(nome))
    );

    evolucaoContainer.innerHTML = detalhesEvolucao
      .map(
        (p) => `
          <a href="pokemon.html?name=${p.name}" class="evo-card">
            <img src="${p.cover}" alt="${p.name}" />
            <span>#${p.id}</span>
            <span>${p.name}</span>
          </a>
        `
      )
      .join("");
  }

  // Estatísticas
  const statsElemento = document.getElementById("stats");
  statsElemento.innerHTML = "";

  pokemon.stats.forEach((stat) => {
    const max = maxStats[stat.name] || 100;
    const porcentagem = Math.round((stat.value / max) * 100);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${stat.name}</strong>
      <div class="stat-bar">
        <div class="stat-fill ${pokemon.type}" style="width: ${porcentagem}%"></div>
        <span class="stat-number">${stat.value}</span>
      </div>
    `;
    statsElemento.appendChild(li);
  });

  // Esconde loader e mostra perfil
  indicadorCarregando.classList.add("hidden");
  secaoPerfil.classList.remove("hidden");
}


// Botão de voltar
botaoVoltar.addEventListener("click", () => history.back());

// Inicialização
carregarPerfilPokemon();
