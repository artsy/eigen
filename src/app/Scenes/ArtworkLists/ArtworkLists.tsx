import {
  Flex,
  Screen,
  Spacer,
  Spinner,
  Tabs,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkListsQuery, ArtworkListsQuery$data } from "__generated__/ArtworkListsQuery.graphql"
import { ArtworkLists_collectionsConnection$key } from "__generated__/ArtworkLists_collectionsConnection.graphql"
import { ArtworkLists_savedArtworksList$key } from "__generated__/ArtworkLists_savedArtworksList.graphql"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ArtworkListItem } from "app/Scenes/ArtworkLists/ArtworkListItem"
import { SavesTabHeader, SavesTabHeaderPlaceholder } from "app/Scenes/ArtworkLists/SavesTabHeader"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"
import { SavesHeader } from "app/Scenes/Favorites/Components/SavesHeader"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { compact } from "lodash"
import { useState } from "react"
import { RefreshControl, StyleProp, ViewStyle } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"

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

// TODO: cleanup isFavorites prop when AREnableFavoritesTab ff is released
interface ArtworkListsContentProps {
  queryData: ArtworkListsQuery$data
}

interface ArtworkListsProps {
  isTab?: boolean
  isFavorites?: boolean
  style?: StyleProp<ViewStyle>
  headerHeight?: number
}

const ArtworkListsContent: React.FC<ArtworkListsContentProps & ArtworkListsProps> = ({
  queryData,
  isTab = true,
  isFavorites = false,
  style,
  headerHeight,
}) => {
  const space = useSpace()
  const artworkListsColCount = useArtworkListsColCount()
  const [refreshing, setRefreshing] = useState(false)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ArtworkListsQuery,
    ArtworkLists_collectionsConnection$key
  >(artworkListsFragment, queryData as ArtworkLists_collectionsConnection$key)

  const savedArtworksData = useFragment(
    savedArtworksListFragment,
    queryData as ArtworkLists_savedArtworksList$key
  )

  const savedArtworksArtworkList = savedArtworksData?.me?.savedArtworksArtworkList
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
        contentContainerStyle={[{ paddingHorizontal: space(2) }, style]}
        data={artworkSections}
        renderItem={({ item }) => item.content}
        numColumns={artworkListsColCount}
        keyExtractor={(item) => item.key}
        onEndReached={handleLoadMore}
        ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer x={2} />}
        ListHeaderComponent={isPartnerOfferEnabled ? <SavesTabHeader /> : null}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={refreshing}
            progressViewOffset={headerHeight}
          />
        }
      />
    )
  }

  return (
    <Screen.FlatList
      contentContainerStyle={[{ paddingHorizontal: space(2) }, style]}
      data={artworkSections}
      renderItem={({ item }) => item.content}
      numColumns={artworkListsColCount}
      keyExtractor={(item) => item.key}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        isLoadingNext && hasNext ? (
          <Flex my={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={2} />
        )
      }
      ListHeaderComponent={
        isPartnerOfferEnabled ? isFavorites ? <SavesHeader /> : <SavesTabHeader /> : null
      }
      refreshControl={
        <RefreshControl
          onRefresh={handleRefresh}
          refreshing={refreshing}
          progressViewOffset={headerHeight}
        />
      }
    />
  )
}

export const ArtworkLists: React.FC<ArtworkListsProps> = withSuspense({
  Component: ({ isTab = true, isFavorites = false, style, headerHeight }) => {
    const queryData = useLazyLoadQuery<ArtworkListsQuery>(artworkListsQuery, artworkListVariables, {
      fetchPolicy: "store-and-network",
    })

    return (
      <ArtworkListsContent
        queryData={queryData}
        isTab={isTab}
        isFavorites={isFavorites}
        style={style}
        headerHeight={headerHeight}
      />
    )
  },
  LoadingFallback: () => (
    <Flex flex={1} justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  ),
  ErrorFallback: (fallbackProps, props) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={!props.isFavorites}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

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

const savedArtworksListFragment = graphql`
  fragment ArtworkLists_savedArtworksList on Query {
    me {
      savedArtworksArtworkList: collection(id: "saved-artwork") {
        internalID
        ...ArtworkListItem_collection
      }
    }
  }
`

export const artworkListsQuery = graphql`
  query ArtworkListsQuery($count: Int!, $cursor: String) {
    ...ArtworkLists_collectionsConnection @arguments(count: $count, cursor: $cursor)
    ...ArtworkLists_savedArtworksList
  }
`

export const artworkListVariables = { count: PAGE_SIZE }
