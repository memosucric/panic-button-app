export const trimAll = (obj: any) => {
  Object.keys(obj as any).map((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim()
    } else {
      trimAll(obj[key])
    }
  })
}
