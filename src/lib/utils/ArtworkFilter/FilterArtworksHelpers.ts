import { FilterScreen } from "lib/Components/FilterModal"
import { Aggregations, FilterArray, FilterType } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { forOwn } from "lodash"

// General filter types and objects
export enum FilterParamName {
  artistsIFollow = "includeArtworksByFollowedArtists",
  color = "color",
  estimateRange = "estimateRange",
  gallery = "partnerID",
  institution = "partnerID",
  medium = "medium",
  priceRange = "priceRange",
  size = "dimensionRange",
  sort = "sort",
  timePeriod = "majorPeriods",
  viewAs = "viewAs",
  waysToBuyBid = "atAuction",
  waysToBuyBuy = "acquireable",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

// Types for the parameters passed to Relay
export type FilterParams = {
  [Name in FilterParamName]: string | boolean | undefined
}

export enum FilterDisplayName {
  artistsIFollow = "Artist",
  color = "Color",
  estimateRange = "Price/estimate range",
  gallery = "Gallery",
  institution = "Institution",
  medium = "Medium",
  priceRange = "Price/estimate range",
  size = "Size",
  sort = "Sort by",
  timePeriod = "Time period",
  viewAs = "View as",
  waysToBuy = "Ways to buy",
}

export enum ViewAsValues {
  Grid = "grid",
  List = "list",
}

export interface InitialState {
  initialState: {
    selectedFilters: FilterArray
    appliedFilters: FilterArray
    previouslyAppliedFilters: FilterArray
    applyFilters: boolean
    aggregations: Aggregations
    filterType: FilterType
  }
}

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const defaultArtworksParams = {
  acquireable: false,
  atAuction: false,
  dimensionRange: "*-*",
  estimateRange: "",
  inquireableOnly: false,
  medium: "*",
  offerable: false,
  priceRange: "*-*",
  sort: "-decayed_merch",
  includeArtworksByFollowedArtists: false,
} as FilterParams

const defaultSaleArtworksParams = {
  sort: "position",
  estimateRange: "",
} as FilterParams

const getDefaultParamsByType = (fitlerType: FilterType) => {
  if (fitlerType === "artwork") {
    return defaultArtworksParams
  }
  return defaultSaleArtworksParams
}

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  appliedFilters.forEach((appliedFilterOption) => {
    filterParams[appliedFilterOption.paramName] = appliedFilterOption.paramValue
  })

  return filterParams
}

export const filterArtworksParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
}

const getChangedParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  const filterParams = paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? defaultFilterParams : filterParams
}

export const changedFiltersParams = (currentFilterParams: FilterParams, selectedFilterOptions: FilterArray) => {
  const selectedFilterParams = getChangedParams(selectedFilterOptions)
  const changedFilters: { [key: string]: any } = {}

  /***
   *  If a filter option has been updated e.g. was { medium: "photography" } but
   *  is now { medium: "sculpture" } add the updated filter to changedFilters. Otherwise,
   *  add filter option to changedFilters.
   ***/
  forOwn(getChangedParams(selectedFilterOptions), (_value, paramName) => {
    const filterParamName = paramName as FilterParamName
    if (currentFilterParams[filterParamName] !== selectedFilterParams[filterParamName]) {
      changedFilters[filterParamName] = selectedFilterParams[filterParamName]
    }
  })

  return changedFilters
}

export const selectedOption = (selectedOptions: FilterArray, filterType: FilterScreen) => {
  const multiSelectedOptions = selectedOptions.filter((option) => option.paramValue === true)

  if (filterType === "waysToBuy") {
    const waysToBuyFilterNames = [
      FilterParamName.waysToBuyBuy,
      FilterParamName.waysToBuyMakeOffer,
      FilterParamName.waysToBuyBid,
      FilterParamName.waysToBuyInquire,
    ]
    const waysToBuyOptions = multiSelectedOptions
      .filter((value) => waysToBuyFilterNames.includes(value.paramName))
      .map((option) => option.displayText)

    if (waysToBuyOptions.length === 0) {
      return "All"
    }
    return waysToBuyOptions.join(", ")
  } else if (filterType === "gallery" || filterType === "institution") {
    const displayText = selectedOptions.find((option) => option.filterKey === filterType)?.displayText
    if (displayText) {
      return displayText
    } else {
      return "All"
    }
  } else if (filterType === "artistsIFollow") {
    const displayText = multiSelectedOptions.find((option) => option.paramName === "includeArtworksByFollowedArtists")
      ?.displayText
    if (displayText) {
      return displayText
    } else {
      return "All"
    }
  }
  return selectedOptions.find((option) => option.paramName === filterType)?.displayText
}

export type aggregationsType =
  | ReadonlyArray<{
      slice: string
      counts: Array<{ count: number; value: string; name?: string }>
    }>
  | []

export const aggregationsWithFollowedArtists = (
  followedArtistCount: number,
  artworkAggregations: aggregationsType
): aggregationsType => {
  const followedArtistAggregation =
    followedArtistCount > 0
      ? [
          {
            slice: "FOLLOWED_ARTISTS",
            counts: [{ count: followedArtistCount, value: "followed_artists" }],
          },
        ]
      : []
  return [...artworkAggregations, ...followedArtistAggregation]
}
