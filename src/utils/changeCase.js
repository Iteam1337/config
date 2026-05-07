const identifier = require('./identifier')
const { isPassthrough } = require('./passthrough')

const changeCase = (keys, casing = 'snake') => {
  if (keys === null) {
    return null
  }

  if (isPassthrough(keys)) {
    return keys
  }

  if (typeof keys !== 'object') {
    return keys
  }

  if (Array.isArray(keys)) {
    return keys.map((key) => changeCase(key, casing))
  }

  return Object.keys(keys).reduce((object, key) => {
    const value = keys[key]
    const identfier = identifier(key, casing)
    if (typeof value !== 'object') {
      object[identfier] = value
    } else {
      object[identfier] = changeCase(value, casing)
    }
    return object
  }, {})
}

module.exports = changeCase
