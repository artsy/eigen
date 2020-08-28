import { graphql } from "react-relay"

export const MyCollectionCreateArtworkMutation = graphql`
  mutation MyCollectionCreateArtworkMutation($input: MyCollectionCreateArtworkInput!) {
    myCollectionCreateArtwork(input: $input) {
      artworkOrError {
        ... on MyCollectionArtworkMutationSuccess {
          artworkEdge {
            node {
              artistNames
              medium
              internalID
            }
          }
        }
      }
    }
  }
`
