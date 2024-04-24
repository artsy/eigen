import {
  useCreateNewArtworkListMutation,
  useCreateNewArtworkListMutation$data,
} from "__generated__/useCreateNewArtworkListMutation.graphql"
import { ConnectionHandler, Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"

type CommitConfig = UseMutationConfig<useCreateNewArtworkListMutation>
type Data = useCreateNewArtworkListMutation$data
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

        if (response?.__typename === "CreateCollectionFailure") {
          // use generic error message by default
          let errorMessage = "Something went wrong."

          const nameErrorMessage = response?.mutationError?.fieldErrors?.find(
            (e) => e?.name === "name"
          )

          // if there is a specific error message for the name field, use that instead
          if (nameErrorMessage) {
            errorMessage = nameErrorMessage.message
          }

          if (errorMessage) {
            const error = new Error(errorMessage)
            config.onError?.(error)
          }
        } else {
          config.onCompleted?.(data, errors)
        }
      },
      updater: (store, data) => {
        config.updater?.(store, data)
        updater(store, data)
      },
    })
  }

  return [commit, inProgress]
}

const updater = (
  store: Parameters<NonNullable<UseMutationConfig<useCreateNewArtworkListMutation>["updater"]>>[0],
  data: Data
) => {
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
        __typename
        ... on CreateCollectionSuccess {
          collection {
            internalID
            name
            shareableWithPartners
            artworksCount(onlyVisible: true)
          }
        }

        ... on CreateCollectionFailure {
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
