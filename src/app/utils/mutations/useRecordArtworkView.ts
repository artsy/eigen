import { graphql, useMutation } from "react-relay"

export const useRecordViewArtwork = () => {
  return useMutation(graphql`
    mutation useRecordArtworkViewMutation($input: RecordArtworkViewInput!) {
      recordArtworkView(input: $input) {
        artworkId
      }
    }
  `)
}
