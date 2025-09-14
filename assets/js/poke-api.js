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


// Busca detalhes completos de um Pokémon por ID ou nome
async function buscarDetalhesPokemon(identifier) {
  const res = await fetch(`${BASE_URL}/pokemon/${identifier}`);
  return res.json();
}


// Extrai o ID numérico da URL da API
function extrairIdPokemonDaUrl(url) {
  return Number(url.match(/\/pokemon\/(\d+)\//)[1]);
}


// Busca e retorna a cadeia de evolução a partir do objeto detail
async function buscarCadeiaEvolucao(detail) {
  const speciesRes = await fetch(detail.species.url);
  const species = await speciesRes.json();
  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();
  return extrairEvolucoes(chainData.chain);
}


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

  return Promise.all(
    data.results.map(async (p) => {
      const id = extrairIdPokemonDaUrl(p.url);
      const detail = await buscarDetalhesPokemon(id);
      return converterParaBasico(detail);
    })
  );
};


// Busca um Pokémon básico a partir do nome ou URL
pokeApi.buscarPokemonBasico = async (nameOrUrl) => {
  const identifier =
    typeof nameOrUrl === "string"
      ? nameOrUrl
      : extrairIdPokemonDaUrl(nameOrUrl.url);
  const detail = await buscarDetalhesPokemon(identifier);
  return converterParaBasico(detail);
};


// Busca detalhes completos de um Pokémon
pokeApi.buscarPokemonCompleto = async (pokemon) => {
  const identifier =
    typeof pokemon === "string" ? pokemon : extrairIdPokemonDaUrl(pokemon.url);

  const detail = await buscarDetalhesPokemon(identifier);
  const pokemonCompleto = converterParaCompleto(detail);
  pokemonCompleto.evolutions = await buscarCadeiaEvolucao(detail);

  return pokemonCompleto;
};
