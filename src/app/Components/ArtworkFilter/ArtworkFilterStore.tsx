import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { assignDeep } from "app/store/persistence"
import { Action, action, createContextStore, State } from "easy-peasy"
import { filter, find, isEqual, unionBy } from "lodash"
import {
  Aggregations,
  defaultCommonFilterOptions,
  FilterArray,
  FilterCounts,
  FilterData,
  FilterParamName,
  FilterType,
  getSortDefaultValueByFilterType,
  getUnitedSelectedAndAppliedFilters,
  ViewAsValues,
} from "./ArtworkFilterHelpers"
import { LOCALIZED_UNIT } from "./Filters/helpers"
import { FilterDisplayConfig } from "./types"

export interface ArtworkFiltersModel {
  appliedFilters: FilterArray
  selectedFilters: FilterArray
  previouslyAppliedFilters: FilterArray
  applyFilters: boolean
  aggregations: Aggregations
  filterType: FilterType
  counts: FilterCounts
  sortOptions?: FilterData[]
  filterOptions?: FilterDisplayConfig[]
  sizeMetric: Metric
  showFilterArtworksModal: boolean

  applyFiltersAction: Action<this>
  selectFiltersAction: Action<this, FilterData>
  resetFiltersAction: Action<this>
  clearFiltersZeroStateAction: Action<this>
  setAggregationsAction: Action<this, any>
  setFiltersCountAction: Action<this, FilterCounts>
  setFilterTypeAction: Action<this, FilterType>
  setSizeMetric: Action<this, Metric>
  setInitialFilterStateAction: Action<this, FilterArray>
  setSelectedFiltersAction: Action<this, FilterArray>
  setShowFilterArtworksModal: Action<this, boolean>
  setSortOptions: Action<this, this["sortOptions"]>
  setFilterOptions: Action<this, this["filterOptions"]>
}

export type ArtworkFiltersState = State<ArtworkFiltersModel>

