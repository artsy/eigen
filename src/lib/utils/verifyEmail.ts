import { verifyEmailMutation, verifyEmailMutationResponse } from "__generated__/verifyEmailMutation.graphql"
import { commitMutation, graphql } from "react-relay"
import { defaultEnvironment } from "../relay/createEnvironment"

export const verifyEmail = async () => {
  return new Promise<verifyEmailMutationResponse>((done, reject) => {
    commitMutation<verifyEmailMutation>(defaultEnvironment, {
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
