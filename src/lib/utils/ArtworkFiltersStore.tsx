import { filter, find, unionBy } from "lodash"
import React, { createContext, Dispatch, Reducer, useContext, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  applyFilters: false,
}

export const reducer = (
  artworkFilterState: ArtworkFilterContextState,
  action: FilterActions
): ArtworkFilterContextState => {
  switch (action.type) {
    case "applyFilters":
      const filtersToApply = unionBy(
        artworkFilterState.selectedFilters,
        artworkFilterState.appliedFilters,
        "filterType"
      )

      // Remove default values as those are accounted for when we make the API request.
      const appliedFilters = filter(filtersToApply, ({ filterType, value }) => {
        return defaultFilterOptions[filterType] !== value
      })

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
      }

    case "selectFilters":
      // First we update our potential "selectedFilters" based on the option that was selected in the UI
      const filtersToSelect = unionBy([action.payload], artworkFilterState.selectedFilters, "filterType")

      // Then we have to remove any "invalid" choices.
      const selectedFilters = filter(filtersToSelect, ({ filterType, value }) => {
        const appliedFilter = find(artworkFilterState.appliedFilters, option => option.filterType === filterType)

        // Don't re-select options that have already been applied.
        // In the case where the option hasn't been applied, remove the option if it is the default.
        if (!appliedFilter) {
          return defaultFilterOptions[filterType] !== value
        }

        if (appliedFilter.value === value) {
          return false
        }

        return true
      })

      return {
        applyFilters: false,
        selectedFilters,
        appliedFilters: artworkFilterState.appliedFilters,
      }

    case "resetFilters":
      return { applyFilters: false, appliedFilters: [], selectedFilters: [] }
  }
}

const defaultFilterOptions = {
  sort: "Default",
}

export const useSelectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)

  const defaultFilters: FilterArray = [{ filterType: "sort", value: "Default" }]

  return unionBy(state.selectedFilters, state.appliedFilters, defaultFilters, "filterType")
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null)

export const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(reducer, filterState)

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

export interface ArtworkFilterContextState {
  readonly appliedFilters: FilterArray
  readonly selectedFilters: FilterArray
  readonly applyFilters: boolean
}

interface FilterData {
  readonly value: SortOption
  readonly filterType: FilterOption
}
export type FilterArray = ReadonlyArray<FilterData>

interface ResetFilters {
  type: "resetFilters"
}

interface ApplyFilters {
  type: "applyFilters"
}

interface SelectFilters {
  type: "selectFilters"
  payload: FilterData
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

export type FilterOption = "sort"
