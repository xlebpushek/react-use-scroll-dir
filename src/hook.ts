import { useEffect, useState } from 'react'
import { addScrollListener, getScrollLeft, getScrollTop, isBrowser, removeScrollListener } from './utils'

export type ScrollDir = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

export function useScrollDir(target?: HTMLElement) {
  const [targetFromProps, setTargetFromProps] = useState<HTMLElement | undefined>()
  const [lastScrollDir, setLastScrollDir] = useState<ScrollDir | null>(null)
  const [scrollDir, setScrollDir] = useState<ScrollDir | null>(null)

  useEffect(() => setTargetFromProps(target), [target])

  const isScrolling = scrollDir !== null
  const isScrollingY = scrollDir === 'UP' || scrollDir === 'DOWN'
  const isScrollingX = scrollDir === 'LEFT' || scrollDir === 'RIGHT'
  const isScrollingUp = scrollDir === 'UP'
  const isScrollingLeft = scrollDir === 'LEFT'
  const isScrollingDown = scrollDir === 'DOWN'
  const isScrollingRight = scrollDir === 'RIGHT'

  useEffect(() => {
    if (isBrowser()) {
      let scrollTimeout: number

      let lastScrollTop = getScrollTop(targetFromProps)
      let lastScrollLeft = getScrollLeft(targetFromProps)

      const handleScroll = () => {
        window.clearTimeout(scrollTimeout)

        scrollTimeout = window.setTimeout(() => {
          setScrollDir(null)
        }, 100)

        const scrollTop = getScrollTop(targetFromProps)
        if (scrollTop < lastScrollTop) {
          setLastScrollDir('UP')
          setScrollDir('UP')
        } else if (scrollTop > lastScrollTop) {
          setLastScrollDir('DOWN')
          setScrollDir('DOWN')
        }

        lastScrollTop = scrollTop

        const scrollLeft = getScrollLeft(targetFromProps)
        if (scrollLeft < lastScrollLeft) {
          setLastScrollDir('LEFT')
          setScrollDir('LEFT')
        } else if (scrollLeft > lastScrollLeft) {
          setLastScrollDir('RIGHT')
          setScrollDir('RIGHT')
        }

        lastScrollLeft = scrollLeft
      }

      addScrollListener(handleScroll, targetFromProps)

      return () => removeScrollListener(handleScroll, targetFromProps)
    }

    return undefined
  }, [targetFromProps])

  return {
    lastScrollDir,
    scrollDir,
    isScrolling,
    isScrollingY,
    isScrollingX,
    isScrollingUp,
    isScrollingLeft,
    isScrollingDown,
    isScrollingRight,
  }
}
