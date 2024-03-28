import {
  SavedSearchEntity,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"

export interface SavedSearchAlertFormValues {
  name: string
  push: boolean
  email: boolean
  details?: string
}

export interface SavedSearchAlertMutationResult {
  id?: string
  searchCriteriaID?: string
}

// Navigation
export interface CreateSavedSearchAlertParams {
  attributes: SearchCriteriaAttributes
  entity: SavedSearchEntity
  currentArtworkID?: string
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
  sizeMetric?: "cm" | "in" | undefined
}

export interface CreateSavedSearchAlertProps {
  visible: boolean
  params: CreateSavedSearchAlertParams
}

// This needs to be a `type` rather than an `interface`

export type CreateSavedSearchAlertNavigationStack = {
  CreateSavedSearchAlert: CreateSavedSearchAlertParams
  AlertPriceRange: undefined
  EmailPreferences: undefined
  ConfirmationScreen: ConfirmationScreenParams
  SavedSearchFilterScreen: undefined
}

export interface EditSavedSearchAlertParams {
  userAlertSettings?: {
    email: boolean
    name?: string | null
    push: boolean
    details?: string | null
  }
  savedSearchAlertId?: string
  userAllowsEmails: boolean
  onComplete?: (result: SavedSearchAlertMutationResult) => void
  onDeleteComplete?: () => void
}

export type EditSavedSearchAlertNavigationStack = {
  EditSavedSearchAlertContent: EditSavedSearchAlertParams
  AlertPriceRange: undefined
  EmailPreferences: undefined
  ConfirmationScreen: ConfirmationScreenParams
  SavedSearchFilterScreen: undefined
  AlertArtworks: AlertArtworksParams
}

export interface SavedSearchPill {
  label: string
  value: string | boolean | number
  paramName: SearchCriteria
}

export interface ConfirmationScreenParams {
  alertID?: string
  searchCriteriaID?: string
  closeModal?: () => void
}

interface AlertArtworksParams {
  alertId: string
}
