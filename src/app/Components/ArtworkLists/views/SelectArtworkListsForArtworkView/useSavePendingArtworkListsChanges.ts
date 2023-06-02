import { ActionType, AddedArtworkToArtworkList } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useUpdateArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useTracking } from "react-tracking"

export const useSavePendingArtworkListsChanges = () => {
  const { state, addingArtworkListIDs, removingArtworkListIDs } = useArtworkListsContext()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const artwork = state.artwork!
  const [commit, inProgress] = useUpdateArtworkListsForArtwork(artwork.id)

  const trackAddedArtworkToArtworkLists = () => {
    const event: AddedArtworkToArtworkList = {
      action: ActionType.addedArtworkToArtworkList,
      context_owner_id: analytics.contextScreenOwnerId,
      context_owner_slug: analytics.contextScreenOwnerSlug,
      context_owner_type: analytics.contextScreenOwnerType!,
      artwork_ids: [artwork.internalID],
      owner_ids: addingArtworkListIDs,
    }

    trackEvent(event)
  }

  const save = () => {
    return new Promise((resolve, reject) => {
      commit({
        variables: {
          artworkID: artwork.internalID,
          input: {
            artworkIDs: [artwork.internalID],
            addToCollectionIDs: addingArtworkListIDs,
            removeFromCollectionIDs: removingArtworkListIDs,
          },
        },
        onCompleted: (data) => {
          if (addingArtworkListIDs.length > 0) {
            trackAddedArtworkToArtworkLists()
          }

          resolve(data)
        },
        onError: (error) => {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error?.stack!)
          }

          reject(error)
        },
      })
    })
  }

  return {
    save,
    inProgress,
  }
}
