import { HistogramBarEntity } from "@artsy/palette-mobile"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { DEFAULT_RANGE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"
import { sortBy } from "lodash"

export const convertToFilterFormatRange = (range: number[]): PriceRange => {
  return range.map((value, index) => {
    if (value === DEFAULT_RANGE[index]) {
      return "*"
    }

    return value
  })
}

export const getInputValue = (value: PriceRange[number]) => {
  return value === "*" || value === 0 ? "" : value.toString()
}

export const parseSliderRange = (range: PriceRange): number[] => {
  return range.map((value, index) => {
    if (value === "*") {
      return DEFAULT_RANGE[index]
    }

    return value as number
  })
}

export const getBarsFromAggregations = (aggregations?: Aggregations) => {
  const histogramAggregation = aggregations?.find(
    (aggregation) => aggregation.slice === "SIMPLE_PRICE_HISTOGRAM"
  )
  const counts = histogramAggregation?.counts ?? []
  const bars: HistogramBarEntity[] = counts.map((entity) => ({
    count: entity.count,
    value: Number(entity.value),
  }))
  const sortedBars = sortBy(bars, "value")

  return sortedBars
}

/** True when both ends are set and the max is lower than the min, e.g. $200–$199 */
export const isPriceRangeInverted = ([min, max]: PriceRange) => {
  return typeof min === "number" && typeof max === "number" && max < min
}

export const INVERTED_PRICE_RANGE_ERROR = "Max price must be higher than min price"
