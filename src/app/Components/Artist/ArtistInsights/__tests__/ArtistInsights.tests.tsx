import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { ArtistInsights } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { ArtistInsightsAuctionResultsPaginationContainer } from "app/Components/Artist/ArtistInsights/ArtistInsightsAuctionResults"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("react-native-collapsible-tab-view", () => {
  const getMockCollapsibleTabs =
    require("app/utils/tests/getMockCollapsibleTabView").getMockCollapsibleTabs
  return {
    ...getMockCollapsibleTabs(),
    useFocusedTab: () => "Insights",
  }
})

// eslint-disable-next-line react-hooks/rules-of-hooks
const trackEvent = useTracking().trackEvent

describe("ArtistInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsights_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.artist) {
          return null
        }
        return <ArtistInsights artist={props.artist} />
      }}
    />
  )

  it("renders list auction results", async () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
      }),
    })

    await flushPromiseQueue()

    // now safe to assert
    const auctionResults = view.root.findAllByType(
      ArtistInsightsAuctionResultsPaginationContainer
    )
    expect(auctionResults.length).toEqual(1)
  })

  it("tracks an auction page view when artist insights is current tab", async () => {
    renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    await flushPromiseQueue()

    expect(trackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_id: "internalID-1",
      context_screen_owner_slug: "slug-1",
      context_screen_owner_type: "artistAuctionResults",
    })
  })
})
