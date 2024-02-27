import { createSavedSearchAlertMutation } from "__generated__/createSavedSearchAlertMutation.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchAlertFormValues } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createSavedSearchAlert = (
  settings: SavedSearchAlertFormValues,
  attributes: SearchCriteriaAttributes
): Promise<createSavedSearchAlertMutation["response"]> => {
  const input = {
    settings,
    ...attributes,
  }

  return new Promise((resolve, reject) => {
    commitMutation<createSavedSearchAlertMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation createSavedSearchAlertMutation($input: createAlertInput!) {
          createAlert(input: $input) {
            responseOrError {
              ... on CreateAlertSuccess {
                alert {
                  internalID
                  searchCriteriaID
                }
              }
            }
          }
        }
      `,
      variables: {
        input: input as { artistIDs: string[] }, // TODO: leave a note why
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
