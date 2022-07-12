import { deleteSavedSearchAlertMutation } from "__generated__/deleteSavedSearchAlertMutation.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const deleteSavedSearchMutation = (savedSearchAlertId: string) => {
  return new Promise((resolve, reject) => {
    commitMutation<deleteSavedSearchAlertMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation deleteSavedSearchAlertMutation($input: DisableSavedSearchInput!) {
          disableSavedSearch(input: $input) {
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
          searchCriteriaID: savedSearchAlertId,
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
