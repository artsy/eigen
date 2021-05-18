import { OwnerType } from "@artsy/cohesion"
import { FairArtworks_fair } from "__generated__/FairArtworks_fair.graphql"
import {
  aggregationsType,
  aggregationsWithFollowedArtists,
  FilterArray,
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FAIR2_ARTWORKS_PAGE_SIZE } from "lib/data/constants"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box } from "palette"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface FairArtworksProps {
  fair: FairArtworks_fair
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
  const artworks = fair.fairArtworks!
  const tracking = useTracking()

  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions((state) => state.setInitialFilterStateAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const filterParams = filterArtworksParams(appliedFilters)

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

  useEffect(() => {
    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        FAIR2_ARTWORKS_PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Fair/FairArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  const dispatchFollowedArtistCount = (followedArtistCount || artworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || artworks?.aggregations) ?? []) as aggregationsType
  const dispatchAggregations = aggregationsWithFollowedArtists(dispatchFollowedArtistCount, artworkAggregations)

  useEffect(() => {
    setAggregationsAction(dispatchAggregations)
  }, [])

  const screenWidth = useScreenDimensions().width

  if ((artworks?.counts?.total ?? 0) === 0) {
    return (
      <Box mb="80px">
        <FilteredArtworkGridZeroState id={fair.internalID} slug={fair.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Box>
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
          aggregations: [COLOR, DIMENSION_RANGE, PARTNER, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST],
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
          ...FairArtworks_fair
            @arguments(
              count: $count
              cursor: $cursor
              input: $input
            )
        }
      }
    `,
  }
)
