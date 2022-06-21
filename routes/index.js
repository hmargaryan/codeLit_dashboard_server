const Router = require('express')
const userRoute = require('./userRouter')
const workspaceRoute = require('./workspaceRouter')
const workspaceMemberRoute = require('./workspaceMemberRoute')
const taskRoute = require('./taskRoute')
const templateRoute = require('./templateRoute')
const candidateRoute = require('./candidateRoute')
const interviewRoute = require('./interviewRoute')

const router = new Router()

router.use('/user', userRoute)
router.use('/workspace', workspaceRoute)
router.use('/workspaceMember', workspaceMemberRoute)
router.use('/task', taskRoute)
router.use('/template', templateRoute)
router.use('/candidate', candidateRoute)
router.use('/interview', interviewRoute)

module.exports = router
