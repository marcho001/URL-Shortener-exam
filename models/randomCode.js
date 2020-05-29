const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
const upperCase = lowerCase.toUpperCase()
const number = '0123456789'
 
function randomCode(){
  const newString = lowerCase + upperCase + number
  let code = ''
  
  for(let i = 0; i < 5; i++){
    let random = Math.floor(Math.random() * newString.length)
    code += newString[random]
  }
  return code
}

module.exports = randomCode


