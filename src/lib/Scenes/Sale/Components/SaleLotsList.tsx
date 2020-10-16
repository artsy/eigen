import { SaleLotsList_saleArtworksConnection } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { Box, Flex, Sans } from "palette"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection
  relay: RelayPaginationProp
  saleID: string
  saleSlug: string
}

export const SaleLotsList: React.FC<Props> = ({ saleArtworksConnection, relay, saleID, saleSlug }) => {
  const { state, dispatch } = useContext(ArtworkFilterContext)

  const tracking = useTracking()

  const filterParams = filterArtworksParams(state.appliedFilters, state.filterType)
  const showList = state.appliedFilters.find((filter) => filter.paramValue === ViewAsValues.List)

  useEffect(() => {
    dispatch({
      type: "setFilterType",
      payload: "saleArtwork",
    })
  }, [])

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        10,
        (error) => {
          if (error) {
            throw new Error("Sale/SaleLotsList filter error: " + error.message)
          }
        },
        { ...filterParams, saleID: saleSlug }
      )
    }
  }, [state.appliedFilters])

  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: saleArtworksConnection.saleArtworksConnection?.aggregations,
    })
  }, [])

  // TODO: Discuss tracking
  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.Auction,
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

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

  if (!saleArtworksConnection.saleArtworksConnection) {
    return (
      <Box mb="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Flex flex={1} my={4}>
      {/* TODO: NO LOTS */}
      <FiltersResume />

      {showList ? (
        <SaleArtworkListContainer
          connection={saleArtworksConnection.saleArtworksConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={saleArtworksConnection.saleArtworksConnection!}
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

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        artistIDs: { type: "[String]", defaultValue: [] }
        estimateRange: { type: "String", defaultValue: "" }
        sort: { type: "String", defaultValue: "position" }
        saleID: { type: "ID" }
      ) {
        saleArtworksConnection(
          after: $cursor
          saleID: $saleID
          artistIDs: $artistIDs
          aggregations: [ARTIST, MEDIUM, TOTAL]
          estimateRange: $estimateRange
          first: $count
          sort: $sort
        ) @connection(key: "SaleLotsList_saleArtworksConnection") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          edges {
            node {
              id
            }
          }
          ...SaleArtworkList_connection
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getFragmentVariables(previousVariables, count) {
      // Relay is unable to infer this for this component, I'm not sure why.
      return {
        ...previousVariables,
        count,
      }
    },
    getConnectionFromProps(props) {
      return props?.saleArtworksConnection?.saleArtworksConnection
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
        partnerID: fragmentVariables.artistIDs,
        saleID: props.saleSlug,
      }
    },
    query: graphql`
      query SaleLotsListQuery(
        $artistIDs: [String]
        $count: Int!
        $cursor: String
        $estimateRange: String
        $saleID: ID
        $sort: String
      )
      # $saleID: ID
      @raw_response_type {
        ...SaleLotsList_saleArtworksConnection
        @arguments(
          artistIDs: $artistIDs
          count: $count
          cursor: $cursor
          sort: $sort
          estimateRange: $estimateRange
          saleID: $saleID
        )
      }
    `,
  }
)
