const express = require('express')

const app = express()

app.use(express.json())

require('./controlers/authcontroler')(app)

app.listen(3000, () => console.log('Api on 3000'))
