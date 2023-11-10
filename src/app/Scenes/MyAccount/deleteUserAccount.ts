import {
  DeleteAccountInput,
  deleteUserAccountMutation,
} from "__generated__/deleteUserAccountMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Environment, commitMutation, graphql } from "react-relay"

export const deleteUserAccount = async (
  input: DeleteAccountInput = {},
  environment: Environment = getRelayEnvironment()
): Promise<deleteUserAccountMutation["response"]> => {
  return new Promise<deleteUserAccountMutation["response"]>((resolve, reject) =>
    commitMutation<deleteUserAccountMutation>(environment, {
      onCompleted: (response) => {
        resolve(response)
      },
      mutation: graphql`
        mutation deleteUserAccountMutation($input: DeleteAccountInput!) {
          deleteMyAccountMutation(input: $input) {
            userAccountOrError {
              ... on AccountMutationSuccess {
                success
              }
              ... on AccountMutationFailure {
                mutationError {
                  type
                  message
                  detail
                }
              }
            }
          }
        }
      `,
      variables: { input },
      onError: (error) => {
        reject(error)
      },
    })
  )
}
