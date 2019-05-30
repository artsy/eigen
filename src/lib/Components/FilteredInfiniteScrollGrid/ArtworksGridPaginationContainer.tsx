import { ArtworksGridPaginationContainer_filteredArtworks } from "__generated__/ArtworksGridPaginationContainer_filteredArtworks.graphql"
import InfiniteScrollArtworksGrid, {
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { createPaginationContainer, graphql } from "react-relay"

export const ArtworksGridPaginationContainer = createPaginationContainer<
  { filteredArtworks: ArtworksGridPaginationContainer_filteredArtworks } & InfiniteScrollGridProps
>(
  InfiniteScrollArtworksGrid as any,
  {
    filteredArtworks: graphql`
      fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        artworks: artworks_connection(first: $count, after: $cursor)
          @connection(key: "ArtworksGridPaginationContainer_artworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              gravityID
              id
              image {
                aspect_ratio
              }
              ...ArtworkGridItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.filteredArtworks && props.filteredArtworks.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.filteredArtworks.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtworksGridPaginationContainerQuery($id: ID!, $count: Int!, $cursor: String) {
        node(__id: $id) {
          ... on FilterArtworks {
            ...ArtworksGridPaginationContainer_filteredArtworks @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)
