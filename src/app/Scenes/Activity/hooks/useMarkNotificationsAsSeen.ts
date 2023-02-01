import { captureMessage } from "@sentry/react-native"
import {
  useMarkNotificationsAsSeenMutation,
  useMarkNotificationsAsSeenMutation$data,
} from "__generated__/useMarkNotificationsAsSeenMutation.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { graphql, useMutation } from "react-relay"
import { RecordSourceSelectorProxy } from "relay-runtime"

export const useMarkNotificationsAsSeen = () => {
  const [commit] = useMutation<useMarkNotificationsAsSeenMutation>(MarkNotificationsAsSeenMutation)

  useEffect(() => {
    const until = DateTime.local().toISO()

    commit({
      variables: {
        input: {
          until,
        },
      },
      updater,
      optimisticUpdater: updater,
      onCompleted: (response) => {
        const result = response.markNotificationsAsSeen?.responseOrError
        const errorMessage = result?.mutationError?.message

        if (errorMessage) {
          throw new Error(errorMessage)
        }

        GlobalStore.actions.bottomTabs.setDisplayUnseenNotificationsIndicator(false)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
        }
      },
    })
  }, [])
}

const MarkNotificationsAsSeenMutation = graphql`
  mutation useMarkNotificationsAsSeenMutation($input: MarkNotificationsAsSeenInput!) {
    markNotificationsAsSeen(input: $input) {
      responseOrError {
        ... on MarkNotificationsAsSeenSuccess {
          success
        }
        ... on MarkNotificationsAsSeenFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const updater = (store: RecordSourceSelectorProxy<useMarkNotificationsAsSeenMutation$data>) => {
  const root = store.getRoot()
  const me = root.getLinkedRecord("me")

  // Set unseen notifications count to 0
  me?.setValue(0, "unseenNotificationsCount")
}
