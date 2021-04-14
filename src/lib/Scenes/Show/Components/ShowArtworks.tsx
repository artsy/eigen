import { OwnerType } from "@artsy/cohesion"
import { Show_show } from "__generated__/Show_show.graphql"
import { ShowArtworks_show } from "__generated__/ShowArtworks_show.graphql"
import { FilterModalMode, ArtworkFilterNavigator } from "lib/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { aggregationsType, FilterArray, filterArtworksParams } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
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
        filterParams
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

export const ShowArtworksPaginationContainer = createPaginationContainer(
  ShowArtworks,
  {
    show: graphql`
      fragment ShowArtworks_show on Show
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        sort: { type: "String", defaultValue: "partner_show_position" }
        additionalGeneIDs: { type: "[String]" }
        priceRange: { type: "String" }
        color: { type: "String" }
        colors: { type: "[String]" }
        dimensionRange: { type: "String", defaultValue: "*-*" }
        majorPeriods: { type: "[String]" }
        acquireable: { type: "Boolean" }
        inquireableOnly: { type: "Boolean" }
        atAuction: { type: "Boolean" }
        offerable: { type: "Boolean" }
        attributionClass: { type: "[String]" }
      ) {
        slug
        internalID
        showArtworks: filterArtworksConnection(
          first: 30
          after: $cursor
          sort: $sort
          additionalGeneIDs: $additionalGeneIDs
          priceRange: $priceRange
          color: $color
          colors: $colors
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
          attributionClass: $attributionClass
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
      query ShowArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $sort: String
        $additionalGeneIDs: [String]
        $priceRange: String
        $color: String
        $colors: [String]
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
        $attributionClass: [String]
      ) {
        show(id: $id) {
          ...ShowArtworks_show
            @arguments(
              count: $count
              cursor: $cursor
              sort: $sort
              additionalGeneIDs: $additionalGeneIDs
              color: $color
              colors: $colors
              priceRange: $priceRange
              dimensionRange: $dimensionRange
              majorPeriods: $majorPeriods
              acquireable: $acquireable
              inquireableOnly: $inquireableOnly
              atAuction: $atAuction
              offerable: $offerable
              attributionClass: $attributionClass
            )
        }
      }
    `,
  }
)
