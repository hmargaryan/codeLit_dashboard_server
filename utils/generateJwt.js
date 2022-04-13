const jwt = require('jsonwebtoken')

const generateJwt = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '7h' })
}

module.exports = { generateJwt }