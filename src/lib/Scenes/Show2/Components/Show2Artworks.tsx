import { OwnerType } from "@artsy/cohesion"
import { Show2_show } from "__generated__/Show2_show.graphql"
import { Show2Artworks_show } from "__generated__/Show2Artworks_show.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { SHOW2_ARTWORKS_PAGE_SIZE } from "lib/data/constants"
import { ArtworkFilterContext, FilterArray } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationsType, filterArtworksParams } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Box } from "palette"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props {
  show: Show2Artworks_show
  relay: RelayPaginationProp
  initiallyAppliedFilter?: FilterArray
}

interface ArtworkProps {
  show: Show2_show
  isFilterArtworksModalVisible: boolean
  toggleFilterArtworksModal: () => void
}

export const Show2ArtworksWithNavigation = (props: ArtworkProps) => {
  const { show, isFilterArtworksModalVisible, toggleFilterArtworksModal } = props
  return (
    <Box px={2}>
      <Show2ArtworksPaginationContainer show={show} />
      <FilterModalNavigator
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

const Show2Artworks: React.FC<Props> = ({ show, relay, initiallyAppliedFilter }) => {
  const artworks = show.showArtworks!
  const { internalID, slug } = show
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)

  useEffect(() => {
    if (initiallyAppliedFilter) {
      dispatch({ type: "setInitialFilterState", payload: initiallyAppliedFilter })
    }
  }, [])

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        SHOW2_ARTWORKS_PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Show/ShowArtworks filter error: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  const artworkAggregations = (artworks?.aggregations ?? []) as aggregationsType

  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: artworkAggregations,
    })
  }, [])

  if ((artworks?.counts?.total ?? 0) === 0) {
    return <FilteredArtworkGridZeroState id={internalID} slug={slug} />
  }

  return (
    <Box mb={3}>
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

export const Show2ArtworksPaginationContainer = createPaginationContainer(
  Show2Artworks,
  {
    show: graphql`
      fragment Show2Artworks_show on Show
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        sort: { type: "String", defaultValue: "-decayed_merch" }
        medium: { type: "String", defaultValue: "*" }
        priceRange: { type: "String" }
        color: { type: "String" }
        dimensionRange: { type: "String", defaultValue: "*-*" }
        majorPeriods: { type: "[String]" }
        acquireable: { type: "Boolean" }
        inquireableOnly: { type: "Boolean" }
        atAuction: { type: "Boolean" }
        offerable: { type: "Boolean" }
      ) {
        slug
        internalID
        showArtworks: filterArtworksConnection(
          first: 30
          after: $cursor
          sort: $sort
          medium: $medium
          priceRange: $priceRange
          color: $color
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
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
        ...fragmentVariables,
        props,
        count,
        cursor,
        id: props.show.slug,
      }
    },
    query: graphql`
      query Show2ArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $priceRange: String
        $color: String
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
      ) {
        show(id: $id) {
          ...Show2Artworks_show
            @arguments(
              count: $count
              cursor: $cursor
              sort: $sort
              medium: $medium
              color: $color
              priceRange: $priceRange
              dimensionRange: $dimensionRange
              majorPeriods: $majorPeriods
              acquireable: $acquireable
              inquireableOnly: $inquireableOnly
              atAuction: $atAuction
              offerable: $offerable
            )
        }
      }
    `,
  }
)
