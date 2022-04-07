const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

const generateJwt = (id, name, email) => {
  return jwt.sign(
    { id, name, email },
    process.env.SECRET_KEY,
    { expiresIn: '7h' }
  )
}

class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body

      const user = await User.findOne({ where: { email } })
      if (user) {
        return res.status(404).json({ field: 'email', message: 'Пользователь с такой почтой уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 5)
      const newUser = await User.create({ name, email, password: hashedPassword })
      const token = generateJwt(newUser.id, name, email)

      return res.json({ name, email, token })
    } catch (e) {
      return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ message: 'Неправильные почта или пароль' })
      }

      const arePasswordsMatched = await bcrypt.compare(password, user.password)
      if (!arePasswordsMatched) {
        return res.status(404).json({ message: 'Неправильные почта или пароль' })
      }

      const token = generateJwt(user.id, user.name, user.email)
      return res.json({ name: user.name, email, token })
    } catch (e) {
      return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
    }
  }

  async auth(req, res) {
    const token = generateJwt(req.user.id, req.user.name, req.user.email)
    return res.json({ token })
  }
}

module.exports = new UserController()