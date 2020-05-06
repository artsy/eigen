import {
  FilterOption,
  MediumOption,
  PriceRangeOption,
  SortOption,
  WaysToBuyOptions,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { filter, find, union, unionBy } from "lodash"
import React, { createContext, Dispatch, Reducer, useContext, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  filterToggleState: {
    on: [],
    off: ["Buy now", "Make offer", "Bid", "Inquire"],
  },
  shouldUnapplyFilters: false,
  filtersToUnApply: null,
}

export const reducer = (
  artworkFilterState: ArtworkFilterContextState,
  action: FilterActions
): ArtworkFilterContextState => {
  switch (action.type) {
    case "applyFilters":
      /** Because some filters can have mulitiple selections, e.g. "waysToBuy",
       *  we should not de-duplicate them as we do with single selection filters.
       *  First, extract the multiple selection filters into their own array
       *  so they are not de-duplicated in the filtersToApply function below.
       */
      const multiOptionAppliedFilters: FilterData[] = [
        ...artworkFilterState.selectedFilters,
        ...artworkFilterState.previouslyAppliedFilters,
      ].filter(f => f.filterType === "waysToBuy")

      let filtersToApply = unionBy(
        artworkFilterState.selectedFilters,
        artworkFilterState.previouslyAppliedFilters,
        "filterType"
      )

      // merge the single selection filters with the multiple selection filters and remove any duplicates
      filtersToApply = union([...filtersToApply, ...multiOptionAppliedFilters])

      // Remove default values as those are accounted for when we make the API request.
      const appliedFilters = filter(filtersToApply, ({ filterType, value }) => {
        return defaultFilterOptions[filterType] !== value
      })

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: appliedFilters,
        filterToggleState: artworkFilterState.filterToggleState,
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "selectFilters":
      // First we update our potential "selectedFilters" based on the option that was selected in the UI
      const multiOptionSelectedFilters = artworkFilterState.selectedFilters.filter(
        selectedFilter => selectedFilter.filterType === "waysToBuy"
      )
      let filtersToSelect = unionBy([action.payload], artworkFilterState.selectedFilters, "filterType")

      // we don't want to de-duplicate filter types that can have multiple selections e.g. "waysToBuy"
      // so we add multiple selection filters back to filtersToSelect array
      filtersToSelect = union(filtersToSelect, multiOptionSelectedFilters)

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
        filterToggleState: artworkFilterState.filterToggleState,
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "clearAll":
      return {
        applyFilters: false,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: [],
        filterToggleState: {
          on: [],
          off: ["Buy now", "Make offer", "Bid", "Inquire"],
        },
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
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
        filterToggleState: artworkFilterState.filterToggleState,
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "clearFiltersZeroState":
      // We call this when a user has filtered artworks and the result returns 0 artworks.
      return {
        appliedFilters: [],
        selectedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: true,
        filterToggleState: {
          on: [],
          off: ["Buy now", "Make offer", "Bid", "Inquire"],
        },
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "updateMultiSelectionToggle":
      const filterToggleState = {
        on: action.payload.on,
        off: action.payload.off,
      }

      return {
        applyFilters: artworkFilterState.applyFilters,
        selectedFilters: artworkFilterState.selectedFilters,
        appliedFilters: artworkFilterState.appliedFilters,
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
        filterToggleState,
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "unApplyFilters":
      const remainingPreviouslyAppliedFilters = artworkFilterState.previouslyAppliedFilters.filter(
        f => f.value !== artworkFilterState.filtersToUnApply?.value
      )
      const remainingAppliedFilters = artworkFilterState.appliedFilters.filter(
        f => f.value !== artworkFilterState.filtersToUnApply?.value
      )

      return {
        applyFilters: true,
        appliedFilters: remainingAppliedFilters,
        selectedFilters: artworkFilterState.selectedFilters,
        previouslyAppliedFilters: remainingPreviouslyAppliedFilters,
        filterToggleState: artworkFilterState.filterToggleState,
        shouldUnapplyFilters: false,
        filtersToUnApply: null,
      }

    case "shouldUnapplyFilters":
      return {
        applyFilters: false,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: artworkFilterState.selectedFilters,
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
        filterToggleState: artworkFilterState.filterToggleState,
        shouldUnapplyFilters: true,
        filtersToUnApply: action.payload,
      }
  }
}

const defaultFilterOptions = {
  sort: "Default",
  medium: "All",
  priceRange: "All",
  waysToBuy: "All",
}

export const useSelectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)

  const defaultFilters: FilterArray = [
    { filterType: "sort", value: "Default" },
    { filterType: "medium", value: "All" },
    { filterType: "priceRange", value: "All" },
    { filterType: "waysToBuy", value: "All" },
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
  readonly filterToggleState: {
    on: WaysToBuyOptions[]
    off: WaysToBuyOptions[]
  }
  readonly shouldUnapplyFilters: boolean
  readonly filtersToUnApply: FilterData | null
}

interface FilterData {
  readonly value: SortOption | MediumOption | PriceRangeOption | WaysToBuyOptions
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

interface UpdateMultiSelectionToggle {
  type: "updateMultiSelectionToggle"
  payload: {
    on: WaysToBuyOptions[]
    off: WaysToBuyOptions[]
  }
}

interface UnApplyFilters {
  type: "unApplyFilters"
}

interface ShouldUnApplyFilters {
  type: "shouldUnapplyFilters"
  payload: FilterData
}

export type FilterActions =
  | ResetFilters
  | ApplyFilters
  | SelectFilters
  | ClearAllFilters
  | ClearFiltersZeroState
  | UpdateMultiSelectionToggle
  | UnApplyFilters
  | ShouldUnApplyFilters

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}
