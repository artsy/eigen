import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import AsyncStorage from "@react-native-community/async-storage"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { EventEmitter } from "events"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/Components/constants"
import { ZeroState } from "lib/Components/States/ZeroState"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { useToast } from "lib/Components/Toast/toastHook"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { unsafe_getFeatureFlag, useDevToggle, useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { Banner, Button, Flex, Separator, Spacer, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { Platform, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkFormModal } from "./Screens/ArtworkFormModal/MyCollectionArtworkFormModal"
import { addRandomMyCollectionArtwork } from "./utils/randomMyCollectionArtwork"

const RefreshEvents = new EventEmitter()
const REFRESH_KEY = "refresh"

export function refreshMyCollection() {
  RefreshEvents.emit(REFRESH_KEY)
}

const featureFlagKey = Platform.select({
  android: "AREnableMyCollectionAndroid",
  ios: "AREnableMyCollectionIOS",
}) as "AREnableMyCollectionIOS" | "AREnableMyCollectionAndroid"

export const useEnableMyCollection = () => {
  return useFeatureFlag(featureFlagKey)
}

export function unsafe_getEnableMyCollection() {
  return unsafe_getFeatureFlag(featureFlagKey)
}

export const HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER = "HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER"

const hasBeenShownBanner = async () => {
  const hasSeen = await AsyncStorage.getItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER)
  return hasSeen === "true"
}

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me
}> = ({ relay, me }) => {
  const { trackEvent } = useTracking()
  const [showModal, setShowModal] = useState(false)

  const artworks = extractNodes(me?.myCollectionConnection)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    RefreshEvents.addListener(REFRESH_KEY, refetch)
    return () => {
      RefreshEvents.removeListener(REFRESH_KEY, refetch)
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

  const setJSX = __TEST__ ? jest.fn() : useContext(StickyTabPageFlatListContext).setJSX

  const space = useSpace()
  const toast = useToast()

  const allowOrderImports = useFeatureFlag("AREnableMyCollectionOrderImport")

  const showDevAddButton = useDevToggle("DTEasyMyCollectionArtworkCreation")

  useEffect(() => {
    if (artworks.length) {
      hasBeenShownBanner().then((hasSeenBanner) => {
        const showNewWorksBanner = me.myCollectionInfo?.includesPurchasedArtworks && allowOrderImports && !hasSeenBanner
        setJSX(
          <Flex>
            <Flex flexDirection="row" alignSelf="flex-end" px={2} py={1}>
              <Button
                testID="add-artwork-button-non-zero-state"
                size="small"
                variant="fillDark"
                onPress={() => {
                  setShowModal(true)
                  trackEvent(tracks.addCollectedArtwork())
                }}
                haptic
              >
                Add Works
              </Button>
            </Flex>
            {!!showNewWorksBanner && (
              <Banner
                title="You have some artworks."
                text="To help add your current artworks to your collection, we automatically added your purchases from your order history."
                showCloseButton
                containerStyle={{ mb: 2 }}
                onClose={() => AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")}
              />
            )}
          </Flex>
        )
      })
    } else {
      // remove already set JSX
      setJSX(<></>)
    }
  }, [artworks.length])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
      <MyCollectionArtworkFormModal
        mode="add"
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false)
          refreshMyCollection()
        }}
      />
      <StickyTabPageScrollView
        contentContainerStyle={{ paddingBottom: space(2) }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
      >
        {artworks.length === 0 ? (
          <ZeroState
            title="Your art collection in your pocket."
            subtitle="Keep track of your collection all in one place and get market insights"
            callToAction={
              <Button
                testID="add-artwork-button-zero-state"
                onPress={() => {
                  setShowModal(true)
                  trackEvent(tracks.addCollectedArtwork())
                }}
                block
              >
                Add artwork
              </Button>
            }
          />
        ) : (
          <InfiniteScrollMyCollectionArtworksGridContainer
            myCollectionConnection={me.myCollectionConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
          />
        )}
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
      @argumentDefinitions(
        excludePurchasedArtworks: { type: "Boolean", defaultValue: true }
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
      ) {
        id
        myCollectionInfo {
          includesPurchasedArtworks
        }
        myCollectionConnection(
          excludePurchasedArtworks: $excludePurchasedArtworks
          first: $count
          after: $cursor
          sort: CREATED_AT_DESC
        ) @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          edges {
            node {
              id
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
      query MyCollectionPaginationQuery($excludePurchasedArtworks: Boolean, $count: Int!, $cursor: String) {
        me {
          ...MyCollection_me
            @arguments(excludePurchasedArtworks: $excludePurchasedArtworks, count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionQueryRenderer: React.FC = () => {
  const enableMyCollectionOrderImport = useFeatureFlag("AREnableMyCollectionOrderImport")
  const excludePurchasedArtworks = !enableMyCollectionOrderImport

  return (
    <QueryRenderer<MyCollectionQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionQuery($excludePurchasedArtworks: Boolean) {
          me {
            ...MyCollection_me @arguments(excludePurchasedArtworks: $excludePurchasedArtworks)
          }
        }
      `}
      variables={{ excludePurchasedArtworks }}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: MyCollectionContainer,
        renderPlaceholder: () => <LoadingSkeleton />,
      })}
    />
  )
}

export const LoadingSkeleton: React.FC<{}> = () => {
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <Spacer />
        <Spacer />
        <PlaceholderText width={70} margin={20} />
      </Flex>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
        <Flex>
          <Spacer mb={40} />
          {/* Entity name */}
          <PlaceholderText width={180} />
          {/* subtitle text */}
          <PlaceholderText width={100} />
        </Flex>
      </Flex>
      <Spacer mb={3} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width="40%" />
        <PlaceholderText width="40%" />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={3} />
      {/* masonry grid */}
      <PlaceholderGrid />
    </Flex>
  )
}

const tracks = {
  addCollectedArtwork,
}
