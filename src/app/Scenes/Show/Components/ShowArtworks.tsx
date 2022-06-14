import { OwnerType } from "@artsy/cohesion"
import { Show_show$data } from "__generated__/Show_show.graphql"
import { ShowArtworks_show$data } from "__generated__/ShowArtworks_show.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { aggregationsType, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { SHOW2_ARTWORKS_PAGE_SIZE } from "app/Components/constants"
import { Box } from "palette"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props {
  show: ShowArtworks_show$data
  relay: RelayPaginationProp
  initiallyAppliedFilter?: FilterArray
}

interface ArtworkProps {
  show: Show_show$data
  visible: boolean
  toggleFilterArtworksModal: () => void
}

export const ShowArtworksWithNavigation = (props: ArtworkProps) => {
  const { show, visible, toggleFilterArtworksModal } = props
  return (
    <Box px={2}>
      <ShowArtworksPaginationContainer show={show} />
      <ArtworkFilterNavigator
        visible={visible}
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
  const { internalID, slug } = show
  const artworks = show.showArtworks!
  const artworksTotal = artworks?.counts?.total ?? 0
  const artworkAggregations = (artworks?.aggregations ?? []) as aggregationsType

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFilterTypeAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  useArtworkFilters({
    relay,
    aggregations: artworkAggregations,
    componentPath: "Show/ShowArtworks",
    pageSize: SHOW2_ARTWORKS_PAGE_SIZE,
  })

  useEffect(() => {
    setFilterTypeAction("showArtwork")

    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal])

  if (artworksTotal === 0) {
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
          first: $count
          after: $cursor
          aggregations: [
            ARTIST
            ARTIST_NATIONALITY
            COLOR
            DIMENSION_RANGE
            FOLLOWED_ARTISTS
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PRICE_RANGE
          ]
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
