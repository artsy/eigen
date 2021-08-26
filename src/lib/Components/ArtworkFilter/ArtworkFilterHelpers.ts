import { FilterScreen } from "lib/Components/ArtworkFilter"
import {
  capitalize,
  compact,
  filter,
  groupBy,
  isArray,
  isEqual,
  isUndefined,
  pick,
  pickBy,
  sortBy,
  unionBy,
} from "lodash"
import { LOCALIZED_UNIT } from "./Filters/helpers"

export enum FilterDisplayName {
  // artist = "Artists",
  additionalGeneIDs = "Medium",
  artistIDs = "Artists",
  artistNationalities = "Nationality & Ethnicity",
  artistsIFollow = "Artist",
  attributionClass = "Rarity",
  categories = "Medium",
  colors = "Color",
  estimateRange = "Price/Estimate Range",
  locationCities = "Artwork Location",
  materialsTerms = "Material",
  medium = "Medium",
  organizations = "Auction House",
  partnerIDs = "Galleries & Institutions",
  priceRange = "Price",
  size = "Size",
  sizes = "Size",
  sort = "Sort By",
  timePeriod = "Time Period",
  viewAs = "View as",
  waysToBuy = "Ways to Buy",
  year = "Artwork Date",
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
  colors = "colors",
  dimensionRange = "dimensionRange",
  earliestCreatedYear = "earliestCreatedYear",
  estimateRange = "estimateRange",
  height = "height",
  keyword = "keyword",
  latestCreatedYear = "latestCreatedYear",
  locationCities = "locationCities",
  materialsTerms = "materialsTerms",
  medium = "medium",
  organizations = "organizations",
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
    geneArtwork: "-partner_updated_at",
    tagArtwork: "-partner_updated_at",
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
  colors: [],
  dimensionRange: "*-*",
  earliestCreatedYear: undefined,
  estimateRange: "",
  height: "*-*",
  includeArtworksByFollowedArtists: false,
  inquireableOnly: false,
  latestCreatedYear: undefined,
  locationCities: [],
  majorPeriods: [],
  materialsTerms: [],
  medium: "*",
  keyword: "",
  offerable: false,
  organizations: undefined,
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
  colors: ParamDefaultValues.colors,
  dimensionRange: ParamDefaultValues.dimensionRange,
  earliestCreatedYear: ParamDefaultValues.earliestCreatedYear,
  estimateRange: ParamDefaultValues.estimateRange,
  height: ParamDefaultValues.height,
  keyword: ParamDefaultValues.keyword,
  includeArtworksByFollowedArtists: ParamDefaultValues.includeArtworksByFollowedArtists,
  inquireableOnly: ParamDefaultValues.inquireableOnly,
  latestCreatedYear: ParamDefaultValues.latestCreatedYear,
  locationCities: ParamDefaultValues.locationCities,
  majorPeriods: ParamDefaultValues.majorPeriods,
  materialsTerms: ParamDefaultValues.materialsTerms,
  medium: ParamDefaultValues.medium,
  offerable: ParamDefaultValues.offerable,
  organizations: ParamDefaultValues.organizations,
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
  | "LOCATION_CITY"
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

export type FilterType = "artwork" | "saleArtwork" | "showArtwork" | "auctionResult" | "geneArtwork" | "tagArtwork"

export interface FilterCounts {
  total: number | null
  followedArtists: number | null
}

export type SelectedFiltersCounts = {
  [Name in FilterParamName | "waysToBuy" | "year"]: number
}

export const filterKeyFromAggregation: Record<AggregationName, FilterParamName | string | undefined> = {
  ARTIST_NATIONALITY: FilterParamName.artistNationalities,
  ARTIST: "artistIDs",
  COLOR: FilterParamName.colors,
  DIMENSION_RANGE: FilterParamName.size,
  earliestCreatedYear: "earliestCreatedYear",
  FOLLOWED_ARTISTS: "artistsIFollow",
  latestCreatedYear: "earliestCreatedYear",
  LOCATION_CITY: FilterParamName.locationCities,
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

const DEFAULT_GENE_ARTWORK_PARAMS = {
  sort: "-partner_updated_at",
  priceRange: "*-*",
  medium: "*",
} as FilterParams

const DEFAULT_TAG_ARTWORK_PARAMS = {
  ...DEFAULT_ARTWORKS_PARAMS,
  sort: "-partner_updated_at",
} as FilterParams

const createdYearsFilterNames = [FilterParamName.earliestCreatedYear, FilterParamName.latestCreatedYear]

const waysToBuyFilterNames = [
  FilterParamName.waysToBuyBuy,
  FilterParamName.waysToBuyMakeOffer,
  FilterParamName.waysToBuyBid,
  FilterParamName.waysToBuyInquire,
]

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
    geneArtwork: DEFAULT_GENE_ARTWORK_PARAMS,
    tagArtwork: DEFAULT_TAG_ARTWORK_PARAMS,
  }[filterType]
}

