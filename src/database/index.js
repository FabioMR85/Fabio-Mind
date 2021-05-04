const mongoose = require('mongoose')

const uri =
  'mongodb+srv://fabio:123@cluster0.ur98p.mongodb.net/mind_case?retryWrites=true&w=majority'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(function () {
    console.log('Conectou!')
  })
  .catch(function (err) {
    console.log(err)
  })
mongoose.Promise = global.Promise
module.exports = mongoose
