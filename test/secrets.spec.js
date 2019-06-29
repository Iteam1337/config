const { expect } = require('chai')

const file = `${process.cwd()}/test/configs/secrets.json`
const conf = require(`${process.cwd()}/src`)

describe('secrets', () => {
  let options
  let defaults

  beforeEach(() => {
    options = {
      file: {
        file
      },
      env: {
        separator: '__'
      }
    }

    defaults = {
      foo: {
        bar: 'defaults'
      }
    }
  })

  it('prints default value', () => {
    delete process.env.FOO__bar
    const config = conf({
      defaults
    })

    expect(config.get('foo')).to.eql({
      bar: 'defaults'
    })
  })

  it('prints config', () => {
    delete process.env.FOO__bar
    const config = conf({
      ...options,
      defaults
    })

    expect(config.get('foo')).to.eql({
      bar: 'config'
    })
  })

  it('prints env', () => {
    process.env.FOO__bar = 'env'

    const config = conf({ defaults })

    expect(config.get('foo')).to.eql({
      bar: 'env'
    })
  })

  it('prints secrets', () => {
    process.env.FOO__bar = 'env'

    const config = conf({
      ...options,
      defaults,
      secrets: {
        dir: `${process.cwd()}/test/secrets`
      }
    })

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when input is string)', () => {
    process.env.FOO__bar = 'env'

    const config = conf({
      ...options,
      secrets: `${process.cwd()}/test/secrets`,
      defaults
    })

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when read fron initial options)', () => {
    process.env.FOO__bar = 'env'

    const config = conf({
      ...options,
      defaults,
      secrets: {
        dir: `${process.cwd()}/test/secrets`
      }
    })

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('prints secrets (when read fron initial options (also, string))', () => {
    process.env.FOO__bar = 'env'

    const config = conf({
      ...options,
      secrets: `${process.cwd()}/test/secrets`,
      defaults
    })

    expect(config.get('foo')).to.eql({
      bar: 'secrets'
    })
  })

  it('handles camelcased keys', () => {
    process.env.HELLO_WORLD__cheese__a_key = 'env'

    const config = conf({
      ...options,
      secrets: `${process.cwd()}/test/secrets`,
      defaults
    })

    expect(config.get('helloWorld:cheese')).to.eql({
      aKey: '0000 1000 0100'
    })
  })
})
