import { ActionType, OwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { navigate, NavigateOptions } from "lib/navigation/navigate"
import { useEnableMyCollection } from "lib/Scenes/MyCollection/MyCollection"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchAlertParams,
  SavedSearchAlertMutationResult,
} from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import React from "react"
import { useTracking } from "react-tracking"

export interface CreateSavedSearchModalProps {
  visible: boolean
  artistId: string
  artistName: string
  artistSlug: string
  closeModal: () => void
  onComplete?: () => void
}

export const CreateSavedSearchModal: React.FC<CreateSavedSearchModalProps> = (props) => {
  const { visible, artistId, artistName, artistSlug, closeModal, onComplete } = props
  const tracking = useTracking()
  const popover = usePopoverMessage()
  const shouldDisplayMyCollection = useEnableMyCollection()

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    tracking.trackEvent(tracks.toggleSavedSearch(true, artistId, artistSlug, result.id))
    closeModal()
    onComplete?.()

    popover.show({
      title: "Your alert has been created.",
      message: "You can edit your alerts with your Profile.",
      onPress: async () => {
        const options: NavigateOptions = {
          popToRootTabView: true,
          showInTabName: "profile",
        }

        if (shouldDisplayMyCollection) {
          await navigate("/my-profile/settings", options)
          setTimeout(() => {
            navigate("/my-profile/saved-search-alerts")
          }, 100)

          return
        }

        navigate("/my-profile/saved-search-alerts", options)
      },
    })
  }

  const params: CreateSavedSearchAlertParams = {
    artistId,
    artistName,
    onClosePress: closeModal,
    onComplete: handleComplete,
  }

  return <CreateSavedSearchAlert visible={visible} params={params} />
}

export const tracks = {
  toggleSavedSearch: (
    enabled: boolean,
    artistId: string,
    artistSlug: string,
    searchCriteriaId: string
  ): ToggledSavedSearch => ({
    action: ActionType.toggledSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    modified: enabled,
    original: !enabled,
    search_criteria_id: searchCriteriaId,
  }),
}
