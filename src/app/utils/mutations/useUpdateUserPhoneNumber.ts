import { useUpdateUserPhoneNumberMutation } from "__generated__/useUpdateUserPhoneNumberMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useUpdateUserPhoneNumber = () => {
  return useMutation<useUpdateUserPhoneNumberMutation>(graphql`
    mutation useUpdateUserPhoneNumberMutation($input: UpdateMyProfileInput!) {
      updateMyUserProfile(input: $input) {
        user {
          phone
        }
      }
    }
  `)
}
