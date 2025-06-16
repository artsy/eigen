import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text, Spacer } from "@artsy/palette-mobile"
import { SaleLotsListViewer_viewer$data } from "__generated__/SaleLotsListViewer_viewer.graphql"
import { SaleLotsList_saleArtworksConnection$data } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { SaleLotsList_unfilteredSaleArtworksConnection$data } from "__generated__/SaleLotsList_unfilteredSaleArtworksConnection.graphql"
import {
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  prepareFilterArtworksParamsForInput,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  ORDERED_SALE_ARTWORK_SORTS,
  ORDERED_NEW_SALE_ARTWORK_SORTS,
} from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
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
  viewer?: SaleLotsListViewer_viewer$data
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
  const enableArtworksConnection = useFeatureFlag("AREnableArtworksConnectionForAuction2")
  const getSortDescription = useCallback(() => {
    const sortModes = enableArtworksConnection
      ? ORDERED_NEW_SALE_ARTWORK_SORTS
      : ORDERED_SALE_ARTWORK_SORTS
    const sortMode = sortModes.find((sort) => sort.paramValue === filterParams?.sort)
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams, enableArtworksConnection])

  return (
    <Flex px={2} mb={2}>
      <Text variant="sm-display" ellipsizeMode="tail">
        Sorted by{" "}
        {enableArtworksConnection ? getSortDescription() : getSortDescription()?.toLowerCase()}
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
  viewer,
}) => {
  const tracking = useTracking()
  const enableArtworksConnection = useFeatureFlag("AREnableArtworksConnectionForAuction2")
  const artworksTotal = enableArtworksConnection
    ? viewer?.artworksConnection?.counts?.total ?? 0
    : saleArtworksConnection.saleArtworksConnection?.counts?.total ?? 0
  const unfilteredTotal = useRef<number>(artworksTotal)

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
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  // Add the new medium to geneIDs array
  const refetchVariables = enableArtworksConnection
    ? {
        input: {
          priceRange: filterParams.estimateRange,
          ...prepareFilterArtworksParamsForInput(filterParams),
        },
      }
    : {
        ...filterParams,
        saleID: saleSlug,
        geneIDs: filterParams.additionalGeneIDs || [],
        includeArtworksByFollowedArtists: !!filterParams.includeArtworksByFollowedArtists,
      }

  useArtworkFilters({
    relay,
    aggregations: enableArtworksConnection
      ? viewer?.artworksConnection?.aggregations
      : saleArtworksConnection.saleArtworksConnection?.aggregations,
    componentPath: enableArtworksConnection ? "Sale/NewSaleLotsList" : "Sale/SaleLotsList",
    refetchVariables,
    onApply: () => scrollToTop(),
    refetchRef: artworksRefetchRef,
  })

  useEffect(() => {
    setFilterTypeAction(enableArtworksConnection ? "newSaleArtwork" : "saleArtwork")
  }, [enableArtworksConnection, setFilterTypeAction])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal, setFiltersCountAction])

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

  const totalCountForCheck = enableArtworksConnection
    ? viewer?.artworksConnection?.counts?.total ?? 0
    : unfilteredSaleArtworksConnection?.counts?.total

  if (totalCountForCheck === 0) {
    return null
  }

  const connectionData = enableArtworksConnection
    ? viewer?.artworksConnection
    : saleArtworksConnection.saleArtworksConnection

  if (!connectionData?.edges?.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  const artworks = extractNodes(connectionData)
  const hasMore = relay.hasMore()
  const isLoading = relay.isLoading()
  console.log("cb::render", { hasMore, isLoading })

  return (
    <Flex flex={0} my={4}>
      <SaleLotsListSortMode
        filterParams={filterParams}
        filteredTotal={enableArtworksConnection ? artworks?.length : counts?.total}
        totalCount={unfilteredTotal.current}
      />

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={connectionData}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
        />
      ) : (
        <>
          <MasonryInfiniteScrollArtworkGrid
            animated
            artworks={artworks}
            contextModule={ContextModule.auctionHome}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            hasMore={hasMore}
            loadMore={() => relay.loadMore(PAGE_SIZE)}
            isLoading={isLoading}
            hideSaleInfo={false}
            hideSaveIcon={true}
            pageSize={PAGE_SIZE}
          />
          <Spacer y={4} />
        </>
      )}
    </Flex>
  )
}

// Legacy pagination container for saleArtworksConnection
const SaleLotsListLegacyContainer = createPaginationContainer(
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
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
            }
          }
          ...SaleArtworkList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.saleArtworksConnection?.saleArtworksConnection
    },
    getVariables(_, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListLegacyQuery(
        $geneIDs: [String]
        $artistIDs: [String]
        $count: Int!
        $cursor: String
        $estimateRange: String
        $saleID: ID
        $sort: String
        $includeArtworksByFollowedArtists: Boolean
      ) @raw_response_type {
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

// New pagination container for viewer.artworksConnection
const SaleLotsListNewContainer = createPaginationContainer(
  SaleLotsList,
  {
    viewer: graphql`
      fragment SaleLotsListViewer_viewer on Viewer
      @argumentDefinitions(
        saleID: { type: "ID" }
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworksConnection(
          saleID: $saleID
          first: $count
          after: $cursor
          input: $input
          aggregations: [TOTAL, FOLLOWED_ARTISTS, ARTIST, MEDIUM]
        ) @connection(key: "SaleLotsListViewer_artworksConnection") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          counts {
            total
            followedArtists
          }
          edges {
            node {
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
            }
          }
          ...SaleArtworkList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.viewer?.artworksConnection
    },
    getVariables(_, { count, cursor }, fragmentVariables) {
      return {
        saleID: fragmentVariables.saleID,
        input: fragmentVariables.input,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListNewQuery(
        $count: Int!
        $cursor: String
        $saleID: ID
        $input: FilterArtworksInput
      ) @raw_response_type {
        viewer {
          ...SaleLotsListViewer_viewer
            @arguments(saleID: $saleID, count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)

// Wrapper component that chooses the right container based on feature flag
export const SaleLotsListContainer: React.FC<Omit<Props, "relay">> = (props) => {
  const enableArtworksConnection = useFeatureFlag("AREnableArtworksConnectionForAuction2")

  if (enableArtworksConnection) {
    return <SaleLotsListNewContainer {...props} />
  }

  return <SaleLotsListLegacyContainer {...props} />
}
