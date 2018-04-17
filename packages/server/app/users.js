const {
  exceptions: {AlreadyExistsError}
} = require('@welldone-software/node-toolbelt')

const users = {}

const createUser = ({username, password}) => {
  const usernameExists = Object.values(users)
    .map(({username: existingUsername}) => existingUsername)
    .filter(existingUsername => existingUsername === username)
    .length > 0
  if (usernameExists) {
    throw new AlreadyExistsError('username')
  }

  const userData = {id: username, username, password}

  users[userData.id] = userData
  return users[userData.id]
}

const findUser = ({id}) => users[id]

module.exports = {
  createUser,
  findUser,
}
