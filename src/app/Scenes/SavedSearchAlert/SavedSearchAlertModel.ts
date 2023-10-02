import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"

export interface SavedSearchAlertFormValues {
  name: string
  push: boolean
  email: boolean
}

export interface SavedSearchAlertMutationResult {
  id: string
}

// Navigation
export interface CreateSavedSearchAlertParams {
  aggregations: Aggregations
  attributes: SearchCriteriaAttributes
  entity: SavedSearchEntity
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
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
}

export interface EditSavedSearchAlertParams {
  userAlertSettings?: {
    email: boolean
    name?: string | null
    push: boolean
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
}

export interface SavedSearchPill {
  label: string
  value: string | boolean | number
  paramName: SearchCriteria
}

export interface ConfirmationScreenParams {
  searchCriteriaID: string
  closeModal?: () => void
}
