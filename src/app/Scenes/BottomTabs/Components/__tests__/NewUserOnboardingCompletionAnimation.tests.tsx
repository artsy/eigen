import { act, screen } from "@testing-library/react-native"
import { NewUserOnboardingCompletionAnimation } from "app/Scenes/BottomTabs/Components/NewUserOnboardingCompletionAnimation"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useReducedMotion } from "react-native-reanimated"

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(),
}))

const mockUseReducedMotion = useReducedMotion as jest.Mock

const SAVED_ARTWORKS = Array.from({ length: 5 }, (_, i) => ({
  internalID: `artwork-${i + 1}`,
  url: `https://example.com/${i + 1}.jpg`,
  blurhash: null,
}))

// Mirrors the constants in NewUserOnboardingCompletionAnimation.tsx
const HOME_READY_FALLBACK_TIMEOUT = 4000
const POST_HOME_READY_SETTLE_DELAY = 500
const FAN_OUT_TOTAL_DURATION = 1000 + 500
const FLIGHT_TOTAL_DURATION = (SAVED_ARTWORKS.length - 1) * 140 + 600 + 400
const TOTAL_SEQUENCE_DURATION =
  POST_HOME_READY_SETTLE_DELAY + FAN_OUT_TOTAL_DURATION + FLIGHT_TOTAL_DURATION

describe("NewUserOnboardingCompletionAnimation", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseReducedMotion.mockReturnValue(false)
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
    GlobalStore.actions.bottomTabs.setFavoritesTabArtworkOverride(null)
    GlobalStore.actions.bottomTabs.setFavoritesTabIconPosition({
      x: 300,
      y: 800,
      width: 50,
      height: 50,
    })
    // Home has already settled, unless a test says otherwise.
    GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(true)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const saveFiveArtworks = () => {
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })
  }

  // The overlay is deliberately hidden from screen readers (accessibilityElementsHidden), which
  // also hides it from Testing Library's default queries — opt back in to see it in tests.
  const queryCards = () =>
    screen.queryAllByTestId("completion-animation-card", { includeHiddenElements: true })

  it("does nothing when there is no pending completion animation", () => {
    saveFiveArtworks()

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)
    act(() => {
      jest.advanceTimersByTime(TOTAL_SEQUENCE_DURATION)
    })

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.bottomTabs.sessionState.favoritesTabArtworkOverride).toBeNull()
  })

  it("clears the flag immediately and does not animate when Reduced Motion is enabled", () => {
    mockUseReducedMotion.mockReturnValue(true)
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    expect(
      __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery.sessionState
        .hasPendingCompletionAnimation
    ).toBe(false)

    act(() => {
      jest.advanceTimersByTime(TOTAL_SEQUENCE_DURATION)
    })

    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toBeNull()
  })

  it("clears the flag, runs the sequence, and swaps the favorites tab icon to the most recently saved artwork", () => {
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    expect(
      __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery.sessionState
        .hasPendingCompletionAnimation
    ).toBe(false)
    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toBeNull()

    // advance in separate steps (post-ready settle delay, fan-out settling, then the staggered
    // flight) rather than one big jump, matching the established pattern for this style of
    // JS-timer-chained animation (see useSaveFlightPhase.tests.ts)
    act(() => {
      jest.advanceTimersByTime(POST_HOME_READY_SETTLE_DELAY)
    })
    act(() => {
      jest.advanceTimersByTime(FAN_OUT_TOTAL_DURATION)
    })
    act(() => {
      jest.advanceTimersByTime(FLIGHT_TOTAL_DURATION)
    })

    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toEqual({ url: SAVED_ARTWORKS[4].url, blurhash: SAVED_ARTWORKS[4].blurhash })
  })

  it("clears newUserOnboardingGoalReached once the sequence finishes", () => {
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    expect(
      __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery.sessionState
        .newUserOnboardingGoalReached
    ).toBe(true)

    act(() => {
      jest.advanceTimersByTime(POST_HOME_READY_SETTLE_DELAY)
    })
    act(() => {
      jest.advanceTimersByTime(FAN_OUT_TOTAL_DURATION)
    })
    act(() => {
      jest.advanceTimersByTime(FLIGHT_TOTAL_DURATION)
    })

    expect(
      __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery.sessionState
        .newUserOnboardingGoalReached
    ).toBe(false)
  })

  it("waits for Home to settle before the pile appears", () => {
    GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    expect(queryCards().length).toBe(0)

    act(() => {
      GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(true)
    })
    act(() => {
      jest.advanceTimersByTime(POST_HOME_READY_SETTLE_DELAY)
    })

    expect(queryCards().length).toBeGreaterThan(0)
  })

  it("starts anyway if Home never signals it has settled", () => {
    GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    act(() => {
      jest.advanceTimersByTime(HOME_READY_FALLBACK_TIMEOUT)
    })
    act(() => {
      jest.advanceTimersByTime(FAN_OUT_TOTAL_DURATION)
    })

    expect(queryCards().length).toBeGreaterThan(0)
  })

  it("does not render anything visible before the favorites tab icon position has been measured", () => {
    GlobalStore.actions.bottomTabs.setFavoritesTabIconPosition(null)
    saveFiveArtworks()
    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)

    renderWithWrappers(<NewUserOnboardingCompletionAnimation />)

    expect(queryCards().length).toBe(0)
  })
})
