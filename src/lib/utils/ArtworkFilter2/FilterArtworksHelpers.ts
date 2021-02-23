import { FilterScreen } from "lib/Components/FilterModal2"
import { capitalize, compact, forOwn, groupBy, lowerCase, sortBy, startCase } from "lodash"

export enum FilterDisplayName {
  // artist = "Artists",
  additionalGeneIDs = "Category",
  artistIDs = "Artists",
  artistsIFollow = "Artist",
  attributionClass = "Rarity",
  categories = "Medium",
  color = "Color",
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
  waysToBuy = "Ways to buy",
  year = "Artwork date",
}

// General filter types and objects
export enum FilterParamName {
  additionalGeneIDs = "additionalGeneIDs",
  allowEmptyCreatedDates = "allowEmptyCreatedDates",
  artistIDs = "artistIDs",
  artistsIFollow = "includeArtworksByFollowedArtists",
  attributionClass = "attributionClass",
  categories = "categories",
  color = "color",
  earliestCreatedYear = "earliestCreatedYear",
  estimateRange = "estimateRange",
  gallery = "partnerID",
  institution = "partnerID",
  latestCreatedYear = "latestCreatedYear",
  medium = "medium",
  priceRange = "priceRange",
  size = "dimensionRange",
  sizes = "sizes",
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
  [Name in FilterParamName]: string | number | boolean | undefined | string[]
}

export enum ViewAsValues {
  Grid = "grid",
  List = "list",
}

export const getSortDefaultValueByFilterType = (filterType: FilterType) => {
  return {
    artwork: "-decayed_merch",
    saleArtwork: "position",
    showArtwork: "partner_show_position",
    auctionResult: "DATE_DESC",
  }[filterType]
}

export const ParamDefaultValues = {
  acquireable: false,
  allowEmptyCreatedDates: true,
  artistIDs: [],
  atAuction: false,
  attributionClass: undefined,
  categories: undefined,
  color: undefined,
  dimensionRange: "*-*",
  earliestCreatedYear: undefined,
  estimateRange: "",
  additionalGeneIDs: [],
  includeArtworksByFollowedArtists: false,
  inquireableOnly: false,
  latestCreatedYear: undefined,
  majorPeriods: undefined,
  medium: "*",
  offerable: false,
  partnerID: undefined,
  priceRange: "*-*",
  sizes: undefined,
  sortArtworks: "-decayed_merch",
  sortSaleArtworks: "position",
  viewAs: ViewAsValues.Grid,
}

export const defaultCommonFilterOptions = {
  acquireable: ParamDefaultValues.acquireable,
  allowEmptyCreatedDates: ParamDefaultValues.allowEmptyCreatedDates,
  artistIDs: ParamDefaultValues.artistIDs,
  atAuction: ParamDefaultValues.atAuction,
  attributionClass: ParamDefaultValues.attributionClass,
  categories: ParamDefaultValues.categories,
  color: ParamDefaultValues.color,
  additionalGeneIDs: ParamDefaultValues.additionalGeneIDs,
  dimensionRange: ParamDefaultValues.dimensionRange,
  earliestCreatedYear: ParamDefaultValues.earliestCreatedYear,
  estimateRange: ParamDefaultValues.estimateRange,
  includeArtworksByFollowedArtists: ParamDefaultValues.includeArtworksByFollowedArtists,
  inquireableOnly: ParamDefaultValues.inquireableOnly,
  latestCreatedYear: ParamDefaultValues.latestCreatedYear,
  majorPeriods: ParamDefaultValues.majorPeriods,
  medium: ParamDefaultValues.medium,
  offerable: ParamDefaultValues.offerable,
  partnerID: ParamDefaultValues.partnerID,
  priceRange: ParamDefaultValues.priceRange,
  sizes: ParamDefaultValues.sizes,
  sort: ParamDefaultValues.sortArtworks,
  viewAs: ParamDefaultValues.viewAs,
}

export type Aggregations = Array<{
  slice: AggregationName
  counts: Aggregation[]
}>

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
  | "earliestCreatedYear"
  | "latestCreatedYear"

export interface Aggregation {
  count: number
  value: string
  name: string
}

export interface FilterData {
  readonly displayText: string
  readonly paramName: FilterParamName
  paramValue?: string | number | boolean | string[]
  filterKey?: string // gallery and institution share a paramName so need to distinguish
  count?: number | null // aggregations count
}
export type FilterArray = ReadonlyArray<FilterData>

export type FilterType = "artwork" | "saleArtwork" | "showArtwork" | "auctionResult"

export interface FilterCounts {
  total: number | null
  followedArtists: number | null
}

export const filterKeyFromAggregation: Record<AggregationName, FilterParamName | string | undefined> = {
  COLOR: FilterParamName.color,
  DIMENSION_RANGE: FilterParamName.size,
  GALLERY: "gallery",
  INSTITUTION: "institution",
  MAJOR_PERIOD: FilterParamName.timePeriod,
  MEDIUM: FilterParamName.additionalGeneIDs,
  PRICE_RANGE: FilterParamName.priceRange,
  FOLLOWED_ARTISTS: "artistsIFollow",
  ARTIST: "artistIDs",
  earliestCreatedYear: "earliestCreatedYear",
  latestCreatedYear: "earliestCreatedYear",
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

const getDefaultParamsByType = (filterType: FilterType) => {
  return {
    artwork: DEFAULT_ARTWORKS_PARAMS,
    saleArtwork: DEFAULT_SALE_ARTWORKS_PARAMS,
    showArtwork: DEFAULT_SHOW_ARTWORKS_PARAMS,
    auctionResult: DEFAULT_AUCTION_RESULT_PARAMS,
  }[filterType]
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

export const filterArtworksParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams }, filterType)
}

/**
 * NOTE: I am not happy this exists — but right now we can only dispatch arrays of paramValues
 */
const humanizeSlug = (input: string) => {
  return (
    startCase(input)
      // Downcase insignficant words
      .replace(/(\s\w{2}\s)/g, (match) => lowerCase(match))
      // Replace humanized symbols
      .replace(/\sSlash\s/g, "/")
  )
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

  if (filterScreen === "additionalGeneIDs") {
    const additionalGeneIDsOption = selectedOptions.find((option) => {
      return option.paramName === FilterParamName.additionalGeneIDs
    })

    if (
      additionalGeneIDsOption?.paramValue &&
      Array.isArray(additionalGeneIDsOption?.paramValue) &&
      additionalGeneIDsOption?.paramValue.length > 0
    ) {
      return additionalGeneIDsOption?.paramValue.map(humanizeSlug).join(", ")
    }

    return "All"
  }

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
