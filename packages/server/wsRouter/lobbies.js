const {loggers: {logger}} = require('@welldone-software/node-toolbelt')

const lobbies = require('app/lobbies')

module.exports = (namespace, socket, username) => {
  socket.on('create_lobby', async ({id}) => {
    try {
      const lobby = await lobbies.create({id})
      namespace.emit('new_lobby_created', lobby)
      logger.info({username, id}, '[WS] new_lobby_created')
    } catch (e) {
      logger.error({username, id}, '[WS] lobby_already_exists')
    }
  })

  socket.on('join_lobby', async ({id}) => {
    logger.info({id, username}, '[WS] join_lobby')
    socket.join(id)
    const lobby = await lobbies.join(id, username)
    namespace.emit('user_joined_lobby', {lobby, username})
  })

  socket.on('leave_lobby', async ({id}) => {
    logger.info({id, username}, '[WS] leave_lobby')
    socket.leave(id)
    const lobby = await lobbies.leave(id, username)
    namespace.emit('user_left_lobby', {lobby, username})
  })

  socket.on('message_to_lobby', ({id, message}) => {
    logger.info({username, id, message}, '[WS] message_to_lobby')
    socket.to(id).emit('message_to_lobby', {lobby: id, username, message})
  })
}
