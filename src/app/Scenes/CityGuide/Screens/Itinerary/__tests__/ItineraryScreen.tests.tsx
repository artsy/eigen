import { screen } from "@testing-library/react-native"
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
  citySlug: "london-united-kingdom",
  name: "Chill Vibes Only",
  subtitle: "Top picks",
  description: "Our list of recommendations.",
  authorName: "Casey Lesser",
  heroImage: {
    resized: { url: "https://example.com/hero-400.jpg" },
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

  // `heroImage` is a standard Artsy Image, so the header takes the width it draws from
  // Gemini rather than the full-size original.
  it("uses the resized hero image", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByTestId("itinerary-hero-image")).toHaveProp(
      "src",
      "https://example.com/hero-400.jpg"
    )
  })

  it("falls back to the original when there is no resized variant", async () => {
    renderWithRelay(
      {
        Itinerary: () => ({
          ...ITINERARY,
          heroImage: { resized: null, url: "https://example.com/hero.jpg" },
        }),
      },
      props
    )

    expect(await screen.findByTestId("itinerary-hero-image")).toHaveProp(
      "src",
      "https://example.com/hero.jpg"
    )
  })
})
