const v8 = require('v8')

const copy = value =>
  v8.deserialize(v8.serialize(value))

module.exports = copy
