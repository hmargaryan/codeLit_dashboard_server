const bcrypt = require('bcrypt')
const { generateJwt } = require('../utils/generateJwt')
const { User } = require('../models/models')


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
      const token = generateJwt({ id: newUser.id, name, email })

      return res.json({ token })
    } catch (e) {
      console.log(e)
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

      const token = generateJwt({ id: user.id, name: user.name, email: user.email })
      return res.json({ token })
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