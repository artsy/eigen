import { OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text } from "@artsy/palette-mobile"
import { SaleLotsList_unfilteredArtworks$data } from "__generated__/SaleLotsList_unfilteredArtworks.graphql"
import { SaleLotsList_viewer$data } from "__generated__/SaleLotsList_viewer.graphql"
import {
  filterArtworksParams,
  FilterParamName,
  prepareFilterArtworksParamsForInput,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_SALE_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Schema } from "app/utils/track"
import { MutableRefObject, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface SaleLotsListProps {
  unfilteredArtworks: SaleLotsList_unfilteredArtworks$data | null
  viewer: SaleLotsList_viewer$data | null
  saleID: string
  saleSlug: string
  relay: RelayPaginationProp
  artworksRefetchRef?: MutableRefObject<() => void>
  scrollToTop: () => void
}

export const SaleLotsList: React.FC<SaleLotsListProps> = ({
  unfilteredArtworks,
  viewer,
  saleID,
  saleSlug,
  relay,
  artworksRefetchRef,
  scrollToTop,
}) => {
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
  const counts = viewer?.artworksConnection?.counts?.total
  const totalCount = unfilteredArtworks?.counts?.total
  const sortMode = ORDERED_SALE_ARTWORK_SORTS.find((sort) => sort.paramValue === filterParams?.sort)

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

  useEffect(() => {
    setFilterTypeAction("saleArtwork")

    if (unfilteredArtworks?.counts) {
      setFiltersCountAction(unfilteredArtworks.counts)
    }
  }, [])

  const input = prepareFilterArtworksParamsForInput(filterParams)
  const refetchVariables = {
    input: {
      priceRange: filterParams.estimateRange,
      ...input,
    },
  }

  useArtworkFilters({
    relay,
    aggregations: unfilteredArtworks?.aggregations,
    componentPath: "Sale/SaleLotsList",
    refetchVariables,
    refetchRef: artworksRefetchRef,
    onApply: () => scrollToTop(),
  })

  if (totalCount === 0) {
    return null
  }

  if (!viewer?.artworksConnection?.edges?.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Flex flex={0} my={4}>
      <Flex px={2} mb={2}>
        <Text variant="sm-display" ellipsizeMode="tail">
          Sorted by {sortMode?.displayText}
        </Text>

        <Text color="black60" variant="sm">
          Showing {counts} of {totalCount}
        </Text>
      </Flex>

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={viewer.artworksConnection}
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
            connection={viewer.artworksConnection}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            isLoading={relay.isLoading}
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
    unfilteredArtworks: graphql`
      fragment SaleLotsList_unfilteredArtworks on FilterArtworksConnection {
        counts {
          followedArtists
          total
        }

        aggregations {
          slice
          counts {
            count
            name
            value
          }
        }
      }
    `,
    viewer: graphql`
      fragment SaleLotsList_viewer on Viewer
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
          aggregations: [TOTAL, FOLLOWED_ARTISTS]
        ) @connection(key: "SaleLotsList__artworksConnection") {
          counts {
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
      return props.viewer?.artworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListRefetchQuery(
        $saleID: ID!
        $count: Int
        $cursor: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...SaleLotsList_viewer
            @arguments(saleID: $saleID, count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
