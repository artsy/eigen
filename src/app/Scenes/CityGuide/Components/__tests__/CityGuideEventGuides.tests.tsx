import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventGuides } from "app/Scenes/CityGuide/Components/CityGuideEventGuides"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("CityGuideEventGuides", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideEventGuides })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (slug: string | null, name: string, position = 0) => ({
    internalID: `attachment-for-${name}`,
    position,
    itinerary: {
      internalID: `id-for-${name}`,
      slug,
      title: name,
      authorName: "Casey Lesser",
      heroImage: { url: "https://example.com/hero-240.jpg" },
    },
  })

  const event = (title: string, itineraries: object[]) => ({
    internalID: `id-for-${title}`,
    title,
    subtitle: "Gallery Week highlights",
    startAt: "2026-10-14T00:00:00Z",
    endAt: "2026-10-18T00:00:00Z",
    heroImage: { url: "https://example.com/event-hero.jpg" },
    itineraries,
  })

  const connection = (nodes: object[]) => ({
    CityGuideEventsConnection: () => ({ edges: nodes.map((node) => ({ node })) }),
  })

  it("renders the static, unpressable section title", async () => {
    renderWithRelay(
      connection([event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])]),
      props
    )

    expect(await screen.findByText("Curated City Guides")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("renders each event's hero image, title, dates and its guides", async () => {
    renderWithRelay(
      connection([
        event("London Art Week", [
          itinerary("chill-vibes-only", "Chill Vibes Only"),
          itinerary("36-hours-in-london", "36 Hours in London"),
        ]),
      ]),
      props
    )

    expect(await screen.findByTestId("event-guide-hero-image")).toHaveProp(
      "src",
      "https://example.com/event-hero.jpg"
    )
    expect(screen.getByText("London Art Week")).toBeOnTheScreen()
    expect(screen.getByText("Gallery Week highlights")).toBeOnTheScreen()
    expect(screen.getByText("October 14-18, 2026")).toBeOnTheScreen()
    expect(await screen.findAllByTestId("event-guide-row")).toHaveLength(2)
    expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.getAllByText("By Casey Lesser")).toHaveLength(2)
  })

  it("renders a group per event", async () => {
    renderWithRelay(
      connection([
        event("London Art Week", [itinerary("a", "A")]),
        event("Frieze Week", [itinerary("b", "B")]),
      ]),
      props
    )

    expect(await screen.findAllByTestId("event-guide-group")).toHaveLength(2)
  })

  it("navigates to the itinerary when a guide is tapped", async () => {
    renderWithRelay(
      connection([event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])]),
      props
    )

    fireEvent.press((await screen.findAllByTestId("event-guide-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })

  // A curated guide is published and so has a slug, but an unpublished one still has to be
  // reachable rather than linking nowhere.
  it("addresses an itinerary with no slug by its id", async () => {
    renderWithRelay(
      connection([event("London Art Week", [itinerary(null, "Unpublished Guide")])]),
      props
    )

    fireEvent.press((await screen.findAllByTestId("event-guide-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/id-for-Unpublished Guide"
    )
  })

  it("hides a guide's image section when it has no hero image", async () => {
    const attachment = itinerary("chill-vibes-only", "Chill Vibes Only")

    renderWithRelay(
      connection([
        event("London Art Week", [
          { ...attachment, itinerary: { ...attachment.itinerary, heroImage: null } },
        ]),
      ]),
      props
    )

    expect(await screen.findByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-image")).not.toBeOnTheScreen()
  })

  it("renders no hero image when the event has none", async () => {
    renderWithRelay(
      connection([{ ...event("London Art Week", [itinerary("a", "A")]), heroImage: null }]),
      props
    )

    expect(await screen.findByText("London Art Week")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-hero-image")).not.toBeOnTheScreen()
  })

  it("renders nothing for a city with no current city guide events", async () => {
    renderWithRelay(connection([]), props)

    // Nothing to await: the section renders null, so assert the tree never gains a group.
    expect(screen.queryAllByTestId("event-guide-group")).toHaveLength(0)
    expect(screen.queryByText("Curated City Guides")).not.toBeOnTheScreen()
  })

  it("skips an event that has no guides", async () => {
    renderWithRelay(connection([event("Empty Event", [])]), props)

    expect(screen.queryAllByTestId("event-guide-group")).toHaveLength(0)
    expect(screen.queryByText("Empty Event")).not.toBeOnTheScreen()
  })
})
