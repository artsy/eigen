import { graphql, useMutation } from "react-relay"

export const useDislikeArtwork = () => {
  return useMutation(graphql`
    mutation useDislikeArtworkMutation($artworkID: String!) {
      dislikeArtwork(input: { artworkID: $artworkID, remove: false }) {
        artwork {
          internalID
        }
      }
    }
  `)
}
