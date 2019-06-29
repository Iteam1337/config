const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

afterEach(() => {
  delete process.env.TEST
})

describe('types', () => {
  it('handles strings', () => {
    process.env.TEST = '2'
    expect(conf({ defaults: { test: 'foo' } }).get('test')).to.eql('2')
  })

  it('handles numbers', () => {
    process.env.TEST = '2'
    expect(conf({ defaults: { test: 1 } }).get('test')).to.eql(2)
  })

  it('handles arrays', () => {
    process.env.TEST = 'foo,bar'
    expect(conf({ defaults: { test: ['hello'] } }).get('test')).to.eql([
      'foo',
      'bar'
    ])
  })

  it('handles nested arrays', () => {
    process.env.TEST = '3,4'
    expect(conf({ defaults: { test: [1, 2] } }).get('test')).to.eql([3, 4])
  })

  it('handles nested arrays, with array notation', () => {
    process.env.TEST = '[3,2]'
    expect(conf({ defaults: { test: [1, 2] } }).get('test')).to.eql([3, 2])
  })

  it('handles nested arrays with objects', () => {
    process.env.TEST = '{"foo":"baz"}'
    expect(conf({ defaults: { test: [{ foo: 'bar' }] } }).get('test')).to.eql([
      { foo: 'baz' }
    ])
  })

  it('handles nested arrays with objects, with array notation', () => {
    process.env.TEST = '[{"foo":"baz"},{"foo":1}]'
    expect(conf({ defaults: { test: [{ foo: 'bar' }] } }).get('test')).to.eql([
      { foo: 'baz' },
      { foo: '1' }
    ])
  })

  it('handles nested arrays with objects that are not equal', () => {
    process.env.TEST = '{"foo":"baz"},{"a":"b"}'
    expect(conf({ defaults: { test: [{ foo: 'bar' }] } }).get('test')).to.eql([
      { foo: 'baz' },
      { a: 'b' }
    ])
  })

  it('handles nested arrays with different content', () => {
    process.env.TEST = '1, {"foo":"baz"}'
    expect(
      conf({ defaults: { test: [0, { foo: 'bar' }] } }).get('test')
    ).to.eql([1, { foo: 'baz' }])
  })

  it('handles nested arrays with different content', () => {
    process.env.TEST = '1, {"foo":"baz"}'
    expect(
      conf({ defaults: { test: [0, { foo: 'bar' }] } }).get('test')
    ).to.eql([1, { foo: 'baz' }])
  })

  it('handles nested arrays using only defaults', () => {
    expect(
      conf({
        defaults: {
          hello: {
            world: [
              {
                input: 'foo',
                output: 0
              }
            ]
          }
        }
      }).get('hello')
    ).to.eql({
      world: [
        {
          input: 'foo',
          output: 0
        }
      ]
    })
  })

  it('handles types from config', () => {
    expect(
      conf({
        file: `${process.cwd()}/test/configs/types.json`,
        defaults: {
          hello: {
            world: [
              {
                input: 'foo',
                output: 0
              }
            ]
          }
        }
      }).get('hello')
    ).to.eql({
      world: [
        {
          input: 'hey',
          output: 1
        }
      ]
    })
  })
})
