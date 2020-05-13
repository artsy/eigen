import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { forOwn, omit } from "lodash"

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
} as FilterParams

const applyFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filterType]
    const paramFromFilterType = paramMapping[appliedFilterOption.value as SortOption | MediumOption | PriceRangeOption]

    if (appliedFilterOption.value === true) {
      const mapParamToRelayValue = paramMapping[appliedFilterOption.filterType]
      filterParams[mapParamToRelayValue as MultiOptionRelayParams] = true
    } else {
      filterParams[appliedFilterOption.filterType as SingleOptionRelayParams] = paramFromFilterType
    }
  })

  return filterParams
}

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  return applyFilters(appliedFilters, { ...defaultFilterParams })
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = applyFilters(appliedFilters, {})

  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? defaultFilterParams : filterParams
}

export const changedFiltersParams = (
  currentFilterParams: any /* STRICTNESS_MIGRATION */,
  selectedFilterOptions: FilterArray
) => {
  const selectedFilterParams = getChangedParams(selectedFilterOptions)
  const changedFilters = {}

  /** If a filter option has been updated e.g. was { medium: "photography" } but
   *  is now { medium: "sculpture" } add the updated filter to changedFilters. Otherwise,
   *  add filter option to changedFilters.
   */
  forOwn(getChangedParams(selectedFilterOptions), (_value, filterType) => {
    // @ts-ignore STRICTNESS_MIGRATION
    if (currentFilterParams[filterType] === selectedFilterParams[filterType]) {
      const omitted = omit(selectedFilterParams, [filterType])
      // @ts-ignore STRICTNESS_MIGRATION
      if (omitted[filterType]) {
        // @ts-ignore STRICTNESS_MIGRATION
        changedFilters[filterType] = omitted[filterType]
      }
    } else {
      // @ts-ignore STRICTNESS_MIGRATION
      changedFilters[filterType] = selectedFilterParams[filterType]
    }
  })

  return changedFilters
}

// Sorting types
enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

export type SortOption = keyof typeof ArtworkSorts

export const OrderedArtworkSorts: SortOption[] = [
  "Default",
  "Price (low to high)",
  "Price (high to low)",
  "Recently updated",
  "Recently added",
  "Artwork year (descending)",
  "Artwork year (ascending)",
]

// Medium filter types
enum MediumFilters {
  "All" = "*",
  "Painting" = "painting",
  "Photography" = "photography",
  "Sculpture" = "sculpture",
  "Prints & multiples" = "prints",
  "Works on paper" = "work-on-paper",
  "Film & video" = "film-slash-video",
  "Design" = "design",
  "Jewelry" = "jewelry",
  "Drawing" = "drawing",
  "Installation" = "installation",
  "Performance art" = "performance-art",
}

export const OrderedMediumFilters: MediumOption[] = [
  "All",
  "Painting",
  "Photography",
  "Sculpture",
  "Prints & multiples",
  "Works on paper",
  "Design",
  "Drawing",
  "Installation",
  "Film & video",
  "Jewelry",
  "Performance art",
]

export type MediumOption = keyof typeof MediumFilters

// Price Range types
enum PriceRangeFilters {
  "All" = "",
  "$0-5,000" = "*-5000",
  "$5,000-10,000" = "5000-10000",
  "$10,000-20,000" = "10000-20000",
  "$20,000-40,000" = "20000-40000",
  "$50,000+" = "50000-*",
}

export type PriceRangeOption = keyof typeof PriceRangeFilters

export const OrderedPriceRangeFilters: PriceRangeOption[] = [
  "All",
  "$50,000+",
  "$20,000-40,000",
  "$10,000-20,000",
  "$5,000-10,000",
  "$0-5,000",
]

// Ways to Buy types
enum WaysToBuyFilters {
  "Buy now" = "acquireable",
  "Make offer" = "offerable",
  "Bid" = "atAuction",
  "Inquire" = "inquireableOnly",
}

export enum WaysToBuyFilterTypes {
  "Buy now" = "waysToBuyBuy",
  "Make offer" = "waysToBuyMakeOffer",
  "Bid" = "waysToBuyBid",
  "Inquire" = "waysToBuyInquire",
}

export const mapWaysToBuyTypesToFilterTypes = {
  "Buy now": "waysToBuyBuy",
  Bid: "waysToBuyBid",
  Inquire: "waysToBuyInquire",
  "Make offer": "waysToBuyMakeOffer",
}

export const mapWaysToBuyFilters = {
  waysToBuyInquire: "Inquire",
  waysToBuyBuy: "Buy now",
  waysToBuyMakeOffer: "Make offer",
  waysToBuyBid: "Bid",
}

export const WaysToBuyDefaultValues = {
  acquireable: { filterType: "waysToBuyBuy", value: false },
  inquireableOnly: { filterType: "waysToBuyInquire", value: false },
  offerable: { filterType: "waysToBuyMakeOffer", value: false },
  atAuction: { filterType: "waysToBuyBid", value: false },
}

export type WaysToBuyOptions = keyof typeof WaysToBuyFilters

export const OrderedWaysToBuyFilters: WaysToBuyOptions[] = ["Buy now", "Make offer", "Bid", "Inquire"]

// General filter types and objects
interface FilterTypes {
  sort: any
  medium: any
  priceRange: any
  waysToBuyBuy: any
  waysToBuyBid: any
  waysToBuyInquire: any
  waysToBuyMakeOffer: any
}

enum WaysToBuyRelayFilters {
  "waysToBuyBuy" = "acquireable",
  "waysToBuyMakeOffer" = "offerable",
  "waysToBuyBid" = "atAuction",
  "waysToBuyInquire" = "inquireableOnly",
}

export type FilterOption = keyof FilterTypes

const filterTypeToParam: FilterTypes = {
  sort: ArtworkSorts,
  medium: MediumFilters,
  priceRange: PriceRangeFilters,
  waysToBuyBuy: WaysToBuyRelayFilters,
  waysToBuyBid: WaysToBuyRelayFilters,
  waysToBuyInquire: WaysToBuyRelayFilters,
  waysToBuyMakeOffer: WaysToBuyRelayFilters,
}

// Types for the parameters passed to Relay
type MultiOptionRelayParams = "acquireable" | "inquireableOnly" | "atAuction" | "offerable"

type SingleOptionRelayParams = "sort" | "medium" | "priceRange"

interface FilterParams {
  sort?:
    | "-decayed_merch"
    | "sold,-has_price,-prices"
    | "sold,-has_price,prices"
    | "-partner_updated_at"
    | "-published_at"
    | "-year"
    | "year"
  medium?:
    | "*"
    | "painting"
    | "photography"
    | "sculpture"
    | "prints"
    | "work-on-paper"
    | "film-slash-video"
    | "design"
    | "jewelry"
    | "drawing"
    | "installation"
    | "performance-art"
  priceRange?: "" | "*-5000" | "5000-10000" | "10000-20000" | "20000-40000" | "50000-*"
  acquireable?: boolean
  inquireableOnly?: boolean
  atAuction?: boolean
  offerable?: boolean
}

export interface InitialState {
  initialState: {
    selectedFilters: FilterArray
    appliedFilters: FilterArray
    previouslyAppliedFilters: FilterArray
    applyFilters: boolean
  }
}
