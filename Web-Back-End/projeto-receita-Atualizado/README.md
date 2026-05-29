# Projeto Receita - Portfolio Web de Receitas

Sistema web MVC para o Projeto 1 de Programacao Web Back-End. A aplicacao permite que alunos cadastrem receitas culinarias, administradores gerenciem dados do sistema e usuarios externos consultem receitas, comentarios e relatorios.

Desenvolvido por Rafael Moreira Rosa e Lucas Gabriel Pinheiro dos Santos.

## Funcionalidades

- Login de alunos e administrador, sem autocadastro de alunos.
- Cadastro, listagem, edicao e exclusao de receitas pelos alunos responsaveis.
- Receitas com nome, descricao, link externo, ingredientes, modo de preparo, imagem, categorias e coautores.
- Relacionamento N:N entre receitas e categorias.
- Relacionamento N:N entre receitas e alunos, permitindo receitas com mais de um responsavel.
- Cadastro de habilidades culinarias dos alunos com nivel de 0 a 10.
- CRUD administrativo de alunos, categorias e habilidades.
- Area publica com listagem de receitas e filtro por categoria.
- Relatorio publico com proporcao de alunos por habilidade.
- Comentarios em receitas usando MongoDB Atlas e Mongoose.

## Tecnologias

- Node.js
- Express
- EJS
- Bootstrap
- PostgreSQL
- Sequelize
- MongoDB Atlas
- Mongoose
- Express Session
- Bcrypt

## Modelagem

O PostgreSQL guarda os dados principais do sistema:

- `Aluno`
- `Receita`
- `Categoria`
- `Habilidade`

Relacionamentos muitos para muitos:

- `ReceitaCategoria`: uma receita pode ter varias categorias, e uma categoria pode aparecer em varias receitas.
- `ReceitaAluno`: uma receita pode ter varios alunos responsaveis, e um aluno pode participar de varias receitas. A tabela tambem guarda o campo `criador`, indicando qual aluno cadastrou originalmente a receita.
- `aluno_habilidades`: relaciona alunos e habilidades, guardando tambem o campo extra `nivel`.

O MongoDB guarda os comentarios das receitas. Cada comentario possui `receitaId`, `nomeAutor`, `texto` e datas de criacao/atualizacao.

## Configuracao

Crie ou ajuste o arquivo `.env` na raiz do projeto:

```env
DB_NAME=nome_do_banco
DB_USER=usuario_postgres
DB_PASS=senha_postgres
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
SESSION_SECRET=uma_chave_segura
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/projeto-receita
PORT=3000
```

## Como executar

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Se a porta 3000 ja estiver ocupada, altere `PORT` no `.env`, por exemplo `PORT=3001`, e acesse `http://localhost:3001`.

O projeto usa `sequelize.sync({ alter: true })`, entao as tabelas relacionais sao ajustadas automaticamente ao iniciar com o PostgreSQL configurado.

## Acesso administrador

Ao iniciar, o sistema cria ou corrige o usuario administrador:

```text
email: admin@admin.com
senha: 123456
```

Tambem existe a rota `/reset-admin` para recriar o admin com senha `123`, caso seja necessario durante testes locais.

## Entrega

Para entregar, compacte o projeto sem a pasta `node_modules`. A professora pediu um unico arquivo `.rar` com o codigo do projeto.
