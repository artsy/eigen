import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("CustomStopSaveControl", () => {
  const renderIt = (props: Partial<React.ComponentProps<typeof CustomStopSaveControl>> = {}) =>
    renderWithWrappers(
      <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
        <CustomStopSaveControl
          stop={{ title: "A Cafe" }}
          citySlug="london-united-kingdom"
          cityName="London"
          contextScreenOwnerType={OwnerType.cityGuideGuide}
          contextScreenOwnerId="itinerary-1"
          contextScreenOwnerSlug="itinerary-slug"
          {...props}
        />
      </AddToItineraryProvider>
    )

  it("offers to add the custom stop to an itinerary", () => {
    renderIt()

    expect(screen.getByLabelText("Add A Cafe to an itinerary")).toBeTruthy()
  })

  it("tracks the cohesion tappedAddToItinerary event, with no destination entity", () => {
    renderIt()

    fireEvent.press(screen.getByTestId("custom-stop-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ActionType.tappedAddToItinerary,
        context_screen_owner_type: OwnerType.cityGuideGuide,
        context_screen_owner_id: "itinerary-1",
        context_screen_owner_slug: "itinerary-slug",
        is_curated_guide: false,
      })
    )
    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({ destination_screen_owner_type: expect.anything() })
    )
  })

  it("marks is_curated_guide when rendered on a curated guide's own stop list", () => {
    renderIt({ isCuratedGuide: true })

    fireEvent.press(screen.getByTestId("custom-stop-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({ is_curated_guide: true }))
  })

  // A plus that did nothing when tapped would be worse than none at all.
  it("renders nothing without a provider", () => {
    renderWithWrappers(
      <CustomStopSaveControl
        stop={{ title: "A Cafe" }}
        citySlug="london-united-kingdom"
        cityName="London"
        contextScreenOwnerType={OwnerType.cityGuideGuide}
      />
    )

    expect(screen.queryByTestId("custom-stop-save-button")).toBeNull()
  })
})
