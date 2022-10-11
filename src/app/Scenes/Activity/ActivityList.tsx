import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
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
  const notifications = extractNodes(data?.notificationsConnection)
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
      refreshing={refreshing}
      keyExtractor={(item) => item.internalID}
      ItemSeparatorComponent={({ leadingItem }) => {
        const { key } = leadingItem

        if (key === SUBHEADER_SECTION_KEY) {
          return null
        }

        return <Separator />
      }}
      onEndReached={handleLoadMore}
      onRefresh={handleRefresh}
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
          ...ActivityItem_item
        }
      }
    }
  }
`
