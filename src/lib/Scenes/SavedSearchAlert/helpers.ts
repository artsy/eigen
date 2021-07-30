import {
  aggregationForFilter,
  Aggregations,
  FilterArray,
  FilterData,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { shouldExtractValueNamesFromAggregation } from "lib/Components/ArtworkFilter/SavedSearch/constants"
import { compact, flatten, keyBy } from "lodash"

export const extractPillFromAggregation = (filter: FilterData, aggregations: Aggregations) => {
  const { paramName, paramValue } = filter
  const aggregation = aggregationForFilter(paramName, aggregations)

  if (aggregation) {
    const aggregationByValue = keyBy(aggregation.counts, "value")

    return (paramValue as string[]).map((value) => {
      return aggregationByValue[value]?.name
    })
  }

  return []
}

export const extractPills = (filters: FilterArray, aggregations: Aggregations) => {
  const pillLabels = filters.map((filter) => {
    const { displayText, paramValue, paramName } = filter

    if (!paramValue) {
      return null
    }

    // Extract label from aggregations
    if (shouldExtractValueNamesFromAggregation.includes(paramName)) {
      return extractPillFromAggregation(filter, aggregations)
    }

    // If the filter value is an array, then we extract the label from the displayed text
    if (Array.isArray(paramValue)) {
      return displayText.split(", ")
    }

    return displayText
  })

  return compact(flatten(pillLabels))
}
