import { OwnerType } from "@artsy/cohesion"
import { Box } from "@artsy/palette-mobile"
import { ShowArtworks_show$key } from "__generated__/ShowArtworks_show.graphql"
import { Show_show$data } from "__generated__/Show_show.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { aggregationsType, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { SHOW2_ARTWORKS_PAGE_SIZE } from "app/Components/constants"
import { ShowArtworksEmptyStateFragmentContainer } from "app/Scenes/Show/Components/ShowArtworksEmptyState"
import React, { useEffect, useRef } from "react"
import { graphql, usePaginationFragment } from "react-relay"

interface Props {
  show: ShowArtworks_show$key
  initiallyAppliedFilter?: FilterArray
}

interface ArtworkProps {
  show: Show_show$data
  visible: boolean
  closeFilterArtworksModal: () => void
}

export const ShowArtworksWithNavigation = (props: ArtworkProps) => {
  const { show, visible, closeFilterArtworksModal } = props
  return (
    <Box px={2}>
      <ShowArtworks show={show} />
      <ArtworkFilterNavigator
        visible={visible}
        id={show.internalID}
        slug={show.slug}
        mode={FilterModalMode.Show}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
      />
    </Box>
  )
}

export const ShowArtworks: React.FC<Props> = ({ show, initiallyAppliedFilter }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(fragment, show)
  
  const { internalID, slug } = data
  const artworks = data.showArtworks
  const artworksTotal = artworks?.counts?.total ?? 0
  const unfilteredArtworksTotalCount = useRef(artworksTotal)
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
    refetch,
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

  // No artworks are available for this show
  if (unfilteredArtworksTotalCount.current === 0) {
    return <ShowArtworksEmptyStateFragmentContainer show={data} />
  }

  // No artworks match the applied filters
  if (artworksTotal === 0) {
    return <FilteredArtworkGridZeroState id={internalID} slug={slug} />
  }

  return (
    <Box>
      <InfiniteScrollArtworksGridContainer
        connection={artworks}
        loadMore={(count: number, cb?: () => void) => {
          loadNext(count, {
            onComplete: (error) => {
              if (error) {
                console.error("ShowArtworks.tsx", error.message)
              }
              cb?.()
            },
          })
        }}
        hasMore={hasNext}
        isLoading={isLoadingNext}
        autoFetch={false}
        pageSize={SHOW2_ARTWORKS_PAGE_SIZE}
        contextScreenOwnerType={OwnerType.show}
        contextScreenOwnerId={data.internalID}
        contextScreenOwnerSlug={data.slug}
      />
    </Box>
  )
}

const fragment = graphql`
  fragment ShowArtworks_show on Show
  @refetchable(queryName: "ShowArtworksPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 30 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    slug
    internalID
    ...ShowArtworksEmptyState_show
    showArtworks: filterArtworksConnection(
      first: $count
      after: $cursor
      aggregations: [MEDIUM, TOTAL, MAJOR_PERIOD, ARTIST_NATIONALITY, MATERIALS_TERMS, ARTIST]
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
`
