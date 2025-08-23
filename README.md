# 📦 Pokedex Web App  
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](#)  
[![PokeAPI](https://img.shields.io/badge/PokéAPI-v2-blue)](https://pokeapi.co/)  
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)  
[![Status](https://img.shields.io/badge/status-active-success)](#)  

> Uma Pokédex web responsiva, rápida e cheia de recursos, construída com **JavaScript moderno** e consumindo a **PokéAPI v2**.

---

## 📑 Sumário
- [✨ Funcionalidades](#✨-funcionalidades)  
- [🛠️ Tecnologias](#🛠️-tecnologias)  
- [🚀 Instalação](#🚀-instalação)  
- [📂 Estrutura do Projeto](#📂-estrutura-do-projeto)  
- [🔍 Exemplos de Uso da API](#🔍-exemplos-de-uso-da-api)  
- [🎨 Foco no Perfil](#🎨-foco-no-perfil)  
- [🆕 Novidades](#🆕-novidades)  
- [ℹ️ Observações de Gerações](#ℹ️-observações-de-gerações)  
- [⚡ Possíveis Otimizações](#⚡-possíveis-otimizações)  
- [📌 Próximos Passos](#📌-próximos-passos)  
- [🙏 Agradecimentos](#🙏-agradecimentos)  

---

## ✨ Funcionalidades
- 📜 **Paginação por geração** com botões numéricos e navegação via hash (`#/generation/N`)  
- 📄 **Perfis completos** com peso, altura, tipos, stats, habilidades e cadeia de evolução  
- 🖼️ **Imagens otimizadas** (dream_world → official-artwork → front_default)  
- 📱 **Responsividade total**: adaptação da paginação e layout para desktop e mobile  
- 🎯 **Melhorias de UX**: loader visual, scroll suave e animações leves  
- 🧩 **Componentes dinâmicos**: cabeçalho/rodapé padronizados, botão flutuante “voltar ao topo” e busca validada com miniaturas  

---

## 🛠️ Tecnologias
- **HTML5** semântico  
- **CSS3** (Grid, Flexbox, Transitions)  
- **JavaScript** (`async/await`, Fetch API, History API)  
- **PokéAPI v2** → [https://pokeapi.co/](https://pokeapi.co/)  

---

## 🚀 Instalação
```bash
git clone https://github.com/seu-usuario/pokedex-webapp.git
cd pokedex-webapp
npm install -g http-server
http-server . -c-1
```
Acesse **http://localhost:8080** no navegador.

---

## 📂 Estrutura do Projeto
```
/
├─ index.html
├─ pokemon.html
├─ assets/
│  ├─ css/
│  ├─ images/
│  └─ js/
└─ README.md
```
> *Detalhes completos de arquivos e funções no código-fonte.*

---

## 🔍 Exemplos de Uso da API
```js
// Listar pokémons da geração Johto
const pokemons = await pokeApi.getPokemons(151, 100);

// Detalhes de um pokémon
const charizard = await pokeApi.getDetailsPokemon('charizard');

// Cadeia de evolução
console.log(charizard.evolutions);
```

---

## 🎨 Foco no Perfil
- Loader + delay para transições suaves  
- Classes dinâmicas por tipo (`type-fire`, `type-grass`)  
- Gráfico de stats colorido conforme tipo principal  
- Evoluções com imagens e links navegáveis  

---

## 🆕 Novidades
1. **Cabeçalho e rodapé dinâmicos** com logo  
2. **Botão flutuante "voltar ao topo"** com rolagem suave  
3. **Busca de Pokémons** com cache em memória e miniaturas  
4. **Otimização da API** com método `getPokemonsBasic` para listagens mais rápidas  

---

## ℹ️ Observações de Gerações
A divisão de gerações segue a **numeração oficial da Pokédex Nacional**, podendo gerar discrepâncias em formas alternativas ou introduções fora da ordem cronológica.

---

## ⚡ Possíveis Otimizações
- Cache em **IndexedDB**  
- **Web Workers** para pré-carregar dados  
- Throttling nas requisições  
- Debounce no resize  

---

## 📌 Próximos Passos
- Filtros e ordenação  
- Migração para SPA (React, Vue, Svelte)  
- Tema escuro e personalização  

---

## 🙏 Agradecimentos
- **DIO** pelo desafio  
- **PokéAPI** pela base de dados  
- Comunidade front-end pelas referências  
- A mim mesmo por nunca parar de refatorar  

---
