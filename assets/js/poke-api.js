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


// Extrai nomes de todas as evoluções
function extrairEvolucoes(chainNode, list = []) {
  list.push(chainNode.species.name);
  chainNode.evolves_to.forEach((next) => extrairEvolucoes(next, list));
  return list;
}


async function buscarPokemonsEmLotes(ids, callbackConversao) {
  let tamanhoLote = 20; // tamanho inicial
  const resultados = [];
  let i = 0;

  while (i < ids.length) {
    const loteAtual = tamanhoLote;
    const lote = ids.slice(i, i + loteAtual);

    const inicioLote = performance.now();

    const detalhesLote = await Promise.all(
      lote.map(async (id) => {
        const detail = await buscarDetalhesPokemon(id);
        return callbackConversao(detail);
      })
    );

    resultados.push(...detalhesLote);

    const fimLote = performance.now();
    const tempoLote = (fimLote - inicioLote) / 1000; // segundos

    // Ajusta tamanho do próximo lote com base no tempo real
    if (tempoLote < 1.5 && tamanhoLote < 50) {
      tamanhoLote += 5;
    } else if (tempoLote > 3 && tamanhoLote > 5) {
      tamanhoLote -= 5;
    }

    i += loteAtual;
    await new Promise((r) => setTimeout(r, 150)); // pausa leve
  }

  return resultados;
}


// Lista pokémons de forma básica (nome, id, imagem, tipos)
pokeApi.listarPokemonsBasicos = async ({ offset = 0, limit = 20 }) => {
  const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  const ids = data.results.map((p) => extrairIdPokemonDaUrl(p.url));

  return buscarPokemonsEmLotes(ids, converterParaBasico);
};


// Busca um Pokémon básico a partir do nome ou URL
pokeApi.buscarPokemonBasico = async (nameOrUrl) => {
  const identifier =
    typeof nameOrUrl === "string"
      ? nameOrUrl
      : extrairIdPokemonDaUrl(nameOrUrl.url);

  const [resultado] = await buscarPokemonsEmLotes([identifier], converterParaBasico);
  return resultado;
};


// Busca detalhes completos de um Pokémon
pokeApi.buscarPokemonCompleto = async (pokemon) => {
  const identifier =
    typeof pokemon === "string" ? pokemon : extrairIdPokemonDaUrl(pokemon.url);

  const [pokemonCompleto] = await buscarPokemonsEmLotes([identifier], converterParaCompleto);
  pokemonCompleto.evolutions = await buscarCadeiaEvolucao(await buscarDetalhesPokemon(identifier));

  return pokemonCompleto;
};
