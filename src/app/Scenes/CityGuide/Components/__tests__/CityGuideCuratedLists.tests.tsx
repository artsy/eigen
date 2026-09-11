import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideCuratedLists", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideCuratedLists })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (slug: string | null, name: string) => ({
    internalID: `id-for-${name}`,
    slug,
    title: name,
    authorName: "Casey Lesser",
    heroImage: { url: "https://example.com/hero-240.jpg" },
  })

  const connection = (nodes: object[]) => ({
    ItinerariesConnection: () => ({ edges: nodes.map((node) => ({ node })) }),
  })

  it("renders one pressable row per curated list", async () => {
    renderWithRelay(
      connection([
        itinerary("chill-vibes-only", "Chill Vibes Only"),
        itinerary("36-hours-in-london", "36 Hours in London"),
      ]),
      props
    )

    expect(await screen.findAllByTestId("curated-list-row")).toHaveLength(2)
    expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.getAllByText("By Casey Lesser")).toHaveLength(2)
  })

  it("navigates to the itinerary when a row is tapped", async () => {
    renderWithRelay(connection([itinerary("chill-vibes-only", "Chill Vibes Only")]), props)

    fireEvent.press((await screen.findAllByTestId("curated-list-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })

  // A curated guide is published and so has a slug, but an unpublished one still has to be
  // reachable rather than linking nowhere.
  it("addresses an itinerary with no slug by its id", async () => {
    renderWithRelay(connection([itinerary(null, "Unpublished Guide")]), props)

    fireEvent.press((await screen.findAllByTestId("curated-list-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/id-for-Unpublished Guide"
    )
  })

  it("renders nothing for a city with no itineraries", async () => {
    renderWithRelay(connection([]), props)

    // Nothing to await: the section renders null, so assert the tree never gains a row.
    expect(screen.queryAllByTestId("curated-list-row")).toHaveLength(0)
  })
})
