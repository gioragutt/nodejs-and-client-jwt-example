const {loggers: {logger}} = require('@welldone-software/node-toolbelt')

const lobbyRoutes = require('./lobbies')
const {tryLogin, onDisconnection} = require('./users')

module.exports = (namespace) => {
  namespace.on('connection', async (socket) => {
    const {decoded_token: {userId: username}} = socket
    if (!await tryLogin(username)) {
      socket.disconnect(true)
      return
    }

    socket.on('disconnect', onDisconnection(username))
    logger.info(`User ${username} connected!`)

    socket.on('message', (message) => {
      logger.info({username, message}, '[WS] message')
      socket.broadcast.emit('message', {username, message})
    })

    lobbyRoutes(namespace, socket, username)
  })
}
