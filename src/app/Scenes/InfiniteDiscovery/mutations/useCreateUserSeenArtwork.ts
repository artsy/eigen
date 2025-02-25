import { useCreateUserSeenArtworkMutation } from "__generated__/useCreateUserSeenArtworkMutation.graphql"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"

type CommitConfig = UseMutationConfig<useCreateUserSeenArtworkMutation>
type Response = [(config: CommitConfig) => Disposable, boolean]

export const useCreateUserSeenArtwork = (): Response => {
  const [initialCommit, inProgress] = useMutation<useCreateUserSeenArtworkMutation>(
    CreateUserSeenArtworkMutation
  )

  const commit = (config: CommitConfig) => {
    return initialCommit({
      ...config,
      onCompleted: (data, errors) => {
        const response = data.createUserSeenArtwork?.userSeenArtworkOrError

        if (response?.__typename === "CreateUserSeenArtworkFailure") {
          const errorMessage = response?.mutationError?.message

          if (errorMessage) {
            const error = new Error(errorMessage)
            config.onError?.(error)
          }
        } else {
          config.onCompleted?.(data, errors)
        }
      },
    })
  }

  return [commit, inProgress]
}

const CreateUserSeenArtworkMutation = graphql`
  mutation useCreateUserSeenArtworkMutation($input: CreateUserSeenArtworkInput!) {
    createUserSeenArtwork(input: $input) {
      userSeenArtworkOrError {
        __typename

        ... on CreateUserSeenArtworkFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
