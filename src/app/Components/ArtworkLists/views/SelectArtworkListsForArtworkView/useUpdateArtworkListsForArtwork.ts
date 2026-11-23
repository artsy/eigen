import {
  useUpdateArtworkListsForArtworkMutation,
  useUpdateArtworkListsForArtworkMutation$data,
} from "__generated__/useUpdateArtworkListsForArtworkMutation.graphql"
import { ConnectionHandler, UseMutationConfig, graphql, useMutation } from "react-relay"
import { Disposable, RecordSourceSelectorProxy } from "relay-runtime"

interface Counts {
  custom: number
  default: number
}

type Response = NonNullable<
  NonNullable<
    NonNullable<useUpdateArtworkListsForArtworkMutation$data>["artworksCollectionsBatchUpdate"]
  >["responseOrError"]
>
export type ArtworkListEntity =
  | Response["addedToArtworkLists"]
  | Response["removedFromArtworkLists"]
export type MutationConfig = UseMutationConfig<useUpdateArtworkListsForArtworkMutation>
type MutationResult = [(config: MutationConfig) => Disposable, boolean]

export const useUpdateArtworkListsForArtwork = (artworkID: string): MutationResult => {
  const [initialCommit, isInProgress] =
    useMutation<useUpdateArtworkListsForArtworkMutation>(SaveArtworkListsMutation)

  const commit = (config: MutationConfig) => {
    return initialCommit({
      ...config,
      updater: (store, data) => {
        const response = data?.artworksCollectionsBatchUpdate?.responseOrError

        // Independent of the artwork/`entity` records below, so run it before
        // their early returns — a missing store count shouldn't skip the reorder.
        moveSavedListsToFront(store, response?.addedToArtworkLists)

        const artwork = store.get(artworkID)

        if (!artwork) {
          return
        }

        const addedCounts = getArtworkListsCountByType(response?.addedToArtworkLists)
        const removedCounts = getArtworkListsCountByType(response?.removedFromArtworkLists)

        // Set `isSaved` field to `true` if artwork was saved in "Saved Artworks"
        if (addedCounts.default > 0) {
          artwork.setValue(true, "isSaved")
        }

        // Set `isSaved` field to `false` if artwork was unsaved from "Saved Artworks"
        if (removedCounts.default > 0) {
          artwork.setValue(false, "isSaved")
        }

        const entity = artwork.getLinkedRecord("collectionsConnection", {
          first: 0,
          default: false,
          saves: true,
        })

        if (!entity) {
          return
        }

        /**
         * Update `totalCount` field, based on which we decide
         * whether to display the manage lists for artwork modal or
         * immediately remove artwork from "Saved Artworks"
         */
        const prevValue = (entity.getValue("totalCount") ?? 0) as number
        const newValue = prevValue + addedCounts.custom - removedCounts.custom

        entity.setValue(newValue, "totalCount")
      },
    })
  }

  return [commit, isInProgress]
}

/**
 * Gravity sorts the lists UPDATED_AT_DESC, so a list you just saved to jumps to
 * the front on the next fetch. Mirror that in the store up front, otherwise
 * store-and-network paints the stale order for a frame before the network
 * response reorders it. The default "Saved Artworks" list isn't part of this
 * connection, so it's skipped.
 */
export const moveSavedListsToFront = (
  store: RecordSourceSelectorProxy,
  addedToArtworkLists: Response["addedToArtworkLists"]
) => {
  const addedCustomListIDs = (addedToArtworkLists ?? [])
    .filter((list) => list && !list.default)
    .map((list) => list?.internalID)

  if (!addedCustomListIDs.length) {
    return
  }

  const me = store.getRoot().getLinkedRecord("me")
  const connection = me && ConnectionHandler.getConnection(me, "ArtworkLists_customArtworkLists")

  if (!connection) {
    return
  }

  const edges = connection.getLinkedRecords("edges") ?? []

  addedCustomListIDs.forEach((internalID) => {
    const node = edges
      .find((edge) => edge?.getLinkedRecord("node")?.getValue("internalID") === internalID)
      ?.getLinkedRecord("node")
    const nodeID = node?.getValue("id")

    if (!node || typeof nodeID !== "string") {
      return
    }

    ConnectionHandler.deleteNode(connection, nodeID)
    const newEdge = ConnectionHandler.createEdge(store, connection, node, "Collection")
    ConnectionHandler.insertEdgeBefore(connection, newEdge)
  })
}

export const getArtworkListsCountByType = (artworkLists: ArtworkListEntity) => {
  const artworkListsEntities = artworkLists ?? []
  const defaultCounts: Counts = {
    custom: 0,
    default: 0,
  }

  return artworkListsEntities.reduce((acc, artworkList) => {
    if (!artworkList) {
      return acc
    }

    const key: keyof Counts = artworkList.default ? "default" : "custom"
    const prevCount = acc[key]

    return {
      ...acc,
      [key]: prevCount + 1,
    }
  }, defaultCounts)
}

const SaveArtworkListsMutation = graphql`
  mutation useUpdateArtworkListsForArtworkMutation(
    $artworkID: String!
    $input: ArtworksCollectionsBatchUpdateInput!
  ) {
    artworksCollectionsBatchUpdate(input: $input) {
      responseOrError {
        ... on ArtworksCollectionsBatchUpdateSuccess {
          addedToArtworkLists: addedToCollections {
            internalID
            default
            ...ArtworkListItem_item @arguments(artworkID: $artworkID)
            ...ArtworkListItem_collection
          }
          removedFromArtworkLists: removedFromCollections {
            internalID
            default
            ...ArtworkListItem_item @arguments(artworkID: $artworkID)
            ...ArtworkListItem_collection
          }
        }
        ... on ArtworksCollectionsBatchUpdateFailure {
          mutationError {
            statusCode
          }
        }
      }
    }
  }
`
