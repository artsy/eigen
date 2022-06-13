import { deleteArtworkImageMutation } from "__generated__/deleteArtworkImageMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function deleteArtworkImage(artworkID: string, imageID: string) {
  return new Promise<deleteArtworkImageMutation["response"]>((resolve, reject) => {
    commitMutation<deleteArtworkImageMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation deleteArtworkImageMutation($input: DeleteArtworkImageInput!) {
          deleteArtworkImage(input: $input) {
            artworkOrError {
              ... on ArtworkMutationDeleteSuccess {
                success
              }
              ... on ArtworkMutationFailure {
                mutationError {
                  message
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          artworkID,
          imageID,
        },
      },
      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(errors)
        } else if (response.deleteArtworkImage?.artworkOrError?.mutationError) {
          reject(response.deleteArtworkImage?.artworkOrError?.mutationError.message)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
