import { Fair2ArtworksTestsQuery } from "__generated__/Fair2ArtworksTestsQuery.graphql"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Fair2ArtworksFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Artworks"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("Fair2Artworks", () => {
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
      <QueryRenderer<Fair2ArtworksTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ArtworksTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...Fair2Artworks_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }
          return (
            <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
              <Fair2ArtworksFragmentContainer fair={props.fair} />
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

  it("requests artworks in batches of 30", () => {
    const wrapper = getWrapper()
    const artworksGridContainer = wrapper.root.findByType(InfiniteScrollArtworksGridContainer)
    expect(artworksGridContainer.props).toMatchObject({ pageSize: 30 })
  })

  it("renders null if there are no artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        fairArtworks: {
          edges: [],
          counts: {
            total: 0,
            followedArtists: 0,
          },
        },
      }),
    })

    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
    expect(extractText(wrapper.root)).toContain("Unfortunately, there are no works that meet your criteria.")
  })
})
