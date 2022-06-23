import { SaleLotsListTestsQuery } from "__generated__/SaleLotsListTestsQuery.graphql"
import { FilterParamName, ViewAsValues } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FilterParams } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SaleArtworkListContainer } from "./Components/SaleArtworkList"
import {
  FilterDescription,
  FilterTitle,
  SaleLotsListContainer,
  SaleLotsListSortMode,
} from "./Components/SaleLotsList"

jest.unmock("react-relay")

describe("SaleLotsListContainer", () => {
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

  const TestRenderer = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => (
    <QueryRenderer<SaleLotsListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleLotsListTestsQuery($saleSlug: ID!) @relay_test_operation {
          ...SaleLotsList_saleArtworksConnection @arguments(saleID: $saleSlug)
        }
      `}
      variables={{ saleSlug: "sale-slug" }}
      render={({ props }) => {
        if (props) {
          return (
            <ArtworkFiltersStoreProvider initialData={initialData}>
              <SaleLotsListContainer
                saleArtworksConnection={props}
                unfilteredSaleArtworksConnection={null as any}
                saleID="sale-id"
                saleSlug="sale-slug"
                scrollToTop={jest.fn()}
              />
            </ArtworkFiltersStoreProvider>
          )
        }
        return null
      }}
    />
  )

  const getState = (viewAs: ViewAsValues = ViewAsValues.List): ArtworkFiltersState => ({
    selectedFilters: [],
    appliedFilters: [
      {
        paramName: FilterParamName.viewAs,
        paramValue: viewAs,
        displayText: "View as",
      },
    ],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "saleArtwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    sizeMetric: "cm",
  })

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  // Investigate why this test is failing
  // Most likely this has something to do with the unfilteredSaleArtworksConnection
  // Follow-up ticket https://artsyproduct.atlassian.net/browse/CX-1108
  it.skip("Renders nothing if not sale artworks are available", () => {
    const tree = renderWithWrappers(<TestRenderer initialData={getState()} />)
    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.toJSON()).toBeNull()
  })

  it("Renders list of sale artworks as a grid", () => {
    const tree = renderWithWrappers(<TestRenderer initialData={getState(ViewAsValues.Grid)} />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("Renders list of sale artworks as a list", () => {
    const tree = renderWithWrappers(<TestRenderer initialData={getState()} />)
    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(SaleArtworkListContainer)).toHaveLength(1)
  })

  describe("SaleLotsListSortMode", () => {
    it("renders the right sort mode and count", () => {
      const tree = renderWithWrappers(
        <SaleLotsListSortMode
          filterParams={{ sort: "bidder_positions_count" } as FilterParams}
          filteredTotal={20}
          totalCount={100}
        />
      )

      expect(extractText(tree.root.findByType(FilterTitle))).toBe("Sorted by least bids")
      expect(extractText(tree.root.findByType(FilterDescription))).toBe("Showing 20 of 100")
    })
  })
})

const saleArtworkNode = {
  artwork: {
    image: {
      url: "artworkImageUrl",
    },
    href: "/artwork/artwroks-href",
    saleMessage: "Contact For Price",
    artistNames: "Banksy",
    slug: "artwork-slug",
    internalID: "Internal-ID",
    sale: {
      isAuction: true,
      isClosed: false,
      displayTimelyAt: "register by\n5pm",
      endAt: null,
    },
    saleArtwork: {
      counts: "{bidderPositions: 0}",
      currentBid: '{display: "$650"}',
    },
    partner: {
      name: "Heritage Auctions",
    },
  },
  lotLabel: "1",
}

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    saleArtwork: saleArtworkNode,
    id: saleArtworkNode.artwork.internalID,
    href: saleArtworkNode.artwork.href,
  },
})
