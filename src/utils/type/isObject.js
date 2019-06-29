const isObject = item =>
  item && typeof item === 'object' && !Array.isArray(item)

module.exports = isObject
