const { Candidate } = require('../models/models')
const { Op } = require('sequelize')

class CandidateController {
    async addCandidate(req, res) {
        try {
            const { workspaceId } = req.user
            const { name, email, position, level, status } = req.body

            await Candidate.create({ name, email, position, level, status, workspaceId })

            res.json({ message: 'Кандидат добавлен в рабочее пространство' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Попробуйте еще раз' })
        }
    }

    async getCandidates(req, res) {
        try {
            const { workspaceId } = req.user
            const { term = '', status = '' } = req.query

            const candidates = await Candidate.findAll({
                where: {
                    workspaceId,
                    [Op.and]: [
                        { status: { [Op.iLike]: `%${status}%` } },
                        {
                            [Op.or]: [
                                { name: { [Op.iLike]: `%${term}%` } },
                                { email: { [Op.iLike]: `%${term}%` } },
                                { position: { [Op.iLike]: `%${term}%` } },
                                { level: { [Op.iLike]: `%${term}%` } }
                            ]
                        }
                    ]
                },
                order: [['createdAt', 'ASC']]
            })
            res.json(candidates)
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async removeCandidate(req, res) {
        try {
            const { user, params: { id } } = req

            if (!id) {
                return res.status(404).json({ message: 'Укажите кандидата для удаления' })
            }

            const candidate = await Candidate.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!candidate) {
                return res.status(404).json({ message: 'Такого кандидата не существует' })
            }

            await candidate.destroy()
            res.json({ message: 'Кандидат удален из рабочего пространства' })
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async editCandidate(req, res) {
        try {
            const { user, params: { id } } = req

            if (!id) {
                return res.status(404).json({ message: 'Укажите кандидата для изменения' })
            }

            const candidate = await Candidate.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!candidate) {
                return res.status(404).json({ message: 'Такого кандидата не существует' })
            }

            const newCandidate = await candidate.update({
                name: req.body.name,
                email: req.body.email,
                position: req.body.position,
                level: req.body.level,
                status: req.body.status
            })
            res.json({ ...newCandidate, message: 'Кандидат изменен' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async getCandidate(req, res) {
        try {
            const { workspaceId } = req.user
            const { id } = req.params

            if (!id) {
                return res.status(500).json({ message: 'Такого кандидата не существует' })
            }

            const candidate = await Candidate.findOne({ where: { id, workspaceId } })

            res.json(candidate)
        } catch {
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async editCandidateStatus(req, res) {
        try {
            const { user, params: { id, body } } = req
            console.log(id, body, 'hello')

            if (!id) {
                return res.status(404).json({ message: 'Укажите кандидата для изменения' })
            }

            const candidate = await Candidate.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!candidate) {
                return res.status(404).json({ message: 'Такого кандидата не существует' })
            }

            const newCandidate = await candidate.update({ status: req.body.status })
            res.json({ ...newCandidate, message: 'Статус изменен' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }
}

module.exports = new CandidateController()
