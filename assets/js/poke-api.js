const BASE_URL = "https://pokeapi.co/api/v2";
const pokeApi = {};


// Escolhe a melhor imagem disponível
function getPokemonCover(sprites) {
  return (
    sprites.other?.dream_world?.front_default ||
    sprites.other?.["official-artwork"]?.front_default ||
    sprites.front_default ||
    ""
  );
}

// Delay utilitário para simular carregamento
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertBasic(detail) {
  const p = new Pokemon();
  const types = detail.types.map((t) => t.type.name);
  p.id = detail.id;
  p.name = detail.name;
  p.types = types;
  p.type = types[0];
  p.cover = getPokemonCover(detail.sprites);
  return p;
}

function convertFull(detail) {
  const p = convertBasic(detail);
  p.weight = detail.weight;
  p.height = detail.height;
  p.stats = detail.stats.map((s) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));
  p.abilities = detail.abilities.map((slot) => slot.ability.name);
  return p;
}

function parseEvolutions(chainNode, list = []) {
  list.push(chainNode.species.name);
  chainNode.evolves_to.forEach((next) => parseEvolutions(next, list));
  return list;
}


// Função para listar pokémons (rápida, apenas nome/id/imagem/types)
pokeApi.getPokemonsBasic = async ({ offset = 0, limit = 20 }) => {
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
        cover: getPokemonCover(detail.sprites)
      };
    })
  );

  return pokemons;
};


// Busca um pokémon básico a partir de nome ou URL
pokeApi.getBasicPokemon = async (nameOrUrl) => {
  const url =
    typeof nameOrUrl === "string"
      ? `${BASE_URL}/pokemon/${nameOrUrl}`
      : nameOrUrl.url;
  const res = await fetch(url);
  const detail = await res.json();
  return convertBasic(detail);
};

// Busca detalhes completos (perfil do pokémon)
pokeApi.getDetailsPokemon = async (pokemon) => {
  const url =
    typeof pokemon === "string"
      ? `${BASE_URL}/pokemon/${pokemon}`
      : pokemon.url;

  const detailRes = await fetch(url);
  const detail = await detailRes.json();
  const pkm = convertFull(detail);

  const speciesRes = await fetch(detail.species.url);
  const species = await speciesRes.json();
  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();

  pkm.evolutions = parseEvolutions(chainData.chain);
  return pkm;
};
