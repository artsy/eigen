import { Flex } from "@artsy/palette-mobile"
import { captureException } from "@sentry/react-native"
import { ActivityMarkAllAsReadSectionMutation } from "__generated__/ActivityMarkAllAsReadSectionMutation.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, Text } from "palette"
import { useMutation } from "react-relay"
import { ConnectionHandler, graphql, RecordSourceSelectorProxy } from "relay-runtime"
import { notificationTypes } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityMarkAllAsReadSectionProps {
  hasUnreadNotifications: boolean
}

export const ActivityMarkAllAsReadSection: React.FC<ActivityMarkAllAsReadSectionProps> = ({
  hasUnreadNotifications,
}) => {
  const label = hasUnreadNotifications ? "New notifications" : "No new notifications"
  const [commit, mutationInProgress] =
    useMutation<ActivityMarkAllAsReadSectionMutation>(MarkAllAsReadMutation)

  const handleMarkAllAsReadPress = () => {
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

          GlobalStore.actions.bottomTabs.setUnreadNotificationsCount(0)
        },
      })
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureException(e)
      }
    }
  }

  return (
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
      <Button
        disabled={!hasUnreadNotifications || mutationInProgress}
        size="small"
        variant="outline"
        onPress={handleMarkAllAsReadPress}
      >
        Mark all as read
      </Button>
    </Flex>
  )
}

const MarkAllAsReadMutation = graphql`
  mutation ActivityMarkAllAsReadSectionMutation {
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

  notificationTypes.forEach((type) => {
    const key = "ActivityList_notificationsConnection"
    const connection = ConnectionHandler.getConnection(viewer, key, {
      notificationTypes: getNotificationTypes(type),
    })
    const edges = connection?.getLinkedRecords("edges")

    // Set unread notifications count to 0
    me.setValue(0, "unreadNotificationsCount")

    // Mark all notifications as read
    edges?.forEach((edge) => {
      const node = edge.getLinkedRecord("node")
      node?.setValue(false, "isUnread")
    })
  })
}
