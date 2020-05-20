import {
  FilterOption,
  MediumOption,
  PriceRangeOption,
  SortOption,
  TimePeriodOption,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { filter, find, pullAllBy, union, unionBy } from "lodash"
import React, { createContext, Dispatch, Reducer, useContext, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
}

export const reducer = (
  artworkFilterState: ArtworkFilterContextState,
  action: FilterActions
): ArtworkFilterContextState => {
  switch (action.type) {
    case "applyFilters":
      let multiOptionFilters = unionBy(
        artworkFilterState.selectedFilters,
        artworkFilterState.previouslyAppliedFilters,
        "filterType"
      )

      multiOptionFilters = multiOptionFilters.filter(f => f.value === true)

      // get all filter options excluding ways to buy filter types and replace previously applied options with currently selected options
      const singleOptionFilters = unionBy(
        pullAllBy(
          [...artworkFilterState.selectedFilters, ...artworkFilterState.previouslyAppliedFilters],
          multiOptionFilters,
          "value"
        ),
        "filterType"
      )

      const filtersToApply = union([...singleOptionFilters, ...multiOptionFilters])

      // Remove default values as those are accounted for when we make the API request.
      const appliedFilters = filter(filtersToApply, ({ filterType, value }) => {
        return defaultFilterOptions[filterType] !== value
      })

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: appliedFilters,
      }

    // First we update our potential "selectedFilters" based on the option that was selected in the UI
    case "selectFilters":
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
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
      }

    case "clearAll":
      return {
        applyFilters: false,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: [],
      }

    case "resetFilters":
      // We call this when we need to re-set to our initial state. Since previouslyAppliedFilters
      // is only used while in the filter modal, when we close out we need to re-set that back
      // to equal appliedFilters.
      return {
        applyFilters: false,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: artworkFilterState.appliedFilters,
      }

    case "clearFiltersZeroState":
      // We call this when a user has filtered artworks and the result returns 0 artworks.
      return {
        appliedFilters: [],
        selectedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: true,
      }
  }
}

const defaultFilterOptions = {
  sort: "Default",
  medium: "All",
  priceRange: "All",
  majorPeriods: "All",
  waysToBuyBuy: false,
  waysToBuyInquire: false,
  waysToBuyMakeOffer: false,
  waysToBuyBid: false,
}

export const useSelectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)

  const defaultFilters: FilterArray = [
    { filterType: "sort", value: "Default" },
    { filterType: "medium", value: "All" },
    { filterType: "priceRange", value: "All" },
    { filterType: "majorPeriods", value: "All" },
    { filterType: "waysToBuyBuy", value: false },
    { filterType: "waysToBuyInquire", value: false },
    { filterType: "waysToBuyMakeOffer", value: false },
    { filterType: "waysToBuyBid", value: false },
  ]

  return unionBy(state.selectedFilters, state.previouslyAppliedFilters, defaultFilters, "filterType")
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null as any /* STRICTNESS_MIGRATION */)

export const ArtworkFilterGlobalStateProvider = ({ children }: any /* STRICTNESS_MIGRATION */) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(reducer, filterState)

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

export interface ArtworkFilterContextState {
  readonly appliedFilters: FilterArray
  readonly selectedFilters: FilterArray
  readonly previouslyAppliedFilters: FilterArray
  readonly applyFilters: boolean
}

export interface FilterData {
  readonly value: SortOption | MediumOption | PriceRangeOption | TimePeriodOption | boolean
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

interface ClearAllFilters {
  type: "clearAll"
}

interface ClearFiltersZeroState {
  type: "clearFiltersZeroState"
}

export type FilterActions = ResetFilters | ApplyFilters | SelectFilters | ClearAllFilters | ClearFiltersZeroState

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}
