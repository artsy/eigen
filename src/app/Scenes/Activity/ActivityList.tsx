import { Flex, Screen, Separator, Spinner, Tabs } from "@artsy/palette-mobile"
import { ActivityList_me$key } from "__generated__/ActivityList_me.graphql"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"

import {
  shouldDisplayNotification,
  Notification,
} from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { RefreshControl } from "react-native"
import { graphql, useFragment, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { ActivityMarkAllAsReadSection } from "./ActivityMarkAllAsReadSection"
import { NotificationType } from "./types"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null | undefined
  me: ActivityList_me$key | null | undefined
  type: NotificationType
}

const INITIAL_LOADING_SIZE = 10

export const ActivityList: React.FC<ActivityListProps> = ({ viewer, type, me }) => {
  const enableNewActivityPanelManagement = unsafe_getFeatureFlag(
    "AREnableNewActivityPanelManagement"
  )

  const [refreshing, setRefreshing] = useState(false)

  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment(
    notificationsConnectionFragment,
    viewer
  )
  const meData = useFragment(meFragment, me)

  const hasUnreadNotifications = (meData?.unreadNotificationsCount ?? 0) > 0
  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter((notification) =>
    shouldDisplayNotification(notification as Notification)
  )

  // This is needed because `totalCount` and therefor `relay.hasMore()` doesn't work reliably
  // TODO: Remove this once we have a reliable `totalCount`
  const isLoading = isLoadingNext && notifications.length >= INITIAL_LOADING_SIZE

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

  const FlatlistComponent = enableNewActivityPanelManagement ? Screen.FlatList : Tabs.FlatList

  return (
    <FlatlistComponent
      ListHeaderComponent={
        enableNewActivityPanelManagement ? null : (
          <Flex py={1}>
            <ActivityMarkAllAsReadSection
              hasUnreadNotifications={hasUnreadNotifications}
              px={2}
              mb={1}
            />
            <Separator />
          </Flex>
        )
      }
      data={notifications}
      keyExtractor={(item) => `${type}-${item.internalID}`}
      ItemSeparatorComponent={() =>
        enableNewActivityPanelManagement ? (
          <Flex mx={-2}>
            <Separator borderColor="black5" />
          </Flex>
        ) : (
          <Separator />
        )
      }
      onEndReached={handleLoadMore}
      renderItem={({ item }) => <ActivityItem notification={item} />}
      ListEmptyComponent={
        <Flex flex={1} justifyContent="center">
          <ActivityEmptyView type={type} />
        </Flex>
      }
      contentContainerStyle={{
        // This is required because Tabs.Flatlist has a marginHorizontal of 20
        marginHorizontal: 0,
      }}
      refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
      ListFooterComponent={
        <Flex
          alignItems="center"
          justifyContent="center"
          my={2}
          style={{ opacity: isLoading && hasNext ? 1 : 0 }}
        >
          <Spinner />
        </Flex>
      }
    />
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
          }
          ...ActivityItem_notification
        }
      }
    }
  }
`

const meFragment = graphql`
  fragment ActivityList_me on Me {
    unreadNotificationsCount
  }
`
