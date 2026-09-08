import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CityEventListScreen } from "app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// `CityEventListScreen` resolves two connections behind `@include` in one query and unmasks
// each with its own plural `useFragment`. That takes an extra render pass to settle beyond
// what `renderWithRelay`'s synchronous resolve flushes (the same reason
// `RecentlyViewed.tests.tsx` awaits `waitForElementToBeRemoved` after its own renderWithRelay
// call), so every assertion here waits for the title rather than reading the tree immediately.
describe("CityEventListScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityEventListScreen })

  it("titles itself for the shows section", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "shows" })

    expect(await screen.findAllByText("Current Shows")).not.toHaveLength(0)
  })

  it("titles itself for the fairs section", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "fairs" })

    expect(await screen.findAllByText("Current Fairs")).not.toHaveLength(0)
  })

  it("titles itself for the opening section", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "opening" })

    expect(await screen.findAllByText("Opening Soon")).not.toHaveLength(0)
  })

  it("renders a row for every show the query returns", async () => {
    const shows = [
      { name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } },
      { name: "Tracey Emin", location: { postalCode: "EC1M 5RR" } },
    ]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    // Derived from the data, not hardcoded, so growing the fixture cannot produce a false alarm.
    await waitFor(() => expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length))
  })

  it("collapses a section when its header is pressed", async () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    await waitFor(() => expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length))

    fireEvent.press(screen.getAllByTestId("city-event-section-header")[0])

    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
    expect(screen.getAllByTestId("city-event-section-header").length).toBeGreaterThan(0)
  })

  it("falls back to shows for an unrecognised route section", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "not-a-section" })

    await screen.findAllByText("Current Shows")
  })

  it("falls back to shows for a missing route section", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "" })

    await screen.findAllByText("Current Shows")
  })

  it("groups fairs by postcode, not only shows", async () => {
    const fairs = [
      { name: "Frieze London", location: { postalCode: "EC1M 5RR" } },
      { name: "1-54", location: { postalCode: "W1S 4BS" } },
    ]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          fairsConnection: {
            totalCount: fairs.length,
            edges: fairs.map((node) => ({ node })),
          },
        }),
      },
      { citySlug: "london-united-kingdom", section: "fairs" }
    )

    // Two different outward codes, so two named sections rather than one fallback.
    await waitFor(() =>
      expect(screen.getAllByTestId("city-event-section-header")).toHaveLength(fairs.length)
    )
    expect(screen.queryByText("More in London")).toBeNull()
  })

  it("keeps the footer count on the fetched total when a section is collapsed", async () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: 143, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    await waitFor(() => expect(screen.getAllByTestId("city-event-section-header")).toHaveLength(1))

    fireEvent.press(screen.getAllByTestId("city-event-section-header")[0])

    // Would read "Showing 0 of 143" if the count came from the flattened visible rows.
    expect(screen.getByText(`Showing ${shows.length} of 143`)).toBeTruthy()
  })

  it("says so when there are more events than one page", async () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: 143, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    await screen.findByText(/of 143/)
  })

  it("tracks a screen view for the section it renders", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "fairs" })

    await screen.findAllByText("Current Fairs")

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ context_screen_owner_slug: "london-united-kingdom" })
    )
  })

  it("shows a map toggle when there are places to map, and switches list/map mode when pressed", async () => {
    const shows = [
      {
        name: "Frida Kahlo",
        location: { postalCode: "EC1M 5RR", coordinates: { lat: 51.5, lng: -0.1 } },
      },
    ]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    const toggle = await screen.findByTestId("city-event-list-view-toggle")
    expect(await screen.findAllByTestId("city-event-row")).toHaveLength(shows.length)

    fireEvent.press(toggle)

    // The list unmounts in map mode, and back means "back to the list" rather than leaving
    // the screen — no separate route to land on.
    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
    expect(screen.getByText("Current Shows")).toBeTruthy()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "cityGuideShowMap",
        action_type: "tap",
        owner_type: "CityGuide",
        owner_slug: "london-united-kingdom",
      })
    )

    fireEvent.press(screen.getByTestId("city-event-list-view-toggle"))

    expect(await screen.findAllByTestId("city-event-row")).toHaveLength(shows.length)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "cityGuideShowList" })
    )
  })

  it("hides the map toggle when nothing has valid coordinates", async () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    await screen.findAllByTestId("city-event-row")

    expect(screen.queryByTestId("city-event-list-view-toggle")).toBeNull()
  })
})
