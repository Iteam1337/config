const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

describe('order', () => {
  const file = `${process.cwd()}/test/configs/order.json`

  it('prints default (foo)', () => {
    delete process.env.GRAPHQL_PLAYGROUND
    const config = conf({
      defaults: {
        graphqlPlayground: 'foo'
      }
    })

    expect(config.get('graphql_Playground')).to.eql('foo')
  })

  it('prints process.env (bar)', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'
    const config = conf({
      defaults: {
        graphqlPlayground: 'foo'
      }
    })

    expect(config.get('graphqlPlayground')).to.eql('bar')
  })

  it('prints config (baz)', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'
    const config = conf({
      file: { file },
      defaults: {
        graphqlPlayground: 'foo'
      }
    })

    config.defaults = expect(config.get('graphqlPlayground')).to.eql('baz')
  })

  it('prints secret (secret)', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'
    const config = conf({
      file: { file },
      defaults: {
        graphqlPlayground: 'foo'
      },
      secrets: {
        dir: `${process.cwd()}/test/secrets`
      }
    })

    expect(config.get('graphqlPlayground')).to.eql('secret')
  })
})
