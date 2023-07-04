import { HistogramBarEntity } from "@artsy/palette-mobile"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { sortBy } from "lodash"

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
