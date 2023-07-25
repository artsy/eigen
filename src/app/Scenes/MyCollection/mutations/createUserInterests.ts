import { CreateUserInterestsMutationInput } from "__generated__/useCreateUserInterestsMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createUserInterests = (input: CreateUserInterestsMutationInput) => {
  return new Promise((resolve, reject) => {
    commitMutation(getRelayEnvironment(), {
      mutation: graphql`
        mutation createUserInterestsMutation($input: CreateUserInterestsMutationInput!) {
          createUserInterests(input: $input) {
            userInterestsOrErrors {
              ... on UserInterest {
                category
                interest {
                  ... on Artist {
                    name
                  }
                }
              }
              ... on CreateUserInterestFailure {
                mutationError {
                  type
                  message
                }
              }
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
