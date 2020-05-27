const express = require('express')
const app = express()
const exphbs = require('express-handlebars')


app.engine('handlebars', exphbs({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')

app.listen( 3000, () => {
  console.log('now is running')
})