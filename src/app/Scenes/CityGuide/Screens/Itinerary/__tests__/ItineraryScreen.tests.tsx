import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { RefreshControl } from "react-native"
import { MockPayloadGenerator } from "relay-test-utils"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

const stop = (n: number) => ({
  internalID: `stop-${n}`,
  title: `Stop ${n}`,
  address: null,
  category: "GALLERY",
  note: null,
  imageURL: null,
  latitude: 51.5,
  longitude: -0.1,
  startTime: "11:00am",
  endTime: "4:00pm",
  startAtISO: null,
  endAtISO: null,
  // Left null so no save control query fires: `item` resolving to null is the
  // "not a saveable Artsy entity" case, which is also what the fixture returns today.
  item: null,
})

const ITINERARY = {
  internalID: "chill-vibes-only",
  isCurated: true,
  citySlug: "london-united-kingdom",
  title: "Chill Vibes Only",
  subtitle: "Top picks",
  description: "Our list of recommendations.",
  authorName: "Casey Lesser",
  heroImage: {
    url: "https://example.com/hero.jpg",
  },
  sections: [
    { internalID: "day-1", title: "Day 1 — Easing in", stops: [stop(1), stop(2)] },
    { internalID: "day-2", title: "Day 2 — London Frieze", stops: [stop(3), stop(4)] },
  ],
}

describe("ItineraryScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryScreen })
  const props = { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" }

  it("renders the header and every section", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Day 2 — London Frieze")).toBeTruthy()
  })

  it("numbers stops continuously across sections", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    // Numbering runs 1..N across the whole itinerary rather than restarting per section,
    // so the last number only exists if every earlier section was counted.
    expect(await screen.findByText("4")).toBeTruthy()
    expect(screen.queryByText("5")).toBeNull()
  })

  it("falls back to a positional section title when the server sends none", async () => {
    renderWithRelay(
      {
        Itinerary: () => ({
          ...ITINERARY,
          sections: [{ internalID: "untitled", title: null, stops: [stop(1)] }],
        }),
      },
      props
    )

    expect(await screen.findByText("Day 1")).toBeTruthy()
  })

  it("joins the two server-formatted times into the row's display time", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findAllByText("11:00am-4:00pm")).not.toHaveLength(0)
  })

  it("renders the unavailable state when the itinerary does not resolve", async () => {
    // Resolved at the root: an `Itinerary: () => null` resolver does not null the field,
    // MockPayloadGenerator still generates a default object for it.
    renderWithRelay({ Query: () => ({ itinerary: null }) }, props)

    expect(await screen.findByText("This guide is no longer available.")).toBeTruthy()
    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })

  // The hero asks for a named version rather than a Gemini resize: Gravity sends the
  // versioned URLs it generated but not the original's dimensions, and `resized` scales
  // from those.
  it("uses the hero image url", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByTestId("itinerary-hero-image")).toHaveProp(
      "src",
      "https://example.com/hero.jpg"
    )
  })

  it("hides the hero image section when the itinerary has no image", async () => {
    renderWithRelay({ Itinerary: () => ({ ...ITINERARY, heroImage: null }) }, props)

    expect(await screen.findByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-hero-image")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-hero-scrim")).not.toBeOnTheScreen()
  })

  describe("your own itinerary", () => {
    // `isCurated` is the only ownership signal available: Query.itinerary exposes no
    // "is this mine".
    const own = { ...ITINERARY, isCurated: false }

    it("labels it Your Itinerary and drops the byline", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Your Itinerary")).toBeOnTheScreen()
      expect(screen.queryByText(/^By /)).not.toBeOnTheScreen()
    })

    it("offers the itinerary picker on the map", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByTestId("itinerary-view-toggle"))

      // The picker runs its own query, and renderWithRelay resolves only the screen's.
      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
      view.mockResolveLastOperation({
        Me: () => ({
          itinerariesConnection: {
            edges: [{ node: { internalID: "chill-vibes-only", slug: null, title: "Mine" } }],
          },
        }),
      })

      expect(await screen.findByTestId("itinerary-picker")).toBeOnTheScreen()
    })

    it("shows no stop numbers and no section heading", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      await screen.findByText("Stop 1")

      expect(screen.queryAllByTestId("itinerary-stop-number")).toHaveLength(0)
      expect(screen.queryAllByTestId("itinerary-section-header")).toHaveLength(0)
      expect(screen.queryByText("Day 1 — Easing in")).not.toBeOnTheScreen()
    })
  })

  describe("a curated guide", () => {
    it("keeps its numbering, section headings and byline", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      expect(await screen.findByText("Day 1 — Easing in")).toBeOnTheScreen()
      expect(screen.getByText("By Casey Lesser")).toBeOnTheScreen()
      expect(screen.queryAllByTestId("itinerary-stop-number")).not.toHaveLength(0)
      expect(screen.queryByText("Your Itinerary")).not.toBeOnTheScreen()
    })

    // The picker lists what you own, so on a guide it would navigate away from what you are
    // reading rather than switch between peers.
    it("offers no itinerary picker on the map", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      fireEvent.press(await screen.findByTestId("itinerary-view-toggle"))

      expect(screen.queryByTestId("itinerary-picker")).not.toBeOnTheScreen()
    })
  })

  // `ItineraryStop.image` is the curator's uploaded one, and the app sends none when it
  // creates a stop, so without a fallback every entity-backed stop rendered an empty box.
  describe("a stop's image", () => {
    const withStops = (stops: object[]) => ({
      Itinerary: () => ({
        ...ITINERARY,
        sections: [{ internalID: "day-1", title: "Day 1", stops }],
      }),
    })

    it("uses the uploaded image when the curator gave one", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: { url: "https://example.com/uploaded.jpg" },
            item: {
              __typename: "Show",
              coverImage: { url: "https://example.com/show.jpg" },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/uploaded.jpg"
      )
    })

    it("falls back to a show's cover image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: {
              __typename: "Show",
              coverImage: { url: "https://example.com/show.jpg" },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/show.jpg"
      )
    })

    it("falls back to a fair's image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: { __typename: "Fair", image: { url: "https://example.com/fair.jpg" } },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/fair.jpg"
      )
    })

    // A location has no picture of its own, so the gallery's profile stands in.
    it("falls back to a gallery's profile image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: {
              __typename: "Location",
              partner: {
                slug: "white-cube",
                profile: { image: { url: "https://example.com/gallery.jpg" } },
              },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/gallery.jpg"
      )
    })
  })

  // Refreshed through fetchQuery rather than this query's fetchKey: a network-only re-render
  // would suspend and replace the guide with a spinner.
  describe("pull to refresh", () => {
    it("refetches without unmounting the guide", async () => {
      const view = renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Chill Vibes Only")

      // A curated guide's own Add Full List button fires its own query to check for a
      // same-named itinerary you already own; resolve it so it doesn't count below.
      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, { Me: () => ({ itinerariesConnection: null }) })
        )
      })

      // The RefreshControl element itself does not surface in the tree, so the refresh is
      // fired through the scroll view that owns it.
      act(() => {
        screen.UNSAFE_getByType(RefreshControl).props.onRefresh()
      })

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
      expect(view.env.mock.getAllOperations()[0].request.node.params.name).toBe(
        "ItineraryScreenQuery"
      )

      // Still on screen while the refetch is in flight, rather than replaced by the fallback.
      expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    })
  })
})
