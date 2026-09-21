import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { useAddToItinerary } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { StopTarget } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider", () => ({
  useAddToItinerary: jest.fn(),
}))

const mockUseAddToItinerary = useAddToItinerary as jest.Mock

describe("ItineraryAddFullListButton", () => {
  const mockOpen = jest.fn()

  const targets: StopTarget[] = [
    { itemType: "SHOW", itemID: "show-1" },
    { itemType: "FAIR", itemID: "fair-1" },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAddToItinerary.mockReturnValue({ open: mockOpen })
  })

  const renderIt = () =>
    renderWithWrappers(
      <ItineraryAddFullListButton
        itineraryId="guide-1"
        itinerarySlug="chill-vibes-only"
        targets={targets}
      />
    )

  it("opens the sheet with every stop in the guide", () => {
    renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))

    expect(mockOpen).toHaveBeenCalledWith(targets)
  })

  // A tap that did nothing would be worse than no button at all — same rule as every other
  // plus in City Guide.
  it("renders nothing without an AddToItineraryProvider above it", () => {
    mockUseAddToItinerary.mockReturnValue(null)

    renderIt()

    expect(screen.queryByTestId("itinerary-add-full-list")).not.toBeOnTheScreen()
  })

  it("tracks the cohesion tap event as soon as the button is pressed", () => {
    renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.tappedAddFullListToItinerary,
      context_screen_owner_type: OwnerType.cityGuideGuide,
      context_screen_owner_id: "guide-1",
      context_screen_owner_slug: "chill-vibes-only",
    })
  })
})
