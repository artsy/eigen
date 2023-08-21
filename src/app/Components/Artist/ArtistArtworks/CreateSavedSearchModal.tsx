import {
  ActionType,
  ContextModule,
  ScreenOwnerType,
  TappedCreateAlert,
  ToggledSavedSearch,
} from "@artsy/cohesion"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchAlertParams,
  SavedSearchAlertMutationResult,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { useEffect } from "react"
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

  useEffect(() => {
    if (visible) {
      const event = tracks.tappedCreateAlert({
        ownerId: entity?.owner.id!,
        ownerType: entity?.owner.type!,
        ownerSlug: entity?.owner.slug!,
      })

      tracking.trackEvent(event)
    }
  }, [visible])

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    const { owner } = entity
    tracking.trackEvent(tracks.toggleSavedSearch(true, owner.type, owner.id, owner.slug, result.id))
  }

  const params: CreateSavedSearchAlertParams = {
    aggregations,
    attributes,
    entity,
    onClosePress: () => {
      onComplete?.() // close the filter modal stack (if coming from artist artwork grid)
      closeModal() // close the alert modal stack
    },
    onComplete: handleComplete,
  }

  if (!visible) return null

  return <CreateSavedSearchAlert visible={visible} params={params} />
}

interface TappedCreateAlertOptions {
  ownerType: ScreenOwnerType
  ownerId: string
  ownerSlug: string
}

export const tracks = {
  tappedCreateAlert: ({
    ownerType,
    ownerId,
    ownerSlug,
  }: TappedCreateAlertOptions): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: ownerType,
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: ownerSlug,
    context_module: "ArtworkScreenHeader" as ContextModule,
  }),
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
