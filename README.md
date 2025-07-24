![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)  
![PokéAPI](https://img.shields.io/badge/Pok%C3%A9API-REST-blue)

# Pokedex DIO 
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" align="right" valign="middle" width="80" alt="Poké Ball" />

Uma Pokédex elegante e eficiente construída durante a imersão “JS Developer” da Digital Innovation One.  
Unindo bons conceitos de front-end e boas práticas de desenvolvimento.

<br>

---

## 🔖 Sumário

1. 📖 [Visão Geral](#visao-geral)  
2. ✨ [Principais Diferenciais](#principais-diferenciais)  
3. ⚡ [Funcionalidades](#funcionalidades)  
4. 🛠️ [Tecnologias Utilizadas](#tecnologias-utilizadas)  
5. 📂 [Estrutura de Pastas](#estrutura-de-pastas)  
6. 🔗 [Links Importantes](#links-importantes)  
7. 🚀 [Como Rodar](#como-rodar)  
8. 🔜 [Próximos Passos](#proximos-passos)  

---

<a id="visao-geral"></a>
## 📖 Visão Geral 

Agora além de listar 151 Pokémon, você pode navegar entre todas as gerações oficiais do I ao VIII. A interface:

- Exibe o nome da geração (“Kanto”, “Johto” etc.) dinamicamente.  
- Oferece botões **Previous** / **Next** para alternar de região.  
- Persiste sua última seleção em `localStorage`, retomando na próxima visita.  
- Mostra um indicador de “Carregando...” e usa atraso suave para melhor UX.  
- Continua usando caching em memória para não refazer requisições repetidas.  

ℹ️ **Nota de dados:** os números exibidos correspondem à Pokédex Nacional oficial. Alguns pokémon mais recentes (por exemplo, Sylveon e Meltan) podem acabar aparecendo em gerações ligeiramente diferentes da sua introdução original.

---

<a id="principais-diferenciais"></a>
## ✨ Principais Diferenciais

- Navegação por geração com mapeamento automático de offset/limit.  
- Cache dedicado por geração (Map) para performance extrema.  
- Indicador de carregamento e delay controlado para feedback visual.  
- Smooth scroll ao topo a cada mudança de geração.  
- Botões estilizados com hover/active animations.  
- Mobile-first: layouts e interações pensados para telas pequenas primeiro.  

---

<a id="funcionalidades"></a>
## ⚡ Funcionalidades

- Next / Previous para avançar ou voltar entre as oito gerações.  
- Persistência do índice de geração no `localStorage`.  
- Carregamento assíncrono via `pokeApi.getPokemons(offset, limit)`.  
- Cache de cada “paginação de geração” em memória.  
- Indicador de loading e transição suave ao renderizar.  
- Título dinâmico mostrando “<número> – Geração”.  

---

<a id="tecnologias-utilizadas"></a>
## 🛠️ Tecnologias Utilizadas

- JavaScript ES6+ (async/await, Map, fetch API)  
- HTML5 semântico  
- CSS3 (Grid, Flexbox, animações)  
- Normalize.css  
- PokéAPI  

---

<a id="estrutura-de-pastas"></a>
## 📂 Estrutura de Pastas

```
/
├── assets
│   ├── css
│   │   ├── global.css
│   │   └── pokedex.css
│   └── js
│       ├── poke-model.js
│       ├── poke-api.js
│       └── main.js       ← gerencia geração, botões e state
├── index.html            ← inclui generationTitle e controls
└── README.md
```

---

<a id="links-importantes"></a>
## 🔗 Links Importantes

- PokéAPI Docs: https://pokeapi.co/docs/v2  
- Código base DIO em aula: https://github.com/digitalinnovationone/js-developer-pokedex  

---

<a id="como-rodar"></a>
## 🚀 Como Rodar

1. Fork + clone:  
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```
2. (Opcional) Inicie servidor local:  
   ```bash
   npx http-server .
   ```
3. Abra no navegador `index.html` ou `http://localhost:8080`.  
4. Use **Previous** / **Next** para navegar por gerações.  

---

<a id="proximos-passos"></a>
## 🔜 Próximos Passos

- Página de perfil de cada Pokémon (stats, evoluções).  
- Filtros extras (por tipo, nome, geração secundária).  
- Infinite scroll ou “Load more” híbrido.  
- Testes automatizados e CI/CD.  

---

Se tiver sugestões, feedbacks ou PRs, estou aberto a toda contribuição!  

---

<a id="o-que-mudou"></a>
## 📝 O que mudou (antes vs. agora)

- Adição de `generationRanges` definindo offset e limit para cada geração (I a VIII).  
- Inclusão de botões **Previous** e **Next** para navegação entre gerações.  
- Elemento `<h2 id="generationTitle">` exibindo o nome e índice da geração atual.  
- Uso de `Map` (`generationCache`) para cachear resultados de cada geração.  
- Persistência de `currentGenIndex` no `localStorage`.  
- Loading indicator (`#loadingIndicator`) + atraso (`delay(800)`) para feedback de carregamento.  
- Smooth scroll ao topo a cada troca de geração.  
- Estilos CSS atualizados: transições em botões, título de geração, classe `.hidden` para controle de visibilidade.
