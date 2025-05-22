import {
  FilterArray,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilterDisplayConfig } from "app/Components/ArtworkFilter/types"
import { MyCollectionArtworkEdge } from "app/Scenes/MyCollection/MyCollectionLegacy"
import { normalizeText } from "app/utils/normalizeText"
import { compact, filter, orderBy, uniqBy } from "lodash"
import { DateTime } from "luxon"
import { useEffect } from "react"

export const useLocalArtworkFilter = (artworksList?: any[] | null) => {
  const setFilterType = ArtworksFiltersStore.useStoreActions((s) => s.setFilterTypeAction)
  const setSortOptions = ArtworksFiltersStore.useStoreActions((s) => s.setSortOptions)
  const setFilterOptions = ArtworksFiltersStore.useStoreActions((s) => s.setFilterOptions)

  const initLocalArtworkFilter = (artworks: any[]) => {
    setFilterType("local")
    setSortOptions([
      {
        paramName: FilterParamName.sort,
        displayText: "Price Paid (High to Low)",
        paramValue: "local-price-paid-high-low",

        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              return a.pricePaid?.minor ?? 0
            },
            "desc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Price Paid (Low to High)",
        paramValue: "local-price-paid-low-high",

        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              return a.pricePaid?.minor ?? 0
            },
            "asc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Artwork Year (Ascending)",
        paramValue: "local-year-old-new",

        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              const date = DateTime.fromISO(a.date)
              return date.isValid ? date.toMillis() : Number.POSITIVE_INFINITY
            },
            "asc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Artwork Year (Descending)",
        paramValue: "local-year-new-old",

        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              const date = DateTime.fromISO(a.date)
              return date.isValid ? date.toMillis() : 0
            },
            "desc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical by Artist (A to Z)",
        paramValue: "local-alpha-a-z",

        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "asc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical by Artist (Z to A)",
        paramValue: "local-alpha-z-a",

        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "desc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Demand Index (High to Low)",
        paramValue: "demand-index-high-to-low",

        localSortAndFilter: (artworks) =>
          orderBy(artworks, (a) => a.marketPriceInsights?.demandRank ?? 0, "desc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Demand Index (Low to High)",
        paramValue: "demand-index-low-to-high",

        localSortAndFilter: (artworks) =>
          orderBy(artworks, (a) => a.marketPriceInsights?.demandRank ?? 0, "asc"),
      },
    ])
    setFilterOptions(
      compact([
        {
          displayText: FilterDisplayName.sort,
          filterType: "sort",
          ScreenComponent: "SortOptionsScreen",
        },
        {
          displayText: FilterDisplayName.artistIDs,
          filterType: "artistIDs",
          ScreenComponent: "ArtistIDsOptionsScreen",
          values: uniqBy(
            artworks.map(
              (a): FilterData => ({
                displayText: a.artist?.name ?? "N/A",
                paramName: FilterParamName.artistIDs,
                paramValue: a.artist?.internalID ?? "",
              })
            ),
            (m) => m.paramValue
          ),

          localSortAndFilter: (artworks, artistIDs: string[]) =>
            filter(artworks, (a) => artistIDs.includes(a.artist?.internalID)),
        },
        {
          displayText: FilterDisplayName.attributionClass,
          filterType: "attributionClass",
          ScreenComponent: "AttributionClassOptionsScreen",

          localSortAndFilter: (artworks, attributionClasses: string[]) => {
            return filter(artworks, (a) => {
              const formattedAttributionClasses = attributionClasses.map((value) =>
                value.toLocaleLowerCase()
              )
              if (a.attributionClass && a.attributionClass.name) {
                return formattedAttributionClasses.includes(
                  a.attributionClass.name.toLocaleLowerCase()
                )
              }
              return false
            })
          },
        },
        {
          displayText: FilterDisplayName.additionalGeneIDs,
          filterType: "additionalGeneIDs",
          ScreenComponent: "AdditionalGeneIDsOptionsScreen",
          values: uniqBy(
            artworks.map(
              (a): FilterData => ({
                displayText: a.mediumType?.name ?? "N/A",
                paramName: FilterParamName.additionalGeneIDs,
                paramValue: a.mediumType?.name ?? undefined,
              })
            ),
            (m) => m.paramValue
          ),

          localSortAndFilter: (artworks, mediums: string[]) => {
            return filter(artworks, (a) => mediums.includes(a.mediumType?.name))
          },
        },
        {
          displayText: FilterDisplayName.priceRange,
          filterType: "priceRange",
          ScreenComponent: "PriceRangeOptionsScreen",

          localSortAndFilter: (artworks, priceRange: string) => {
            const splitRange = priceRange.split("-")
            const lowerBoundStr = splitRange[0]
            const upperBoundStr = splitRange[1]

            let lowerBound = 0
            let upperBound = Number.POSITIVE_INFINITY

            const parsedLower = parseInt(lowerBoundStr, 10)
            const parsedUpper = parseInt(upperBoundStr, 10)

            if (!isNaN(parsedLower)) {
              lowerBound = parsedLower
            }

            if (!isNaN(parsedUpper)) {
              upperBound = parsedUpper
            }

            return filter(artworks, (a) => {
              if (isNaN(a.pricePaid?.minor)) {
                return false
              }
              const pricePaid = a.pricePaid?.minor / 100
              return pricePaid >= lowerBound && pricePaid <= upperBound
            })
          },
        },
        {
          displayText: FilterDisplayName.sizes,
          filterType: "sizes",
          ScreenComponent: "SizesOptionsScreen",

          localSortAndFilter: (
            artworks,
            sizeParams: {
              paramName: FilterParamName.width | FilterParamName.height | FilterParamName.sizes
              paramValue: string
            }
          ) => {
            if (sizeParams.paramName === "sizes") {
              return filter(artworks, (a) => {
                const size: string = a.sizeBucket
                return sizeParams.paramValue.includes(size.toUpperCase())
              })
            } else {
              const splitRange = sizeParams.paramValue.split("-")
              const lowerBoundStr = splitRange[0]
              const upperBoundStr = splitRange[1]

              let lowerBound = 0
              let upperBound = Number.POSITIVE_INFINITY

              const parsedLower = parseInt(lowerBoundStr, 10)
              const parsedUpper = parseInt(upperBoundStr, 10)

              if (!isNaN(parsedLower)) {
                lowerBound = parsedLower
              }

              if (!isNaN(parsedUpper)) {
                upperBound = parsedUpper
              }

              return filter(artworks, (a) => {
                const targetMetric = sizeParams.paramName === "width" ? a.width : a.height
                if (isNaN(targetMetric)) {
                  return false
                }
                return targetMetric >= lowerBound && targetMetric <= upperBound
              })
            }
          },
        },
      ])
    )
  }
  useEffect(() => {
    if (artworksList) {
      initLocalArtworkFilter(artworksList)
    }
  }, [])

  return { reInitializeLocalArtworkFilter: initLocalArtworkFilter }
}

