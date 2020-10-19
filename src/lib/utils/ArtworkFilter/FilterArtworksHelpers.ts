import { FilterScreen } from "lib/Components/FilterModal"
import { Aggregations, FilterArray } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
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

export interface InitialState {
  initialState: {
    selectedFilters: FilterArray
    appliedFilters: FilterArray
    previouslyAppliedFilters: FilterArray
    applyFilters: boolean
    aggregations: Aggregations
  }
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

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
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

/**
 * Formats the display for the Filter Modal "home" screen.
 */
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
  } else if (filterType === "artist") {
    const hasArtistsIFollowChecked = !!selectedOptions.find(({ paramName, paramValue }) => {
      return paramName === FilterParamName.artistsIFollow && paramValue === true
    })

    const selectedArtistNames = selectedOptions.map(({ paramName, displayText }) => {
      if (paramName === FilterParamName.artist) {
        return displayText
      }
    })
    const alphabetizedArtistNames = sortBy(compact(selectedArtistNames), (name) => name)
    const allArtistDisplayNames = hasArtistsIFollowChecked
      ? ["All artists I follow", ...alphabetizedArtistNames]
      : alphabetizedArtistNames

    if (allArtistDisplayNames.length === 1) {
      return allArtistDisplayNames[0]
    } else if (allArtistDisplayNames.length > 1) {
      const numArtistsToDisplay = allArtistDisplayNames.length - 1
      return `${allArtistDisplayNames[0]}, ${numArtistsToDisplay} more`
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
