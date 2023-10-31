import { ArtworkFilterNavigationStack } from "./ArtworkFilterNavigator"

export type FilterScreen =
  | "additionalGeneIDs"
  | "artistIDs"
  | "artistNationalities"
  | "artistsIFollow"
  | "artistSeriesIDs"
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
export type FilterScreenCheckboxItem = "showOnlySubmittedArtworks" | "state"
type FilterScreenViewOptions = "viewAs"

export interface FilterDisplayConfig {
  configType?: FilterConfigTypes // optional to specify whether the FilterDisplayConfig is FilterScreen or FilterScreenCheckboxItem or others to come
  filterType: FilterScreen | FilterScreenCheckboxItem | FilterScreenViewOptions
  displayText: string
  ScreenComponent: keyof ArtworkFilterNavigationStack | "none"
  // for `local` filtering
  values?: any[]
  localSortAndFilter?: (items: any[], value?: any) => any[]
}

export enum FilterConfigTypes {
  FilterScreen = "FilterScreen",
  FilterScreenCheckboxItem = "FilterScreenCheckboxItem",
  FilterScreenViewOptions = "FilterScreenViewOptions",
}
