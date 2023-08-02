import {
  UpdateUserInterestMutationInput,
  updateUserInterestMutation,
  updateUserInterestMutation$data,
} from "__generated__/updateUserInterestMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateUserInterest = (
  input: UpdateUserInterestMutationInput
): Promise<updateUserInterestMutation$data> => {
  return new Promise((resolve, reject) => {
    commitMutation<updateUserInterestMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation updateUserInterestMutation($input: UpdateUserInterestMutationInput!)
        @raw_response_type {
          updateUserInterest(input: $input) {
            userInterestOrError {
              ... on UpdateUserInterestSuccess {
                userInterest {
                  id
                  private
                }
              }
            }
          }
        }
      `,
      variables: {
        input,
      },
      optimisticResponse: {
        updateUserInterest: {
          userInterestOrError: {
            __typename: "UpdateUserInterestSuccess",
            userInterest: {
              id: input.id,
              private: !!input.private,
            },
          },
        },
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
