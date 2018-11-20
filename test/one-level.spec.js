const { expect } = require('chai')

const file = `${process.cwd()}/test/src/one-level.json`
const nconf = require(`${process.cwd()}/src`)

describe('one-level', () => {
  let options

  beforeEach(() => {
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
