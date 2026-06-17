import { OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text } from "@artsy/palette-mobile"
import { SaleLotsListViewer_viewer$key } from "__generated__/SaleLotsListViewer_viewer.graphql"
import {
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  prepareFilterArtworksParamsForInput,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_SALE_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { Schema } from "app/utils/track"
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface SaleLotsListProps {
  saleID: string
  saleSlug: string
  scrollToTop: () => void
  artworksRefetchRef?: MutableRefObject<() => void>
  artworksLoadMoreRef?: MutableRefObject<() => void>
  viewer: SaleLotsListViewer_viewer$key
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
        Sorted by {getSortDescription()}
      </Text>

      {!!filteredTotal && !!totalCount && (
        <Text color="mono60" variant="sm">{`Showing ${filteredTotal} of ${totalCount}`}</Text>
      )}
    </Flex>
  )
}

const SaleLotsList: React.FC<SaleLotsListProps> = ({
  viewer,
  saleID,
  saleSlug,
  artworksRefetchRef,
  artworksLoadMoreRef,
  scrollToTop,
}) => {
  const tracking = useTracking()
  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment(
    saleLotsPaginationFragment,
    viewer
  )

  useEffect(() => {
    if (artworksLoadMoreRef) {
      artworksLoadMoreRef.current = () => {
        if (!isLoadingNext && hasNext) {
          loadNext(PAGE_SIZE)
        }
      }
    }
  }, [artworksLoadMoreRef, isLoadingNext, hasNext, loadNext])

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

  const connectionData = data?.artworksConnection

  const hasActiveFilters = appliedFiltersState.some(
    (filter) =>
      filter.paramName !== FilterParamName.sort && filter.paramName !== FilterParamName.viewAs
  )

  if (!connectionData?.edges?.length) {
    if (hasActiveFilters) {
      return (
        <Box my="80px">
          <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
        </Box>
      )
    }
    return (
      <Box my="80px">
        <Flex flexDirection="column" alignItems="center" px={4}>
          <Text textAlign="center" color="mono100" variant="sm">
            No results found
          </Text>
        </Flex>
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

graphql`
  fragment SaleLotsList_unfilteredSaleArtworksConnection on SaleArtworksConnection {
    counts {
      total
    }
  }
`

const saleLotsPaginationFragment = graphql`
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

export const SaleLotsListContainer: React.FC<{
  saleID: string
  saleSlug: string
  scrollToTop: () => void
  artworksRefetchRef?: MutableRefObject<() => void>
  artworksLoadMoreRef?: MutableRefObject<() => void>
  viewer?: SaleLotsListViewer_viewer$key
}> = (props) => {
  if (!props.viewer) {
    return null
  }

  return (
    <SaleLotsList
      viewer={props.viewer}
      saleID={props.saleID}
      saleSlug={props.saleSlug}
      scrollToTop={props.scrollToTop}
      artworksRefetchRef={props.artworksRefetchRef}
      artworksLoadMoreRef={props.artworksLoadMoreRef}
    />
  )
}
