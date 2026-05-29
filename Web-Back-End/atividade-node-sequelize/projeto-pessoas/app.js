const express = require('express');
const sequelize = require('./config/db');
const Pessoa = require('./models/pessoa');

const app = express();
app.use(express.json());

sequelize.sync()
  .then(() => console.log('Banco conectado'))
  .catch(err => console.log(err));

  app.post('/pessoas', async (req, res) => {
  try {
    const pessoa = await Pessoa.create(req.body);
    res.status(201).json(pessoa);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get('/pessoas/:id', async (req, res) => {
  const pessoa = await Pessoa.findByPk(req.params.id);

  if (!pessoa) {
    return res.status(404).json({ mensagem: 'Não encontrada' });
  }

  res.json(pessoa);
});

const { Op } = require('sequelize');

app.get('/pessoas', async (req, res) => {
  const { nome, idadeMin, page = 1, limit = 5, ordem = 'ASC' } = req.query;

  const where = {};

  // filtro por nome (LIKE)
  if (nome) {
    where.nome = {
      [Op.like]: `%${nome}%`
    };
  }

  // filtro por idade mínima
  if (idadeMin) {
    where.idade = {
      [Op.gte]: idadeMin
    };
  }

  const offset = (page - 1) * limit;

  const pessoas = await Pessoa.findAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['nome', ordem]]
  });

  res.json(pessoas);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});