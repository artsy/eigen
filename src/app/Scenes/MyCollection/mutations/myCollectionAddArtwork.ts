import {
  myCollectionAddArtworkMutation,
  myCollectionAddArtworkMutationResponse,
  myCollectionAddArtworkMutationVariables,
} from "__generated__/myCollectionAddArtworkMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionAddArtwork(input: myCollectionAddArtworkMutationVariables["input"]) {
  return new Promise<myCollectionAddArtworkMutationResponse>((resolve, reject) => {
    commitMutation<myCollectionAddArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionAddArtworkMutation($input: MyCollectionCreateArtworkInput!) {
          myCollectionCreateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artworkEdge {
                  __id
                  node {
                    ...OldMyCollectionArtwork_sharedProps @relay(mask: false)
                  }
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
        } else if (response.myCollectionCreateArtwork?.artworkOrError?.mutationError) {
          reject(response.myCollectionCreateArtwork?.artworkOrError?.mutationError.message)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
