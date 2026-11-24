import { renderHook } from "@testing-library/react-native"
import { useSafeTimeout } from "app/utils/hooks/useSafeTimeout"

describe("useSafeTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("fires the callback after the delay when still mounted", async () => {
    const fn = jest.fn()
    const { result } = await renderHook(() => useSafeTimeout())

    result.current(fn, 100)
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("does not fire pending callbacks after unmount", async () => {
    const fn = jest.fn()
    const { result, unmount } = await renderHook(() => useSafeTimeout())

    result.current(fn, 100)
    await unmount()
    jest.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()
  })
})
