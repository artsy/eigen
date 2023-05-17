import { Flex, Spacer, Spinner, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkListsQuery } from "__generated__/ArtworkListsQuery.graphql"
import { ArtworkLists_collectionsConnection$key } from "__generated__/ArtworkLists_collectionsConnection.graphql"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkListItem } from "app/Scenes/ArtworkLists/ArtworkListItem"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

/**
 * We should query 1 less custom artwork list
 * since "Saved Artworks" is also displayed (the default artwork list)
 *
 * === MOBILE ===
 * 1 default artwork list + 11 custom artwork lists = 12 artwork lists
 * 12 / 2 column = 6 rows
 *
 * === TABLET ===
 * 1 default artwork list + 23 custom artwork lists = 24 artwork lists
 * 24 / 3 column = 8 rows
 */
const PAGE_SIZE = isPad() ? 23 : 11

export const ArtworkLists = () => {
  const space = useSpace()
  const artworkListsColCount = useArtworkListsColCount()
  const [refreshing, setRefreshing] = useState(false)
  const queryData = useLazyLoadQuery<ArtworkListsQuery>(
    artworkListsQuery,
    { count: PAGE_SIZE },
    { fetchPolicy: "store-and-network" }
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ArtworkListsQuery,
    ArtworkLists_collectionsConnection$key
  >(artworkListsFragment, queryData)

  const savedArtworksArtworkList = data.me?.savedArtworksArtworkList!
  const customArtworkLists = extractNodes(data.me?.customArtworkLists)

  const artworksList = [savedArtworksArtworkList, ...customArtworkLists]

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(PAGE_SIZE)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch(
      {},
      {
        fetchPolicy: "store-and-network",
        onComplete: () => {
          setRefreshing(false)
        },
      }
    )
  }

  const artworkSections = artworksList.map((artworkList) => {
    const isDefaultArtworkList = artworkList.internalID === savedArtworksArtworkList.internalID
    return {
      key: artworkList.internalID,
      content: (
        <ArtworkListItem
          artworkList={artworkList}
          imagesLayout={isDefaultArtworkList ? "grid" : "stacked"}
        />
      ),
    }
  })

  return (
    <StickyTabPageFlatList
      contentContainerStyle={{ paddingVertical: space(2) }}
      data={artworkSections}
      numColumns={artworkListsColCount}
      keyExtractor={(item) => item.key}
      onEndReached={handleLoadMore}
      ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer x={2} />}
      refreshControl={
        <StickTabPageRefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
      }
    />
  )
}

export const ArtworkListsQR = () => (
  <Suspense fallback={<ArtworkListsPlaceHolder />}>
    <ArtworkLists />
  </Suspense>
)

const LoadingIndicator = () => {
  return (
    <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="center" px={4}>
      <Spinner />
    </Flex>
  )
}

export const ArtworkListsPlaceHolder = () => {
  const screen = useScreenDimensions()
  const space = useSpace()
  return (
    <StickyTabPageScrollView scrollEnabled={false} style={{ paddingTop: space(2) }}>
      <GenericGridPlaceholder width={screen.width - space(4)} />
    </StickyTabPageScrollView>
  )
}

const artworkListsFragment = graphql`
  fragment ArtworkLists_collectionsConnection on Query
  @refetchable(queryName: "ArtworkLists_collectionsConnectionRefetch")
  @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" }) {
    me {
      savedArtworksArtworkList: collection(id: "saved-artwork") {
        internalID
        ...ArtworkListItem_collection
      }

      customArtworkLists: collectionsConnection(
        first: $count
        after: $cursor
        default: false
        saves: true
        sort: CREATED_AT_DESC
      ) @connection(key: "ArtworkLists_customArtworkLists", filters: []) {
        edges {
          node {
            internalID
            ...ArtworkListItem_collection
          }
        }
      }
    }
  }
`

const artworkListsQuery = graphql`
  query ArtworkListsQuery($count: Int!, $cursor: String) {
    ...ArtworkLists_collectionsConnection @arguments(count: $count, cursor: $cursor)
  }
`
