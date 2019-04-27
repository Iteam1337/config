declare namespace secrets {
  export function getAll({ dir, separator }: { dir?: string, separator?: string }): {
      [key: string]: string
    }

  export function get<T>(keys: string[] | string, obj: {
      [key: string]: any
    }): false | T
}

export = secrets
