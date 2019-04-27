interface Args {
  file?: {
    search?: boolean
    dir?: string
    file?: string
  }
  env?: {
    separator?: string
    lowerCase?: boolean
  }
  secrets?: false | { dir:? string, separator:? string } | string
}

class Config {
  static isObject (item: any): boolean
  static mergeDeep (target: any, source: any): any
  static changeCase (keys: any): any
  static nconfDefaults (env: Args.env, file: Args.file): any
  static file (): { search: true; dir: '../'; file: 'config.json' }
  static env (): { separator: '__'; lowerCase: true }
  static secrets (): { dir: '/run/secrets/'; separator: '__' }
  constructor (args?: Args)
  defaults?: {
    [key: string]: any
  }
  secrets?: Args.secrets
  get: <T>(value: string) => T
}

function nconf(args?: Args): Config

export = nconf
