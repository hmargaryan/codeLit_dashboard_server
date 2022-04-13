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

router.post('/create', authMiddleware, validationMiddleware(createWorkspaceSchema), workspaceController.createWorkspace)
router.get('/info', authMiddleware, workspaceMemberMiddleware, workspaceController.getWorkspaceById)
router.get('/members', authMiddleware, workspaceMemberMiddleware, workspaceController.getWorkspaceMembers)

module.exports = router