import { ActionType, ScreenOwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { navigate, NavigateOptions } from "app/navigation/navigate"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchAlertParams,
  SavedSearchAlertMutationResult,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import React from "react"
import { useTracking } from "react-tracking"

export interface CreateSavedSearchModalProps {
  visible: boolean
  entity: SavedSearchEntity
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
  closeModal: () => void
  onComplete?: () => void
}

export const CreateSavedSearchModal: React.FC<CreateSavedSearchModalProps> = (props) => {
  const { visible, entity, attributes, aggregations, closeModal, onComplete } = props
  const tracking = useTracking()
  const popover = usePopoverMessage()

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    const { owner } = entity

    tracking.trackEvent(tracks.toggleSavedSearch(true, owner.type, owner.id, owner.slug, result.id))
    closeModal()
    onComplete?.()

    popover.show({
      title: "Your alert has been created.",
      message: "Edit your alerts in your profile, in Settings.",
      onPress: async () => {
        const options: NavigateOptions = {
          popToRootTabView: true,
          showInTabName: "profile",
        }

        await navigate("/my-profile/settings", options)
        setTimeout(() => {
          navigate("/my-profile/saved-search-alerts")
        }, 100)
      },
    })
  }

  const params: CreateSavedSearchAlertParams = {
    aggregations,
    attributes,
    entity,
    onClosePress: closeModal,
    onComplete: handleComplete,
  }

  return <CreateSavedSearchAlert visible={visible} params={params} />
}

export const tracks = {
  toggleSavedSearch: (
    enabled: boolean,
    ownerType: ScreenOwnerType,
    artistId: string,
    artistSlug: string,
    searchCriteriaId: string
  ): ToggledSavedSearch => ({
    action: ActionType.toggledSavedSearch,
    context_screen_owner_type: ownerType,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    modified: enabled,
    original: !enabled,
    search_criteria_id: searchCriteriaId,
  }),
}
