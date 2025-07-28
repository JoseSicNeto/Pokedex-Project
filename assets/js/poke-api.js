const BASE_URL = "https://pokeapi.co/api/v2";
const pokeApi = {};

// Escolhe a melhor imagem.
function getPokemonCover(sprites) {
  return (
    sprites.other?.dream_world?.front_default ||
    sprites.other?.["official-artwork"]?.front_default ||
    sprites.front_default ||
    ""
  );
}

// Converte o JSON de /pokemon para instância de Pokemon.
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
  pokemon.abilities = detail.abilities.map((slot) => slot.ability.name);
  return pokemon;
}

// Converte o JSON de /evolution-chain para uma lista de strings.
function parseEvolutions(chainNode, list = []) {
  list.push(chainNode.species.name);
  chainNode.evolves_to.forEach((next) => parseEvolutions(next, list));
  return list;
}

// Busca detalhes completos.
pokeApi.getDetailsPokemon = async (pokemon) => {
  const url =
    typeof pokemon === "string"
      ? `${BASE_URL}/pokemon/${pokemon}`
      : pokemon.url;

  // Detalhes básicos
  const detailRes = await fetch(url);
  const detail = await detailRes.json();
  const pkm = convertPokeApiDetailToPokemon(detail);

  // Espécies → evolução
  const speciesRes = await fetch(detail.species.url);
  const species = await speciesRes.json();
  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();
  pkm.evolutions = parseEvolutions(chainData.chain);

  return pkm;
};

// Lista pokémons + detalhes
pokeApi.getPokemons = async (offset = 0, limit = 3) => {
  const apiUrl = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  try {
    const response = await fetch(apiUrl);
    const json = await response.json();
    const results = json.results;

    const detailPromises = results.map(pokeApi.getDetailsPokemon);
    const pokemons = await Promise.all(detailPromises);

    return pokemons;
  } catch (err) {
    console.error("Erro ao buscar lista de pokémons:", err);
    return [];
  }
};
