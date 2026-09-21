import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Schema } from "app/utils/track"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("CityEventSaveControl", () => {
  const renderIt = (props: Partial<React.ComponentProps<typeof CityEventSaveControl>> = {}) =>
    renderWithWrappers(
      <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
        <CityEventSaveControl
          itemType="SHOW"
          itemID="show-internal-id"
          name="Frida Kahlo"
          contextScreenOwnerType={OwnerType.cityGuide}
          contextScreenOwnerSlug="london-united-kingdom"
          {...props}
        />
      </AddToItineraryProvider>
    )

  // The plus no longer follows, so it has no saved state of its own: which itineraries hold
  // the entity is the sheet's business.
  it("offers to add the entity to an itinerary", () => {
    renderIt()

    expect(screen.getByLabelText("Add Frida Kahlo to an itinerary")).toBeTruthy()
    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
  })

  it("tracks the tap against the entity", () => {
    renderIt()

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: Schema.ActionNames.SaveShow,
        owner_type: Schema.OwnerEntityTypes.Show,
        owner_id: "show-internal-id",
      })
    )
  })

  it("tracks a fair and a gallery under their own names", () => {
    renderIt({ itemType: "FAIR", itemID: "fair-1", name: "Frieze" })

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: Schema.ActionNames.FollowFair,
        owner_type: Schema.OwnerEntityTypes.Fair,
      })
    )
  })

  it("tracks the cohesion tappedAddToItinerary event, with the entity as the destination", () => {
    renderIt({ itemType: "SHOW", itemID: "show-internal-id", itemSlug: "frida-kahlo" })

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ActionType.tappedAddToItinerary,
        context_screen_owner_type: OwnerType.cityGuide,
        context_screen_owner_slug: "london-united-kingdom",
        destination_screen_owner_type: OwnerType.show,
        destination_screen_owner_id: "show-internal-id",
        destination_screen_owner_slug: "frida-kahlo",
        is_curated_guide: false,
      })
    )
  })

  it("tracks a fair's destination as OwnerType.fair and a location's as OwnerType.partner", () => {
    renderIt({ itemType: "FAIR", itemID: "fair-1" })
    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ destination_screen_owner_type: OwnerType.fair })
    )

    jest.clearAllMocks()
    renderIt({ itemType: "LOCATION", itemID: "location-1" })
    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ destination_screen_owner_type: OwnerType.partner })
    )
  })

  it("marks is_curated_guide when rendered on a curated guide's own stop list", () => {
    renderIt({ isCuratedGuide: true })

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({ is_curated_guide: true }))
  })

  // A plus that did nothing when tapped would be worse than none at all.
  it("renders nothing without a provider", () => {
    renderWithWrappers(
      <CityEventSaveControl
        itemType="SHOW"
        itemID="show-internal-id"
        name="Frida Kahlo"
        contextScreenOwnerType={OwnerType.cityGuide}
      />
    )

    expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
  })
})
