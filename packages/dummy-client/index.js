const {cli, vlog} = require('./cli')
const http = require('./http')
const io = require('socket.io-client')
const {get} = require('lodash')

const server = http('http://localhost:3000/api/v1')

const {
  httpOptions,
  saveObjectToStorage,
  readFromStorage,
  removeFromStorage,
} = require('./utils')

let socket = null

const handleAuthenticationRequest = response => saveObjectToStorage(response)

const checkValidation = (value, message) => {
  if (!value) {
    vlog.error(message)
    return false
  }
  return true
}

const validate = {
  loggedIn: () => checkValidation(
    readFromStorage('token'),
    'Token expired or you\'re not logged in, please log in again'
  ),
  websocketConnected: () => checkValidation(socket, 'socket.io not connected'),
}

const logout = () => {
  vlog.warn('logging out - removing localStorage and ws connection');
  ['token', 'profile'].forEach(removeFromStorage)
  try {
    socket.disconnect()
  } catch (e) {}
  socket = null
}

const validateTokenExpiration = ({code}) => {
  if (code === 'invalid_token') {
    logout()
  }
}

const authenticationAction = (path, onSuccess) => async function authAction({
  username,
  password,
}) {
  try {
    await server.post(path, {
      username: `${username}`,
      password: `${password}`,
    }).then(handleAuthenticationRequest)
      .then(onSuccess || (() => {}))
  } catch (e) {
    vlog.error(get(e, 'response.message') || e)
  }
}

const connectToWebsocket = () => {
  const token = readFromStorage('token')
  socket = io.connect('http://localhost:3000', {query: `token=${token}`})

  socket.on('error', (error) => {
    validateTokenExpiration(error)
    try {
      vlog.error(typeof error === 'object' ? JSON.stringify(error) : error)
    } catch (e) {
      vlog.error(`Unknown error: ${error}`)
    }
  })

  socket.on('connect', () => vlog.info('Successfully connected to WS'))
  socket.on('disconnect', () => {
    vlog.info('Websocket disconnected, logging out')
    logout()
  })
}

const commands = [
  {
    command: 'signup <username> <password>',
    action: authenticationAction('/signup'),
  },
  {
    command: 'login <username> <password>',
    action: authenticationAction('/login', connectToWebsocket),
  },
  {
    command: 'logout', action: logout,
  },
  {
    command: 'loginws',
    validate: validate.loggedIn,
    action: connectToWebsocket,
  },
  {
    command: 'profile',
    validate: validate.loggedIn,
    action: () => {
      vlog.info('Profile is')
      vlog.info(JSON.stringify(readFromStorage('profile')))
    },
  },
  {
    command: 'request',
    validate: validate.loggedIn,
    action: async () => {
      vlog.info(await server.get('/protected', httpOptions()))
    },
  },
  {
    command: 'users',
    validate: validate.loggedIn,
    action: async () => {
      const users = await server.get('/users', httpOptions())
      vlog.info(`Connected users: ${JSON.stringify(users)}`)
    },
  },
  {
    command: 'send <message...>',
    validate: validate.websocketConnected,
    action: ({message}) => {
      socket.emit('message', message.join(' '), vlog.info)
    },
  },
]

cli(commands, {delimiter: 'Dummy Client $'})
if (validate.loggedIn()) {
  connectToWebsocket()
}
