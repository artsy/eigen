import { ArtworkFilterNavigationStack } from "./ArtworkFilter"

export type FilterScreen =
  | "additionalGeneIDs"
  | "artistIDs"
  | "artistNationalities"
  | "artistsIFollow"
  | "attributionClass"
  | "categories"
  | "color"
  | "colors"
  | "dimensionRange"
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

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: keyof ArtworkFilterNavigationStack
}
