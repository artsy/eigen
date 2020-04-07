import { FilterArray } from "lib/utils/ArtworkFiltersStore"

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  // Default params
  const filterParams = {
    sort: "-decayed_merch",
    medium: "*",
  }

  const filterTypeToParam = {
    sort: ArtworkSorts,
    medium: MediumFilters,
  }

  appliedFilters.forEach(appliedFilterOption => {
    const paramMapping = filterTypeToParam[appliedFilterOption.filterType]
    const paramFromFilterType = paramMapping[appliedFilterOption.value]
    filterParams[appliedFilterOption.filterType] = paramFromFilterType
  })

  return filterParams
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
