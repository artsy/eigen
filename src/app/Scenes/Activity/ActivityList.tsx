import { captureException } from "@sentry/react-native"
import { ActivityList_me$key } from "__generated__/ActivityList_me.graphql"
import { ActivityList_viewer$key } from "__generated__/ActivityList_viewer.graphql"
import { ActivityListMarkAllAsReadMutation } from "__generated__/ActivityListMarkAllAsReadMutation.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import {
  StickyTabPageFlatList,
  StickyTabPageFlatListContext,
  StickyTabSection,
} from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Separator, Spinner } from "palette"
import { useCallback, useContext, useEffect, useState } from "react"
import {
  ConnectionHandler,
  graphql,
  useFragment,
  useMutation,
  usePaginationFragment,
} from "react-relay"
import { RecordSourceSelectorProxy } from "relay-runtime"
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
  const [commit, mutationInProgress] =
    useMutation<ActivityListMarkAllAsReadMutation>(MarkAllAsReadMutation)
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

  const handleMarkAllAsReadPress = useCallback(() => {
    try {
      commit({
        variables: {},
        updater: markAllAsReadMutationUpdater,
        optimisticUpdater: markAllAsReadMutationUpdater,
        onCompleted: (response) => {
          const errorMessage =
            response.markAllNotificationsAsRead?.responseOrError?.mutationError?.message

          if (errorMessage) {
            throw new Error(errorMessage)
          }
        },
      })
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureException(e)
      }
    }
  }, [])

  useEffect(() => {
    setJSX(
      <>
        <ActivityMarkAllAsReadSection
          hasUnreadNotifications={hasUnreadNotifications}
          loading={mutationInProgress}
          onPress={handleMarkAllAsReadPress}
        />
        <Separator />
      </>
    )
  }, [hasUnreadNotifications, mutationInProgress, handleMarkAllAsReadPress])

  if (notifications.length === 0) {
    return <ActivityEmptyView type={type} />
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
      @connection(key: "ActivityList_notificationsConnection", filters: []) {
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

const MarkAllAsReadMutation = graphql`
  mutation ActivityListMarkAllAsReadMutation {
    markAllNotificationsAsRead(input: {}) {
      responseOrError {
        ... on MarkAllNotificationsAsReadSuccess {
          success
        }
        ... on MarkAllNotificationsAsReadFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const markAllAsReadMutationUpdater = (store: RecordSourceSelectorProxy) => {
  const root = store.getRoot()
  const me = root.getLinkedRecord("me")
  const viewer = root.getLinkedRecord("viewer")

  if (!me || !viewer) {
    return
  }

  const key = "ActivityList_notificationsConnection"
  const connection = ConnectionHandler.getConnection(viewer, key)
  const edges = connection?.getLinkedRecords("edges")

  // Set unread notifications count to 0
  me.setValue(0, "unreadNotificationsCount")

  // Mark all notifications as read
  edges?.forEach((edge) => {
    const node = edge.getLinkedRecord("node")
    node?.setValue(false, "isUnread")
  })
}
