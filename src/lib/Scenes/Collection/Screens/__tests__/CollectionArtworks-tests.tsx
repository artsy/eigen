import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Theme } from "@artsy/palette"
import {
  CollectionArtworksTestsQuery,
  CollectionArtworksTestsQueryRawResponse,
} from "__generated__/CollectionArtworksTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import {
  CollectionFixture,
  ZeroStateCollectionFixture,
} from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { filterArtworksParams } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { extractText } from "lib/tests/extractText"
import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFiltersStore"
import { CollectionZeroState } from "../CollectionZeroState"

jest.unmock("react-relay")

describe("CollectionArtworks", () => {
  let state: ArtworkFilterContextState
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<CollectionArtworksTestsQuery>
      environment={env}
      query={graphql`
        query CollectionArtworksTestsQuery @raw_response_type {
          marketingCollection(slug: "street-art-now") {
            ...CollectionArtworks_collection
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <Theme>
              <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
                <CollectionArtworks collection={props.marketingCollection} scrollToTop={jest.fn()} />
              </ArtworkFilterContext.Provider>
            </Theme>
          )
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const getWrapper = (marketingCollection: CollectionArtworksTestsQueryRawResponse["marketingCollection"]) => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          marketingCollection,
        },
      })
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
    }
  })

  it("returns zero state component when there are no artworks to display", () => {
    const tree = getWrapper(ZeroStateCollectionFixture)

    expect(tree.root.findAllByType(CollectionZeroState)).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Unfortunately, there are no works that meet your criteria.")
  })

  it("returns artworks", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const tree = getWrapper(CollectionFixture)

    expect(tree.root.findAllByType(InfiniteScrollArtworksGrid)).toHaveLength(1)
  })
})

describe("filterArtworksParams", () => {
  it("returns the default", () => {
    const appliedFilters = [] as any /* STRICTNESS_MIGRATION */
    expect(filterArtworksParams(appliedFilters)).toEqual({ sort: "-decayed_merch", medium: "*", priceRange: "" })
  })

  it("returns the value of appliedFilter", () => {
    const appliedFilters: FilterArray = [{ filterType: "sort", value: "Recently added" }]
    expect(filterArtworksParams(appliedFilters)).toEqual({ sort: "-published_at", medium: "*", priceRange: "" })
  })
})
