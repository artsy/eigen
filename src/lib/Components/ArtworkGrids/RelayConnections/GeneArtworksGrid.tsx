import { ConnectionData, createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid from "../InfiniteScrollGrid"

const GeneArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    filtered_artworks: graphql`
      fragment GeneArtworksGrid_filtered_artworks on FilterArtworks
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
          sort: { type: "String" }
        ) {
        __id
        artworks: artworks_connection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "GeneArtworksGrid_artworks") {
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
      return props.filtered_artworks && (props.filtered_artworks.artworks as ConnectionData)
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
        __id: props.filtered_artworks.__id,
        count,
        cursor,
        sort: props.sort,
      }
    },
    query: graphql`
      query GeneArtworksGridQuery($__id: ID!, $count: Int!, $cursor: String, $sort: String) {
        node(__id: $__id) {
          ... on FilterArtworks {
            ...GeneArtworksGrid_filtered_artworks @arguments(count: $count, cursor: $cursor, sort: $sort)
          }
        }
      }
    `,
  }
)

export default GeneArtworksGrid

export interface GeneRelayProps {
  filtered_artworks?: {
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
    } | null
  }
}
