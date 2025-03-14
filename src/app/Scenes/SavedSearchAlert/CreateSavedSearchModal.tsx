import { ActionType, ScreenOwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchAlertParams,
  SavedSearchAlertMutationResult,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { useTracking } from "react-tracking"

export interface CreateSavedSearchModalProps {
  attributes: SearchCriteriaAttributes
  closeModal: () => void
  currentArtworkID?: string
  entity: SavedSearchEntity
  onComplete?: () => void
  sizeMetric?: "cm" | "in" | undefined
  visible: boolean
}

export const CreateSavedSearchModal: React.FC<CreateSavedSearchModalProps> = (props) => {
  const { attributes, closeModal, currentArtworkID, entity, onComplete, sizeMetric, visible } =
    props
  const tracking = useTracking()

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    const { owner } = entity

    if (!result.searchCriteriaID) {
      return
    }

    tracking.trackEvent(
      tracks.toggleSavedSearch(true, owner.type, owner.id, owner.slug, result.searchCriteriaID)
    )
  }

  const params: CreateSavedSearchAlertParams = {
    attributes,
    entity,
    currentArtworkID,
    onClosePress: () => {
      onComplete?.() // close the filter modal stack (if coming from artist artwork grid)
      closeModal() // close the alert modal stack
    },
    onComplete: handleComplete,
    sizeMetric,
  }

  if (!visible) return null

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
