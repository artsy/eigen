import { OwnerType } from "@artsy/cohesion"
import { Spacer, Box, SimpleMessage } from "@artsy/palette-mobile"
import { CollectionArtworks_collection$data } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "app/utils/get"
import { Schema } from "app/utils/track"
import React, { useEffect, useRef } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface CollectionArtworksProps {
  collection: CollectionArtworks_collection$data
  relay: RelayPaginationProp
  scrollToTop: () => void
}

export const CollectionArtworks: React.FC<CollectionArtworksProps> = ({
  collection,
  relay,
  scrollToTop,
}) => {
  useArtworkFilters({
    relay,
    aggregations: collection?.collectionArtworks?.aggregations,
    componentPath: "Collection/CollectionArtworks",
    type: "sort",
    onApply: () => scrollToTop(),
  })

  const tracking = useTracking()
  const artworks = get(collection, (p) => p.collectionArtworks)
  const artworksTotal = artworks?.counts?.total
  const initialArtworksTotal = useRef(artworksTotal)

  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  useEffect(() => {
    // for use by CollectionArtworksFilter to keep count
    const filterCount = { ...counts, ...artworks?.counts }
    setFiltersCountAction(filterCount)
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

  if (initialArtworksTotal.current === 0) {
    return (
      <Box my={1}>
        <SimpleMessage>
          There aren’t any works available in the collection at this time.
        </SimpleMessage>
      </Box>
    )
  }

  if (artworksTotal === 0) {
    return (
      <Box mb="80px">
        <Spacer y={4} />
        <FilteredArtworkGridZeroState
          id={collection.id}
          slug={collection.slug}
          trackClear={trackClear}
        />
      </Box>
    )
  }

  return artworks ? (
    <ArtworkGridWrapper>
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

const ArtworkGridWrapper = styled(Box)`
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
        slug
        id
        collectionArtworks: artworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            ARTIST
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
