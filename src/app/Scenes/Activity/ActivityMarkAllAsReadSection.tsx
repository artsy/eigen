import { Button, Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { ActivityMarkAllAsReadSectionMutation } from "__generated__/ActivityMarkAllAsReadSectionMutation.graphql"
import { ConnectionHandler, UseMutationConfig, graphql, useMutation } from "react-relay"
import { notificationTypes } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityMarkAllAsReadSectionProps extends FlexProps {
  hasUnreadNotifications: boolean
}

export const ActivityMarkAllAsReadSection: React.FC<ActivityMarkAllAsReadSectionProps> = ({
  hasUnreadNotifications,
  ...flexProps
}) => {
  const label = hasUnreadNotifications ? "New notifications" : "No new notifications"
  const [commit, mutationInProgress] =
    useMutation<ActivityMarkAllAsReadSectionMutation>(MarkAllAsReadMutation)

  const handleMarkAllAsReadPress = () => {
    try {
      commit({
        variables: {},
        updater: (store) => {
          markAllAsReadMutationUpdater(store)
        },
        optimisticUpdater: (store) => {
          markAllAsReadMutationUpdater(store)
        },
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
        captureMessage(`ActivityMarkAllAsReadSection ${JSON.stringify(e)}`)
      }
    }
  }

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      {...flexProps}
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

const markAllAsReadMutationUpdater = (
  store: Parameters<
    NonNullable<UseMutationConfig<ActivityMarkAllAsReadSectionMutation>["updater"]>
  >[0]
) => {
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
