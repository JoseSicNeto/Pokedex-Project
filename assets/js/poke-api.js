const BASE_URL = "https://pokeapi.co/api/v2";
const pokeApi = {};
const detailsCache = new Map();

function getPokemonCover(sprites) {
  return sprites.other.dream_world.front_default || sprites.front_default || "";
}

function convertPokeApiDetailToPokemon(pokemonDetail) {
  const pokemon = new Pokemon();
  const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.id = pokemonDetail.id;
  pokemon.name = pokemonDetail.name;
  pokemon.types = types;
  pokemon.type = type;
  pokemon.cover = getPokemonCover(pokemonDetail.sprites);

  return pokemon;
}

pokeApi.getDetailsPokemon = (pokemon) => {
  if (detailsCache.has(pokemon.name)) {
    return Promise.resolve(detailsCache.get(pokemon.name));
  }

  return fetch(pokemon.url)
    .then((reponse) => reponse.json())
    .then((detail) => {
      const converted = convertPokeApiDetailToPokemon(detail);
      detailsCache.set(pokemon.name, converted);
      return converted;
    })
    .catch((err) => console.error(`Detalhes do ${pokemon.name} falharam`, err));
};

pokeApi.getPokemons = (offset = 0, limit = 3) => {
  const apiUrl = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getDetailsPokemon))
    .then((detailRequests) => Promise.all(detailRequests))
    .catch((err) => {
      console.error(`Erro ao buscar lista de pokémons:`, err);
      return [];
    });
};
