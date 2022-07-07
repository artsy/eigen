import {
  NotificationPreferenceInput,
  updateNotificationPreferencesMutation,
} from "__generated__/updateNotificationPreferencesMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const updateNotificationPreferences = (
  subscriptionGroups: NotificationPreferenceInput[]
): Promise<updateNotificationPreferencesMutation["response"]> => {
  const input: updateNotificationPreferencesMutation["variables"]["input"] = {
    subscriptionGroups,
  }

  return new Promise((resolve, reject) => {
    commitMutation<updateNotificationPreferencesMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation updateNotificationPreferencesMutation(
          $input: updateNotificationPreferencesMutationInput!
        ) {
          updateNotificationPreferences(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input,
      },
      onCompleted: (response) => {
        resolve(response)
      },
      onError: (error) => {
        reject(error)
      },
    })
  })
}
