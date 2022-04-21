const Router = require('express')
const Yup = require('yup')
const workspaceController = require('../controllers/workspaceController')
const authMiddleware = require('../middleware/authMiddleware')
const workspaceMemberMiddleware = require('../middleware/workspaceMemberMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const createWorkspaceSchema = Yup.object().shape({
  name: Yup.string().required('Введите название рабочего пространства'),
  slug: Yup.string().required('Введите слаг рабочего пространства')
})

const chooseWorkspaceSchema = Yup.object().shape({
  id: Yup.string()
    .required('Выберите рабочее пространство')
})

router.post('/create', authMiddleware, validationMiddleware(createWorkspaceSchema), workspaceController.createWorkspace)
router.get('/info', authMiddleware, workspaceMemberMiddleware, workspaceController.getWorkspaceById)
router.get('/members', authMiddleware, workspaceMemberMiddleware, workspaceController.getWorkspaceMembers)
router.get('/all', authMiddleware, workspaceController.getWorkspacesByUser)
router.post('/choose', authMiddleware, validationMiddleware(chooseWorkspaceSchema), workspaceController.chooseWorkspace)

module.exports = router