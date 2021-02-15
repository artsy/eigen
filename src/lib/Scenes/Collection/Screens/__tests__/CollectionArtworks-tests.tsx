import { CollectionArtworksTestsQuery } from "__generated__/CollectionArtworksTestsQuery.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { FilterArray } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("CollectionArtworks", () => {
  let state: ArtworkFilterContextState
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<CollectionArtworksTestsQuery>
      environment={env}
      query={graphql`
        query CollectionArtworksTestsQuery @relay_test_operation {
          marketingCollection(slug: "street-art-now") {
            ...CollectionArtworks_collection
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
              <CollectionArtworks collection={props.marketingCollection} scrollToTop={jest.fn()} />
            </ArtworkFilterContext.Provider>
          )
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  beforeEach(() => {
    env = createMockEnvironment()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  it("returns zero state component when there are no artworks to display", () => {
    const tree = getWrapper({
      MarketingCollection: () => ({
        collectionArtworks: {
          edges: [],
          counts: { total: 0 },
        },
      }),
    })

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
    expect(extractText(tree.root)).toContain("No results found\nPlease try another search.Clear filtersClear filters")
  })

  it("returns artworks", () => {
    const tree = getWrapper()
    expect(tree.root.findAllByType(InfiniteScrollArtworksGrid)).toHaveLength(1)
  })
})

describe("filterArtworksParams", () => {
  it("returns the default", () => {
    const appliedFilters: FilterArray = []
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "*-*",
      dimensionRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      inquireableOnly: false,
    })
  })

  it("returns the value of appliedFilter", () => {
    const appliedFilters: FilterArray = [
      {
        displayText: "Recently added",
        paramName: FilterParamName.sort,
        paramValue: "-published_at",
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-published_at",
      medium: "*",
      priceRange: "*-*",
      dimensionRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      inquireableOnly: false,
    })
  })
})
