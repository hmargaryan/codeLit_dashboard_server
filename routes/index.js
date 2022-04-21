const Router = require('express')
const userRoute = require('./userRouter')
const workspaceRoute = require('./workspaceRouter')
const workspaceMemberRoute = require('./workspaceMemberRoute')
const taskRoute = require('./taskRoute')

const router = new Router()

router.use('/user', userRoute)
router.use('/workspace', workspaceRoute)
router.use('/workspaceMember', workspaceMemberRoute)
router.use('/task', taskRoute)

module.exports = router