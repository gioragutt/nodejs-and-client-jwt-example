const {Router} = require('express')
const {
  jwt: {jwtRequest, jwtSecure},
  // loggers: {logger, expressLogger},
  expressHelpers: {createApiEndpoint: _},
} = require('@welldone-software/node-toolbelt')
const auth = require('app/auth')
const config = require('app/config')

const router = new Router()

router.use(jwtRequest(config.jwtSecret))

const secure = () => jwtSecure()

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
  secure(),
  _(() => 'im in')
)

module.exports = router
