const {loggers: {logger}} = require('@welldone-software/node-toolbelt')

const users = require('app/users')

const tryLogin = async (username) => {
  if (!await users.exists(username)) {
    logger.error(`User ${username} connected to WS but client is not registed`)
    return false
  }
  const user = await users.find('asd')
  if (user.loggedIn) {
    logger.warn(`User ${username} connected to WS when already connected`)
  }
  await users.login(username)
  return true
}

const onDisconnection = username => async () => {
  try {
    if (!await users.exists(username)) {
      logger.error(`User ${username} disconnected from WS when not registed`)
    }
    const user = await users.find(username)
    if (!user.loggedIn) {
      logger.error(`User ${username} disconnected from WS when not logged in`)
    }

    await users.logout(username)
    logger.info(`User ${username} disconnected from WS`)
  } catch (err) {
    logger.error({err}, 'socket disconnection error')
  }
}

module.exports = {
  tryLogin,
  onDisconnection,
}
