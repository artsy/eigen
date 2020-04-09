import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { forOwn, omit } from "lodash"

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  // Default params
  const filterParams = {
    sort: "-decayed_merch",
    medium: "*",
  }

  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filterType]
    const paramFromFilterType = paramMapping[appliedFilterOption.value]
    filterParams[appliedFilterOption.filterType] = paramFromFilterType
  })

  return filterParams
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = {}
  const defaultParams = {
    sort: "-decayed_merch",
    medium: "*",
  }

  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filterType]
    const paramFromFilterType = paramMapping[appliedFilterOption.value]
    filterParams[appliedFilterOption.filterType] = paramFromFilterType
  })

  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? defaultParams : filterParams
}

export const changedFiltersParams = (currentFilterParams, selectedFilterOptions: FilterArray) => {
  const selectedFilterParams = getChangedParams(selectedFilterOptions)
  const changedFilters = {}

  /** If a filter option has been updated e.g. was { medium: "photography" } but
   *  is now { medium: "sculpture" } add the updated filter to changedFilters. Otherwise,
   *  add filter option to changedFilters.
   */
  forOwn(getChangedParams(selectedFilterOptions), (_value, filterType) => {
    if (currentFilterParams[filterType] === selectedFilterParams[filterType]) {
      const omitted = omit(selectedFilterParams, [filterType])
      if (omitted[filterType]) {
        changedFilters[filterType] = omitted[filterType]
      }
    } else {
      changedFilters[filterType] = selectedFilterParams[filterType]
    }
  })

  return changedFilters
}

enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

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

const filterTypeToParam = {
  sort: ArtworkSorts,
  medium: MediumFilters,
}
