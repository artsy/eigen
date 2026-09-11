import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideItinerariesRail } from "app/Scenes/CityGuide/Components/CityGuideItinerariesRail"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideItinerariesRail", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideItinerariesRail })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (internalID: string, name: string, stopsCounts: number[]) => ({
    internalID,
    slug: null,
    title: name,
    heroImage: { resized: { url: `https://example.com/${internalID}.jpg` }, url: null },
    sections: stopsCounts.map((stopsCount) => ({ stopsCount })),
  })

  const connection = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders a card per itinerary, with its summed stop count", async () => {
    renderWithRelay(
      connection([
        itinerary("a", "London Oct 2026", [10, 6]),
        itinerary("b", "London Winter", [3]),
      ]),
      props
    )

    expect(await screen.findByText("London Oct 2026")).toBeOnTheScreen()
    // 10 + 6, summed across sections because Itinerary has no stopsCount.
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
    expect(screen.getByText("London Winter")).toBeOnTheScreen()
    expect(screen.getByText("3 stops")).toBeOnTheScreen()
  })

  it("opens that itinerary when a card is tapped", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/a")
  })

  it("opens the full list from the header", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("Your Itineraries"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itineraries")
  })

  // The band it replaces hid itself at a count of zero; an empty grey strip reads as broken.
  it("renders nothing when the user has none for this city", async () => {
    renderWithRelay(connection([]), props)

    expect(screen.queryByText("Your Itineraries")).not.toBeOnTheScreen()
  })

  it("prefers a slug over the id when addressing an itinerary", async () => {
    renderWithRelay(
      connection([{ ...itinerary("a", "London Oct 2026", [1]), slug: "london-oct-2026" }]),
      props
    )

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/london-oct-2026"
    )
  })
})
