const express = require('express')
const {
  loggers: {logger, expressLogger},
  expressHelpers: {errorHandler},
} = require('@welldone-software/node-toolbelt')
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
const expressStatusMonitor = require('express-status-monitor')
const io = require('socket.io')
const socketioJwt = require('socketio-jwt')

const config = require('./app/config')
const router = require('./router')
const wsRouter = require('./wsRouter')

const app = express()

app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(expressLogger())
app.set('trust proxy', 'loopback')
app.disable('x-powered-by')
app.use('/api/v1', router)
app.use(expressStatusMonitor())
app.use(errorHandler)

const server = app.listen(config.port, () => {
  logger.info({binding: server.address()}, 'http server started')

  const socketio = io(server)

  socketio.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true,
    credentialsRequired: false,
  }))

  wsRouter(socketio.sockets)
})
