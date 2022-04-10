const Router = require('express')
const userRoute = require('./userRouter')
const workspaceRoute = require('./workspaceRouter')

const router = new Router()

router.use('/user', userRoute)
router.use('/workspace', workspaceRoute)

module.exports = router