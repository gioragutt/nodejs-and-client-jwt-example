const {
  loggers: {logger},
} = require('@welldone-software/node-toolbelt')

const Redis = require('ioredis')

const redis = new Redis()

const LOBBY_PREFIX = 'lobby:'
const LOBBY_IDS_KEY = 'lobbyIds'
const lobbyKey = id => `${LOBBY_PREFIX}${id}`
const lobbyUsersKey = id => `${lobbyKey(id)}:users`

const create = async ({id}) => {
  logger.info({id}, 'create')
  await redis.sadd(LOBBY_IDS_KEY, id)
  return id
}

const deleteLobby = async ({id}) => {
  logger.info({id}, 'delete')

  await redis.multi([
    ['srem', LOBBY_IDS_KEY, id],
    ['del', lobbyKey(id)],
    ['del', lobbyUsersKey(id)],
  ]).exec()
}

const join = async (id, userId) => {
  logger.info({id, userId}, 'join')
  return redis.sadd(lobbyUsersKey(id), userId)
}

const leave = async (id, userId) => {
  logger.info({id, userId}, 'leave')
  return redis.srem(lobbyUsersKey(id), userId)
}

const all = async () => (await redis.smembers(LOBBY_IDS_KEY)).map(key => key.slice(LOBBY_PREFIX))

const exists = async id => redis.sismember(LOBBY_IDS_KEY, id)

module.exports = {
  create,
  delete: deleteLobby,
  join,
  leave,
  all,
  exists,
}
