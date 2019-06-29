const utils = require('./utils')
const secrets = require('./secrets')

module.exports = options => {
  const _conf = new WeakMap()
  const _confEnv = new WeakMap()
  const _confFile = new WeakMap()
  const _secrets = new WeakMap()

  class Config {
    static file () {
      return {
        search: false,
        dir: '../',
        file: 'config.json'
      }
    }

    static env () {
      return {
        separator: '__'
      }
    }

    static secrets () {
      return {
        dir: '/run/secrets/',
        separator: '__'
      }
    }

    constructor ({ env = {}, file, secrets = false, defaults } = {}) {
      this.env = env
      this.file = typeof file === 'string' ? { file } : file

      this.secrets = secrets || false
      this.defaults = defaults
    }

    set secrets (options) {
      if (!options) {
        return
      }

      const obj = secrets.getAll(
        typeof options === 'string'
          ? { dir: options }
          : utils.mergeDeep(Config.secrets(), options)
      )

      _secrets.set(
        this,
        new utils.Config({
          defaults: utils.changeCase(obj)
        })
      )
    }

    set defaults (values = {}) {
      const { env, file } = this
      const defaults = utils.changeCase(values)

      _conf.set(
        this,
        new utils.Config({
          defaults
        })
      )
      _confEnv.set(
        this,
        new utils.Config({
          env
        })
      )
      _confFile.set(
        this,
        new utils.Config({
          file
        })
      )
    }

    get (value) {
      const { mergeDeep, changeCase, identifier, copy, isObject } = utils

      const key = value
        .split(':')
        .map(part => identifier(part))
        .join('.')

      const _s = _secrets.get(this)
      const _e = _confEnv.get(this)
      const _f = _confFile.get(this)
      const _d = _conf.get(this)

      const [env, file, defaults, secrets] = [
        _e && _e.get ? _e.get(key) : undefined,
        _f && _f.get ? _f.get(key) : undefined,
        _d && _d.get ? _d.get(key) : undefined,
        _s && _s.get ? _s.get(key) : undefined
      ]

      const merged = mergeDeep(copy(defaults), mergeDeep(copy(env), file))

      const out = changeCase(
        secrets ? mergeDeep(copy(merged), secrets) : merged,
        'camel'
      )

      const cast = utils.type.cast(out, changeCase(defaults, 'camel'))

      if (
        !isObject(out) &&
        !isObject(cast) &&
        !Array.isArray(out) &&
        !Array.isArray(cast)
      ) {
        return cast
      }

      return mergeDeep(out, cast)
    }
  }

  return new Config(options)
}
