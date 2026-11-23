import { screen } from "@testing-library/react-native"
import { ArtistSeriesTestsQuery } from "__generated__/ArtistSeriesTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistSeries } from "app/Scenes/ArtistSeries/ArtistSeries"
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
    renderWithRelay({ ArtistSeries: () => ({ title: "Pumpkins" }) })
    expect(screen.getAllByText("Pumpkins").length).toBeGreaterThan(0)
  })

  it("renders the necessary subcomponents", () => {
    renderWithRelay({})

    // ArtistSeriesMeta
    expect(screen.getByTestId("description")).toBeOnTheScreen()
    // ArtistSeriesArtworks
    expect(screen.getByTestId("ArtistSeriesArtworksGrid")).toBeOnTheScreen()
    // ArtistSeriesMoreSeries
    expect(screen.getByText("More series by this artist")).toBeOnTheScreen()
  })

  describe("with an artist series without an artist", () => {
    it("does not render ArtistSeriesMoreSeries", () => {
      renderWithRelay({
        ArtistSeries: () => ({
          artist: null,
        }),
      })
      expect(screen.queryByText("More series by this artist")).not.toBeOnTheScreen()
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
      expect(screen.queryByText("More series by this artist")).not.toBeOnTheScreen()
    })
  })
})
