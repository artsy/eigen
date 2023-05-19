import {
  useDeleteArtworkListMutation,
  useDeleteArtworkListMutation$data,
} from "__generated__/useDeleteArtworkListMutation.graphql"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"
import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime"

type Data = useDeleteArtworkListMutation$data
type CommitConfig = UseMutationConfig<useDeleteArtworkListMutation>
type Store = RecordSourceSelectorProxy<Data>
type Response = [(config: CommitConfig) => Disposable, boolean]

export const useDeleteArtworkList = (): Response => {
  const [initialCommit, inProgress] =
    useMutation<useDeleteArtworkListMutation>(DeleteArtworkListMutation)

  const commit = (config: CommitConfig) => {
    return initialCommit({
      ...config,
      updater: deleteArtworkListUpdater,
      onCompleted: (data, errors) => {
        const response = data.deleteCollection?.responseOrError

        if (response?.__typename !== "DeleteCollectionFailure") {
          return config.onCompleted?.(data, errors)
        }

        const errorMessage = response?.mutationError?.message

        if (errorMessage) {
          const error = new Error(errorMessage)
          config.onError?.(error)
        }
      },
    })
  }

  return [commit, inProgress]
}

const DeleteArtworkListMutation = graphql`
  mutation useDeleteArtworkListMutation($input: deleteCollectionInput!) {
    deleteCollection(input: $input) {
      responseOrError {
        __typename # DeleteCollectionSuccess or DeleteCollectionFailure
        ... on DeleteCollectionSuccess {
          artworkList: collection {
            id
          }
        }
        ... on DeleteCollectionFailure {
          mutationError {
            message
            statusCode
          }
        }
      }
    }
  }
`

const deleteArtworkListUpdater = (store: Store, data: Data) => {
  const { responseOrError } = data.deleteCollection ?? {}

  if (responseOrError?.__typename !== "DeleteCollectionSuccess") {
    return
  }

  const artworkListID = responseOrError.artworkList?.id

  const root = store.getRoot()
  const me = root.getLinkedRecord("me")

  if (!me || !artworkListID) {
    return
  }

  const key = "ArtworkLists_customArtworkLists"
  const customArtworkListsConnection = ConnectionHandler.getConnection(me, key)

  if (!customArtworkListsConnection) {
    return
  }

  ConnectionHandler.deleteNode(customArtworkListsConnection, artworkListID)
}
