const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Banco conectado")
  } catch (err) {
    console.log("Erro ao conectar")
  }
}

module.exports = connectDB