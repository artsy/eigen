import { captureMessage } from "@sentry/core"
import {
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsReadMutation$data,
} from "__generated__/useMarkNotificationAsReadMutation.graphql"
import { useMutation } from "react-relay"
import { RecordSourceSelectorProxy, graphql } from "relay-runtime"

export const useMarkNotificationAsRead = () => {
  const [commitMutation] = useMutation<useMarkNotificationAsReadMutation>(
    graphql`
      mutation useMarkNotificationAsReadMutation($input: MarkNotificationAsReadInput!) {
        markNotificationAsRead(input: $input) {
          responseOrError {
            ... on MarkNotificationAsReadSuccess {
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
    `
  )

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
        updater(item.id, store)
      },
      updater: (store) => {
        updater(item.id, store)
      },
      onError: (error) => {
        captureMessage(error?.stack!)
      },
    })
  }
}

const updater = (
  id: string,
  store: RecordSourceSelectorProxy<useMarkNotificationAsReadMutation$data>
) => {
  const notification = store.get(id)

  notification?.setValue(false, "isUnread")
}
