import { renderHook } from "@testing-library/react-native"
import { useSafeTimeout } from "app/utils/hooks/useSafeTimeout"

describe("useSafeTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("fires the callback after the delay when still mounted", () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useSafeTimeout())

    result.current(fn, 100)
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("does not fire pending callbacks after unmount", () => {
    const fn = jest.fn()
    const { result, unmount } = renderHook(() => useSafeTimeout())

    result.current(fn, 100)
    unmount()
    jest.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()
  })
})
