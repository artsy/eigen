import { OwnerType } from "@artsy/cohesion"
import { Button, Flex } from "@artsy/palette-mobile"
import { FairArtworks_fair$key } from "__generated__/FairArtworks_fair.graphql"
import {
  aggregationsType,
  aggregationsWithFollowedArtists,
  FilterArray,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { FAIR_ARTWORKS_PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { useEffect } from "react"
import { RelayPaginationProp, graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FairArtworksProps {
  fair: FairArtworks_fair$key | null
  relay?: RelayPaginationProp
  initiallyAppliedFilter?: FilterArray
  aggregations?: aggregationsType
  followedArtistCount?: number | null | undefined
}

export const FairArtworks: React.FC<FairArtworksProps> = ({
  fair,
  relay,
  initiallyAppliedFilter,
  aggregations,
  followedArtistCount,
}) => {
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    FairArtworksFragment,
    fair
  )

  const tracking = useTracking()

  const artworks = extractNodes(data?.fairArtworks)
  const artworksTotal = artworks?.length ?? 0

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const dispatchFollowedArtistCount =
    (followedArtistCount || data?.fairArtworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || data?.fairArtworks?.aggregations) ??
    []) as aggregationsType
  const dispatchAggregations = aggregationsWithFollowedArtists(
    dispatchFollowedArtistCount,
    artworkAggregations
  )

  useArtworkFilters({
    relay,
    relayPaginationHookRefetch: refetch,
    aggregations: dispatchAggregations,
    componentPath: "Fair/FairArtworks",
    pageSize: FAIR_ARTWORKS_PAGE_SIZE,
  })

  useEffect(() => {
    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal])

  if (!data) {
    return null
  }

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(FAIR_ARTWORKS_PAGE_SIZE)
  }

  return (
    <Flex flex={1} minHeight={2}>
      <MasonryInfiniteScrollArtworkGrid
        artworks={artworks}
        pageSize={FAIR_ARTWORKS_PAGE_SIZE}
        contextScreenOwnerType={OwnerType.fair}
        contextScreenOwnerId={data.internalID}
        contextScreenOwnerSlug={data.slug}
        ListEmptyComponent={
          <FilteredArtworkGridZeroState
            id={data.internalID}
            slug={data.slug}
            trackClear={trackClear}
          />
        }
        hasMore={false}
        ListFooterComponent={
          !!hasNext ? (
            <Button
              mt={6}
              mb={4}
              variant="fillGray"
              size="large"
              block
              onPress={handleLoadMore}
              loading={isLoadingNext}
            >
              Show more
            </Button>
          ) : null
        }
      />
    </Flex>
  )
}

export const FairArtworksFragment = graphql`
  fragment FairArtworks_fair on Fair
  @refetchable(queryName: "FairArtworksQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 30 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    slug
    internalID
    fairArtworks: filterArtworksConnection(
      first: $count
      after: $cursor
      aggregations: [
        ARTIST
        ARTIST_NATIONALITY
        COLOR
        DIMENSION_RANGE
        FOLLOWED_ARTISTS
        LOCATION_CITY
        MAJOR_PERIOD
        MATERIALS_TERMS
        MEDIUM
        PARTNER
        PRICE_RANGE
      ]
      input: $input
    ) @connection(key: "Fair_fairArtworks") {
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
          slug
          image(includeAll: false) {
            aspectRatio
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
      counts {
        total
        followedArtists
      }
    }
  }
`
