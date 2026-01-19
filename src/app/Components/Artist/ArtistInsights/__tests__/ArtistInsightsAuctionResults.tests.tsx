import { screen } from "@testing-library/react-native"
import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import { ArtistInsightsFragmentContainer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("react-native-collapsible-tab-view", () => {
  const getMockCollapsibleTabs =
    require("app/utils/tests/getMockCollapsibleTabView").getMockCollapsibleTabs
  return {
    ...getMockCollapsibleTabs(),
    useFocusedTab: () => "Insights",
  }
})

describe("ArtistInsightsAuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistInsightsAuctionResultsTestsQuery>({
    Component: ({ artist }) => {
      if (!artist) {
        return null
      }
      return <ArtistInsightsFragmentContainer artist={artist} />
    },
    query: graphql`
      query ArtistInsightsAuctionResultsTestsQuery @relay_test_operation {
        artist(id: "some-id") {
          ...ArtistInsights_artist
        }
      }
    `,
  })

  describe("Upcoming auction results", () => {
    it("are shown when upcoming auction results are available", () => {
      renderWithRelay({
        Artist: () => ({
          internalID: "artist-id",
          slug: "artist-slug",
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 7,
            edges: [
              {
                node: {
                  id: "upcoming-1",
                  internalID: "upcoming-internal-1",
                  isUpcoming: true,
                  saleDate: "2025-06-01",
                },
              },
              {
                node: {
                  id: "upcoming-2",
                  internalID: "upcoming-internal-2",
                  isUpcoming: true,
                  saleDate: "2025-06-02",
                },
              },
              {
                node: {
                  id: "past-1",
                  internalID: "past-internal-1",
                  isUpcoming: false,
                  saleDate: "2024-01-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 2 },
          pastAuctionResults: { totalCount: 5 },
        }),
      })

      expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
    })

    it("are hidden when no upcoming auction results are available", () => {
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
                  id: "past-1",
                  internalID: "past-internal-1",
                  isUpcoming: false,
                  saleDate: "2024-01-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 0 },
          pastAuctionResults: { totalCount: 5 },
        }),
      })

      expect(screen.queryByText("Upcoming Auctions")).not.toBeOnTheScreen()
    })
  })

  describe("Past auction results", () => {
    it("are shown when past auction results are available", () => {
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
                  id: "past-1",
                  internalID: "past-internal-1",
                  isUpcoming: false,
                  saleDate: "2024-01-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 0 },
          pastAuctionResults: { totalCount: 5 },
        }),
      })

      expect(screen.getByText("Past Auctions")).toBeOnTheScreen()
    })

    it("are hidden when no past auction results are available", () => {
      renderWithRelay({
        Artist: () => ({
          internalID: "artist-id",
          slug: "artist-slug",
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 2,
            edges: [
              {
                node: {
                  id: "upcoming-1",
                  internalID: "upcoming-internal-1",
                  isUpcoming: true,
                  saleDate: "2025-06-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 2 },
          pastAuctionResults: { totalCount: 0 },
        }),
      })

      expect(screen.queryByText("Past Auctions")).not.toBeOnTheScreen()
    })
  })

  it("renders zero state when no auction results match filters", () => {
    renderWithRelay({
      Artist: () => ({
        id: "artist-relay-id",
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: true },
        auctionResultsConnection: {
          totalCount: 0,
          edges: [],
        },
        upcomingAuctionResults: { totalCount: 0 },
        pastAuctionResults: { totalCount: 0 },
      }),
    })

    expect(screen.getByText(/No results found/i)).toBeOnTheScreen()
  })

  it("renders the empty state when there are no auction lots", () => {
    renderWithRelay({
      Artist: () => ({
        internalID: "artist-id",
        slug: "artist-slug",
        statuses: { auctionLots: false },
      }),
    })

    expect(
      screen.getByText(/There are currently no auction results for this artist/i)
    ).toBeOnTheScreen()
    expect(screen.queryByText("Auction Results")).not.toBeOnTheScreen()
  })

  describe("Header content", () => {
    it("renders the results string when totalCount is equal to 1", () => {
      renderWithRelay({
        Artist: () => ({
          internalID: "artist-id",
          slug: "artist-slug",
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 1,
            edges: [
              {
                node: {
                  id: "past-1",
                  internalID: "past-internal-1",
                  isUpcoming: false,
                  saleDate: "2024-01-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 0 },
          pastAuctionResults: { totalCount: 1 },
        }),
      })

      // The header shows "1 result • Sorted by most recent sale date"
      expect(screen.getByText(/1 result • Sorted by/i)).toBeOnTheScreen()
    })

    it("renders the results string when totalCount is greater than 1", () => {
      renderWithRelay({
        Artist: () => ({
          internalID: "artist-id",
          slug: "artist-slug",
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 10,
            edges: [
              {
                node: {
                  id: "past-1",
                  internalID: "past-internal-1",
                  isUpcoming: false,
                  saleDate: "2024-01-01",
                },
              },
            ],
          },
          upcomingAuctionResults: { totalCount: 0 },
          pastAuctionResults: { totalCount: 10 },
        }),
      })

      // The header shows "10 results • Sorted by most recent sale date"
      expect(screen.getByText(/10 results • Sorted by/i)).toBeOnTheScreen()
    })
  })
})
