import { SaleLotsList_sale } from "__generated__/SaleLotsList_sale.graphql"
import { InfiniteScrollSaleArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollSaleArtworksGrid"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Flex, Sans } from "palette"
import React, { useContext } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  sale: SaleLotsList_sale
  relay: RelayPaginationProp
  saleArtworksConnection: SaleLotsList_saleArtworksConnection
}

export const SaleLotsList: React.FC<Props> = ({ sale, relay, saleArtworksConnection }) => {
  console.log({ saleArtworksConnection })
  const filters = useContext(ArtworkFilterContext)
  const showList = filters.state.appliedFilters.find((filter) => filter.paramValue === ViewAsValues.List)

  const FiltersResume = () => (
    <Flex px={2} mb={1}>
      <Sans size="4" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
        Sorted by lot number (ascending)
      </Sans>

      <Sans size="3t" color="black60" data-test-id="subtitle">
        Showing 84 of 84 lots
      </Sans>
    </Flex>
  )

  return (
    <Flex flex={1} my={4}>
      <FiltersResume />
      {showList ? (
        <SaleArtworkListContainer
          connection={sale.saleArtworksConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollSaleArtworksGridContainer
            // @ts-ignore STRICTNESS_MIGRATION
            connection={sale.saleArtworksConnection}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
          />
        </Flex>
      )}
    </Flex>
  )
}

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    sale: graphql`
      fragment SaleLotsList_sale on Sale
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        internalID
        saleArtworksConnection(first: $count, after: $cursor) @connection(key: "SaleLotsList_saleArtworksConnection") {
          edges {
            cursor
            node {
              id
            }
          }
          ...SaleArtworkList_connection
          ...InfiniteScrollSaleArtworksGrid_connection
        }
      }
    `,
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on SaleArtworksConnection {
        totalCount
      }
    `,
  },
  {
    getConnectionFromProps: ({ sale }) => sale && sale.saleArtworksConnection,
    getVariables: (props, { count, cursor }) => ({ count, cursor, id: props.sale.internalID }),
    query: graphql`
      query SaleLotsListQuery($id: String!, $count: Int!, $cursor: String) {
        sale(id: $id) {
          ...SaleLotsList_sale @arguments(count: $count, cursor: $cursor)
        }

        saleArtworksConnection {
          ...SaleLotsList_saleArtworksConnection
        }
      }
    `,
  }
)
