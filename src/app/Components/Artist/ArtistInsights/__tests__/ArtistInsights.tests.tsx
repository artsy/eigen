import { screen } from "@testing-library/react-native"
import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { ArtistInsightsFragmentContainer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
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
    Component: ({ artist }) => {
      if (!artist) {
        return null
      }
      return <ArtistInsightsFragmentContainer artist={artist} />
    },
    query: graphql`
      query ArtistInsightsTestsQuery @relay_test_operation {
        artist(id: "some-id") {
          ...ArtistInsights_artist
        }
      }
    `,
  })

  it("renders auction results header when artist has auction lots", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
        auctionResultsConnection: {
          totalCount: 5,
          edges: [
            {
              node: {
                id: "auction-result-1",
                internalID: "auction-internal-1",
                isUpcoming: false,
                saleDate: "2024-01-01",
              },
            },
          ],
        },
        pastAuctionResults: { totalCount: 5 },
        upcomingAuctionResults: { totalCount: 0 },
      }),
    })

    expect(screen.getByText("Auction Results")).toBeOnTheScreen()
  })

  it("renders empty state when artist has no auction lots", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: false },
      }),
    })

    expect(
      screen.getByText(/There are currently no auction results for this artist/)
    ).toBeOnTheScreen()
  })

  it("renders section titles for upcoming and past auctions", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
        auctionResultsConnection: {
          totalCount: 3,
          edges: [
            {
              node: {
                id: "auction-result-1",
                internalID: "auction-internal-1",
                isUpcoming: true,
                saleDate: "2025-01-01",
              },
            },
            {
              node: {
                id: "auction-result-2",
                internalID: "auction-internal-2",
                isUpcoming: false,
                saleDate: "2024-01-01",
              },
            },
          ],
        },
        pastAuctionResults: { totalCount: 1 },
        upcomingAuctionResults: { totalCount: 1 },
      }),
    })

    expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
    expect(screen.getByText("Past Auctions")).toBeOnTheScreen()
  })

  it("tracks an auction page view when artist insights is current tab", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
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
