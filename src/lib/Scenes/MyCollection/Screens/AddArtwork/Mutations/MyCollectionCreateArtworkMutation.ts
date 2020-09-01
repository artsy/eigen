import { graphql } from "react-relay"

export const MyCollectionCreateArtworkMutation = graphql`
  mutation MyCollectionCreateArtworkMutation($input: MyCollectionCreateArtworkInput!) {
    myCollectionCreateArtwork(input: $input) {
      artworkOrError {
        ... on MyCollectionArtworkMutationSuccess {
          artworkEdge {
            __id
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
