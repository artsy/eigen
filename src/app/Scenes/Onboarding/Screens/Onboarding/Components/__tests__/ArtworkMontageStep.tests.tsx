import { act, screen } from "@testing-library/react-native"
import {
  ArtworkMontageStep,
  REDUCE_MOTION_CHECK_TIMEOUT,
} from "app/Scenes/Onboarding/Screens/Onboarding/Components/ArtworkMontageStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { AccessibilityInfo, Image } from "react-native"

// Flushes the pending `AccessibilityInfo.isReduceMotionEnabled()` microtask, which in turn
// triggers the effect that either starts the montage timer or fires `onNext` immediately.
const flushReduceMotionCheck = () => act(async () => await Promise.resolve())

describe("ArtworkMontageStep", () => {
  let isReduceMotionEnabledMock: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    isReduceMotionEnabledMock = jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    isReduceMotionEnabledMock.mockResolvedValue(false)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders all 5 onboarding images", async () => {
    renderWithWrappers(<ArtworkMontageStep onNext={jest.fn()} />)
    await flushReduceMotionCheck()

    const images = screen.UNSAFE_getAllByType(Image)
    expect(images).toHaveLength(5)
  })

  it("calls onNext once the montage duration elapses", async () => {
    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).not.toHaveBeenCalled()

    act(() => {
      jest.runAllTimers()
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("clears the timer on unmount and does not call onNext afterward", async () => {
    const onNext = jest.fn()
    const { unmount } = renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    unmount()

    act(() => {
      jest.runAllTimers()
    })

    expect(onNext).not.toHaveBeenCalled()
  })

  it("skips the montage and calls onNext immediately when Reduce Motion is enabled", async () => {
    isReduceMotionEnabledMock.mockResolvedValue(true)

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(screen.UNSAFE_queryAllByType(Image)).toHaveLength(0)
  })

  it("advances if the Reduce Motion check never settles, via the check's own timeout", async () => {
    isReduceMotionEnabledMock.mockReturnValue(new Promise(() => {}))

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    await act(async () => {
      jest.advanceTimersByTime(REDUCE_MOTION_CHECK_TIMEOUT)
      await Promise.resolve()
    })

    expect(onNext).not.toHaveBeenCalled()
    expect(screen.UNSAFE_getAllByType(Image)).toHaveLength(5)

    act(() => {
      jest.runAllTimers()
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("falls back to showing the montage when the Reduce Motion check rejects", async () => {
    isReduceMotionEnabledMock.mockRejectedValue(new Error("unavailable"))

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(screen.UNSAFE_getAllByType(Image)).toHaveLength(5)

    act(() => {
      jest.runAllTimers()
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
