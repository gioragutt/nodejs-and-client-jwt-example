const {Router} = require('express')
const {
  jwt: {jwtRequest, jwtSecure},
  // loggers: {logger, expressLogger},
  expressHelpers: {createApiEndpoint: _},
} = require('@welldone-software/node-toolbelt')
const auth = require('./app/auth')
const config = require('./app/config')
const users = require('./app/users')

const router = new Router()
const secure = jwtSecure({
  findUser: ({id}) => {
    const user = users.findUser(id)
    return user && {dataValues: user}
  },
})

router.use(jwtRequest(config.jwtSecret))

router.post(
  '/signup',
  _(({body: {username, password}}) => auth.signup({username, password}))
)

router.post(
  '/login',
  _(({body: {username, password}}) => auth.login({username, password}))
)

router.get(
  '/protected',
  secure,
  _(() => 'im in')
)

router.get(
  '/users',
  secure,
  _(() => users.allUsers())
)

router.get(
  '/users/:username',
  secure,
  _(({params: {username}}) => users.findUser(username))
)

module.exports = router
