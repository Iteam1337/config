const { expect } = require('chai')

const file = `${process.cwd()}/test/src/config.json`
const nconf = require(`${process.cwd()}/src`)

describe('real-usecase', () => {
  let options

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
  })

  it('handles env on nested', () => {
    process.env.CAMEL_CASED__FOO = 'hello'
    const config = nconf(options)

    config.defaults = {
      camelCased: {
        baseUrl: 'http://localhost:6666',
        registerRoute: '/create-account',
        resetPasswordRoute: '/reset-password'
      }
    }

    expect(config.get('camelCased')).to.eql({
      baseUrl: 'http://localhost:4000',
      registerRoute: '/create-account',
      resetPasswordRoute: '/reset-password',
      foo: 'hello'
    })
  })
})
