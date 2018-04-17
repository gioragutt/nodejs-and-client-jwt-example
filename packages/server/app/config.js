const {configs: {mapEnv}} = require('@welldone-software/node-toolbelt')

module.exports = mapEnv({
  port: 3000,
  jwtSecret: 'devtime/secret',
})
