import { OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text } from "@artsy/palette-mobile"
import { SaleLotsListViewer_viewer$key } from "__generated__/SaleLotsListViewer_viewer.graphql"
import { SaleLotsList_saleArtworksConnection$key } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
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
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface SharedProps {
  saleID: string
  saleSlug: string
  scrollToTop: () => void
  artworksRefetchRef?: MutableRefObject<() => void>
}

interface LegacyProps extends SharedProps {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection$key
  unfilteredSaleArtworksConnection:
    | SaleLotsList_unfilteredSaleArtworksConnection$data
    | null
    | undefined
}

interface NewProps extends SharedProps {
  viewer: SaleLotsListViewer_viewer$key
  unfilteredSaleArtworksConnection:
    | SaleLotsList_unfilteredSaleArtworksConnection$data
    | null
    | undefined
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

// Legacy Implementation using saleArtworksConnection
const SaleLotsListLegacy: React.FC<LegacyProps> = ({
  saleArtworksConnection,
  unfilteredSaleArtworksConnection,
  saleID,
  saleSlug,
  artworksRefetchRef,
  scrollToTop,
}) => {
  const tracking = useTracking()
  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment(
    legacyFragment,
    saleArtworksConnection
  )

  const artworksTotal = data?.saleArtworksConnection?.counts?.total ?? 0
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

  const refetchVariables = {
    ...filterParams,
    saleID: saleSlug,
    geneIDs: filterParams.additionalGeneIDs || [],
    includeArtworksByFollowedArtists: !!filterParams.includeArtworksByFollowedArtists,
  }

  useArtworkFilters({
    refetch,
    aggregations: data?.saleArtworksConnection?.aggregations,
    componentPath: "Sale/SaleLotsList",
    refetchVariables,
    onApply: () => scrollToTop(),
    refetchRef: artworksRefetchRef,
  })

  useEffect(() => {
    setFilterTypeAction("saleArtwork")
  }, [setFilterTypeAction])

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

  const totalCountForCheck = unfilteredSaleArtworksConnection?.counts?.total

  if (totalCountForCheck === 0) {
    return null
  }

  const connectionData = data?.saleArtworksConnection

  if (!connectionData?.edges?.length) {
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
        totalCount={unfilteredTotal.current}
      />

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={connectionData}
          hasMore={() => hasNext}
          loadMore={(pageSize: number) => {
            if (!isLoadingNext && hasNext) {
              return loadNext(pageSize || PAGE_SIZE)
            }
          }}
          isLoading={() => isLoadingNext}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
        />
      ) : (
        <Flex px={2} testID="sale-artworks-grid">
          <InfiniteScrollArtworksGridContainer
            connection={connectionData}
            loadMore={(pageSize, callback) => {
              const onComplete = typeof callback === "function" ? callback : undefined
              return loadNext(pageSize, { onComplete })
            }}
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            pageSize={PAGE_SIZE}
          />
        </Flex>
      )}
    </Flex>
  )
}

// New Implementation using viewer.artworksConnection
const SaleLotsListNew: React.FC<NewProps> = ({
  viewer,
  unfilteredSaleArtworksConnection,
  saleID,
  saleSlug,
  artworksRefetchRef,
  scrollToTop,
}) => {
  const tracking = useTracking()
  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment(
    newFragment,
    viewer
  )

  const artworksTotal = data?.artworksConnection?.counts?.total ?? 0
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

  const refetchVariables = {
    input: {
      priceRange: filterParams.estimateRange,
      ...prepareFilterArtworksParamsForInput(filterParams),
    },
  }

  useArtworkFilters({
    refetch,
    aggregations: data?.artworksConnection?.aggregations,
    componentPath: "Sale/NewSaleLotsList",
    refetchVariables,
    onApply: () => scrollToTop(),
    refetchRef: artworksRefetchRef,
  })

  useEffect(() => {
    setFilterTypeAction("newSaleArtwork")
  }, [setFilterTypeAction])

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

  const totalCountForCheck = unfilteredSaleArtworksConnection?.counts?.total

  if (totalCountForCheck === 0) {
    return null
  }

  const connectionData = data?.artworksConnection

  if (!connectionData?.edges?.length) {
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
        totalCount={unfilteredTotal.current}
      />

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={connectionData}
          hasMore={() => hasNext}
          loadMore={(pageSize: number) => {
            if (!isLoadingNext && hasNext) {
              return loadNext(pageSize || PAGE_SIZE)
            }
          }}
          isLoading={() => isLoadingNext}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
        />
      ) : (
        <Flex px={2} testID="sale-artworks-grid">
          <InfiniteScrollArtworksGridContainer
            connection={connectionData}
            loadMore={(pageSize, callback) => {
              const onComplete = typeof callback === "function" ? callback : undefined
              return loadNext(pageSize, { onComplete })
            }}
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            pageSize={PAGE_SIZE}
          />
        </Flex>
      )}
    </Flex>
  )
}

// Legacy pagination fragment
const legacyFragment = graphql`
  fragment SaleLotsList_saleArtworksConnection on Query
  @refetchable(queryName: "SaleLotsListLegacyPaginationQuery")
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
      ...InfiniteScrollArtworksGrid_connection
    }
  }
`

graphql`
  fragment SaleLotsList_unfilteredSaleArtworksConnection on SaleArtworksConnection {
    counts {
      total
    }
  }
`

// New pagination fragment
const newFragment = graphql`
  fragment SaleLotsListViewer_viewer on Viewer
  @refetchable(queryName: "SaleLotsListNewPaginationQuery")
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
      ...InfiniteScrollArtworksGrid_connection
    }
  }
`

// Wrapper component that chooses the right implementation based on feature flag
export const SaleLotsListContainer: React.FC<{
  saleArtworksConnection: SaleLotsList_saleArtworksConnection$key
  unfilteredSaleArtworksConnection:
    | SaleLotsList_unfilteredSaleArtworksConnection$data
    | null
    | undefined
  saleID: string
  saleSlug: string
  scrollToTop: () => void
  artworksRefetchRef?: MutableRefObject<() => void>
  viewer?: SaleLotsListViewer_viewer$key
}> = (props) => {
  const enableArtworksConnection = useFeatureFlag("AREnableArtworksConnectionForAuction2")

  if (enableArtworksConnection && props.viewer) {
    return (
      <SaleLotsListNew
        viewer={props.viewer}
        unfilteredSaleArtworksConnection={props.unfilteredSaleArtworksConnection}
        saleID={props.saleID}
        saleSlug={props.saleSlug}
        scrollToTop={props.scrollToTop}
        artworksRefetchRef={props.artworksRefetchRef}
      />
    )
  }

  return (
    <SaleLotsListLegacy
      saleArtworksConnection={props.saleArtworksConnection}
      unfilteredSaleArtworksConnection={props.unfilteredSaleArtworksConnection}
      saleID={props.saleID}
      saleSlug={props.saleSlug}
      scrollToTop={props.scrollToTop}
      artworksRefetchRef={props.artworksRefetchRef}
    />
  )
}
