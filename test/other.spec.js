const { expect } = require('chai')

const file = `${process.cwd()}/test/configs/other.json`
const conf = require(`${process.cwd()}/src`)
const secrets = `${process.cwd()}/test/secrets/other`

const genConfig = () =>
  conf({
    file,
    secrets,
    defaults: {
      elastic: {
        from: 'https://elasticsearch.com',
        to: 'http://localhost:9200',
        indices: {
          nav: {
            from: 'structure_2019-04-09_08-10-38',
            to: {
              alias: 'structure',
              index: 'structure_2019-04-09_08-10-38'
            }
          },
          content: {
            from: 'content_2019-04-09_08-10-38',
            to: {
              alias: 'content',
              index: 'content_2019-04-09_08-10-38'
            }
          }
        },
        types: ['analyzer', 'mapping', 'data'],
        take: 20,
        indexExports: ['structure', 'content'],
        navigation: 'structure'
      },
      redis: {
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        password: '',
        db: 0
      },
      express: {
        port: 1025,
        hostname: ''
      },
      server: {
        uploadLimit: '100mb'
      },
      removePreviousImports: false,
      postgres: {
        user: 'user',
        password: 'password',
        database: 'ebre',
        host: 'localhost',
        port: 5432,
        timeout: 30000
      },
      xmlPaths: [''],
      elasticsearch: {
        host: 'localhost:9200',
        log: 'error'
      }
    }
  })

describe('other', () => {
  describe('expected config', () => {
    it('should print the expected config (elastic)', () => {
      process.env.ELASTIC__TAKE = '40'

      expect(genConfig().get('elastic')).to.eql({
        from: 'http://from_config.com',
        to: 'http://from_config.se',
        indices: {
          nav: {
            from: 'from_value',
            to: {
              alias: 'to_alias',
              index: 'to_index'
            }
          },
          content: {
            from: 'from_value',
            to: {
              alias: 'to_alias',
              index: 'to_index'
            }
          }
        },
        take: 40,
        indexExports: ['first_index', 'second_index'],
        navigation: 'some_navigation',
        types: ['analyzer', 'mapping', 'data']
      })

      delete process.env.ELASTIC__TAKE
    })

    it('should print the expected config (redis)', () => {
      process.env.REDIS__DB = '40'
      process.env.REDIS__PASSWORD = 'some password'

      expect(genConfig().get('redis')).to.eql({
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        password: 'some password',
        db: 40
      })

      delete process.env.REDIS__DB
      delete process.env.REDIS__PASSWORD
    })

    it('should print the expected config (express)', () => {
      process.env.EXPRESS__HOSTNAME = 'from_env'

      expect(genConfig().get('express')).to.eql({
        port: 1433,
        hostname: 'from_env'
      })

      delete process.env.EXPRESS__HOSTNAME
    })

    it('should print the expected config (server)', () => {
      expect(genConfig().get('server')).to.eql({
        uploadLimit: '250mb'
      })
    })

    it('should print the expected config (postgres)', () => {
      process.env.POSTGRES__PASSWORD = 'secret'
      expect(genConfig().get('postgres')).to.eql({
        database: 'prod',
        host: 'localhost',
        password: 'supersecret', // from secret
        port: 6543,
        timeout: 30000,
        user: 'master'
      })

      delete process.env.POSTGRES__PASSWORD
    })

    it('should print the expected config (xmlPaths)', () => {
      expect(genConfig().get('xmlPaths')).to.eql([
        '/home/user/Documents/file.xml',
        '/home/user/Documents/file_number_two.xml'
      ])
    })

    it('should print the expected config (elasticsearch)', () => {
      process.env.elasticsearch__log = 'debug'
      expect(genConfig().get('elasticsearch')).to.eql({
        host: 'localhost:9200',
        log: 'debug'
      })
    })
  })
})
