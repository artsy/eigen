import { NewSaleLotsListTestsQuery } from "__generated__/NewSaleLotsListTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { NewSaleLotsListContainer } from "app/Scenes/Sale/Components/NewSaleLotsList"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("NewSaleLotsList", () => {
  const { renderWithRelay } = setupTestWrapper<NewSaleLotsListTestsQuery>({
    Component: (props) => {
      if (props?.viewer) {
        return (
          <ArtworkFiltersStoreProvider>
            <NewSaleLotsListContainer
              viewer={props.viewer}
              unfilteredArtworks={props.viewer.unfilteredArtworks}
              saleID="saleID"
              saleSlug="saleSlug"
              scrollToTop={jest.fn()}
            />
          </ArtworkFiltersStoreProvider>
        )
      }
      return null
    },
    query: graphql`
      query NewSaleLotsListTestsQuery($saleID: ID) @relay_test_operation {
        viewer {
          unfilteredArtworks: artworksConnection(
            saleID: $saleID
            aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL]
            first: 0
          ) {
            ...NewSaleLotsList_unfilteredArtworks
          }
          ...NewSaleLotsList_viewer @arguments(saleID: $saleID)
        }
      }
    `,
  })

  it("renders nothing if not sale artworks are available", () => {
    const { toJSON } = renderWithRelay({
      FilterArtworksConnection: () => ({
        counts: {
          followedArtists: 0,
          total: 0,
        },
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders content", () => {
    const { getByText } = renderWithRelay({
      FilterArtworksConnection: () => mockedFilterArtworksConnection,
    })

    expect(getByText("Artwork Title")).toBeDefined()
  })

  it("renders header", () => {
    const { getByText } = renderWithRelay({
      FilterArtworksConnection: () => mockedFilterArtworksConnection,
    })

    expect(getByText("Sorted by Lot Number Ascending")).toBeDefined()
    expect(getByText("Showing 1 of 1")).toBeDefined()
  })
})

const mockedFilterArtworksConnection = {
  counts: {
    followedArtists: 0,
    total: 1,
  },
  edges: [
    {
      node: {
        title: "Artwork Title",
      },
    },
  ],
}
