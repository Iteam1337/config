declare interface Args {
  file?: string | {
    search?: boolean
    dir?: string
    file?: string
  }
  env?: {
    separator?: string
  }
  defaults?: {
    [key: string]: any
  }
  /**
   * Specify folder for where secrets are
   *
   * in the folder, the file-name will be converted to the
   * property and the content to the value.
   *
   * Example:
   * ---
   *
   * **dir**: /run/secrets
   *
   * **separator**: __
   *
   * In directory /run/secrets, the files
   *
   * [ `foo__bar`, `foo__baz` ] are found, and they will generate:
   ```json
{
  "foo": {
    "bar": "contents of 'foo__bar'-file",
    "baz": "contents of 'foo__baz'-file"
  }
}
```
  */
  secrets?: false | { dir?: string, separator?: string } | string
}

declare class Config {
  constructor (args?: Args)
  defaults?: {
    [key: string]: any
  }
  secrets?: Args['secrets']
  get: <T>(value: string) => T
}

/**
 * The order configurations handles are:
 *
 * - 0: defaults
 * - 1: environment variables
 * - 2: config file
 * - 3: secrets
 *
 * All configurations are saved and queried case-insensitive
 *
 * `foo_bar`, `fooBar`, `FOO_BAR` will be treated the same
 */
declare function conf(args?: Args): Config

export = conf
