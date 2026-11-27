import { Tabs } from "@artsy/palette-mobile"
import { act, screen, waitFor } from "@testing-library/react-native"
import { artistInsightsQuery } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import { isEqual } from "lodash"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

jest.unmock("react-tracking")

jest.mock("app/utils/queryPrefetching", () => ({
  usePrefetch: jest.fn(() => jest.fn()),
  prefetchQuery: jest.fn(),
}))

type ArtistQueries =
  | "SearchCriteriaQuery"
  | "ArtistAboveTheFoldQuery"
  | "ArtistBelowTheFoldQuery"
  | "MarketStatsQuery"
  | "ArtistAboutQuery"

describe("Artist", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  async function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    await act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ID({ path }) {
            // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
            if (isEqual(path, ["artist", "id"])) {
              return "artist-id"
            }
          },
          ...mockResolvers,
        })
        return result
      })
    })
  }

  const TestWrapper = (props: Record<string, any>) => (
    <ArtistQueryRenderer artistID="ignored" environment={mockEnvironment} {...props} />
  )

  it("should render all tabs", async () => {
    await renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), {
      includeNavigation: true,
    })

    await mockMostRecentOperation("ArtistAboveTheFoldQuery")
    await mockMostRecentOperation("ArtistBelowTheFoldQuery", {
      ArtistInsight() {
        return { entities: ["test"] }
      },
    })
    await mockMostRecentOperation("ArtistAboutQuery")

    await flushPromiseQueue()

    expect(screen.getByText("Artworks")).toBeTruthy()
    expect(screen.getByText("Insights")).toBeTruthy()
    expect(screen.getByText("Overview")).toBeTruthy()
  })

  describe("AREnableArtistStory", () => {
    const requestedVariables = () => mockEnvironment.mock.getMostRecentOperation().request.variables

    it("leaves the Story out of the above-the-fold query with AREnableArtistStory off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: false })
      await renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), {
        includeNavigation: true,
      })

      expect(requestedVariables()).toMatchObject({ enableArtistStory: false })
    })

    it("asks for the Story with AREnableArtistStory on", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: true })
      await renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), {
        includeNavigation: true,
      })

      expect(requestedVariables()).toMatchObject({ enableArtistStory: true })
    })
  })

  describe("Auction Results tab", () => {
    const renderArtist = async (props: Record<string, any> = {}, auctionLots = false) => {
      await renderWithHookWrappersTL(<TestWrapper {...props} />, getRelayEnvironment(), {
        includeNavigation: true,
      })

      await mockMostRecentOperation("ArtistAboveTheFoldQuery", {
        ArtistStatuses: () => ({ auctionLots }),
      })
    }

    // The mocked tab view renders every tab and ignores the initial one, so read the prop instead
    const initialTabName = () => {
      const calls = tabsWithHeaderSpy.mock.calls
      return calls[calls.length - 1][0].initialTabName
    }

    const insightsPrefetched = () =>
      (prefetchQuery as jest.Mock).mock.calls.some(([args]) => args.query === artistInsightsQuery)

    let tabsWithHeaderSpy: jest.SpyInstance

    beforeEach(() => {
      tabsWithHeaderSpy = jest.spyOn(Tabs, "TabsWithHeader")
    })

    afterEach(() => {
      tabsWithHeaderSpy.mockRestore()
    })

    describe("with AREnableArtistStory on", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: true })
      })

      it("shows the tab when the artist has auction lots", async () => {
        await renderArtist({}, true)

        expect(await screen.findByText("Insights")).toBeOnTheScreen()
      })

      it("hides the tab when the artist has no auction lots", async () => {
        await renderArtist({}, false)

        expect(await screen.findByText("Artworks")).toBeOnTheScreen()
        expect(screen.getByText("Overview")).toBeOnTheScreen()
        expect(screen.queryByText("Insights")).not.toBeOnTheScreen()
      })

      it("prefetches the Auction Results query when the artist has auction lots", async () => {
        await renderArtist({}, true)

        await waitFor(() => expect(insightsPrefetched()).toBe(true))
      })

      it("skips the Auction Results prefetch when the artist has no auction lots", async () => {
        await renderArtist({}, false)

        expect(await screen.findByText("Artworks")).toBeOnTheScreen()
        expect(prefetchQuery).toHaveBeenCalled()
        expect(insightsPrefetched()).toBe(false)
      })

      it("opens on Artworks for an auction results link when the tab is hidden", async () => {
        await renderArtist({ initialTab: "Insights" }, false)

        expect(await screen.findByText("Artworks")).toBeOnTheScreen()
        expect(initialTabName()).toBe("Artworks")
      })

      it("opens on Auction Results for an auction results link when the tab is shown", async () => {
        await renderArtist({ initialTab: "Insights" }, true)

        expect(await screen.findByText("Insights")).toBeOnTheScreen()
        expect(initialTabName()).toBe("Insights")
      })
    })

    describe("with AREnableArtistStory off", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: false })
      })

      it("shows the tab for an artist without auction lots", async () => {
        await renderArtist({}, false)

        expect(await screen.findByText("Insights")).toBeOnTheScreen()
      })

      it("prefetches the Auction Results query for an artist without auction lots", async () => {
        await renderArtist({}, false)

        await waitFor(() => expect(insightsPrefetched()).toBe(true))
      })

      it("opens on Auction Results for an auction results link", async () => {
        await renderArtist({ initialTab: "Insights" }, false)

        expect(await screen.findByText("Insights")).toBeOnTheScreen()
        expect(initialTabName()).toBe("Insights")
      })
    })
  })

  it("tracks a page view", async () => {
    await renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), {
      includeNavigation: true,
    })

    await mockMostRecentOperation("ArtistAboveTheFoldQuery")

    await flushPromiseQueue()

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, {
      context_screen: "Artist",
      context_screen_owner_id: '<mock-value-for-field-"internalID">',
      context_screen_owner_slug: '<mock-value-for-field-"slug">',
      context_screen_owner_type: "Artist",
    })
  })
})
