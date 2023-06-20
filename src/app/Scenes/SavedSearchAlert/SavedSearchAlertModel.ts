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
}

export interface EditSavedSearchAlertParams {
  userAlertSettings?: {
    name: string | null
    email: boolean
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
}

export interface SavedSearchPill {
  label: string
  value: string | boolean | number
  paramName: SearchCriteria
}
