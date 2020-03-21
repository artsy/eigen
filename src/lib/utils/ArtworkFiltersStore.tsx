import { differenceWith, filter, some, union } from "lodash"
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
  let sanitizeFilters = []

  switch (action.type) {
    case "applyFilters":
      const previouslyAppliedFilters = artworkFilterState.appliedFilters

      // if a filter is applied for the first time update state with the newly applied filter
      if (previouslyAppliedFilters.length < 1) {
        return {
          applyFilters: true,
          appliedFilters: action.payload,
          selectedFilters: [],
        }
      }

      // otherwise remove filters that can only be selected once, e.g. "sort" and merge those with newly applied filters
      const payloadFilters = action.payload
      sanitizeFilters = filter(previouslyAppliedFilters, prop => prop.filterType === "sort")
      const appliedFilters = union(differenceWith(previouslyAppliedFilters, sanitizeFilters), payloadFilters)

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
      }

    case "selectFilters":
      const previouslySelectedFilters = artworkFilterState.selectedFilters
      const currentlySelectedFilter = action.payload
      const isFilterAlreadySelected = some(previouslySelectedFilters, currentlySelectedFilter)
      const selectedFilter: Array<{ value: SortOption; filterType: FilterOption }> = []
      const filtersApplied = artworkFilterState.appliedFilters

      if (isFilterAlreadySelected) {
        const mergedFilters = [...previouslySelectedFilters, currentlySelectedFilter]

        return {
          applyFilters: false,
          selectedFilters: mergedFilters,
          appliedFilters: filtersApplied,
        }
      } else {
        selectedFilter.push(currentlySelectedFilter)

        return {
          applyFilters: false,
          selectedFilters: selectedFilter,
          appliedFilters: filtersApplied,
        }
      }
    case "resetFilters":
      return { applyFilters: false, appliedFilters: [], selectedFilters: [] }
  }
}

const defaultFilterOptions = {
  sort: "Default",
}

export const selectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)

  const allFilterOptions: FilterOption[] = ["sort"]

  return allFilterOptions.map(item => {
    const defaultOptionValue = defaultFilterOptions[item]
    const defaultOption = { filterType: item, value: defaultOptionValue }
    const selected = state.selectedFilters.find(option => option.filterType === defaultOption.filterType)
    const applied = state.appliedFilters.find(option => option.filterType === defaultOption.filterType)

    return Object.assign(defaultOption, applied, selected)
  })
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
  payload: FilterArray
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
