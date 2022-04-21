const Router = require('express')
const Yup = require('yup')
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')
const workspaceMemberMiddleware = require('../middleware/workspaceMemberMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const addTaskSchema = Yup.object().shape({
  name: Yup.string()
    .required('Введите название'),
  description: Yup.string()
    .required('Введите описание'),
  example: Yup.string()
    .required('Введите пример кода')
})

router.post('/create', authMiddleware, workspaceMemberMiddleware, validationMiddleware(addTaskSchema), taskController.createTask)
router.get('/all', authMiddleware, workspaceMemberMiddleware, taskController.getTasks)
router.delete('/delete/:id', authMiddleware, workspaceMemberMiddleware, taskController.deleteTask)
router.put('/edit/:id', authMiddleware, workspaceMemberMiddleware, validationMiddleware(addTaskSchema), taskController.editTask)

module.exports = router