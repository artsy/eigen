import { Action, action } from "easy-peasy"
import { filter, find, pullAllBy, union, unionBy } from "lodash"
import {
  Aggregations,
  defaultCommonFilterOptions,
  FilterArray,
  FilterCounts,
  FilterData,
  FilterParamName,
  FilterType,
  getSortDefaultValueByFilterType,
} from "./FilterArtworksHelpers"

export interface ArtworkFiltersStore {
  appliedFilters: FilterArray
  selectedFilters: FilterArray
  previouslyAppliedFilters: FilterArray
  applyFilters: boolean
  aggregations: Aggregations
  filterType: FilterType
  counts: FilterCounts
  applyFiltersAction: Action<ArtworkFiltersStore>
  selectFiltersAction: Action<ArtworkFiltersStore, FilterData>
  clearAllAction: Action<ArtworkFiltersStore>
  resetFiltersAction: Action<ArtworkFiltersStore>
  clearFiltersZeroStateAction: Action<ArtworkFiltersStore>
  setAggregationsAction: Action<ArtworkFiltersStore, any>
  setFiltersCountAction: Action<ArtworkFiltersStore, FilterCounts>
  setFilterTypeAction: Action<ArtworkFiltersStore, FilterType>
  setInitialFilterStateAction: Action<ArtworkFiltersStore, FilterArray>
}

