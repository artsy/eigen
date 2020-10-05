import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/data/constants"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Flex, Sans } from "palette"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleID: string
  me: SaleLotsList_me
  relay: RelayPaginationProp
}

export const SaleLotsList: React.FC<Props> = ({ me, saleID, relay }) => {
  const { state } = useContext(ArtworkFilterContext)
  // const filterParams = filterArtworksParams(state.appliedFilters)
  const showList = state.appliedFilters.find((filter) => filter.paramValue === ViewAsValues.List)

  // useEffect(() => {
  //   if (state.applyFilters) {
  //     relay.refetchConnection(
  //       PAGE_SIZE,
  //       (error) => {
  //         if (error) {
  //           throw new Error("Fair/FairArtworks filter error: " + error.message)
  //         }
  //       },
  //       filterParams
  //     )
  //   }
  // }, [state.appliedFilters])

  // useEffect(() => {
  //   dispatch({
  //     type: "setAggregations",
  //     payload: sale.saleArtworksConnection.aggregations,
  //   })
  // }, [])

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
          connection={me.lotsByFollowedArtistsConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={me.lotsByFollowedArtistsConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            showLotLabel
            hidePartner
            hideUrgencyTags
          />
        </Flex>
      )}
    </Flex>
  )
}

// export const SaleLotsListContainer = createPaginationContainer(
//   SaleLotsList,
//   {
//     me: graphql`
//       fragment SaleLotsList_me on Me @argumentDefinitions(cursor: { type: "String" }) {
//         saleArtworksList: lotsByFollowedArtistsConnection(
//           after: $cursor
//           liveSale: true
//           isAuction: true
//           first: 10
//           includeArtworksByFollowedArtists: false
//         ) @connection(key: "SaleLotsList_saleArtworksList") {
//           edges {
//             cursor
//             node {
//               title
//             }
//           }
//           # ...InfiniteScrollArtworksGrid_connection
//         }
//       }
//     `,
//   },
//   {
//     getConnectionFromProps: ({ me }) => me && me.saleArtworksList,
//     getVariables: (_props, { cursor }) => ({ cursor }),
//     query: graphql`
//       query SaleLotsListQuery($cursor: String) {
//         me {
//           ...SaleLotsList_me @arguments(cursor: $cursor)
//         }
//       }
//     `,
//   }
// )

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    me: graphql`
      fragment SaleLotsList_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: PAGE_SIZE }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(
          first: $count
          after: $cursor
          liveSale: true
          isAuction: true
          includeArtworksByFollowedArtists: false
        ) @connection(key: "SaleLotsList_lotsByFollowedArtistsConnection") {
          edges {
            cursor
          }
          ...SaleArtworkList_connection
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql`
      query SaleLotsListQuery($count: Int!, $cursor: String) {
        me {
          ...SaleLotsList_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
