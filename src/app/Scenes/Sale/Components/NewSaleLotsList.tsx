import { OwnerType } from "@artsy/cohesion"
import { NewSaleLotsList_unfilteredArtworks$key } from "__generated__/NewSaleLotsList_unfilteredArtworks.graphql"
import { NewSaleLotsList_viewer$key } from "__generated__/NewSaleLotsList_viewer.graphql"
import { NewSaleLotsListQuery } from "__generated__/NewSaleLotsListQuery.graphql"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  DEFAULT_NEW_SALE_ARTWORK_SORT,
  ORDERED_NEW_SALE_ARTWORK_SORTS,
} from "app/Components/ArtworkFilter/Filters/SortOptions"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { isFunction } from "lodash"
import { Box, Flex, Text } from "palette"
import { useEffect, useRef, useState } from "react"
import {
  FetchPolicy,
  fetchQuery,
  graphql,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
  useRelayEnvironment,
} from "react-relay"
import useInterval from "react-use/lib/useInterval"

interface NewSaleLotsListContainerProps {
  unfilteredArtworks: NewSaleLotsList_unfilteredArtworks$key
  saleID: string
  saleSlug: string
}

interface NewSaleLotsListProps extends NewSaleLotsListContainerProps {
  viewer: NewSaleLotsList_viewer$key | null
  refetch: (variables: any) => void
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
  const input = prepareFilterArtworksParamsForInput(filterParams)
  const refetchVariables = {
    input: {
      priceRange: filterParams.estimateRange,
      ...input,
    },
  }
  const nodes = extractNodes(viewer?.artworksConnection)

  const autorefetchVariables = {
    ...refetchVariables,
    saleID,
    count: nodes.length,
  }
  const autorefetchVariablesRef = useRef(autorefetchVariables)
  autorefetchVariablesRef.current = autorefetchVariables

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

  console.log("[debug] nodes", nodes.length)

  useEffect(() => {
    setFilterTypeAction("newSaleArtwork")

    if (unfilteredArtworks?.counts) {
      setFiltersCountAction(unfilteredArtworks.counts)
    }

    if (unfilteredArtworks.aggregations) {
      setAggregationsAction(unfilteredArtworks.aggregations)
    }
  }, [])

  useEffect(() => {
    if (applyFilters) {
      handleRefetch()
    }
  }, [appliedFiltersState])

  useInterval(() => {
    console.log("[debug] refetch by interval", autorefetchVariablesRef.current)
    rest.refetch(autorefetchVariablesRef.current)
  }, 60 * 1000)

  if (totalCount === 0) {
    return null
  }

  if (!viewer?.artworksConnection?.edges?.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} />
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

export const NewSaleLotsListContainer: React.FC<NewSaleLotsListContainerProps> = (props) => {
  const { saleID } = props
  const environment = useRelayEnvironment()
  const [queryArgs, setQueryArgs] = useState({
    options: {
      fetchKey: 0,
      fetchPolicy: "store-and-network" as FetchPolicy,
    },
    variables: {
      saleID,
      count: PAGE_SIZE,
      input: {
        sort: DEFAULT_NEW_SALE_ARTWORK_SORT.paramValue,
      },
    },
  })
  const data = useLazyLoadQuery<NewSaleLotsListQuery>(query, queryArgs.variables, queryArgs.options)

  const refetch = (variables: any) => {
    fetchQuery(environment, query, variables).subscribe({
      complete: () => {
        setQueryArgs((prev) => ({
          options: {
            fetchPolicy: "store-only",
            fetchKey: (prev?.options.fetchKey ?? 0) + 1,
          },
          variables,
        }))
      },
      error: (error) => {
        console.log("[debug] error", error)
      },
    })
  }

  return <NewSaleLotsList viewer={data.viewer} refetch={refetch} {...props} />
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

const query = graphql`
  query NewSaleLotsListQuery($saleID: ID, $input: FilterArtworksInput, $count: Int) {
    viewer {
      ...NewSaleLotsList_viewer @arguments(saleID: $saleID, input: $input, count: $count)
    }
  }
`
