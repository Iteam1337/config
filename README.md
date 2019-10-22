# Config

[![npm version](https://badge.fury.io/js/%40iteam%2Fconfig.svg)](https://badge.fury.io/js/%40iteam%2Fconfig)

This is useful when environment variables need to be nested and still be camel cased.
The order of how the config is transformed is:

1. Defaults
1. Environment
1. Config file
1. Secrets

That means that `environment variables` will override `defaults`, <br/>
and the `config file` will override `environment variables` and so on.

Properties defined in defaults will _almost always_ be returned, but overridden.

For example:
```javascript
  defaults: {
    foo: {
      bar: 'baz',
    }
  }

// application started with:
// FOO__SOMETHING=else npm start

console.log(config.get('foo')) // > { bar: 'baz', something: 'else' }
console.log(config.get('foo:bar')) // > 'baz'
console.log(config.get('foo:something')) // > 'else'
```

Types defined in `defaults` will be applied to overridden values:

```json
// contents of config.json
{
  "another": [{
    "key": "not hello",
    "value": "2",
  }]
}
```

```javascript
const options = {
  file: `${__dirname}/../config.json`,
  defaults: {
    some: {
      nested: {
        array: [ 1, 2, 3 ],
      }
    },
    booleanValues: {
      zero: false,
      one: true
    },
    another: [{
      key: 'hello',
      value: 1,
    }],
  }
}

// ...

// application started with:
// SOME__NESTED__ARRAY="4,5,6" BOOLEAN_VALUES__ZERO="true" BOOLEAN_VALUES__ONE="0"
config.get('some') // > { nested: { array: [ 4, 5, 6 ] } }
config.get('some:nested') // > { array: [ 4, 5, 6 ] }
config.get('some:nested:array') // > [ 4, 5, 6 ]
config.get('booleanValues') // { zero: true, one: false }
config.get('booleanValues:zero') // true
config.get('booleanValues:one') // false
config.get('another') // [{ key: 'not hello', value: 2 }]
```


**The casing is always ignored** *as an input*, but the values fetched will always be camel-cased.

For example (starting application in **shell**):

```sh
SOME__NESTED__CONFIG__IN_CAMEL_CASE=ok \
some__nested__secondValue=bar \
npm start # or whichever entrypoint
```

... will be be transformed into (result in **javascript**):

```javascript
{
  some: {
    nested: {
      config: {
        inCamelCase: 'ok',
      },
      secondValue: 'bar',
    }
  }
}
```

## Simple usage
```javascript
const config = require('@iteam/config')({
  file: `${__dirname}/../config.json`,
  defaults: {
    foo: {
      bar: 'baz',
    },
    baz: [ 1, 2, 3 ],
  }
})

// `config` also has a _getter_ for `defaults`
// this will override the previous defaults
config.defaults = { foo: { bar: 'baz' }, baz: [ 1, 2, 3 ] }

console.log(config.get('foo')) // > { bar: 'baz' }
console.log(config.get('foo:bar')) // > 'baz'
console.log(config.get('baz')) // > [ 1, 2, 3 ]
```

**defaults can be passed to the initial function call**

```javascript
const config = require('@iteam/config')({
  defaults: {
    foo: {
      bar: 'bar'
    },
    baz: 'results'
  }
})
```

## "Secrets"

This module got extended with `docker-swarm` in mind, and their way of handling <br/> secrects (which is run-time mounted files).

There's an option for the config module to look into a directory and treat all <br/> files a key/value config.

For example:
The directory `/run/secrets` has these file in it:
```sh
some_nested__file
some_nested__other_file
```

When they are provided to the module they will be transformed as such:
```javascript
{
  someNested: {
    file: 'contents of "/run/secrets/some_nested__file"',
    otherFile: 'contents of "/run/secrets/some_nested__other_file"'
  }
}
```

To enable this, provide `secrets` as a argument when calling the module:

```javascript
const config = require('@iteam/config')({
  secrets: {
    dir: '/run/secrets/'
  }
})

// `config` also has a _getter_ for `secrets`:
config.secrets = {
  dir: '/run/secrets/'
}
```

## Arguments

- **defaults** takes an `object`
```typescript
{
  search: boolean // default: 'false'
  dir: string     // default: '../'
  file: string    // default: 'config.json'
}
```

- **secrets** takes an `object` or a `string`

  When providing a string, this should be the directory where secrets are stored. <br/> The options-objects takes two properties:
```typescript
{
  dir: string       // default: '/run/secrets/'
  separator: string // default: '__'
}
```

- **env** takes an `object`
```typescript
{
  separator: string // default: '__'
}
```

- **file** takes an `object` or a `string`

  When providing a string, this should point to the full location of the config-file, or the `dir` will be de default
```typescript
{
  search: boolean // default: false
  dir: string     // default: '../'
  file: string    // default: 'config.json'
}
```
