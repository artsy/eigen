import { graphql } from "react-relay"

export const MyCollectionUpdateArtworkMutation = graphql`
  mutation MyCollectionUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
    myCollectionUpdateArtwork(input: $input) {
      artwork {
        medium
        id
        internalID
      }
    }
  }
`
