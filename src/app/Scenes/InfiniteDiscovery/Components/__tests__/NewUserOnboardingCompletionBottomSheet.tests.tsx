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
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(false)
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
  })

  it("renders without error when completionBottomSheetVisible is false", () => {
    expect(() => renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)).not.toThrow()
  })

  it("renders the sheet content when completionBottomSheetVisible is true", () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
    expect(screen.getByText("Take me home")).toBeOnTheScreen()
    expect(screen.queryByText("Continue Browsing")).not.toBeOnTheScreen()
  })

  it('"Take me home" completes onboarding, exiting the onboarding navigator to the home tab', () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take me home"))

    const onboardingState = __globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState
    expect(onboardingState).toBe("complete")
  })

  it("renders 5 artwork images from the store", () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
  })
})
