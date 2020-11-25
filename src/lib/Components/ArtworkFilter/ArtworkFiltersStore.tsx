import { Action, action, Computed, computed, createContextStore } from "easy-peasy"
import { FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import { sumBy } from "lodash"

const defaultFilters: FilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "*-*",
  dimensionRange: "*-*",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
  includeArtworksByFollowedArtists: false,
}

const defaultFiltersDisplay: FilterScreenRawDisplay = {
  sort: "Default",
  waysToBuy: [],
  medium: "All",
  priceRange: "All",
  majorPeriods: "All",
  dimensionRange: "All",
  color: "All",
  gallery: "All",
  institution: "All",
  artist: [],
}

interface FilterParams {
  sort?: string
  medium?: string
  priceRange?: string
  dimensionRange?: string
  color?: string
  partnerID?: string
  majorPeriods?: string
  inquireableOnly?: boolean
  offerable?: boolean
  atAuction?: boolean
  acquireable?: boolean
  includeArtworksByFollowedArtists?: boolean
  artistIDs?: [string]
}

type FilterParamOption = keyof FilterParams

interface FilterScreenRawDisplay {
  sort?: string
  waysToBuy?: string[]
  medium?: string
  priceRange?: string
  majorPeriods?: string
  dimensionRange?: string
  color?: string
  gallery?: string
  institution?: string
  artist?: string[]
}

interface FilterScreenDisplay {
  sort?: string
  waysToBuy?: string
  medium?: string
  priceRange?: string
  majorPeriods?: string
  dimensionRange?: string
  color?: string
  gallery?: string
  institution?: string
  artist?: string
}

interface SelectFilterPayload {
  paramName: FilterParamOption
  value: string | boolean
  display: string
  filterScreenType: keyof FilterScreenDisplay
}

interface ArtworkFilterState {
  aggregations: Aggregations
  applyFilters: boolean
  appliedFilters: FilterParams
  previouslyAppliedFilters: FilterParams
  selectedFilters: FilterParams
  selectedFiltersRawDisplay: FilterScreenRawDisplay
  selectedFiltersDisplay: Computed<ArtworkFilterState, FilterScreenDisplay>
  selectedFiltersComputed: Computed<ArtworkFilterState, FilterParams>
  applyButtonCount: Computed<ArtworkFilterState, number>
  selectFilter: Action<ArtworkFilterState, SelectFilterPayload>
  applyFiltersAction: Action<ArtworkFilterState>
  setAggregations: Action<ArtworkFilterState, Aggregations>
  clearAll: Action<ArtworkFilterState>
  resetFilters: Action<ArtworkFilterState>
  clearFiltersZeroState: Action<ArtworkFilterState>
  setApplyFilters: Action<ArtworkFilterState, boolean>
  setInitialFilterState: Action<ArtworkFilterState, FilterParams>
}

