import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

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

  it("renders without a hero image at all", async () => {
    renderWithRelay(
      {
        Itinerary: () => ({ ...ITINERARY, heroImage: null }),
      },
      props
    )

    expect(await screen.findByText("Chill Vibes Only")).toBeOnTheScreen()
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
})
