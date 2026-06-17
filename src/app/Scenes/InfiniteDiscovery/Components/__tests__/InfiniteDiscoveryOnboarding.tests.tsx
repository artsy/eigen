import { act, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper", () => ({
  Swiper: () => null,
}))

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => ({ onboardingView: jest.fn() }),
}))

describe("InfiniteDiscoveryOnboarding", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
    GlobalStore.actions.infiniteDiscovery.setHasInteractedWithOnboarding(false)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("in new user onboarding session", () => {
    beforeEach(() => {
      GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    })

    it("shows the overlay", () => {
      renderWithWrappers(<InfiniteDiscoveryOnboarding artworks={[]} />)

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.getByText("Welcome to Discover Daily")).toBeOnTheScreen()
    })

    it("shows the onboarding-specific save prompt", () => {
      renderWithWrappers(<InfiniteDiscoveryOnboarding artworks={[]} />)

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.getByText(/different artworks to build your taste profile/)).toBeOnTheScreen()
    })
  })

  describe("when not in new user onboarding session", () => {
    it("shows the overlay after 1 second on first visit", () => {
      renderWithWrappers(<InfiniteDiscoveryOnboarding artworks={[]} />)

      expect(screen.queryByText("Welcome to Discover Daily")).not.toBeOnTheScreen()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.getByText("Welcome to Discover Daily")).toBeOnTheScreen()
    })

    it("does not show the overlay for a returning visitor", () => {
      GlobalStore.actions.infiniteDiscovery.setHasInteractedWithOnboarding(true)
      renderWithWrappers(<InfiniteDiscoveryOnboarding artworks={[]} />)

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.queryByText("Welcome to Discover Daily")).not.toBeOnTheScreen()
    })
  })
})
