import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import React, { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { ArtworkFilterContextState, ArtworkSorts } from "../../../utils/ArtworkFiltersStore"

export const CollectionArtworks: React.FC<{
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
  context: ArtworkFilterContextState
}> = ({ collection, relay, context }) => {
  const artworks = get(collection, p => p.collectionArtworks)

  useEffect(() => {
    if (context.applyFilters) {
      relay.refetchConnection(
        10,
        error => {
          if (error) {
            console.log("Collection/CollectionArtworks sort", error.message)
          }
        },
        {
          sort: ArtworkSorts[context.selectedSortOption],
        }
      )
    }
  })

  return artworks && <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} />
}

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          sort: { type: "String", defaultValue: "-decayed_merch" }
        ) {
        slug
        id
        collectionArtworks: artworksConnection(sort: $sort, first: $count, after: $cursor)
          @connection(key: "Collection_collectionArtworks") {
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
      return props.collection && props.collection.collectionArtworks
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.collection.slug,
        count,
        cursor,
        sort: ArtworkSorts[props?.context?.selectedSortOption],
      }
    },
    query: graphql`
      query CollectionArtworksInfiniteScrollGridQuery($id: String!, $cursor: String, $count: Int!, $sort: String) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection @arguments(cursor: $cursor, count: $count, sort: $sort)
        }
      }
    `,
  }
)
