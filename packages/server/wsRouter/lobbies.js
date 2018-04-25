const {loggers: {logger}} = require('@welldone-software/node-toolbelt')

const lobbies = require('app/lobbies')

module.exports = (socket, username) => {
  socket.on('create_lobby', async (id) => {
    try {
      const lobby = await lobbies.create({id})
      socket.emit('new_lobby_created', lobby)
      logger.info({username, id}, '[WS] new_lobby_created')
    } catch (e) {
      logger.error({username, id}, '[WS] lobby_already_exists')
    }
  })

  socket.on('join_lobby', async (id, onJoin) => {
    const lobby = await lobbies.join(id, username)
    socket.broadcast.emit('user_joined_lobby', {id, username})
    onJoin(lobby)
  })

  socket.on('leave_lobby', async (id, onLeave) => {
    const lobby = await lobbies.leave(id, username)
    socket.broadcast.emit('user_left_lobby', {id, username})
    onLeave(lobby)
  })
}
