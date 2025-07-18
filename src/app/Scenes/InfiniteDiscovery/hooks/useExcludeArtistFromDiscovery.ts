import { useExcludeArtistFromDiscoveryMutation } from "__generated__/useExcludeArtistFromDiscoveryMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useExcludeArtistFromDiscovery = () => {
  return useMutation<useExcludeArtistFromDiscoveryMutation>(mutation)
}

const mutation = graphql`
  mutation useExcludeArtistFromDiscoveryMutation($input: ExcludeArtistFromDiscoveryInput!) {
    excludeArtistFromDiscovery(input: $input) {
      __typename
    }
  }
`
