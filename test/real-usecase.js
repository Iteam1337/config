const chai = require('chai')
const { expect } = chai
chai.use(require('sinon-chai'))

const file = `${process.cwd()}/test/src/config.json`

describe('real-usecase', () => {
  let nconf
  let options

  beforeEach(() => {
    nconf = require('../index')
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

    config.defaults =   {
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
