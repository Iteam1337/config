const toBoolean = value => {
  if (typeof value === 'boolean') {
    return value
  }

  switch (`${value}`.toLowerCase()) {
    case 'true':
    case '1':
      return true
    case 'false':
    case '0':
      return false
    default:
      return !!value
  }
}

module.exports = toBoolean
