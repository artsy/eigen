import { screen } from "@testing-library/react-native"
import { ArtistSeriesTestsQuery } from "__generated__/ArtistSeriesTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistSeries } from "app/Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesArtworks } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesMeta } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Artist Series", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistSeriesTestsQuery>({
    Component: ({ artistSeries }) => (
      <ArtworkFiltersStoreProvider>
        <ArtistSeries artistSeries={artistSeries!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query ArtistSeriesTestsQuery @relay_test_operation {
        artistSeries(id: "pumpkins") {
          ...ArtistSeries_artistSeries
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay({})
    expect(screen.UNSAFE_queryAllByType(ArtistSeries)).toHaveLength(1)
  })

  it("renders the necessary subcomponents", () => {
    renderWithRelay({})

    expect(screen.UNSAFE_queryAllByType(ArtistSeriesMeta)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(ArtistSeriesArtworks)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(ArtistSeriesMoreSeries)).toHaveLength(1)
  })

  describe("with an artist series without an artist", () => {
    it("does not render ArtistSeriesMoreSeries", () => {
      renderWithRelay({
        ArtistSeries: () => ({
          artist: null,
        }),
      })
      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).not.toBeOnTheScreen()
    })
  })

  describe("with an artist series artist without an artistSeriesConnection", () => {
    it("does not render ArtistSeriesMoreSeries", () => {
      renderWithRelay({
        ArtistSeries: () => ({
          artist: [
            {
              artistSeriesConnection: {
                totalCount: 0,
              },
            },
          ],
        }),
      })
      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).not.toBeOnTheScreen()
    })
  })
})
