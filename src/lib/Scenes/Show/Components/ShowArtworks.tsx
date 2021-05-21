import { OwnerType } from "@artsy/cohesion"
import { Show_show } from "__generated__/Show_show.graphql"
import { ShowArtworks_show } from "__generated__/ShowArtworks_show.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import {
  aggregationsType,
  FilterArray,
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { SHOW2_ARTWORKS_PAGE_SIZE } from "lib/data/constants"
import { Box } from "palette"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props {
  show: ShowArtworks_show
  relay: RelayPaginationProp
  initiallyAppliedFilter?: FilterArray
}

interface ArtworkProps {
  show: Show_show
  isFilterArtworksModalVisible: boolean
  toggleFilterArtworksModal: () => void
}

export const ShowArtworksWithNavigation = (props: ArtworkProps) => {
  const { show, isFilterArtworksModalVisible, toggleFilterArtworksModal } = props
  return (
    <Box px={2}>
      <ShowArtworksPaginationContainer show={show} />
      <ArtworkFilterNavigator
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
        id={show.internalID}
        slug={show.slug}
        mode={FilterModalMode.Show}
        exitModal={toggleFilterArtworksModal}
        closeModal={toggleFilterArtworksModal}
      />
    </Box>
  )
}

const ShowArtworks: React.FC<Props> = ({ show, relay, initiallyAppliedFilter }) => {
  const artworks = show.showArtworks!
  const { internalID, slug } = show

  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions((state) => state.setInitialFilterStateAction)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions((state) => state.setFilterTypeAction)

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const filterParams = filterArtworksParams(appliedFilters, "showArtwork")

  useEffect(() => {
    setFilterTypeAction("showArtwork")

    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        SHOW2_ARTWORKS_PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Show/ShowArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  const artworkAggregations = (artworks?.aggregations ?? []) as aggregationsType

  useEffect(() => {
    setAggregationsAction(artworkAggregations)
  }, [])

  if ((artworks?.counts?.total ?? 0) === 0) {
    return <FilteredArtworkGridZeroState id={internalID} slug={slug} />
  }

  return (
    <Box>
      <InfiniteScrollArtworksGridContainer
        connection={artworks}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        autoFetch={false}
        pageSize={SHOW2_ARTWORKS_PAGE_SIZE}
        contextScreenOwnerType={OwnerType.show}
        contextScreenOwnerId={show.internalID}
        contextScreenOwnerSlug={show.slug}
      />
    </Box>
  )
}

export const ShowArtworksPaginationContainer = createPaginationContainer(
  ShowArtworks,
  {
    show: graphql`
      fragment ShowArtworks_show on Show
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        slug
        internalID
        showArtworks: filterArtworksConnection(
          first: 30
          after: $cursor
          aggregations: [COLOR, DIMENSION_RANGE, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, MATERIALS_TERMS, ARTIST_NATIONALITY]
          input: $input
        ) @connection(key: "Show_showArtworks") {
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
          counts {
            total
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getFragmentVariables(previousVariables, count) {
      return {
        ...previousVariables,
        count,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        props,
        count,
        cursor,
        id: props.show.slug,
      }
    },
    query: graphql`
      query ShowArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        show(id: $id) {
          ...ShowArtworks_show @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
