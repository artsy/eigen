import { OwnerType } from "@artsy/cohesion"
import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import { Schema } from "lib/utils/track"
import { Box, Separator } from "palette"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface CollectionArtworksProps {
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
  scrollToTop: () => void
}

const PAGE_SIZE = 10

export const CollectionArtworks: React.FC<CollectionArtworksProps> = ({ collection, relay, scrollToTop }) => {
  const tracking = useTracking()
  const { isDepartment } = collection
  const artworks = get(collection, (p) => p.collectionArtworks)
  const artworksTotal = artworks?.counts?.total

  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions((action) => action.setFiltersCountAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const filterParams = filterArtworksParams(appliedFilters)
  const followedArtists = ArtworksFiltersStore.useStoreState((state) => state.counts.followedArtists)

  useEffect(() => {
    if (applyFilters) {
      scrollToTop()

      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Collection/CollectionArtworks sort: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    setAggregationsAction(collection.collectionArtworks!.aggregations)
  }, [])

  useEffect(() => {
    // for use by CollectionArtworksFilter to keep count
    setFiltersCountAction({
      total: artworksTotal ?? null,
      followedArtists,
    })
  }, [artworksTotal])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.Collection,
      context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  if (artworksTotal === 0) {
    return (
      <Box mt={isDepartment ? "0px" : "-50px"} mb="80px">
        <Separator mb={2} />
        <FilteredArtworkGridZeroState id={collection.id} slug={collection.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return artworks ? (
    <ArtworkGridWrapper isDepartment={isDepartment}>
      <InfiniteScrollArtworksGrid
        connection={artworks}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        contextScreenOwnerType={OwnerType.collection}
        contextScreenOwnerId={collection.id}
        contextScreenOwnerSlug={collection.slug}
      />
    </ArtworkGridWrapper>
  ) : null
}

const ArtworkGridWrapper = styled(Box)<{ isDepartment: boolean }>`
  margin-top: ${(p: any /* STRICTNESS_MIGRATION */) => (p.isDepartment ? 0 : "-50px")};
  padding-bottom: 50px;
`

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        isDepartment
        slug
        id
        collectionArtworks: artworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            ARTIST_NATIONALITY
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
        ) @connection(key: "Collection_collectionArtworks") {
          aggregations {
            slice
            counts {
              value
              name
              count
            }
          }
          counts {
            total
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.collection?.collectionArtworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.collection.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query CollectionArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
