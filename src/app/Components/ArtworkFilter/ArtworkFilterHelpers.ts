import {
  compact,
  entries,
  filter,
  isArray,
  isEmpty,
  isEqual,
  isUndefined,
  pick,
  pickBy,
  unionBy,
} from "lodash"

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
  sizes = "Size",
  sort = "Sort By",
  state = "Hide upcoming auctions",
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
  showOnlySubmittedArtworks = "showOnlySubmittedArtworks",
  sizes = "sizes",
  sort = "sort",
  state = "state",
  timePeriod = "majorPeriods",
  viewAs = "viewAs",
  waysToBuyBid = "atAuction",
  waysToBuyContactGallery = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
  waysToBuyPurchase = "acquireable",
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
    // TODO: Replace newSaleArtwork with saleArtwork when AREnableArtworksConnectionForAuction is released
    newSaleArtwork: "sale_position",
    showArtwork: "partner_show_position",
    auctionResult: "DATE_DESC",
    geneArtwork: "-partner_updated_at",
    tagArtwork: "-partner_updated_at",
    local: "",
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
  earliestCreatedYear: undefined,
  estimateRange: "",
  height: "*-*",
  includeArtworksByFollowedArtists: false,
  inquireableOnly: false,
  keyword: "",
  latestCreatedYear: undefined,
  locationCities: [],
  majorPeriods: [],
  materialsTerms: [],
  medium: "*",
  offerable: false,
  organizations: undefined,
  partnerIDs: [],
  priceRange: "*-*",
  showOnlySubmittedArtworks: false,
  sizes: [],
  state: "All",
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
  earliestCreatedYear: ParamDefaultValues.earliestCreatedYear,
  estimateRange: ParamDefaultValues.estimateRange,
  height: ParamDefaultValues.height,
  includeArtworksByFollowedArtists: ParamDefaultValues.includeArtworksByFollowedArtists,
  inquireableOnly: ParamDefaultValues.inquireableOnly,
  keyword: ParamDefaultValues.keyword,
  latestCreatedYear: ParamDefaultValues.latestCreatedYear,
  locationCities: ParamDefaultValues.locationCities,
  majorPeriods: ParamDefaultValues.majorPeriods,
  materialsTerms: ParamDefaultValues.materialsTerms,
  medium: ParamDefaultValues.medium,
  offerable: ParamDefaultValues.offerable,
  organizations: ParamDefaultValues.organizations,
  partnerIDs: ParamDefaultValues.partnerIDs,
  priceRange: ParamDefaultValues.priceRange,
  showOnlySubmittedArtworks: ParamDefaultValues.showOnlySubmittedArtworks,
  sizes: ParamDefaultValues.sizes,
  sort: ParamDefaultValues.sortArtworks,
  state: ParamDefaultValues.state,
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
  | "SIMPLE_PRICE_HISTOGRAM"
  | "state"

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
  localSortAndFilter?: (items: any[], value?: any | null) => any[]
}
export type FilterArray = ReadonlyArray<FilterData>

export type FilterType =
  | "artwork"
  | "saleArtwork"
  // TODO: Replace newSaleArtwork with saleArtwork when AREnableArtworksConnectionForAuction is released
  | "newSaleArtwork"
  | "showArtwork"
  | "auctionResult"
  | "geneArtwork"
  | "tagArtwork"
  | "local"

export interface FilterCounts {
  total: number | null
  followedArtists: number | null
}

export type SelectedFiltersCounts = {
  [Name in FilterParamName | "waysToBuy" | "year"]: number
}

export const filterKeyFromAggregation: Record<
  AggregationName,
  FilterParamName | string | undefined
> = {
  ARTIST_NATIONALITY: FilterParamName.artistNationalities,
  ARTIST: "artistIDs",
  COLOR: FilterParamName.colors,
  DIMENSION_RANGE: FilterParamName.sizes,
  earliestCreatedYear: "earliestCreatedYear",
  FOLLOWED_ARTISTS: "artistsIFollow",
  latestCreatedYear: "earliestCreatedYear",
  LOCATION_CITY: FilterParamName.locationCities,
  MAJOR_PERIOD: FilterParamName.timePeriod,
  MATERIALS_TERMS: FilterParamName.materialsTerms,
  MEDIUM: FilterParamName.additionalGeneIDs,
  PARTNER: FilterParamName.partnerIDs,
  PRICE_RANGE: FilterParamName.priceRange,
  SIMPLE_PRICE_HISTOGRAM: "SIMPLE_PRICE_HISTOGRAM",
  state: "state",
}

