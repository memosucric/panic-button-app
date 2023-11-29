export const neutralizeBack = (callback: () => void) => {
  window.history.pushState(null, '', window.location.href)
  window.onpopstate = () => {
    window.history.pushState(null, '', window.location.href)
    callback()
  }
}

export const revivalBack = () => {
  // @ts-expect-error Need to be undefined to remove event listener
  window.onpopstate = undefined
  window.history.back()
}
