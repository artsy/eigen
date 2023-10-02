import {
  SendIdentityVerificationEmailMutationInput,
  verifyIDMutation,
} from "__generated__/verifyIDMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const verifyID = async (input: SendIdentityVerificationEmailMutationInput) => {
  return new Promise<verifyIDMutation["response"]>((done, reject) => {
    commitMutation<verifyIDMutation>(getRelayEnvironment(), {
      onCompleted: (data, errors) => (errors && errors.length ? reject(errors) : done(data)),
      onError: (error) => reject(error),
      mutation: graphql`
        mutation verifyIDMutation($input: SendIdentityVerificationEmailMutationInput!) {
          sendIdentityVerificationEmail(input: $input) {
            confirmationOrError {
              ... on IdentityVerificationEmailMutationSuccessType {
                identityVerification {
                  internalID
                  state
                  userID
                }
              }
              ... on IdentityVerificationEmailMutationFailureType {
                mutationError {
                  error
                  message
                }
              }
            }
          }
        }
      `,
      variables: { input: { ...input } },
    })
  })
}
