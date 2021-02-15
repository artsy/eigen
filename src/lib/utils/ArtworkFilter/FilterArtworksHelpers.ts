import { FilterScreen } from "lib/Components/FilterModal"
import {
  AggregationName,
  Aggregations,
  FilterArray,
  FilterCounts,
  FilterType,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { capitalize, compact, forOwn, groupBy, sortBy } from "lodash"

// General filter types and objects
export enum FilterParamName {
  artistIDs = "artistIDs",
  allowEmptyCreatedDates = "allowEmptyCreatedDates",
  artistsIFollow = "includeArtworksByFollowedArtists",
  attributionClass = "attributionClass",
  categories = "categories",
  color = "color",
  earliestCreatedYear = "earliestCreatedYear",
  latestCreatedYear = "latestCreatedYear",
  estimateRange = "estimateRange",
  gallery = "partnerID",
  institution = "partnerID",
  medium = "medium",
  priceRange = "priceRange",
  size = "dimensionRange",
  sort = "sort",
  sizes = "sizes",
  timePeriod = "majorPeriods",
  viewAs = "viewAs",
  waysToBuyBid = "atAuction",
  waysToBuyBuy = "acquireable",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

// Types for the parameters passed to Relay
export type FilterParams = {
  [Name in FilterParamName]: string | number | boolean | undefined | string[]
}

export enum FilterDisplayName {
  // artist = "Artists",
  artistIDs = "Artists",
  artistsIFollow = "Artist",
  attributionClass = "Rarity",
  color = "Color",
  categories = "Medium",
  estimateRange = "Price/estimate range",
  gallery = "Gallery",
  institution = "Institution",
  medium = "Medium",
  priceRange = "Price",
  size = "Size",
  sizes = "Size",
  sort = "Sort by",
  timePeriod = "Time period",
  viewAs = "View as",
  year = "Artwork date",
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
    counts: FilterCounts
  }
}

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const DEFAULT_ARTWORKS_PARAMS = {
  acquireable: false,
  atAuction: false,
  categories: undefined, // TO check
  dimensionRange: "*-*",
  estimateRange: "",
  inquireableOnly: false,
  medium: "*",
  offerable: false,
  priceRange: "*-*",
  sort: "-decayed_merch",
  includeArtworksByFollowedArtists: false,
} as FilterParams

const DEFAULT_SALE_ARTWORKS_PARAMS = {
  sort: "position",
  estimateRange: "",
} as FilterParams

const DEFAULT_SHOW_ARTWORKS_PARAMS = {
  ...DEFAULT_ARTWORKS_PARAMS,
  sort: "partner_show_position",
}

const DEFAULT_AUCTION_RESULT_PARAMS = {
  sort: "DATE_DESC",
  sizes: undefined,
  allowEmptyCreatedDates: true,
} as FilterParams

const getDefaultParamsByType = (filterType: FilterType) => {
  return {
    artwork: DEFAULT_ARTWORKS_PARAMS,
    saleArtwork: DEFAULT_SALE_ARTWORKS_PARAMS,
    showArtwork: DEFAULT_SHOW_ARTWORKS_PARAMS,
    auctionResult: DEFAULT_AUCTION_RESULT_PARAMS,
  }[filterType]
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

export const filterArtworksParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams }, filterType)
}

const getChangedParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  const filterParams = paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams }, filterType)
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
export const selectedOption = ({
  selectedOptions,
  filterScreen,
  filterType = "artwork",
  aggregations,
}: {
  selectedOptions: FilterArray
  filterScreen: FilterScreen
  filterType?: FilterType
  aggregations: Aggregations
}) => {
  const multiSelectedOptions = selectedOptions.filter((option) => option.paramValue === true)

  if (filterScreen === "attributionClass") {
    const selectedAttributionClassOption = selectedOptions.find((option) => {
      return option.paramName === FilterParamName.attributionClass
    })

    if (
      selectedAttributionClassOption?.paramValue &&
      Array.isArray(selectedAttributionClassOption?.paramValue) &&
      selectedAttributionClassOption?.paramValue.length > 0
    ) {
      return selectedAttributionClassOption?.paramValue.map(capitalize).join(", ")
    }

    return "All"
  }

  if (filterScreen === "categories") {
    const selectedCategoriesValues = selectedOptions.find((filter) => filter.paramName === FilterParamName.categories)
      ?.paramValue as string[] | undefined

    if (selectedCategoriesValues?.length) {
      const numSelectedCategoriesToDisplay = selectedCategoriesValues.length
      if (numSelectedCategoriesToDisplay === 1) {
        return selectedCategoriesValues[0]
      }
      return `${selectedCategoriesValues[0]}, ${numSelectedCategoriesToDisplay - 1} more`
    }
    return "All"
  }

  if (filterScreen === "sizes") {
    const selectedSizesValues = selectedOptions.find((filter) => filter.paramName === FilterParamName.sizes)
      ?.paramValue as string[] | undefined
    if (selectedSizesValues?.length) {
      const numSelectedSizesToDisplay = selectedSizesValues.length
      const firstSelectedSize = capitalize(selectedSizesValues[0].toLowerCase())
      if (numSelectedSizesToDisplay === 1) {
        return firstSelectedSize
      }
      return `${firstSelectedSize}, ${numSelectedSizesToDisplay - 1} more`
    }
    return "All"
  }

  if (filterScreen === "year") {
    const selectedEarliestCreatedYear = selectedOptions.find(
      (filter) => filter.paramName === FilterParamName.earliestCreatedYear
    )?.paramValue
    const selectedLatestCreatedYear = selectedOptions.find(
      (filter) => filter.paramName === FilterParamName.latestCreatedYear
    )?.paramValue

    if (selectedEarliestCreatedYear && selectedLatestCreatedYear) {
      return `${selectedEarliestCreatedYear} - ${selectedLatestCreatedYear}`
    }
    return "All"
  }

  if (filterScreen === "waysToBuy") {
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
  } else if (filterScreen === "gallery" || filterScreen === "institution") {
    const displayText = selectedOptions.find((option) => option.filterKey === filterScreen)?.displayText
    if (displayText) {
      return displayText
    } else {
      return "All"
    }
  } else if (filterScreen === "artistIDs") {
    const hasArtistsIFollowChecked = !!selectedOptions.find(({ paramName, paramValue }) => {
      return paramName === FilterParamName.artistsIFollow && paramValue === true
    })

    let selectedArtistNames: string[]

    if (filterType === "saleArtwork") {
      const saleArtworksArtistIDs = selectedOptions.find((filter) => filter.paramName === FilterParamName.artistIDs)
      // The user has selected one or more artist ids
      if (saleArtworksArtistIDs && Array.isArray(saleArtworksArtistIDs?.paramValue)) {
        const artistIDsAggregation = aggregationForFilter(FilterParamName.artistIDs, aggregations)

        selectedArtistNames = compact(
          saleArtworksArtistIDs.paramValue.map((artistID: string) => {
            return artistIDsAggregation?.counts.find((artistAggregation) => artistAggregation.value === artistID)?.name
          })
        )
      } else {
        selectedArtistNames = []
      }
    } else {
      selectedArtistNames = selectedOptions
        .filter((filter) => filter.paramName === FilterParamName.artistIDs)
        .map(({ displayText }) => displayText)
    }

    const alphabetizedArtistNames = sortBy(selectedArtistNames, (name) => name)
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
  return selectedOptions.find((option) => option.paramName === filterScreen)?.displayText
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
  earliestCreatedYear: "earliestCreatedYear",
  latestCreatedYear: "latestCreatedYear",
}

export const aggregationForFilter = (filterKey: string, aggregations: Aggregations) => {
  const aggregationName = aggregationNameFromFilter[filterKey]
  const aggregation = aggregations!.find((value) => value.slice === aggregationName)
  return aggregation
}
