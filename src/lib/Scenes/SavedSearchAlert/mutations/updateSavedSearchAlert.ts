import {
  updateSavedSearchAlertMutation,
  updateSavedSearchAlertMutationResponse,
} from "__generated__/updateSavedSearchAlertMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const updateSavedSearchAlert = (
  name: string,
  savedSearchAlertId: string,
  enablePushNotifications?: boolean,
  enableEmailNotifications?: boolean
): Promise<updateSavedSearchAlertMutationResponse> => {
  return new Promise((resolve, reject) => {
    commitMutation<updateSavedSearchAlertMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation updateSavedSearchAlertMutation($input: UpdateSavedSearchInput!) {
          updateSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
                userAlertSettings {
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          searchCriteriaID: savedSearchAlertId,
          userAlertSettings: {
            name,
            push: enablePushNotifications,
            email: enableEmailNotifications,
          },
        },
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
