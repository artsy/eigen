import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import {
  StickyTabPageFlatList,
  StickyTabSection,
} from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Separator, Spinner } from "palette"
import { useState } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { ActivityEmptyView } from "./ActivityEmptyView"
import { ActivityItem } from "./ActivityItem"
import { ActivityTabSubheader } from "./ActivityTabSubheader"
import { NotificationType } from "./types"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityListProps {
  viewer: ActivityList_viewer$key | null
  type: NotificationType
}

const SUBHEADER_SECTION_KEY = "tab-subheader"

export const ActivityList: React.FC<ActivityListProps> = ({ viewer, type }) => {
  const [refreshing, setRefreshing] = useState(false)
  const { data, hasNext, isLoadingNext, loadNext, refetch } = usePaginationFragment<
    ActivityQuery,
    ActivityList_viewer$key
  >(notificationsConnectionFragment, viewer)
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
