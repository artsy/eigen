import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, Separator, SkeletonBox, Spacer, Tabs } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { refresh } from "@react-native-community/netinfo"
import { InfiniteScrollArtworksGrid_myCollectionConnection$data } from "__generated__/InfiniteScrollArtworksGrid_myCollectionConnection.graphql"
import { MyCollectionLegacyFetchAuctionResultsQuery } from "__generated__/MyCollectionLegacyFetchAuctionResultsQuery.graphql"
import { MyCollectionLegacyQuery } from "__generated__/MyCollectionLegacyQuery.graphql"
import { MyCollectionLegacy_me$data } from "__generated__/MyCollectionLegacy_me.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { TabsFlatList } from "app/Components/TabsFlatlist"
import { useToast } from "app/Components/Toast/toastHook"
import { PAGE_SIZE } from "app/Components/constants"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtists } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtists"
import { ARTIST_CIRCLE_DIAMETER } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionStickyHeader } from "app/Scenes/MyCollection/Components/MyCollectionStickyHeader"
import { MyCollectionZeroState } from "app/Scenes/MyCollection/Components/MyCollectionZeroState"
import { MyCollectionZeroStateArtworks } from "app/Scenes/MyCollection/Components/MyCollectionZeroStateArtworks"
import { MyCollectionArtworks } from "app/Scenes/MyCollection/MyCollectionArtworksLegacy"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { VisualCluesConstMap } from "app/store/config/visualClues"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { RandomWidthPlaceholderText } from "app/utils/placeholders"
import {
  MY_COLLECTION_REFRESH_KEY,
  refreshMyCollectionInsights,
  useRefreshFetchKey,
} from "app/utils/refreshHelpers"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import React, { useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import {
  QueryRenderer,
  RelayPaginationProp,
  createPaginationContainer,
  fetchQuery,
  graphql,
} from "react-relay"
import { useLocalArtworkFilter } from "./utils/localArtworkSortAndFilter"
import { addRandomMyCollectionArtwork } from "./utils/randomMyCollectionArtwork"

export const HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER = "HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER"

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollectionLegacy_me$data
}> = ({ relay, me }) => {
  const showDevAddButton = useDevToggle("DTEasyMyCollectionArtworkCreation")

  const [hasMarketSignals, setHasMarketSignals] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showNewWorksMessage, setShowNewWorksMessage] = useState(false)

  const filtersCount = useSelectedFiltersCount()

  const artworks = extractNodes(me?.myCollectionConnection)
  const { reInitializeLocalArtworkFilter } = useLocalArtworkFilter(artworks)

  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const toast = useToast()

  const hasCollectedArtists = (me?.userInterestsConnection?.totalCount ?? 0) > 0

  const { showVisualClue } = useVisualClue()
  const showMyCollectionCollectedArtistsOnboarding = !!showVisualClue(
    "MyCollectionArtistsCollectedOnboarding"
  )

  useEffect(() => {
    // Don't show onboarding tooltips if user's have already been onboarded
    // because the tooltip onboarding was introduced two weeks after the feature was released
    if (!showMyCollectionCollectedArtistsOnboarding) {
      setVisualClueAsSeen(VisualCluesConstMap.MyCollectionArtistsCollectedOnboardingTooltip1)
      setVisualClueAsSeen(VisualCluesConstMap.MyCollectionArtistsCollectedOnboardingTooltip2)
    }
  }, [])

  useRefreshFetchKey(MY_COLLECTION_REFRESH_KEY, refresh)

  const refetch = () => {
    setIsRefreshing(true)
    relay.refetchConnection(PAGE_SIZE, (err) => {
      setIsRefreshing(false)
      if (err && __DEV__) {
        console.error(err)
      }
    })

    // No need to fetch the data again if we already know the user has at least one signal
    if (!hasMarketSignals) {
      fetchQuery<MyCollectionLegacyFetchAuctionResultsQuery>(
        getRelayEnvironment(),
        FetchAuctionResultsQuery,
        {}
      )
        .toPromise()
        .then((res) => {
          if (res?.me?.auctionResults?.totalCount) {
            setHasMarketSignals(true)
          }
        })
        .catch((err) => {
          // Failing siltently here to keep this as a breadcrumb for now
          console.log(err)
        })
    }
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

  const checkForNewMessages = async () => {
    const newWorksMessage =
      me.myCollectionInfo?.includesPurchasedArtworks &&
      !(await AsyncStorage.getItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER))

    setShowNewWorksMessage(!!newWorksMessage)
  }

  useEffect(() => {
    if (hasCollectedArtists) {
      checkForNewMessages()
    }
  }, [artworks.length, filtersCount])

  useEffect(() => {
    reInitializeLocalArtworkFilter(artworks)
  }, [artworks])

  // User has no artworks and no collected artists
  // Only check for collected artists count if collected artists feature flag is enabled
  if (artworks.length === 0 && !hasCollectedArtists) {
    return <MyCollectionZeroState />
  }

  // User has no artworks but has manually added collected artists
  if (artworks.length === 0 && hasCollectedArtists) {
    return (
      <TabsFlatList
        contentContainerStyle={{
          justifyContent: "flex-start",
          paddingHorizontal: 0,
        }}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefreshing} />}
      >
        <Tabs.SubTabBar>
          <MyCollectionStickyHeader
            filtersCount={filtersCount}
            hasMarketSignals={hasMarketSignals}
            showModal={() => setIsFilterModalVisible(true)}
            showNewWorksMessage={!!showNewWorksMessage}
            hasArtworks={artworks.length > 0}
          />
        </Tabs.SubTabBar>

        <MyCollectionCollectedArtists me={me} />

        {selectedTab === null && (
          <Flex px={2}>
            <Separator mb={4} mt={2} />
            <MyCollectionZeroStateArtworks />
          </Flex>
        )}
      </TabsFlatList>
    )
  }

  return (
    <TabsFlatList
      contentContainerStyle={{ justifyContent: "flex-start", paddingHorizontal: 0 }}
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefreshing} />}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <Tabs.SubTabBar>
        <MyCollectionStickyHeader
          filtersCount={filtersCount}
          hasMarketSignals={hasMarketSignals}
          showModal={() => setIsFilterModalVisible(true)}
          showNewWorksMessage={!!showNewWorksMessage}
          hasArtworks={artworks.length > 0}
        />
      </Tabs.SubTabBar>

      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        mode={FilterModalMode.Custom}
        closeModal={() => setIsFilterModalVisible(false)}
        exitModal={() => setIsFilterModalVisible(false)}
      />

      {selectedTab === null || selectedTab === "Artists" ? (
        <MyCollectionCollectedArtists me={me} />
      ) : null}

      {selectedTab === null || selectedTab === "Artworks" ? (
        <MyCollectionArtworks me={me} relay={relay} />
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
    </TabsFlatList>
  )
}