const artworkFilterState: ArtworkFilterState = {
  aggregations: [],
  applyFilters: false,
  appliedFilters: {},
  previouslyAppliedFilters: {},
  selectedFilters: {},
  selectedFiltersRawDisplay: defaultFiltersDisplay,
  selectedFiltersDisplay: computed((state) => {
    const sel = state.selectedFiltersRawDisplay

    const waysToBuyDisplay = (sel?.waysToBuy?.length ?? 0) > 0 ? sel?.waysToBuy?.join(", ") : "All"

    const custom = {
      waysToBuy: waysToBuyDisplay,
    }

    return {
      ...sel,
      ...custom,
    } as FilterScreenDisplay
  }),
  selectedFiltersComputed: computed((state) => {
    return {
      ...defaultFilters,
      ...state.appliedFilters,
      ...state.selectedFilters,
    }
  }),
  applyButtonCount: computed((state) => {
    const selectedFiltersKeys = Object.keys(state.selectedFilters) as FilterParamOption[]
    const count = sumBy(selectedFiltersKeys, (option: FilterParamOption) => {
      const selectedFilterValue = state.selectedFilters[option]
      if (!state.appliedFilters[option]) {
        return defaultFilters[option] === selectedFilterValue ? 0 : 1
      } else {
        return state.appliedFilters[option] === selectedFilterValue ? 0 : 1
      }
    })

    return count
  }),
  selectFilter: action((state, payload) => {
    const { paramName, value, display, filterScreenType } = payload

    // Set the new selected value.
    state.selectedFilters[paramName] = value

    // re-set applyFilters so the hook will pick it up when it's applied again
    state.applyFilters = false

    // Set the new display value, handling array and non-array value types.
    const selectedFilterDisplay = state.selectedFiltersRawDisplay[filterScreenType]
    if (Array.isArray(selectedFilterDisplay)) {
      const elemIndex = selectedFilterDisplay.findIndex((val) => val === display)
      if (elemIndex > -1) {
        selectedFilterDisplay.splice(elemIndex, 1)
        state.selectedFiltersRawDisplay[filterScreenType] = selectedFilterDisplay
      } else {
        state.selectedFiltersRawDisplay[filterScreenType].push(display)
      }
    } else {
      state.selectedFiltersRawDisplay[filterScreenType] = display
    }
  }),
  applyFiltersAction: action((state) => {
    const filtersToApply = {
      ...defaultFilters,
      ...state.previouslyAppliedFilters,
      ...state.selectedFilters,
    }

    state.appliedFilters = filtersToApply
    state.previouslyAppliedFilters = filtersToApply
    state.applyFilters = true
    state.selectedFilters = {}
  }),
  setAggregations: action((state, payload) => {
    state.aggregations = payload
  }),
  clearAll: action((state) => {
    state.selectedFilters = {}
    state.previouslyAppliedFilters = {}
    state.applyFilters = false
    state.selectedFiltersRawDisplay = defaultFiltersDisplay
  }),
  resetFilters: action((state) => {
    // We call this when we need to re-set to our initial state. Since previouslyAppliedFilters
    // is only used while in the filter modal, when we close out we need to re-set that back
    // to equal appliedFilters.
    state.applyFilters = false
    state.previouslyAppliedFilters = state.appliedFilters
    state.selectedFilters = {}
    state.selectedFiltersRawDisplay = defaultFiltersDisplay
  }),
  clearFiltersZeroState: action((state) => {
    // We call this when a user has filtered artworks and the result returns 0 artworks.
    state.appliedFilters = {}
    state.selectedFilters = {}
    state.previouslyAppliedFilters = {}
    state.applyFilters = true
  }),
  setApplyFilters: action((state, payload) => {
    state.applyFilters = payload
  }),
  setInitialFilterState: action((state, payload) => {
    state.appliedFilters = payload
    state.previouslyAppliedFilters = payload
  }),
}

export const NewStore = createContextStore<ArtworkFilterState>(artworkFilterState)

export const ParamDefaultValues = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "*-*",
  dimensionRange: "*-*",
  color: undefined,
  partnerID: undefined,
  majorPeriods: undefined,
  inquireableOnly: false,
  offerable: false,
  atAuction: false,
  acquireable: false,
  includeArtworksByFollowedArtists: false,
  artistIDs: [],
}

export interface ArtworkFilterContextState {
  readonly appliedFilters: FilterArray
  readonly selectedFilters: FilterArray
  readonly previouslyAppliedFilters: FilterArray
  readonly applyFilters: boolean
  readonly aggregations: Aggregations
}

export interface FilterData {
  readonly displayText: string
  readonly paramName: FilterParamName
  paramValue?: string | boolean
  filterKey?: string // gallery and institution share a paramName so need to distinguish
}

export type FilterArray = ReadonlyArray<FilterData>

/**
 * Possible aggregations that can be passed
 */
export type AggregationName =
  | "COLOR"
  | "DIMENSION_RANGE"
  | "GALLERY"
  | "INSTITUTION"
  | "MAJOR_PERIOD"
  | "MEDIUM"
  | "PRICE_RANGE"
  | "FOLLOWED_ARTISTS"
  | "ARTIST"

export type Aggregations = Array<{
  slice: AggregationName
  counts: Array<{
    count: number
    value: string
    name: string
  }>
}>
