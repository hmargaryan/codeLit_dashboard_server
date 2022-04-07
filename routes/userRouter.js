const Router = require('express')
const Yup = require('yup')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Имя должно состоять минимум из 2 символов')
    .required('Введите имя'),
  email: Yup.string()
    .email('Некорректная почта')
    .required('Введите почту'),
  password: Yup.string()
    .min(8, 'Пароль должен состоять минимум из 8 символов')
    .required('Введите пароль'),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Введите пароль')
})

const signInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректная почта')
    .required('Введите почту'),
  password: Yup.string()
    .required('Введите пароль')
})


router.post('/sign-up', validationMiddleware(signUpSchema), userController.signUp)
router.post('/sign-in', validationMiddleware(signInSchema), userController.signIn)
router.get('/auth', authMiddleware, userController.auth)

module.exports = router