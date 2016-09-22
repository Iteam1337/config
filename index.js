'use strict'

const camelCase = require('camel-case')
const _nconf = new WeakMap()

class Config {
  constructor (options) {
    options = options || { file: {}, env: {} }

    const env = Object.assign({
      separator: '__',
      lowerCase: true
    }, options.env)

    const file = Object.assign({
      search: true,
      dir: '../',
      file: 'config.json'
    }, options.file)

    _nconf.set(this, require('nconf').env(env).file(file))
  }

  set defaults (defaults) {
    const nconf = _nconf.get(this)

    nconf.defaults(defaults)
  }

  get (key) {
    function changeCase (keys) {
      if (keys === null) {
        return null
      }

      if (typeof keys !== 'object') {
        return keys
      }

      return Object.keys(keys).reduce((object, key) => {
        const value = keys[key]
        const identfier = camelCase(key)
        if (typeof value !== 'object') {
          object[identfier] = value;
        } else {
          object[identfier] = changeCase(value)
        }
        return object
      }, {})
    }

    return changeCase(_nconf.get(this).get(key))
  }
}

module.exports = options => new Config(options)
