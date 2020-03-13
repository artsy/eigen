import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { ArtworkFilterContext, ArtworkSorts } from "../../../utils/ArtworkFiltersStore"

const PAGE_SIZE = 10
export const CollectionArtworks: React.FC<{
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
}> = ({ collection, relay }) => {
  const artworks = get(collection, p => p.collectionArtworks)
  const { state } = useContext(ArtworkFilterContext)

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        error => {
          if (error) {
            throw new Error("Collection/CollectionArtworks sort: " + error.message)
          }
        },
        {
          sort: ArtworkSorts[state.selectedSortOption],
        }
      )
    }
  }, [state.appliedFilters])

  return artworks && <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} />
}

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
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
      }
    },
    query: graphql`
      query CollectionArtworksInfiniteScrollGridQuery($id: String!, $count: Int!, $cursor: String, $sort: String) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
