require('dotenv').config()

const User = require('./models/User')
const express = require('express')
const connectDB = require('./config/db')

const app = express()
app.use(express.json())

connectDB()

app.listen(3000, () => {
  console.log("Servidor rodando")
})

//CRIAR
app.post('/users', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

//LISTAR
app.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

//ATUALIZAR
app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(user)
})

//DELETAR
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.send("Deletado")
})
