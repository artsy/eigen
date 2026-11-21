import { screen } from "@testing-library/react-native"
import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import { ArtistInsightsAuctionResultsPaginationContainer } from "app/Components/Artist/ArtistInsights/ArtistInsightsAuctionResults"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { mockEdges } from "app/utils/tests/mockEdges"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtistInsightsAuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "auctionResult",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => (
    <QueryRenderer<ArtistInsightsAuctionResultsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsAuctionResultsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsightsAuctionResults_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          return (
            <ArtworkFiltersStoreProvider
              runtimeModel={{
                ...getArtworkFiltersModel(),
                ...initialData,
              }}
            >
              <ArtistInsightsAuctionResultsPaginationContainer
                artist={props.artist}
                scrollToTop={() => {
                  console.log("do nothing")
                }}
                openFilterModal={() => {}}
              />
            </ArtworkFiltersStoreProvider>
          )
        }
        return null
      }}
    />
  )

  describe("Upcoming auction results", () => {
    it("are shown when upcoming auction results are available", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({ statuses: { auctionLots: true } }),
        AuctionResultConnection: (context) => {
          if (context.alias === "upcomingAuctionResults") {
            return {
              totalCount: 2,
              edges: mockEdges(2),
            }
          }
          return {
            totalCount: 5,
            edges: mockEdges(5),
          }
        },
      })

      expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
      expect(screen.getByText("Past Auctions")).toBeOnTheScreen()
    })

    it("are hidden when no upcoming auction results are available", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({ statuses: { auctionLots: true } }),
        AuctionResultConnection: (context) => {
          if (context.alias === "upcomingAuctionResults") {
            return {
              totalCount: 0,
              edges: mockEdges(0),
            }
          }
          return {
            totalCount: 5,
            edges: mockEdges(5),
          }
        },
      })

      expect(screen.getByText("Past Auctions")).toBeOnTheScreen()
      expect(screen.queryByText("Upcoming Auctions")).not.toBeOnTheScreen()
    })
  })

  describe("Past auction reuslt", () => {
    it("are shown when past auction results are available", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({ statuses: { auctionLots: true } }),
        AuctionResultConnection: (context) => {
          if (context.alias === "pastAuctionResults") {
            return {
              totalCount: 2,
              edges: mockEdges(2),
            }
          }
          return {
            totalCount: 5,
            edges: mockEdges(5),
          }
        },
      })

      expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
      expect(screen.getByText("Past Auctions")).toBeOnTheScreen()
    })

    it("are hidden when no past auction results are available", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({ statuses: { auctionLots: true } }),
        AuctionResultConnection: (context) => {
          if (context.alias === "pastAuctionResults") {
            return {
              totalCount: 0,
              edges: mockEdges(0),
            }
          }
          return {
            totalCount: 5,
            edges: mockEdges(5),
          }
        },
      })

      expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
      expect(screen.queryByText("Past Auctions")).not.toBeOnTheScreen()
    })
  })

  it("renders FilteredArtworkGridZeroState when no auction results are available", () => {
    renderWithWrappers(<TestRenderer initialData={initialState} />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        statuses: { auctionLots: true },
        auctionResultsConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    expect(screen.getByText(/No results found/)).toBeOnTheScreen()
    expect(screen.queryByText("Past Auctions")).not.toBeOnTheScreen()
  })

  it("renders the empty state when there are no auction lots", () => {
    renderWithWrappers(<TestRenderer initialData={initialState} />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({ statuses: { auctionLots: false } }),
    })

    expect(
      screen.getByText("There are currently no auction results for this artist.")
    ).toBeOnTheScreen()
    expect(screen.queryByText("Auction Results")).not.toBeOnTheScreen()
  })

  describe("ListHeaderComponent", () => {
    it("renders the results string when totalCount is equal to 1", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 1,
            edges: mockEdges(1),
          },
        }),
      })

      expect(screen.getByText("1 result • Sorted by most recent sale date")).toBeOnTheScreen()
    })

    it("renders the results string when totalCount is greater than 1", () => {
      renderWithWrappers(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 10,
            edges: mockEdges(10),
          },
        }),
      })
      expect(screen.getByText("10 results • Sorted by most recent sale date")).toBeOnTheScreen()
    })
  })
})
