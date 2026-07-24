import { act, screen } from "@testing-library/react-native"
import { ArtworkMontageStep } from "app/Scenes/Onboarding/Screens/Onboarding/Components/ArtworkMontageStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { AccessibilityInfo, Image } from "react-native"
import * as Reanimated from "react-native-reanimated"

const actualReanimatedMock = jest.requireActual("react-native-reanimated/mock")

jest.mock("react-native-reanimated", () => {
  const actual = jest.requireActual("react-native-reanimated/mock")
  return {
    ...actual,
    withTiming: jest.fn(actual.withTiming),
    cancelAnimation: jest.fn(actual.cancelAnimation),
  }
})

// Flushes the pending `AccessibilityInfo.isReduceMotionEnabled()` microtask, which in turn
// triggers the effect that dispatches the animation sequence.
const flushReduceMotionCheck = () => act(async () => await Promise.resolve())

describe("ArtworkMontageStep", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Reanimated.withTiming as jest.Mock).mockImplementation(actualReanimatedMock.withTiming)
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false)
  })

  it("renders all 5 onboarding images", async () => {
    renderWithWrappers(<ArtworkMontageStep onNext={jest.fn()} />)
    await flushReduceMotionCheck()

    const images = screen.UNSAFE_getAllByType(Image)
    expect(images).toHaveLength(5)
  })

  it("calls onNext exactly once when the sequence completes", async () => {
    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("does not call onNext when the sequence is cancelled", async () => {
    ;(Reanimated.withTiming as jest.Mock).mockImplementation((toValue, _config, callback) => {
      callback?.(false)
      return toValue
    })

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).not.toHaveBeenCalled()
  })

  it("cancels the animation on unmount and does not call onNext again afterward", async () => {
    const cancelAnimationSpy = Reanimated.cancelAnimation as jest.Mock
    const onNext = jest.fn()
    const { unmount } = renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).toHaveBeenCalledTimes(1)

    unmount()

    expect(cancelAnimationSpy).toHaveBeenCalled()
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("skips the montage and calls onNext immediately when Reduce Motion is enabled", async () => {
    ;(AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(true)

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)
    await flushReduceMotionCheck()

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(screen.UNSAFE_queryAllByType(Image)).toHaveLength(0)
  })
})
