const { expect } = require('chai')

const file = `${process.cwd()}/test/src/nested.json`
const nconf = require(`${process.cwd()}/src`)

describe('nested', () => {
  let options

  beforeEach(() => {
    options = {
      file: {
        file,
        search: false
      },
      env: {
        separator: '__',
        lowerCase: true,
        match: /^bar/
      },
      use: 'memory'
    }
  })

  it('handles env on nested', () => {
    process.env.BAR_VALUE__BAZ__FOO = 'hello'

    expect(nconf(options).get('barValue:baz:foo')).to.eql('hello')
  })

  it('respects defaults', () => {
    process.env.BAR_BAR__BAZ__FOO = 'hello'
    expect(nconf(options).get('barBar')).to.eql({
      baz: {
        foo: 'hello',
        zzBar: 'bar_bar__baz__zz_bar'
      }
    })
  })
})
