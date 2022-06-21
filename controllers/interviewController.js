const { Interview, WorkspaceMember, Template, User, Candidate} = require('../models/models')
const { Op } = require('sequelize')

class InterviewController {
    async createInterviewSession(req, res) {
        try {
            const { workspaceId } = req.user
            const { name, template, interviewer, date, time, comments, candidateId } = req.body

            if (!candidateId) {
                return res.status(404).json({ message: 'Укажите кандидата' })
            }

            await Interview.create({
                name,
                templateId: template,
                workspaceMemberId: interviewer,
                date,
                time,
                comments,
                workspaceId,
                candidateId
            })

            res.json({ message: 'Сессия интервью добавлена в рабочее пространство' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async getInterviewSessionsByCandidateId(req, res) {
        try {
            const { workspaceId } = req.user
            const { id } = req.params

            if (!id) {
                return res.status(500).json({ message: 'Такого кандидата не существует' })
            }

            const interviewSessions = await Interview.findAll({
                where: { candidateId: id, workspaceId },
                include: [
                    {model: WorkspaceMember, include: [User] },
                    {model: Template }
                ]
            })

            res.json(interviewSessions)
        } catch (e){
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }

    async addResult(req, res) {
        try {
            const { user, params: { id, body } } = req

            if (!id) {
                return res.status(404).json({ message: 'Укажите сессию для изменения' })
            }

            const interviewSession = await Interview.findOne({ where: { id, workspaceId: user.workspaceId } })
            if (!interviewSession) {
                return res.status(404).json({ message: 'Такой сессии не существует' })
            }

            const newInterviewSession = await interviewSession.update({ result: req.body })
            res.json({ ...newInterviewSession, message: 'Статус сессии изменен' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Серверные проблемы. Перезагрузите страницу' })
        }
    }
}

module.exports = new InterviewController()
