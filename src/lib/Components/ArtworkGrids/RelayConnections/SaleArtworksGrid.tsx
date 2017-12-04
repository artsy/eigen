import { createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

import Artwork from "../Artwork"
// tslint:disable-next-line:no-unused-expression
// This is so that TypeScript won’t remove the seemingly unused `Artwork` import. Relay depends on it to exist.
Artwork

const SaleArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    sale: graphql.experimental`
      fragment SaleArtworksGrid_sale on Sale
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        __id
        saleArtworks: sale_artworks_connection(first: $count, after: $cursor)
          @connection(key: "SaleArtworksGrid_saleArtworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              artwork {
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
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.sale && props.sale.saleArtworks
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
        __id: props.sale.__id,
        count,
        cursor,
      }
    },
    query: graphql.experimental`
      query SaleArtworksGridQuery($__id: ID!, $count: Int!, $cursor: String) {
        node(__id: $__id) {
          ... on Sale {
            ...SaleArtworksGrid_sale @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)

export default SaleArtworksGrid
