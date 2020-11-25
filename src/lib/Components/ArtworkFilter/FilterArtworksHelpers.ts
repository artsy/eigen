import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterScreen } from "lib/Components/ArtworkFilter/FilterModal"
import { compact, forOwn, groupBy, sortBy } from "lodash"

// General filter types and objects
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
  artistsIFollow = "includeArtworksByFollowedArtists",
  artist = "artistIDs",
}

// Types for the parameters passed to Relay
export type FilterParams = {
  [Name in FilterParamName]: string | boolean | undefined | string[]
}

export enum FilterDisplayName {
  sort = "Sort",
  medium = "Medium",
  priceRange = "Price range",
  size = "Size",
  color = "Color",
  gallery = "Gallery",
  institution = "Institution",
  timePeriod = "Time period",
  waysToBuy = "Ways to buy",
  artistsIFollow = "Artist",
  artist = "Artists",
}

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "*-*",
  dimensionRange: "*-*",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
  includeArtworksByFollowedArtists: false,
} as FilterParams

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  const groupedFilters = groupBy(appliedFilters, "paramName")
  Object.keys(groupedFilters).forEach((paramName) => {
    const paramValues = groupedFilters[paramName].map((item) => item.paramValue)
    // If we add more filter options that can take arrays, we would include them here.
    if (paramName === FilterParamName.artist) {
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
