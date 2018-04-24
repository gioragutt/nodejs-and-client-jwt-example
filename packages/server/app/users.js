const {
  exceptions: {AlreadyExistsError, NotFoundError},
  loggers: {logger},
} = require('@welldone-software/node-toolbelt')
const Redis = require('ioredis')
const {omit, last} = require('lodash')
const bcrypt = require('bcrypt')

const profileFieldsToOmit = ['password']
const sanitizeUserProfile = profile => omit(profile, profileFieldsToOmit)

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

const comparePassword = async (candidatePassword, hashedPassword) =>
  bcrypt.compare(candidatePassword, hashedPassword)

const redis = new Redis()

const USER_PREFIX = 'user:'
const USER_IDS_KEY = 'userIds'

const userKey = id => `${USER_PREFIX}${id}`

const find = async username => redis.hgetall(userKey(username))
const exists = async username => (await redis.exists(userKey(username))) === 1

const create = async ({username, password}) => {
  if (await exists(username)) {
    throw new AlreadyExistsError('usernameAlreadyExists')
  }

  const userData = {
    username,
    password: await hashPassword(password),
    loggedIn: false,
  }

  const key = userKey(username)
  const [, user] = last(await redis.multi()
    .hmset(key, userData) // create user hash
    .sadd(USER_IDS_KEY, key) // add to users set
    .hgetall(key) // fetch user
    .exec())
  logger.info({user}, 'createUser')
  return sanitizeUserProfile(user)
}

const all = async () => {
  const userKeys = await redis.smembers(USER_IDS_KEY)
  const users = await redis.multi(userKeys.map(key => ['hgetall', key])).exec()
  return users.map(([, user]) => sanitizeUserProfile(user))
}

const update = async (username, fields) => {
  if (!await exists(username)) {
    throw new NotFoundError('usernameNotFound', {username})
  }
  return redis.hmset(userKey(username), fields)
}

const login = async username => update(username, {loggedIn: true})
const logout = async username => update(username, {loggedIn: false})

module.exports = {
  sanitizeUserProfile,
  create,
  find,
  all,
  exists,
  comparePassword,
  login,
  logout,
}
