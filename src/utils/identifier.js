const constant = require('constant-case')
const camel = require('camelcase')

const snake = key => {
  return constant(`${key}`).toLowerCase()
}

module.exports = function identifier (key, casing = 'snake') {
  return casing.toLowerCase() === 'snake' ? snake(key) : camel(key)
}
