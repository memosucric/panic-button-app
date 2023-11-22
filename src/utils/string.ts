export const trimAll = (obj: any) => {
  Object.keys(obj as any).map((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim()
    } else {
      trimAll(obj[key])
    }
  })
}

export const isObject = (value: any) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
