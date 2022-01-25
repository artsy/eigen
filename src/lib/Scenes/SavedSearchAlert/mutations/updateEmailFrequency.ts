import {
  updateEmailFrequencyMutation,
  updateEmailFrequencyMutationResponse,
} from "__generated__/updateEmailFrequencyMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const updateEmailFrequency = (
  emailFrequency: string
): Promise<updateEmailFrequencyMutationResponse> => {
  return new Promise((resolve, reject) => {
    commitMutation<updateEmailFrequencyMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation updateEmailFrequencyMutation($input: UpdateMyProfileInput!) {
          updateMyUserProfile(input: $input) {
            userOrError {
              ... on UpdateMyProfileMutationSuccess {
                user {
                  internalID
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          emailFrequency,
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
