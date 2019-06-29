const isObject = require('./isObject')

const toJSON = content => {
  if (isObject(content)) {
    return content
  }

  try {
    return JSON.parse(content)
  } catch (_) {
    return {}
  }
}

module.exports = toJSON
