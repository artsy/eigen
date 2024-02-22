import { captureMessage } from "@sentry/core"
import { useMarkNotificationAsReadMutation } from "__generated__/useMarkNotificationAsReadMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useMarkNotificationAsRead = () => {
  const [commitMutation] = useMutation<useMarkNotificationAsReadMutation>(graphql`
    mutation useMarkNotificationAsReadMutation($input: MarkNotificationAsReadInput!) {
      markNotificationAsRead(input: $input) {
        responseOrError {
          ... on MarkNotificationAsReadSuccess {
            me {
              unreadNotificationsCount
            }

            success
          }
          ... on MarkNotificationAsReadFailure {
            mutationError {
              message
            }
          }
        }
      }
    }
  `)

  return (item: { id: string; internalID: string; isUnread: boolean }) => {
    if (!item.isUnread) {
      return
    }

    commitMutation({
      variables: {
        input: {
          id: item.internalID,
        },
      },
      optimisticUpdater: (store) => {
        store?.get?.(item.id)?.setValue(false, "isUnread")
      },
      updater: (store) => {
        store?.get?.(item.id)?.setValue(false, "isUnread")
      },
      onError: (error) => {
        captureMessage(`useMarkNotificationAsReadMutation ${error?.message}`)
      },
    })
  }
}
