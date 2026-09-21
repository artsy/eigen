import { fireEvent, screen } from "@testing-library/react-native"
import { MapPreviewCard } from "app/Scenes/CityGuide/Components/Map/MapPreviewCard"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const place = (overrides: Partial<MapPlace> = {}): MapPlace => ({
  id: "place-1",
  title: "Frieze London",
  coordinates: { lat: 51.5, lng: -0.1 },
  href: "/fair/frieze-london-2026",
  ...overrides,
})

describe("MapPreviewCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("navigates to the place's href when tapped", () => {
    renderWithWrappers(<MapPreviewCard place={place()} citySlug="london-united-kingdom" />)

    fireEvent.press(screen.getByText("Frieze London"))

    expect(navigate).toHaveBeenCalledWith("/fair/frieze-london-2026")
  })

  it("tracks the tap when the card will navigate", () => {
    renderWithWrappers(<MapPreviewCard place={place()} citySlug="london-united-kingdom" />)

    fireEvent.press(screen.getByText("Frieze London"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedCardGroup",
        context_module: "cityGuideCard",
        context_screen_owner_type: "cityGuideMap",
        context_screen_owner_slug: "london-united-kingdom",
        destination_path: "/fair/frieze-london-2026",
      })
    )
  })

  // The cluster rail uses onPress for select-only cards with no navigation of their own — a
  // select isn't a tap-through, so it shouldn't count as one.
  it("does not track when disableNavigation forces a select-only card", () => {
    const onPress = jest.fn()

    renderWithWrappers(
      <MapPreviewCard
        place={place()}
        citySlug="london-united-kingdom"
        onPress={onPress}
        disableNavigation
      />
    )

    fireEvent.press(screen.getByText("Frieze London"))

    expect(onPress).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("does not track a place with no href", () => {
    renderWithWrappers(
      <MapPreviewCard place={place({ href: null })} citySlug="london-united-kingdom" />
    )

    fireEvent.press(screen.getByText("Frieze London"))

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("tracks a stop card the same way, via StopCard's own onPress", () => {
    renderWithWrappers(
      <MapPreviewCard
        place={place({
          card: { kind: "custom", title: "Coffee at London Cafe" },
          href: "/city-guide/london-united-kingdom/itinerary/abc",
        })}
        citySlug="london-united-kingdom"
      />
    )

    fireEvent.press(screen.getByTestId("stop-card-link"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedCardGroup",
        destination_path: "/city-guide/london-united-kingdom/itinerary/abc",
      })
    )
  })
})
