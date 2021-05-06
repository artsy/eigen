import { OwnerType } from "@artsy/cohesion"
import { ArtistSeriesArtworks_artistSeries } from "__generated__/ArtistSeriesArtworks_artistSeries.graphql"
import { filterArtworksParams } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
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
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const tracking = useTracking()
  const filterParams = filterArtworksParams(appliedFilters)

  const artworks = artistSeries?.artistSeriesArtworks!

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
        filterParams
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    setAggregationsAction(artworks?.aggregations)
  }, [])

  const artworksTotal = artworks?.counts?.total

  if ((artworksTotal ?? 0) === 0) {
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
          stickyHeaderIndices={[0]}
          HeaderComponent={() => (
            <Box backgroundColor="white100" py={1}>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text variant="subtitle" color="black60">
                  Showing {artworksTotal} works
                </Text>
                <Touchable haptic onPress={openFilterModal}>
                  <Flex flexDirection="row">
                    <FilterIcon fill="black100" width="20px" height="20px" />
                    <Text variant="subtitle" color="black100">
                      Sort & Filter
                    </Text>
                  </Flex>
                </Touchable>
              </Flex>
              <Spacer mb={1} />
            </Box>
          )}
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
        sort: { type: "String", defaultValue: "-decayed_merch" }
        additionalGeneIDs: { type: "[String]" }
        priceRange: { type: "String" }
        color: { type: "String" }
        colors: { type: "[String]" }
        partnerID: { type: "ID" }
        partnerIDs: { type: "[String]" }
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
        artistSeriesArtworks: filterArtworksConnection(
          first: 20
          after: $cursor
          sort: $sort
          additionalGeneIDs: $additionalGeneIDs
          priceRange: $priceRange
          color: $color
          colors: $colors
          partnerID: $partnerID
          partnerIDs: $partnerIDs
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, PARTNER, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
          attributionClass: $attributionClass
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
        ...fragmentVariables,
        props,
        count,
        cursor,
        id: props.artistSeries.slug,
      }
    },
    query: graphql`
      query ArtistSeriesArtworksInfiniteScrollGridQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $sort: String
        $additionalGeneIDs: [String]
        $priceRange: String
        $color: String
        $colors: [String]
        $partnerID: ID
        $partnerIDs: [String]
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
        $attributionClass: [String]
      ) {
        artistSeries(id: $id) {
          ...ArtistSeriesArtworks_artistSeries
            @arguments(
              count: $count
              cursor: $cursor
              sort: $sort
              additionalGeneIDs: $additionalGeneIDs
              color: $color
              colors: $colors
              partnerID: $partnerID
              partnerIDs: $partnerIDs
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
