import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, Separator, Spacer } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { InfiniteScrollArtworksGrid_myCollectionConnection$data } from "__generated__/InfiniteScrollArtworksGrid_myCollectionConnection.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { MyCollection_me$data } from "__generated__/MyCollection_me.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useToast } from "app/Components/Toast/toastHook"
import { PAGE_SIZE } from "app/Components/constants"
import { MyCollectionCollectedArtistsRailPaginationContainer } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionStickyHeader } from "app/Scenes/MyCollection/Components/MyCollectionStickyHeader"
import { MyCollectionZeroState } from "app/Scenes/MyCollection/Components/MyCollectionZeroState"
import { MyCollectionZeroStateArtworks } from "app/Scenes/MyCollection/Components/MyCollectionZeroStateArtworks"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { GlobalStore } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  PlaceholderBox,
  PlaceholderGrid,
  PlaceholderText,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import {
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
  refreshMyCollectionInsights,
} from "app/utils/refreshHelpers"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import React, { useContext, useEffect, useRef, useState } from "react"
import { QueryRenderer, RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"
import { ARTWORK_LIST_IMAGE_SIZE } from "./Components/MyCollectionArtworkListItem"
import { MyCollectionArtworks } from "./MyCollectionArtworks"
import { useLocalArtworkFilter } from "./utils/localArtworkSortAndFilter"
import { addRandomMyCollectionArtwork } from "./utils/randomMyCollectionArtwork"

export const HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER = "HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER"

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me$data
}> = ({ relay, me }) => {
  const showDevAddButton = useDevToggle("DTEasyMyCollectionArtworkCreation")
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const innerFlatListRef = useRef(null)

  const filtersCount = useSelectedFiltersCount()

  const artworks = extractNodes(me?.myCollectionConnection)
  const { reInitializeLocalArtworkFilter } = useLocalArtworkFilter(artworks)

  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const hasMarketSignals = !!me?.auctionResults?.totalCount

  const toast = useToast()

  const hasCollectedArtists = Number(me.myCollectionInfo?.artistsCount) > 0

  useEffect(() => {
    RefreshEvents.addListener(MY_COLLECTION_REFRESH_KEY, refetch)
    return () => {
      RefreshEvents.removeListener(MY_COLLECTION_REFRESH_KEY, refetch)
    }
  }, [])

  const refetch = () => {
    setIsRefreshing(true)
    relay.refetchConnection(PAGE_SIZE, (err) => {
      setIsRefreshing(false)
      if (err && __DEV__) {
        console.error(err)
      }
    })
  }

  const notifyMyCollectionInsightsTab = () => {
    const artworksWithoutInsight = artworks.find((artwork) => !artwork._marketPriceInsights)

    refreshMyCollectionInsights({
      collectionHasArtworksWithoutInsights: !!(artworks.length && artworksWithoutInsight),
    })
  }

  // Load all artworks and then check whether all of them have insights
  useEffect(() => {
    if (!relay.hasMore()) {
      notifyMyCollectionInsightsTab()
      return
    }

    relay.loadMore(100)
  }, [me?.myCollectionConnection])

  // hack for tests. we should fix that.
  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const showMessages = async () => {
    const showNewWorksMessage =
      me.myCollectionInfo?.includesPurchasedArtworks &&
      !(await AsyncStorage.getItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER))

    setJSX(
      <MyCollectionStickyHeader
        filtersCount={filtersCount}
        hasMarketSignals={hasMarketSignals}
        showModal={() => setIsFilterModalVisible(true)}
        showNewWorksMessage={!!showNewWorksMessage}
        showSeparator={!showSearchBar}
        hasArtworks={artworks.length > 0}
      />
    )
  }

  useEffect(() => {
    const renderMessages = enableCollectedArtists ? hasCollectedArtists : artworks.length

    if (renderMessages) {
      showMessages()
    } else {
      // remove already set JSX
      setJSX(null)
    }
  }, [artworks.length, filtersCount, showSearchBar])

  useEffect(() => {
    reInitializeLocalArtworkFilter(artworks)
  }, [artworks])

  // User has no artworks and no collected artists
  if (artworks.length === 0 && !hasCollectedArtists) {
    return <MyCollectionZeroState />
  }

  // User has no artworks but has manually added collected artists
  if (artworks.length === 0 && hasCollectedArtists) {
    return (
      <StickyTabPageScrollView>
        <MyCollectionCollectedArtistsRailPaginationContainer
          myCollectionInfo={me.myCollectionInfo}
        />
        {selectedTab === null && (
          <>
            <Separator my={4} />
            <MyCollectionZeroStateArtworks />
          </>
        )}
      </StickyTabPageScrollView>
    )
  }

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{ justifyContent: "flex-start" }}
      refreshControl={<StickTabPageRefreshControl onRefresh={refetch} refreshing={isRefreshing} />}
      innerRef={innerFlatListRef}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        mode={FilterModalMode.Custom}
        closeModal={() => setIsFilterModalVisible(false)}
        exitModal={() => setIsFilterModalVisible(false)}
      />
      {(selectedTab === null || selectedTab === "Artists") && enableCollectedArtists ? (
        <MyCollectionCollectedArtistsRailPaginationContainer
          myCollectionInfo={me.myCollectionInfo}
        />
      ) : null}

      {selectedTab === null || selectedTab === "Artworks" || !enableCollectedArtists ? (
        <MyCollectionArtworks
          me={me}
          relay={relay}
          showSearchBar={showSearchBar}
          setShowSearchBar={setShowSearchBar}
        />
      ) : null}
      {!!showDevAddButton && (
        <Button
          onPress={async () => {
            toast.show("Adding artwork", "middle")
            await addRandomMyCollectionArtwork()
            toast.hideOldest()
          }}
          block
        >
          Add Random Work
        </Button>
      )}
    </StickyTabPageScrollView>
  )
}

