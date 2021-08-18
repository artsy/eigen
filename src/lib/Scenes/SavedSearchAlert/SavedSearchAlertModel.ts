import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"

export interface SavedSearchAlertFormValues {
  name: string
}

export interface SavedSearchArtistProp {
  artist: {
    id: string
    name: string
    slug: string
  }
}

export interface SavedSearchAlertFormPropsBase extends SavedSearchArtistProp {
  filters: FilterData[]
  aggregations: Aggregations
}
