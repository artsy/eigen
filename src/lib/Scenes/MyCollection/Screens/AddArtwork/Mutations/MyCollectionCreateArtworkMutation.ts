import { graphql } from "react-relay"

export const MyCollectionCreateArtworkMutation = graphql`
  mutation MyCollectionCreateArtworkMutation($input: MyCollectionCreateArtworkInput!) {
    myCollectionCreateArtwork(input: $input) {
      artwork {
        medium
        id
        internalID
      }
    }
  }
`
