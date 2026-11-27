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
        moveUpdatedListsToFront(store, response)

        // Same here: an open list screen should drop the artwork right away
        removeArtworkFromArtworkListConnections(store, artworkID, response?.removedFromArtworkLists)

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

type ReorderableList = { readonly internalID: string; readonly default: boolean } | null | undefined

/**
 * Gravity sorts the lists UPDATED_AT_DESC, so any list whose membership just
 * changed — saved to or removed from — jumps to the front on the next fetch.
 * Mirror that in the store up front, otherwise store-and-network paints the
 * stale order for a frame before the network response reorders it. The default
 * "Saved Artworks" list isn't part of this connection, so it's skipped.
 */
export const moveUpdatedListsToFront = (
  store: RecordSourceSelectorProxy,
  response:
    | {
        readonly addedToArtworkLists?: ReadonlyArray<ReorderableList> | null
        readonly removedFromArtworkLists?: ReadonlyArray<ReorderableList> | null
      }
    | null
    | undefined
) => {
  const updatedCustomListIDs = [
    ...(response?.addedToArtworkLists ?? []),
    ...(response?.removedFromArtworkLists ?? []),
  ]
    .filter((list) => list && !list.default)
    .map((list) => list?.internalID)

  if (!updatedCustomListIDs.length) {
    return
  }

  const me = store.getRoot().getLinkedRecord("me")
  const connection = me && ConnectionHandler.getConnection(me, "ArtworkLists_customArtworkLists")

  if (!connection) {
    return
  }

  const edges = connection.getLinkedRecords("edges") ?? []

  updatedCustomListIDs.forEach((internalID) => {
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

// The sorts the artwork list screen can request; each one is a separate `ArtworkList_artworks` connection
const ARTWORK_LIST_SORTS = ["SAVED_AT_DESC", "SAVED_AT_ASC"]

/**
 * Removes the artwork from the `ArtworkList_artworks` connections of the lists it was removed from,
 * so an open list (e.g. "Saved Artworks") updates immediately instead of after a refresh.
 */
export const removeArtworkFromArtworkListConnections = (
  store: RecordSourceSelectorProxy,
  artworkID: string,
  removedArtworkLists:
    | ReadonlyArray<{ readonly internalID: string } | null | undefined>
    | null
    | undefined
) => {
  const me = store.getRoot().getLinkedRecord("me")

  if (!me || !artworkID) {
    return
  }

  removedArtworkLists?.forEach((artworkList) => {
    if (!artworkList) {
      return
    }

    const collection = me.getLinkedRecord("collection", { id: artworkList.internalID })

    if (!collection) {
      return
    }

    ARTWORK_LIST_SORTS.forEach((sort) => {
      const connection = ConnectionHandler.getConnection(collection, "ArtworkList_artworks", {
        sort,
      })

      if (!connection) {
        return
      }

      const edgesBefore = connection.getLinkedRecords("edges")?.length ?? 0
      ConnectionHandler.deleteNode(connection, artworkID)
      const edgesAfter = connection.getLinkedRecords("edges")?.length ?? 0

      const totalCount = connection.getValue("totalCount")
      if (edgesAfter < edgesBefore && typeof totalCount === "number") {
        connection.setValue(Math.max(totalCount - 1, 0), "totalCount")
      }
    })
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
