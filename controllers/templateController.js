const { Op } = require('sequelize')
const { Template, Interview } = require('../models/models')

class TemplateController {
    async createTemplate(req, res) {
        try {
            const { workspaceId } = req.user
            const templateToFind = await Template.findOne({
                where: {
                    data: {
                        name: {
                            [Op.like]: `%${req.body.name.toLowerCase()}%`
                        }
                    },
                    workspaceId
                },
                raw: true,
                nest: true
            })
            if (templateToFind) {
                return res.status(404).json({ field: 'name', message: 'Шаблон с таким названием уже существует в рабочем пространстве' })
            }

            await Template.create({
                data: req.body,
                workspaceId
            })

            res.json({ message: 'Шаблон добавлен в рабочее пространство' })
        } catch (e){
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
        }
    }

    async getTemplates(req, res) {
        try {
            const { workspaceId } = req.user
            const { term = '' } = req.query

            const templates = await Template.findAll({
                where: {
                    workspaceId,
                    data: {
                        name: { [Op.iLike]: `%${term}%` }
                    }
                },
                order: [['createdAt', 'ASC']]
            })
            res.json(templates)
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async getTemplateById(req, res) {
        try {
            const { workspaceId } = req.user
            const { id } = req.params

            if (!id) {
                return res.status(500).json({ message: 'Такого шаблона не существует' })
            }

            const interview = await Interview.findOne({
                where: { id, workspaceId },
                include: [
                    {model: Template }
                ]
            })

            res.json(interview.template)
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async editTemplate(req, res) {
        try {
            const { user, params: { id } } = req

            if (!id) {
                return res.status(404).json({ message: 'Укажите шаблон для изменения' })
            }

            const template = await Template.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!template) {
                return res.status(404).json({ message: 'Такого шаблона не существует' })
            }

            const templateToFind = await Template.findOne({
                where: {
                    data: {
                        name: {
                            [Op.like]: `%${req.body.name.toLowerCase()}%`
                        }
                    },
                    workspaceId: user.workspaceId
                },
                raw: true,
                nest: true
            })
            if (templateToFind && templateToFind.id !== id) {
                return res.status(404).json({ field: 'name', message: 'Шаблон с таким названием уже существует в рабочем пространстве' })
            }

            const newTemplate = await template.update({ data: req.body })
            res.json({ ...newTemplate, message: 'Шаблон изменен' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async deleteTemplate(req, res) {
        try {
            const { user, params: { id } } = req

            if (!id) {
                return res.status(404).json({ message: 'Укажите шаблон для удаления' })
            }

            const template = await Template.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!template) {
                return res.status(404).json({ message: 'Такого шаблона не существует' })
            }

            await template.destroy()
            res.json({ message: 'Шаблон удален из рабочего пространства' })
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }
}

module.exports = new TemplateController()
