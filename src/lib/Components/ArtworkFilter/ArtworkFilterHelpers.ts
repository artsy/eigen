import { FilterScreen } from "lib/Components/ArtworkFilter"
import { capitalize, compact, forOwn, groupBy, pick, sortBy } from "lodash"
import { LOCALIZED_UNIT } from "./Filters/helpers"

export enum FilterDisplayName {
  // artist = "Artists",
  additionalGeneIDs = "Medium",
  artistIDs = "Artists",
  artistNationalities = "Nationality & ethnicity",
  artistsIFollow = "Artist",
  attributionClass = "Rarity",
  categories = "Medium",
  color = "Color",
  colors = "Color",
  estimateRange = "Price/estimate range",
  materialsTerms = "Material",
  medium = "Medium",
  partnerIDs = "Galleries and institutions",
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
  artistNationalities = "artistNationalities",
  artistsIFollow = "includeArtworksByFollowedArtists",
  attributionClass = "attributionClass",
  categories = "categories",
  color = "color",
  colors = "colors",
  dimensionRange = "dimensionRange",
  earliestCreatedYear = "earliestCreatedYear",
  estimateRange = "estimateRange",
  height = "height",
  latestCreatedYear = "latestCreatedYear",
  materialsTerms = "materialsTerms",
  medium = "medium",
  partnerIDs = "partnerIDs",
  priceRange = "priceRange",
  // TODO: Delete `size` once the new size filter is deployed
  size = "dimensionRange",
  sizes = "sizes",
  sort = "sort",
  timePeriod = "majorPeriods",
  viewAs = "viewAs",
  waysToBuyBid = "atAuction",
  waysToBuyBuy = "acquireable",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
  width = "width",
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
  additionalGeneIDs: [],
  allowEmptyCreatedDates: true,
  artistIDs: [],
  artistNationalities: [],
  atAuction: false,
  attributionClass: [],
  categories: undefined,
  color: undefined,
  colors: [],
  dimensionRange: "*-*",
  earliestCreatedYear: undefined,
  estimateRange: "",
  height: "*-*",
  includeArtworksByFollowedArtists: false,
  inquireableOnly: false,
  latestCreatedYear: undefined,
  majorPeriods: [],
  materialsTerms: [],
  medium: "*",
  offerable: false,
  partnerIDs: [],
  priceRange: "*-*",
  sizes: undefined,
  sortArtworks: "-decayed_merch",
  sortSaleArtworks: "position",
  viewAs: ViewAsValues.Grid,
  width: "*-*",
}

export const defaultCommonFilterOptions = {
  acquireable: ParamDefaultValues.acquireable,
  additionalGeneIDs: ParamDefaultValues.additionalGeneIDs,
  allowEmptyCreatedDates: ParamDefaultValues.allowEmptyCreatedDates,
  artistIDs: ParamDefaultValues.artistIDs,
  artistNationalities: ParamDefaultValues.artistNationalities,
  atAuction: ParamDefaultValues.atAuction,
  attributionClass: ParamDefaultValues.attributionClass,
  categories: ParamDefaultValues.categories,
  color: ParamDefaultValues.color,
  colors: ParamDefaultValues.colors,
  dimensionRange: ParamDefaultValues.dimensionRange,
  earliestCreatedYear: ParamDefaultValues.earliestCreatedYear,
  estimateRange: ParamDefaultValues.estimateRange,
  height: ParamDefaultValues.height,
  includeArtworksByFollowedArtists: ParamDefaultValues.includeArtworksByFollowedArtists,
  inquireableOnly: ParamDefaultValues.inquireableOnly,
  latestCreatedYear: ParamDefaultValues.latestCreatedYear,
  majorPeriods: ParamDefaultValues.majorPeriods,
  materialsTerms: ParamDefaultValues.materialsTerms,
  medium: ParamDefaultValues.medium,
  offerable: ParamDefaultValues.offerable,
  partnerIDs: ParamDefaultValues.partnerIDs,
  priceRange: ParamDefaultValues.priceRange,
  sizes: ParamDefaultValues.sizes,
  sort: ParamDefaultValues.sortArtworks,
  viewAs: ParamDefaultValues.viewAs,
  width: ParamDefaultValues.width,
}

export type Aggregations = Array<{
  slice: AggregationName
  counts: Aggregation[]
}>

/**
 * Possible aggregations that can be passed
 */
