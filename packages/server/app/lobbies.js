const {
  loggers: {logger},
  exceptions: {AlreadyExistsError},
} = require('@welldone-software/node-toolbelt')

const uuid = require('uuid')
const {map} = require('awaity')
const Redis = require('ioredis')

const redis = new Redis()

const LOBBY_PREFIX = 'lobby:'
const LOBBY_IDS_KEY = 'lobbyIds'
const LOBBY_NAMES_KEY = 'lobbyNames'
const lobbyKey = id => `${LOBBY_PREFIX}${id}`
const lobbyUsersKey = id => `${lobbyKey(id)}:users`
const lobbyEventsKey = id => `${lobbyKey(id)}:events`

const deleteLobby = async ({id}) => {
  logger.info({id}, 'delete')
  const name = await redis.hget(lobbyKey(id), 'name')

  await redis.multi([
    ['srem', LOBBY_IDS_KEY, id],
    ['srem', LOBBY_NAMES_KEY, name],
    ['del', lobbyKey(id)],
    ['del', lobbyUsersKey(id)],
    ['del', lobbyEventsKey(id)],
  ]).exec()
}

const existsById = async id => redis.sismember(LOBBY_IDS_KEY, id)
const existsByName = async name => redis.sismember(LOBBY_NAMES_KEY, name)

const find = async (id) => {
  if (!await existsById(id)) {
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

const create = async ({name}) => {
  if (await existsByName(name)) {
    throw new AlreadyExistsError('lobbyAlreadyExists', {name})
  }

  const id = uuid().substr(0, 6)
  const lobbyData = {
    id,
    name,
    description: '',
  }

  logger.info({id}, 'create')
  await redis.multi()
    .sadd(LOBBY_IDS_KEY, id)
    .sadd(LOBBY_NAMES_KEY, name)
    .hmset(lobbyKey(id), lobbyData)
    .exec()
  await addEvent(id, 'create')
  return find(id)
}

const join = async (id, username) => {
  logger.info({id, username}, 'join')
  await redis.sadd(lobbyUsersKey(id), username)
  return addEvent(id, 'join', {username})
}

const leave = async (id, username) => {
  logger.info({id, username}, 'leave')
  await redis.srem(lobbyUsersKey(id), username)
  return addEvent(id, 'leave', {username})
}

const userInLobby = async (id, userId) => {
  const result = await redis.sismember(lobbyUsersKey(id), userId)
  return result === 1
}

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
  existsById,
  existsByName,
  find,
  userInLobby,
  message,
}
