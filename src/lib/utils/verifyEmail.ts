import {
  EmailConfirmationBannerMutation,
  EmailConfirmationBannerMutationResponse,
} from "__generated__/EmailConfirmationBannerMutation.graphql"
import { commitMutation, graphql } from "react-relay"
import { defaultEnvironment } from "../relay/createEnvironment"

export const verifyEmail = async () => {
  return new Promise<EmailConfirmationBannerMutationResponse>((done, reject) => {
    commitMutation<EmailConfirmationBannerMutation>(defaultEnvironment, {
      onCompleted: (data, errors) => (errors && errors.length ? reject(errors) : done(data)),
      onError: (error) => reject(error),
      mutation: graphql`
        mutation EmailConfirmationBannerMutation {
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
