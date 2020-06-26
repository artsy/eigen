import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { forOwn, omit } from "lodash"

// General filter types and objects
export enum FilterType {
  sort = "sort",
  medium = "medium",
  priceRange = "priceRange",
  size = "size",
  color = "color",
  gallery = "gallery",
  institution = "institution",
  timePeriod = "majorPeriods",
  waysToBuyBuy = "acquireable",
  waysToBuyBid = "atAuction",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

export enum FilterParamName {
  sort = "sort",
  medium = "medium",
  priceRange = "priceRange",
  size = "dimensionRange",
  color = "color",
  gallery = "partnerID",
  institution = "partnerID",
  timePeriod = "majorPeriods",
  waysToBuyBuy = "acquireable",
  waysToBuyBid = "atAuction",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

export enum FilterDisplayName {
  sort = "Sort",
  medium = "Medium",
  priceRange = "Price Range",
  size = "Size",
  color = "Color",
  gallery = "Gallery",
  institution = "Institution",
  timePeriod = "Time Period",
  waysToBuy = "Ways To Buy",
}

// Types for the parameters passed to Relay
interface FilterParams {
  sort?: string
  medium?: string
  priceRange?: string
  dimensionRange?: string
  color?: string
  partnerID?: string
  majorPeriods?: string
  acquireable?: boolean
  inquireableOnly?: boolean
  atAuction?: boolean
  offerable?: boolean
}

export interface InitialState {
  initialState: {
    selectedFilters: FilterArray
    appliedFilters: FilterArray
    previouslyAppliedFilters: FilterArray
    applyFilters: boolean
  }
}

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "",
  dimensionRange: "*-*",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
} as FilterParams

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  appliedFilters.forEach(appliedFilterOption => {
    // @ts-ignore STRICTNESS_MIGRATION
    filterParams[appliedFilterOption.paramName] = appliedFilterOption.paramValue
  })

  return filterParams
}

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = paramsFromAppliedFilters(appliedFilters, {})

  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? defaultFilterParams : filterParams
}

export const changedFiltersParams = (
  currentFilterParams: any /* STRICTNESS_MIGRATION */,
  selectedFilterOptions: FilterArray
) => {
  const selectedFilterParams = getChangedParams(selectedFilterOptions)
  const changedFilters = {}

  /** If a filter option has been updated e.g. was { medium: "photography" } but
   *  is now { medium: "sculpture" } add the updated filter to changedFilters. Otherwise,
   *  add filter option to changedFilters.
   */
  forOwn(getChangedParams(selectedFilterOptions), (_value, filterType) => {
    // @ts-ignore STRICTNESS_MIGRATION
    if (currentFilterParams[filterType] === selectedFilterParams[filterType]) {
      const omitted = omit(selectedFilterParams, [filterType])
      // @ts-ignore STRICTNESS_MIGRATION
      if (omitted[filterType]) {
        // @ts-ignore STRICTNESS_MIGRATION
        changedFilters[filterType] = omitted[filterType]
      }
    } else {
      // @ts-ignore STRICTNESS_MIGRATION
      changedFilters[filterType] = selectedFilterParams[filterType]
    }
  })

  return changedFilters
}
