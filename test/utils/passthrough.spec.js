const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

describe('passthrough', () => {
  const file = `${process.cwd()}/test/configs/passthrough.json`
  const secrets = `${process.cwd()}/test/secrets/passthrough`

  afterEach(() => {
    delete process.env.LOGGING__CONFIG__ENABLED
    delete process.env.LOGGING__CONFIG__ADAPTER__RETRY_COUNT
    delete process.env.LOGGING__CONFIG__EXTRA
    delete process.env.LOGGING__CONFIG__ADAPTER__MODE
    delete process.env.LOGGING__CONFIG__SOME_KEY__NESTED_NUMBER
    delete process.env.LOGGING__CONFIG__SOME_KEY__NESTED_BOOLEAN
    delete process.env.LOGGING__CONFIG__SOME_KEY__EXTRA_LEAF
  })

  it('exposes the passthrough helper', () => {
    expect(conf.passthrough).to.be.a('function')
  })

  it('uses passthrough defaults as fallback values', () => {
    const config = conf({
      defaults: {
        logging: {
          config: conf.passthrough({
            enabled: true,
          }),
        },
      },
    })

    expect(config.get('logging:config')).to.eql({
      enabled: true,
    })
  })

  it('does not cast environment values below a passthrough branch', () => {
    process.env.LOGGING__CONFIG__ENABLED = 'false'
    process.env.LOGGING__CONFIG__ADAPTER__RETRY_COUNT = '5'

    const config = conf({
      defaults: {
        logging: {
          config: conf.passthrough({
            enabled: true,
          }),
        },
      },
    })

    expect(config.get('logging:config')).to.eql({
      enabled: 'false',
      adapter: {
        retryCount: '5',
      },
    })
    expect(config.get('logging:config:enabled')).to.eql('false')
    expect(config.get('logging:config:adapter:retryCount')).to.eql('5')
  })

  it('does not cast config-file values below a passthrough branch', () => {
    const config = conf({
      file,
      defaults: {
        logging: {
          config: conf.passthrough({
            enabled: true,
          }),
        },
      },
    })

    expect(config.get('logging:config')).to.eql({
      enabled: 'false',
      adapter: {
        retryCount: '5',
      },
    })
  })

  it('does not cast secret values below a passthrough branch', () => {
    const config = conf({
      secrets,
      defaults: {
        logging: {
          config: conf.passthrough({
            enabled: true,
          }),
        },
      },
    })

    expect(config.get('logging:config')).to.eql({
      enabled: 'false',
      adapter: {
        retryCount: '5',
      },
    })
  })

  it('merges and overrides passthrough values using custom resolution order', () => {
    process.env.LOGGING__CONFIG__ENABLED = 'from-env'
    process.env.LOGGING__CONFIG__ADAPTER__RETRY_COUNT = '7'
    process.env.LOGGING__CONFIG__EXTRA = 'top-level'
    process.env.LOGGING__CONFIG__ADAPTER__MODE = 'active'

    const config = conf({
      file,
      defaults: {
        logging: {
          config: conf.passthrough({
            enabled: true,
          }),
        },
      },
      resolutionOrder: [conf.Source.FILE, conf.Source.ENV],
    })

    expect(config.get('logging:config')).to.eql({
      enabled: 'from-env',
      adapter: {
        retryCount: '7',
        mode: 'active',
      },
      extra: 'top-level',
    })
    expect(config.get('logging:config:enabled')).to.eql('from-env')
    expect(config.get('logging:config:extra')).to.eql('top-level')
    expect(config.get('logging:config:adapter')).to.eql({
      retryCount: '7',
      mode: 'active',
    })
    expect(config.get('logging:config:adapter:retryCount')).to.eql('7')
    expect(config.get('logging:config:adapter:mode')).to.eql('active')
  })

  it('keeps nested default objects inside passthrough branches freeform', () => {
    process.env.LOGGING__CONFIG__SOME_KEY__NESTED_NUMBER = '5'
    process.env.LOGGING__CONFIG__SOME_KEY__NESTED_BOOLEAN = 'false'
    process.env.LOGGING__CONFIG__SOME_KEY__EXTRA_LEAF = 'hello'

    const config = conf({
      defaults: {
        logging: {
          config: conf.passthrough({
            someKey: {
              nestedNumber: 1,
              nestedBoolean: true,
            },
          }),
        },
      },
    })

    expect(config.get('logging:config')).to.eql({
      someKey: {
        nestedNumber: '5',
        nestedBoolean: 'false',
        extraLeaf: 'hello',
      },
    })
    expect(config.get('logging:config:someKey')).to.eql({
      nestedNumber: '5',
      nestedBoolean: 'false',
      extraLeaf: 'hello',
    })
    expect(config.get('logging:config:someKey:nestedNumber')).to.eql('5')
    expect(config.get('logging:config:someKey:nestedBoolean')).to.eql('false')
    expect(config.get('logging:config:someKey:extraLeaf')).to.eql('hello')
  })
})
