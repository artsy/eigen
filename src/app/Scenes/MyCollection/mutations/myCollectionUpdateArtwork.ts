import { myCollectionUpdateArtworkMutation } from "__generated__/myCollectionUpdateArtworkMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionUpdateArtwork(
  input: myCollectionUpdateArtworkMutation["variables"]["input"]
) {
  return new Promise<myCollectionUpdateArtworkMutation["response"]>((resolve, reject) => {
    commitMutation<myCollectionUpdateArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
          myCollectionUpdateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artwork {
                  ...MyCollectionArtwork_sharedProps @relay(mask: false)
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
