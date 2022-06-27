import { FairArtworksTestsQuery } from "__generated__/FairArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FairArtworksFragmentContainer } from "app/Scenes/Fair/Components/FairArtworks"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("FairArtworks", () => {
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<FairArtworksTestsQuery>
        environment={env}
        query={graphql`
          query FairArtworksTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...FairArtworks_fair
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
            <ArtworkFiltersStoreProvider>
              <FairArtworksFragmentContainer fair={props.fair} />
            </ArtworkFiltersStoreProvider>
          )
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

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
    expect(extractText(wrapper.root)).toContain(
      "No results found\nPlease try another search.Clear filters"
    )
  })
})
