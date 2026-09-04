import { PortalHost } from "@gorhom/portal"
import { screen } from "@testing-library/react-native"
import {
  INFINITE_DISCOVERY_SAVE_ANIMATION_PORTAL_HOST,
  InfiniteDiscoverySaveFlightAnimation,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoverySaveFlightAnimation"
import { GlobalStore } from "app/store/GlobalStore"
import { NewUserOnboardingSavedArtwork } from "app/store/InfiniteDiscoveryModel"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const renderFlightAnimation = (artwork: NewUserOnboardingSavedArtwork | null) =>
  renderWithWrappers(
    <>
      <InfiniteDiscoverySaveFlightAnimation artwork={artwork} onComplete={mockOnComplete} />
      <PortalHost name={INFINITE_DISCOVERY_SAVE_ANIMATION_PORTAL_HOST} />
    </>
  )

const mockArtwork: NewUserOnboardingSavedArtwork = {
  internalID: "artwork-1",
  url: "https://example.com/1.jpg",
  blurhash: "blurhash-1",
}

const mockOnComplete = jest.fn()

describe("InfiniteDiscoverySaveFlightAnimation", () => {
  beforeEach(() => {
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
    mockOnComplete.mockReset()
  })

  it("renders nothing when there is no pending artwork", () => {
    renderFlightAnimation(null)

    expect(
      screen.queryByTestId("infinite-discovery-save-flight-card", { includeHiddenElements: true })
    ).not.toBeOnTheScreen()
  })

  it("renders nothing until the progress badge position has been measured", () => {
    renderFlightAnimation(mockArtwork)

    expect(
      screen.queryByTestId("infinite-discovery-save-flight-card", { includeHiddenElements: true })
    ).not.toBeOnTheScreen()
  })

  it("renders the flight card once the progress badge position has been measured", () => {
    GlobalStore.actions.infiniteDiscovery.setProgressBadgePosition({
      x: 20,
      y: 40,
      width: 60,
      height: 20,
    })

    renderFlightAnimation(mockArtwork)

    expect(
      screen.getByTestId("infinite-discovery-save-flight-card", { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })
})
