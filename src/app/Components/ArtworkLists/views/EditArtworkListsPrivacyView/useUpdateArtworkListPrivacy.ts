import { useUpdateArtworkListPrivacyMutation } from "__generated__/useUpdateArtworkListPrivacyMutation.graphql"
import { UseMutationConfig, graphql, useMutation } from "react-relay"

export type MutationConfig = UseMutationConfig<useUpdateArtworkListPrivacyMutation>

export const useUpdateArtworkListPrivacy = () => {
  return useMutation<useUpdateArtworkListPrivacyMutation>(SaveArtworkListsPrivacyMutation)
}

const SaveArtworkListsPrivacyMutation = graphql`
  mutation useUpdateArtworkListPrivacyMutation($input: updateMeCollectionsMutationInput!) {
    updateMeCollectionsMutation(input: $input) {
      meCollectionsOrErrors {
        ... on UpdateMeCollectionsSuccess {
          collection {
            id
            shareableWithPartners
            name
            artworksCount
          }
        }
        ... on UpdateMeCollectionsFailure {
          mutationError {
            type
            message
          }
        }
      }
    }
  }
`
