import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideItinerariesRailTestQuery } from "__generated__/CityGuideItinerariesRailTestQuery.graphql"
import { CityGuideItinerariesRail } from "app/Scenes/CityGuide/Components/CityGuideItinerariesRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CityGuideItinerariesRail", () => {
  const { renderWithRelay } = setupTestWrapper<
    CityGuideItinerariesRailTestQuery,
    { citySlug: string }
  >({
    Component: CityGuideItinerariesRail,
    query: graphql`
      query CityGuideItinerariesRailTestQuery($citySlug: String!, $first: Int!)
      @relay_test_operation {
        me {
          ...CityGuideItinerariesRail_me @arguments(citySlug: $citySlug, first: $first)
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom", first: 10 },
  })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (internalID: string, name: string, stopsCounts: number[]) => ({
    internalID,
    slug: null,
    title: name,
    heroImage: { resized: { url: `https://example.com/${internalID}.jpg` }, url: null },
    stopsCount: stopsCounts.reduce((a, b) => a + b, 0),
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
    // Itinerary.stopsCount, which Gravity totals from its sections.
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
    expect(screen.getByText("London Winter")).toBeOnTheScreen()
    expect(screen.getByText("3 stops")).toBeOnTheScreen()
  })

  it("opens that itinerary when a card is tapped", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/a")
  })

  it("tracks the tap on an itinerary card", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedCardGroup",
        context_module: "cityGuideCard",
        context_screen_owner_type: "cityGuide",
        context_screen_owner_slug: "london-united-kingdom",
        destination_screen_owner_type: "cityGuideGuide",
        destination_screen_owner_id: "a",
      })
    )
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

  // Gravity's listing serializes at :short, and older responses carry no stopsCount. "0 stops"
  // would be a lie, so the line is left out.
  it("shows no count when nothing knows it", async () => {
    renderWithRelay(
      connection([
        {
          internalID: "a",
          slug: null,
          title: "London Oct 2026",
          heroImage: null,
          stopsCount: null,
        },
      ]),
      props
    )

    expect(await screen.findByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.queryByText(/stops?$/)).not.toBeOnTheScreen()
  })
})
