import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import {
  mockEdges,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import { SectionList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  ArtistInsightsAuctionResultsPaginationContainer,
  SortMode,
} from "./ArtistInsightsAuctionResults"

jest.unmock("react-relay")

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
            <ArtworkFiltersStoreProvider initialData={initialData}>
              <ArtistInsightsAuctionResultsPaginationContainer
                artist={props.artist}
                scrollToTop={() => {
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

  describe("Upcoming auction reuslt", () => {
    it("are shown when upcoming auction results are available", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
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
        auctionResultsConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState).length).toEqual(1)
  })

  describe("ListHeaderComponent", () => {
    it("renders the results string when totalCount is equal to 1", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          auctionResultsConnection: {
            totalCount: 1,
            edges: mockEdges(1),
          },
        }),
      })

      expect(extractText(tree.root.findByType(SortMode))).toBe(
        "1 result • Sorted by most recent sale date"
      )
    })

    it("renders the results string when totalCount is greater than 1", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer initialData={initialState} />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          auctionResultsConnection: {
            totalCount: 10,
            edges: mockEdges(10),
          },
        }),
      })
      expect(extractText(tree.root.findByType(SortMode))).toBe(
        "10 results • Sorted by most recent sale date"
      )
    })
  })
})
