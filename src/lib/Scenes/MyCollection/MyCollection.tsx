import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { EventEmitter } from "events"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ZeroState } from "lib/Components/States/ZeroState"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { Button, Flex, Separator, Spacer, Theme, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { RefreshControl, ScrollView, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkFormModal } from "./Screens/ArtworkFormModal/MyCollectionArtworkFormModal"

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

  useEffect(() => {
    if (artworks.length) {
      setJSX(
        <Flex flexDirection="row" alignSelf="flex-end" px={2} py={1}>
          <Button
            data-test-id="add-artwork-button-non-zero-state"
            size="small"
            variant="primaryBlack"
            onPress={() => {
              setShowModal(true)
              trackEvent(tracks.addCollectedArtwork())
            }}
            haptic
          >
            Add Works
          </Button>
        </Flex>
      )
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
                  block
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
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        >
          <InfiniteScrollMyCollectionArtworksGridContainer
            myCollectionConnection={me.myCollectionConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
          />
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
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_myCollectionConnection
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
        renderPlaceholder: () => <LoadingSkeleton />,
      })}
    />
  )
}

const LoadingSkeleton: React.FC<{}> = () => {
  return (
    <Theme>
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
          <PlaceholderText width={"40%"} />
          <PlaceholderText width={"40%"} />
        </Flex>
        <Spacer mb={1} />
        <Separator />
        <Spacer mb={3} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Flex>
    </Theme>
  )
}

const tracks = {
  addCollectedArtwork,
}
