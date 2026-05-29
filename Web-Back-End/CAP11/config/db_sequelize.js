const Sequelize = require('sequelize');
// Conectamos ao Postgres. 'web2_db' é o banco, 'postgres' o usuário e '1234' a senha.
const sequelize = new Sequelize('web2_db', 'postgres', 'Batata2129', {
    host: 'localhost',
    dialect: 'postgres'
});

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// O Sequelize precisa saber qual modelo (tabela) ele vai gerenciar
db.Usuario = require('../models/relational/usuario.js')(sequelize, Sequelize);

module.exports = db;