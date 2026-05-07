const PASSTHROUGH_BRAND = '__iteamConfigPassthrough__'

const passthrough = (defaults) =>
  Object.freeze({
    [PASSTHROUGH_BRAND]: true,
    defaults,
  })

const isPassthrough = (value) => {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, PASSTHROUGH_BRAND) &&
    value[PASSTHROUGH_BRAND] === true
  )
}

module.exports = {
  passthrough,
  isPassthrough,
}
