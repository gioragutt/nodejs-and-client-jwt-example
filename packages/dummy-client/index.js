const cli = require('./cli')
const http = require('./http')

const server = http('http://localhost:3000/api/v1')

let loginData = {}

const httpOptions = () => ({
  withCredentials: true,
  responseType: 'json',
  headers: loginData.token ? {
    Authorization: `Bearer ${loginData.token}`,
  } : {},
})

const commands = [{
  command: 'signup <username> <password>',
  action: async ({
    username,
    password,
  }) => {
    try {
      loginData = await server.post('/signup', {
        username: `${username}`,
        password: `${password}`,
      })
    } catch (e) {
      console.error(e)
    }
  },
},
{
  command: 'login <username> <password>',
  action: async ({
    username,
    password,
  }) => {
    try {
      loginData = await server.post('/login', {
        username: `${username}`,
        password: `${password}`,
      })
      console.log(loginData)
    } catch (e) {
      console.error(e)
    }
  },
},
{
  command: 'request',
  action: async () => {
    try {
      console.log(await server.get('/protected', httpOptions()))
    } catch (e) {
      console.error(e)
    }
  },
}]

/* {
  //   command: 'remove <number>',
  //   description: 'Removes a number from the list',
  //   alias: 'rm',
  //   action: callMethod(client, 'remove'),
  // },
  // {
  //   command: 'query',
  //   description: 'Shows the list',
  //   alias: 'ls',
  //   action: callMethod(client, 'query'),
  // },
  // {
  //   command: 'clear',
  //   description: 'Clears the list',
  //   alias: 'c',
  //   action: callMethod(client, 'clear'),
  // },
  // {
  //   command: 'echo <message...>',
  //   action: callMethod(client, 'echo', ({
  //     message,
  //     ...rest
  //   }) => ({
  //     message: message.join(' '),
  //     ...rest
  //   })),
  // }, */

cli(commands, {
  delimiter: 'Dummy Client $',
  // onExit: () => client.disconnect()
})
