import { FilterParamName, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { filter, find, pullAllBy, union, unionBy } from "lodash"
import React, { createContext, Dispatch, Reducer, useContext, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: [],
  filterType: "artwork",
}

export const reducer = (
  artworkFilterState: ArtworkFilterContextState,
  action: FilterActions
): ArtworkFilterContextState => {
  const defaultFilterOptions = {
    ...defaultCommonFilterOptions,
    sort: getSortDefaultValue(artworkFilterState.filterType),
  }
  switch (action.type) {
    case "applyFilters":
      let multiOptionFilters = unionBy(
        artworkFilterState.selectedFilters,
        artworkFilterState.previouslyAppliedFilters,
        "paramName"
      )

      multiOptionFilters = multiOptionFilters.filter((f) => f.paramValue === true)

      // get all filter options excluding ways to buy filter types and replace previously applied options with currently selected options
      const singleOptionFilters = unionBy(
        pullAllBy(
          [...artworkFilterState.selectedFilters, ...artworkFilterState.previouslyAppliedFilters],
          multiOptionFilters,
          "paramValue"
        ),
        "paramName"
      )

      const filtersToApply = union([...singleOptionFilters, ...multiOptionFilters])

      // Remove default values as those are accounted for when we make the API request.
      const appliedFilters = filter(filtersToApply, ({ paramName, paramValue }) => {
        return defaultFilterOptions[paramName] !== paramValue
      })

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: appliedFilters,
        aggregations: artworkFilterState.aggregations,
        filterType: artworkFilterState.filterType,
      }

    // First we update our potential "selectedFilters" based on the option that was selected in the UI
    case "selectFilters":
      const filtersToSelect = unionBy([action.payload], artworkFilterState.selectedFilters, "paramName")

      // Then we have to remove any "invalid" choices.
      const selectedFilters = filter(filtersToSelect, ({ paramName, paramValue }) => {
        const appliedFilter = find(artworkFilterState.appliedFilters, (option) => option.paramName === paramName)

        // Don't re-select options that have already been applied.
        // In the case where the option hasn't been applied, remove the option if it is the default.
        if (!appliedFilter) {
          return defaultFilterOptions[paramName] !== paramValue
        }

        if (appliedFilter.paramValue === paramValue) {
          return false
        }

        return true
      })

      return {
        applyFilters: false,
        selectedFilters,
        appliedFilters: artworkFilterState.appliedFilters,
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
        aggregations: artworkFilterState.aggregations,
        filterType: artworkFilterState.filterType,
      }

    case "clearAll":
      return {
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: artworkFilterState.aggregations,
        filterType: artworkFilterState.filterType,
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
        aggregations: artworkFilterState.aggregations,
        filterType: artworkFilterState.filterType,
      }

    case "clearFiltersZeroState":
      // We call this when a user has filtered artworks and the result returns 0 artworks.
      return {
        appliedFilters: [],
        selectedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: true,
        aggregations: artworkFilterState.aggregations,
        filterType: artworkFilterState.filterType,
      }

    case "setAggregations":
      return {
        aggregations: action.payload,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: artworkFilterState.selectedFilters,
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
        applyFilters: false,
        filterType: artworkFilterState.filterType,
      }

    case "setFilterType":
      return {
        aggregations: artworkFilterState.aggregations,
        appliedFilters: artworkFilterState.appliedFilters,
        selectedFilters: artworkFilterState.selectedFilters,
        previouslyAppliedFilters: artworkFilterState.previouslyAppliedFilters,
        applyFilters: false,
        filterType: action.payload,
      }
  }
}

const getSortDefaultValue = (filterType: FilterType) => {
  if (filterType === "artwork") {
    return "position"
  }
  return "-decayed_merch"
}

export const ParamDefaultValues = {
  acquireable: false,
  atAuction: false,
  color: undefined,
  dimensionRange: "*-*",
  includeArtworksByFollowedArtists: false,
  inquireableOnly: false,
  majorPeriods: undefined,
  medium: "*",
  offerable: false,
  partnerID: undefined,
  priceRange: "*-*",
  sortArtworks: "-decayed_merch",
  sortSaleArtworks: "position",
  viewAs: ViewAsValues.Grid,
}

