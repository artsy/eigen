import { act, renderHook } from "@testing-library/react-native"
import { useSaveFlightPhase } from "app/Scenes/InfiniteDiscovery/hooks/useSaveFlightPhase"

const POP_IN_DURATION = 100
const FLIGHT_DURATION = 200
const FADE_OUT_DURATION = 50

describe("useSaveFlightPhase", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderPhase = async (onComplete: () => void) =>
    await renderHook(() =>
      useSaveFlightPhase({
        popInDuration: POP_IN_DURATION,
        flightDuration: FLIGHT_DURATION,
        fadeOutDuration: FADE_OUT_DURATION,
        onComplete,
      })
    )

  it("starts in the pop_in phase", async () => {
    const { result } = await renderPhase(jest.fn())

    expect(result.current).toBe("pop_in")
  })

  it("advances to flight after popInDuration", async () => {
    const { result } = await renderPhase(jest.fn())

    await act(() => jest.advanceTimersByTime(POP_IN_DURATION))

    expect(result.current).toBe("flight")
  })

  it("advances to fade_out after flightDuration", async () => {
    const { result } = await renderPhase(jest.fn())

    await act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    await act(() => jest.advanceTimersByTime(FLIGHT_DURATION))

    expect(result.current).toBe("fade_out")
  })

  it("calls onComplete after fadeOutDuration, and not before", async () => {
    const onComplete = jest.fn()
    await renderPhase(onComplete)

    await act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    await act(() => jest.advanceTimersByTime(FLIGHT_DURATION))
    expect(onComplete).not.toHaveBeenCalled()

    await act(() => jest.advanceTimersByTime(FADE_OUT_DURATION))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("calls the latest onComplete even if it changes mid-sequence", async () => {
    const staleOnComplete = jest.fn()
    const freshOnComplete = jest.fn()

    const { rerender } = await renderHook(
      ({ onComplete }: { onComplete: () => void }) =>
        useSaveFlightPhase({
          popInDuration: POP_IN_DURATION,
          flightDuration: FLIGHT_DURATION,
          fadeOutDuration: FADE_OUT_DURATION,
          onComplete,
        }),
      { initialProps: { onComplete: staleOnComplete } }
    )

    await act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    await rerender({ onComplete: freshOnComplete })
    await act(() => jest.advanceTimersByTime(FLIGHT_DURATION))
    await act(() => jest.advanceTimersByTime(FADE_OUT_DURATION))

    expect(staleOnComplete).not.toHaveBeenCalled()
    expect(freshOnComplete).toHaveBeenCalledTimes(1)
  })
})
