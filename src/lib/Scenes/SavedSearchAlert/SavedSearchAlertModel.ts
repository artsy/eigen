import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
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
// tslint:disable-next-line:interface-over-type-literal
export type CreateSavedSearchAlertNavigationStack = {
  CreateSavedSearchAlert: CreateSavedSearchAlertParams
  EmailPreferences: undefined
}
