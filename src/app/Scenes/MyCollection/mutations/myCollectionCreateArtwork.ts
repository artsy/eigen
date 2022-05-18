import {
  myCollectionCreateArtworkMutation,
  myCollectionCreateArtworkMutationResponse,
  myCollectionCreateArtworkMutationVariables,
} from "__generated__/myCollectionCreateArtworkMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionCreateArtwork(
  input: myCollectionCreateArtworkMutationVariables["input"]
) {
  return new Promise<myCollectionCreateArtworkMutationResponse>((resolve, reject) => {
    commitMutation<myCollectionCreateArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionCreateArtworkMutation($input: MyCollectionCreateArtworkInput!) {
          myCollectionCreateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artworkEdge {
                  __id
                  node {
                    ...MyCollectionArtwork_sharedProps @relay(mask: false)
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
        input: { importSource: "MY_COLLECTION", ...input },
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
