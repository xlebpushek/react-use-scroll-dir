import { RenderHookResult, act, renderHook } from '@testing-library/react'
import { useScrollDir } from '../src/hook'
import { addScrollListener, getScrollLeft, getScrollTop, isBrowser, removeScrollListener } from '../src/utils'

jest.mock('../src/utils', () => ({
  isBrowser: jest.fn(() => true),
  getScrollTop: jest.fn(() => 0),
  getScrollLeft: jest.fn(() => 0),
  addScrollListener: jest.fn(),
  removeScrollListener: jest.fn(),
}))

function mockIsBrowser(result = true) {
  ;(isBrowser as jest.Mock).mockReturnValue(result)
}

function mockGetScrollTop(value: number) {
  ;(getScrollTop as jest.Mock).mockReturnValue(value)
}

function mockGetScrollLeft(value: number) {
  ;(getScrollLeft as jest.Mock).mockReturnValue(value)
}

function mockListener(fn: jest.Mock) {
  const api = {
    listener: () => null,
  }

  fn.mockImplementation((listener) => {
    api.listener = listener
  })

  return api
}

function mockAddScrollListener() {
  return mockListener(addScrollListener as jest.Mock)
}

function mockRemoveScrollListener() {
  return mockListener(removeScrollListener as jest.Mock)
}

interface MockScenarioProps {
  target?: HTMLElement
  isBrowser?: boolean
  scrollTopBefore?: number
  scrollTopAfter?: number
  scrollLeftBefore?: number
  scrollLeftAfter?: number
}

function mockScenario({
  target,
  isBrowser = true,
  scrollTopBefore = 0,
  scrollTopAfter = 0,
  scrollLeftBefore = 0,
  scrollLeftAfter = 0,
}: MockScenarioProps) {
  mockIsBrowser(isBrowser)
  mockGetScrollTop(scrollTopBefore)
  mockGetScrollLeft(scrollLeftBefore)
  mockRemoveScrollListener()

  const scrollListener = mockAddScrollListener()

  let hook: RenderHookResult<ReturnType<typeof useScrollDir>, HTMLElement | undefined>

  const scenario = {
    renderHook() {
      hook = renderHook(() => useScrollDir(target))

      return scenario
    },
    scrollEmulation() {
      mockGetScrollTop(scrollTopAfter)
      mockGetScrollLeft(scrollLeftAfter)

      act(() => {
        scrollListener.listener()
      })

      return scenario
    },
    rerender() {
      hook.rerender()

      return scenario
    },
    get result() {
      return hook!.result
    },
    unmount() {
      hook.unmount()

      return scenario
    },
    scrollListener,
  }

  return scenario
}

