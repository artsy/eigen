import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { get } from "lib/utils/get"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { ArtworkFilterContext, FilterArray } from "../../../utils/ArtworkFiltersStore"

enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

const filterTypeToParam = {
  sort: ArtworkSorts,
}

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  // Default params
  const filterParams = {
    sort: "-decayed-merch",
  }

  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filter]
    const paramFromFilterType = paramMapping[appliedFilterOption.type]
    filterParams[appliedFilterOption.filter] = paramFromFilterType
  })

  return filterParams
}

const PAGE_SIZE = 10
export const CollectionArtworks: React.FC<{
  collection: CollectionArtworks_collection
  relay: RelayPaginationProp
}> = ({ collection, relay }) => {
  const artworks = get(collection, p => p.collectionArtworks)
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
