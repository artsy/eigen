import { fireEvent, screen } from "@testing-library/react-native"
import { CityItinerariesScreenQueryRenderer } from "app/Scenes/CityGuide/Screens/CityItineraries"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityItineraries", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: CityItinerariesScreenQueryRenderer,
  })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (internalID: string, name: string, stopsCounts: number[]) => ({
    internalID,
    slug: null,
    name,
    description: "If time, check out Borough Market",
    heroImage: { resized: { url: `https://example.com/${internalID}.jpg` }, url: null },
    sections: stopsCounts.map((stopsCount) => ({ stopsCount })),
  })

  const connection = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the title and a row per itinerary", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026", [10, 6]), itinerary("b", "Berlin", [3])]),
      props
    )

    expect(await screen.findByText("Your Itineraries")).toBeOnTheScreen()
    expect(screen.getByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
    expect(screen.getByText("Berlin")).toBeOnTheScreen()
  })

  it("opens an itinerary when its row is tapped", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/a")
  })

  it("renders a share control per row", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    expect(await screen.findByLabelText("Share London Oct 2026")).toBeOnTheScreen()
  })

  it("says so when the user has no itineraries here", async () => {
    renderWithRelay(connection([]), props)

    expect(await screen.findByText(/haven’t started an itinerary/)).toBeOnTheScreen()
  })

  // Not in the designs, but the sheet needs an entry point and this screen is the only place
  // ownership is guaranteed — it queries through `me`.
  it("opens the edit sheet from a row, prefilled with the itinerary", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByLabelText("Edit London Oct 2026"))

    expect(await screen.findByText("Edit Itinerary")).toBeOnTheScreen()
    expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "London Oct 2026")
    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp(
      "value",
      "If time, check out Borough Market"
    )
  })
})
