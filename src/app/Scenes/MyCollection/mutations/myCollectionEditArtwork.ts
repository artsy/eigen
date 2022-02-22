import {
  myCollectionEditArtworkMutation,
  myCollectionEditArtworkMutationResponse,
  myCollectionEditArtworkMutationVariables,
} from "__generated__/myCollectionEditArtworkMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionEditArtwork(input: myCollectionEditArtworkMutationVariables["input"]) {
  return new Promise<myCollectionEditArtworkMutationResponse>((resolve, reject) => {
    commitMutation<myCollectionEditArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionEditArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
          myCollectionUpdateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artwork {
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
