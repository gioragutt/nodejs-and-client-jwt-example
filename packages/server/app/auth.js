const {
  exceptions: {InvalidArgumentError, AuthenticationError},
  loggers: {logger},
  jwt: {generateToken},
} = require('@welldone-software/node-toolbelt')
const validator = require('validator')

const config = require('./config')
const users = require('./users')


const makeTokenAndProfile = async ({username, ...rest}) => ({
  token: await generateToken(config.jwtSecret, {userId: username, verified: true}, '24h'),
  profile: {username, ...users.sanitizeUserProfile(rest)},
})

const invalidUsernameOrPassword = () => new AuthenticationError('invalidUsernameOrPassword')

const login = async ({username, password}) => {
  if (!await users.exists(username)) {
    logger.warn({username}, 'invalid username')
    throw invalidUsernameOrPassword()
  }

  const user = await users.find(username)
  if (!await users.comparePassword(password, user.password)) {
    logger.warn({username}, 'incorrect password')
    throw invalidUsernameOrPassword()
  }

  return makeTokenAndProfile(user)
}

const signup = async ({username, password}) => {
  if (!validator.isLength(username, {min: 3})) {
    throw new InvalidArgumentError('shortUsername')
  }

  if (!validator.isLength(password, {min: 6})) {
    throw new InvalidArgumentError('weakPassword')
  }

  const user = await users.create({username, password})
  return makeTokenAndProfile(user)
}

module.exports = {
  login,
  signup,
}