const DEFAULT_ARTWORKS_PARAMS = {
  acquireable: false,
  atAuction: false,
  categories: undefined, // TO check
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

// TODO: Replace DEFAULT_NEW_SALE_ARTWORKS_PARAMS with DEFAULT_SALE_ARTWORKS_PARAMS when AREnableArtworksConnectionForAuction is released
const DEFAULT_NEW_SALE_ARTWORKS_PARAMS = {
  sort: "sale_position",
  estimateRange: "",
} as FilterParams

const DEFAULT_SHOW_ARTWORKS_PARAMS = {
  ...DEFAULT_ARTWORKS_PARAMS,
  sort: "partner_show_position",
}

const DEFAULT_AUCTION_RESULT_PARAMS = {
  allowEmptyCreatedDates: true,
  sort: "DATE_DESC",
  state: "ALL",
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

const createdYearsFilterNames = [
  FilterParamName.earliestCreatedYear,
  FilterParamName.latestCreatedYear,
]
const sizesFilterNames = [FilterParamName.width, FilterParamName.height]

const waysToBuyFilterNames = [
  FilterParamName.waysToBuyPurchase,
  FilterParamName.waysToBuyMakeOffer,
  FilterParamName.waysToBuyBid,
  FilterParamName.waysToBuyContactGallery,
]

const getDefaultParamsByType = (filterType: FilterType) => {
  return {
    artwork: DEFAULT_ARTWORKS_PARAMS,
    saleArtwork: DEFAULT_SALE_ARTWORKS_PARAMS,
    // TODO: Replace newSaleArtwork with saleArtwork when AREnableArtworksConnectionForAuction is released
    newSaleArtwork: DEFAULT_NEW_SALE_ARTWORKS_PARAMS,
    showArtwork: DEFAULT_SHOW_ARTWORKS_PARAMS,
    auctionResult: DEFAULT_AUCTION_RESULT_PARAMS,
    geneArtwork: DEFAULT_GENE_ARTWORK_PARAMS,
    tagArtwork: DEFAULT_TAG_ARTWORK_PARAMS,
    local: DEFAULT_ARTWORKS_PARAMS,
  }[filterType]
}

export const changedFiltersParams = (
  currentFilterParams: FilterParams,
  selectedFilterOptions: FilterArray
) => {
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

export const filterArtworksParams = (
  appliedFilters: FilterArray,
  filterType: FilterType = "artwork"
) => {
  const defaultFilterParams = getDefaultParamsByType(filterType)
  const appliedFilterParams: Partial<FilterParams> = {}

  appliedFilters.forEach((filterParam) => {
    appliedFilterParams[filterParam.paramName] = filterParam.paramValue
  })

  return {
    ...defaultFilterParams,
    ...appliedFilterParams,
  }
}

// For most cases filter key can simply be FilterParamName, exception
// is gallery and institution which share a paramName in metaphysics
export const aggregationNameFromFilter: Record<string, AggregationName | undefined> = {
  additionalGeneIDs: "MEDIUM",
  artistIDs: "ARTIST",
  artistNationalities: "ARTIST_NATIONALITY",
  artistsIFollow: "FOLLOWED_ARTISTS",
  colors: "COLOR",
  earliestCreatedYear: "earliestCreatedYear",
  latestCreatedYear: "latestCreatedYear",
  locationCities: "LOCATION_CITY",
  majorPeriods: "MAJOR_PERIOD",
  materialsTerms: "MATERIALS_TERMS",
  medium: "MEDIUM",
  partnerIDs: "PARTNER",
  priceRange: "PRICE_RANGE",
  sizes: "DIMENSION_RANGE",
  state: "state",
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
    "2020": "2020–Today",
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
    "dimensionRange",
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
  const filtersToUnite = unionBy(selectedFilters, previouslyAppliedFilters, "paramName")

  const unitedFilters = filter(filtersToUnite, ({ paramName, paramValue }) => {
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
    switch (true) {
      case waysToBuyFilterNames.includes(paramName): {
        counts.waysToBuy = (counts.waysToBuy ?? 0) + 1
        break
      }
      case createdYearsFilterNames.includes(paramName): {
        counts.year = 1
        break
      }
      case sizesFilterNames.includes(paramName): {
        const prevCountValue = counts.sizes ?? 0
        counts.sizes = prevCountValue + 1
        break
      }
      case paramName === FilterParamName.artistsIFollow: {
        counts.artistIDs = (counts.artistIDs ?? 0) + 1
        break
      }
      case isArray(paramValue): {
        const isArtistsFilter = paramName === FilterParamName.artistIDs
        const countToAdd = isArtistsFilter ? counts.artistIDs ?? 0 : 0

        counts[paramName] = (paramValue as []).length + countToAdd
        break
      }
      default: {
        counts[paramName] = 1
      }
    }
  })

  return counts
}

export const getFilterArrayFromQueryParams = (queryParams: {
  [key: string]: string | number | boolean | string[]
}) => {
  return compact(
    entries(queryParams).map(([key, value]) => {
      if (!isEmpty(value)) {
        const filterData: FilterData = {
          displayText: FilterDisplayName[key as keyof typeof FilterDisplayName],
          paramName: key as FilterParamName,
          paramValue: value,
        }

        return filterData
      }
    })
  )
}
