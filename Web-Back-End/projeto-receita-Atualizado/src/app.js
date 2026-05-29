const express = require('express');
const { sequelize, Aluno } = require('./models/index');
const session = require('express-session');
const routes = require('./routes/index');
const connectMongo = require('./models/mongo');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'minha_chave_secreta_padrao',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.usuarioLogado = req.session.usuario || null;
  next();
});

app.use('/', routes);

connectMongo();

sequelize.sync({ alter: true }).then(async () => {
  console.log(' Banco de dados conectado e atualizado!');

  const adminExistente = await Aluno.findOne({ where: { email: 'admin@admin.com' } });

  if (!adminExistente) {
      const senhaHash = await bcrypt.hash('123456', 10);

      await Aluno.create({
          nome: 'Administrador',
          email: 'admin@admin.com',
          senha: senhaHash,
          isAdmin: true
      });
      console.log(' Administrador criado com sucesso!');
  } else if (!adminExistente.isAdmin) {
      await adminExistente.update({ isAdmin: true });
      console.log(' Administrador atualizado com permissão de admin!');
  }

  app.listen(PORT, () => console.log(` Servidor rodando em http://localhost:${PORT}`));
}).catch(err => {
  console.error(' Erro ao conectar ao banco:', err);
});
