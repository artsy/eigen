import { OwnerType } from "@artsy/cohesion"
import { NewSaleLotsList_unfilteredArtworks$key } from "__generated__/NewSaleLotsList_unfilteredArtworks.graphql"
import { NewSaleLotsList_viewer$key } from "__generated__/NewSaleLotsList_viewer.graphql"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_NEW_SALE_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { isFunction } from "lodash"
import { Box, Flex, Text } from "palette"
import { useEffect, useRef } from "react"
import { graphql, useFragment, usePaginationFragment } from "react-relay"
import useInterval from "react-use/lib/useInterval"

interface NewSaleLotsListProps {
  unfilteredArtworks: NewSaleLotsList_unfilteredArtworks$key
  viewer: NewSaleLotsList_viewer$key
  saleID: string
  saleSlug: string
}

export const NewSaleLotsList: React.FC<NewSaleLotsListProps> = ({ saleID, saleSlug, ...rest }) => {
  const unfilteredArtworks = useFragment(unfilteredArtworksFragment, rest.unfilteredArtworks)
  const {
    data: viewer,
    isLoadingNext,
    hasNext,
    loadNext,
    refetch,
  } = usePaginationFragment(viewerFragment, rest.viewer)

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFiltersCountAction
  )
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFilterTypeAction
  )
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setAggregationsAction
  )
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const filterParams = filterArtworksParams(appliedFiltersState, filterTypeState)
  const counts = viewer?.artworksConnection?.counts?.total
  const totalCount = unfilteredArtworks?.counts?.total
  const sortMode = ORDERED_NEW_SALE_ARTWORK_SORTS.find(
    (sort) => sort.paramValue === filterParams?.sort
  )

  const trackClear = () => {
    console.log("[debug] track clear")
  }

  const input = prepareFilterArtworksParamsForInput(filterParams)
  const refetchVariables = {
    input: {
      priceRange: filterParams.estimateRange,
      ...input,
    },
  }

  const refetchVariablesRef = useRef(refetchVariables)
  refetchVariablesRef.current = refetchVariables

  const handleRefetch = () => {
    console.log("[debug] refetch")

    refetch(refetchVariables, {
      fetchPolicy: "store-and-network",
      onComplete: (error) => {
        if (error) {
          throw new Error(error.message)
        }
      },
    })
  }

  const refetchRef = useRef(handleRefetch)
  refetchRef.current = handleRefetch

  const nodes = extractNodes(viewer?.artworksConnection)
  const nodesCountRef = useRef(PAGE_SIZE)
  nodesCountRef.current = nodes.length

  console.log("[debug] nodes", nodes.length)

  useEffect(() => {
    setFilterTypeAction("newSaleArtwork")

    if (unfilteredArtworks?.counts) {
      setFiltersCountAction(unfilteredArtworks.counts)
    }
  }, [])

  useEffect(() => {
    if (!unfilteredArtworks?.aggregations) {
      return
    }
    setAggregationsAction(unfilteredArtworks.aggregations)
  }, [])

  useEffect(() => {
    if (applyFilters) {
      refetchRef.current()
    }
  }, [appliedFiltersState])

  useInterval(() => {
    console.log("[debug] refetch by interval", nodesCountRef.current, refetchVariablesRef.current)
    const variables = {
      ...refetchVariablesRef.current,
      count: nodesCountRef.current,
    }

    refetch(variables, {
      fetchPolicy: "store-and-network",
      onComplete: (error) => {
        if (error) {
          throw new Error(error.message)
        }
      },
    })
  }, 60 * 1000)

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
    <Flex my={4}>
      <Flex px={2} mb={2}>
        <Text variant="md" ellipsizeMode="tail">
          Sorted by {sortMode?.displayText}
        </Text>

        <Text color="black60" variant="sm">
          Showing {counts} of {totalCount}
        </Text>
      </Flex>

      <Flex px={2}>
        <InfiniteScrollArtworksGridContainer
          connection={viewer.artworksConnection}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
          hasMore={() => hasNext}
          loadMore={(count, callback) =>
            loadNext(count, {
              onComplete: (error) => {
                if (isFunction(callback)) {
                  callback(error)
                }
              },
            })
          }
          isLoading={() => isLoadingNext}
          showLotLabel
          hidePartner
          hideUrgencyTags
        />
      </Flex>
    </Flex>
  )
}

const unfilteredArtworksFragment = graphql`
  fragment NewSaleLotsList_unfilteredArtworks on FilterArtworksConnection {
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
`

const viewerFragment = graphql`
  fragment NewSaleLotsList_viewer on Viewer
  @argumentDefinitions(
    saleID: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  )
  @refetchable(queryName: "NewSaleLotsListPaginationQuery") {
    artworksConnection(
      saleID: $saleID
      first: $count
      after: $cursor
      input: $input
      aggregations: [TOTAL, FOLLOWED_ARTISTS]
    ) @connection(key: "NewSaleLotsList__artworksConnection") {
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
`
