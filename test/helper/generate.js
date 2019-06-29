const conf = require(`${process.cwd()}/src`)

module.exports = defaults => ({ file, secrets, env } = {}) =>
  conf({
    file,
    secrets,
    defaults,
    env
  })
