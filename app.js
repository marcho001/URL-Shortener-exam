const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const SwitchURL = require('./models/newURL')
const PORT = process.env.PORT || 3000
const randomCode = require('./models/randomCode')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/newURL'
const seesion = require('express-session')
const flash = require('connect-flash')
const axios = require('axios')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('mongodb connect')
})


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(seesion({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  let baseURL = 'https://rocky-chamber-61733.herokuapp.com/' 
  let originURL = req.body.originURL

  //若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
  if (originURL === '') {
    let isEmpty = true
    req.flash('warning_msg', 'Please enter a URI')
    return res.redirect('/')
  }

  //可以輸入完整網址或是直接從www 開始
  if (!originURL.includes('http://') && !originURL.includes('https://')) {
    originURL = "https://" + originURL
  }

  return SwitchURL.findOne({ newURL: originURL })
    .lean()
    .then(url => {
      if (!url) {
        axios.get(originURL)
          .catch(err => {
            req.flash('warning_msg', '網址好像怪怪的...')
            res.redirect('/')
          })

        let code = randomCode()
        baseURL += code
        return SwitchURL.create({
          origin: originURL,
          newURL: baseURL
        })
          .then((newURL) => {
            let isNew = true
            res.render('newURL', { baseURL, originURL, isNew })
          })
          //若需要防止有重覆的網址組合出現
          .catch((err) => {
            SwitchURL.find({ origin: originURL })
              .lean()
              .then((url) => {
                let isExist = true
                res.render('newURL', {
                  baseURL: url[0].newURL,
                  originURL: url[0].origin,
                  isExist
                })
              })
              .catch(err => console.log('error'))
          })
      }
      let isExist = true
      return res.render('newURL', {
        baseURL: url.newURL,
        originURL: url.origin,
        isExist
      })
    })
    .catch(err => console.log(err))
   
})

app.listen(PORT, () => {
  console.log('now is running')
})