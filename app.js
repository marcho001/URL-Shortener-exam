const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const SwitchURL = require('./models/newURL')
const PORT = process.env.PORT || 3000
const randomCode = require('./models/randomCode')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/newURL'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('error')
})

db.once('open', () => {
  console.log('mongodb connect')
})


app.engine('handlebars', exphbs({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended : true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  let baseURL = 'https://rocky-chamber-61733.herokuapp.com/'
  const originURL = req.body.originURL

//若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
  if (originURL === '') {
    let isEmpty = true
    return res.render('index', { isEmpty })
  }

  let code = randomCode()
  baseURL += code
  SwitchURL.create({
    origin : originURL,
    newURL : baseURL
  })
    .then((newURL) => {
      let isNew = true
      res.render('newURL', { baseURL, originURL, isNew})
    })
    .catch((err) => {
      SwitchURL.find({ origin : originURL})
      .lean()
      .then((url) => {
        let isExist = true
        let existOriginURL = url[0].origin

        if (!existOriginURL.includes('http://')) {
          existOriginURL = "http://" + existOriginURL
      }

        res.render('newURL', { 
          baseURL : url[0].newURL, 
          originURL : existOriginURL,
          isExist
        })
      })
      .catch(err => console.log('error'))
    })

  
})

app.listen( PORT, () => {
  console.log('now is running')
})