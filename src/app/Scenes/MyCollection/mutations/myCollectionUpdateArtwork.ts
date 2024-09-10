import { myCollectionUpdateArtworkMutation } from "__generated__/myCollectionUpdateArtworkMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionUpdateArtwork(
  input: myCollectionUpdateArtworkMutation["variables"]["input"]
) {
  return new Promise<myCollectionUpdateArtworkMutation["response"]>((resolve, reject) => {
    commitMutation<myCollectionUpdateArtworkMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation myCollectionUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
          myCollectionUpdateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artwork {
                  ...MyCollectionArtwork_sharedProps @relay(mask: false)
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
