const Router = require('express')
const Yup = require('yup')
const interviewController = require('../controllers/interviewController')
const authMiddleware = require('../middleware/authMiddleware')
const workspaceMemberMiddleware = require('../middleware/workspaceMemberMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const createInterviewRoomSchema = Yup.object().shape({
    name: Yup.string()
        .required('Введите название интервью'),
    interviewer: Yup.string()
        .required('Выберите интервьюера'),
    template: Yup.string()
        .required('Укажите шаблон'),
    date: Yup.string()
        .required('Укажите дату интервью'),
    time: Yup.string()
        .required('Укажите время интервью'),
    comment: Yup.string()
})

router.post('/create', authMiddleware, workspaceMemberMiddleware, validationMiddleware(createInterviewRoomSchema), interviewController.createInterviewSession)
router.get('/:id', authMiddleware, workspaceMemberMiddleware, interviewController.getInterviewSessionsByCandidateId)
router.put('/add/result/:id', authMiddleware, workspaceMemberMiddleware, interviewController.addResult)

module.exports = router
