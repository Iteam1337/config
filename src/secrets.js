const fs = require('fs')
const path = require('path')
const camelCase = require('camelcase')
const dotProp = require('dot-prop')

function getAll ({ dir = '/run/secrets/', separator = '__' } = {}) {
  if (!dir || !fs.existsSync(dir)) {
    return {}
  }

  if (!dir.endsWith('/')) {
    dir = `${dir}/`
  }

  if (!fs.lstatSync(dir).isDirectory()) {
    return {}
  }

  const fileNames = fs.readdirSync(dir)
  const output = {}

  fileNames.forEach(fileName => {
    const resolved = path.resolve(dir, fileName)

    const pathParts = fileName.split(separator).map(key => camelCase(key))

    let stat
    try {
      stat = fs.statSync(resolved)
    } catch (_) {
      return
    }

    if (stat.isDirectory()) {
      return
    }

    dotProp.set(
      output,
      pathParts.join('.'),
      fs.readFileSync(resolved, 'utf8').replace(/[\r\n]+$/, '')
    )
  })

  return output
}

module.exports = {
  getAll,
  get: (keys, obj) => {
    return Array.isArray(keys)
      ? keys.reduce((result, key) => {
        const data = dotProp.get(obj, key.replace(/:/g, '.'))
        return data || result
      }, false)
      : dotProp.get(obj, keys)
  }
}
