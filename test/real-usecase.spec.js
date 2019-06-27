const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

describe('real-usecase', () => {
  let options

  beforeEach(() => {
    options = {
      file: {
        file: `${process.cwd()}/test/src/config.json`
      },
      env: {
        separator: '__'
      }
    }
  })

  it('handles env on nested', () => {
    process.env.CAMEL_CASED__FOO = 'hello'
    const config = conf({
      ...options,
      defaults: {
        camelCased: {
          baseUrl: 'http://localhost:6666',
          registerRoute: '/create-account',
          resetPasswordRoute: '/reset-password'
        }
      }
    })

    expect(config.get('camelCased')).to.eql({
      baseUrl: 'http://localhost:4000',
      registerRoute: '/create-account',
      resetPasswordRoute: '/reset-password',
      foo: 'hello'
    })
  })
})
