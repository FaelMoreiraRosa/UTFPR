const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Habilidade = sequelize.define('Habilidade', {
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});

module.exports = Habilidade;