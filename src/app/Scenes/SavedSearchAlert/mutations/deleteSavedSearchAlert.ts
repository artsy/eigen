import { deleteSavedSearchAlertMutation } from "__generated__/deleteSavedSearchAlertMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const deleteSavedSearchMutation = (id: string) => {
  return new Promise((resolve, reject) => {
    commitMutation<deleteSavedSearchAlertMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation deleteSavedSearchAlertMutation($input: deleteAlertInput!) {
          deleteAlert(input: $input) {
            responseOrError {
              ... on DeleteAlertSuccess {
                alert {
                  internalID
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          id,
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
