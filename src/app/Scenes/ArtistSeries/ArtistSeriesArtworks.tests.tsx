import { ArtistSeriesArtworksTestsQuery } from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

describe("Artist Series Artworks", () => {
  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesArtworksTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query ArtistSeriesArtworksTestsQuery @relay_test_operation {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesArtworks_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return (
            <ArtworkFiltersStoreProvider>
              <ArtistSeriesArtworksFragmentContainer artistSeries={props.artistSeries} />
            </ArtworkFiltersStoreProvider>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders an artwork grid if artworks", () => {
    const tree = getWrapper()
    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders a null component if no artworks", () => {
    const tree = getWrapper({
      ArtistSeries: () => ({
        artistSeriesArtworks: {
          counts: {
            total: 0,
          },
        },
      }),
    })

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(tree.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
    expect(extractText(tree.root)).toContain(
      "No results found\nPlease try another search.Clear filters"
    )
  })
})
