const camelCase = require('camelcase')
const constantCase = require('constant-case')

const secrets = require('./secrets')

module.exports = options => {
  const _nconf = new WeakMap()
  const _defaults = new WeakMap()
  const _secrets = new WeakMap()

  class Config {
    static isObject (item) {
      return item && typeof item === 'object' && !Array.isArray(item)
    }

    static mergeDeep (target, source) {
      if (!Config.isObject(target) || !Config.isObject(source)) {
        return target || source
      }

      for (const key in source) {
        if (Config.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, {
              [key]: {}
            })
          }

          Config.mergeDeep(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }

      return target
    }

    static changeCase (keys) {
      if (keys === null) {
        return null
      }

      if (typeof keys !== 'object') {
        return keys
      }

      if (Array.isArray(keys)) {
        return keys.map(key => Config.changeCase(key))
      }

      return Object.keys(keys).reduce((object, key) => {
        const value = keys[key]
        const identfier = camelCase(key)
        if (typeof value !== 'object') {
          object[identfier] = value
        } else {
          object[identfier] = Config.changeCase(value)
        }
        return object
      }, {})
    }

    static nconfDefaults (env, file) {
      const nconf = require('nconf')

      if (!file) {
        return nconf.env(env).get()
      }

      if (env.whitelist || env.match) {
        nconf.env({
          whitelist: env.whitelist,
          match: env.match
        })
      }

      return nconf.file(file).get()
    }

    static file () {
      return {
        search: true,
        dir: '../',
        file: 'config.json'
      }
    }

    static env () {
      return {
        separator: '__',
        lowerCase: true
      }
    }

    static secrets () {
      return {
        dir: '/run/secrets/',
        separator: '__'
      }
    }

    constructor (options = {
      file: Config.file(),
      env: Config.env(),
      secrets: false
    }) {
      const env = Object.assign(Config.env(), options.env || {})

      const file =
        typeof options.file === 'string'
          ? options.file
          : Object.assign(Config.file(), options.file || {})

      const nconf = require('nconf').env(env).file(file)

      this.secrets = options.secrets

      _nconf.set(this, nconf)

      this.defaults = Config.mergeDeep(
        Config.changeCase(Config.nconfDefaults(env)),
        Config.changeCase(Config.nconfDefaults(env, file))
      )
    }

    set secrets (options) {
      if (!options) {
        return
      }

      const obj = secrets.getAll(
        typeof options === 'string'
          ? { dir: options }
          : Config.mergeDeep(Config.secrets(), options || {})
      )

      _secrets.set(this, obj)
    }

    set defaults (defaults) {
      const nconf = require('nconf')
      const modified = Config.changeCase(defaults)

      nconf.defaults(modified)

      _defaults.set(this, nconf)
    }

    get (key) {
      const modifiedKey = key
        .split(':')
        .map(part => constantCase(part).toLowerCase())
        .join(':')

      const privSecrets = _secrets.get(this)
      const privDefaults = _defaults.get(this)
      const privNconf = _nconf.get(this)

      const [
        defaults,
        modified,
        nconfModified
      ] = [
        Config.mergeDeep(
          Config.changeCase(privDefaults.get(key)),
          Config.changeCase(privNconf.get(key))
        ),
        Config.changeCase(privDefaults.get(modifiedKey)),
        Config.changeCase(privNconf.get(modifiedKey))
      ]

      const merged = (modified || nconfModified)
        ? Config.mergeDeep(defaults, Config.mergeDeep(modified, nconfModified))
        : defaults

      return privSecrets
        ? Config.mergeDeep(merged, secrets.get([key, modifiedKey], privSecrets))
        : merged
    }
  }

  return new Config(options)
}
