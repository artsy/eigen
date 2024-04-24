import {
  Flex,
  Screen,
  Spacer,
  Spinner,
  Tabs,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkListsQuery } from "__generated__/ArtworkListsQuery.graphql"
import { ArtworkLists_collectionsConnection$key } from "__generated__/ArtworkLists_collectionsConnection.graphql"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { useDismissSavedHighlight } from "app/Components/ProgressiveOnboarding/useDismissSavedHighlight"
import { ArtworkListItem } from "app/Scenes/ArtworkLists/ArtworkListItem"
import { SavesTabHeader, SavesTabHeaderPlaceholder } from "app/Scenes/ArtworkLists/SavesTabHeader"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { compact } from "lodash"
import { Suspense, useState } from "react"
import { RefreshControl } from "react-native"
import { isTablet } from "react-native-device-info"
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
const PAGE_SIZE = isTablet() ? 23 : 11

interface ArtworkListsProps {
  isTab?: boolean
}

export const ArtworkLists: React.FC<ArtworkListsProps> = ({ isTab = true }) => {
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

  const savedArtworksArtworkList = data.me?.savedArtworksArtworkList
  const customArtworkLists = extractNodes(data.me?.customArtworkLists)

  const artworksList = [savedArtworksArtworkList, ...customArtworkLists]

  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

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

  const artworkSections = compact(
    artworksList.map((artworkList) => {
      if (!artworkList) {
        return null
      }

      const isDefaultArtworkList = artworkList?.internalID === savedArtworksArtworkList?.internalID
      return {
        key: artworkList?.internalID,
        content: (
          <ArtworkListItem
            artworkList={artworkList}
            imagesLayout={isDefaultArtworkList ? "grid" : "stacked"}
          />
        ),
      }
    })
  )

  if (isTab) {
    return (
      <Tabs.FlatList
        contentContainerStyle={{ padding: space(2) }}
        style={{ paddingTop: space(2) }}
        data={artworkSections}
        renderItem={({ item }) => item.content}
        numColumns={artworkListsColCount}
        keyExtractor={(item) => item.key}
        onEndReached={handleLoadMore}
        ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer x={2} />}
        ListHeaderComponent={isPartnerOfferEnabled ? <SavesTabHeader /> : null}
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
      />
    )
  }

  return (
    <Screen.FlatList
      contentContainerStyle={{ padding: space(2) }}
      data={artworkSections}
      renderItem={({ item }) => item.content}
      numColumns={artworkListsColCount}
      keyExtractor={(item) => item.key}
      onEndReached={handleLoadMore}
      ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer x={2} />}
      ListHeaderComponent={isPartnerOfferEnabled ? <SavesTabHeader /> : null}
      refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
    />
  )
}

export const ArtworkListsQR = () => {
  useDismissSavedHighlight()

  return (
    <Suspense fallback={<ArtworkListsPlaceHolder />}>
      <ArtworkLists />
    </Suspense>
  )
}

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
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  return (
    <Tabs.ScrollView scrollEnabled={false} style={{ paddingTop: space(2) }}>
      {!!isPartnerOfferEnabled && <SavesTabHeaderPlaceholder />}
      <GenericGridPlaceholder width={screen.width - space(4)} />
    </Tabs.ScrollView>
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
        sort: UPDATED_AT_DESC
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
