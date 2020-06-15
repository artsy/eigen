import { FilterArray, FilterData } from "lib/utils/ArtworkFiltersStore"
import { forOwn, omit } from "lodash"

// General filter types and objects
export enum FilterType {
  sort = "sort",
  medium = "medium",
  priceRange = "priceRange",
  size = "size",
  color = "color",
  gallery = "gallery",
  institution = "institution",
  timePeriod = "majorPeriods",
  waysToBuyBuy = "acquireable",
  waysToBuyBid = "atAuction",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

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
}

export enum FilterDisplayName {
  sort = "Sort",
  medium = "Medium",
  priceRange = "Price Range",
  size = "Size",
  color = "Color",
  gallery = "Gallery",
  institution = "Institution",
  timePeriod = "Time Period",
  waysToBuy = "Ways To Buy",
}

// Types for the parameters passed to Relay
interface FilterParams {
  sort?: ArtworkSorts
  medium?: MediumFilters
  priceRange?: PriceRangeFilters
  dimensionRange?: SizeFilters
  color?: ColorFilters
  partnerID?: string
  majorPeriods?: TimePeriodFilters
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

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "",
  dimensionRange: "*-*",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
} as FilterParams

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  appliedFilters.forEach(appliedFilterOption => {
    filterParams[appliedFilterOption.paramName] = appliedFilterOption.paramValue
  })

  return filterParams
}

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = paramsFromAppliedFilters(appliedFilters, {})

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

export const OrderedArtworkSorts: FilterData[] = [
  {
    displayText: "Default",
    paramName: FilterParamName.sort,
    paramValue: "-decayed_merch",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (high to low)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,-prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (low to high)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently updated",
    paramName: FilterParamName.sort,
    paramValue: "-partner_updated_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently added",
    paramName: FilterParamName.sort,
    paramValue: "-published_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (descending)",
    paramName: FilterParamName.sort,
    paramValue: "-year",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (ascending)",
    paramName: FilterParamName.sort,
    paramValue: "year",
    filterType: FilterType.sort,
  },
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

// Size Types
enum SizeFilters {
  "All" = "*-*",
  'Small (0"-40")' = "*-40",
  'Medium (40"-70")' = "40-70",
  'Large (70"+")' = "70-*",
}

export type SizeOption = keyof typeof SizeFilters

export const OrderedSizeFilters: SizeOption[] = ["All", 'Small (0"-40")', 'Medium (40"-70")', 'Large (70"+")']

// Color types

enum ColorFilters {
  "Any" = "*",
  "orange" = "orange",
  "darkblue" = "darkblue",
  "gold" = "gold",
  "darkgreen" = "darkgreen",
  "lightblue" = "lightblue",
  "lightgreen" = "lightgreen",
  "yellow" = "yellow",
  "darkorange" = "darkorange",
  "red" = "red",
  "pink" = "pink",
  "darkviolet" = "darkviolet",
  "violet" = "violet",
  "black-and-white" = "black-and-white",
  "black-and-white-2" = "black-and-white",
}

export type ColorOption = keyof typeof ColorFilters

export const OrderedColorFilters: ColorOption[] = [
  "black-and-white",
  "lightgreen",
  "darkgreen",
  "lightblue",
  "darkblue",
  "violet",
  "darkviolet",
  "black-and-white-2",
  "yellow",
  "gold",
  "orange",
  "darkorange",
  "red",
  "pink",
]

// Time Period types
enum TimePeriodFilters {
  "All" = "",
  "2010-today" = "2010",
  "2000-2009" = "2000",
  "1990-1999" = "1990",
  "1980-1989" = "1980",
  "1970-1979" = "1970",
  "1960-1969" = "1960",
  "1950-1959" = "1950",
  "1940-1949" = "1940",
  "1930-1939" = "1930",
  "1920-1929" = "1920",
  "1910-1919" = "1910",
  "1900-1909" = "1900",
  "Late 19th century" = "Late 19th Century",
  "Mid 19th century" = "Mid 19th Century",
  "Early 19th century" = "Early 19th Century",
}

export const mapTimePeriodTypesToFilterTypes = {
  All: [],
  "2010-today": "2010",
  "2000-2009": "2000",
  "1990-1999": "1990",
  "1980-1989": "1980",
  "1970-1979": "1970",
  "1960-1969": "1960",
  "1950-1959": "1950",
  "1940-1949": "1940",
  "1930-1939": "1930",
  "1920-1929": "1920",
  "1910-1919": "1910",
  "1900-1909": "1900",
  "Late 19th century": "Late 19th Century",
  "Mid 19th century": "Mid 19th Century",
  "Early 19th century": "Early 19th Century",
}

export type TimePeriodOption = keyof typeof TimePeriodFilters

export const OrderedTimePeriodFilters: TimePeriodOption[] = [
  "All",
  "2010-today",
  "2000-2009",
  "1990-1999",
  "1980-1989",
  "1970-1979",
  "1960-1969",
  "1950-1959",
  "1940-1949",
  "1930-1939",
  "1920-1929",
  "1910-1919",
  "1900-1909",
  "Late 19th century",
  "Mid 19th century",
  "Early 19th century",
]

// Ways to Buy types
enum WaysToBuyFilters {
  "Buy now" = "acquireable",
  "Make offer" = "offerable",
  "Bid" = "atAuction",
  "Inquire" = "inquireableOnly",
}

export type WaysToBuyOptions = keyof typeof WaysToBuyFilters

export const OrderedWaysToBuyFilters: FilterData[] = [
  {
    displayText: "Buy now",
    paramName: FilterParamName.waysToBuyBuy,
    paramValue: false, // default to false, override with toggle
    filterType: FilterType.waysToBuyBuy,
  },
  {
    displayText: "Make offer",
    paramName: FilterParamName.waysToBuyMakeOffer,
    paramValue: false,
    filterType: FilterType.waysToBuyMakeOffer,
  },
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
    paramValue: false,
    filterType: FilterType.waysToBuyBid,
  },
  {
    displayText: "Inquire",
    paramName: FilterParamName.waysToBuyInquire,
    paramValue: false,
    filterType: FilterType.waysToBuyInquire,
  },
]
