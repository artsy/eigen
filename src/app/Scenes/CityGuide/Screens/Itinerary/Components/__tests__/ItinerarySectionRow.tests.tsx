import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Both fixture stops have saveTarget: null, so no query fires and setupTestWrapper
// would throw. See the harness rule in the ItineraryStopRow test.
const section: ItinerarySection = {
  id: "day-1",
  title: "Day 1 — Easing in",
  stops: [
    {
      id: "stop-1",
      title: "Coffee at London Cafe",
      displayTime: "10am",
      imageUrl: "https://example.com/a.jpg",
      coordinates: { lat: 51.5136, lng: -0.1365 },
      saveTarget: null,
    },
    {
      id: "stop-2",
      title: "Museum",
      displayTime: "11am-4pm",
      imageUrl: "https://example.com/b.jpg",
      coordinates: { lat: 51.5194, lng: -0.127 },
      saveTarget: null,
    },
  ],
}

describe("ItinerarySectionRow", () => {
  it("renders the title and its stops expanded by default", () => {
    renderWithWrappers(
      <ItinerarySectionRow section={section} startNumber={1} onSelectStop={jest.fn()} />
    )

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderWithWrappers(
      <ItinerarySectionRow section={section} startNumber={4} onSelectStop={jest.fn()} />
    )

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithWrappers(
      <ItinerarySectionRow section={section} startNumber={1} onSelectStop={jest.fn()} />
    )

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })
})
