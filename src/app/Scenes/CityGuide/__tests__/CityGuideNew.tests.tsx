import { ActionType, OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, within } from "@testing-library/react-native"
import { CityGuideNew } from "app/Scenes/CityGuide/CityGuideNew"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { DefaultMockResolvers } from "app/utils/tests/resolveMostRecentRelayOperation"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/hooks/useLocation", () => ({ useLocation: () => ({ location: null }) }))

const mockCities = [
  { slug: "new-york-ny-usa", name: "New York", coordinates: { lat: 40.7128, lng: -74.006 } },
  { slug: "berlin-germany", name: "Berlin", coordinates: { lat: 52.52, lng: 13.405 } },
  { slug: "london-united-kingdom", name: "London", coordinates: { lat: 51.5074, lng: -0.1278 } },
]

// The first operation the screen issues: the city list, ahead of the per-city content query.
const resolveCityGuideCities = async (cities: unknown[] = mockCities) => {
  await act(async () => {
    await flushPromiseQueue()
  })

  act(() => {
    getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        ...DefaultMockResolvers,
        Query: () => ({ cityGuideCities: cities }),
      })
    )
  })

  await act(async () => {
    await flushPromiseQueue()
  })
}

describe("CityGuideNew", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("opens on the city you last chose", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities()

    // Queried inside the switcher: the picker's list is mounted too, so the city name
    // appears more than once.
    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("Berlin")
    ).toBeOnTheScreen()
  })

  // Nothing remembered and no location: the map's City Guide lands on New York too.
  it("falls back to New York with nothing remembered", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: null },
    })

    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities()

    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("New York")
    ).toBeOnTheScreen()
  })

  it("lists every city from the query in the picker", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities()

    fireEvent.press(screen.getByTestId("city-guide-city-switcher"))

    // Berlin is selected, so these two only appear in the picker's rows.
    expect(screen.getByText("New York")).toBeOnTheScreen()
    expect(screen.getByText("London")).toBeOnTheScreen()
  })

  it("leaves a city without coordinates out of the picker", async () => {
    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities([
      ...mockCities,
      { slug: "nowhere", name: "Nowhere", coordinates: null },
    ])

    fireEvent.press(screen.getByTestId("city-guide-city-switcher"))

    expect(screen.getByText("London")).toBeOnTheScreen()
    expect(screen.queryByText("Nowhere")).not.toBeOnTheScreen()
  })

  it("shows the error view with a back button when the city list fails to load", async () => {
    renderWithWrappers(<CityGuideNew />)

    await act(async () => {
      await flushPromiseQueue()
    })
    act(() => {
      getMockRelayEnvironment().mock.rejectMostRecentOperation(new Error("network is down"))
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
    expect(screen.getByLabelText("Go back")).toBeOnTheScreen()
  })

  it("shows the error view when the query returns no cities", async () => {
    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities([])

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
  })

  it("refetches the city list on retry after an empty response", async () => {
    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities([])

    fireEvent.press(await screen.findByLabelText("Retry"))
    await resolveCityGuideCities()

    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("New York")
    ).toBeOnTheScreen()
  })

  // No test for the write itself: the picker's rows live inside a Modal and are not
  // reachably distinct from the switcher, so driving a selection is unreliable. The two
  // cases above cover what a user sees.

  it("prefers a valid preselected city slug over the previously selected city", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew citySlug="london-united-kingdom" />)
    await resolveCityGuideCities()

    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("London")
    ).toBeOnTheScreen()
  })

  it("falls back to the previously selected city when the preselected slug is invalid", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew citySlug="not-a-real-city" />)
    await resolveCityGuideCities()

    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("Berlin")
    ).toBeOnTheScreen()
  })

  it("tracks the screen view against the city it opened on", async () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew />)
    await resolveCityGuideCities()

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.screen,
      context_screen_owner_type: OwnerType.cityGuide,
      context_screen_owner_slug: "berlin-germany",
    })
  })

  describe("the forYou query variable", () => {
    const mostRecentVariables = () =>
      getMockRelayEnvironment().mock.getMostRecentOperation().request.variables

    it("is false when the flag is off, even when signed in", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideShowsForYou: false })
      __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "authenticationToken" } })

      renderWithWrappers(<CityGuideNew />)
      await resolveCityGuideCities()

      expect(mostRecentVariables().forYou).toBe(false)
    })

    it("is false when signed out, even when the flag is on", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideShowsForYou: true })
      __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: null } })

      renderWithWrappers(<CityGuideNew />)
      await resolveCityGuideCities()

      expect(mostRecentVariables().forYou).toBe(false)
    })

    it("is true when the flag is on and the viewer is signed in", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideShowsForYou: true })
      __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "authenticationToken" } })

      renderWithWrappers(<CityGuideNew />)
      await resolveCityGuideCities()

      expect(mostRecentVariables().forYou).toBe(true)
    })
  })

  describe("the loading placeholder", () => {
    it("shows a spinner before the query resolves", () => {
      renderWithWrappers(<CityGuideNew />)

      expect(screen.getByTestId("city-guide-new-placeholder")).toBeOnTheScreen()
    })

    it("replaces the spinner with the real sections once the query resolves", async () => {
      renderWithWrappers(<CityGuideNew />)
      await resolveCityGuideCities()

      act(() => {
        getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            ...DefaultMockResolvers,
            Itinerary: () => ({ visibility: "PUBLIC" }),
          })
        )
      })

      await act(async () => {
        await flushPromiseQueue()
      })

      expect(screen.queryByTestId("city-guide-new-placeholder")).not.toBeOnTheScreen()
      expect(screen.getByText("City Guides")).toBeOnTheScreen()
    })
  })

  describe("the editorial sections", () => {
    /**
     * A city with one attached video and one attached article, which is what the designs
     * show. The flushes matter: the query is issued under a suspense boundary, so it is not
     * pending on the first tick, and the sections only mount once the payload has propagated.
     */
    const resolveWithEditorialContent = async ({ withVideo = true } = {}) => {
      await resolveCityGuideCities()

      act(() => {
        getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            ...DefaultMockResolvers,
            Itinerary: () => ({ visibility: "PUBLIC" }),
            City: () => ({
              cityVideos: withVideo
                ? [
                    {
                      internalID: "video-attachment-1",
                      video: {
                        internalID: "video-1",
                        playerUrl: "https://player.vimeo.com/video/76979871",
                      },
                    },
                  ]
                : [],
              cityArticles: [
                {
                  internalID: "attachment-1",
                  position: 0,
                  article: {
                    internalID: "article-1",
                    title: "An Art Lover's Guide to London (headline)",
                    thumbnailTitle: "An Art Lover's Guide to London",
                    byline: "Natalie Stoclet",
                    href: "/article/an-art-lovers-guide-to-london",
                    publishedAt: "July 19, 2026",
                    thumbnailImage: { url: "https://example.com/thumb.jpg" },
                  },
                },
              ],
            }),
          })
        )
      })

      await act(async () => {
        await flushPromiseQueue()
      })
    }

    it("shows the videos and Artsy Editorial sections when the flag is on", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideEditorialContent: true })

      renderWithWrappers(<CityGuideNew />)
      await resolveWithEditorialContent()

      expect(screen.getByTestId("city-guide-event-videos")).toBeOnTheScreen()
      expect(screen.getByTestId("city-guide-event-articles")).toBeOnTheScreen()
    })

    /*
      The same payload as the case above, so this failing means the flag stopped gating rather
      than the data going missing — the guides section proves the screen did render its
      sections at all.
    */
    it("hides both sections when the flag is off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideEditorialContent: false })

      renderWithWrappers(<CityGuideNew />)
      await resolveWithEditorialContent()

      expect(screen.getByText("City Guides")).toBeOnTheScreen()
      expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("city-guide-event-articles")).not.toBeOnTheScreen()
    })

    it("shows nothing for the videos section when the city has no video", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideEditorialContent: true })

      renderWithWrappers(<CityGuideNew />)
      await resolveWithEditorialContent({ withVideo: false })

      expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
      expect(screen.getByTestId("city-guide-event-articles")).toBeOnTheScreen()
    })
  })
})
