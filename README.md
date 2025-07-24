![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) 
![PokéAPI](https://img.shields.io/badge/Pok%C3%A9API-REST-blue)

# Pokedex DIO 
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" align="right" valign="middle" width="80" alt="Poké Ball" />

Uma Pokédex elegante e eficiente construída durante a imersão “JS Developer” da Digital Innovation One.

Unindo bons conceitos de front-end e boas práticas de desenvolvimento.

<br>

---

## 🔖 Sumário

1. [Visão Geral](#visão-geral)  
2. [Principais Diferenciais](#principais-diferenciais)  
3. [Funcionalidades](#funcionalidades)  
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
5. [Estrutura de Pastas](#estrutura-de-pastas)  
6. [Links Importantes](#links-importantes)  
7. [Como Rodar](#como-rodar)  
8. [Próximos Passos](#próximos-passos)  

---

## 🎯 Visão Geral <a id="visão-geral"></a>

Este projeto demonstra, de forma prática, como criar uma interface interativa consumindo a PokéAPI. A aplicação:

- Foi versionada passo a passo no Git/GitHub, reforçando o aprendizado de controle de versão e fluxo de trabalho colaborativo. 
- Segue arquitetura modular, separando modelo, API e lógica de interface.  
- Utiliza caching inteligente para evitar requisições repetidas, garantindo performance e menor latência.  
- Apresenta paginação sob demanda, removendo o botão de “Load More” automaticamente ao esgotar os 151 primeiros Pokémon.  
- Adota mobile-first, assegurando que toda experiência seja otimizada para celulares antes de escalar para telas maiores.  

> **Dica:** a abordagem mobile-first garante que estilos e componentes sejam pensados primeiro para telas pequenas, antes de escalar para desktop.


---

## 🎨 Principais Diferenciais <a id="principais-diferenciais"></a>

- Design responsivo com grid e flexbox, adaptando-se a qualquer tamanho de tela.  
- Paleta de cores inspirada nos tipos de Pokémon, reforçando identidade visual e acessibilidade.  
- Código limpo e organizado, facilitando futuras manutenções ou extensões.  
- Tratamento de erros e retornos de API garantem robustez mesmo em conexões instáveis.  
- Uso de ES6+ para escrita de código mais concisa e legível.  

---

## 🔥 Funcionalidades <a id="funcionalidades"></a>

- Listagem paginada de Pokémon, garantindo carregamento rápido.  
- Exibição de nome, número, tipos e arte oficial em alta resolução.  
- Cache em memória para detalhes, reduzindo chamadas à PokéAPI.  
- Remoção automática do controle de paginação ao atingir o limite predefinido.  

---

## 🛠️  Tecnologias Utilizadas <a id="tecnologias-utilizadas"></a>

- JavaScript moderno (ES6+)  
- HTML5 semântico  
- CSS3 com Normalize.css  
- Grid e Flexbox para layout  
- Fetch API com promises e tratamento de erros  
- PokéAPI  

---

##  📁 Estrutura de Pastas <a id="estrutura-de-pastas"></a>

```
/
├── assets
│   ├── css
│   │   ├── global.css
│   │   └── pokedex.css
│   └── js
│       ├── poke-model.js
│       ├── poke-api.js
│       └── main.js
├── index.html
└── README.md
```

---

## 🔗 Links Importantes <a id="links-importantes"></a>

- Documentação da PokéAPI: https://pokeapi.co/docs/v2  
- Repositório base da DIO usado em aula: https://github.com/digitalinnovationone/js-developer-pokedex  

---

## 🖥️ Como Rodar <a id="como-rodar"></a>

1. Faça um fork do repositório para preservar seu histórico de commits.  
2. Clone em sua máquina local:

   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```

3. (Opcional) Inicie um servidor HTTP para servir os arquivos:

   ```bash
   npx http-server .
   ```

4. Abra `index.html` no navegador (ou acesse `http://localhost:8080`).  
5. Clique em **Load More** para carregar e explorar os primeiros 151 Pokémon.
---

## 🔜 Próximos Passos <a id="próximos-passos"></a>

Este é apenas o ponto de partida. Nas próximas etapas, planejo implementar:

- Página de perfil detalhada de cada Pokémon, com estatísticas e evolução.  
- Filtro e listagem por geração (Kanto, Johto etc.).  

---

Aceito qualquer opinião, feedback ou contribuição. Bom estudo e bons códigos!