# 📦 Pokedex Web App

Aplicação **front-end** que consome a **PokeAPI v2** para exibir Pokémons por gerações, com **perfis detalhados**, **navegação intuitiva** e diversas otimizações de performance.  
Iniciado como desafio da DIO, o projeto evoluiu para incluir novos recursos, melhorias na UX e ajustes arquiteturais.

---

## 📑 Sumário
- [✨ Funcionalidades](#✨-funcionalidades)  
- [🛠️ Técnologias](#tecnologias)
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
- **Paginação por geração** com botões numéricos e navegação via hash (`#/generation/N`)  
- **Perfis completos** com peso, altura, tipos, stats, habilidades e cadeia de evolução  
- **Imagens otimizadas** (dream_world → official-artwork → front_default)  
- **Responsividade total**: adaptação da paginação e layout para desktop e mobile  
- **Melhorias de UX**: loader visual, scroll suave e animações leves  
- **Componentes dinâmicos**:  
  - Cabeçalho e rodapé padronizados com ícone de logo  
  - Botão flutuante “voltar ao topo” com rolagem suave  
  - Sistema de busca validado com exibição de resultados e miniaturas  

---

## Tecnologias
- **HTML5**, **CSS3** (Grid, Flexbox, Transitions)  
- **JavaScript** (`async/await`, Fetch API, History API)  
- **PokeAPI v2** → [https://pokeapi.co/](https://pokeapi.co/)  

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
Inclui as alterações mais recentes:
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
- **PokeAPI** pela base de dados  
- Comunidade front-end pelas referências  
- A mim mesmo por nunca parar de refatorar  
