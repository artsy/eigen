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

        // Anything that isn't an explicit success is a failure: top-level GraphQL errors pass
        // through principalFieldErrorHandlerMiddleware and would otherwise leave the toggle in a
        // state the server never actually committed.
        if (response?.__typename !== "UpdateCollectionSuccess") {
          const message =
            response?.__typename === "UpdateCollectionFailure"
              ? response.mutationError?.fieldErrors?.[0]?.message
              : errors?.[0]?.message

          config.onError?.(new Error(message ?? "Something went wrong."))
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
