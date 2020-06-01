const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
const upperCase = lowerCase.toUpperCase()
const number = '0123456789'
const newString = lowerCase + upperCase + number
const existCode = []
 
function randomCode(){
  let code = ''
  
  for(let i = 0; i < 5; i++){
    let random = Math.floor(Math.random() * newString.length)
    code += newString[random]
  }

  if ( !existCode.includes(code) ){
    existCode.push(code)
    return code
  } else {
    randomCode()
  }
}

module.exports = randomCode


