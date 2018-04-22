const {
  exceptions: {AlreadyExistsError, NotFoundError},
} = require('@welldone-software/node-toolbelt')
const is = require('@sindresorhus/is')
const Redis = require('ioredis')
const {omit} = require('lodash')
const bcrypt = require('bcrypt')

const profileFieldsToOmit = ['password']
const sanitizeUserProfile = profile => omit(profile, profileFieldsToOmit)

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword)
}

const redis = new Redis()

const USER_PREFIX = 'user:'
const userKey = id => `${USER_PREFIX}${id}`

const findUser = async username => redis.hgetall(userKey(username))
const userExists = async username => !is.empty(await findUser(username))

const createUser = async ({username, password}) => {
  if (await userExists(username)) {
    throw new AlreadyExistsError('usernameAlreadyExists')
  }

  const key = userKey(username)
  const userData = {
    username,
    password: await hashPassword(password),
    loggedIn: false,
  }

  await redis.hmset(key, userData)
  return redis.hgetall(key)
}

const allUsers = async () => {
  const userKeys = await redis.keys(`${USER_PREFIX}*`)
  const users = await redis.pipeline(userKeys.map(key => ['hgetall', key])).exec()
  return users.map(([, user]) => sanitizeUserProfile(user))
}

const updateUser = async (username, update) => {
  if (!await userExists(username)) {
    throw new NotFoundError('usernameNotFound', {username})
  }

  const password = update.password ? {password: await hashPassword(update.password)} : {}
  return redis.hmset(userKey(username), {...update, ...password})
}

module.exports = {
  sanitizeUserProfile,
  createUser,
  findUser,
  allUsers,
  userExists,
  updateUser,
  comparePassword,
}
