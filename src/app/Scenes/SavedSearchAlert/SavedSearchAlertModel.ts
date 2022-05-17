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
// tslint:disable-next-line:interface-over-type-literal
export type CreateSavedSearchAlertNavigationStack = {
  CreateSavedSearchAlert: CreateSavedSearchAlertParams
  EmailPreferences: undefined
}

export interface SavedSearchPill {
  label: string
  value: string | boolean | number
  paramName: SearchCriteria
}
