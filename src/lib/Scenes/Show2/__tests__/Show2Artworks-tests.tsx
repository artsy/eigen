import { Show2ArtworksTestsQuery } from "__generated__/Show2ArtworksTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Show2ArtworksPaginationContainer as Show2Artworks } from "lib/Scenes/Show2/Components/Show2Artworks"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("Show2Artworks", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
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

  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Show2ArtworksTestsQuery>
        environment={env}
        query={graphql`
          query Show2ArtworksTestsQuery($showID: String!) @relay_test_operation {
            show(id: $showID) {
              ...Show2Artworks_show
            }
          }
        `}
        variables={{ showID: "catty-art-show" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.show) {
            return null
          }
          return (
            <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
              <Show2Artworks show={props.show} />
            </ArtworkFilterContext.Provider>
          )
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))

    return tree
  }

  it("renders a grid of artworks", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders null if there are no artworks", () => {
    const wrapper = getWrapper({
      Show: () => ({
        showArtworks: {
          edges: [],
          counts: {
            total: 0,
          },
        },
      }),
    })

    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
  })
})
