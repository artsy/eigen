import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryPicker } from "app/Scenes/CityGuide/Components/ItineraryPicker"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ItineraryPicker", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryPicker })
  const props = {
    citySlug: "london-united-kingdom",
    currentItineraryId: "a",
    currentItineraryName: "London Oct 2026",
  }

  const itinerary = (internalID: string, name: string) => ({
    internalID,
    slug: null,
    name,
    sections: [{ stopsCount: 4 }],
  })

  const connection = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("names the itinerary being viewed", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    expect(await screen.findByText("London Oct 2026")).toBeOnTheScreen()
  })

  // A pill that opens an empty sheet is a button that does nothing.
  it("does not offer switching with only one itinerary", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    expect(await screen.findByTestId("itinerary-picker")).toBeDisabled()
  })

  it("lists the others once there is more than one", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026"), itinerary("b", "London Winter")]),
      props
    )

    fireEvent.press(await screen.findByTestId("itinerary-picker"))

    expect(await screen.findByText("London Winter")).toBeOnTheScreen()
  })

  it("switches to the itinerary that is picked", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026"), itinerary("b", "London Winter")]),
      props
    )

    fireEvent.press(await screen.findByTestId("itinerary-picker"))
    fireEvent.press(await screen.findByText("London Winter"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/b")
  })
})
