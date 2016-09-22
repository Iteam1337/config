# nconf-camel-cased

This is useful for when the env-keys need to be nested and still camel cased.

For example (starting application in **shell**):

```sh
SOME__NESTED__CONFIG__IN_CAMEL_CASE=ok \
SOME__NESTED__SECOND_VALUE=bar \
node index
```

... will be be transformed into (result in **javascript**):

```javascript
{
  some: {
    nested: {
      config: {
        inCamelCase: 'ok',
      },
      secondValue: 'bar'
    }
  }
}
```

## Usage
```javascript
const config = require('nconf-camel-cased')({
  file: {
    dir: './'
  }
})

config.defaults = {
  foo: {
    bar: 'bar'
  },
  baz: 'results'
}

console.log(config.get('foo')) // > { bar: 'bar' }
```
