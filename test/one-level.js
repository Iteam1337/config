const chai = require('chai')
const { expect } = chai
const { stub } = require('sinon')
chai.use(require('sinon-chai'))

const file = `${process.cwd()}/test/src/one-level.json`

describe('one-level', () => {
  let nconf
  let options

  beforeEach(() => {
    nconf = require('../index')
    options = {
      env: {
        separator: '__',
        lowerCase: true,
        match: /^foo/
      },
      file,
      use: 'memory'
    }
  })

  it('works without calling "defaults" first', () => {
    expect(nconf(options).get('fooBar')).to.eql('foo_bar')
  })

  it('handles env on first level', () => {
    process.env.FOO_VALUE = 'hello'

    expect(nconf(options).get('fooValue')).to.eql('hello')
  })
})
