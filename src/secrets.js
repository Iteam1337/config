const fs = require('fs')
const camelCase = require('camelcase')
const dotProp = require('dot-prop')

function getAll ({ dir = '/run/secrets/', separator = '__' }) {
  if (!dir || !fs.existsSync(dir)) {
    return {}
  }

  if (!dir.endsWith('/')) {
    dir = `${dir}/`
  }

  const fileNames = fs.readdirSync(dir)
  const output = {}

  fileNames.forEach(fileName => {
    const pathParts = fileName.split(separator).map(key => camelCase(key))

    dotProp.set(
      output,
      pathParts.join('.'),
      fs.readFileSync(`${dir}${fileName}`, 'utf8').replace(/[\r\n]+$/, '')
    )
  })

  return output
}

module.exports = {
  getAll,
  get: (keys, obj) => {
    return Array.isArray(keys)
      ? keys
        .reduce((result, key) => {
          const data = dotProp.get(obj, key.replace(/:/g, '.'))
          return data || result
        }, false)
      : dotProp.get(obj, keys)
  }
}
