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
