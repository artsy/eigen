import { FunctionComponent } from "react"
import { ArtworkFilterNavigationStack } from "./ArtworkFilterNavigator"
import { ArtworkFilterOptionItemProps } from "./components/ArtworkFilterOptionItem"

export type FilterScreen =
  | "additionalGeneIDs"
  | "artistIDs"
  | "artistNationalities"
  | "artistsIFollow"
  | "attributionClass"
  | "categories"
  | "color"
  | "colors"
  | "estimateRange"
  | "locationCities"
  | "majorPeriods"
  | "materialsTerms"
  | "medium"
  | "partnerIDs"
  | "priceRange"
  | "organizations"
  | "sizes"
  | "showOnlySubmittedArtworks"
  | "sort"
  | "viewAs"
  | "waysToBuy"
  | "year"

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: keyof ArtworkFilterNavigationStack
  RightAccessoryItem?: FunctionComponent<ArtworkFilterOptionItemProps>

  // for `local` filtering
  values?: any[]
  localSortAndFilter?: (items: any[], value?: any) => any[]
}
