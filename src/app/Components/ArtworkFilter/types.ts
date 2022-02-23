import { FilterConfigTypes } from "."
import { ArtworkFilterNavigationStack } from "./ArtworkFilterNavigator"

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
  | "sort"
  | "viewAs"
  | "waysToBuy"
  | "year"

// Please add other filter screen item that uses a checkbox as right accessory item here
export type FilterScreenCheckboxItem = "showOnlySubmittedArtworks"

export interface FilterDisplayConfig {
  configType?: FilterConfigTypes // optional to specify whether the FilterDisplayConfig is FilterScreen or FilterScreenCheckboxItem or others to come
  filterType: FilterScreen | FilterScreenCheckboxItem
  displayText: string
  ScreenComponent: keyof ArtworkFilterNavigationStack

  // for `local` filtering
  values?: any[]
  localSortAndFilter?: (items: any[], value?: any) => any[]
}
