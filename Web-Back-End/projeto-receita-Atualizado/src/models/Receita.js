const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Receita = sequelize.define('Receita', {
    nome: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    linkExterno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ingredientes: DataTypes.TEXT, 
    modoPreparo: DataTypes.TEXT,
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

module.exports = Receita;
