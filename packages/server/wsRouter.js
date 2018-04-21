const {
  loggers: {logger},
} = require('@welldone-software/node-toolbelt')

const users = require('./app/users')

const tryLogin = (username) => {
  const user = users.findUser(username)

  if (!user) {
    logger.error(`User ${username} connected to WS but client is not registed`)
    return false
  }
  if (user.loggedIn) {
    logger.warn(`User ${username} connected to WS when already connected`)
  }
  user.loggedIn = true
  return true
}

const onDisconnection = username => () => {
  const user = users.findUser(username)
  if (!user) {
    logger.error(`User ${username} disconnected from WS when not registed`)
  }
  if (!user.loggedIn) {
    logger.error(`User ${username} disconnected from WS when not logged in`)
  }
  user.loggedIn = false
}

const router = (namespace) => {
  namespace.on('connection', (socket) => {
    const {decoded_token: {userId: username}} = socket
    if (!tryLogin(username)) {
      socket.disconnect(true)
      return
    }

    socket.on('disconnect', onDisconnection(username))
    logger.info(`User ${username} connected!`)

    socket.on('message', (message, cb) => {
      logger.info({username, message}, '[WS] message')

      if (cb) {
        cb(`response to: ${message}`)
      }
    })
  })
}

module.exports = router
