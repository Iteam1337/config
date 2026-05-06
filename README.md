# Config

[![](https://github.com/Iteam1337/config/workflows/Release/badge.svg)](https://github.com/Iteam1337/config/actions?workflow=Release)
[![npm version](https://badge.fury.io/js/%40iteam%2Fconfig.svg)](https://badge.fury.io/js/%40iteam%2Fconfig)

This is useful when environment variables need to be nested and still be camel cased.


## Documentation
Full documentation is found at [Iteam Config](https://iteam1337.github.io/#/config/examples)

## Installation
```
npm install @iteam/config
```

or use [`supreme`](https://github.com/Iteam1337/supreme) to install and set up config files automatically:

```
npx @iteam/supreme add config
```

## Simple usage

```javascript
const config = require('@iteam/config')({
  file: `${__dirname}/../config.json`,
  defaults: {
    foo: {
      bar: 'baz'
    },
    baz: [1, 2, 3]
  }
})

config.get('foo') // { bar: 'baz' }
config.get('foo:bar') // 'baz'
config.get('baz') // [ 1, 2, 3 ]
```

## Resolution order

By default, configuration is resolved in this order:

1. Defaults
2. Environment
3. Config file
4. Secrets

You can override the order of the optional sources with `resolutionOrder`.
`defaults` are always included first.

```javascript
const configPackage = require('@iteam/config')

const config = configPackage({
  file: `${__dirname}/../config.json`,
  defaults: {
    graphqlPlayground: false
  },
  resolutionOrder: [
    configPackage.Source.FILE,
    configPackage.Source.ENV
  ]
})
```

Leaving a source out excludes it from resolution.
