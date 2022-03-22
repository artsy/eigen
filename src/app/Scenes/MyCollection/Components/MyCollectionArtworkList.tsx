import { MyCollectionArtworkList_myCollectionConnection$key } from "__generated__/MyCollectionArtworkList_myCollectionConnection.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spinner } from "palette"
import { useState } from "react"
import { RelayPaginationProp, useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

export const MyCollectionArtworkList: React.FC<{
  myCollectionConnection: MyCollectionArtworkList_myCollectionConnection$key | null
  localSortAndFilterArtworks?: (artworks: any[]) => any[]
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
  isLoading: RelayPaginationProp["isLoading"]
}> = ({ localSortAndFilterArtworks, isLoading, loadMore, hasMore, ...restProps }) => {
  const artworkConnection = useFragment<MyCollectionArtworkList_myCollectionConnection$key>(
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
    <Flex>
      <PrefetchFlatList
        data={preprocessedArtworks}
        renderItem={({ item }) => <MyCollectionArtworkListItem artwork={item} />}
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
    </Flex>
  )
}

const artworkConnectionFragment = graphql`
  fragment MyCollectionArtworkList_myCollectionConnection on MyCollectionConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...MyCollectionArtworkListItem_artwork
        ...MyCollectionArtworks_filterProps @relay(mask: false)
      }
    }
  }
`
