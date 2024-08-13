import { screen } from "@testing-library/react-native"
import { ArtistSeriesArtworksTestsQuery } from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistSeriesArtworks } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Artist Series Artworks", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistSeriesArtworksTestsQuery>({
    Component: ({ artistSeries }) => (
      <ArtworkFiltersStoreProvider>
        <ArtistSeriesArtworks artistSeries={artistSeries!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query ArtistSeriesArtworksTestsQuery @relay_test_operation {
        artistSeries(id: "pumpkins") {
          ...ArtistSeriesArtworks_artistSeries
        }
      }
    `,
  })

  it("renders an artwork grid if artworks", () => {
    renderWithRelay({})

    expect(screen.getByTestId("ArtistSeriesArtworksGrid")).toBeOnTheScreen()

    expect(screen.queryByText(/No results found/)).not.toBeOnTheScreen()
  })

  it("renders a null component if no artworks", () => {
    renderWithRelay({
      ArtistSeries: () => ({
        artistSeriesArtworks: {
          counts: {
            total: 0,
          },
          edges: null,
        },
      }),
    })

    expect(screen.getByTestId("ArtistSeriesArtworksGrid")).toBeOnTheScreen()

    expect(screen.getByText(/No results found/)).toBeOnTheScreen()
  })
})
