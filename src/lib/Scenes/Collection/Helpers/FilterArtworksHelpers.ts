import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { forOwn, omit } from "lodash"

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "",
}

const applyFilters = (appliedFilters: FilterArray, filterParams: object) => {
  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filterType]
    const paramFromFilterType = paramMapping[appliedFilterOption.value]
    // @ts-ignore STRICTNESS_MIGRATION
    filterParams[appliedFilterOption.filterType] = paramFromFilterType
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
  "All" = "",
  "Buy now" = "acquireable",
  "Make offer" = "offerable",
  "Bid" = "atAuction",
  "Inquire" = "inquireableOnly",
}

export type WaysToBuyOptions = keyof typeof WaysToBuyFilters

export const OrderedWaysToBuyFilters: WaysToBuyOptions[] = ["All", "Buy now", "Make offer", "Bid", "Inquire"]

// General filter types and objects
interface FilterTypes {
  sort: any
  medium: any
  priceRange: any
  waysToBuy: any
}

export type FilterOption = keyof FilterTypes
const filterTypeToParam: FilterTypes = {
  sort: ArtworkSorts,
  medium: MediumFilters,
  priceRange: PriceRangeFilters,
  waysToBuy: WaysToBuyFilters,
}

export const filterTypeToOrderedOptionsList: FilterTypes = {
  sort: OrderedArtworkSorts,
  medium: OrderedMediumFilters,
  priceRange: OrderedPriceRangeFilters,
  waysToBuy: OrderedWaysToBuyFilters,
}
