import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { InfiniteScrollArtworksGrid_myCollectionConnection } from "__generated__/InfiniteScrollArtworksGrid_myCollectionConnection.graphql"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useToast } from "app/Components/Toast/toastHook"
import { navigate, popToRoot } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import {
  GlobalStore,
  removeClue,
  unsafe_getFeatureFlag,
  useDevToggle,
  useSessionVisualClue,
} from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import {
  PlaceholderBox,
  PlaceholderGrid,
  PlaceholderText,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { MY_COLLECTION_REFRESH_KEY, RefreshEvents } from "app/utils/refreshHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { Button, Flex, Message, Separator, Spacer, useSpace } from "palette"
import React, { useContext, useEffect, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { ARTWORK_LIST_IMAGE_SIZE } from "./Components/MyCollectionArtworkListItem"
import { MyCollectionArtworks } from "./MyCollectionArtworks"
import { AddedArtworkHasNoInsightsMessage } from "./Screens/Insights/Messages"
import { useLocalArtworkFilter } from "./utils/localArtworkSortAndFilter"
import { addRandomMyCollectionArtwork } from "./utils/randomMyCollectionArtwork"

export const HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER = "HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER"

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me
}> = ({ relay, me }) => {
  const { trackEvent } = useTracking()
  const { showSessionVisualClue } = useSessionVisualClue()

  const showDevAddButton = useDevToggle("DTEasyMyCollectionArtworkCreation")
  const showMyCollectionInsights = unsafe_getFeatureFlag("ARShowMyCollectionInsights")

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  const filtersCount = useSelectedFiltersCount()

  const artworks = extractNodes(me?.myCollectionConnection)

  const { reInitializeLocalArtworkFilter } = useLocalArtworkFilter(artworks)

  const [isRefreshing, setIsRefreshing] = useState(false)
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

  useEffect(() => {
    relay.loadMore(100)
  }, [])

  // hack for tests. we should fix that.
  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const space = useSpace()
  const toast = useToast()

  const hasBeenShownBanner = async () => {
    const hasSeen = await AsyncStorage.getItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER)
    const shouldShowConsignments = showSessionVisualClue("ArtworkSubmissionMessage")
    const shouldShowAddedArtworkHasNoInsightsMessage = showSessionVisualClue(
      "AddedArtworkHasNoInsightsMessage"
    )
    return {
      hasSeenBanner: hasSeen === "true",
      shouldShowConsignments: shouldShowConsignments === true,
      shouldShowAddedArtworkHasNoInsightsMessage:
        shouldShowAddedArtworkHasNoInsightsMessage === true && showMyCollectionInsights,
    }
  }

  useEffect(() => {
    if (artworks.length) {
      hasBeenShownBanner().then(
        ({ hasSeenBanner, shouldShowConsignments, shouldShowAddedArtworkHasNoInsightsMessage }) => {
          const showNewWorksBanner =
            me.myCollectionInfo?.includesPurchasedArtworks && !hasSeenBanner
          const showConsignmentsBanner = shouldShowConsignments
          const showAddedArtworkHasNoInsightsMessage = shouldShowAddedArtworkHasNoInsightsMessage
          setJSX(
            <Flex>
              <ArtworksFilterHeader
                selectedFiltersCount={filtersCount}
                onFilterPress={() => setIsFilterModalVisible(true)}
              >
                <Button
                  data-test-id="add-artwork-button-non-zero-state"
                  size="small"
                  variant="fillDark"
                  onPress={() => {
                    navigate("my-collection/artworks/new", {
                      passProps: {
                        mode: "add",
                        onSuccess: popToRoot,
                      },
                    })
                    trackEvent(tracks.addCollectedArtwork())
                  }}
                  haptic
                >
                  Add Works
                </Button>
              </ArtworksFilterHeader>
              {!!showNewWorksBanner && (
                <Message
                  variant="info"
                  title="Your collection is growing"
                  text="Based on your purchase history, we’ve added the following works."
                  showCloseButton
                  onClose={() =>
                    AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")
                  }
                />
              )}
              {!!showConsignmentsBanner && (
                <Message
                  variant="info"
                  title="Artwork added to My Collection"
                  text="The artwork you submitted for sale has been automatically added."
                  showCloseButton
                  onClose={() => removeClue("ArtworkSubmissionMessage")}
                />
              )}
              {!!showAddedArtworkHasNoInsightsMessage && (
                <AddedArtworkHasNoInsightsMessage
                  onClose={() => removeClue("AddedArtworkHasNoInsightsMessage")}
                />
              )}
            </Flex>
          )
        }
      )
    } else {
      // remove already set JSX
      setJSX(null)
    }
  }, [artworks.length, filtersCount])

  useEffect(() => {
    reInitializeLocalArtworkFilter(artworks)
  }, [artworks])

  const innerFlatListRef = useRef(null)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        mode={FilterModalMode.Custom}
        closeModal={() => setIsFilterModalVisible(false)}
        exitModal={() => setIsFilterModalVisible(false)}
      />

      <StickyTabPageScrollView
        contentContainerStyle={{ paddingBottom: space(2) }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        innerRef={innerFlatListRef}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <MyCollectionArtworks innerFlatlistRef={innerFlatListRef} me={me} relay={relay} />
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
    </ProvideScreenTrackingWithCohesionSchema>
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
        }
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
          @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          edges {
            node {
              id
              medium
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
            <LoadFailureView onRetry={retry!} justifyContent="flex-end" mb={100} />
          ),
        })}
      />
    </ArtworkFiltersStoreProvider>
  )
}

export const MyCollectionPlaceholder: React.FC = () => {
  const screenWidth = useScreenDimensions().width
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <Spacer />
        <Spacer />
        <PlaceholderText width={70} margin={20} />
      </Flex>
      {/* collector's insfo */}
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
        <Flex>
          <Spacer mb={20} />
          {/* icon, name, time joined */}
          <Flex flexDirection="row">
            <PlaceholderBox width={100} height={100} borderRadius={50} />
            <Flex justifyContent="center" ml={2}>
              <PlaceholderText width={80} height={35} />
              <PlaceholderText width={100} height={35} />
              <PlaceholderText width={100} />
            </Flex>
          </Flex>
          <Spacer mb={2} mt={1} />
          <PlaceholderBox width={screenWidth - 40} height={30} borderRadius={50} />
        </Flex>
      </Flex>
      <Spacer mb={2} mt={1} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width="40%" height={22} />
        <PlaceholderText width="40%" height={22} />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={1} />
      {/* Sort & Filter  */}
      <Flex justifyContent="space-between" flexDirection="row" px={2} py={0.5}>
        <PlaceholderText width={120} height={22} />
        <PlaceholderText width={90} height={22} borderRadius={11} />
      </Flex>
      <Separator />
      <Spacer mb={1} mt={0.5} />
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
              <Flex pl={15} flex={1}>
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

const tracks = {
  addCollectedArtwork,
}

export type MyCollectionArtworkEdge = NonNullable<
  NonNullable<InfiniteScrollArtworksGrid_myCollectionConnection["edges"]>[0]
>["node"]
