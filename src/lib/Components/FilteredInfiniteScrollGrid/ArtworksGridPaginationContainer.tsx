import InfiniteScrollArtworksGrid, {
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { createPaginationContainer, graphql } from "react-relay"

export const ArtworksGridPaginationContainer = createPaginationContainer<RelayProps & InfiniteScrollGridProps>(
  InfiniteScrollArtworksGrid,
  {
    filteredArtworks: graphql`
      fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        __id
        artworks: artworks_connection(first: $count, after: $cursor)
          @connection(key: "ArtworksGridPaginationContainer_artworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              __id
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
        __id: props.filteredArtworks.__id,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtworksGridPaginationContainerQuery($__id: ID!, $count: Int!, $cursor: String) {
        node(__id: $__id) {
          ... on FilterArtworks {
            ...ArtworksGridPaginationContainer_filteredArtworks @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)

export interface RelayProps {
  filteredArtworks?: {
    artworks: {
      pageInfo: {
        hasNextPage: boolean
      }
      edges: Array<{
        node: {
          __id: string
          id: string
          image: {
            aspect_ratio: number | null
          } | null
        } | null
      }>
    }
  }
}
