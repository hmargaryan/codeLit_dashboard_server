const Router = require('express')
const Yup = require('yup')
const authMiddleware = require('../middleware/authMiddleware')
const workspaceMemberMiddleware = require('../middleware/workspaceMemberMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')
const workspaceMemberController = require('../controllers/workspaceMemberController')

const router = new Router()

const addUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректная почта')
    .required('Введите почту'),
  role: Yup.string()
    .required('Введите роль'),
  canAddCandidate: Yup.boolean()
    .required('Укажите возможность добавлять кандидатов'),
  isNewUser: Yup.boolean()
    .required('Укажите тип пользователя: новый или старый'),
  name: Yup.string()
    .when('isNewUser', {
      is: true,
      then: Yup.string()
        .min(2, 'Имя должно состоять минимум из 2 символов')
        .required('Введите имя')
    }),
  password: Yup.string()
    .when('isNewUser', {
      is: true,
      then: Yup.string()
        .min(8, 'Пароль должен состоять минимум из 8 символов')
        .required('Введите пароль'),
    }),
  confirmedPassword: Yup.string()
    .when('isNewUser', {
      is: true,
      then: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Введите пароль')
    })
})

router.post('/add', authMiddleware, workspaceMemberMiddleware, validationMiddleware(addUserSchema), workspaceMemberController.addWorkspaceMember)

module.exports = router