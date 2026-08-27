import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// Harness rule for every test in this plan: `renderWithRelay` unconditionally calls
// env.mock.resolveMostRecentOperation (setupTestWrapper.tsx:117), and relay-test-utils
// throws "There are no pending operations in the list" when nothing is pending
// (RelayModernMockEnvironment.js:220). So use setupTestWrapper ONLY when the render
// actually issues a query — i.e. when a stop has a non-null saveTarget. Otherwise use
// renderWithWrappers.

const savedStop: ItineraryStop = {
  id: "stop-2",
  title: "Museum",
  address: "Trafalgar Square, WC2N 5DN",
  category: "MUSEUM",
  displayTime: "11am-4pm",
  note: "🥂 🧀",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  saveTarget: { type: "SHOW", slug: "museum-show" },
}

const unsaveableStop: ItineraryStop = {
  id: "stop-1",
  title: "Coffee at London Cafe",
  displayTime: "10am",
  imageUrl: "https://example.com/cafe.jpg",
  coordinates: { lat: 51.5136, lng: -0.1365 },
  saveTarget: null,
}

describe("ItineraryStopRow", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryStopRow })

  it("renders the number, title, time and address", async () => {
    renderWithRelay(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("Trafalgar Square, WC2N 5DN")).toBeTruthy()
  })

  it("leaves the note to the preview sheet rather than the row", async () => {
    renderWithRelay(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("opens the preview when the row is tapped", async () => {
    const onPress = jest.fn()
    renderWithRelay(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress }
    )

    fireEvent.press(await screen.findByTestId("itinerary-stop-row"))

    expect(onPress).toHaveBeenCalledWith(savedStop)
  })

  // No saveTarget means no query, so these two must not go through renderWithRelay.
  it("omits the note when the stop has none", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} onPress={jest.fn()} />)

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("renders no save control when the stop has no save target", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} onPress={jest.fn()} />)

    expect(screen.queryByTestId("itinerary-save-button")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  it("reflects the resolved followed state", async () => {
    renderWithRelay(
      { Show: () => ({ isFollowed: true }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByTestId("itinerary-save-button-check-icon")).toBeTruthy()
  })
})
