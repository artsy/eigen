import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const SAVED_ARTWORKS = Array.from({ length: 5 }, (_, i) => ({
  internalID: `artwork-${i + 1}`,
  url: `https://example.com/${i + 1}.jpg`,
  blurhash: null,
}))

describe("InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet", () => {
  beforeEach(() => {
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(false)
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
  })

  it("renders nothing when completionBottomSheetVisible is false", () => {
    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.queryByText("First five works saved!")).not.toBeOnTheScreen()
  })

  it("renders the sheet content when completionBottomSheetVisible is true", () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(true)

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
    expect(screen.getByText("Take me home")).toBeOnTheScreen()
    expect(screen.queryByText("Continue Browsing")).not.toBeOnTheScreen()
  })

  it('"Take me home" completes onboarding, exiting the onboarding navigator to the home tab', () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(true)

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take me home"))

    const onboardingState = __globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState
    expect(onboardingState).toBe("complete")
  })

  it("renders 5 artwork images from the store", () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
  })
})
