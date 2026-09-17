import { act, screen, within } from "@testing-library/react-native"
import { CityGuideNew } from "app/Scenes/CityGuide/CityGuideNew"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { DefaultMockResolvers } from "app/utils/tests/resolveMostRecentRelayOperation"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/hooks/useLocation", () => ({ useLocation: () => ({ location: null }) }))

describe("CityGuideNew", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("opens on the city you last chose", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    renderWithWrappers(<CityGuideNew />)

    // Queried inside the switcher: the picker's list is mounted too, so the city name
    // appears more than once.
    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("Berlin")
    ).toBeOnTheScreen()
  })

  // Nothing remembered and no location: the map's City Guide lands on New York too.
  it("falls back to New York with nothing remembered", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: null },
    })

    renderWithWrappers(<CityGuideNew />)

    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("New York")
    ).toBeOnTheScreen()
  })

  // No test for the write itself: the picker's rows live inside a Modal and are not
  // reachably distinct from the switcher, so driving a selection is unreliable. The two
  // cases above cover what a user sees.

  describe("the editorial sections", () => {
    /**
     * One current event carrying both a video and an article, which is what the designs show.
     * The flushes matter: the query is issued under a suspense boundary, so it is not pending
     * on the first tick, and the sections only mount once the payload has propagated.
     */
    const resolveWithEditorialContent = async () => {
      await act(async () => {
        await flushPromiseQueue()
      })

      act(() => {
        getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            ...DefaultMockResolvers,
            CityGuideEventsConnection: () => ({
              edges: [
                {
                  node: {
                    internalID: "london-art-week",
                    itineraries: [],
                    video: {
                      internalID: "video-1",
                      playerUrl: "https://player.vimeo.com/video/76979871",
                      width: 352,
                      height: 471,
                      aspectRatio: 0.75,
                    },
                    articles: [
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

      expect(screen.getByText("Curated City Guides")).toBeOnTheScreen()
      expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("city-guide-event-articles")).not.toBeOnTheScreen()
    })
  })
})
