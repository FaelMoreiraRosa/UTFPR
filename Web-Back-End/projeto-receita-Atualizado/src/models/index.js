const Aluno = require('./Aluno');
const Receita = require('./Receita');
const Categoria = require('./Categoria');
const Habilidade = require('./Habilidade');
const sequelize = require('./database');
const { DataTypes } = require('sequelize');

Receita.belongsToMany(Categoria, { through: 'ReceitaCategoria' });
Categoria.belongsToMany(Receita, { through: 'ReceitaCategoria' });

// Tabela N:N entre receitas e alunos. O campo criador ajuda a mostrar
// quem cadastrou a receita primeiro, sem tirar os coautores da responsabilidade.
const ReceitaAluno = sequelize.define('ReceitaAluno', {
  criador: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Receita.belongsToMany(Aluno, {
  through: ReceitaAluno,
  foreignKey: 'receitaId',
  otherKey: 'alunoId'
});
Aluno.belongsToMany(Receita, {
  through: ReceitaAluno,
  foreignKey: 'alunoId',
  otherKey: 'receitaId'
});

// Aqui a tabela intermediaria precisa guardar o nivel do aluno naquela habilidade.
const AlunoHabilidade = sequelize.define('aluno_habilidades', {
  nivel: { 
    type: DataTypes.INTEGER, 
    validate: { min: 0, max: 10 } 
  }
});

Aluno.belongsToMany(Habilidade, { through: AlunoHabilidade });
Habilidade.belongsToMany(Aluno, { through: AlunoHabilidade });

module.exports = { Aluno, Receita, Categoria, Habilidade, ReceitaAluno, AlunoHabilidade, sequelize };
