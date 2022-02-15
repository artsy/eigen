import { MyCollectionArtworksList_myCollectionConnection$key } from "__generated__/MyCollectionArtworksList_myCollectionConnection.graphql"
import { PAGE_SIZE } from "lib/Components/constants"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spinner } from "palette"
import React, { useState } from "react"
import { RelayPaginationProp, useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworksListItem } from "./MyCollectionArtworksListItem"

export const MyCollectionArtworksList: React.FC<{
  myCollectionConnection: MyCollectionArtworksList_myCollectionConnection$key | null
  localSortAndFilterArtworks?: (artworks: any[]) => any[]
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
  isLoading: RelayPaginationProp["isLoading"]
}> = ({ localSortAndFilterArtworks, isLoading, loadMore, hasMore, ...restProps }) => {
  const artworkConnection = useFragment<MyCollectionArtworksList_myCollectionConnection$key>(
    artworkConnectionFragment,
    restProps.myCollectionConnection
  )

  const artworks = extractNodes(artworkConnection)
  const preprocessedArtworks = localSortAndFilterArtworks?.(artworks) ?? artworks

  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  return (
    <PrefetchFlatList
      data={preprocessedArtworks}
      renderItem={({ item }) => <MyCollectionArtworksListItem artwork={item} />}
      // TODO: Add prefetching for this list when the new artwork detail screen is ready
      // prefetchUrlExtractor={(artwork) => `/my-collection/artwork/${artwork.slug}`}
      // prefetchVariablesExtractor={(artwork) => ({
      //   artworkSlug: artwork.slug,
      //   medium: artwork.medium,
      //   artistInternalID: artwork.artist?.internalID,
      // })}
      onEndReached={loadMoreArtworks}
      keyExtractor={(item, index) => String(item.slug || index)}
      ListFooterComponent={
        loadingMoreData ? (
          <Flex mx="auto" mb={15} mt={15}>
            <Spinner />
          </Flex>
        ) : null
      }
    />
  )
}

const artworkConnectionFragment = graphql`
  fragment MyCollectionArtworksList_myCollectionConnection on MyCollectionConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...MyCollectionArtworksListItem_artwork
        ...MyCollectionArtworks_filterProps @relay(mask: false)
      }
    }
  }
`
