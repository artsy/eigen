import { act, renderHook } from "@testing-library/react-native"
import {
  ANCHOR_SETTLE_INTERVAL_MS,
  useAnchorSettled,
} from "app/Components/ProgressiveOnboarding/useAnchorSettled"
import { View } from "react-native"

// This hook is globally mocked in setupJest so that other tests don't wait on
// measurements. Here we want the real thing.
jest.unmock("app/Components/ProgressiveOnboarding/useAnchorSettled")

/** An anchor whose on-screen position is whatever `position` says at measure time. */
const makeAnchor = (position: { x: number; y: number }) => {
  const measureInWindow = jest.fn((callback: (...args: number[]) => void) =>
    callback(position.x, position.y, 100, 40)
  )
  return {
    ref: { current: { measureInWindow } as unknown as View },
    measureInWindow,
  }
}

describe("useAnchorSettled", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it("settles once two measurements agree", () => {
    const { ref } = makeAnchor({ x: 0, y: 200 })
    const { result } = renderHook(() => useAnchorSettled(ref, true))

    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS)
    })

    expect(result.current).toBe(true)
  })

  it("waits while the anchor is still moving", () => {
    const position = { x: 0, y: 400 }
    const { ref } = makeAnchor(position)
    const { result } = renderHook(() => useAnchorSettled(ref, true))

    // Momentum scroll: the anchor keeps moving up between measurements.
    for (let i = 0; i < 3; i++) {
      position.y -= 50
      act(() => {
        jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS)
      })
      expect(result.current).toBe(false)
    }

    // Scroll comes to rest.
    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS)
    })

    expect(result.current).toBe(true)
  })

  it("keeps waiting for as long as the anchor keeps moving", () => {
    const position = { x: 0, y: 0 }
    const { ref } = makeAnchor(position)
    const { result } = renderHook(() => useAnchorSettled(ref, true))

    // Far longer than any popover's open watchdog: still nothing, because no Modal exists.
    for (let i = 0; i < 100; i++) {
      position.y += 10
      act(() => {
        jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS)
      })
    }

    expect(result.current).toBe(false)
  })

  it("waits while the anchor is off screen, and shows once it is scrolled back", () => {
    // Scrolled away above the viewport, and not moving.
    const position = { x: 0, y: -600 }
    const { ref } = makeAnchor(position)
    const { result } = renderHook(() => useAnchorSettled(ref, true))

    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS * 5)
    })
    expect(result.current).toBe(false)

    position.y = 200
    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS * 2)
    })
    expect(result.current).toBe(true)
  })

  it("hides immediately when no longer requested, and waits again next time", () => {
    const { ref, measureInWindow } = makeAnchor({ x: 0, y: 200 })
    const { result, rerender } = renderHook(
      ({ isRequested }: { isRequested: boolean }) => useAnchorSettled(ref, isRequested),
      { initialProps: { isRequested: true } }
    )

    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS)
    })
    expect(result.current).toBe(true)

    rerender({ isRequested: false })
    expect(result.current).toBe(false)

    measureInWindow.mockClear()
    rerender({ isRequested: true })
    expect(result.current).toBe(false)
    expect(measureInWindow).toHaveBeenCalledTimes(1)
  })

  it("never measures when not requested", () => {
    const { ref, measureInWindow } = makeAnchor({ x: 0, y: 0 })
    const { result } = renderHook(() => useAnchorSettled(ref, false))

    act(() => {
      jest.advanceTimersByTime(ANCHOR_SETTLE_INTERVAL_MS * 20)
    })

    expect(result.current).toBe(false)
    expect(measureInWindow).not.toHaveBeenCalled()
  })
})
