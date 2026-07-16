import { fireEvent, screen } from "@testing-library/react-native"
import { NewUserOnboardingCompletionBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/NewUserOnboardingCompletionBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const SAVED_ARTWORKS = Array.from({ length: 5 }, (_, i) => ({
  internalID: `artwork-${i + 1}`,
  url: `https://example.com/${i + 1}.jpg`,
  blurhash: null,
}))

describe("NewUserOnboardingCompletionBottomSheet", () => {
  beforeEach(() => {
    GlobalStore.actions.onboarding.setOnboardingState("complete")
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
  })

  it("renders the sheet content when completionBottomSheetVisible is true", () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("Five works is all it takes to start.")).toBeOnTheScreen()
    expect(screen.getByText("Continue Browsing")).toBeOnTheScreen()
    expect(screen.getByText("Go to home")).toBeOnTheScreen()
  })

  it('"Continue Browsing" hides the sheet and keeps onboarding incomplete', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Continue Browsing"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(
      state?.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
    ).toBe(false)
    expect(state?.onboarding.onboardingState).toBe("incomplete")
  })

  it('"Go to home" hides the sheet and completes onboarding', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Go to home"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(
      state?.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
    ).toBe(false)
    expect(state?.onboarding.onboardingState).toBe("complete")
  })

  it("renders 5 artwork images from the store", () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("Five works is all it takes to start.")).toBeOnTheScreen()
  })
})
