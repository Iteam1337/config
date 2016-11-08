'use strict'

const camelCase = require('camel-case')
const _nconf = new WeakMap()
const _defaults = new WeakMap()

function isObject (item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function mergeDeep (target, source) {
  if (!isObject(target) || !isObject(source)) {
    return target
  }

  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) {
        Object.assign(target, {
          [key]: {}
        })
      }

      mergeDeep(target[key], source[key])
    } else {
      Object.assign(target, { [key]: source[key] })
    }
  }

  return target;
}

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

  changeCase (keys) {
    if (keys === null) {
      return null
    }

    if (typeof keys !== 'object') {
      return keys
    }

    if (Array.isArray(keys)) {
      return keys.map(key => this.changeCase(key))
    }

    return Object.keys(keys).reduce((object, key) => {
      const value = keys[key]
      const identfier = camelCase(key)
      if (typeof value !== 'object') {
        object[identfier] = value;
      } else {
        object[identfier] = this.changeCase(value)
      }
      return object
    }, {})
  }

  set defaults (defaults) {
    const nconf = require('nconf').defaults(defaults)
    _defaults.set(this, nconf)
  }

  get defaults () {
    return _defaults
  }

  get (key) {
    function changeCase (keys) {
      if (keys === null) {
        return null
      }

      if (typeof keys !== 'object') {
        return keys
      }

      if (Array.isArray(keys)) {
        return keys.map(key => changeCase(key))
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

    return mergeDeep(changeCase(changeCase(_defaults.get(this).get(key)), _nconf.get(this).get(key)))
  }
}

module.exports = options => new Config(options)
