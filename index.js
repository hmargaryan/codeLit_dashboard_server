require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const router = require('./routes')
const { createClient }  = require('redis')
const { promisify }  = require('util')

const PORT = process.env.PORT

const redisClient = createClient()
const redisGetAsync = promisify(redisClient.get).bind(redisClient)

const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  socket.on('room', async (data) => {
    socket.join(data.room);

    // all sockets in the main namespace and in the "user:1234" room
    // const ids = await io.in(data.room).allSockets();
    // console.log(ids.size)

    const cache = await redisGetAsync(data.room)
    socket.nsp.to(data.room).emit('load cache', cache)
  })

  socket.on('leave room', (data) => {
    socket.leave(data.room)
  })

  socket.on('send changes', (delta) => {
    socket.broadcast.to(delta.room).emit('receive changes', delta.value)
    redisClient.setex(delta.room, 86400, delta.value)
  })

  socket.on('change language', (data) => {
    socket.broadcast.to(data.room).emit('receive language', data.value)
  })

  console.log('connected socket')
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {

  }
}

start()
