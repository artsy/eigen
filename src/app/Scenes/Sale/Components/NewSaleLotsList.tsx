import { OwnerType } from "@artsy/cohesion"
import { NewSaleLotsList_unfilteredArtworks$data } from "__generated__/NewSaleLotsList_unfilteredArtworks.graphql"
import { NewSaleLotsList_viewer$data } from "__generated__/NewSaleLotsList_viewer.graphql"
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
import { Box, Flex, Text } from "palette"
import { useEffect, useRef } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import useInterval from "react-use/lib/useInterval"

interface NewSaleLotsListProps {
  unfilteredArtworks: NewSaleLotsList_unfilteredArtworks$data | null
  viewer: NewSaleLotsList_viewer$data | null
  saleID: string
  saleSlug: string
  relay: RelayPaginationProp
}

export const NewSaleLotsList: React.FC<NewSaleLotsListProps> = ({
  unfilteredArtworks,
  viewer,
  saleID,
  saleSlug,
  relay,
}) => {
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

  const nodes = extractNodes(viewer?.artworksConnection)
  const nodesCountRef = useRef(PAGE_SIZE)
  nodesCountRef.current = nodes.length

  console.log("[debug] nodes", nodes.length)

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

  const refetch = () => {
    console.log("[debug] refetch")

    if (relay !== undefined) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error(error.message)
          }
        },
        refetchVariables
      )
    }
  }

  const refetchRef = useRef(refetch)
  refetchRef.current = refetch

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

    relay.refetchConnection(
      nodesCountRef.current,
      (error) => {
        if (error) {
          throw new Error(error.message)
        }
      },
      refetchVariablesRef.current
    )
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
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
          showLotLabel
          hidePartner
          hideUrgencyTags
        />
      </Flex>
    </Flex>
  )
}

export const NewSaleLotsListContainer = createPaginationContainer(
  NewSaleLotsList,
  {
    unfilteredArtworks: graphql`
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
    `,
    viewer: graphql`
      fragment NewSaleLotsList_viewer on Viewer
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
          aggregations: [TOTAL]
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
      query NewSaleLotsListQuery(
        $saleID: ID!
        $count: Int
        $cursor: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...NewSaleLotsList_viewer
            @arguments(saleID: $saleID, count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
