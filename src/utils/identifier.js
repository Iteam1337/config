const constant = require('constant-case')
const camel = require('camelcase')

const snake = key =>
  constant(`${key}`).toLowerCase()

const identifier = (key, casing = 'snake') =>
  casing.toLowerCase() === 'snake' ? snake(key) : camel(key)

module.exports = identifier