describe('Testing the hook useScrollDir', () => {
  describe('Target', () => {
    it('Without a target', () => {
      const { unmount, scrollListener } = mockScenario({
        scrollTopBefore: 0,
        scrollTopAfter: 1,
      })
        .renderHook()
        .scrollEmulation()

      expect(getScrollTop).toHaveBeenCalledWith(undefined)
      expect(addScrollListener).toHaveBeenCalledWith(scrollListener.listener, undefined)

      unmount()

      expect(removeScrollListener).toHaveBeenCalledWith(scrollListener.listener, undefined)
    })

    it('With a target', () => {
      const target = document.createElement('div')

      const { unmount, scrollListener } = mockScenario({
        target,
        scrollTopBefore: 0,
        scrollTopAfter: 1,
      })
        .renderHook()
        .scrollEmulation()

      expect(getScrollTop).toHaveBeenCalledWith(undefined)
      expect(addScrollListener).toHaveBeenCalledWith(scrollListener.listener, target)

      unmount()

      expect(removeScrollListener).toHaveBeenCalledWith(scrollListener.listener, target)
    })
  })

  describe('Environment', () => {
    it('Without browser', () => {
      const { result } = mockScenario({
        isBrowser: false,
        scrollTopBefore: 0,
        scrollTopAfter: 1,
      })
        .renderHook()
        .scrollEmulation()

      expect(result.current.lastScrollDir).toBe(null)
      expect(result.current.scrollDir).toBe(null)
      expect(result.current.isScrolling).toBe(false)
      expect(result.current.isScrollingY).toBe(false)
      expect(result.current.isScrollingX).toBe(false)
      expect(result.current.isScrollingUp).toBe(false)
      expect(result.current.isScrollingLeft).toBe(false)
      expect(result.current.isScrollingDown).toBe(false)
      expect(result.current.isScrollingRight).toBe(false)
    })
    describe('With browser', () => {
      it('Zeroing scrollDir', async () => {
        const { result } = mockScenario({
          scrollTopBefore: 1,
          scrollTopAfter: 0,
        })
          .renderHook()
          .scrollEmulation()

        expect(result.current.scrollDir).toBe('UP')

        await act(() => new Promise((resolve) => setTimeout(resolve, 150)))

        expect(result.current.scrollDir).toBe(null)
      })

      describe('Scroll dir', () => {
        it('Scrolling to the up', () => {
          const { result } = mockScenario({
            scrollTopBefore: 1,
            scrollTopAfter: 0,
          })
            .renderHook()
            .scrollEmulation()

          expect(result.current.lastScrollDir).toBe('UP')
          expect(result.current.scrollDir).toBe('UP')
          expect(result.current.isScrolling).toBe(true)
          expect(result.current.isScrollingY).toBe(true)
          expect(result.current.isScrollingX).toBe(false)
          expect(result.current.isScrollingUp).toBe(true)
          expect(result.current.isScrollingLeft).toBe(false)
          expect(result.current.isScrollingDown).toBe(false)
          expect(result.current.isScrollingRight).toBe(false)
        })

        it('Scrolling to the left', () => {
          const { result } = mockScenario({
            scrollLeftBefore: 1,
            scrollLeftAfter: 0,
          })
            .renderHook()
            .scrollEmulation()

          expect(result.current.lastScrollDir).toBe('LEFT')
          expect(result.current.scrollDir).toBe('LEFT')
          expect(result.current.isScrolling).toBe(true)
          expect(result.current.isScrollingY).toBe(false)
          expect(result.current.isScrollingX).toBe(true)
          expect(result.current.isScrollingUp).toBe(false)
          expect(result.current.isScrollingLeft).toBe(true)
          expect(result.current.isScrollingDown).toBe(false)
          expect(result.current.isScrollingRight).toBe(false)
        })

        it('Scrolling to the down', () => {
          const { result } = mockScenario({
            scrollTopBefore: 0,
            scrollTopAfter: 1,
          })
            .renderHook()
            .scrollEmulation()

          expect(result.current.lastScrollDir).toBe('DOWN')
          expect(result.current.scrollDir).toBe('DOWN')
          expect(result.current.isScrolling).toBe(true)
          expect(result.current.isScrollingY).toBe(true)
          expect(result.current.isScrollingX).toBe(false)
          expect(result.current.isScrollingUp).toBe(false)
          expect(result.current.isScrollingLeft).toBe(false)
          expect(result.current.isScrollingDown).toBe(true)
          expect(result.current.isScrollingRight).toBe(false)
        })

        it('Scrolling to the right', () => {
          const { result } = mockScenario({
            scrollLeftBefore: 0,
            scrollLeftAfter: 1,
          })
            .renderHook()
            .scrollEmulation()

          expect(result.current.lastScrollDir).toBe('RIGHT')
          expect(result.current.scrollDir).toBe('RIGHT')
          expect(result.current.isScrolling).toBe(true)
          expect(result.current.isScrollingY).toBe(false)
          expect(result.current.isScrollingX).toBe(true)
          expect(result.current.isScrollingUp).toBe(false)
          expect(result.current.isScrollingLeft).toBe(false)
          expect(result.current.isScrollingDown).toBe(false)
          expect(result.current.isScrollingRight).toBe(true)
        })
      })
    })
  })

  describe('Native functions', () => {
    it('Unmounting', () => {
      const { scrollListener } = mockScenario({}).renderHook().unmount()

      expect(removeScrollListener).toHaveBeenCalledWith(scrollListener.listener, undefined)
    })
  })
})
