const mongoose = require('../database')

const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    reqquire: true,
    select: false,
  },

  level: {
    type: Number,
  },

  createdate: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash

  next()
})

const user = mongoose.model('user', UserSchema)

module.exports = user
