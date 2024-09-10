import { useUpdateCollectorProfileMutation } from "__generated__/useUpdateCollectorProfileMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useUpdateCollectorProfile = () => {
  return useMutation<useUpdateCollectorProfileMutation>(mutation)
}

const mutation = graphql`
  mutation useUpdateCollectorProfileMutation($input: UpdateCollectorProfileInput!) {
    updateCollectorProfile(input: $input) {
      collectorProfileOrError {
        ... on UpdateCollectorProfileSuccess {
          collectorProfile {
            ...useSendInquiry_collectorProfile
          }
        }

        ... on UpdateCollectorProfileFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
