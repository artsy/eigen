import {
  useCreateNewArtworkListMutation,
  useCreateNewArtworkListMutation$data,
} from "__generated__/useCreateNewArtworkListMutation.graphql"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"
import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime"

type CommitConfig = UseMutationConfig<useCreateNewArtworkListMutation>
type Data = useCreateNewArtworkListMutation$data
type Store = RecordSourceSelectorProxy<Data>
type Response = [(config: CommitConfig) => Disposable, boolean]

export const useCreateNewArtworkList = (): Response => {
  const [initialCommit, inProgress] = useMutation<useCreateNewArtworkListMutation>(
    CreateNewArtworkListMutation
  )

  const commit = (config: CommitConfig) => {
    return initialCommit({
      ...config,
      onCompleted: (data, errors) => {
        const response = data.createCollection?.responseOrError
        const errorMessage = response?.mutationError?.message

        if (errorMessage) {
          const error = new Error(errorMessage)
          config.onError?.(error)

          return
        }

        return config.onCompleted?.(data, errors)
      },
      updater: (store, data) => {
        config.updater?.(store, data)
        updater(store, data)
      },
    })
  }

  return [commit, inProgress]
}

const updater = (store: Store, data: Data) => {
  const response = data.createCollection?.responseOrError
  const me = store.getRoot().getLinkedRecord("me")

  if (!response || !me) {
    return
  }

  const key = "ArtworkLists_customArtworkLists"
  const customArtworkListsConnection = ConnectionHandler.getConnection(me, key)
  const mutationPayload = store.getRootField("createCollection")
  const responseOrError = mutationPayload.getLinkedRecord("responseOrError")
  const createdCollection = responseOrError.getLinkedRecord("collection")

  if (!customArtworkListsConnection || !createdCollection) {
    return
  }

  const createdCollectionEdge = ConnectionHandler.createEdge(
    store,
    customArtworkListsConnection,
    createdCollection,
    "Collection"
  )

  ConnectionHandler.insertEdgeBefore(customArtworkListsConnection, createdCollectionEdge)
}

const CreateNewArtworkListMutation = graphql`
  mutation useCreateNewArtworkListMutation($input: createCollectionInput!) {
    createCollection(input: $input) {
      responseOrError {
        ... on CreateCollectionSuccess {
          collection {
            internalID
            name
            artworksCount(onlyVisible: true)
          }
        }

        ... on CreateCollectionFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
