const mongoose = require('mongoose');

async function connectMongo() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    // O projeto ainda funciona sem Mongo, mas os comentários ficam desligados.
    console.warn('MONGO_URI não configurada. Comentários ficarão indisponíveis.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(' MongoDB conectado para comentários!');
  } catch (error) {
    console.error(' Erro ao conectar no MongoDB:', error.message);
  }
}

module.exports = connectMongo;
