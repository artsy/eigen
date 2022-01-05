import {
  updateSavedSearchAlertMutation,
  updateSavedSearchAlertMutationResponse,
} from "__generated__/updateSavedSearchAlertMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

export const updateSavedSearchAlert = (
  userAlertSettings: SavedSearchAlertFormValues,
  savedSearchAlertId: string
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
          userAlertSettings,
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
