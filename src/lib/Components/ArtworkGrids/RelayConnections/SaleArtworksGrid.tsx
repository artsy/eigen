import { createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid, { Props as GridProps } from "../InfiniteScrollGrid"

// FIXME: This is really only done because the scrollgrid does not accept a `sale` prop and currently the way things are
//        setup type-checking fails because users correctly do pass a `sale` prop. This should be made correct when work
//        is continued on a RN version of a Sale.
//
interface Props extends GridProps {
  sale: any
}

const SaleArtworksGrid = createPaginationContainer<Props>(
  InfiniteScrollArtworksGrid as any,
  {
    sale: graphql`
      fragment SaleArtworksGrid_sale on Sale
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
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
        id: props.sale.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query SaleArtworksGridQuery($id: ID!, $count: Int!, $cursor: String) {
        node(__id: $id) {
          ... on Sale {
            ...SaleArtworksGrid_sale @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)

export default SaleArtworksGrid
