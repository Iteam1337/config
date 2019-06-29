const mergeDeep = require('../mergeDeep')

const isObject = require('./isObject')
const castString = require('./castString')
const toBoolean = require('./toBoolean')
const toJSON = require('./toJSON')

const toObjectLoose = (array, output, from, defaults) => {
  return array.reduce((object, key) => {
    if (output[key] === undefined) {
      return object
    }

    object[key] = cast(
      output[key],
      from[key] || defaults[1][key] || defaults[0][key]
    )

    return object
  }, {})
}

const toObject = (output, from, isStrict, defaults) => {
  if (isStrict) {
    return Object.keys(from).reduce((object, key) => {
      object[key] = cast(output[key], from[key], output[key] !== undefined)
      return object
    }, {})
  }

  return mergeDeep(
    toObjectLoose(Object.keys(from), output, from, defaults),
    toObjectLoose(Object.keys(output), output, from, defaults)
  )
}

const toArray = (output, from, isStrict) => {
  if (
    !isObject(output) &&
    typeof output !== 'string' &&
    !Array.isArray(output)
  ) {
    return []
  }

  const converted = isObject(output)
    ? [output]
    : Array.isArray(output)
      ? output
      : castString(output)

  return converted.map((value, index) => {
    isStrict = isStrict === undefined ? true : from[index] !== undefined
    return cast(value, from[index] || from[0], isStrict, [value, from[0]])
  })
}

const cast = (output, from, isStrict = true, defaults) => {
  if (typeof from === 'undefined' || from === null || output === 'undefined') {
    return output
  }

  if (isObject(from)) {
    return toObject(toJSON(output), from, isStrict, defaults)
  }

  if (Array.isArray(from)) {
    return toArray(output, from, isStrict)
  }

  switch (typeof from) {
    case 'number':
      const converted = Number(output)
      return isNaN(converted) ? from : converted
    case 'string':
      return `${output}`
    case 'boolean':
      return toBoolean(output)
    default:
      return output
  }
}

module.exports = {
  cast,
  toArray,
  toObject,
  castString,
  toBoolean,
  toJSON,
  isObject
}
