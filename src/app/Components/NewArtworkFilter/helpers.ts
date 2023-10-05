import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { isEqual } from "lodash"

export enum NewFilterParamName {
  artistIDs = "artistIDs",
  attributionClass = "rarity",
  categories = "categories",
}

export type NewFilterData =
  | {
      paramName: NewFilterParamName.artistIDs
      paramValue: {
        value: string
        displayLabel: string
      }
    }
  | {
      paramName: NewFilterParamName.attributionClass
      paramValue: {
        value: string
        displayLabel: string
      }
    }
  | {
      paramName: NewFilterParamName.categories
      paramValue: {
        value: string
        displayLabel: string
      }
    }

export const paramNameToDisplayLabelMap = {
  attributionClass: "Rarity",
  categories: "Categories",
}

// A hook that returns the applied filters for a given paramName
export const useSelectedFiltersByParamName = (paramName: NewFilterParamName) => {
  const selectedFilters = NewArtworksFiltersStore.useStoreState((state) => state.selectedFilters)

  return selectedFilters.filter((filter) => filter.paramName === paramName)
}

export const isFilterSelected = (
  selectedFilters: NewFilterData[],
  filterValue: NewFilterData["paramValue"]
) => {
  if (selectedFilters.find((selectedFilter) => isEqual(selectedFilter.paramValue, filterValue))) {
    return true
  }
  return false
}
