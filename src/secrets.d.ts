function getAll({ dir, separator }: { dir:? string, separator:? string }): {
  [key: string]:? string
}

function get<T>(keys: string[] | string, obj: {
  [key: string]:? any
}): false | T

export = {
  getAll,
  get,
}
