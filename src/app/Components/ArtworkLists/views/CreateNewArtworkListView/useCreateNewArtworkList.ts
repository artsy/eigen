import { useCreateNewArtworkListMutation } from "__generated__/useCreateNewArtworkListMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useCreateNewArtworkList = () => {
  return useMutation<useCreateNewArtworkListMutation>(CreateNewArtworkListMutation)
}

const CreateNewArtworkListMutation = graphql`
  mutation useCreateNewArtworkListMutation($input: createCollectionInput!) {
    createCollection(input: $input) {
      responseOrError {
        ... on CreateCollectionSuccess {
          collection {
            internalID
            name
            artworksCount(onlyVisible: true)
          }
        }

        ... on CreateCollectionFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
