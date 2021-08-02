import {
  aggregationForFilter,
  Aggregations,
  extractCustomSizeLabel,
  FilterArray,
  FilterData,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { shouldExtractValueNamesFromAggregation } from "lib/Components/ArtworkFilter/SavedSearch/constants"
import { compact, flatten, keyBy } from "lodash"

const applyCustomExtractorForFilterParams: FilterParamName[] = [
  FilterParamName.dimensionRange,
  FilterParamName.width,
  FilterParamName.height,
]

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

export const extractSizePill = (filters: FilterArray) => {
  const label = extractCustomSizeLabel(filters)

  if (label) {
    return label
  }

  return filters.find((filter) => filter.paramName === FilterParamName.dimensionRange)?.displayText
}

export const extractPills = (filters: FilterArray, aggregations: Aggregations) => {
  const commonFilters = filters.filter((filter) => !applyCustomExtractorForFilterParams.includes(filter.paramName))

  const sizePill = extractSizePill(filters)
  const pills = commonFilters.map((filter) => {
    const { displayText, paramValue, paramName } = filter

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

  return compact([...flatten(pills), sizePill])
}
