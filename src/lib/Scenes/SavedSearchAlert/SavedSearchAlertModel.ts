import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"

export interface SavedSearchAlertFormValues {
  name: string
  enablePushNotifications: boolean
  enableEmailNotifications: boolean
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
