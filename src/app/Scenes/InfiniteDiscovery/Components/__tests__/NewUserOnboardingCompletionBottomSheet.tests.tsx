import { fireEvent, screen } from "@testing-library/react-native"
import { NewUserOnboardingCompletionBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/NewUserOnboardingCompletionBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders the sheet content when completionBottomSheetVisible is true", () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(
      screen.getByText("First five saved: We’re beginning to understand your taste.")
    ).toBeOnTheScreen()
    expect(screen.getByText("See More Works")).toBeOnTheScreen()
    expect(screen.getByText("Take Me Home")).toBeOnTheScreen()
  })

  it('"See More Works" hides the sheet and keeps onboarding incomplete', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("See More Works"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(
      state?.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
    ).toBe(false)
    expect(state?.onboarding.onboardingState).toBe("incomplete")
  })

  it('"Take Me Home" hides the sheet and completes onboarding', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take Me Home"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(
      state?.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
    ).toBe(false)
    expect(state?.onboarding.onboardingState).toBe("complete")
  })

  it('"Take Me Home" still completes onboarding if the profile mutation fails', () => {
    jest.spyOn(console, "error").mockImplementation()
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take Me Home"))

    const environment = getMockRelayEnvironment()
    environment.mock.rejectMostRecentOperation(new Error("network error"))

    expect(__globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState).toBe("complete")
  })

  it('"Take Me Home" sends completedOnboarding: true in the profile mutation', () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take Me Home"))

    const environment = getMockRelayEnvironment()
    const operation = environment.mock.getMostRecentOperation()

    expect(operation.request.variables.input).toEqual({ completedOnboarding: true })
  })

  it('"Take Me Home" defers Home tooltips to the next session when at least one artwork was saved', () => {
    GlobalStore.actions.progressiveOnboarding.setDeferHomeTooltipsThisSession(false)
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take Me Home"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.sessionState.deferHomeTooltipsThisSession).toBe(true)
  })

  it('"Take Me Home" does not defer Home tooltips when no artworks were saved', () => {
    GlobalStore.actions.progressiveOnboarding.setDeferHomeTooltipsThisSession(false)
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    fireEvent.press(screen.getByText("Take Me Home"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.sessionState.deferHomeTooltipsThisSession).toBe(false)
  })

  it("renders 5 artwork images from the store", () => {
    GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    SAVED_ARTWORKS.forEach((artwork) => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork(artwork)
    })

    renderWithWrappers(<NewUserOnboardingCompletionBottomSheet />)

    expect(
      screen.getByText("First five saved: We’re beginning to understand your taste.")
    ).toBeOnTheScreen()
  })
})
