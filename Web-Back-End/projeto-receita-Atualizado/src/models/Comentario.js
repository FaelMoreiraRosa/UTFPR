const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  // Guardamos o id da receita do PostgreSQL para ligar os dois bancos.
  receitaId: {
    type: Number,
    required: true,
    index: true
  },
  nomeAutor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  texto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comentario', ComentarioSchema);
