import { fireEvent, screen } from "@testing-library/react-native"
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
      // The fragment is spread at the query root, so the component receives the whole query
      // response as its `query` prop, the same object relay handed the test renderer.
      Component: (props: any) => <CityGuideEventGuides {...props} query={props} />,
      query: graphql`
        query CityGuideEventGuidesTestQuery($citySlug: String!, $first: Int!)
        @relay_test_operation {
          ...CityGuideEventGuides_query @arguments(citySlug: $citySlug, first: $first)
        }
      `,
      variables: { citySlug: "london-united-kingdom", first: 10 },
    }
  )
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (slug: string | null, name: string, { featured = false } = {}) => ({
    internalID: `id-for-${name}`,
    slug,
    title: name,
    subtitle: `${name} subtitle`,
    authorName: "Casey Lesser",
    featured,
    heroImage: {
      url: "https://example.com/hero-240.jpg",
      featuredUrl: "https://example.com/hero-1024.jpg",
    },
  })

  const connection = (nodes: object[]) => ({
    ItinerariesConnection: () => ({ edges: nodes.map((node) => ({ node })) }),
  })

  it("renders the static, unpressable section title", async () => {
    renderWithRelay(connection([itinerary("chill-vibes-only", "Chill Vibes Only")]), props)

    expect(await screen.findByText("City Guides")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("renders the city's curated guides", async () => {
    renderWithRelay(
      connection([
        itinerary("chill-vibes-only", "Chill Vibes Only"),
        itinerary("36-hours-in-london", "36 Hours in London"),
      ]),
      props
    )

    expect(await screen.findByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.getByText("36 Hours in London")).toBeOnTheScreen()
    expect(screen.getAllByText("By Casey Lesser")).toHaveLength(2)
  })

  it("shows a guide's subtitle above its author", async () => {
    const withoutSubtitle = itinerary("36-hours-in-london", "36 Hours in London")

    renderWithRelay(
      connection([
        itinerary("chill-vibes-only", "Chill Vibes Only"),
        { ...withoutSubtitle, subtitle: null },
      ]),
      props
    )

    expect(await screen.findByText("Chill Vibes Only subtitle")).toBeOnTheScreen()
    expect(screen.queryByText("36 Hours in London subtitle")).not.toBeOnTheScreen()
  })

  it("drops the byline for a guide with no author", async () => {
    const anonymous = itinerary("36-hours-in-london", "36 Hours in London")

    renderWithRelay(
      connection([
        itinerary("chill-vibes-only", "Chill Vibes Only"),
        { ...anonymous, authorName: "" },
      ]),
      props
    )

    await screen.findByText("36 Hours in London")

    expect(screen.getAllByText("By Casey Lesser")).toHaveLength(1)
  })

  it("navigates to the itinerary when a guide is tapped", async () => {
    renderWithRelay(connection([itinerary("chill-vibes-only", "Chill Vibes Only")]), props)

    fireEvent.press((await screen.findAllByTestId("event-guide-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })

  it("tracks the tap on a guide row", async () => {
    renderWithRelay(connection([itinerary("chill-vibes-only", "Chill Vibes Only")]), props)

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
    renderWithRelay(connection([itinerary(null, "Unpublished Guide")]), props)

    fireEvent.press((await screen.findAllByTestId("event-guide-row"))[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/id-for-Unpublished Guide"
    )
  })

  it("shows a placeholder when a guide has no hero image", async () => {
    renderWithRelay(
      connection([{ ...itinerary("chill-vibes-only", "Chill Vibes Only"), heroImage: null }]),
      props
    )

    expect(await screen.findByTestId("event-guide-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-image")).not.toBeOnTheScreen()
    expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
  })

  it("renders nothing for a city with no curated guides", async () => {
    renderWithRelay(connection([]), props)

    // Nothing to await: the section renders null, so assert the tree never gains the list.
    expect(screen.queryByTestId("city-guides-list")).not.toBeOnTheScreen()
    expect(screen.queryByText("City Guides")).not.toBeOnTheScreen()
  })

  describe("the featured guide", () => {
    it("leads the section whatever position it came back in", async () => {
      renderWithRelay(
        connection([
          itinerary("chill-vibes-only", "Chill Vibes Only"),
          itinerary("36-hours-in-london", "36 Hours in London", { featured: true }),
        ]),
        props
      )

      const featured = await screen.findByTestId("event-guide-featured")

      expect(screen.getByTestId("event-guide-featured-image")).toHaveProp(
        "src",
        "https://example.com/hero-1024.jpg"
      )
      // The flagged guide is the only one opened up; the other stays a plain row.
      expect(screen.getAllByTestId("event-guide-row")).toHaveLength(1)

      fireEvent.press(featured)

      expect(navigate).toHaveBeenCalledWith(
        "/city-guide/london-united-kingdom/itinerary/36-hours-in-london"
      )
    })

    it("falls back to a placeholder with no hero image", async () => {
      renderWithRelay(
        connection([
          {
            ...itinerary("chill-vibes-only", "Chill Vibes Only", { featured: true }),
            heroImage: null,
          },
        ]),
        props
      )

      expect(await screen.findByTestId("event-guide-featured-no-image")).toBeOnTheScreen()
      expect(screen.queryByTestId("event-guide-featured-image")).not.toBeOnTheScreen()
      expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    })

    // Nothing is promoted by position alone: with no flag the section is all plain rows.
    it("is absent when no guide is flagged", async () => {
      renderWithRelay(
        connection([
          itinerary("chill-vibes-only", "Chill Vibes Only"),
          itinerary("36-hours-in-london", "36 Hours in London"),
        ]),
        props
      )

      expect(await screen.findAllByTestId("event-guide-row")).toHaveLength(2)
      expect(screen.queryByTestId("event-guide-featured")).not.toBeOnTheScreen()
    })
  })
})
