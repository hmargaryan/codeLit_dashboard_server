const Router = require('express')
const Yup = require('yup')
const templateController = require('../controllers/templateController')
const authMiddleware = require('../middleware/authMiddleware')
const workspaceMemberMiddleware = require('../middleware/workspaceMemberMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

const router = new Router()

const createTemplateSchema = Yup.object().shape({
    name: Yup.string()
        .required('Введите название шаблона'),
    steps: Yup.array()
        .of(Yup.object().shape({
            name: Yup.string()
                .required('Введите название раздела'),
            questionBlocks: Yup.array()
                .of(Yup.object().shape({
                    name: Yup.string()
                        .required('Введите название блока с вопросами'),
                    questions: Yup.array()
                        .of(Yup.object().shape({
                            name: Yup.string()
                                .required('Введите вопрос'),
                            type: Yup.string()
                                .required('Введите тип вопроса'),
                            answers: Yup.array()
                                .when('type', {
                                    is: (type) => type !== 'text',
                                    then: Yup.array()
                                        .of(Yup.object().shape({
                                            name: Yup.string()
                                        }))
                                        .test({
                                            message: 'Введите ответ на вопрос',
                                            test: (answer) => answer.length > 0
                                        })
                                })
                        }))
                })),
            tasks: Yup.array()
                .of(Yup.object().shape({
                    id: Yup.string()
                }))
        }))
})

router.post('/create', authMiddleware, workspaceMemberMiddleware, validationMiddleware(createTemplateSchema), templateController.createTemplate)
router.get('/all', authMiddleware, workspaceMemberMiddleware, templateController.getTemplates)
router.put('/edit/:id', authMiddleware, workspaceMemberMiddleware, validationMiddleware(createTemplateSchema), templateController.editTemplate)
router.delete('/delete/:id', authMiddleware, workspaceMemberMiddleware, templateController.deleteTemplate)
router.get('/:id', authMiddleware, workspaceMemberMiddleware, templateController.getTemplateById)

module.exports = router
