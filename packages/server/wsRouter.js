const {
  loggers: {logger},
} = require('@welldone-software/node-toolbelt')

const router = (socket) => {
  logger.info(`hello ${socket.decoded_token.userId}!`)

  socket.on('message', (message, cb) => {
    logger.info({message}, 'got message')
    cb(`response to: ${message}`)
  })
}

module.exports = router
