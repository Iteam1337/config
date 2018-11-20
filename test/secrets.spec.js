const { expect } = require('chai')

const file = `${process.cwd()}/test/src/secrets.json`
const nconf = require(`${process.cwd()}/src`)

describe('secrets', () => {
  let options
  let defaults

  beforeEach(() => {
    options = {
      file: {
        file,
        search: false
      },
      env: {
        separator: '__',
        lowerCase: true
      }
    }

    defaults = {
      foo: {
        bar: 'defaults'
      }
    }
  })

  it('prints default value', () => {
    const config = nconf({})
    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'defaults'
    })
  })

  it('prints config', () => {
    const config = nconf(options)
    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'config'
    })
  })

  it('prints env', () => {
    process.env.FOO__bar = 'env'

    const config = nconf({})
    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'env'
    })
  })

  it('prints secrets', () => {
    process.env.FOO__bar = 'env'

    const config = nconf(options)

    config.secrets = {
      dir: `${process.cwd()}/test/src/secrets`
    }

    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when input is string)', () => {
    process.env.FOO__bar = 'env'

    const config = nconf(options)

    config.secrets = `${process.cwd()}/test/src/secrets`
    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when read fron initial options)', () => {
    process.env.FOO__bar = 'env'

    options.secrets = {
      dir: `${process.cwd()}/test/src/secrets`
    }

    const config = nconf(options)

    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when read fron initial options (also, string))', () => {
    process.env.FOO__bar = 'env'

    options.secrets = `${process.cwd()}/test/src/secrets`

    const config = nconf(options)

    config.defaults = defaults

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('handles camelcased keys', () => {
    process.env.HELLO_WORLD__cheese__a_key = 'env'

    options.secrets = `${process.cwd()}/test/src/secrets`

    const config = nconf(options)

    config.defaults = defaults

    expect(config.get('helloWorld:cheese')).to.eql({
      aKey: '0000 1000 0100'
    })
  })
})
