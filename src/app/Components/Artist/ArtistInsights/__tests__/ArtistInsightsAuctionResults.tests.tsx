import { Text } from "@artsy/palette-mobile"
import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import { ArtistInsightsAuctionResultsPaginationContainer } from "app/Components/Artist/ArtistInsights/ArtistInsightsAuctionResults"
import { ArtistInsightsEmpty } from "app/Components/Artist/ArtistInsights/ArtistsInsightsEmpty"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import {
  mockEdges,
  resolveMostRecentRelayOperation,
} from "app/utils/tests/resolveMostRecentRelayOperation"
import { SectionList } from "react-native"
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
                onScrollEndDragChange={() => {
                  console.log("do nothing")
                }}
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
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
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

      expect(tree.root.findAllByType(SectionList).length).toEqual(1)
      expect(extractText(tree.root.findByType(SectionList))).toContain("Upcoming Auctions")
    })

    it("are hidden when no upcoming auction results are available", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
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

      expect(tree.root.findAllByType(SectionList).length).toEqual(1)
      expect(extractText(tree.root.findByType(SectionList))).not.toContain("Upcoming Auctions")
    })
  })

  describe("Past auction reuslt", () => {
    it("are shown when past auction results are available", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
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

      expect(tree.root.findAllByType(SectionList).length).toEqual(1)
      expect(extractText(tree.root.findByType(SectionList))).toContain("Past Auctions")
    })

    it("are hidden when no past auction results are available", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
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

      expect(tree.root.findAllByType(SectionList).length).toEqual(1)
      expect(extractText(tree.root.findByType(SectionList))).not.toContain("Past Auctions")
    })
  })

  it("renders FilteredArtworkGridZeroState when no auction results are available", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        statuses: { auctionLots: true },
        auctionResultsConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState).length).toEqual(1)
  })

  it("renders the empty state when there are no auction lots", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({ statuses: { auctionLots: false } }),
    })

    expect(tree.root.findAllByType(ArtistInsightsEmpty).length).toEqual(1)
    expect(tree.root.findAllByType(InfoButton).length).toEqual(0)
  })

  describe("ListHeaderComponent", () => {
    it("renders the results string when totalCount is equal to 1", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 1,
            edges: mockEdges(1),
          },
        }),
      })

      expect(extractText(tree.root.findAllByType(Text)[1])).toBe(
        "1 result • Sorted by most recent sale date"
      )
    })

    it("renders the results string when totalCount is greater than 1", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          statuses: { auctionLots: true },
          auctionResultsConnection: {
            totalCount: 10,
            edges: mockEdges(10),
          },
        }),
      })
      expect(extractText(tree.root.findAllByType(Text)[1])).toBe(
        "10 results • Sorted by most recent sale date"
      )
    })
  })
})
