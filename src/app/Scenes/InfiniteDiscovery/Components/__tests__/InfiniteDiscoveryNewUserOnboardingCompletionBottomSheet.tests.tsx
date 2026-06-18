import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { switchTab } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/navigate")

const mockSwitchTab = switchTab as jest.Mock

const SAVED_ARTWORKS = Array.from({ length: 5 }, (_, i) => ({
  internalID: `artwork-${i + 1}`,
  url: `https://example.com/${i + 1}.jpg`,
  blurhash: null,
}))

describe("InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(false)
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
  })

  it("renders nothing when completionBottomSheetVisible is false", () => {
    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.queryByText("First five works saved!")).not.toBeOnTheScreen()
  })

  it("renders the sheet content when completionBottomSheetVisible is true", () => {
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(true)

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
    expect(screen.getByText("Take me home")).toBeOnTheScreen()
    expect(screen.queryByText("Continue Browsing")).not.toBeOnTheScreen()
  })

  it('"Take me home" clears isNewUserOnboardingSession and navigates home', () => {
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(true)

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take me home"))

    const state = __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery
    expect(state?.sessionState.isNewUserOnboardingSession).toBe(false)
    expect(mockSwitchTab).toHaveBeenCalledWith("home")
  })

  it("renders 5 artwork images from the store", () => {
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })
    GlobalStore.actions.infiniteDiscovery.setCompletionBottomSheetVisible(true)

    renderWithWrappers(<InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet />)

    expect(screen.getByText("First five works saved!")).toBeOnTheScreen()
  })
})
