import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"

export interface SavedSearchAlertFormValues {
  name: string
  push: boolean
  email: boolean
}

export interface SavedSearchAlertFormPropsBase {
  filters: FilterData[]
  aggregations: Aggregations
  artistId: string
  artistName: string
  isLoading?: boolean
  isPreviouslySaved?: boolean
}

export interface SavedSearchAlertMutationResult {
  id: string
}

// Navigation
export interface CreateSavedSearchAlertParams extends SavedSearchAlertFormPropsBase {
  me?: SavedSearchButton_me | null
  filters: FilterData[]
  aggregations: Aggregations
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

export interface CreateSavedSearchAlertProps {
  visible: boolean
  params: CreateSavedSearchAlertParams
}

// This needs to be a `type` rather than an `interface`
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CreateSavedSearchAlertNavigationStack = {
  CreateSavedSearchAlert: CreateSavedSearchAlertParams
  EmailPreferences: undefined
}

export interface SavedSearchPill {
  label: string
  value: string | boolean | number
  paramName: FilterParamName
}
