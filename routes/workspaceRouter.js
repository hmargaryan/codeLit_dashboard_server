const Router = require('express')
const Yup = require('yup')
const workspaceController = require('../controllers/workspaceController')
const authMiddleware = require('../middleware/authMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const createWorkspaceSchema = Yup.object().shape({
  name: Yup.string().required('Введите название рабочего пространства'),
  slug: Yup.string().required('Введите слаг рабочего пространства')
})

router.post('/create', authMiddleware, validationMiddleware(createWorkspaceSchema), workspaceController.create)

module.exports = router