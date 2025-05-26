import { useUpdateUserProfileFieldsMutation } from "__generated__/useUpdateUserProfileFieldsMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useUpdateUserProfileFields = () => {
  return useMutation<useUpdateUserProfileFieldsMutation>(graphql`
    mutation useUpdateUserProfileFieldsMutation($input: UpdateMyProfileInput!) {
      updateMyUserProfile(input: $input) {
        me {
          ...MyProfileEditForm_me
          ...useSendInquiry_me
          ...MyProfileEditModal_me
        }
      }
    }
  `)
}
