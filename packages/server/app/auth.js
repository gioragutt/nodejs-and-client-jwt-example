const {
  exceptions: {InvalidArgumentError, NotFoundError},
  jwt: {generateToken},
} = require('@welldone-software/node-toolbelt')
const validator = require('validator')
const config = require('./config')
const users = require('./users')

const makeTokenAndProfile = async ({username}) => ({
  token: await generateToken(config.jwtSecret, {userId: username, verified: true}, '24h'),
  profile: {username},
})

const invalidUsernameOrPassword = () => new NotFoundError('invalidUsernameOrPassword')

const login = ({username, password}) => {
  const user = users.findUser(({id: username}))
  if (!user) {
    throw invalidUsernameOrPassword()
  }

  if (user.password !== password) {
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

  const user = users.createUser({username, password})
  return makeTokenAndProfile(user)
}

module.exports = {
  login,
  signup,
}
