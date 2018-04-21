const {cli, vlog} = require('./cli')
const http = require('./http')
const io = require('socket.io-client')

const server = http('http://localhost:3000/api/v1')

const {httpOptions, saveObjectToStorage, readFromStorage} = require('./utils')

let socket = null

const handleAuthenticationRequest = response => saveObjectToStorage(response)

const validate = {
  loggedIn: () => !!readFromStorage('token'),
  websocketConnected: () => socket || (vlog.warn('socket.io not connected') || false),
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
    vlog.error(e.response.message)
  }
}

const connectToWebsocket = () => {
  const token = readFromStorage('token')
  vlog.info(`Connecting to WS with token: ${token}`)
  socket = io.connect('http://localhost:3000', {query: `token=${token}`})

  socket.on('error', (error) => {
    vlog.error(error)
    socket = null
  })

  socket.on('connect', () => vlog.info('Successfully connected to WS'))
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
    command: 'loginws',
    validate: validate.loggedIn,
    action: connectToWebsocket,
  },
  {
    command: 'profile',
    action: () => {
      vlog.info('Profile is')
      vlog.info(readFromStorage('profile'))
    },
  },
  {
    command: 'request',
    validate: validate.loggedIn,
    action: async () => {
      try {
        vlog.info('requesting:')
        vlog.info(await server.get('/protected', httpOptions()))
      } catch (e) {
        vlog.error(e)
      }
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
