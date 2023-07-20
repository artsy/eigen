import {
  CreateArtistMutationInput,
  createArtistMutation,
} from "__generated__/createArtistMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const createArtist = (input: CreateArtistMutationInput) => {
  return new Promise((resolve, reject) => {
    commitMutation(getRelayEnvironment(), {
      mutation: graphql`
        mutation createArtistMutation($input: CreateArtistMutationInput!) {
          createArtist(input: $input) {
            artistOrError {
              __typename
              ... on CreateArtistSuccess {
                artist {
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
        const responseError = (response as createArtistMutation["response"]).createArtist
          ?.artistOrError

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
