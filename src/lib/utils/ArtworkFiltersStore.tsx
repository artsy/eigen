import { some, union } from "lodash"
import React, { createContext, Dispatch, Reducer, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  selectedSortOption: "Default",
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null)

export const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(
    (artworkFilterState, action) => {
      switch (action.type) {
        case "applyFilters":
          const previouslyAppliedFilters = artworkFilterState.appliedFilters
          const filtersToApply = action.payload
          const appliedFilters = union(previouslyAppliedFilters, filtersToApply)
          return { appliedFilters, selectedFilters: [], selectedSortOption: artworkFilterState.selectedSortOption }

        case "selectFilters":
          const previouslySelectedFilters = artworkFilterState.selectedFilters
          const currentlySelectedFilter = action.payload
          const isFilterAlreadySelected = some(previouslySelectedFilters, currentlySelectedFilter)
          const selectedFilter: Array<{ type: SortOptions; filter: FilterOptions }> = []

          if (isFilterAlreadySelected) {
            const mergedFilters = previouslySelectedFilters.push(currentlySelectedFilter)
            return {
              selectedFilters: mergedFilters,
              appliedFilters: filterState.appliedFilters,
              selectedSortOption: currentlySelectedFilter.type,
            }
          } else {
            selectedFilter.push(currentlySelectedFilter)
            return {
              selectedFilters: selectedFilter,
              appliedFilters: filterState.appliedFilters,
              selectedSortOption: currentlySelectedFilter.type,
            }
          }
        case "resetFilters":
          return { appliedFilters: [], selectedFilters: [], selectedSortOption: "Default" }
      }
    },
    filterState
  )

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

interface ArtworkFilterContextState {
  appliedFilters: Array<{ type: SortOptions; filter: FilterOptions }>
  selectedFilters: Array<{ type: SortOptions; filter: FilterOptions }>
  selectedSortOption: SortOptions
}

interface ResetFilters {
  type: "resetFilters"
}

interface ApplyFilters {
  type: "applyFilters"
  payload: Array<{ type: SortOptions; filter: FilterOptions }>
}

interface SelectFilters {
  type: "selectFilters"
  payload: { type: SortOptions; filter: FilterOptions }
}

type FilterActions = ResetFilters | ApplyFilters | SelectFilters

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}

export type SortOptions =
  | "Default"
  | "Price (low to high)"
  | "Price (high to low)"
  | "Recently Updated"
  | "Recently Added"
  | "Artwork year (descending)"
  | "Artwork year (ascending)"

type FilterOptions = "sort" | "medium" | "waysToBuy" | "priceRange" | "size" | "color" | "timePeriod"
