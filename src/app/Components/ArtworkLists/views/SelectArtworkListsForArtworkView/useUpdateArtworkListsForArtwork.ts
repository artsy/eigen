import {
  useUpdateArtworkListsForArtworkMutation,
  useUpdateArtworkListsForArtworkMutation$data,
} from "__generated__/useUpdateArtworkListsForArtworkMutation.graphql"
import { UseMutationConfig, graphql, useMutation } from "react-relay"
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
type ListEntity = Response["addedToArtworkLists"] | Response["removedFromArtworkLists"]
type MutationResult = [
  (config: UseMutationConfig<useUpdateArtworkListsForArtworkMutation>) => Disposable,
  boolean
]

export const useUpdateArtworkListsForArtwork = (artworkID: string): MutationResult => {
  const [initialCommit, isInProgress] =
    useMutation<useUpdateArtworkListsForArtworkMutation>(SaveArtworkListsMutation)

  const commit = (config: UseMutationConfig<useUpdateArtworkListsForArtworkMutation>) => {
    return initialCommit({
      ...config,
      updater: updater(artworkID),
    })
  }

  return [commit, isInProgress]
}

const updater =
  (artworkID: string) =>
  (
    store: RecordSourceSelectorProxy<useUpdateArtworkListsForArtworkMutation$data>,
    data: useUpdateArtworkListsForArtworkMutation$data
  ) => {
    const artwork = store.get(artworkID)

    if (!artwork) {
      return
    }

    const response = data.artworksCollectionsBatchUpdate?.responseOrError
    const addedCounts = getCountsByLists(response?.addedToArtworkLists)
    const removedCounts = getCountsByLists(response?.removedFromArtworkLists)

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
  }

const getCountsByLists = (lists: ListEntity) => {
  const listEntities = lists ?? []
  const defaultCounts: Counts = {
    custom: 0,
    default: 0,
  }

  return listEntities.reduce((acc, list) => {
    if (!list) {
      return acc
    }

    const key: keyof Counts = list.default ? "default" : "custom"
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
          }
          removedFromArtworkLists: removedFromCollections {
            internalID
            default
            ...ArtworkListItem_item @arguments(artworkID: $artworkID)
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
