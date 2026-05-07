const fs = require('fs')
const utils = require('./utils')
const secrets = require('./secrets')
const { passthrough, isPassthrough } = require('./utils/passthrough')
const isDocker = require('is-docker')()

const Source = Object.freeze({
  ENV: 'env',
  FILE: 'file',
  SECRETS: 'secrets',
})

const defaultResolutionOrder = () => [Source.ENV, Source.FILE, Source.SECRETS]

const normalizeResolutionOrder = (sources = defaultResolutionOrder()) => {
  if (!Array.isArray(sources)) {
    throw new TypeError('resolutionOrder must be an array')
  }

  const allowedSources = Object.values(Source)
  const normalized = sources.map((source) => {
    if (!allowedSources.includes(source)) {
      throw new TypeError(
        `Unknown resolution source "${source}". Expected one of: ${allowedSources.join(', ')}`
      )
    }

    return source
  })

  if (new Set(normalized).size !== normalized.length) {
    throw new TypeError('resolutionOrder must not contain duplicate sources')
  }

  return normalized
}

const useSecrets = () => {
  if (!isDocker) {
    return false
  }

  return !fs.readFileSync('/proc/self/cgroup', 'utf8').includes('kubepods')
}

const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value)
}

const decomposeDefaults = (values) => {
  if (isPassthrough(values)) {
    return {
      defaults: values.defaults,
      coercion: passthrough(),
    }
  }

  if (Array.isArray(values)) {
    return values.reduce(
      (result, value) => {
        const decomposed = decomposeDefaults(value)
        result.defaults.push(decomposed.defaults)
        result.coercion.push(decomposed.coercion)
        return result
      },
      {
        defaults: [],
        coercion: [],
      }
    )
  }

  if (!isObject(values)) {
    return {
      defaults: values,
      coercion: values,
    }
  }

  return Object.keys(values).reduce(
    (result, key) => {
      const decomposed = decomposeDefaults(values[key])
      result.defaults[key] = decomposed.defaults
      result.coercion[key] = decomposed.coercion
      return result
    },
    {
      defaults: {},
      coercion: {},
    }
  )
}

const getCoercion = (coercion, key) => {
  let current = coercion

  for (const part of key.split('.')) {
    if (isPassthrough(current)) {
      return current
    }

    if (typeof current === 'undefined' || current === null) {
      return current
    }

    current = current[part]
  }

  return current
}

const createConfig = (options) => {
  const _conf = new WeakMap()
  const _coercion = new WeakMap()
  const _confEnv = new WeakMap()
  const _confFile = new WeakMap()
  const _secrets = new WeakMap()

  class Config {
    static file() {
      return {
        search: false,
        dir: '../',
        file: 'config.json',
      }
    }

    static env() {
      return {
        separator: '__',
      }
    }

    static secrets() {
      return {
        dir: '/run/secrets/',
        separator: '__',
      }
    }

    static resolutionOrder() {
      return defaultResolutionOrder()
    }

    constructor({
      env = {},
      file,
      secrets = useSecrets() ? Config.secrets() : false,
      defaults,
      resolutionOrder = Config.resolutionOrder(),
    } = {}) {
      this.resolutionOrder = Object.freeze(
        normalizeResolutionOrder(resolutionOrder)
      )
      this.env = env
      this.file = typeof file === 'string' ? { file } : file

      this.secrets = secrets
      this.defaults = defaults
    }

    set secrets(options) {
      if (!this.resolutionOrder.includes(Source.SECRETS)) {
        _secrets.delete(this)
        return
      }

      if (!options) {
        _secrets.delete(this)
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
          defaults: utils.changeCase(obj),
        })
      )
    }

    set defaults(values = {}) {
      const { env, file } = this
      const decomposed = decomposeDefaults(values)
      const defaults = utils.changeCase(decomposed.defaults)
      const coercion = utils.changeCase(decomposed.coercion)

      _conf.set(
        this,
        new utils.Config({
          defaults,
        })
      )
      _coercion.set(this, coercion)
      _confEnv.set(
        this,
        this.resolutionOrder.includes(Source.ENV)
          ? new utils.Config({
              env,
            })
          : undefined
      )
      _confFile.set(
        this,
        this.resolutionOrder.includes(Source.FILE)
          ? new utils.Config({
              file,
            })
          : undefined
      )
    }

    get(value) {
      const { mergeDeep, changeCase, identifier, copy, isObject } = utils

      const key = value
        .split(':')
        .map((part) => identifier(part))
        .join('.')

      const _s = _secrets.get(this)
      const _e = _confEnv.get(this)
      const _f = _confFile.get(this)
      const _d = _conf.get(this)
      const _c = _coercion.get(this)

      const [env, file, defaults, secrets] = [
        _e && _e.get ? _e.get(key) : undefined,
        _f && _f.get ? _f.get(key) : undefined,
        _d && _d.get ? _d.get(key) : undefined,
        _s && _s.get ? _s.get(key) : undefined,
      ]

      const merged = this.resolutionOrder.reduce((result, source) => {
        switch (source) {
          case Source.ENV:
            return mergeDeep(result, copy(env))
          case Source.FILE:
            return mergeDeep(result, copy(file))
          case Source.SECRETS:
            return mergeDeep(result, copy(secrets))
        }
      }, copy(defaults))

      const out = changeCase(merged, 'camel')

      const cast = utils.type.cast(
        out,
        changeCase(getCoercion(_c, key), 'camel')
      )

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

createConfig.Source = Source
createConfig.passthrough = passthrough

module.exports = createConfig
