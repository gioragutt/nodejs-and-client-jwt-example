const {
  loggers: {logger},
  exceptions: {AlreadyExistsError},
} = require('@welldone-software/node-toolbelt')

const {map} = require('awaity')
const Redis = require('ioredis')

const redis = new Redis()

const LOBBY_PREFIX = 'lobby:'
const LOBBY_IDS_KEY = 'lobbyIds'
const lobbyKey = id => `${LOBBY_PREFIX}${id}`
const lobbyUsersKey = id => `${lobbyKey(id)}:users`

const deleteLobby = async ({id}) => {
  logger.info({id}, 'delete')

  await redis.multi([
    ['srem', LOBBY_IDS_KEY, id],
    ['del', lobbyKey(id)],
    ['del', lobbyUsersKey(id)],
  ]).exec()
}

const exists = async id => redis.sismember(LOBBY_IDS_KEY, id)

const find = async (id) => {
  if (!await exists(id)) {
    return null
  }

  return {
    id,
    users: await redis.smembers(lobbyUsersKey(id)),
  }
}

const create = async ({id}) => {
  if (await exists(id)) {
    throw new AlreadyExistsError('lobbyAlreadyExists')
  }

  logger.info({id}, 'create')
  await redis.sadd(LOBBY_IDS_KEY, id)
  return find(id)
}

const join = async (id, userId) => {
  logger.info({id, userId}, 'join')
  await redis.sadd(lobbyUsersKey(id), userId)
  return find(id)
}

const leave = async (id, userId) => {
  logger.info({id, userId}, 'leave')
  await redis.srem(lobbyUsersKey(id), userId)
  return find(id)
}

const all = async () => {
  const lobbyIds = await redis.smembers(LOBBY_IDS_KEY)
  const lobbies = await map(lobbyIds, find)
  return lobbies
}

module.exports = {
  create,
  delete: deleteLobby,
  join,
  leave,
  all,
  exists,
  find,
}
