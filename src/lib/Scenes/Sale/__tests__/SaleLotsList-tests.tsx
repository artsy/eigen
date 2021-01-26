import { SaleLotsListTestsQuery } from "__generated__/SaleLotsListTestsQuery.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { FilterParams } from "../../../utils/ArtworkFilter/FilterArtworksHelpers"
import { SaleArtworkListContainer } from "../Components/SaleArtworkList"
import { FilterDescription, FilterTitle, SaleLotsListContainer, SaleLotsListSortMode } from "../Components/SaleLotsList"

jest.unmock("react-relay")

describe("SaleLotsListContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  let getState: (viewAs: ViewAsValues) => ArtworkFilterContextState

  const TestRenderer = ({ viewAs = ViewAsValues.Grid }: { viewAs?: ViewAsValues }) => (
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
            <ArtworkFilterContext.Provider value={{ state: getState(viewAs), dispatch: jest.fn() }}>
              <SaleLotsListContainer
                saleArtworksConnection={props}
                unfilteredSaleArtworksConnection={null as any}
                saleID="sale-id"
                saleSlug="sale-slug"
                scrollToTop={jest.fn()}
              />
            </ArtworkFilterContext.Provider>
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    getState = (viewAs) => ({
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
    })
  })

  it("Renders no results if no sale artworks are available", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: [],
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
  })

  it("Renders list of sale artworks as a grid", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("Renders list of sale artworks as a list", () => {
    const tree = renderWithWrappers(<TestRenderer viewAs={ViewAsValues.List} />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(SaleArtworkListContainer)).toHaveLength(1)
  })
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
