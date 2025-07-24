# Pokedex Web App

Uma aplicação front-end que consome a PokeAPI v2 para exibir:

- Listagem de Pokémons organizados por gerações  
- Perfil detalhado de cada Pokémon, com imagens, tipos, stats e cadeia de evolução  
- Cache em memória para reduzir requisições e otimizar performance  

Este projeto foi desenvolvido como desafio acadêmico e de aprendizado na DIO. Passei horas mergulhado na API, aprimorando o layout e a lógica de fetches, e me diverti muito no caminho.

---

## Sumário

- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias](#tecnologias)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Exemplos de Uso da API](#exemplos-de-uso-da-api)
- [Foco no Perfil](#foco-no-perfil)
- [Problemas Encontrados & Possíveis Otimizações](#problemas-encontrados--possíveis-otimizações)
- [Próximos Passos](#próximos-passos)
- [Agradecimentos](#agradecimentos)

---


## Funcionalidades Principais

- Paginação por Gerações  
  - Configurações customizadas de *offset* e *limit* para cada geração  
  - Botões “Next” e “Previous” com estado desabilitado no início/fim  
  - Cache em `Map` para cada geração carregada  
- Perfil de Pokémon  
  - Fetch dos detalhes: peso, altura, tipos, stats e habilidades  
  - Conversão de unidades para kg e metros  
  - Animação suave de carregamento e transição de cor de fundo pelo tipo principal  
  - Gráfico de barras com preenchimento proporcional a valores máximos de cada stat  
  - Exibição da cadeia de evolução (nome e imagens), com links navegáveis para o perfil de cada estágio  
- Cache de detalhes em `Map` para não refazer chamadas ao mesmo Pokémon  
- Feedback visual durante o carregamento (loader + delay controlado para UX suave)

## Observações sobre Gerações
Este projeto usa a numeração oficial da Pokédex Mundial como base para as gerações.

Você deve ter notado que alguns Pokémon podem aparecer em uma geração diferente do que você esperaria. Isso acontece porque, embora a Pokédex seja numerada em sequência, a forma como você categorizou as gerações usando seus próprios intervalos (generationRanges) pode levar a essas pequenas diferenças para Pokémon como Meltan ou Sylveon, que foram introduzidos de formas menos convencionais.

---

## Tecnologias

- HTML5, CSS3 (Grid, Flexbox, Transitions)  
- JavaScript (Fetch API, `async/await`, `classList`, DOM manipulação)  
- PokeAPI v2 (https://pokeapi.co/)  

---

## Instalação e Execução

1. Clone o repositório  
   ```bash
   git clone https://github.com/seu-usuario/pokedex-webapp.git
   cd pokedex-webapp
   ```
2. Sirva os arquivos estáticos (ex.: Live Server, http-server ou VSCode Live Preview)  
3. Abra `index.html` no browser  
4. Clique nas gerações e depois em qualquer Pokémon para ver o perfil  

---

## Estrutura do Projeto

```
/
├─ index.html         ← Listagem geral por gerações
├─ pokemon.html       ← Perfil de Pokémon
├─ assets/
│  ├─ css/
│  │  ├─ global.css
|  |  ├─ pokedex.css
│  │  └─ profile.css
│  └─ js/
│     ├─ poke-model.js   ← Classe Pokemon
│     ├─ poke-api.js     ← Funções de fetch, conversão e cache
│     ├─ main.js         ← Lógica de gerações e paginação
│     └─ profile.js      ← Lógica de carregamento e render do perfil
└─ README.md
```

---

## Exemplos de Uso da API

- Listar Pokémons de uma geração:
  ```js
  pokeApi.getPokemons(0, 151)      // Kanto
    .then(list => /* renderiza lista */)
  ```

- Buscar detalhes de um Pokémon (com cache):
  ```js
  const bulbasaur = await pokeApi.getDetailsPokemon('bulbasaur');
  console.log(bulbasaur.height, bulbasaur.types);
  ```

- Extrair e exibir cadeia de evolução:
  ```js
  const evoChain = bulbasaur.evolutions; 
  // ["bulbasaur","ivysaur","venusaur"]
  ```

---

## Foco no Perfil

No `profile.js` foi onde passei mais tempo de forma solo:

- **Carregamento Suave**: Indicador de loader + `delay(600)` para evitar flicker  
- **Classes Dinâmicas**: Troca do `background-color` conforme `pokemon.type`  
- **Stats Visuais**:  
  - Cálculo de porcentagem: `(valor / valorMáximo) * 100`  
  - Barra colorida pelo tipo principal  
  - Número do stat posicionado no final da barra  
- **Evoluções**:  
  - Texto “Bulbasaur → Ivysaur → Venusaur”  
  - Cards de evolução com `<a href="pokemon.html?name=ivysaur">`  
  - Imagens oficiais via `sprites.other.dream_world.front_default`  

---

## Problemas Encontrados & Possíveis Otimizações

- Gerações com muitos itens podem ficar um pouco lentas no scroll  
- Falta de barra de busca universal para filtrar por nome ou número  
- Requisições de evolução ainda podem ser otimizadas com cache separado  
- Sugestão: implementar Web Workers para pré-carregar próximas gerações  
- Sugestão: separar abas de pesquisa e de gerações para UX mais fluido  

---

## Próximos Passos

- Adicionar campo de pesquisa em tempo real  
- Melhorar cache em IndexedDB para persistência entre sessões  
- Incluir filtros por tipo e ordenação  
- Implementar rotas SPA (React/Vue/Svelte) para navegar sem reload  

---

## Agradecimentos

- DIO pela ideia e projeto inicial  
- PokeAPI pela riqueza de dados  
- Comunidade de desenvolvedores front-end por tantos tutoriais e exemplos  
- A mim mesmo, por horas de dedicação e aprendizado intenso  

Este projeto foi uma jornada incrível de descoberta do DOM, Fetch API e lógica de cache. Espero que inspire outros a mergulharem no universo de APIs públicas!
