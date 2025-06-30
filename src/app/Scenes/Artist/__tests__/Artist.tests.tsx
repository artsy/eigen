import { act, screen } from "@testing-library/react-native"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import { isEqual } from "lodash"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

jest.unmock("react-tracking")

type ArtistQueries =
  | "SearchCriteriaQuery"
  | "ArtistAboveTheFoldQuery"
  | "ArtistBelowTheFoldQuery"
  | "MarketStatsQuery"

describe("Artist", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    act(() => {
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
    renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), { includeNavigation: true })

    mockMostRecentOperation("ArtistAboveTheFoldQuery")
    mockMostRecentOperation("ArtistBelowTheFoldQuery", {
      ArtistInsight() {
        return { entities: ["test"] }
      },
    })
    mockMostRecentOperation("MarketStatsQuery")

    await flushPromiseQueue()

    expect(screen.getByText("Artworks")).toBeTruthy()
    expect(screen.getByText("Insights")).toBeTruthy()
    expect(screen.getByText("Overview")).toBeTruthy()
  })

  it("tracks a page view", async () => {
    renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), { includeNavigation: true })

    mockMostRecentOperation("ArtistAboveTheFoldQuery")

    await flushPromiseQueue()

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, {
      context_screen: "Artist",
      context_screen_owner_id: '<mock-value-for-field-"internalID">',
      context_screen_owner_slug: '<mock-value-for-field-"slug">',
      context_screen_owner_type: "Artist",
    })
  })

  it("displays follow button for artist with formatted follow count", () => {
    renderWithHookWrappersTL(<TestWrapper />, getRelayEnvironment(), { includeNavigation: true })

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          isFollowed: true,
          counts: {
            follows: 22000,
          },
        }
      },
    })

    expect(screen.getByText(/Following/)).toBeTruthy()
    expect(screen.getByText("22.0K")).toBeTruthy()
  })
})
