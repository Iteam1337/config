# config

This is useful for when the environment-variables need to be nested and <br/> still be camel cased.

The order of how the config is beeing transformed is:

- 0: defaults
- 1: environment
- 2: config-file
- 3: secrets

So that means that `environment-variables` will override `defaults`, <br/>
and the `config-file` will override `environment-variables` and so on.

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
      secondValue: 'bar'
    }
  }
}
```

## simple usage
```javascript
const config = require('@iteam/config')({
  file: {
    dir: './'
  },
  defaults: {
    foo: {
      bar: 'bar'
    },
    baz: 'results'
  }
})

// `config` also has a _getter_ for `defaults`
// this will override the previous defaults
config.defaults = { foo: { bar: 'bar' }, baz: 'results' }

console.log(config.get('foo')) // > { bar: 'bar' }
```

**defaults can be passed to the initial function-call**

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

## "secrets"

This module got extended with `docker-swarm` in mind, and their way of handling <br/> secrects (which is run-time mounted files).

There's a option for the config-module to look into a directory and treat all <br/> files a key/value config.

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

# arguments:

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
