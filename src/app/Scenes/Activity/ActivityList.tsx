import { Flex, LazyFlatlist, Screen, Separator, Spinner } from "@artsy/palette-mobile"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { RefreshControl } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { NotificationType } from "./types"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null | undefined
  type: NotificationType
}

export const ActivityList: React.FC<ActivityListProps> = ({ viewer, type }) => {
  const [refreshing, setRefreshing] = useState(false)

  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment(
    notificationsConnectionFragment,
    viewer
  )

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter((notification) =>
    shouldDisplayNotification(notification, "list")
  )

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
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

  type NotificationT = (typeof notifications)[0]

  const keyExtractor = (item: NotificationT) => {
    return `${item.internalID}`
  }

  return (
    <LazyFlatlist<NotificationT> keyExtractor={keyExtractor}>
      {(props) => {
        return (
          <Screen.FlatList
            data={notifications}
            scrollEnabled={notifications.length > 1}
            onViewableItemsChanged={props.onViewableItemsChanged}
            viewabilityConfig={props.viewabilityConfig}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => (
              <Flex mx={-2}>
                <Separator borderColor="mono5" />
              </Flex>
            )}
            onEndReached={handleLoadMore}
            renderItem={({ item }) => {
              return <ActivityItem notification={item} isVisible={props.hasSeenItem(item)} />
            }}
            ListEmptyComponent={
              <Flex flex={1} justifyContent="center">
                <ActivityEmptyView
                  type={type}
                  refreshControl={
                    <RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
                  }
                />
              </Flex>
            }
            contentContainerStyle={{
              // This is required because Tabs.Flatlist has a marginHorizontal of 20
              marginHorizontal: 0,
            }}
            refreshControl={
              notifications.length > 1 ? (
                <RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
              ) : undefined
            }
            ListFooterComponent={() => (
              <Flex
                alignItems="center"
                justifyContent="center"
                my={2}
                mb={2}
                style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
              >
                <Spinner />
              </Flex>
            )}
          />
        )
      }}
    </LazyFlatlist>
  )
}

const notificationsConnectionFragment = graphql`
  fragment ActivityList_viewer on Viewer
  @refetchable(queryName: "ActivityList_viewerRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    types: { type: "[NotificationTypesEnum]" }
  ) {
    notificationsConnection(first: $count, after: $after, notificationTypes: $types)
      @connection(key: "ActivityList_notificationsConnection", filters: ["notificationTypes"]) {
      edges {
        node {
          internalID
          notificationType
          artworks: artworksConnection {
            totalCount
          }
          item {
            __typename

            ... on ViewingRoomPublishedNotificationItem {
              viewingRoomsConnection(first: 1) {
                totalCount
              }
            }

            ... on ArticleFeaturedArtistNotificationItem {
              article {
                internalID
              }
            }
            ... on CollectorProfileUpdatePromptNotificationItem {
              __typename
            }
          }

          ...ActivityItem_notification
        }
      }
    }
  }
`
