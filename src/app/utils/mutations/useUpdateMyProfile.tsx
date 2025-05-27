import { updateMyUserProfileMutation } from "__generated__/updateMyUserProfileMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useUpdateMyProfile = () => {
  return useMutation<updateMyUserProfileMutation>(mutation)
}

const mutation = graphql`
  mutation useUpdateMyProfileMutation($input: UpdateMyProfileInput!) @raw_response_type {
    updateMyUserProfile(input: $input) {
      me @required(action: NONE) {
        ...useCompleteMyProfileSteps_me
        ...MyProfileEditModal_me
        ...MyProfileEditForm_me
      }
    }
  }
`
