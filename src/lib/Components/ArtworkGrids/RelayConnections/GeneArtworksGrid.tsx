import { createPaginationContainer, graphql } from "react-relay/compat"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

import Artwork from "../Artwork"
// tslint:disable-next-line:no-unused-expression
// This is so that TypeScript won’t remove the seemingly unused `Artwork` import. Relay depends on it to exist.
Artwork

const GeneArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    gene: graphql.experimental`
      fragment GeneArtworksGrid_gene on Gene @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        sort: { type: "String", defaultValue: "-partner_updated_at" }
        medium: { type: "String", defaultValue: "*" }
        priceRange: { type: "String", defaultValue: "*-*" }
      ) {
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
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query GeneArtworksGridQuery(
        $geneID: String!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $priceRange: String
      ) {
        gene(id: $geneID) {
          ...GeneArtworksGrid_gene
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
          image: {
            aspect_ratio: number | null
          } | null
        } | null
      }>
    } | null
  }
}
