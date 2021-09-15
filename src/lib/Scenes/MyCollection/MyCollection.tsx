import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { EventEmitter } from "events"
import MyCollectionGrid from "lib/Components/ArtworkGrids/MyCollectionArtworkGrid"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ZeroState } from "lib/Components/States/ZeroState"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { PlaceholderBox, PlaceholderRaggedText, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { Box, Button, Flex, Join, Separator, Spacer, Text, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkFormModal } from "./Screens/ArtworkFormModal/MyCollectionArtworkFormModal"
import { MyCollectionArtworkListItemFragmentContainer } from "./Screens/ArtworkList/MyCollectionArtworkListItem"

const RefreshEvents = new EventEmitter()
const REFRESH_KEY = "refresh"

export function refreshMyCollection() {
  RefreshEvents.emit(REFRESH_KEY)
}

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me
}> = ({ relay, me }) => {
  const { trackEvent } = useTracking()
  const [showModal, setShowModal] = useState(false)

  const artworks = extractNodes(me?.myCollectionConnection)
  const { hasMore, isLoading, loadMore } = relay
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

  const fetchNextPage = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    loadMore(PAGE_SIZE!, (error) => {
      if (error) {
        throw new Error(`Error fetching artworks in MyCollectionArtworkList.tsx: ${error}`)
      }
    })
  }

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const space = useSpace()

  useEffect(() => {
    if (artworks.length) {
      setJSX(
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            paddingHorizontal: space(2),
            paddingVertical: space(1),
          }}
        >
          <Button
            size="small"
            variant="fillDark"
            onPress={() => {
              setShowModal(true)
              trackEvent(tracks.addCollectedArtwork())
            }}
            haptic
          >
            {"Add Works"}
          </Button>
        </View>
      )
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
        onSuccess={() => setShowModal(false)}
      />
      {artworks.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                refreshMyCollection()
              }}
            />
          }
          contentContainerStyle={{ flex: 1 }}
        >
          <Flex>
            <ZeroState
              title={"Primed and ready for artworks."}
              subtitle="Add a work from your collection to access price and market insights."
              callToAction={
                <Button
                  data-test-id="add-artwork-button-zero-state"
                  onPress={() => {
                    setShowModal(true)
                    trackEvent(tracks.addCollectedArtwork())
                  }}
                  minWidth={"100%"}
                >
                  Add artwork
                </Button>
              }
            />
          </Flex>
        </ScrollView>
      ) : (
        <StickyTabPageScrollView
          contentContainerStyle={{ paddingBottom: space(2) }}
          onEndReached={fetchNextPage}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        >
          <MyCollectionGrid artworks={artworks} />
        </StickyTabPageScrollView>
      )}
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyCollectionContainer = createPaginationContainer(
  MyCollection,
  {
    me: graphql`
      fragment MyCollection_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        id
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
          @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              slug
              ...MyCollectionArtworkGrid_artworks
            }
          }
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

export const MyCollectionQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyCollectionQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionQuery {
          me {
            ...MyCollection_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: MyCollectionContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <Text variant="largeTitle" ml={2} mb={2} mt={6}>
        My Collection
      </Text>

      <Box>
        <Spacer mb={2} />

        {/* List items  */}
        <Flex flexDirection="column" pl={2}>
          <Join separator={<Spacer mr={0.5} />}>
            {[...new Array(8)].map((_, index) => {
              return (
                <Flex key={index} flexDirection="row" mb={1} alignItems="center">
                  <PlaceholderBox width={90} height={90} marginRight={10} />
                  <Box>
                    <PlaceholderText width={200} />
                    <PlaceholderRaggedText numLines={2} />
                  </Box>
                </Flex>
              )
            })}
          </Join>
        </Flex>
      </Box>
    </>
  )
}

const tracks = {
  addCollectedArtwork,
}
