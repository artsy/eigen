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
) => {
  await new Promise((resolve, reject) =>
    commitMutation<deleteUserAccountMutation>(environment, {
      onCompleted: resolve,
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
      onError: (e) => {
        reject("Something went wrong")
      },
    })
  )
}
