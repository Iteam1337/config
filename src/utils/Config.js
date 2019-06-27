const fs = require('fs')
const path = require('path')
const dotProp = require('dot-prop')
const identifier = require('./identifier')
const changeCase = require('./changeCase')

const defaultEnv = () => ({
  separator: '__'
})

const defaultFile = () => ({
  search: false,
  dir: '../',
  file: 'config.json'
})

const optEnv = opt => {
  if (typeof opt !== 'object' || !Object.keys(opt).length) {
    opt = defaultEnv()
  }

  if (typeof opt.separator !== 'string') {
    opt.separator = defaultEnv().separator
  }

  return {
    separator: opt.separator
  }
}

const optFile = opt => {
  if (typeof opt !== 'object' || !Object.keys(opt).length) {
    opt = defaultFile()
  }

  if (typeof opt.file !== 'string') {
    opt.file = defaultFile().file
  }

  if (path.basename(opt.file) !== opt.file) {
    opt.dir = path.dirname(opt.file)
    opt.file = path.basename(opt.file)
  }

  if (typeof opt.dir !== 'string') {
    opt.dir = defaultFile().dir
  }

  if (!fs.existsSync(opt.dir)) {
    opt.dir = process.cwd()
  }

  if (typeof opt.search !== 'boolean') {
    opt.search = defaultFile().search
  }

  return {
    dir: opt.dir,
    file: opt.file,
    search: opt.search
  }
}

const processEnv = opt => {
  const env = {}

  for (const key of Object.keys(process.env)) {
    dotProp.set(
      env,
      key
        .split(opt.separator)
        .map(key => identifier(key))
        .join('.'),
      process.env[key]
    )
  }

  return env
}

const processFile = opt => {
  const parse = content => {
    try {
      const json = JSON.parse(content)
      return changeCase(json)
    } catch (_) {
      return {}
    }
  }

  const resolved = path.resolve(opt.dir, opt.file)
  if (!fs.existsSync(resolved)) {
    if (opt.search) {
      const found = traverse(opt.dir, path.basename(opt.file).toLowerCase())
      if (found) {
        return parse(found)
      }
    }
  } else {
    return parse(fs.readFileSync(resolved))
  }

  return {}
}

const traverse = (dir, filename) => {
  for (const file of fs.readdirSync(dir)) {
    const resolved = path.resolve(dir, file)
    if (file === 'node_modules') {
      continue
    }

    if (file.toLowerCase() === filename) {
      return file
    }

    let stat
    try {
      stat = fs.statSync(resolved)
    } catch (_) {
      continue
    }

    if (!stat.isDirectory()) {
      continue
    }

    const found = traverse(resolved, filename)
    if (found) {
      return found
    }
  }
}

module.exports = class Config {
  constructor ({ env, file, defaults } = {}) {
    const object = {}

    if (defaults) {
      this.defaults = defaults
      Object.assign(object, defaults)
    }

    if (env) {
      this.env = optEnv(env)
      Object.assign(object, processEnv(this.env))
    }

    if (file) {
      this.file = optFile(file)
      Object.assign(object, processFile(this.file))
    }

    this.object = object
  }

  get (key) {
    return dotProp.get(this.object, key)
  }
}
