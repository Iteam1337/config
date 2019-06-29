const isObject = require('./type/isObject')

const mergeDeep = (writeObject, toCopyFrom) => {
  if (!isObject(toCopyFrom) && !isObject(writeObject)) {
    return typeof toCopyFrom === 'undefined'
      ? writeObject : toCopyFrom
  }

  if (isObject(toCopyFrom) && !isObject(writeObject)) {
    return toCopyFrom
  }

  if (isObject(writeObject) && !isObject(toCopyFrom)) {
    return writeObject
  }

  for (const key in toCopyFrom) {
    if (isObject(toCopyFrom[key])) {
      if (typeof writeObject[key] === 'undefined') {
        Object.assign(writeObject, {
          [key]: {}
        })
      }

      mergeDeep(writeObject[key], toCopyFrom[key])
    } else {
      Object.assign(writeObject, { [key]: toCopyFrom[key] })
    }
  }

  return writeObject
}

module.exports = mergeDeep
