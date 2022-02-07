import {
  verifyEmailMutation,
  verifyEmailMutationResponse,
} from "__generated__/verifyEmailMutation.graphql"
import { commitMutation, Environment, graphql } from "react-relay"

export const verifyEmail = async (relayEnvironment: Environment) => {
  return new Promise<verifyEmailMutationResponse>((done, reject) => {
    commitMutation<verifyEmailMutation>(relayEnvironment, {
      onCompleted: (data, errors) => (errors && errors.length ? reject(errors) : done(data)),
      onError: (error) => reject(error),
      mutation: graphql`
        mutation verifyEmailMutation {
          sendConfirmationEmail(input: {}) {
            confirmationOrError {
              ... on SendConfirmationEmailMutationSuccess {
                unconfirmedEmail
              }
              ... on SendConfirmationEmailMutationFailure {
                mutationError {
                  error
                  message
                }
              }
            }
          }
        }
      `,
      variables: {},
    })
  })
}
