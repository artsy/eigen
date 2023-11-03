import {
  NotificationPreferenceInput,
  updateNotificationPreferencesMutation,
} from "__generated__/updateNotificationPreferencesMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateNotificationPreferences = (
  subscriptionGroups: NotificationPreferenceInput[]
): Promise<updateNotificationPreferencesMutation["response"]> => {
  const input: updateNotificationPreferencesMutation["variables"]["input"] = {
    subscriptionGroups,
  }

  return new Promise((resolve, reject) => {
    commitMutation<updateNotificationPreferencesMutation>(getRelayEnvironment(), {
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
