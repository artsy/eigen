import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"

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
}

export interface SavedSearchAlertMutationResult {
  id: string
}

// TODO: When AREnableSavedSearchToggles is released then we can use SavedSearchAlertFormValues instead
export interface SavedSearchAlertUserAlertSettings {
  name: string
  email?: boolean
  push?: boolean
}

// Navigation
export interface CreateSavedSearchAlertScreenProps extends SavedSearchAlertFormPropsBase {
  filters: FilterData[]
  aggregations: Aggregations
  userAllowsEmails: boolean
  refetch: () => void
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

export interface CreateSavedSearchAlertProps extends CreateSavedSearchAlertScreenProps {
  visible: boolean
}

// This needs to be a `type` rather than an `interface`
// tslint:disable-next-line:interface-over-type-literal
export type CreateSavedSearchAlertNavigationStack = {
  CreateSavedSearchAlert: CreateSavedSearchAlertProps
  EmailPreferences: undefined
}
