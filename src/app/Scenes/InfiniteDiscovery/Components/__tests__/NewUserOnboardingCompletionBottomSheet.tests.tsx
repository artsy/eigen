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

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
    expect(screen.getByText("Take me home")).toBeOnTheScreen()
  })

  it('"Take me home" hides the completion sheet', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take me home"))

    const infiniteDiscoveryState = __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery
    expect(infiniteDiscoveryState?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(
      false
    )
  })

  it("renders 5 artwork images from the store", () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
  })
})
