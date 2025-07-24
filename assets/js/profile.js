const params = new URLSearchParams(window.location.search);
const pokemonName = params.get("name") || params.get("id");

const backBtn = document.getElementById("backBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const profileSection = document.getElementById("profile");

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function loadProfile() {
  // mostra loader, esconde o profile
  loadingIndicator.classList.remove("hidden");
  profileSection.classList.add("hidden");

  // fetch do detalhe (usa cache interno)
  const pokemon = await pokeApi.getDetailsPokemon(pokemonName);

  // pequeno delay
  await delay(600);

  // limpa classes antigas e adiciona só o tipo atual
  profileSection.className = `profile ${pokemon.type}`;

  // preenche o conteúdo
  document.getElementById(
    "name"
  ).textContent = `#${pokemon.id} ${pokemon.name}`;
  document.getElementById("cover").src = pokemon.cover;
  document.getElementById("cover").alt = pokemon.name;

  // tipos
  const typesEl = document.getElementById("types");
  typesEl.innerHTML = "";
  pokemon.types.forEach((t) => {
    const li = document.createElement("li");
    li.className = `type ${t}`;
    li.textContent = t;
    typesEl.appendChild(li);
  });

  // medidas (m e kg)
  document.getElementById("height").textContent = `${(
    pokemon.height / 10
  ).toFixed(2)} m`;
  document.getElementById("weight").textContent = `${(
    pokemon.weight / 10
  ).toFixed(2)} kg`;

  // habilidades
  document.getElementById("abilities").textContent =
    pokemon.abilities.join(", ");

  // stats
  const MAX_STATS = {
    hp: 255,
    attack: 165,
    defense: 230,
    "special-attack": 154,
    "special-defense": 230,
    speed: 160,
  };

  // evolutions
  const evoTextEl = document.getElementById("evolutions");
  const evoContainer = document.getElementById("evolutionChain");
  const chain = pokemon.evolutions || [];

  if (chain.length <= 1) {
    evoTextEl.textContent = "None";
    evoContainer.innerHTML = "";
  } else {
    evoTextEl.textContent = chain
      .map((n) => n[0].toUpperCase() + n.slice(1))
      .join(" → ");

    const evoDetails = await Promise.all(
      chain.map((name) => pokeApi.getDetailsPokemon(name))
    );

    // imagens
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

  // esconde loader, mostra perfil
  loadingIndicator.classList.add("hidden");
  profileSection.classList.remove("hidden");
}

backBtn.addEventListener("click", () => history.back());

loadProfile();
