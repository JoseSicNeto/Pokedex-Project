const BASE_URL = "https://pokeapi.co/api/v2";
const pokeApi = {};
const detailsCache = new Map();

// Helper para escolher a melhor imagem
function getPokemonCover(sprites) {
  return (
    sprites.other?.dream_world?.front_default ||
    sprites.other?.["official-artwork"]?.front_default ||
    sprites.front_default ||
    ""
  );
}

// Converte o JSON de /pokemon para instância de Pokemon
function convertPokeApiDetailToPokemon(detail) {
  const pokemon = new Pokemon();
  const types = detail.types.map((t) => t.type.name);
  const [type] = types;
  
  pokemon.id = detail.id;
  pokemon.name = detail.name;
  pokemon.types = types;
  pokemon.type = type;
  pokemon.cover = getPokemonCover(detail.sprites);
  pokemon.weight = detail.weight;
  pokemon.height = detail.height;
  pokemon.stats = detail.stats.map((s) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));
  pokemon.abilities = detail.abilities
    .map(slot => slot.ability.name);
  return pokemon;
}

// Converte o JSON de /evolution-chain para uma lista de strings
function parseEvolutions(chainNode, list = []) {
  list.push(chainNode.species.name);
  chainNode.evolves_to.forEach((next) => parseEvolutions(next, list));
  return list;
}

// Busca detalhes completos
pokeApi.getDetailsPokemon = async (pokemon) => {
  if (detailsCache.has(pokemon.name)) {
    return detailsCache.get(pokemon.name);
  }

  const url = typeof pokemon === 'string'
    ? `${BASE_URL}/pokemon/${pokemon}`
    : pokemon.url;

  // Pega /pokemon/{name}
  const detailRes = await fetch(url);
  const detail = await detailRes.json();
  const pkm = convertPokeApiDetailToPokemon(detail);

  // Pega /pokemon-species/{name} para achar evolution_chain.url
  const speciesRes = await fetch(detail.species.url);
  const species = await speciesRes.json();
  const evoChainUrl = species.evolution_chain.url;

  // Pega /evolution-chain/{id}
  const chainRes = await fetch(evoChainUrl);
  const chainData = await chainRes.json();
  pkm.evolutions = parseEvolutions(chainData.chain);

  detailsCache.set(pkm.name, pkm);
  return pkm;
};

pokeApi.getPokemons = (offset = 0, limit = 3) => {
  const apiUrl = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((json) => json.results)
    .then((list) => list.map(pokeApi.getDetailsPokemon))
    .then((proms) => Promise.all(proms))
    .catch((err) => {
      console.error("Erro ao buscar lista de pokémons:", err);
      return [];
    });
};
