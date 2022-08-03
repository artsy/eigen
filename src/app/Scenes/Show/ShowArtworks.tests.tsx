import { ShowArtworksTestsQuery } from "__generated__/ShowArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { ShowArtworksPaginationContainer as ShowArtworks } from "app/Scenes/Show/Components/ShowArtworks"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

describe("ShowArtworks", () => {
  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(
      <QueryRenderer<ShowArtworksTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query ShowArtworksTestsQuery($showID: String!) @relay_test_operation {
            show(id: $showID) {
              ...ShowArtworks_show
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
            <ArtworkFiltersStoreProvider>
              <ShowArtworks show={props.show} />
            </ArtworkFiltersStoreProvider>
          )
        }}
      />
    )

    resolveMostRecentRelayOperation(mockResolvers)

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
