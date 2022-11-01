import { ActivityList_me$key } from "__generated__/ActivityList_me.graphql"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import {
  StickyTabPageFlatList,
  StickyTabPageFlatListContext,
  StickyTabSection,
} from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { Button, Flex, Separator, Spinner, Text } from "palette"
import { useCallback, useContext, useEffect, useState } from "react"
import { graphql, useFragment, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { ActivityTabSubheader } from "./ActivityTabSubheader"
import { NotificationType } from "./types"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null
  me: ActivityList_me$key | null
  type: NotificationType
}

const SUBHEADER_SECTION_KEY = "tab-subheader"

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

  const notificationSections: StickyTabSection[] = notifications.map((notification) => ({
    key: notification.internalID,
    content: <ActivityItem item={notification} />,
  }))
  const sections: StickyTabSection[] = [
    {
      key: SUBHEADER_SECTION_KEY,
      content: <ActivityTabSubheader type={type} />,
    },
    ...notificationSections,
  ]

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

  const handleMarkAllAsReadPress = useCallback(() => {
    console.log("[debug] mark all ass read")
  }, [])

  useEffect(() => {
    const label = hasUnreadNotifications ? "New notifications" : "No new notifications"

    setJSX(
      <>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="white"
          py={1}
          px={2}
        >
          <Text variant="xs" color={hasUnreadNotifications ? "brand" : "black60"}>
            {label}
          </Text>
          <Button onPress={handleMarkAllAsReadPress} size="small">
            Mark all as read
          </Button>
        </Flex>
        <Separator />
      </>
    )
  }, [hasUnreadNotifications, handleMarkAllAsReadPress])

  if (notifications.length === 0) {
    return <ActivityEmptyView type={type} />
  }

  return (
    <StickyTabPageFlatList
      data={sections}
      keyExtractor={(item) => `${type}-${item.key}`}
      ItemSeparatorComponent={({ leadingItem }) => {
        const { key } = leadingItem

        if (key === SUBHEADER_SECTION_KEY) {
          return null
        }

        return <Separator />
      }}
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
      @connection(key: "ActivityList_notificationsConnection") {
      edges {
        node {
          internalID
          notificationType
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
