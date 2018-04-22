const {
  loggers: {logger},
} = require('@welldone-software/node-toolbelt')

const users = require('./app/users')

const tryLogin = async (username) => {
  if (!await users.userExists(username)) {
    logger.error(`User ${username} connected to WS but client is not registed`)
    return false
  }
  const user = await users.findUser(username)
  if (user.loggedIn) {
    logger.warn(`User ${username} connected to WS when already connected`)
  }
  await users.updateUser(username, {loggedIn: true})
  return true
}

const onDisconnection = username => async () => {
  try {
    if (!await users.userExists(username)) {
      logger.error(`User ${username} disconnected from WS when not registed`)
    }
    const user = await users.findUser(username)
    if (!user.loggedIn) {
      logger.error(`User ${username} disconnected from WS when not logged in`)
    }
    await users.updateUser(username, {loggedIn: false})
  } catch (err) {
    logger.error({err}, 'socket disconnection error')
  }
}

const router = (namespace) => {
  namespace.on('connection', async (socket) => {
    const {decoded_token: {userId: username}} = socket
    if (!await tryLogin(username)) {
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
