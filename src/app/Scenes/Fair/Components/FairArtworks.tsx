import { OwnerType } from "@artsy/cohesion"
import { Box, Text } from "@artsy/palette-mobile"
import { FairArtworks_fair$data } from "__generated__/FairArtworks_fair.graphql"
import {
  aggregationsType,
  aggregationsWithFollowedArtists,
  FilterArray,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FAIR2_ARTWORKS_PAGE_SIZE } from "app/Components/constants"
import { useScreenDimensions } from "app/utils/hooks"
import { pluralize } from "app/utils/pluralize"
import { Schema } from "app/utils/track"
import React, { useEffect } from "react"
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

  const screenWidth = useScreenDimensions().width

  const artworks = fair.fairArtworks
  const artworksTotal = artworks?.counts?.total ?? 0

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const dispatchFollowedArtistCount =
    (followedArtistCount || artworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || artworks?.aggregations) ?? []) as aggregationsType
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

  if (artworksTotal === 0) {
    return (
      <Box mb="80px">
        <FilteredArtworkGridZeroState
          id={fair.internalID}
          slug={fair.slug}
          trackClear={trackClear}
        />
      </Box>
    )
  }

  return (
    <Box>
      <Text variant="xs" weight="medium" my={2}>
        {artworksTotal} {pluralize("Artwork", artworksTotal)}:
      </Text>
      <InfiniteScrollArtworksGridContainer
        connection={artworks}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        autoFetch={false}
        pageSize={FAIR2_ARTWORKS_PAGE_SIZE}
        contextScreenOwnerType={OwnerType.fair}
        contextScreenOwnerId={fair.internalID}
        contextScreenOwnerSlug={fair.slug}
        width={screenWidth - 40}
      />
    </Box>
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
            }
          }
          counts {
            total
            followedArtists
          }
          ...InfiniteScrollArtworksGrid_connection
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
