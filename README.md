# config

This is useful for when the env-keys need to be nested and still camel cased.
For example:
`SOME__NESTED__CONFIG__IN_CAMEL_CASE=ok node index`
... will be be transformed into:
```
{
  some: {
    nested: {
      config: {
        inCamelCase: 'ok'
      }
    }
  }
}
```

Usage:
```
const config = require('INSERT_THIS_MODULE_NAME')({
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

console.log(config.get('foo'))

```
