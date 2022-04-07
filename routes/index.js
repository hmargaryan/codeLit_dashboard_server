const Router = require('express')
const userRoute = require('./userRouter')

const router = new Router()

router.use('/user', userRoute)

module.exports = router