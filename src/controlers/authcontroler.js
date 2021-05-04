const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const User = require('../models/user')
const user = require('../models/user')

const router = express.Router()

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  })
}
router.put(':/user_Id ', async function (req, res) {
  try {
    if (req.level === 1) {
      if (req.id !== req.params.user_Id) return res.json('não é permitido')
    }
    const data = req.body
    console.log(data)

    const usuario = await User.findByIdAndUpdate(req.params.user_Id, data, {
      new: true,
    })
    console.log(usuario)
    await usuario.save()
    return res.json(usuario)
  } catch (err) {
    console.log(err)
    return res.json('erro ao atualizar')
  }
})
router.delete('/:user_Id', async function (req, res) {
  try {
    if (req.level === 1) {
      if (req.id !== req.params.user_Id) return res.json('não é permitido')
    }
    const data = req.body

    const usuario = await User.findByIdAndDelete(req.params.user_Id)

    return res.json('deletado com sucesso')
  } catch (err) {
    console.log(err)
    return res.json('erro ao deletar')
  }
})
router.post('/register', async (req, res) => {
  const { email } = req.body

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists' })
    const usuario = await User.create(req.body)
    usuario.password = undefined
    return res.send({
      usuario,
      token: generateToken({ id: usuario.id }),
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'resgistrattion failed' })
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body
  const usuario = await User.findOne({ email }).select('+password')
  if (!usuario) return res.status(400).send({ error: 'User not found' })
  if (!(await bcrypt.compare(password, usuario.password)))
    return res.status(400).send({ error: 'Invalid Password' })

  usuario.password = undefined

  res.send({
    usuario,
    token: generateToken({ id: usuario.id }),
  })
})

module.exports = (app) => app.use('/auth', router)