export const localSortAndFilterArtworks = (
  artworks: MyCollectionArtworkEdge[],
  appliedFiltersState: FilterArray,
  filterOptions: FilterDisplayConfig[] | undefined,
  keywordFilter: string
) => {
  let processedArtworks = artworks

  const filtering = uniqBy(
    appliedFiltersState.filter((x) => x.paramName !== FilterParamName.sort),
    (f) => f.paramName
  )

  // custom size filters come back with a different type, consolidate to one
  const sizeFilterTypes = [FilterParamName.width, FilterParamName.height, FilterParamName.sizes]

  filtering.forEach((filter) => {
    if (sizeFilterTypes.includes(filter.paramName)) {
      /*
       * Custom handling for size filter
       * 2 flavors:
       * a sizeRange representing either a width or height restriction OR
       * 1 or more size bucket names which should be matched against artwork values
       * pass the paramName so we can distinguish how to handle in the step
       */
      const sizeFilterParamName = FilterParamName.sizes
      const sizeFilterStep = (filterOptions ?? []).find(
        (f) => f.filterType === sizeFilterParamName
      )!.localSortAndFilter!
      processedArtworks = sizeFilterStep(processedArtworks, {
        paramValue: filter.paramValue,
        paramName: filter.paramName,
      })
    } else {
      const filterStep = (filterOptions ?? []).find((f) => f.filterType === filter.paramName)!
        .localSortAndFilter!
      processedArtworks = filterStep(processedArtworks, filter.paramValue)
    }
  })

  const sorting = appliedFiltersState.filter((x) => x.paramName === FilterParamName.sort)
  if (sorting.length > 0) {
    const sortStep = sorting[0].localSortAndFilter!
    processedArtworks = sortStep(processedArtworks)
  }

  return filterArtworksByKeyword(processedArtworks, keywordFilter)
}

export const filterArtworksByKeyword = (
  artworks: MyCollectionArtworkEdge[],
  keywordFilter: string
) => {
  const normalizedKeywordFilter = normalizeText(keywordFilter)

  if (!normalizedKeywordFilter) {
    return artworks
  }

  const keywordFilterWords = normalizedKeywordFilter.split(" ")

  const doAllKeywordFiltersMatch = (artwork: MyCollectionArtworkEdge) =>
    keywordFilterWords.filter(
      (word) =>
        !normalizeText(artwork?.title ?? "").includes(word) &&
        !normalizeText(artwork?.artist?.name ?? "").includes(word)
    ).length === 0

  return artworks.filter(doAllKeywordFiltersMatch)
}
