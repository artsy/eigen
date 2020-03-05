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
          const selectedFilter: Array<{ type: SortOption; filter: FilterOption }> = []

          if (isFilterAlreadySelected) {
            const mergedFilters = [...previouslySelectedFilters, currentlySelectedFilter]
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

export interface ArtworkFilterContextState {
  readonly appliedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly selectedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly selectedSortOption: SortOption
}

interface ResetFilters {
  type: "resetFilters"
}

interface ApplyFilters {
  type: "applyFilters"
  payload: Array<{ type: SortOption; filter: FilterOption }>
}

interface SelectFilters {
  type: "selectFilters"
  payload: { type: SortOption; filter: FilterOption }
}

export type FilterActions = ResetFilters | ApplyFilters | SelectFilters

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}

export type SortOption =
  | "Default"
  | "Price (low to high)"
  | "Price (high to low)"
  | "Recently updated"
  | "Recently added"
  | "Artwork year (descending)"
  | "Artwork year (ascending)"

export type FilterOption = "sort" | "medium" | "waysToBuy" | "priceRange" | "size" | "color" | "timePeriod"
