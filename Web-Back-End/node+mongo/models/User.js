const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number },
  email: { type: String, required: true }
})

module.exports = mongoose.model("User", userSchema)