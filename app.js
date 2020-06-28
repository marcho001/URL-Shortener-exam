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
const urlExist = require('url-exist')

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

app.post('/', async (req, res) => {
  let baseURL = 'https://rocky-chamber-61733.herokuapp.com/'
  let originURL = req.body.originURL
  // check if empty or not
  // check if start from http://
  // check if the url is short-url
  //若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
  if (originURL === '') {
    req.flash('warning_msg', '請輸入要轉換的網址')
    return res.redirect('/')
  }
  //可以輸入完整網址或是直接從www 開始
  if (!originURL.includes('http://') && !originURL.includes('https://')) {
    originURL = "https://" + originURL
  }

  try {
    const isSwitchUrl = await SwitchURL.findOne({ newURL: originURL }).lean()
    if (isSwitchUrl) {
      let hasSwitch = true
      return res.render('newURL', {
        baseURL: isSwitchUrl.newURL,
        originURL: isSwitchUrl.origin,
        hasSwitch
      })
    }

    const exist = await urlExist(originURL)
    if (!exist) {
      req.flash('warning_msg', '網址怪怪的唷..')
      return res.redirect('/')
    }


    const hasSwitch = await SwitchURL.findOne({ origin: originURL }).lean()
    if (hasSwitch) {
      let isExist = true
      return res.render('newURL', {
        baseURL: hasSwitch.newURL,
        originURL: hasSwitch.origin,
        isExist
      })
    }

    let code = randomCode()
    baseURL += code

    const newUrl = await SwitchURL.create({
      origin: originURL,
      newURL: baseURL
    })
    let isNew = true
    res.render('newURL', { baseURL, originURL, isNew })

  } catch (err) {
    console.log(err)
  }

})

app.listen(PORT, () => {
  console.log('now is running')
})