export const changedFiltersParams = (currentFilterParams: FilterParams, selectedFilterOptions: FilterArray) => {
  const changedFilters: { [key: string]: any } = {}

  selectedFilterOptions.forEach((selectedFilterOption) => {
    const { paramName, paramValue } = selectedFilterOption
    const currentFilterParamValue = currentFilterParams[paramName]

    if (currentFilterParamValue && isEqual(paramValue, currentFilterParamValue)) {
      return
    }

    changedFilters[paramName] = paramValue
  })

  return changedFilters
}

export const filterArtworksParams = (appliedFilters: FilterArray, filterType: FilterType = "artwork") => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams }, filterType)
}

export const extractCustomSizeLabel = (selectedOptions: FilterArray) => {
  const selectedDimensionRange = selectedOptions.find(({ paramName }) => paramName === FilterParamName.dimensionRange)

  // Handle custom range
  if (selectedDimensionRange?.displayText === "Custom size") {
    const selectedCustomWidth = selectedOptions.find(({ paramName }) => paramName === FilterParamName.width)
    const selectedCustomHeight = selectedOptions.find(({ paramName }) => paramName === FilterParamName.height)
    return (
      [selectedCustomWidth?.displayText, selectedCustomHeight?.displayText].filter(Boolean).join(" × ") + LOCALIZED_UNIT
    )
  }

  // Intentionally doesn't return anything
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
    const label = extractCustomSizeLabel(selectedOptions)

    if (label) {
      return label
    }
  }

  if (filterScreen === "categories") {
    const selectedCategoriesValues = selectedOptions.find(({ paramName }) => paramName === FilterParamName.categories)
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
    const selectedSizesValues = selectedOptions.find(({ paramName }) => paramName === FilterParamName.sizes)
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

  // selected option display text for auction house filter
  if (filterScreen === "organizations") {
    const selectedOrganizationsValues = selectedOptions.find(
      ({ paramName }) => paramName === FilterParamName.organizations
    )?.paramValue as string[] | undefined
    if (selectedOrganizationsValues?.length) {
      const numSelectedOrganizationsToDisplay = selectedOrganizationsValues.length
      const firstSelectedSize = capitalize(selectedOrganizationsValues[0].toLowerCase())
      if (numSelectedOrganizationsToDisplay === 1) {
        return firstSelectedSize
      }
      return `${firstSelectedSize}, ${numSelectedOrganizationsToDisplay - 1} more`
    }
    return "All"
  }

  if (filterScreen === "year") {
    const selectedEarliestCreatedYear = selectedOptions.find(
      ({ paramName }) => paramName === FilterParamName.earliestCreatedYear
    )?.paramValue
    const selectedLatestCreatedYear = selectedOptions.find(
      ({ paramName }) => paramName === FilterParamName.latestCreatedYear
    )?.paramValue

    if (selectedEarliestCreatedYear && selectedLatestCreatedYear) {
      return `${selectedEarliestCreatedYear} - ${selectedLatestCreatedYear}`
    }
    return "All"
  }

  if (filterScreen === "waysToBuy") {
    const multiSelectedOptions = selectedOptions.filter((option) => option.paramValue === true)

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
      const saleArtworksArtistIDs = selectedOptions.find(({ paramName }) => paramName === FilterParamName.artistIDs)
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
        .filter(({ paramName }) => paramName === FilterParamName.artistIDs)
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
  colors: "COLOR",
  dimensionRange: "DIMENSION_RANGE",
  earliestCreatedYear: "earliestCreatedYear",
  latestCreatedYear: "latestCreatedYear",
  locationCities: "LOCATION_CITY",
  majorPeriods: "MAJOR_PERIOD",
  materialsTerms: "MATERIALS_TERMS",
  medium: "MEDIUM",
  additionalGeneIDs: "MEDIUM",
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

export const getParamsForInputByFilterType = (
  initialParams: Partial<FilterParams>,
  filterType: FilterType = "artwork"
) => {
  const defaultInputParams = getDefaultParamsByType(filterType)
  const filledInitialParams = pickBy(initialParams, (item) => !isUndefined(item)) as FilterParams
  const allowedParams = prepareFilterArtworksParamsForInput({
    ...defaultInputParams,
    ...filledInitialParams,
  })

  return allowedParams
}

export const getUnitedSelectedAndAppliedFilters = ({
  filterType,
  selectedFilters,
  previouslyAppliedFilters,
}: {
  filterType: FilterType
  selectedFilters: FilterArray
  previouslyAppliedFilters: FilterArray
}) => {
  const defaultFilterOptions = {
    ...defaultCommonFilterOptions,
    sort: getSortDefaultValueByFilterType(filterType),
  }

  // replace previously applied options with currently selected options
  const filtersToUnite = unionBy(selectedFilters, previouslyAppliedFilters, ({ paramValue, paramName }) => {
    // We don't want to union the artistID params, as each entry corresponds to a
    // different artist that may be selected. Instead we de-dupe based on the paramValue.
    if (paramName === FilterParamName.artistIDs && filterType === "artwork") {
      return paramValue
    } else {
      return paramName
    }
  })

  const unitedFilters = filter(filtersToUnite, ({ paramName, paramValue }) => {
    // This logic is specific to filters that allow for multiple options. Right now
    // it only applies to the artist filter, but this will likely change.
    if (paramName === FilterParamName.artistIDs && filterType === "artwork") {
      // See if we have an existing entry in previouslyAppliedFilters
      const hasExistingPreviouslyAppliedFilter = previouslyAppliedFilters.find(
        (previouslyAppliedFilter) =>
          paramName === previouslyAppliedFilter.paramName && paramValue === previouslyAppliedFilter.paramValue
      )

      const hasExistingSelectedAppliedFilter = selectedFilters.find(
        (selectedFilter) => paramName === selectedFilter.paramName && paramValue === selectedFilter.paramValue
      )

      // If so, it means that this filter had been previously applied and is now being de-selected.
      // We need it to exist in the "selectedFilters" array so that our counts, etc. are correct,
      // but it's technically de-selected.
      return !(hasExistingPreviouslyAppliedFilter && hasExistingSelectedAppliedFilter)
    }

    // The default sorting and lot ascending sorting at the saleArtwork filterType has the same paramValue
    // with a different displayText, we want to make sure that the user can still switch between the two.
    if (paramName === FilterParamName.sort && filterType === "saleArtwork") {
      return true
    }
    return !isEqual((defaultFilterOptions as any)[paramName], paramValue)
  })

  return unitedFilters
}

export const getSelectedFiltersCounts = (selectedFilters: FilterArray) => {
  const counts: Partial<SelectedFiltersCounts> = {}
  selectedFilters.forEach(({ paramName, paramValue }: FilterData) => {
    if (paramName === FilterParamName.artistIDs) {
      counts.artistIDs = (counts.artistIDs ?? 0) + 1
    } else if (waysToBuyFilterNames.includes(paramName)) {
      counts.waysToBuy = (counts.waysToBuy ?? 0) + 1
    } else if (createdYearsFilterNames.includes(paramName)) {
      counts.year = 1
    } else if (isArray(paramValue)) {
      counts[paramName] = paramValue.length
    } else {
      counts[paramName] = 1
    }
  })

  return counts
}
