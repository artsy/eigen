import { DeleteUserInterestMutationInput } from "__generated__/deleteUserInterestMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const deleteUserInterest = (input: DeleteUserInterestMutationInput) => {
  return new Promise((resolve, reject) => {
    commitMutation(getRelayEnvironment(), {
      mutation: graphql`
        mutation deleteUserInterestMutation($input: DeleteUserInterestMutationInput!) {
          deleteUserInterest(input: $input) {
            userInterest {
              internalID
            }
          }
        }
      `,
      variables: {
        input,
      },
      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(errors)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
