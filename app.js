const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect("mongodb://localhost/newURL")
const db = mongoose.connection

db.on('error', () => {
  console.log('error')
})

db.once('start', () => {
  console.log('mongodb connect')
})


app.engine('handlebars', exphbs({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser({ extended : true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  res.render('newURL')
})

app.listen( 3000, () => {
  console.log('now is running')
})