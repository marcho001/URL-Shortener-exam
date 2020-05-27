const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const SwitchURL = require('./models/newURL')

mongoose.connect("mongodb://localhost/newURL", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('error')
})

db.once('start', () => {
  console.log('mongodb connect')
})


app.engine('handlebars', exphbs({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended : true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const baseURL = '/'
  const originURL = req.body.originURL
  SwitchURL.create({
    origin : baseURL,
    newURL : originURL
  })
  
  res.render('newURL')
})

app.listen( 3000, () => {
  console.log('now is running')
})