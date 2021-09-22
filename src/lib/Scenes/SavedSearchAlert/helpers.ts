import {
  aggregationForFilter,
  Aggregations,
  FilterArray,
  FilterData,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { LOCALIZED_UNIT, parseRange } from "lib/Components/ArtworkFilter/Filters/helpers"
import { shouldExtractValueNamesFromAggregation } from "lib/Components/ArtworkFilter/SavedSearch/constants"
import { compact, flatten, keyBy } from "lodash"
import { bullet } from "palette"

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

export const extractSizeLabel = (prefix: string, value: string) => {
  const { min, max } = parseRange(value)
  let label

  if (max === "*") {
    label = `from ${min}`
  } else if (min === "*") {
    label = `to ${max}`
  } else {
    label = `${min}-${max}`
  }

  return `${prefix}: ${label} ${LOCALIZED_UNIT}`
}

export const extractPills = (filters: FilterArray, aggregations: Aggregations) => {
  const pills = filters.map((filter) => {
    const { paramName, paramValue, displayText } = filter

    if (paramName === FilterParamName.dimensionRange && displayText === "Custom Size") {
      return null
    }

    if (paramName === FilterParamName.width) {
      return extractSizeLabel("w", displayText)
    }

    if (paramName === FilterParamName.height) {
      return extractSizeLabel("h", displayText)
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

  return compact(flatten(pills))
}

export const getNamePlaceholder = (artistName: string, pills: string[]) => {
  const filtersCountLabel = pills.length > 1 ? "filters" : "filter"
  return `${artistName} ${bullet} ${pills.length} ${filtersCountLabel}`
}
