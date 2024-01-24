import { Flex, Spinner, Separator, Tabs } from "@artsy/palette-mobile"
import { ActivityList_me$key } from "__generated__/ActivityList_me.graphql"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"

import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { RefreshControl } from "react-native"
import { useHeaderMeasurements } from "react-native-collapsible-tab-view"
import { graphql, useFragment, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { ActivityMarkAllAsReadSection } from "./ActivityMarkAllAsReadSection"
import { NotificationType } from "./types"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null | undefined
  me: ActivityList_me$key | null | undefined
  type: NotificationType
}

export const ActivityList: React.FC<ActivityListProps> = ({ viewer, type, me }) => {
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableSingleActivityPanelScreen") // true // useFeatureFlag("AREnableNewActivityPanelManagement")
  const headerMeasurements = useHeaderMeasurements()
  const [refreshing, setRefreshing] = useState(false)

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

  const sections = notifications.map((notification) => ({
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

  if (notifications.length === 0) {
    // In order to center content, we need to offset the stickytabs header height

    let headerOffset = 0
    if (typeof headerMeasurements.height.value === "number") {
      headerOffset = -headerMeasurements.height.value
    }

    return (
      <Tabs.ScrollView
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
      >
        <Flex flex={1} justifyContent="center" top={headerOffset}>
          <ActivityEmptyView type={type} />
        </Flex>
      </Tabs.ScrollView>
    )
  }

  return (
    <Tabs.FlatList
      ListHeaderComponent={() => {
        return (
          <Flex py={1} mx={-2}>
            <ActivityMarkAllAsReadSection
              hasUnreadNotifications={hasUnreadNotifications}
              px={2}
              mb={1}
            />
            <Separator />
          </Flex>
        )
      }}
      data={sections}
      keyExtractor={(item) => `${type}-${item.key}`}
      ItemSeparatorComponent={() =>
        enableNewActivityPanelManagement ? (
          <Flex mx={-2}>
            <Separator borderColor="black10" />
          </Flex>
        ) : (
          <Separator />
        )
      }
      onEndReached={handleLoadMore}
      renderItem={({ item }) => <>{item.content}</>}
      refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
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
