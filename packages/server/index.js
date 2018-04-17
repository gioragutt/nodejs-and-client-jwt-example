const express = require('express')
const {
  loggers: {logger, expressLogger},
  expressHelpers: {errorHandler, createApiEndpoint: _},
} = require('@welldone-software/node-toolbelt')
const compression = require('compression')
const bodyParser = require('body-parser')
const expressStatusMonitor = require('express-status-monitor')

const router = new express.Router()

router.get('/test', _(() => 'hello world'))

const app = express()

app.use(compression())
app.use(bodyParser.json())
app.use(expressLogger())
app.set('trust proxy', 'loopback')
app.disable('x-powered-by')
app.use('/api/v1', router)
app.use(expressStatusMonitor())
app.use(errorHandler)

const server = app.listen(3000, () => {
  logger.info({binding: server.address()}, 'http server started')
})
