const Router = require('express')
const Yup = require('yup')
const candidateController = require('../controllers/candidateController')
const authMiddleware = require("../middleware/authMiddleware");
const workspaceMemberMiddleware = require("../middleware/workspaceMemberMiddleware");
const canAddCandidateMiddleware = require('../middleware/canAddCandidateMiddleware')
const validationMiddleware = require("../middleware/validationMiddleware");

const router = new Router()

const addCandidateSchema =  Yup.object().shape({
    name: Yup.string()
        .required('Введите имя кандидата'),
    position: Yup.string()
        .required('Введите вакансию'),
    level: Yup.string()
        .required('Введите уровень кандидата'),
    status: Yup.string()
        .required('Введите статус кандидата')
})

router.post('/add', authMiddleware, workspaceMemberMiddleware, canAddCandidateMiddleware, validationMiddleware(addCandidateSchema), candidateController.addCandidate)
router.get('/all', authMiddleware, workspaceMemberMiddleware, candidateController.getCandidates)
router.put('/edit/:id', authMiddleware, workspaceMemberMiddleware, canAddCandidateMiddleware, validationMiddleware(addCandidateSchema), candidateController.editCandidate)
router.delete('/remove/:id', authMiddleware, workspaceMemberMiddleware, canAddCandidateMiddleware, candidateController.removeCandidate)
router.get('/:id', authMiddleware, workspaceMemberMiddleware, candidateController.getCandidate)
router.put('/edit/status/:id', authMiddleware, workspaceMemberMiddleware, canAddCandidateMiddleware, candidateController.editCandidateStatus)

module.exports = router
