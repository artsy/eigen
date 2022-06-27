import { CollectionArtworksTestsQuery } from "__generated__/CollectionArtworksTestsQuery.graphql"
import {
  FilterArray,
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("CollectionArtworks", () => {
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
            <ArtworkFiltersStoreProvider>
              <CollectionArtworks collection={props.marketingCollection} scrollToTop={jest.fn()} />
            </ArtworkFiltersStoreProvider>
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
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  beforeEach(() => {
    env = createMockEnvironment()
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
    expect(extractText(tree.root)).toContain(
      "No results found\nPlease try another search.Clear filters"
    )
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
        displayText: "Recently Added",
        paramName: FilterParamName.sort,
        paramValue: "-published_at",
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-published_at",
      medium: "*",
      priceRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      inquireableOnly: false,
    })
  })
})
