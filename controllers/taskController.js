const sequelize = require('../db')
const { Op } = require('sequelize')
const { Task } = require('../models/models')

class TaskController {
  async createTask(req, res) {
    try {
      const { workspaceId } = req.user
      const { name, description, example } = req.body

      const taskToFind = await Task.findOne({
        where: {
          name: sequelize.where(sequelize.fn('lower', sequelize.col('name')), name.toLowerCase()),
          workspaceId
        }
      })
      if (taskToFind) {
        return res.status(404).json({ field: 'name', message: 'Задача с таким названием уже существует в рабочем пространстве' })
      }

      const newTask = await Task.create({ name, description, example, workspaceId })
      res.json({ ...newTask, message: 'Задача добавлена в рабочее пространство' })
    } catch {
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async getTasks(req, res) {
    try {
      const { workspaceId } = req.user
      const { term = '' } = req.query

      const tasks = await Task.findAll({
        where: {
          workspaceId,
          [Op.or]: [
            { name: { [Op.iLike]: `%${term}%` } },
            { description: { [Op.iLike]: `%${term}%` } },
            { example: { [Op.iLike]: `%${term}%` } }
          ]
        },
        order: [['createdAt', 'ASC']]
      })
      res.json(tasks)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async deleteTask(req, res) {
    try {
      const { user, params: { id } } = req

      if (!id) {
        return res.status(404).json({ message: 'Укажите задачу для удаления' })
      }

      const task = await Task.findOne({ where: { id, workspaceId: user.workspaceId } })
      if (!task) {
        return res.status(404).json({ message: 'Такой задачи не существует' })
      }

      await task.destroy()
      res.json({ message: 'Задача удалена из рабочего пространства' })
    } catch {
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }

  async editTask(req, res) {
    try {
      const { user, params: { id } } = req
      const { name, description, example } = req.body

      if (!id) {
        return res.status(404).json({ message: 'Укажите задачу для изменения' })
      }

      const task = await Task.findOne({ where: { id, workspaceId: user.workspaceId } })
      if (!task) {
        return res.status(404).json({ message: 'Такой задачи не существует' })
      }

      const taskToFind = await Task.findOne({
        where: {
          name: sequelize.where(sequelize.fn('lower', sequelize.col('name')), name.toLowerCase()),
          workspaceId: user.workspaceId
        }
      })
      if (taskToFind && taskToFind.id !== id) {
        return res.status(404).json({ field: 'name', message: 'Задача с таким названием уже существует в рабочем пространстве' })
      }

      const newTask = await task.update({ name, description, example })
      res.json(newTask)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
    }
  }
}

module.exports = new TaskController()