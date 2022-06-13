import { updateSavedSearchAlertMutation } from "__generated__/updateSavedSearchAlertMutation.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

export const updateSavedSearchAlert = (
  savedSearchAlertId: string,
  userAlertSettings: SavedSearchAlertFormValues,
  attributes: SearchCriteriaAttributes
): Promise<updateSavedSearchAlertMutation["response"]> => {
  const input: updateSavedSearchAlertMutation["variables"]["input"] = {
    searchCriteriaID: savedSearchAlertId,
    userAlertSettings,
    attributes,
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
