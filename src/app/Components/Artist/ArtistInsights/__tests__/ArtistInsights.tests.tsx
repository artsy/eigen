import { screen } from "@testing-library/react-native"
import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { ArtistInsights } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { ArtistInsightsAuctionResultsPaginationContainer } from "app/Components/Artist/ArtistInsights/ArtistInsightsAuctionResults"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

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
  const { renderWithRelay } = setupTestWrapper<ArtistInsightsTestsQuery>({
    Component: ({ artist }) => <ArtistInsights artist={artist!} />,
    query: graphql`
      query ArtistInsightsTestsQuery @relay_test_operation {
        artist(id: "some-id") {
          ...ArtistInsights_artist
        }
      }
    `,
  })

  it("renders list auction results", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
      }),
    })

    expect(
      screen.UNSAFE_queryAllByType(ArtistInsightsAuctionResultsPaginationContainer)
    ).toHaveLength(1)
  })

  it("tracks an auction page view when artist insights is current tab", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
      }),
    })

    expect(trackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_id: "artist-id",
      context_screen_owner_slug: "artist-slug",
      context_screen_owner_type: "artistAuctionResults",
    })
  })
})
