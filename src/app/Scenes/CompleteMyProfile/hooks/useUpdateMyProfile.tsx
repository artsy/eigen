import { graphql, useMutation } from "react-relay"

export const useUpdateMyProfile = () => {
  return useMutation(mutation)
}

const mutation = graphql`
  mutation useUpdateMyProfileMutation($input: UpdateMyProfileInput!) @raw_response_type {
    updateMyUserProfile(input: $input) {
      me @required(action: NONE) {
        ...useCompleteMyProfileSteps_me
        ...MyProfileHeader_me
        ...MyProfileEditModal_me
        ...MyProfileEditForm_me
      }
    }
  }
`