export const ArtworkFiltersStore: ArtworkFiltersStore = {
  /**
   * Store state
   */
  appliedFilters: [],
  selectedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: [],
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },

  /**
   * Store actions
   */
  applyFiltersAction: action((state) => {
    const defaultFilterOptions = {
      ...defaultCommonFilterOptions,
      sort: getSortDefaultValueByFilterType(state.filterType),
    }

    let multiOptionFilters = unionBy(state.previouslyAppliedFilters, state.selectedFilters, "paramName")

    multiOptionFilters = multiOptionFilters.filter((f) => f.paramValue === true)

    // get all filter options excluding ways to buy filter types and replace previously applied options with currently selected options
    const singleOptionFilters = unionBy(
      pullAllBy([...state.selectedFilters, ...state.previouslyAppliedFilters], multiOptionFilters, "paramValue"),
      ({ paramValue, paramName }) => {
        // We don't want to union the artistID params, as each entry corresponds to a
        // different artist that may be selected. Instead we de-dupe based on the paramValue.
        if (paramName === FilterParamName.artistIDs && state.filterType === "artwork") {
          return paramValue
        } else {
          return paramName
        }
      }
    )

    const filtersToApply = union([...singleOptionFilters, ...multiOptionFilters])

    // Remove default values as those are accounted for when we make the API request.
    const appliedFilters = filter(filtersToApply, ({ paramName, paramValue }) => {
      // This logic is specific to filters that allow for multiple options. Right now
      // it only applies to the artist filter, but this will likely change.
      if (paramName === FilterParamName.artistIDs && state.filterType === "artwork") {
        // See if we have an existing entry in previouslyAppliedFilters
        const hasExistingPreviouslyAppliedFilter = state.previouslyAppliedFilters.find(
          (previouslyAppliedFilter) =>
            paramName === previouslyAppliedFilter.paramName && paramValue === previouslyAppliedFilter.paramValue
        )

        const hasExistingSelectedAppliedFilter = state.selectedFilters.find(
          (selectedFilter) => paramName === selectedFilter.paramName && paramValue === selectedFilter.paramValue
        )

        // If so, it means that this filter had been previously applied and is now being de-selected.
        // We need it to exist in the "selectedFilters" array so that our counts, etc. are correct,
        // but it's technically de-selected.
        return !(hasExistingPreviouslyAppliedFilter && hasExistingSelectedAppliedFilter)
      }

      // The default sorting and lot ascending sorting at the saleArtwork filterType has the same paramValue
      // with a different displayText, we want to make sure that the user can still switch between the two.
      if (paramName === FilterParamName.sort && state.filterType === "saleArtwork") {
        return true
      }
      return defaultFilterOptions[paramName] !== paramValue
    })

    state.applyFilters = true
    state.appliedFilters = appliedFilters
    state.selectedFilters = []
    state.previouslyAppliedFilters = appliedFilters
  }),

  selectFiltersAction: action((state, payload) => {
    let filtersToSelect
    let removedOption = false

    const defaultFilterOptions = {
      ...defaultCommonFilterOptions,
      sort: getSortDefaultValueByFilterType(state.filterType),
    }

    // This logic is specific to filters that can have multiple options. Right now it only
    // applies to the artist filter, but this will likely change in the future.
    if (payload.paramName === FilterParamName.artistIDs && state.filterType === "artwork") {
      const filtersWithoutSelectedArtist = state.selectedFilters.filter(({ paramName, paramValue }) => {
        if (
          paramName === FilterParamName.artistIDs &&
          state.filterType === "artwork" &&
          paramValue === payload.paramValue
        ) {
          removedOption = true
          return false
        }
        return true
      })

      if (removedOption) {
        // An artist is "selected" when it is present in the selectedFilters array. To de-select,
        // we simply remove it from the array.
        filtersToSelect = filtersWithoutSelectedArtist
      } else {
        // If the artist was not already selected, then we add it to the array like normal.
        filtersToSelect = [...state.selectedFilters, payload]
      }
    } else {
      filtersToSelect = unionBy([payload], state.selectedFilters, "paramName")
    }

    // Then we have to remove any "invalid" choices.
    const selectedFilters = filter(filtersToSelect, ({ paramName, paramValue }) => {
      const appliedFilter = find(state.appliedFilters, (option) => option.paramName === paramName)

      // Don't re-select options that have already been applied unless it's for the default
      // In the case where the option hasn't been applied, remove the option if it is the default.
      if (!appliedFilter) {
        // We want to make sure that the selection changes at the sortsOptions screen when the
        // user changes between two sorting options that has the same paramValue. ie. from the
        // dafault sorting to the lot ascending sorting (-position)
        if (
          paramName === FilterParamName.sort &&
          state.filterType === "saleArtwork" &&
          defaultFilterOptions[paramName] === paramValue
        ) {
          return true
        }
        return defaultFilterOptions[paramName] !== paramValue
      }

      if (appliedFilter.paramValue === paramValue) {
        // Ignore this case when it's an artistID or when we are setting back the default sorting for saleArtworks
        return (
          (appliedFilter.paramName === FilterParamName.artistIDs && state.filterType === "artwork") ||
          (defaultFilterOptions[paramName] === appliedFilter.paramValue &&
            appliedFilter.paramName === FilterParamName.sort &&
            state.filterType === "saleArtwork")
        )
      }

      return true
    })

    state.selectedFilters = selectedFilters
    state.applyFilters = false
  }),

  clearAllAction: action((state) => {
    state.selectedFilters = []
    state.previouslyAppliedFilters = []
    state.applyFilters = false
  }),

  resetFiltersAction: action((state) => {
    state.applyFilters = false
    state.selectedFilters = []
  }),

  clearFiltersZeroStateAction: action((state) => {
    state.appliedFilters = []
    state.selectedFilters = []
    state.previouslyAppliedFilters = []
    state.applyFilters = true
  }),

  setAggregationsAction: action((state, payload) => {
    state.aggregations = payload
    state.applyFilters = false
  }),

  setFiltersCountAction: action((state, payload) => {
    state.applyFilters = false
    state.counts = payload
  }),

  setFilterTypeAction: action((state, payload) => {
    state.applyFilters = false
    state.filterType = payload
  }),

  setInitialFilterStateAction: action((state, payload) => {
    state.appliedFilters = payload
    state.previouslyAppliedFilters = payload
    state.applyFilters = false
  }),
}
