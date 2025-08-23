const BASE_URL = "https://pokeapi.co/api/v2";
const pokeApi = {};


// Retorna a melhor imagem disponível do Pokémon
function obterImagemPokemon(sprites) {
  return (
    sprites.other?.dream_world?.front_default ||
    sprites.other?.["official-artwork"]?.front_default ||
    sprites.front_default ||
    ""
  );
}


// Função utilitária para simular atraso
function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// Converte dados básicos da API para o modelo Pokemon
function converterParaBasico(detail) {
  const pokemon = new Pokemon();
  const types = detail.types.map((t) => t.type.name);
  pokemon.id = detail.id;
  pokemon.name = detail.name;
  pokemon.types = types;
  pokemon.type = types[0];
  pokemon.cover = obterImagemPokemon(detail.sprites);
  return pokemon;
}


// Converte dados completos da API para o modelo Pokemon
function converterParaCompleto(detail) {
  const pokemon = converterParaBasico(detail);
  pokemon.weight = detail.weight;
  pokemon.height = detail.height;
  pokemon.stats = detail.stats.map((s) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));
  pokemon.abilities = detail.abilities.map((slot) => slot.ability.name);
  return pokemon;
}


// Lê a cadeia de evolução e retorna lista de nomes
function extrairEvolucoes(chainNode, list = []) {
  list.push(chainNode.species.name);
  chainNode.evolves_to.forEach((next) => extrairEvolucoes(next, list));
  return list;
}


// Lista pokémons de forma básica (nome, id, imagem, tipos)
pokeApi.listarPokemonsBasicos = async ({ offset = 0, limit = 20 }) => {
  const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();

  const pokemons = await Promise.all(
    data.results.map(async (p) => {
      const id = p.url.match(/\/pokemon\/(\d+)\//)[1];
      const detailRes = await fetch(`${BASE_URL}/pokemon/${id}`);
      const detail = await detailRes.json();
      const types = detail.types.map((t) => t.type.name);

      return {
        id: Number(id),
        name: detail.name,
        types: types,
        type: types[0],
        cover: obterImagemPokemon(detail.sprites)
      };
    })
  );

  return pokemons;
};


// Busca um Pokémon básico a partir do nome ou URL
pokeApi.buscarPokemonBasico = async (nameOrUrl) => {
  const url =
    typeof nameOrUrl === "string"
      ? `${BASE_URL}/pokemon/${nameOrUrl}`
      : nameOrUrl.url;
  const res = await fetch(url);
  const detail = await res.json();
  return converterParaBasico(detail);
};


// Busca detalhes completos de um Pokémon
pokeApi.buscarPokemonCompleto = async (pokemon) => {
  const url =
    typeof pokemon === "string"
      ? `${BASE_URL}/pokemon/${pokemon}`
      : pokemon.url;

  const detailRes = await fetch(url);
  const detail = await detailRes.json();
  const pokemonCompleto = converterParaCompleto(detail);

  const speciesRes = await fetch(detail.species.url);
  const species = await speciesRes.json();
  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();

  pokemonCompleto.evolutions = extrairEvolucoes(chainData.chain);
  return pokemonCompleto;
};
