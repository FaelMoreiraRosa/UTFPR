# Projeto - API de Pessoas

## Sobre o projeto

Esse projeto foi desenvolvido para a disciplina de Programação Web Back-End.
A ideia é criar uma API usando Node.js, Express e Sequelize para cadastrar e consultar pessoas.

A aplicação permite:

    * Cadastrar pessoas
    * Listar pessoas
    * Buscar por ID
    * Filtrar por nome e idade mínima
    * Ordenar por nome
    * Paginar os resultados

---

## Tecnologias usadas

        * Node.js
        * Express
        * Sequelize
        * PostgreSQL

---

## Como rodar o projeto

### 1. Instalar as dependências

No terminal, dentro da pasta do projeto:


    npm install


---

### 2. Configurar o banco de dados

No arquivo config/database.js, coloque os dados do seu PostgreSQL:


    new Sequelize('nome_do_banco', 'usuario', 'senha', {
  
        host: 'localhost',
 
        dialect: 'postgres'

    });


---

### 3. Rodar o servidor


npm run dev

ImprimServidor rodando em http://localhost:3000


---

## Rotas da API

### Cadastrar pessoa

POST /pessoas

Exemplo de JSON:

    {

      "nome": "Ana",

      "idade": 25,

      "descricao": "Teste"
  
    }


---

### Listar pessoas

GET /pessoas

Também é possível usar filtros:


    /pessoas?nome=ana&idadeMin=18&page=1&limit=5&ordem=ASC


---

### Buscar por ID

    GET /pessoas/:id
