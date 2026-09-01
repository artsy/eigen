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

  const renderPhase = (onComplete: () => void) =>
    renderHook(() =>
      useSaveFlightPhase({
        popInDuration: POP_IN_DURATION,
        flightDuration: FLIGHT_DURATION,
        fadeOutDuration: FADE_OUT_DURATION,
        onComplete,
      })
    )

  it("starts in the pop_in phase", () => {
    const { result } = renderPhase(jest.fn())

    expect(result.current).toBe("pop_in")
  })

  it("advances to flight after popInDuration", () => {
    const { result } = renderPhase(jest.fn())

    act(() => jest.advanceTimersByTime(POP_IN_DURATION))

    expect(result.current).toBe("flight")
  })

  it("advances to fade_out after flightDuration", () => {
    const { result } = renderPhase(jest.fn())

    act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    act(() => jest.advanceTimersByTime(FLIGHT_DURATION))

    expect(result.current).toBe("fade_out")
  })

  it("calls onComplete after fadeOutDuration, and not before", () => {
    const onComplete = jest.fn()
    renderPhase(onComplete)

    act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    act(() => jest.advanceTimersByTime(FLIGHT_DURATION))
    expect(onComplete).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(FADE_OUT_DURATION))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("calls the latest onComplete even if it changes mid-sequence", () => {
    const staleOnComplete = jest.fn()
    const freshOnComplete = jest.fn()

    const { rerender } = renderHook(
      ({ onComplete }: { onComplete: () => void }) =>
        useSaveFlightPhase({
          popInDuration: POP_IN_DURATION,
          flightDuration: FLIGHT_DURATION,
          fadeOutDuration: FADE_OUT_DURATION,
          onComplete,
        }),
      { initialProps: { onComplete: staleOnComplete } }
    )

    act(() => jest.advanceTimersByTime(POP_IN_DURATION))
    rerender({ onComplete: freshOnComplete })
    act(() => jest.advanceTimersByTime(FLIGHT_DURATION))
    act(() => jest.advanceTimersByTime(FADE_OUT_DURATION))

    expect(staleOnComplete).not.toHaveBeenCalled()
    expect(freshOnComplete).toHaveBeenCalledTimes(1)
  })
})
