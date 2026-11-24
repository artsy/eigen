import { act, screen } from "@testing-library/react-native"
import {
  ARTWORKS_DURATION,
  ArtworkMontageStep,
} from "app/Scenes/Onboarding/Screens/Onboarding/Components/ArtworkMontageStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useReducedMotion } from "react-native-reanimated"

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
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

  it("renders all 5 onboarding images", async () => {
    await renderWithWrappers(<ArtworkMontageStep onNext={jest.fn()} />)

    expect(screen.getAllByTestId("onboarding-montage-image")).toHaveLength(5)
  })

  it("does not call onNext before the montage duration elapses, and does so right after", async () => {
    const onNext = jest.fn()
    await renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    await act(() => {
      jest.advanceTimersByTime(ARTWORKS_DURATION - 1)
    })

    expect(onNext).not.toHaveBeenCalled()

    await act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("clears the timer on unmount and does not call onNext afterward", async () => {
    const onNext = jest.fn()
    const { unmount } = await renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    await unmount()

    await act(() => {
      jest.runAllTimers()
    })

    expect(onNext).not.toHaveBeenCalled()
  })

  it("skips the montage and calls onNext immediately when Reduce Motion is enabled", async () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const onNext = jest.fn()
    await renderWithWrappers(<ArtworkMontageStep onNext={onNext} />)

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(screen.queryAllByTestId("onboarding-montage-image")).toHaveLength(0)
  })
})
