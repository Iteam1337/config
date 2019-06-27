const isObject = require('./isObject')
module.exports = function mergeDeep (writeObject, toCopyFrom) {
  if (!isObject(toCopyFrom) && !isObject(writeObject)) {
    return toCopyFrom || writeObject
  }

  if (isObject(toCopyFrom) && !isObject(writeObject)) {
    return toCopyFrom
  }

  if (isObject(writeObject) && !isObject(toCopyFrom)) {
    return writeObject
  }

  for (const key in toCopyFrom) {
    if (isObject(toCopyFrom[key])) {
      if (!writeObject[key]) {
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
