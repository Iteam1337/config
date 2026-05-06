const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

describe('resolutionOrder', () => {
  const file = `${process.cwd()}/test/configs/order.json`
  const secrets = {
    dir: `${process.cwd()}/test/secrets`,
  }

  afterEach(() => {
    delete process.env.GRAPHQL_PLAYGROUND
  })

  it('keeps the existing default resolution order', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'

    const config = conf({
      file: { file },
      defaults: {
        graphqlPlayground: 'foo',
      },
      secrets,
    })

    expect(config.get('graphqlPlayground')).to.eql('secret')
  })

  it('allows overriding the resolution order', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'

    const config = conf({
      file: { file },
      defaults: {
        graphqlPlayground: 'foo',
      },
      resolutionOrder: [conf.Source.FILE, conf.Source.ENV],
    })

    expect(config.get('graphqlPlayground')).to.eql('bar')
  })

  it('allows excluding a source from resolution', () => {
    process.env.GRAPHQL_PLAYGROUND = 'bar'

    const config = conf({
      file: { file },
      defaults: {
        graphqlPlayground: 'foo',
      },
      resolutionOrder: [conf.Source.ENV],
    })

    expect(config.get('graphqlPlayground')).to.eql('bar')
  })

  it('exposes the available resolution sources', () => {
    expect(conf.Source).to.eql({
      ENV: 'env',
      FILE: 'file',
      SECRETS: 'secrets',
    })
  })

  it('throws on unknown resolution sources', () => {
    expect(() => {
      conf({
        defaults: {},
        resolutionOrder: ['wat'],
      })
    }).to.throw(TypeError, 'Unknown resolution source')
  })

  it('throws on duplicate resolution sources', () => {
    expect(() => {
      conf({
        defaults: {},
        resolutionOrder: ['env', 'env'],
      })
    }).to.throw(TypeError, 'duplicate')
  })
})
