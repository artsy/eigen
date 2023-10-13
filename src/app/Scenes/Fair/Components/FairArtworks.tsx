import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { FairArtworks_fair$data } from "__generated__/FairArtworks_fair.graphql"
import {
  aggregationsType,
  aggregationsWithFollowedArtists,
  FilterArray,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { FAIR2_ARTWORKS_PAGE_SIZE, PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface FairArtworksProps {
  fair: FairArtworks_fair$data
  relay: RelayPaginationProp
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
  const tracking = useTracking()

  const artworks = extractNodes(fair.fairArtworks)
  const artworksTotal = artworks?.length ?? 0

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const dispatchFollowedArtistCount =
    (followedArtistCount || fair?.fairArtworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || fair?.fairArtworks?.aggregations) ??
    []) as aggregationsType
  const dispatchAggregations = aggregationsWithFollowedArtists(
    dispatchFollowedArtistCount,
    artworkAggregations
  )

  useArtworkFilters({
    relay,
    aggregations: dispatchAggregations,
    componentPath: "Fair/FairArtworks",
    pageSize: FAIR2_ARTWORKS_PAGE_SIZE,
  })

  useEffect(() => {
    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal])

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

  return (
    <Flex flex={1} minHeight={2}>
      <MasonryInfiniteScrollArtworkGrid
        artworks={artworks}
        pageSize={PAGE_SIZE}
        contextScreenOwnerType={OwnerType.fair}
        contextScreenOwnerId={fair.internalID}
        contextScreenOwnerSlug={fair.slug}
        ListEmptyComponent={
          <FilteredArtworkGridZeroState
            id={fair.internalID}
            slug={fair.slug}
            trackClear={trackClear}
          />
        }
        hasMore={relay.hasMore()}
        loadMore={() => relay.loadMore(PAGE_SIZE)}
        isLoading={relay.isLoading()}
      />
    </Flex>
  )
}

export const FairArtworksFragmentContainer = createPaginationContainer(
  FairArtworks,
  {
    fair: graphql`
      fragment FairArtworks_fair on Fair
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
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.fair.fairArtworks
    },
    getFragmentVariables(previousVariables, count) {
      // Relay is unable to infer this for this component, I'm not sure why.
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
        id: props.fair.slug,
      }
    },
    query: graphql`
      query FairArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        fair(id: $id) {
          ...FairArtworks_fair @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
