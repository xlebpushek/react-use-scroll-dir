export function isBrowser() {
  return typeof window === 'object'
}

export function getScrollTop(target?: HTMLElement) {
  if (target) return target.scrollTop

  return window.scrollY || document.body.scrollTop || document.documentElement.scrollTop || 0
}

export function getScrollLeft(target?: HTMLElement) {
  if (target) return target.scrollLeft

  return window.scrollX || document.body.scrollLeft || document.documentElement.scrollLeft || 0
}

export function addScrollListener(
  listener: EventListenerOrEventListenerObject,
  target: HTMLElement | Document = document
) {
  return target.addEventListener('scroll', listener)
}

export function removeScrollListener(
  listener: EventListenerOrEventListenerObject,
  target: HTMLElement | Document = document
) {
  return target.removeEventListener('scroll', listener)
}
