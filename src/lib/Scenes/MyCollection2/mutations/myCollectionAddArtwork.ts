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
                    ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
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
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
