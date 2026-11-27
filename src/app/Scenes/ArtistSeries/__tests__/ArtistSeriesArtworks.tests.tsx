import { screen } from "@testing-library/react-native"
import { ArtistSeriesArtworksTestsQuery } from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistSeriesArtworks } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockArtworkFilterNavigator = jest.fn((_props: any) => null)
jest.mock("app/Components/ArtworkFilter", () => ({
  ...jest.requireActual("app/Components/ArtworkFilter"),
  ArtworkFilterNavigator: (props: any) => mockArtworkFilterNavigator(props),
}))

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

  it("renders an artwork grid if artworks", async () => {
    await renderWithRelay({})

    expect(screen.getByTestId("ArtistSeriesArtworksGrid")).toBeOnTheScreen()

    expect(screen.queryByText(/No results found/)).not.toBeOnTheScreen()
  })

  it("renders a null component if no artworks", async () => {
    await renderWithRelay({
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

  it("creates alerts for the series' artist and the series, not for the series as an artist", async () => {
    await renderWithRelay({
      ArtistSeries: () => ({
        internalID: "series-id",
        slug: "andy-warhol-flash-november-22",
        title: "Flash-November 22",
        artists: [{ internalID: "artist-id", name: "Andy Warhol" }],
      }),
    })

    const props = mockArtworkFilterNavigator.mock.calls.at(-1)?.[0]

    expect(props.savedSearchEntity).toEqual({
      artists: [{ id: "artist-id", name: "Andy Warhol" }],
      owner: { type: "artistSeries", id: "series-id", slug: "andy-warhol-flash-november-22" },
    })
    expect(props.savedSearchCriteria).toEqual({
      artistSeriesIDs: ["andy-warhol-flash-november-22"],
    })
  })
})
