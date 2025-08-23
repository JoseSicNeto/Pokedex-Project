const params = new URLSearchParams(window.location.search);
const pokemonName = params.get("name") || params.get("id");

const backBtn = document.getElementById("backBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const profileSection = document.getElementById("profile");


// Capitaliza a primeira letra de uma string
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Aguarda um tempo em ms
function aguardar(ms) {
  return new Promise((res) => setTimeout(res, ms));
}


// Carrega e exibe o perfil do Pokémon
async function carregarPerfilPokemon() {
  // Mostra loader e esconde perfil
  loadingIndicator.classList.remove("hidden");
  profileSection.classList.add("hidden");

  const pokemon = await pokeApi.buscarPokemonCompleto(pokemonName);

  // Pequeno delay para suavizar transição
  await aguardar(600);

  profileSection.className = `profile ${pokemon.type}`;

  // Nome e imagem
  document.getElementById("name").textContent = `#${pokemon.id} ${pokemon.name}`;
  document.getElementById("cover").src = pokemon.cover;
  document.getElementById("cover").alt = pokemon.name;

  // Tipos
  const typesEl = document.getElementById("types");
  typesEl.innerHTML = "";
  pokemon.types.forEach((t) => {
    const li = document.createElement("li");
    li.className = `type ${t}`;
    li.textContent = t;
    typesEl.appendChild(li);
  });

  // Medidas
  document.getElementById("height").textContent = `${(pokemon.height / 10).toFixed(2)} m`;
  document.getElementById("weight").textContent = `${(pokemon.weight / 10).toFixed(2)} kg`;

  // Habilidades
  document.getElementById("abilities").textContent = pokemon.abilities.join(", ");

  // Valores máximos para cálculo de barra de status
  const MAX_STATS = {
    hp: 255,
    attack: 165,
    defense: 230,
    "special-attack": 154,
    "special-defense": 230,
    speed: 160,
  };

  // Evoluções
  const evoTextEl = document.getElementById("evolutions");
  const evoContainer = document.getElementById("evolutionChain");
  const chain = pokemon.evolutions || [];

  if (chain.length <= 1) {
    evoTextEl.textContent = "None";
    evoContainer.innerHTML = "";
  } else {
    evoTextEl.textContent = chain.map(capitalizar).join(" → ");

    const evoDetails = await Promise.all(
      chain.map((name) => pokeApi.buscarPokemonBasico(name))
    );

    evoContainer.innerHTML = evoDetails
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
  const statsEl = document.getElementById("stats");
  statsEl.innerHTML = "";

  pokemon.stats.forEach((s) => {
    const max = MAX_STATS[s.name] || 100;
    const pct = Math.round((s.value / max) * 100);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${s.name}</strong>
      <div class="stat-bar">
        <div class="stat-fill ${pokemon.type}" style="width: ${pct}%"></div>
        <span class="stat-number">${s.value}</span>
      </div>
    `;
    statsEl.appendChild(li);
  });

  // Esconde loader e mostra perfil
  loadingIndicator.classList.add("hidden");
  profileSection.classList.remove("hidden");
}

// Botão de voltar
backBtn.addEventListener("click", () => history.back());

// Inicialização
carregarPerfilPokemon();
