import {
  createSavedSearchAlertMutation,
  createSavedSearchAlertMutationResponse,
} from "__generated__/createSavedSearchAlertMutation.graphql"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

export const createSavedSearchAlert = (
  userAlertSettings: SavedSearchAlertFormValues,
  attributes: SearchCriteriaAttributes
): Promise<createSavedSearchAlertMutationResponse> => {
  return new Promise((resolve, reject) => {
    commitMutation<createSavedSearchAlertMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createSavedSearchAlertMutation($input: CreateSavedSearchInput!) {
          createSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          attributes,
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
