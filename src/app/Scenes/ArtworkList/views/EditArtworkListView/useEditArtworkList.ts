import { useEditArtworkListMutation } from "__generated__/useEditArtworkListMutation.graphql"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"

type CommitConfig = UseMutationConfig<useEditArtworkListMutation>
type Response = [(config: CommitConfig) => Disposable, boolean]

export const useEditArtworkList = (): Response => {
  const [initialCommit, inProgress] =
    useMutation<useEditArtworkListMutation>(EditArtworkListMutation)

  const commit = (config: CommitConfig) => {
    return initialCommit({
      ...config,
      onCompleted: (data, errors) => {
        const response = data.updateCollection?.responseOrError

        if (response?.__typename !== "UpdateCollectionFailure") {
          return config.onCompleted?.(data, errors)
        }

        // use generic error message by default
        let errorMessage = "Something went wrong."

        // if there is a specific error message for the name field, use that instead
        const nameErrorMessage = response?.mutationError?.fieldErrors?.find(
          (e) => e?.name === "name"
        )
        if (nameErrorMessage) {
          errorMessage = nameErrorMessage.message
        }

        if (errorMessage) {
          const error = new Error(errorMessage)
          config.onError?.(error)
        }
      },
    })
  }

  return [commit, inProgress]
}

const EditArtworkListMutation = graphql`
  mutation useEditArtworkListMutation($input: updateCollectionInput!) {
    updateCollection(input: $input) {
      responseOrError {
        __typename
        ... on UpdateCollectionSuccess {
          artworkList: collection {
            internalID
            name
          }
        }
        ... on UpdateCollectionFailure {
          mutationError {
            fieldErrors {
              name
              message
            }
          }
        }
      }
    }
  }
`
