const {loggers: {logger}} = require('@welldone-software/node-toolbelt')

const lobbies = require('app/lobbies')

const joinUserToConnectedLobbies = async (socket, username) => {
  const allLobbies = await lobbies.all()
  await Promise.all(allLobbies.map(async ({id}) => {
    if (await lobbies.userInLobby(id, username)) {
      logger.info({id, username}, '[WS] initialization - user is in lobby, joining socket')
      socket.join(id)
    }
  }))
}

module.exports = async (namespace, socket, username) => {
  await joinUserToConnectedLobbies(socket, username)

  socket.on('create_lobby', async ({name}) => {
    try {
      const lobby = await lobbies.create({name})
      namespace.emit('lobby_created', lobby)
      logger.info({username, name}, '[WS] new_lobby_created')
    } catch (e) {
      logger.error({username, name}, '[WS] lobby_already_exists')
    }
  })

  socket.on('join_lobby', async ({id}) => {
    if (await lobbies.userInLobby(id, username)) {
      logger.warn({id, username}, '[WS] user tried to join room here\'s already in')
      return
    }
    logger.info({id, username}, '[WS] join_lobby')
    socket.join(id)
    const event = await lobbies.join(id, username)
    namespace.emit('user_joined_lobby', event)
  })

  socket.on('leave_lobby', async ({id}) => {
    if (!await lobbies.userInLobby(id, username)) {
      logger.warn({id, username}, '[WS] user tried to leave room here\'s not in')
      return
    }
    logger.info({id, username}, '[WS] leave_lobby')
    socket.leave(id)
    const event = await lobbies.leave(id, username)
    namespace.emit('user_left_lobby', event)
  })

  socket.on('message_to_lobby', async ({id, message}) => {
    if (!await lobbies.userInLobby(id, username)) {
      logger.warn({username, id, message}, '[WS] user tried to message lobby he\'s not in')
      return
    }

    const event = await lobbies.message(id, username, message)
    logger.info({username, id, message}, '[WS] message_to_lobby')
    namespace.to(id).emit('message_to_lobby', event)
  })

  socket.on('delete_lobby', async ({id}) => {
    if (!await lobbies.userInLobby(id, username)) {
      logger.warn({id, username}, '[WS] user tried to delete room when he\'s not in it')
      return
    }
    logger.info({id, username}, '[WS] delete_lobby')
    await lobbies.delete(id)
    namespace.emit('lobby_deleted', id)
  })
}