export type AggregationName =
  | "ARTIST_NATIONALITY"
  | "ARTIST"
  | "COLOR"
  | "DIMENSION_RANGE"
  | "earliestCreatedYear"
  | "FOLLOWED_ARTISTS"
  | "latestCreatedYear"
  | "MAJOR_PERIOD"
  | "MATERIALS_TERMS"
  | "MEDIUM"
  | "PARTNER"
  | "PRICE_RANGE"

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
  ARTIST_NATIONALITY: FilterParamName.artistNationalities,
  ARTIST: "artistIDs",
  COLOR: FilterParamName.color,
  DIMENSION_RANGE: FilterParamName.size,
  earliestCreatedYear: "earliestCreatedYear",
  FOLLOWED_ARTISTS: "artistsIFollow",
  latestCreatedYear: "earliestCreatedYear",
  MAJOR_PERIOD: FilterParamName.timePeriod,
  MATERIALS_TERMS: FilterParamName.materialsTerms,
  MEDIUM: FilterParamName.additionalGeneIDs,
  PARTNER: FilterParamName.partnerIDs,
  PRICE_RANGE: FilterParamName.priceRange,
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
  if (filterScreen === "dimensionRange") {
    const selectedDimensionRange = selectedOptions.find(({ paramName }) => paramName === FilterParamName.dimensionRange)

    // Handle custom range
    if (selectedDimensionRange?.displayText === "Custom size") {
      const selectedCustomWidth = selectedOptions.find(({ paramName }) => paramName === FilterParamName.width)
      const selectedCustomHeight = selectedOptions.find(({ paramName }) => paramName === FilterParamName.height)
      return (
        [selectedCustomWidth?.displayText, selectedCustomHeight?.displayText].filter(Boolean).join(" × ") +
        LOCALIZED_UNIT
      )
    }

    // Intentionally doesn't return anything
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
    const multiSelectedOptions = selectedOptions.filter((option) => option.paramValue === true)

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

  return selectedOptions.find((option) => option.paramName === filterScreen)?.displayText ?? "All"
}

// For most cases filter key can simply be FilterParamName, exception
// is gallery and institution which share a paramName in metaphysics
export const aggregationNameFromFilter: Record<string, AggregationName | undefined> = {
  artistIDs: "ARTIST",
  artistNationalities: "ARTIST_NATIONALITY",
  artistsIFollow: "FOLLOWED_ARTISTS",
  color: "COLOR",
  dimensionRange: "DIMENSION_RANGE",
  earliestCreatedYear: "earliestCreatedYear",
  latestCreatedYear: "latestCreatedYear",
  majorPeriods: "MAJOR_PERIOD",
  materialsTerms: "MATERIALS_TERMS",
  medium: "MEDIUM",
  partnerIDs: "PARTNER",
  priceRange: "PRICE_RANGE",
}

export const aggregationForFilter = (filterKey: string, aggregations: Aggregations) => {
  const aggregationName = aggregationNameFromFilter[filterKey]
  const aggregation = aggregations!.find((value) => value.slice === aggregationName)
  return aggregation
}

export interface AggregateOption {
  displayText: string
  paramValue: string
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

export const getDisplayNameForTimePeriod = (aggregationName: string) => {
  const DISPLAY_TEXT: Record<string, string> = {
    "2020": "2020–today",
    "2010": "2010–2019",
    "2000": "2000–2009",
    "1990": "1990–1999",
    "1980": "1980–1989",
    "1970": "1970–1979",
    "1960": "1960–1969",
    "1950": "1950–1959",
    "1940": "1940–1949",
    "1930": "1930–1939",
    "1920": "1920–1929",
    "1910": "1910–1919",
    "1900": "1900–1909",
  }

  return DISPLAY_TEXT[aggregationName] ?? aggregationName
}

export const prepareFilterArtworksParamsForInput = (filters: FilterParams) => {
  return pick(filters, [
    "acquireable",
    "additionalGeneIDs",
    "after",
    "aggregationPartnerCities",
    "aggregations",
    "artistID",
    "artistIDs",
    "artistNationalities",
    "artistSeriesID",
    "atAuction",
    "attributionClass",
    "before",
    "color",
    "colors",
    "dimensionRange",
    "excludeArtworkIDs",
    "extraAggregationGeneIDs",
    "first",
    "forSale",
    "geneID",
    "geneIDs",
    "height",
    "includeArtworksByFollowedArtists",
    "includeMediumFilterInAggregation",
    "inquireableOnly",
    "keyword",
    "keywordMatchExact",
    "last",
    "locationCities",
    "majorPeriods",
    "marketable",
    "materialsTerms",
    "medium",
    "offerable",
    "page",
    "partnerCities",
    "partnerID",
    "partnerIDs",
    "period",
    "periods",
    "priceRange",
    "saleID",
    "size",
    "sizes",
    "sort",
    "tagID",
    "width",
  ])
}
