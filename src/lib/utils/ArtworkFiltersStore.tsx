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
      sanitizeFilters = filter(previouslyAppliedFilters, prop => prop.filter === "sort")
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
      const selectedFilter: Array<{ type: SortOption; filter: FilterOption }> = []
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

export const selectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)
  const defaultOptions = [{ filter: "sort", type: "Default" }]

  return defaultOptions.map(defaultOption => {
    const selected = state.selectedFilters.find(option => option.filter === defaultOption.filter)
    const applied = state.appliedFilters.find(option => option.filter === defaultOption.filter)

    return Object.assign(defaultOption, applied, selected)
  })
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null)

export const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(reducer, filterState)

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

export interface ArtworkFilterContextState {
  readonly appliedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly selectedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly applyFilters: boolean
}

export type FilterArray = ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>

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

export type FilterOption = "sort"