const defaultCommonFilterOptions: Record<FilterParamName, string | boolean | undefined> = {
  acquireable: ParamDefaultValues.acquireable,
  atAuction: ParamDefaultValues.atAuction,
  color: ParamDefaultValues.color,
  dimensionRange: ParamDefaultValues.dimensionRange,
  includeArtworksByFollowedArtists: ParamDefaultValues.includeArtworksByFollowedArtists,
  inquireableOnly: ParamDefaultValues.inquireableOnly,
  majorPeriods: ParamDefaultValues.majorPeriods,
  medium: ParamDefaultValues.medium,
  offerable: ParamDefaultValues.offerable,
  partnerID: ParamDefaultValues.partnerID,
  priceRange: ParamDefaultValues.priceRange,
  sort: ParamDefaultValues.sortArtworks,
  viewAs: ParamDefaultValues.viewAs,
}

export const useSelectedOptionsDisplay = (): FilterArray => {
  const { state } = useContext(ArtworkFilterContext)

  const defaultSortFilter =
    state.filterType === "artwork"
      ? {
          paramName: FilterParamName.sort,
          paramValue: "-decayed_merch",
          displayText: "Default",
        }
      : {
          paramName: FilterParamName.sort,
          paramValue: "position",
          displayText: "Default",
        }
  const defaultFilters: FilterArray = [
    defaultSortFilter,
    { paramName: FilterParamName.medium, paramValue: "*", displayText: "All" },
    { paramName: FilterParamName.priceRange, paramValue: "*-*", displayText: "All" },
    { paramName: FilterParamName.size, paramValue: "*-*", displayText: "All" },
    { paramName: FilterParamName.gallery, displayText: "All" },
    {
      paramName: FilterParamName.institution,
      displayText: "All",
    },
    { paramName: FilterParamName.color, displayText: "All" },
    { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
    {
      paramName: FilterParamName.waysToBuyBuy,
      paramValue: false,
      displayText: "Buy now",
    },
    {
      paramName: FilterParamName.waysToBuyInquire,
      paramValue: false,
      displayText: "Inquire",
    },
    {
      paramName: FilterParamName.waysToBuyMakeOffer,
      paramValue: false,
      displayText: "Make offer",
    },
    {
      paramName: FilterParamName.waysToBuyBid,
      paramValue: false,
      displayText: "Bid",
    },
    {
      paramName: FilterParamName.artistsIFollow,
      paramValue: false,
      displayText: "Artists I follow",
    },
    {
      paramName: FilterParamName.viewAs,
      paramValue: false,
      displayText: "Grid",
    },
  ]

  return unionBy(state.selectedFilters, state.previouslyAppliedFilters, defaultFilters, "paramName")
}

export const ArtworkFilterContext = createContext<ArtworkFilterContextProps>(null as any /* STRICTNESS_MIGRATION */)

export const ArtworkFilterGlobalStateProvider = ({ children }: any /* STRICTNESS_MIGRATION */) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(reducer, filterState)
  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

export type FilterType = "artwork" | "saleArtwork"

export interface ArtworkFilterContextState {
  readonly appliedFilters: FilterArray
  readonly selectedFilters: FilterArray
  readonly previouslyAppliedFilters: FilterArray
  readonly applyFilters: boolean
  readonly aggregations: Aggregations
  readonly filterType: FilterType
}

export interface FilterData {
  readonly displayText: string
  readonly paramName: FilterParamName
  paramValue?: string | boolean
  filterKey?: string // gallery and institution share a paramName so need to distinguish
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

interface SetAggregations {
  type: "setAggregations"
  payload: any
}

interface SetFilterType {
  type: "setFilterType"
  payload: FilterType
}

export type FilterActions =
  | ResetFilters
  | ApplyFilters
  | SelectFilters
  | ClearAllFilters
  | ClearFiltersZeroState
  | SetAggregations
  | SetFilterType

interface ArtworkFilterContextProps {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}

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

export type Aggregations = Array<{
  slice: AggregationName
  counts: Array<{
    count: number
    value: string
    name: string
  }>
}>
