import { Box, Separator } from "@artsy/palette"
import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"
import { ArtworkFilterContext } from "../../../utils/ArtworkFiltersStore"
import { filterArtworksParams } from "../Helpers/FilterArtworksHelpers"
import { CollectionZeroState } from "./CollectionZeroState"

interface CollectionArtworksProps {
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
}

const PAGE_SIZE = 10

export const CollectionArtworks: React.SFC<CollectionArtworksProps> = ({ collection, relay }) => {
  const { isDepartment } = collection
  const artworks = get(collection, p => p.collectionArtworks)
  const artworksTotal = artworks?.counts?.total
  const { state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        error => {
          if (error) {
            throw new Error("Collection/CollectionArtworks sort: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  if (artworksTotal === 0) {
    return <CollectionZeroState id={collection.id} slug={collection.slug} />
  }

  return artworks ? (
    <ArtworkGridWrapper isDepartment={isDepartment}>
      <Box mb={3} mt={1}>
        <Separator />
      </Box>
      <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} />
    </ArtworkGridWrapper>
  ) : null
}

const ArtworkGridWrapper = styled(Box)<{ isDepartment: boolean }>`
  margin-top: ${(p: any /* STRICTNESS_MIGRATION */) => (p.isDepartment ? 0 : "-50px")};
`

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
          sort: { type: "String", defaultValue: "-decayed_merch" }
          medium: { type: "String", defaultValue: "*" }
          priceRange: { type: "String", defaultValue: "" }
        ) {
        isDepartment
        slug
        id
        collectionArtworks: artworksConnection(
          first: $count
          after: $cursor
          sort: $sort
          medium: $medium
          aggregations: [MEDIUM]
          priceRange: $priceRange
        ) @connection(key: "Collection_collectionArtworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
            }
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
    direction: "forward",
    getConnectionFromProps(props) {
      return props?.collection?.collectionArtworks
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.collection.slug,
        count,
        cursor,
        sort: fragmentVariables.sort,
        medium: fragmentVariables.medium,
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
      ) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection
            @arguments(count: $count, cursor: $cursor, sort: $sort, medium: $medium, priceRange: $priceRange)
        }
      }
    `,
  }
)
