import {
  DeleteAccountInput,
  deleteUserAccountMutation,
} from "__generated__/deleteUserAccountMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Environment } from "react-relay"
import { commitMutation, graphql } from "relay-runtime"

export const deleteUserAccount = async (
  input: DeleteAccountInput = {},
  environment: Environment = defaultEnvironment
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