export const getArtworkFiltersModel = (): ArtworkFiltersModel => ({
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
  sizeMetric: LOCALIZED_UNIT,
  showFilterArtworksModal: false,

  /**
   * Store actions
   */
  applyFiltersAction: action((state) => {
    const appliedFilters = getUnitedSelectedAndAppliedFilters(state)

    state.applyFilters = true
    state.appliedFilters = appliedFilters
    state.selectedFilters = []
    state.previouslyAppliedFilters = appliedFilters
  }),

  selectFiltersAction: action((state, payload) => {
    const defaultFilterOptions = {
      ...defaultCommonFilterOptions,
      sort: getSortDefaultValueByFilterType(state.filterType),
    }
    const filtersToSelect = unionBy([payload], state.selectedFilters, "paramName")

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
        return !isEqual(defaultFilterOptions[paramName], paramValue)
      }

      if (appliedFilter.paramValue === paramValue) {
        // Ignore this case when we are setting back the default sorting for saleArtworks
        return (
          defaultFilterOptions[paramName] === appliedFilter.paramValue &&
          appliedFilter.paramName === FilterParamName.sort &&
          state.filterType === "saleArtwork"
        )
      }

      return true
    })

    state.selectedFilters = selectedFilters
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

  setSizeMetric: action((state, payload) => {
    state.sizeMetric = payload
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

  setSelectedFiltersAction: action((state, payload) => {
    state.selectedFilters = payload
    state.applyFilters = false
  }),

  setSortOptions: action((state, payload) => {
    state.sortOptions = payload
  }),

  setFilterOptions: action((state, payload) => {
    state.filterOptions = payload
  }),

  setShowFilterArtworksModal: action((state, payload) => {
    state.showFilterArtworksModal = payload
  }),
})

// Return the list of selected options (union of selected and applied)
export const useSelectedOptionsDisplay = (): FilterArray => {
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const previouslyAppliedFiltersState = ArtworksFiltersStore.useStoreState(
    (state) => state.previouslyAppliedFilters
  )
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  return selectedOptionsUnion({
    selectedFilters: selectedFiltersState,
    previouslyAppliedFilters: previouslyAppliedFiltersState,
    filterType: filterTypeState,
  })
}

export const DEFAULT_FILTERS: FilterArray = [
  { paramName: FilterParamName.artistSeriesIDs, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.estimateRange, paramValue: "", displayText: "All" },
  { paramName: FilterParamName.medium, paramValue: "*", displayText: "All" },
  { paramName: FilterParamName.materialsTerms, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.organizations, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.priceRange, paramValue: "*-*", displayText: "All" },
  { paramName: FilterParamName.sizes, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.state, paramValue: "ALL", displayText: "All" },
  { paramName: FilterParamName.partnerIDs, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.keyword, paramValue: "", displayText: "All" },
  { paramName: FilterParamName.locationCities, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.colors, displayText: "All" },
  { paramName: FilterParamName.timePeriod, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.waysToBuyPurchase, paramValue: false, displayText: "Purchase" },
  {
    paramName: FilterParamName.waysToBuyContactGallery,
    paramValue: false,
    displayText: "Contact Gallery",
  },
  { paramName: FilterParamName.waysToBuyMakeOffer, paramValue: false, displayText: "Make Offer" },
  { paramName: FilterParamName.waysToBuyBid, paramValue: false, displayText: "Bid" },
  {
    paramName: FilterParamName.artistsIFollow,
    paramValue: false,
    displayText: "All Artists I Follow",
  },
  { paramName: FilterParamName.artistIDs, paramValue: [], displayText: "All" },
  { paramName: FilterParamName.viewAs, paramValue: ViewAsValues.Grid, displayText: "Grid" },
  { paramName: FilterParamName.attributionClass, paramValue: "", displayText: "All" },
]

export const selectedOptionsUnion = ({
  selectedFilters,
  previouslyAppliedFilters,
  filterType = "artwork",
}: {
  selectedFilters: FilterArray
  previouslyAppliedFilters: FilterArray
  filterType?: FilterType
}): FilterArray => {
  const defaultSortFilter = {
    artwork: {
      paramName: FilterParamName.sort,
      paramValue: "-decayed_merch",
      displayText: "Recommended",
    },
    saleArtwork: {
      paramName: FilterParamName.sort,
      paramValue: "position",
      displayText: "Lot Number Ascending",
    },
    // TODO: Replace newSaleArtwork with saleArtwork when AREnableArtworksConnectionForAuction is released
    newSaleArtwork: {
      paramName: FilterParamName.sort,
      paramValue: "sale_position",
      displayText: "Lot Number Ascending",
    },
    showArtwork: {
      paramName: FilterParamName.sort,
      paramValue: "partner_show_position",
      displayText: "Gallery Curated",
    },
    auctionResult: {
      paramName: FilterParamName.sort,
      paramValue: "DATE_DESC",
      displayText: "Most Recent Sale Date",
    },
    geneArtwork: {
      paramName: FilterParamName.sort,
      paramValue: "-partner_updated_at",
      displayText: "Recommended",
    },
    tagArtwork: {
      paramName: FilterParamName.sort,
      paramValue: "-partner_updated_at",
      displayText: "Recommended",
    },
    local: {
      paramName: FilterParamName.sort,
      paramValue: "",
      displayText: "Recommended",
    },
    collect: {
      paramName: FilterParamName.sort,
      paramValue: "-decayed_merch",
      displayText: "Recommended",
    },
  }[filterType]

  const defaultFilters: FilterArray = [defaultSortFilter, ...DEFAULT_FILTERS]

  // Attempt to union all of the existing filters. Give selectedFilters
  // precedence over previouslyAppliedFilters and defaultFilters.
  return unionBy(selectedFilters, previouslyAppliedFilters, defaultFilters, "paramName")
}

export function createArtworkFiltersStore() {
  if (__TEST__) {
    ;(getArtworkFiltersModel() as any).__injectState = action((state, injectedState) => {
      assignDeep(state, injectedState)
    })
  }

  const store = createContextStore<ArtworkFiltersModel>((initialData) => {
    return {
      ...getArtworkFiltersModel(),
      ...initialData,
    }
  })
  return store
}

export const ArtworksFiltersStore = createArtworkFiltersStore()

export const ArtworkFiltersStoreProvider = ArtworksFiltersStore.Provider
