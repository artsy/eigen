import { act, screen } from "@testing-library/react-native"
import {
  ARTWORKS_DURATION,
  ArtworkMontageStep,
} from "app/Scenes/Onboarding/Screens/Onboarding/Components/ArtworkMontageStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Image } from "react-native"
import { useReducedMotion } from "react-native-reanimated"

jest.mock("react-native-reanimated", () => ({
  ...jest.requireActual("react-native-reanimated"),
  useReducedMotion: jest.fn(),
}))

describe("ArtworkMontageStep", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders all 5 onboarding images", () => {
    renderWithWrappers(<ArtworkMontageStep onNext={jest.fn()} />)

    expect(screen.UNSAFE_getAllByType(Image)).toHaveLength(5)
  })

  it("does not call onNext before the montage duration elapses, and does so right after", () => {
    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    act(() => {
      jest.advanceTimersByTime(ARTWORKS_DURATION - 1)
    })

    expect(onNext).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("clears the timer on unmount and does not call onNext afterward", () => {
    const onNext = jest.fn()
    const { unmount } = renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    unmount()

    act(() => {
      jest.runAllTimers()
    })

    expect(onNext).not.toHaveBeenCalled()
  })

  it("skips the montage and calls onNext immediately when Reduce Motion is enabled", () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const onNext = jest.fn()
    renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(screen.UNSAFE_queryAllByType(Image)).toHaveLength(0)
  })
})
