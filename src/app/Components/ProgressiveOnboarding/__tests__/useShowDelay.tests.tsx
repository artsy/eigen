import { act, renderHook } from "@testing-library/react-native"
import { useShowDelay } from "app/Components/ProgressiveOnboarding/useShowDelay"

// This hook is globally mocked in setupJest so that other tests assert gating rather
// than timing. Here we want the real thing.
jest.unmock("app/Components/ProgressiveOnboarding/useShowDelay")

describe("useShowDelay", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it("shows only after the delay", () => {
    const { result } = renderHook(() => useShowDelay(() => true, 500))

    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe(true)
  })

  it("re-checks the predicate when the timer fires, rather than using the captured value", () => {
    let shouldShow = true
    const { result, rerender } = renderHook(() => useShowDelay(() => shouldShow, 500))

    // The condition stops holding during the delay — this is the navigate-away case.
    shouldShow = false
    rerender({})

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe(false)
  })

  it("hides immediately, without delay", () => {
    let shouldShow = true
    const { result, rerender } = renderHook(() => useShowDelay(() => shouldShow, 500))

    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe(true)

    shouldShow = false
    rerender({})

    expect(result.current).toBe(false)
  })
})
