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
