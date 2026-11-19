import { ActionType, AddedArtworkToArtworkList, OwnerType } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { useOnSaveArtworkLists } from "app/Components/ArtworkLists/useOnSaveArtworkLists"
import { GlobalStore } from "app/store/GlobalStore"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useCallback } from "react"
import { useTracking } from "react-tracking"
import { useUpdateArtworkListsForArtwork, MutationConfig } from "./useUpdateArtworkListsForArtwork"

interface Options {
  onCompleted?: MutationConfig["onCompleted"]
  onError?: MutationConfig["onError"]
}

export const useSaveArtworkListsChanges = (options?: Options) => {
  const { artwork, addingArtworkLists, addingArtworkListIDs, removingArtworkListIDs } =
    ArtworkListsStore.useStoreState((state) => ({
      artwork: state.state.artwork,
      addingArtworkLists: state.state.addingArtworkLists,
      addingArtworkListIDs: state.addingArtworkListIDs,
      removingArtworkListIDs: state.removingArtworkListIDs,
    }))
  const { onSaveArtworkLists } = useOnSaveArtworkLists()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const isLastSavedListEnabled = useFeatureFlag("ARDefaultToLastSavedList")
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

          if (isLastSavedListEnabled) {
            const lastAdded = addingArtworkLists[addingArtworkLists.length - 1]
            const added =
              args[0].artworksCollectionsBatchUpdate?.responseOrError?.addedToArtworkLists
            const isDefault = !!added?.find((list) => list?.internalID === lastAdded.internalID)
              ?.default

            GlobalStore.actions.lastSavedList.setLastSavedList({
              internalID: lastAdded.internalID,
              name: lastAdded.name,
              default: isDefault,
            })
          }
        }

        onSaveArtworkLists()

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
  }, [
    artwork?.internalID,
    addingArtworkLists,
    addingArtworkListIDs,
    removingArtworkListIDs,
    onSaveArtworkLists,
    isLastSavedListEnabled,
  ])

  return {
    save,
    inProgress,
  }
}
