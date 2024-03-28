import { ActionType, AddedArtworkToArtworkList, OwnerType } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity, ResultAction } from "app/Components/ArtworkLists/types"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useCallback } from "react"
import { useTracking } from "react-tracking"
import { useUpdateArtworkListsForArtwork, MutationConfig } from "./useUpdateArtworkListsForArtwork"

interface Options {
  onCompleted?: MutationConfig["onCompleted"]
  onError?: MutationConfig["onError"]
}

export const useSaveArtworkListsChanges = (options?: Options) => {
  const { state, addingArtworkListIDs, removingArtworkListIDs, onSave } = useArtworkListsContext()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const artwork = state.artwork as ArtworkEntity
  const [commit, inProgress] = useUpdateArtworkListsForArtwork(artwork.id)

  const trackAddedArtworkToArtworkLists = () => {
    const event: AddedArtworkToArtworkList = {
      action: ActionType.addedArtworkToArtworkList,
      context_owner_id: analytics.contextScreenOwnerId,
      context_owner_slug: analytics.contextScreenOwnerSlug,
      context_owner_type: analytics.contextScreenOwnerType || OwnerType.artwork,
      artwork_ids: [artwork.internalID],
      owner_ids: addingArtworkListIDs,
    }

    trackEvent(event)
  }

  const save = useCallback(() => {
    commit({
      variables: {
        artworkID: artwork.internalID,
        input: {
          artworkIDs: [artwork.internalID],
          addToCollectionIDs: addingArtworkListIDs,
          removeFromCollectionIDs: removingArtworkListIDs,
        },
      },
      onCompleted: (...args) => {
        if (addingArtworkListIDs.length > 0) {
          trackAddedArtworkToArtworkLists()
        }

        onSave({
          action: ResultAction.ModifiedArtworkLists,
          artwork,
        })

        options?.onCompleted?.(...args)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useUpdateArtworkListsForArtworkMutation: ${error.message}`)
        }

        options?.onError?.(error)
      },
    })
  }, [artwork.internalID, addingArtworkListIDs, removingArtworkListIDs])

  return {
    save,
    inProgress,
  }
}