export const MyCollectionContainer = createPaginationContainer(
  MyCollection,
  {
    me: graphql`
      fragment MyCollection_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 30 }, cursor: { type: "String" }) {
        id
        myCollectionInfo {
          includesPurchasedArtworks
          artistsCount
          artworksCount
          ...MyCollectionCollectedArtistsRail_myCollectionInfo
        }
        auctionResults: myCollectionAuctionResults(first: 3) {
          totalCount
        }
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
          @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          edges {
            node {
              id
              internalID
              medium
              mediumType {
                name
              }
              title
              pricePaid {
                minor
              }
              attributionClass {
                name
              }
              sizeBucket
              width
              height
              artist {
                internalID
                name
              }
              _marketPriceInsights: marketPriceInsights {
                demandRank
              }
              consignmentSubmission {
                displayText
              }
            }
          }
          ...MyCollectionArtworkList_myCollectionConnection
          ...InfiniteScrollArtworksGrid_myCollectionConnection @arguments(skipArtworkGridItem: true)
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyCollectionPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollection_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionScreenQuery = graphql`
  query MyCollectionQuery {
    me {
      ...MyCollection_me
    }
  }
`

export const MyCollectionQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
      <ArtworkFiltersStoreProvider>
        <QueryRenderer<MyCollectionQuery>
          environment={defaultEnvironment}
          query={MyCollectionScreenQuery}
          variables={{}}
          cacheConfig={{ force: true }}
          render={renderWithPlaceholder({
            Container: MyCollectionContainer,
            renderPlaceholder: () => <MyCollectionPlaceholder />,
            renderFallback: ({ retry }) => (
              // align at the end with bottom margin to prevent the header to overlap the unable to load screen.
              <LoadFailureView onRetry={retry!} justifyContent="flex-end" mb="100px" />
            ),
          })}
        />
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyCollectionPlaceholder: React.FC = () => {
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  return (
    <Flex>
      {/* collector's info */}
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px={2}>
        <Flex flex={1}>
          <Spacer y={2} />
          {/* icon, name, time joined */}
          <Flex flexDirection="row">
            <PlaceholderBox width={50} height={50} borderRadius={50} />
            <Flex flex={1} justifyContent="center" ml={2}>
              <PlaceholderText width={80} height={25} />
              <PlaceholderText width={100} height={15} />
            </Flex>
            {/* settings icon */}
            <PlaceholderBox width={20} height={20} />
          </Flex>
          <Spacer y={1} />
        </Flex>
      </Flex>
      <Spacer y={4} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width="25%" height={22} />
        <PlaceholderText width="25%" height={22} />
        <PlaceholderText width="25%" height={22} />
      </Flex>
      <Spacer y={1} />
      <Separator />
      <Spacer y={1} />
      {/* Sort & Filter  */}
      <Flex justifyContent="space-between" flexDirection="row" px={2} py={0.5}>
        <PlaceholderText width={120} height={22} />
        <PlaceholderText width={90} height={22} borderRadius={11} />
      </Flex>
      <Separator />
      <Spacer y={2} />
      {/* masonry grid */}
      {viewOption === "grid" ? (
        <PlaceholderGrid />
      ) : (
        <Flex mx={2} width="100%">
          {times(4).map((i) => (
            <Flex key={i} my={0.5} flexDirection="row">
              <Flex>
                <PlaceholderBox
                  key={i}
                  width={ARTWORK_LIST_IMAGE_SIZE}
                  height={ARTWORK_LIST_IMAGE_SIZE}
                />
              </Flex>
              <Flex pl="15px" flex={1}>
                <RandomWidthPlaceholderText minWidth={80} maxWidth={120} />
                <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
                <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

export type MyCollectionArtworkEdge =
  ExtractNodeType<InfiniteScrollArtworksGrid_myCollectionConnection$data>
