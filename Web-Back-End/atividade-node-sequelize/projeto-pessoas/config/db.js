const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projeto_pessoas', 'postgres', 'Batata2129', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;