import { GeneArtworksGrid_filtered_artworks } from "__generated__/GeneArtworksGrid_filtered_artworks.graphql"
import InfiniteScrollArtworksGrid, {
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { createPaginationContainer, graphql } from "react-relay"

const GeneArtworksGrid = createPaginationContainer<
  { filtered_artworks: GeneArtworksGrid_filtered_artworks } & InfiniteScrollGridProps
>(
  InfiniteScrollArtworksGrid as any,
  {
    filtered_artworks: graphql`
      fragment GeneArtworksGrid_filtered_artworks on FilterArtworks
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
          sort: { type: "String" }
        ) {
        id
        artworks: artworks_connection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "GeneArtworksGrid_artworks") {
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
      return props.filtered_artworks && props.filtered_artworks.artworks
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
        id: props.filtered_artworks.id,
        count,
        cursor,
        sort: props.sort,
      }
    },
    query: graphql`
      query GeneArtworksGridQuery($id: ID!, $count: Int!, $cursor: String, $sort: String) {
        node(id: $id) {
          ... on FilterArtworks {
            ...GeneArtworksGrid_filtered_artworks @arguments(count: $count, cursor: $cursor, sort: $sort)
          }
        }
      }
    `,
  }
)

export default GeneArtworksGrid
