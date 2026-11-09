import { useShareArtworkListMutation } from "__generated__/useShareArtworkListMutation.graphql"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"

type CommitConfig = UseMutationConfig<useShareArtworkListMutation>
type Response = [(config: CommitConfig) => Disposable, boolean]

export const useShareArtworkList = (): Response => {
  const [initialCommit, inProgress] =
    useMutation<useShareArtworkListMutation>(ShareArtworkListMutation)

  const commit = (config: CommitConfig) => {
    return initialCommit({
      ...config,
      onCompleted: (data, errors) => {
        const response = data.updateCollection?.responseOrError

        if (response?.__typename === "UpdateCollectionFailure") {
          const error = new Error(
            response?.mutationError?.fieldErrors?.[0]?.message ?? "Something went wrong."
          )
          config.onError?.(error)
        } else {
          config.onCompleted?.(data, errors)
        }
      },
    })
  }

  return [commit, inProgress]
}

const ShareArtworkListMutation = graphql`
  mutation useShareArtworkListMutation($input: updateCollectionInput!) {
    updateCollection(input: $input) {
      responseOrError {
        __typename
        ... on UpdateCollectionSuccess {
          collection {
            internalID
            slug
            private
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
