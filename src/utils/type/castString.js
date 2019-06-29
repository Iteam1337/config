const toJSON = require('./toJSON')
const isObject = require('./isObject')

const castString = string => {
  const json = toJSON(string)

  if (Array.isArray(json)) {
    return json
  }

  if (isObject(json) && Object.keys(json).length) {
    return [json]
  }

  return string
    .split(',')
    .map(value => value.trim())
    .map(value => {
      const json = toJSON(value)

      if (Array.isArray(json)) {
        return json
      }

      if (isObject(json) && Object.keys(json).length) {
        return json
      }

      return value
    })
}

module.exports = castString
