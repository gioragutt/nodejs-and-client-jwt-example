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
const lobbyEventsKey = id => `${lobbyKey(id)}:events`

const deleteLobby = async ({id}) => {
  logger.info({id}, 'delete')

  await redis.multi([
    ['srem', LOBBY_IDS_KEY, id],
    ['del', lobbyKey(id)],
    ['del', lobbyUsersKey(id)],
    ['del', lobbyEventsKey(id)],
  ]).exec()
}

const exists = async id => redis.sismember(LOBBY_IDS_KEY, id)

const find = async (id) => {
  if (!await exists(id)) {
    return null
  }

  const lobby = await redis.hgetall(lobbyKey(id))
  return {
    ...lobby,
    users: await redis.smembers(lobbyUsersKey(id)),
    events: await map(redis.zrange(lobbyEventsKey(id), 0, -1), JSON.parse),
  }
}

const addEvent = async (id, eventName, context = {}) => {
  const timestamp = Date.now()
  const event = {
    id,
    event: eventName,
    timestamp,
    ...context,
  }
  await redis.zadd(lobbyEventsKey(id), timestamp, JSON.stringify(event))
  return event
}

const create = async ({id}) => {
  if (await exists(id)) {
    throw new AlreadyExistsError('lobbyAlreadyExists')
  }

  const lobbyData = {
    id,
    name: `Lobby ${id}`,
  }

  logger.info({id}, 'create')
  await redis.multi()
    .sadd(LOBBY_IDS_KEY, id)
    .hmset(lobbyKey(id), lobbyData)
    .exec()
  await addEvent(id, 'create')
  return find(id)
}

const join = async (id, username) => {
  logger.info({id, username}, 'join')
  await redis.sadd(lobbyUsersKey(id), username)
  await addEvent(id, 'join', {username})
  return find(id)
}

const leave = async (id, username) => {
  logger.info({id, username}, 'leave')
  await redis.srem(lobbyUsersKey(id), username)
  await addEvent(id, 'leave', {username})
  return find(id)
}

const userInLobby = async (id, userId) =>
  redis.sismember(lobbyUsersKey(id), userId)

const message = async (id, username, content) =>
  addEvent(id, 'message', {username, message: content})

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
  userInLobby,
  message,
}
