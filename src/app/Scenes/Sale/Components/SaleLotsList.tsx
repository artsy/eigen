import { OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text } from "@artsy/palette-mobile"
import { SaleLotsList_saleArtworksConnection$data } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { SaleLotsList_unfilteredSaleArtworksConnection$data } from "__generated__/SaleLotsList_unfilteredSaleArtworksConnection.graphql"
import {
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_SALE_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Schema } from "app/utils/track"
import React, { MutableRefObject, useCallback, useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection$data
  unfilteredSaleArtworksConnection:
    | SaleLotsList_unfilteredSaleArtworksConnection$data
    | null
    | undefined
  relay: RelayPaginationProp
  saleID: string
  saleSlug: string
  scrollToTop: () => void
  artworksRefetchRef?: MutableRefObject<() => void>
}

export const SaleLotsListSortMode = ({
  filterParams,
  filteredTotal,
  totalCount,
}: {
  filterParams: FilterParams
  filteredTotal: number | null | undefined
  totalCount: number | null | undefined
}) => {
  const getSortDescription = useCallback(() => {
    const sortMode = ORDERED_SALE_ARTWORK_SORTS.find(
      (sort) => sort.paramValue === filterParams?.sort
    )
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams])

  return (
    <Flex px={2} mb={2}>
      <Text variant="sm-display" ellipsizeMode="tail">
        Sorted by {getSortDescription()?.toLowerCase()}
      </Text>

      {!!filteredTotal && !!totalCount && (
        <Text color="mono60" variant="sm">{`Showing ${filteredTotal} of ${totalCount}`}</Text>
      )}
    </Flex>
  )
}

export const SaleLotsList: React.FC<Props> = ({
  saleArtworksConnection,
  unfilteredSaleArtworksConnection,
  relay,
  saleID,
  saleSlug,
  artworksRefetchRef,
  scrollToTop,
}) => {
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const tracking = useTracking()

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFiltersCountAction
  )
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFilterTypeAction
  )

  const filterParams = filterArtworksParams(appliedFiltersState, filterTypeState)
  const viewAsFilter = appliedFiltersState.find(
    (filter) => filter.paramName === FilterParamName.viewAs
  )
  const counts = saleArtworksConnection.saleArtworksConnection?.counts

  // Add the new medium to geneIDs array
  const refetchVariables = {
    ...filterParams,
    saleID: saleSlug,
    geneIDs: filterParams.additionalGeneIDs || [],
    includeArtworksByFollowedArtists: !!filterParams.includeArtworksByFollowedArtists,
  }

  useArtworkFilters({
    relay,
    aggregations: saleArtworksConnection.saleArtworksConnection?.aggregations,
    componentPath: "Sale/SaleLotsList",
    refetchVariables,
    onApply: () => scrollToTop(),
    refetchRef: artworksRefetchRef,
  })

  useEffect(() => {
    setFilterTypeAction("saleArtwork")
  }, [])

  useEffect(() => {
    setTotalCount(saleArtworksConnection.saleArtworksConnection?.counts?.total || 0)
  }, [])

  useEffect(() => {
    if (saleArtworksConnection.saleArtworksConnection?.counts) {
      setFiltersCountAction(saleArtworksConnection.saleArtworksConnection?.counts)
    }
  }, [])

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

  if (unfilteredSaleArtworksConnection?.counts?.total === 0) {
    return null
  }

  if (!saleArtworksConnection.saleArtworksConnection?.edges?.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Flex flex={0} my={4}>
      <SaleLotsListSortMode
        filterParams={filterParams}
        filteredTotal={counts?.total}
        totalCount={totalCount}
      />

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={saleArtworksConnection.saleArtworksConnection}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={saleArtworksConnection.saleArtworksConnection}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            isLoading={relay.isLoading}
            showLotLabel
            hidePartner
            hideRegisterBySignal
          />
        </Flex>
      )}
    </Flex>
  )
}

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    unfilteredSaleArtworksConnection: graphql`
      fragment SaleLotsList_unfilteredSaleArtworksConnection on SaleArtworksConnection {
        counts {
          total
        }
      }
    `,
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        artistIDs: { type: "[String]", defaultValue: [] }
        geneIDs: { type: "[String]", defaultValue: [] }
        estimateRange: { type: "String", defaultValue: "" }
        sort: { type: "String", defaultValue: "position" }
        includeArtworksByFollowedArtists: { type: "Boolean", defaultValue: false }
        saleID: { type: "ID" }
      ) {
        saleArtworksConnection(
          after: $cursor
          saleID: $saleID
          artistIDs: $artistIDs
          geneIDs: $geneIDs
          aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL]
          estimateRange: $estimateRange
          first: $count
          includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists
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
          counts {
            followedArtists
            total
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
    getConnectionFromProps(props) {
      return props?.saleArtworksConnection?.saleArtworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListQuery(
        $geneIDs: [String]
        $artistIDs: [String]
        $count: Int!
        $cursor: String
        $estimateRange: String
        $saleID: ID
        $sort: String
        $includeArtworksByFollowedArtists: Boolean
      )
      # $saleID: ID
      @raw_response_type {
        ...SaleLotsList_saleArtworksConnection
          @arguments(
            geneIDs: $geneIDs
            artistIDs: $artistIDs
            count: $count
            cursor: $cursor
            sort: $sort
            estimateRange: $estimateRange
            saleID: $saleID
            includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists
          )
      }
    `,
  }
)
