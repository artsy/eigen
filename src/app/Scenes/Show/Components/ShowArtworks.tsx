import { OwnerType } from "@artsy/cohesion"
import { Button, Screen, Spacer } from "@artsy/palette-mobile"
import { ShowArtworks_show$key } from "__generated__/ShowArtworks_show.graphql"
import { Show_show$data } from "__generated__/Show_show.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { aggregationsType, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { ShowArtworksEmptyStateFragmentContainer } from "app/Scenes/Show/Components/ShowArtworksEmptyState"
import { extractNodes } from "app/utils/extractNodes"
import { useRefreshControl } from "app/utils/refreshHelpers"
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
    <>
      <ShowArtworks show={show} />
      <ArtworkFilterNavigator
        visible={visible}
        id={show.internalID}
        slug={show.slug}
        mode={FilterModalMode.Show}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
      />
    </>
  )
}

export const ShowArtworks: React.FC<Props> = ({ show, initiallyAppliedFilter }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(fragment, show)
  const { internalID, slug } = data
  const artworksTotal = data?.showArtworks?.counts?.total ?? 0
  const unfilteredArtworksTotalCount = useRef(artworksTotal)
  const artworkAggregations = (data?.showArtworks?.aggregations ?? []) as aggregationsType

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
  const { scrollHandler } = Screen.useListenForScreenScroll()
  const RefreshControl = useRefreshControl(refetch)

  useArtworkFilters({
    refetch,
    aggregations: artworkAggregations,
    componentPath: "Show/ShowArtworks",
    pageSize: PAGE_SIZE,
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

  if (!data.showArtworks) {
    return null
  }

  // No artworks are available for this show
  if (unfilteredArtworksTotalCount.current === 0) {
    return <ShowArtworksEmptyStateFragmentContainer show={data} />
  }

  // No artworks match the applied filters
  if (artworksTotal === 0) {
    return (
      <>
        <FilteredArtworkGridZeroState id={internalID} slug={slug} />
        <Spacer y={2} />
      </>
    )
  }

  const artworks = extractNodes(data.showArtworks)

  return (
    <>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        isLoading={isLoadingNext}
        hasMore={hasNext}
        disableAutoLayout
        pageSize={PAGE_SIZE}
        contextScreenOwnerType={OwnerType.show}
        contextScreenOwnerId={data.internalID}
        contextScreenOwnerSlug={data.slug}
        onScroll={scrollHandler}
        refreshControl={RefreshControl}
        ListFooterComponent={() => {
          return (
            <Button
              mt={4}
              variant="fillGray"
              block
              size="large"
              onPress={() => loadNext(PAGE_SIZE)}
              loading={isLoadingNext}
            >
              Show more
            </Button>
          )
        }}
      />
      <Spacer y={4} />
    </>
  )
}

const fragment = graphql`
  fragment ShowArtworks_show on Show
  @refetchable(queryName: "ShowArtworksPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
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
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          id
          slug
          image(includeAll: false) {
            aspectRatio
          }
        }
      }
      counts {
        total
      }
    }
  }
`
