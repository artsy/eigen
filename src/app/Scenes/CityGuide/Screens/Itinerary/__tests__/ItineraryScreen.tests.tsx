import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// "chill-vibes-only" has four saveable stops, so four queries fire. renderWithRelay
// resolves one; the other three stay suspended, but each is contained by its own
// Suspense fallback={null} (Task 5), so they render as nothing rather than blanking
// the tree. Assertions below therefore target the screen chrome, never a save icon.
// The unavailable-state tests issue no query at all and must use renderWithWrappers.
describe("ItineraryScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryScreen })

  it("renders the header and every section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Day 2 — London Frieze")).toBeTruthy()
  })

  it("numbers stops continuously across sections", () => {
    const itinerary = getMockItinerary("london-united-kingdom", "chill-vibes-only")!
    const totalStops = itinerary.sections.reduce((sum, s) => sum + s.stops.length, 0)

    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

    // Numbering runs 1..N across the whole itinerary rather than restarting per section,
    // so the very last number only exists if every earlier section was counted.
    expect(screen.getByText(String(totalStops))).toBeTruthy()
    expect(screen.queryByText(String(totalStops + 1))).toBeNull()
  })

  it("renders the unavailable state for an unknown itinerary", () => {
    renderWithWrappers(<ItineraryScreen citySlug="london-united-kingdom" itineraryId="nope" />)

    expect(screen.getByText("This guide is no longer available.")).toBeTruthy()
    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })

  it("does not render another city's itinerary", () => {
    renderWithWrappers(<ItineraryScreen citySlug="paris-france" itineraryId="chill-vibes-only" />)

    expect(screen.getByText("This guide is no longer available.")).toBeTruthy()
  })

  it("switches to the map view and back", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()

    fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

    // MapView mocks to null, so its children never mount. Assert on the chrome
    // outside the map: the list is gone and the filter pills are up.
    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("All")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()

    fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })
})
