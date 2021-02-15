import { OwnerType } from "@artsy/cohesion"
import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import { Schema } from "lib/utils/track"
import { Box, Separator } from "palette"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtworkFilterContext } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams } from "../../../utils/ArtworkFilter/FilterArtworksHelpers"

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
  const { state, dispatch } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)

  useEffect(() => {
    if (state.applyFilters) {
      scrollToTop()

      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Collection/CollectionArtworks sort: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: collection.collectionArtworks!.aggregations,
    })
  }, [])

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
      <Box mt={isDepartment ? 0 : -50} mb={80}>
        <Separator mb="2" />
        <FilteredArtworkGridZeroState id={collection.id} slug={collection.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return artworks ? (
    <ArtworkGridWrapper isDepartment={isDepartment}>
      <Box mb="3" mt="1">
        <Separator />
      </Box>
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
        sort: { type: "String", defaultValue: "-decayed_merch" }
        medium: { type: "String", defaultValue: "*" }
        priceRange: { type: "String" }
        color: { type: "String" }
        partnerID: { type: "ID" }
        dimensionRange: { type: "String", defaultValue: "*-*" }
        majorPeriods: { type: "[String]" }
        acquireable: { type: "Boolean" }
        inquireableOnly: { type: "Boolean" }
        atAuction: { type: "Boolean" }
        offerable: { type: "Boolean" }
        attributionClass: { type: "[String]" }
      ) {
        isDepartment
        slug
        id
        collectionArtworks: artworksConnection(
          first: $count
          after: $cursor
          sort: $sort
          medium: $medium
          priceRange: $priceRange
          color: $color
          partnerID: $partnerID
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
          attributionClass: $attributionClass
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
        ...fragmentVariables,
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
        $sort: String
        $medium: String
        $priceRange: String
        $color: String
        $partnerID: ID
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
        $attributionClass: [String]
      ) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection
            @arguments(
              count: $count
              cursor: $cursor
              sort: $sort
              medium: $medium
              color: $color
              partnerID: $partnerID
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
