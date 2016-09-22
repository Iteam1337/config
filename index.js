'use strict'

const camelCase = require('camel-case')

module.exports = class Config {
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

    this.nconf = require('nconf').env(env).file(file)
  }

  set defaults (defaults) {
    this.nconf.defaults(defaults)
  }

  config (key) {
    function changeCase (keys) {
      if (keys === null || typeof keys !== 'object') {
        return {}
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

    return changeCase(this.nconf.get(key))
  }
}
