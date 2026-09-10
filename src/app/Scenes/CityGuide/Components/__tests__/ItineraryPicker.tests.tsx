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

  // It used to be gated on having more than one, which read as a dead button for anyone with
  // exactly one — the common case while nothing can create them yet.
  it("still opens with only one itinerary", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    expect(await screen.findByTestId("itinerary-picker")).not.toBeDisabled()

    fireEvent.press(screen.getByTestId("itinerary-picker"))

    expect(await screen.findByText("Your Itineraries")).toBeOnTheScreen()
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
