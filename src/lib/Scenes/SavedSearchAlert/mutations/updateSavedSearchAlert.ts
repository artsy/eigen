import {
  updateSavedSearchAlertMutation,
  updateSavedSearchAlertMutationResponse,
  updateSavedSearchAlertMutationVariables,
} from "__generated__/updateSavedSearchAlertMutation.graphql"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

export const updateSavedSearchAlert = (
  savedSearchAlertId: string,
  userAlertSettings: SavedSearchAlertFormValues,
  attributes: SearchCriteriaAttributes | null
): Promise<updateSavedSearchAlertMutationResponse> => {
  const input: updateSavedSearchAlertMutationVariables["input"] = {
    searchCriteriaID: savedSearchAlertId,
    userAlertSettings,
  }

  // Pass immediately to input when the AREnableImprovedAlertsFlow flag is released
  if (!!attributes) {
    input.attributes = attributes
  }

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
