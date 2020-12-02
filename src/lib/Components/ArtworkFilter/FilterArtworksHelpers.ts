import { AggregationName, Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterType } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { forOwn, groupBy } from "lodash"

const toRemoveFilterType = "artwork"

// General filter types and objects
export enum FilterParamName {
  artistIDs = "artistIDs",
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
  [Name in FilterParamName]: string | boolean | undefined | string[]
}

export enum FilterDisplayName {
  // artist = "Artists",
  artistIDs = "Artists",
  artistsIFollow = "Artist",
  color = "Color",
  estimateRange = "Price/estimate range",
  gallery = "Gallery",
  institution = "Institution",
  medium = "Medium",
  priceRange = "Price",
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

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams, filterType: FilterType) => {
  const groupedFilters = groupBy(appliedFilters, "paramName")
  Object.keys(groupedFilters).forEach((paramName) => {
    const paramValues = groupedFilters[paramName].map((item) => item.paramValue)
    // If we add more filter options that can take arrays, we would include them here.
    if (paramName === FilterParamName.artistIDs && filterType === "artwork") {
      // For the artistIDs param, we want to return an array
      filterParams[paramName] = paramValues as string[]
    } else {
      // For other params, we just want to return the first value
      filterParams[paramName as FilterParamName] = paramValues[0]
    }
  })

  return filterParams
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = paramsFromAppliedFilters(
    appliedFilters,
    { ...getDefaultParamsByType(toRemoveFilterType) },
    toRemoveFilterType
  )
  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? getDefaultParamsByType(toRemoveFilterType) : filterParams
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

// For most cases filter key can simply be FilterParamName, exception
// is gallery and institution which share a paramName in metaphysics
export const aggregationNameFromFilter: Record<string, AggregationName | undefined> = {
  gallery: "GALLERY",
  institution: "INSTITUTION",
  color: "COLOR",
  dimensionRange: "DIMENSION_RANGE",
  majorPeriods: "MAJOR_PERIOD",
  medium: "MEDIUM",
  priceRange: "PRICE_RANGE",
  artistsIFollow: "FOLLOWED_ARTISTS",
  artistIDs: "ARTIST",
}

export const aggregationForFilter = (filterKey: string, aggregations: Aggregations) => {
  const aggregationName = aggregationNameFromFilter[filterKey]
  const aggregation = aggregations!.find((value) => value.slice === aggregationName)
  return aggregation
}
