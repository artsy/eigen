import {
  createUserInterestsMutation,
  createUserInterestsMutation$data,
} from "__generated__/createUserInterestsMutation.graphql"
import { CreateUserInterestsMutationInput } from "__generated__/useCreateUserInterestsMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createUserInterests = (
  input: CreateUserInterestsMutationInput
): Promise<createUserInterestsMutation$data> => {
  return new Promise((resolve, reject) => {
    commitMutation<createUserInterestsMutation>(getRelayEnvironment(), {
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
