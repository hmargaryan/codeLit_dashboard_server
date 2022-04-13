const bcrypt = require('bcrypt')
const sequelize = require('../db')
const { WorkspaceMember, User } = require('../models/models')

class WorkspaceMemberController {
  async addWorkspaceMember(req, res) {
    const transaction = await sequelize.transaction()

    try {
      const { user } = req
      const { email, role, canAddCandidate, name, password, isNewUser } = req.body

      if (user.role !== 'owner' && user.role !== 'admin') {
        await transaction.rollback()
        return res.status(403).json({ message: 'Отказано в доступе' })
      }

      if (email === user.email) {
        await transaction.rollback()
        return res.status(404).json({ field: 'email', message: 'Нельзя добавлять самого себя' })
      }


      const userToFind = await User.findOne({ where: { email } })
      const workspaceMember = userToFind && await WorkspaceMember.findOne({
        where: {
          workspaceId: user.workspaceId,
          userId: userToFind.id
        }
      })

      if (workspaceMember) {
        await transaction.rollback()
        return res.status(404).json({ field: 'email', message: 'Пользователь уже есть в рабочем пространстве' })
      }

      if (role === 'admin' && user.role !== 'owner') {
        await transaction.rollback()
        return res.status(404).json({ field: 'role', message: 'Только владельцы рабочего пространства могут добавлять администраторов' })
      }

      if (isNewUser) {
        if (userToFind) {
          await transaction.rollback()
          return res.status(404).json({ field: 'email', message: 'Пользователь с такой почтой уже существует' })
        }

        const hashedPassword = await bcrypt.hash(password, 5)
        const newUser = await User.create({ name, email, password: hashedPassword }, { transaction })

        await WorkspaceMember.create({
          workspaceId: user.workspaceId,
          userId: newUser.id,
          role,
          canAddCandidate
        }, { transaction })

        await transaction.commit()
        res.json({ message: 'ok' })
      } else {
        if (!userToFind) {
          await transaction.rollback()
          return res.status(404).json({ field: 'email', message: 'Пользователя с такой почтой не существует' })
        }

        await WorkspaceMember.create({
          workspaceId: user.workspaceId,
          userId: userToFind.id,
          role,
          canAddCandidate
        }, { transaction })

        await transaction.commit()
        res.json({ message: 'ok' })
      }
    } catch (e) {
      console.log(e)
      await transaction.rollback()
      return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
    }
  }
}

module.exports = new WorkspaceMemberController()