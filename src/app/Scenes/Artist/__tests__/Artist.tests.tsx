import { act, screen } from "@testing-library/react-native"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
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
