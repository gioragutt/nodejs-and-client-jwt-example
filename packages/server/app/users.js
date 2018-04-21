const {
  exceptions: {AlreadyExistsError},
} = require('@welldone-software/node-toolbelt')
const {omit} = require('lodash')

const users = {}

const findUser = username => users[username]

const createUser = ({username, password}) => {
  if (findUser(username)) {
    throw new AlreadyExistsError('usernameAlreadyExists')
  }

  const userData = {username, password}
  users[userData.username] = userData
  return users[userData.username]
}

const allUsers = () => Object.values(users).map(user => omit(user, ['password']))

module.exports = {
  createUser,
  findUser,
  allUsers,
}
