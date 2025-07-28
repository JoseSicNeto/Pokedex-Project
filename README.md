# Pokedex Web App

Uma aplicação front-end que consome a PokeAPI v2 para exibir pokémons por gerações, perfis detalhados e navegação intuitiva. Originalmente criado como desafio na DIO, este projeto evoluiu para incorporar otimizações de performance, navegação baseada em rota e novo sistema de paginação por botões numéricos.

---

## Sumário

- [Funcionalidades Principais](#funcionalidades-principais)  
- [Tecnologias](#tecnologias)  
- [Instalação e Execução](#instalação-e-execução)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Exemplos de Uso da API](#exemplos-de-uso-da-api)  
- [Foco no Perfil](#foco-no-perfil)  
- [Novidades e Alterações Recentes](#novidades-e-alterações-recentes)  
- [Observações sobre Gerações](#observações-sobre-gerações)
- [Problemas Encontrados & Possíveis Otimizações](#problemas-encontrados--possíveis-otimizações)  
- [Próximos Passos](#próximos-passos)  
- [Agradecimentos](#agradecimentos)  

---

## Funcionalidades Principais

- Paginação por Gerações  
  - Intervalos customizados de offset/limit para cada geração  
  - Botões “Primeiro”, “Anterior”, numéricos, “Próximo” e “Último”  
  - Navegação via hash `#/generation/N` mantendo o estado no history e localStorage  
- Perfil de Pokémon  
  - Fetch de peso, altura, tipos, stats e habilidades  
  - Seleção automática da melhor imagem (`dream_world` → `official-artwork` → `front_default`)  
  - Animação de carregamento + delay para experiência suave  
  - Gráfico de barras responsivo, colorido conforme tipo principal  
  - Exibição da cadeia de evolução com links navegáveis  
- Responsividade  
  - Adaptação de janelas de botões de página (1 botão em mobile, 3 em desktop)  
  - Recalcula paginação em resize  
- UX aprimorada  
  - Loader visual durante fetch  
  - Scroll “to top” suave ao trocar de geração  

---

## Tecnologias

- HTML5, CSS3 (Grid, Flexbox, Transitions)  
- JavaScript (Fetch API, `async/await`, DOM, History API)  
- PokeAPI v2 (https://pokeapi.co/)  

---

## Instalação e Execução

1. Clone o repositório  
   ```bash
   git clone https://github.com/seu-usuario/pokedex-webapp.git
   cd pokedex-webapp
   ```  
2. Instale um servidor HTTP simples  
   ```bash
   npm install -g http-server
   ```  
3. Execute  
   ```bash
   http-server . -c-1
   ```  
4. Acesse `http://localhost:8080` no navegador  

---

## Estrutura do Projeto

```
/
├─ index.html            ← Lista de gerações e cards de pokémon
├─ pokemon.html          ← Perfil completo de cada pokémon
├─ assets/
│  ├─ css/
│  │  ├─ global.css
│  │  ├─ pokedex.css
│  │  └─ profile.css
│  └─ js/
│     ├─ poke-model.js   ← Classe Pokemon
│     ├─ poke-api.js     ← Funções de fetch e parsing
│     ├─ main.js         ← Paginação, hash navigation
│     └─ profile.js      ← Carregamento e render do perfil
└─ README.md
```

---

## Exemplos de Uso da API

- Listar Pokémons de uma geração:  
  ```js
  const pokemons = await pokeApi.getPokemons(151, 100); // Johto
  ```
- Detalhar um pokémon sem cache:  
  ```js
  const charizard = await pokeApi.getDetailsPokemon('charizard');
  console.log(charizard.height, charizard.types);
  ```
- Extrair cadeia de evolução:  
  ```js
  console.log(charizard.evolutions);
  // ["charmander","charmeleon","charizard"]
  ```

---

## Foco no Perfil

- **Loader e Delay** para evitar flicker de image swap  
- **Classes Dinâmicas**: `type-grass`, `type-fire` etc. alteram CSS do fundo  
- **Gráfico de Stats**:  
  - Percentual = `(valor / maxStat) * 100`  
  - Barra preenchida com cor do tipo principal  
- **Evoluções**:  
  - Texto e cards com `<a href="pokemon.html?name=venusaur">`  
  - Imagens via `sprites.other.dream_world.front_default`  

---

## Novidades e Alterações Recentes

- Remoção total do cache em `Map` para detalhes  
  - Todas as chamadas agora retornam dados frescos, evitando estado obsoleto  
  - Pequeno trade-off de performance, porém simplifica lógica e previne leaks  
- Navegação aprimorada  
  - Hash-based routing (`#/generation/N`) para melhor deep linking  
  - Botões numéricos dinâmicos no lugar de só “Next/Prev”, destacando página atual  
  - Uso de History API `window.location.hash` e `hashchange`  
- UX e Performance  
  - Delay controlado (`delay(800)`) para experiência visual agradável  
  - Scroll suave ao trocar de geração via `window.scrollTo`  
  - Ajuste responsivo de quantos botões de página mostrar (`isMobile()`)

---

## Observações sobre Gerações

Este projeto mapeia cada geração com base nos números oficiais da Pokédex Nacional. Com isso, você pode notar que alguns Pokémon aparecem em gerações “incomuns” ou fora da ordem cronológica de lançamento:

- A numeração da Pokédex não coincide exatamente com a ordem de introdução de todas as formas e variantes.  
- Alguns Pokémon (como Meltan/Melmetal ou formas regionais) foram apresentados em eventos ou expansões depois da sua posição numérica original.  
- Por usar apenas `offset`/`limit` baseados nessas posições, é possível encontrar pokémon “fora de lugar” em certas gerações.

Caso queira corrigir manualmente esses desvios, é preciso ajustar os intervalos em `generationRanges` para acomodar cada exceção.

---

## Problemas Encontrados & Possíveis Otimizações

- Listagens com limite alto podem travar o DOM  
- Requisições em paralelo ainda são intensas para limitações de API  
- Sugestões de otimização:  
  - Implementar throttling/pooling de fetches  
  - Migrar cache a IndexedDB para persistência e melhor controle de memória  
  - Usar Web Workers para pré-carregar próximas gerações em background  
  - Adicionar debounce no resize para reduzir chamadas a `updatePaginationControls`

---

## Próximos Passos

- Campo de busca em tempo real (por nome ou número)  
- Filtros por tipo e ordenação customizada  
- Migração para SPA (React, Vue ou Svelte) com rotas nativas  
- Tema escuro e customização de cores  

---

## Agradecimentos

- Plataforma DIO pela proposta de desafio  
- PokeAPI pela rica base de dados  
- Comunidade front-end por tantas referências  
- A mim mesmo, por manter a curiosidade e refatorar sem medo  

---

Este projeto foi uma jornada incrível de descoberta do DOM, Fetch API e lógica de cache. Espero que inspire outros a mergulharem no universo de APIs públicas!
