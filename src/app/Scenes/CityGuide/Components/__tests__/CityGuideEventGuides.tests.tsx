import { fireEvent, screen, within } from "@testing-library/react-native"
import { CityGuideEventGuidesTestQuery } from "__generated__/CityGuideEventGuidesTestQuery.graphql"
import { CityGuideEventGuides } from "app/Scenes/CityGuide/Components/CityGuideEventGuides"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("CityGuideEventGuides", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventGuidesTestQuery, { citySlug: string }>(
    {
      // The query fragment is spread at the query root, so the component receives the whole
      // query response as its `query` prop, the same object relay handed the test renderer.
      Component: (props: any) => <CityGuideEventGuides {...props} query={props} />,
      query: graphql`
        query CityGuideEventGuidesTestQuery($citySlug: String!, $first: Int!)
        @relay_test_operation {
          city(slug: $citySlug) {
            ...CityGuideEventGuides_city @arguments(first: $first)
          }
          ...CityGuideEventGuides_query @arguments(citySlug: $citySlug, first: $first)
        }
      `,
      variables: { citySlug: "london-united-kingdom", first: 10 },
    }
  )
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

  /** A curated itinerary as returned by the city-wide `itinerariesConnection`, not an event's. */
  const cityItinerary = (internalID: string, slug: string | null, name: string) => ({
    internalID,
    slug,
    title: name,
    authorName: "Casey Lesser",
    heroImage: { url: "https://example.com/hero-240.jpg" },
  })

  const connection = (eventNodes: object[], cityItineraryNodes: object[] = []) => ({
    CityGuideEventsConnection: () => ({ edges: eventNodes.map((node) => ({ node })) }),
    ItinerariesConnection: () => ({ edges: cityItineraryNodes.map((node) => ({ node })) }),
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

  it("tracks the tap on a guide row", async () => {
    renderWithRelay(
      connection([event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])]),
      props
    )

    fireEvent.press((await screen.findAllByTestId("event-guide-row"))[0])

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedExploreGroup",
        context_module: "cityGuideCard",
        context_screen_owner_type: "cityGuide",
        context_screen_owner_slug: "london-united-kingdom",
        destination_screen_owner_type: "cityGuideGuide",
        destination_screen_owner_id: "id-for-Chill Vibes Only",
        destination_screen_owner_slug: "chill-vibes-only",
      })
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

  it("shows a placeholder when a guide has no hero image", async () => {
    const attachment = itinerary("chill-vibes-only", "Chill Vibes Only")

    renderWithRelay(
      connection([
        event("London Art Week", [
          { ...attachment, itinerary: { ...attachment.itinerary, heroImage: null } },
        ]),
      ]),
      props
    )

    expect(await screen.findByTestId("event-guide-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-image")).not.toBeOnTheScreen()
    expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
  })

  it("shows a placeholder when the event has no hero image", async () => {
    renderWithRelay(
      connection([{ ...event("London Art Week", [itinerary("a", "A")]), heroImage: null }]),
      props
    )

    expect(await screen.findByTestId("event-guide-hero-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-hero-image")).not.toBeOnTheScreen()
    expect(screen.getByText("London Art Week")).toBeOnTheScreen()
  })

  it("renders nothing for a city with no events and no curated guides", async () => {
    renderWithRelay(connection([]), props)

    // Nothing to await: the section renders null, so assert the tree never gains a group.
    expect(screen.queryAllByTestId("event-guide-group")).toHaveLength(0)
    expect(screen.queryByText("Curated City Guides")).not.toBeOnTheScreen()
  })

  /*
    A city's curated guides come from their own query and are filtered to the city by
    Gravity — they do not depend on an event being on. Bailing on the event list alone hid
    them for the whole gap between one event ending and the next starting.
  */
  it("still renders the city's curated guides when no event is on", async () => {
    renderWithRelay(
      connection([], [cityItinerary("id-for-other", "off-the-beaten-path", "Off the Beaten Path")]),
      props
    )

    const otherGuides = await screen.findByTestId("city-other-guides")

    expect(within(otherGuides).getByText("Off the Beaten Path")).toBeOnTheScreen()
    expect(screen.getByText("Curated City Guides")).toBeOnTheScreen()
    expect(screen.queryAllByTestId("event-guide-group")).toHaveLength(0)
  })

  it("skips an event that has no guides", async () => {
    renderWithRelay(connection([event("Empty Event", [])]), props)

    expect(screen.queryAllByTestId("event-guide-group")).toHaveLength(0)
    expect(screen.queryByText("Empty Event")).not.toBeOnTheScreen()
  })

  describe("the city's other curated guides", () => {
    it("renders below the event groups", async () => {
      renderWithRelay(
        connection(
          [event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])],
          [cityItinerary("id-for-other", "off-the-beaten-path", "Off the Beaten Path")]
        ),
        props
      )

      const otherGuides = await screen.findByTestId("city-other-guides")

      expect(within(otherGuides).getByText("Off the Beaten Path")).toBeOnTheScreen()
    })

    it("excludes an itinerary already attached to a shown event", async () => {
      renderWithRelay(
        connection(
          [event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])],
          [cityItinerary("id-for-Chill Vibes Only", "chill-vibes-only", "Chill Vibes Only")]
        ),
        props
      )

      await screen.findByText("London Art Week")

      expect(screen.getAllByText("Chill Vibes Only")).toHaveLength(1)
      expect(screen.queryByTestId("city-other-guides")).not.toBeOnTheScreen()
    })

    it("renders nothing when the city has no other curated itineraries", async () => {
      renderWithRelay(
        connection([event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])]),
        props
      )

      await screen.findByText("London Art Week")

      expect(screen.queryByTestId("city-other-guides")).not.toBeOnTheScreen()
    })

    it("navigates to the itinerary when tapped", async () => {
      renderWithRelay(
        connection(
          [event("London Art Week", [itinerary("chill-vibes-only", "Chill Vibes Only")])],
          [cityItinerary("id-for-other", "off-the-beaten-path", "Off the Beaten Path")]
        ),
        props
      )

      const otherGuides = await screen.findByTestId("city-other-guides")

      fireEvent.press(within(otherGuides).getByTestId("event-guide-row"))

      expect(navigate).toHaveBeenCalledWith(
        "/city-guide/london-united-kingdom/itinerary/off-the-beaten-path"
      )
    })
  })
})
