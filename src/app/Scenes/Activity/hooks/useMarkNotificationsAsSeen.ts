import { captureMessage } from "@sentry/react-native"
import { useMarkNotificationsAsSeenMutation } from "__generated__/useMarkNotificationsAsSeenMutation.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { UseMutationConfig, graphql, useMutation } from "react-relay"

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
      updater: (store) => {
        updater(store)
      },
      optimisticUpdater: (store) => {
        updater(store)
      },
      onCompleted: (response) => {
        const result = response.markNotificationsAsSeen?.responseOrError
        const errorMessage = result?.mutationError?.message

        if (errorMessage) {
          if (__DEV__) {
            console.error(errorMessage)
          } else {
            captureMessage(errorMessage)
          }

          return
        }

        GlobalStore.actions.bottomTabs.setUnseenNotificationsCount(0)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useMarkNotificationsAsSeen ${error?.message}`)
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
          me {
            unseenNotificationsCount
          }

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

const updater = (
  store: Parameters<
    NonNullable<UseMutationConfig<useMarkNotificationsAsSeenMutation>["updater"]>
  >[0]
) => {
  const root = store.getRoot()
  const me = root.getLinkedRecord("me")

  // Set unseen notifications count to 0
  me?.setValue(0, "unseenNotificationsCount")
}
