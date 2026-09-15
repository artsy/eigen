import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Both fixture stops have no item, so no query fires and setupTestWrapper would throw.
// See the harness rule in the ItineraryStopRow test.
const section = {
  internalID: "day-1",
  title: "Day 1 — Easing in",
  stops: [
    makeItineraryStop({
      internalID: "stop-1",
      title: "Coffee at London Cafe",
      startTime: "10am",
      endTime: null,
      image: { url: "https://example.com/a.jpg" },
      latitude: 51.5136,
      longitude: -0.1365,
    }),
    makeItineraryStop({
      internalID: "stop-2",
      title: "Museum",
      startTime: "11am",
      endTime: "4pm",
      image: { url: "https://example.com/b.jpg" },
      latitude: 51.5194,
      longitude: -0.127,
    }),
  ],
} as ItinerarySection

describe("ItinerarySectionRow", () => {
  it("renders the title and its stops expanded by default", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={4}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })
})
