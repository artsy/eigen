import { useUpdateArtworkListOfferSettingsMutation } from "__generated__/useUpdateArtworkListOfferSettingsMutation.graphql"
import { UseMutationConfig, graphql, useMutation } from "react-relay"

export type MutationConfig = UseMutationConfig<useUpdateArtworkListOfferSettingsMutation>

export const useUpdateArtworkListOfferSettings = () => {
  return useMutation<useUpdateArtworkListOfferSettingsMutation>(SaveArtworkListsPrivacyMutation)
}

const SaveArtworkListsPrivacyMutation = graphql`
  mutation useUpdateArtworkListOfferSettingsMutation($input: updateMeCollectionsMutationInput!) {
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
