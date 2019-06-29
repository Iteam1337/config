const { expect } = require('chai')

const file = `${process.cwd()}/test/configs/one-level.json`
const conf = require(`${process.cwd()}/src`)

describe('one-level', () => {
  let options

  beforeEach(() => {
    options = {
      env: {
        separator: '__'
      },
      file
    }
  })

  it('works without calling "defaults" first', () => {
    expect(conf(options).get('fooBar')).to.eql('foo_bar')
  })

  it('handles env on first level', () => {
    process.env.FOO_VALUE = 'hello'

    expect(conf(options).get('fooValue')).to.eql('hello')
    delete process.env.FOO_VALUE
  })

  it('does not care about caseing', () => {
    process.env.barBaz = 'barBaz'

    expect(conf(options).get('bar_baz')).to.eql('barBaz')
    delete process.env.barBaz
  })
})
