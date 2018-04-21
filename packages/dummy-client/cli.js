const Vorpal = require('vorpal')
const chalk = require('chalk')

const createVorpalLogger = (additionalLevels = {}) => {
  const levels = {
    info: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    ...additionalLevels,
  }

  const format = (msg, level) => `${(new Date()).toLocaleString()} ${level.toUpperCase()} - ${msg}`

  const vorpalLog = (color, level) => msg => global.vorpal.log(color(format(msg, level)))

  return Object.entries(levels).reduce((logger, [level, color]) => {
    logger[level] = vorpalLog(color, level)
    return logger
  }, {})
}

const vlog = createVorpalLogger()

const initializeCommand = (
  vorpal,
  {command: name, description, action, ...other}
) => {
  const command = vorpal.command(name, description)
  Object.entries(other).forEach(([key, value]) => {
    if (command[key]) {
      command[key](value)
    }
  })
  command.action((argsAndOptions, callback) => {
    const {options, ...args} = argsAndOptions
    Promise.resolve()
      .then(() => action(args, options))
      .then(callback)
      .catch((error) => {
        vlog.error(error)
        callback()
      })
  })
}

/**
 * Creates an interactive command line with given commands and options
 * @param {{command: String, [description]: String, [alias]: String, action: Function}[]} commands
 * @param {{[delimiter]: String}} options
 */
const cli = (commands, {delimiter, onExit} = {}) => {
  const vorpal = Vorpal()
  vorpal.history('dummy-client')
  vorpal.localStorage('dummy-client')
  global.vorpal = vorpal // allow debugging via console
  commands.forEach(desc => initializeCommand(vorpal, desc))
  vorpal.delimiter(delimiter || '$').show()
  if (onExit) {
    vorpal.on('vorpal_exit', onExit)
  }
}

module.exports = {
  cli,
  vlog,
  createVorpalLogger,
}