export const MyCollectionContainer = createPaginationContainer(
  MyCollection,
  {
    me: graphql`
      fragment MyCollectionLegacy_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 30 }, cursor: { type: "String" }) {
        id
        myCollectionInfo {
          includesPurchasedArtworks
          artworksCount
        }
        ...MyCollectionCollectedArtists_me
        userInterestsConnection(first: 20, category: COLLECTED_BEFORE, interestType: ARTIST) {
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
            }
          }
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
      query MyCollectionLegacyPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollectionLegacy_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FetchAuctionResultsQuery = graphql`
  query MyCollectionLegacyFetchAuctionResultsQuery {
    me {
      auctionResults: myCollectionAuctionResults(first: 3) {
        totalCount
      }
    }
  }
`

export const myCollectionScreenQuery = graphql`
  query MyCollectionLegacyQuery {
    me {
      ...MyCollectionLegacy_me
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
      <MyCollectionArtworksKeywordStore.Provider>
        <ArtworkFiltersStoreProvider>
          <QueryRenderer<MyCollectionLegacyQuery>
            environment={getRelayEnvironment()}
            query={myCollectionScreenQuery}
            variables={{}}
            fetchPolicy="store-and-network"
            render={renderWithPlaceholder({
              Container: MyCollectionContainer,
              renderPlaceholder: () => <MyCollectionPlaceholder />,
              renderFallback: ({ retry, error }) => (
                // align at the end with bottom margin to prevent the header to overlap the unable to load screen.
                <LoadFailureView
                  error={error}
                  trackErrorBoundary={false}
                  onRetry={retry || (() => {})}
                  justifyContent="flex-end"
                  mb="100px"
                />
              ),
            })}
          />
        </ArtworkFiltersStoreProvider>
      </MyCollectionArtworksKeywordStore.Provider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyCollectionPlaceholder: React.FC = () => {
  return (
    <TabsFlatList
      contentContainerStyle={{
        justifyContent: "flex-start",
        paddingHorizontal: 0,
      }}
    >
      <Spacer y={2} />

      {/* Sort & Filter  */}
      <Flex flexDirection="row" px={2}>
        <SkeletonBox width={60} height={30} borderRadius={50} mr={1} />
        <SkeletonBox width={75} height={30} borderRadius={50} />
      </Flex>

      <Spacer y={4} />

      {/* collected artists rail */}
      <Flex width="100%" px={2} flexDirection="row">
        {times(4).map((i) => (
          <Flex key={i} mr={1}>
            <Flex>
              <SkeletonBox
                borderRadius={ARTIST_CIRCLE_DIAMETER / 2}
                key={i}
                width={ARTIST_CIRCLE_DIAMETER}
                height={ARTIST_CIRCLE_DIAMETER}
              />
            </Flex>
            <Flex mt={1} alignItems="center">
              <RandomWidthPlaceholderText minWidth={40} maxWidth={ARTIST_CIRCLE_DIAMETER} />
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Spacer y={4} />

      {/* masonry grid */}
      <PlaceholderGrid />
    </TabsFlatList>
  )
}

export type MyCollectionArtworkEdge =
  ExtractNodeType<InfiniteScrollArtworksGrid_myCollectionConnection$data>
