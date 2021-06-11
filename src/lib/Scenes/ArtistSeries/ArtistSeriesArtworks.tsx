import { OwnerType } from "@artsy/cohesion"
import { ArtistSeriesArtworks_artistSeries } from "__generated__/ArtistSeriesArtworks_artistSeries.graphql"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ARTIST_SERIES_PAGE_SIZE } from "lib/data/constants"
import { Schema } from "lib/utils/track"
import { Box, FilterIcon, Flex, Spacer, Text, Touchable } from "palette"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesArtworksProps {
  artistSeries: ArtistSeriesArtworks_artistSeries
  relay: RelayPaginationProp
  openFilterModal: () => void
}

const PAGE_SIZE = 20

export const ArtistSeriesArtworks: React.FC<ArtistSeriesArtworksProps> = ({ artistSeries, relay, openFilterModal }) => {
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions((state) => state.setFiltersCountAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const tracking = useTracking()
  const filterParams = filterArtworksParams(appliedFilters)

  const artworks = artistSeries?.artistSeriesArtworks!
  const artworksTotal = artworks?.counts?.total ?? 0

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("ArtistSeries/ArtistSeriesArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    setAggregationsAction(artworks?.aggregations)
  }, [])

  useEffect(() => {
    setFiltersCountAction({
      total: artworksTotal,
      followedArtists: null,
    })
  }, [artworksTotal])

  if (artworksTotal === 0) {
    return (
      <Box>
        <FilteredArtworkGridZeroState id={artistSeries.internalID} slug={artistSeries.slug} trackClear={trackClear} />
        <Spacer mb={2} />
      </Box>
    )
  } else {
    return (
      <Box>
        <InfiniteScrollArtworksGridContainer
          connection={artworks}
          loadMore={relay.loadMore}
          hasMore={relay.hasMore}
          autoFetch={false}
          pageSize={ARTIST_SERIES_PAGE_SIZE}
          contextScreenOwnerType={OwnerType.artistSeries}
          contextScreenOwnerId={artistSeries.internalID}
          contextScreenOwnerSlug={artistSeries.slug}
        />
      </Box>
    )
  }
}

export const ArtistSeriesArtworksFragmentContainer = createPaginationContainer(
  ArtistSeriesArtworks,
  {
    artistSeries: graphql`
      fragment ArtistSeriesArtworks_artistSeries on ArtistSeries
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        slug
        internalID
        artistSeriesArtworks: filterArtworksConnection(
          first: 20
          after: $cursor
          aggregations: [
            COLOR
            DIMENSION_RANGE
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
            PRICE_RANGE
          ]
          input: $input
        ) @connection(key: "ArtistSeries_artistSeriesArtworks") {
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
    getConnectionFromProps(props) {
      return props?.artistSeries.artistSeriesArtworks
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
        props,
        count,
        cursor,
        id: props.artistSeries.slug,
        input: fragmentVariables.input,
      }
    },
    query: graphql`
      query ArtistSeriesArtworksInfiniteScrollGridQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        artistSeries(id: $id) {
          ...ArtistSeriesArtworks_artistSeries @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
