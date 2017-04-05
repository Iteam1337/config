'use strict'

const camelCase = require('camel-case')
const constantCase = require('constant-case')
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
    const modified = changeCase(defaults)

    const nconf = require('nconf').defaults(modified)
    _defaults.set(this, nconf)
  }

  get defaults () {
    return _defaults
  }

  get (key) {
    const defaultMatch = mergeDeep(
      changeCase(_defaults.get(this).get(key)),
      changeCase(_nconf.get(this).get(key))
    )

    const modifiedKey = constantCase(`${key}`)
    const modifiedMatch = mergeDeep(
      changeCase(_defaults.get(this).get(modifiedKey)),
      changeCase(_nconf.get(this).get(modifiedKey))
    )
    
    return modifiedMatch || defaultMatch
  }
}

module.exports = options => new Config(options)

