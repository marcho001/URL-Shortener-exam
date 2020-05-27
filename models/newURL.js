const mongoose = require('mongoose')
const Schema = mongoose.Schema
const switchURLSchema = new Schema({
  origin : {
    type : String,
    require : true,
    unique : true
  },
  newURL : {
    type : String,
    require : true,
    unique : true
  }
})

module.exports = mongoose.model('switchURL', switchURLSchema)
