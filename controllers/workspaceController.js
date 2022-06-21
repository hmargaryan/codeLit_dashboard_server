const { generateJwt } = require('../utils/generateJwt')
const sequelize = require('../db')
const { Workspace, WorkspaceMember, User } = require('../models/models')

class WorkspaceController {
  async createWorkspace(req, res) {
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
      await WorkspaceMember.create({
        workspaceId: newWorkspace.id,
        userId: user.id,
        role: 'owner',
        canAddCandidate: true
      }, { transaction })

      await transaction.commit()

      const token = generateJwt({ id: user.id, email: user.email, name: user.name, workspaceId: newWorkspace.id })

      res.json({ token })
    } catch (e) {
      console.log(e)
      await transaction.rollback()
      return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
    }
  }

  async getWorkspaceById(req, res) {
    try {
      const { workspaceId, role } = req.user

      if (role !== 'owner' && role !== 'admin') {
        return res.status(403).json({ message: 'Отказано в доступе' })
      }

      const workspace = await Workspace.findOne({ where: { id: workspaceId } })
      res.json(workspace)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async getWorkspaceMembers(req, res) {
    try {
      const { workspaceId, role } = req.user

      if (role !== 'owner' && role !== 'admin') {
        return res.status(403).json({ message: 'Отказано в доступе' })
      }

      const members = await sequelize.query(
        ` SELECT "users"."id" 
          AS "id", "name", "email",
          "workspaceMembers"."role",
          "workspaceMembers"."canAddCandidate",
          "workspaceMembers"."id"
          FROM "workspaceMembers", "users"
          WHERE "workspaceMembers"."workspaceId" = :workspaceId AND "workspaceMembers"."userId" = "users"."id"
          ORDER BY "workspaceMembers"."createdAt"
        `,
        {
          replacements: { workspaceId },
          model: User,
          raw: true
        })
      res.json(members)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async getWorkspacesByUser(req, res) {
    try {
      const { id } = req.user

      const workspaces = await sequelize.query(
        ` SELECT "workspaces"."id" 
          AS "id", "workspaces"."name", "slug"
          FROM "workspaces", "workspaceMembers"
          WHERE "workspaceMembers"."userId" = :id AND "workspaceMembers"."workspaceId" = "workspaces"."id"
        `,
        {
          replacements: { id },
          model: User,
          raw: true
        })

      res.json(workspaces)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async chooseWorkspace(req, res) {
    try {
      const { user } = req
      const { id } = req.body

      const member = await WorkspaceMember.findOne({
        where: {
          workspaceId: id,
          userId: user.id
        }
      })

      if (!member) {
        return res.status(403).json({ message: 'Отказано в доступе' })
      }

      const token = generateJwt({ id: user.id, email: user.email, name: user.name, workspaceId: id })
      res.json({ token })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }
}

module.exports = new WorkspaceController()
