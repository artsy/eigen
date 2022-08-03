import { NewSaleLotsListTestsQuery } from "__generated__/NewSaleLotsListTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { NewSaleLotsListContainer } from "./NewSaleLotsList"

describe("NewSaleLotsList", () => {
  const TestRenderer = () => {
    return (
      <QueryRenderer<NewSaleLotsListTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
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
        `}
        variables={{ saleID: "saleID" }}
        render={({ props }) => {
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
        }}
      />
    )
  }

  it("renders nothing if not sale artworks are available", () => {
    const { toJSON } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
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
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      FilterArtworksConnection: () => mockedFilterArtworksConnection,
    })

    expect(getByText("Artwork Title")).toBeDefined()
  })

  it("renders header", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
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
