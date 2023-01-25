import { ActivityList_me$key } from "__generated__/ActivityList_me.graphql"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import {
  StickyTabPageFlatList,
  StickyTabPageFlatListContext,
  StickyTabSection,
} from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Separator, Spinner } from "palette"
import { useContext, useEffect, useState } from "react"
import { graphql, useFragment, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { ActivityMarkAllAsReadSection } from "./ActivityMarkAllAsReadSection"
import { NotificationType } from "./types"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null
  me: ActivityList_me$key | null
  type: NotificationType
}

export const ActivityList: React.FC<ActivityListProps> = ({ viewer, type, me }) => {
  const [refreshing, setRefreshing] = useState(false)
  const setJSX = useContext(StickyTabPageFlatListContext).setJSX
  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment<
    ActivityQuery,
    ActivityList_viewer$key
  >(notificationsConnectionFragment, viewer)
  const meData = useFragment(meFragment, me)
  const hasUnreadNotifications = (meData?.unreadNotificationsCount ?? 0) > 0
  const notificationsNodes = extractNodes(data?.notificationsConnection)
  const notifications = notificationsNodes.filter((notification) => {
    if (isArtworksBasedNotification(notification.notificationType)) {
      const artworksCount = notification.artworks?.totalCount ?? 0
      return artworksCount > 0
    }

    return true
  })

  const recentNotification = notifications[0]
  const recentNotificationPublishedAt = recentNotification?.rawPublishedAt

  const sections: StickyTabSection[] = notifications.map((notification) => ({
    key: notification.internalID,
    content: <ActivityItem item={notification} />,
  }))

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

  useEffect(() => {
    setJSX(
      <>
        <ActivityMarkAllAsReadSection hasUnreadNotifications={hasUnreadNotifications} />
        <Separator />
      </>
    )
  }, [hasUnreadNotifications])

  useEffect(() => {
    if (type === "all" && recentNotificationPublishedAt) {
      GlobalStore.actions.bottomTabs.setLastSeenNotificationPublishedAt(
        recentNotificationPublishedAt
      )
    }
  }, [type, recentNotificationPublishedAt])

  if (notifications.length === 0) {
    return (
      <StickyTabPageScrollView
        contentContainerStyle={{
          // Extend the container flex when there are no artworks for accurate vertical centering
          flexGrow: 1,
          justifyContent: "center",
          height: "100%",
        }}
        refreshControl={
          <StickTabPageRefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
        }
      >
        <ActivityEmptyView type={type} />
      </StickyTabPageScrollView>
    )
  }

  return (
    <StickyTabPageFlatList
      data={sections}
      keyExtractor={(item) => `${type}-${item.key}`}
      ItemSeparatorComponent={() => <Separator />}
      onEndReached={handleLoadMore}
      refreshControl={
        <StickTabPageRefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
      }
      ListFooterComponent={
        isLoadingNext ? (
          <Flex my={2} alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : null
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
          rawPublishedAt: publishedAt
          artworks: artworksConnection {
            totalCount
          }
          ...ActivityItem_item
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
