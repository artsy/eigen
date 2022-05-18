import {
  myCollectionUpdateArtworkMutation,
  myCollectionUpdateArtworkMutationResponse,
  myCollectionUpdateArtworkMutationVariables,
} from "__generated__/myCollectionUpdateArtworkMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionUpdateArtwork(
  input: myCollectionUpdateArtworkMutationVariables["input"]
) {
  return new Promise<myCollectionUpdateArtworkMutationResponse>((resolve, reject) => {
    commitMutation<myCollectionUpdateArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
          myCollectionUpdateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artwork {
                  ...MyCollectionArtwork_sharedProps @relay(mask: false)
                  ...OldMyCollectionArtwork_sharedProps @relay(mask: false)
                }
              }
              ... on MyCollectionArtworkMutationFailure {
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
        if (errors?.length) {
          reject(errors)
        } else if (response.myCollectionUpdateArtwork?.artworkOrError?.mutationError) {
          reject(response.myCollectionUpdateArtwork?.artworkOrError?.mutationError.message)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
