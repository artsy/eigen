import { createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

import Artwork from "../Artwork"
// tslint:disable-next-line:no-unused-expression
// This is so that TypeScript won’t remove the seemingly unused `Artwork` import. Relay depends on it to exist.
Artwork

const SaleArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    saleArtworks: graphql.experimental`
      fragment SaleArtworksGrid_saleArtworks on Sale
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        sale_artworks: sale_artworks_connection(first: $count, after: $cursor)
          @connection(key: "SaleArtworksGrid_sale_artworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              artwork {
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
      return props.sale && props.sale.sale_artworks
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
      query SaleArtworksGridQuery($__id: ID!) {
        node(__id: $__id) {
          ... on SaleArtwork {
            ...SaleArtworksGrid_saleArtworks @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)

export default SaleArtworksGrid

export interface SaleArtworkRelayProps {
  artwork: {
    id: string
  }
}
