const { Workspace } = require('../models/models')
const { WorkspaceUser } = require('../models/models')
const sequelize = require('../db')

class WorkspaceController {
  async create(req, res) {
    const transaction = await sequelize.transaction()

    try {
      const { user } = req
      const { name, slug } = req.body

      const workspace = await Workspace.findOne({ where: { slug } })
      if (workspace) {
        await transaction.rollback()
        return res.status(404).json({ field: 'slug', message: 'Рабочее пространство с таким слагом уже существует' })
      }

      const newWorkspace = await Workspace.create({ name, slug, owner: user.id }, { transaction })
      const newWorkspaceUser = await WorkspaceUser.create({ workspaceId: newWorkspace.id, userId: user.id }, { transaction })

      await transaction.commit()

      res.json({ newWorkspace, newWorkspaceUser })
    } catch (e) {
      await transaction.rollback()
      return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
    }
  }
}

module.exports = new WorkspaceController()