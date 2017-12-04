import { createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

import Artwork from "../Artwork"
// tslint:disable-next-line:no-unused-expression
// This is so that TypeScript won’t remove the seemingly unused `Artwork` import. Relay depends on it to exist.
Artwork

const GeneArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    gene: graphql.experimental`
      fragment GeneArtworksGrid_gene on Gene
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          sort: { type: "String", defaultValue: "-partner_updated_at" }
          medium: { type: "String", defaultValue: "*" }
          priceRange: { type: "String", defaultValue: "*-*" }
        ) {
        __id
        artworks: artworks_connection(
          first: $count
          after: $cursor
          sort: $sort
          medium: $medium
          price_range: $priceRange
          for_sale: true
        ) @connection(key: "GeneArtworksGrid_artworks") {
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
              ...Artwork_artwork
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.gene && props.gene.artworks
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
        __id: props.gene.__id,
        count,
        cursor,
      }
    },
    query: graphql.experimental`
      query GeneArtworksGridQuery(
        $__id: ID!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $priceRange: String
      ) {
        node(__id: $__id) {
          ... on Gene {
            ...GeneArtworksGrid_gene
              @arguments(count: $count, cursor: $cursor, sort: $sort, medium: $medium, priceRange: $priceRange)
          }
        }
      }
    `,
  }
)

export default GeneArtworksGrid

export interface GeneRelayProps {
  artist: {
    artworks_connection: {
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
