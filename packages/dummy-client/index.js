const cli = require('./cli')
const http = require('./http')

const server = http('http://localhost:3000/api/v1')

const saveToLocalStorage = data =>
  Object.entries(data)
    .forEach(([key, value]) => {
      console.log({key, value})
      global.vorpal.localStorage.setItem(key, JSON.stringify(value))
    })

const handleAuthenticationRequest = response => saveToLocalStorage(response)

const httpOptions = () => {
  const token = global.vorpal.localStorage.getItem('token')
  return {
    withCredentials: true,
    responseType: 'json',
    headers: token ? {
      Authorization: `Bearer ${JSON.parse(token)}`,
    } : {},
  }
}

const authenticationAction = path => async function authAction({
  username,
  password,
}) {
  try {
    await server.post(path, {
      username: `${username}`,
      password: `${password}`,
    }).then(handleAuthenticationRequest)
  } catch (e) {
    this.log(e)
  }
}

const commands = [{
  command: 'signup <username> <password>',
  action: authenticationAction('/signup'),
}, {
  command: 'login <username> <password>',
  action: authenticationAction('/login'),
},
{
  command: 'request',
  async action() {
    try {
      this.log(await server.get('/protected', httpOptions()))
    } catch (e) {
      this.log(e)
    }
  },
}]

cli(commands, {
  delimiter: 'Dummy Client $',
})
