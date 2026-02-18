import {
  UpdateMyProfileInput,
  useUpdateUserProfileMutation,
} from "__generated__/useUpdateUserProfileMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useUpdateUserProfile = (onMutationComplete: () => void) => {
  const [commit] = useMutation<useUpdateUserProfileMutation>(UpdateProfileMutation)

  const commitMutation = (input: UpdateMyProfileInput) => {
    commit({
      variables: {
        input,
      },
      onCompleted() {
        onMutationComplete()
      },
      onError(e) {
        console.error(e)
      },
    })
  }

  return {
    commitMutation,
  }
}

const UpdateProfileMutation = graphql`
  mutation useUpdateUserProfileMutation($input: UpdateMyProfileInput!) {
    updateMyUserProfile(input: $input) {
      clientMutationId
    }
  }
`
