import {
  CreateArtistMutationInput,
  createArtistMutation,
  createArtistMutation$data,
} from "__generated__/createArtistMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createArtist = (
  input: CreateArtistMutationInput
): Promise<createArtistMutation$data> => {
  return new Promise((resolve, reject) => {
    commitMutation<createArtistMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation createArtistMutation($input: CreateArtistMutationInput!) {
          createArtist(input: $input) {
            artistOrError {
              __typename
              ... on CreateArtistSuccess {
                artist {
                  internalID
                  displayName
                }
              }
              ... on CreateArtistFailure {
                mutationError {
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
        const responseError = response.createArtist?.artistOrError

        if (errors?.length || responseError?.__typename === "CreateArtistFailure") {
          reject(errors || responseError)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
