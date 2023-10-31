import {
  useUpdateArtworkListsForArtworkMutation,
  useUpdateArtworkListsForArtworkMutation$data,
} from "__generated__/useUpdateArtworkListsForArtworkMutation.graphql"
import { UseMutationConfig, graphql, useMutation } from "react-relay"
import { Disposable } from "relay-runtime"

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
        const artwork = store.get(artworkID)

        if (!artwork) {
          return
        }

        const response = data.artworksCollectionsBatchUpdate?.responseOrError
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
