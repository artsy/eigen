import { ActionType, AddedArtworkToArtworkList, OwnerType } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useArtworkListsModifiedToastHandler } from "app/Components/ArtworkLists/useArtworkListsModifiedToastHandler"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useCallback } from "react"
import { useTracking } from "react-tracking"
import { useUpdateArtworkListsForArtwork, MutationConfig } from "./useUpdateArtworkListsForArtwork"

interface Options {
  onCompleted?: MutationConfig["onCompleted"]
  onError?: MutationConfig["onError"]
}

export const useSaveArtworkListsChanges = (options?: Options) => {
  const { artwork, addingArtworkListIDs, removingArtworkListIDs } = ArtworkListsStore.useStoreState(
    (state) => ({
      artwork: state.state.artwork,
      addingArtworkListIDs: state.addingArtworkListIDs,
      removingArtworkListIDs: state.removingArtworkListIDs,
    })
  )
  const { handleToastMessage } = useArtworkListsModifiedToastHandler()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const [commit, inProgress] = useUpdateArtworkListsForArtwork(artwork?.id ?? "")

  const trackAddedArtworkToArtworkLists = () => {
    const event: AddedArtworkToArtworkList = {
      action: ActionType.addedArtworkToArtworkList,
      context_owner_id: analytics.contextScreenOwnerId,
      context_owner_slug: analytics.contextScreenOwnerSlug,
      context_owner_type: analytics.contextScreenOwnerType || OwnerType.artwork,
      artwork_ids: [artwork?.internalID ?? ""],
      owner_ids: addingArtworkListIDs,
    }

    trackEvent(event)
  }

  const save = useCallback(() => {
    if (!artwork) {
      return
    }

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

        handleToastMessage()

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
  }, [artwork?.internalID, addingArtworkListIDs, removingArtworkListIDs, handleToastMessage])

  return {
    save,
    inProgress,
  }
}
