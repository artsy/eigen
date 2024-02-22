import { captureMessage } from "@sentry/react-native"
import { useMarkAllNotificationsAsReadMutation } from "__generated__/useMarkAllNotificationsAsReadMutation.graphql"
import { notificationTypes } from "app/Scenes/Activity/types"
import { getNotificationTypes } from "app/Scenes/Activity/utils/getNotificationTypes"
import { ConnectionHandler, UseMutationConfig, graphql, useMutation } from "react-relay"

export const useMarkAllNotificationsAsRead = () => {
  const [commit, mutationInProgress] =
    useMutation<useMarkAllNotificationsAsReadMutation>(MarkAllAsReadMutation)

  const markAllNotificationsAsRead = () => {
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

  return { markAllNotificationsAsRead, mutationInProgress }
}

const markAllAsReadMutationUpdater = (
  store: Parameters<
    NonNullable<UseMutationConfig<useMarkAllNotificationsAsReadMutation>["updater"]>
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

const MarkAllAsReadMutation = graphql`
  mutation useMarkAllNotificationsAsReadMutation {
    markAllNotificationsAsRead(input: {}) {
      responseOrError {
        ... on MarkAllNotificationsAsReadSuccess {
          me {
            unreadNotificationsCount
          }

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
