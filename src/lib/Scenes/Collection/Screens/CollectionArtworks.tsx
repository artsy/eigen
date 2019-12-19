import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const CollectionArtworks: React.FC<{
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
}> = ({ collection, relay }) => {
  const artworks = get(collection, p => p.collectionArtworks)

  return artworks && <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} />
}

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 6 }
          cursor: { type: "String" }
          sort: { type: "String", defaultValue: "-decayed_merch " }
        ) {
        slug
        id
        collectionArtworks: artworksConnection(first: $count, after: $cursor)
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
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.collection.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query CollectionArtworksInfiniteScrollGridQuery($id: String!, $cursor: String, $count: Int!) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
