const Router = require('express')
const userRoute = require('./userRouter')
const workspaceRoute = require('./workspaceRouter')
const workspaceMemberRoute = require('./workspaceMemberRoute')

const router = new Router()

router.use('/user', userRoute)
router.use('/workspace', workspaceRoute)
router.use('/workspaceMember', workspaceMemberRoute)

module.exports = router