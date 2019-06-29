const { expect } = require('chai')

const file = `${process.cwd()}/test/configs/booleans.json`
const secrets = `${process.cwd()}/test/secrets/booleans`

const gen = require('./helper/generate')({
  root: false,
  rootCamel: false,
  nested: {
    boolean: true
  },
  deep: {
    nested: {
      boolean: false
    }
  },
  array: [false, true, true],
  nestedArray: {
    booleans: [true, false]
  }
})

describe('booleans', () => {
  it('works on root', () => {
    delete process.env.ROOT
    expect(gen().get('root'), 'default').to.eql(false)

    process.env.ROOT = 'true'
    expect(gen().get('root'), 'env').to.eql(true)

    delete process.env.ROOT

    expect(gen({ file }).get('root'), 'file').to.eql(true)

    expect(gen({ secrets }).get('root'), 'secrets').to.eql(true)
    expect(gen({ file, secrets }).get('root'), 'file+secrets').to.eql(true)
    delete process.env.ROOT
  })

  it('works on rootCamel', () => {
    delete process.env.ROOT_CAMEL
    expect(gen().get('rootCamel'), 'default').to.eql(false)

    process.env.ROOT_CAMEL = 'true'
    expect(gen().get('rootCamel'), 'env').to.eql(true)

    delete process.env.ROOT_CAMEL

    expect(gen({ file }).get('rootCamel'), 'file').to.eql(true)

    expect(gen({ secrets }).get('rootCamel'), 'secrets').to.eql(true)
    expect(gen({ file, secrets }).get('rootCamel'), 'file+secrets').to.eql(true)
    delete process.env.ROOT_CAMEL
  })

  it('works on nested', () => {
    delete process.env.NESTED__BOOLEAN

    expect(gen().get('nested'), 'default').to.eql({ boolean: true })
    expect(gen().get('nested:boolean'), 'default').to.eql(true)

    process.env.NESTED__BOOLEAN = 'false'
    expect(gen().get('nested'), 'env').to.eql({ boolean: false })
    expect(gen().get('nested:boolean'), 'env (1)').to.eql(false)

    delete process.env.NESTED__BOOLEAN

    expect(gen({ file }).get('nested'), 'file').to.eql({ boolean: false })
    expect(gen({ file }).get('nested:boolean'), 'file (1)').to.eql(false)

    expect(gen({ secrets }).get('nested'), 'secret').to.eql({ boolean: false })
    expect(gen({ secrets }).get('nested:boolean'), 'secret (1)').to.eql(false)

    expect(gen({ file, secrets }).get('nested'), 'file+secret').to.eql({
      boolean: false
    })
    expect(
      gen({ file, secrets }).get('nested:boolean'),
      'file+secret (1)'
    ).to.eql(false)
  })

  it('works on deep nested values', () => {
    delete process.env.DEEP__NESTED__BOOLEAN

    expect(gen().get('deep'), 'default').to.eql({ nested: { boolean: false } })
    expect(gen().get('deep:nested'), 'default (1)').to.eql({ boolean: false })
    expect(gen().get('deep:nested:boolean'), 'default (2)').to.eql(false)

    process.env.DEEP__NESTED__BOOLEAN = 'false'
    expect(gen().get('deep'), 'env').to.eql({ nested: { boolean: false } })
    expect(gen().get('deep:nested'), 'env (1)').to.eql({ boolean: false })
    expect(gen().get('deep:nested:boolean'), 'env (2)').to.eql(false)

    delete process.env.DEEP__NESTED__BOOLEAN

    expect(gen({ file }).get('deep'), 'file').to.eql({
      nested: { boolean: true }
    })
    expect(gen({ file }).get('deep:nested'), 'file (1)').to.eql({
      boolean: true
    })
    expect(gen({ file }).get('deep:nested:boolean'), 'file (2)').to.eql(true)

    expect(gen({ secrets }).get('deep'), 'secret').to.eql({
      nested: { boolean: true }
    })
    expect(gen({ secrets }).get('deep:nested'), 'secrets (1)').to.eql({
      boolean: true
    })
    expect(gen({ secrets }).get('deep:nested:boolean'), 'secrets (2)').to.eql(
      true
    )

    expect(gen({ file, secrets }).get('deep'), 'file+secret').to.eql({
      nested: { boolean: true }
    })
    expect(
      gen({ file, secrets }).get('deep:nested'),
      'file+secrets (1)'
    ).to.eql({ boolean: true })
    expect(
      gen({ file, secrets }).get('deep:nested:boolean'),
      'file+secrets (2)'
    ).to.eql(true)
    delete process.env.DEEP__NESTED__BOOLEAN
  })

  it('works on array values', () => {
    delete process.env.ARRAY

    expect(gen().get('array'), 'default').to.eql([false, true, true])

    process.env.ARRAY = '[false]'
    expect(gen().get('array'), 'env').to.eql([false])

    delete process.env.ARRAY

    expect(gen({ file }).get('array'), 'file').to.eql([true, false])

    expect(gen({ secrets }).get('array'), 'secret').to.eql([true, false, true])

    expect(gen({ file, secrets }).get('array'), 'file+secret').to.eql([
      true,
      false,
      true
    ])
    delete process.env.ARRAY
  })

  it('works on nested array values', () => {
    delete process.env.ARRAY

    expect(gen().get('nestedArray'), 'default').to.eql({
      booleans: [true, false]
    })
    expect(gen().get('nestedArray:booleans'), 'default (1)').to.eql([
      true,
      false
    ])

    process.env.ARRAY = '[false]'
    expect(gen().get('nestedArray'), 'env').to.eql({ booleans: [true, false] })
    expect(gen().get('nestedArray:booleans'), 'env (1)').to.eql([true, false])

    delete process.env.ARRAY
    expect(gen({ file }).get('nestedArray'), 'file').to.eql({
      booleans: [false, true]
    })
    expect(gen({ file }).get('nestedArray:booleans'), 'file (1)').to.eql([
      false,
      true
    ])

    expect(gen({ secrets }).get('nestedArray'), 'secret').to.eql({
      booleans: [false, true]
    })
    expect(gen({ secrets }).get('nestedArray:booleans'), 'secret (1)').to.eql([
      false,
      true
    ])

    expect(gen({ file, secrets }).get('nestedArray'), 'file+secret').to.eql({
      booleans: [false, true]
    })
    expect(
      gen({ file, secrets }).get('nestedArray:booleans'),
      'file+secret (1)'
    ).to.eql([false, true])
    delete process.env.ARRAY
  })
})
