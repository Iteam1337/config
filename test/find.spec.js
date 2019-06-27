const { expect } = require('chai')

const conf = require(`${process.cwd()}/src`)

describe('find', () => {
  let options

  beforeEach(() => {
    options = {
      file: {
        dir: `${process.cwd()}/test/find`,
        search: true
      }
    }
  })

  it('traverse directory and finds config', () => {
    expect(conf(options).get('hello')).to.eql('world')
  })
})
