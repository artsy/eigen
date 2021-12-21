import {
  aggregationForFilter,
  Aggregations,
  defaultCommonFilterOptions,
  FilterArray,
  FilterData,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { LOCALIZED_UNIT, parseRange } from "lib/Components/ArtworkFilter/Filters/helpers"
import { WAYS_TO_BUY_OPTIONS } from "lib/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { shouldExtractValueNamesFromAggregation } from "lib/Components/ArtworkFilter/SavedSearch/constants"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { compact, flatten, groupBy, isUndefined, keyBy } from "lodash"
import { bullet } from "palette"
import { SavedSearchPill } from "./SavedSearchAlertModel"

export const extractPillFromAggregation = (filter: FilterData, aggregations: Aggregations) => {
  const { paramName, paramValue } = filter
  const aggregation = aggregationForFilter(paramName, aggregations)

  if (aggregation) {
    const aggregationByValue = keyBy(aggregation.counts, "value")

    return (paramValue as string[]).map((value) => {
      if (!isUndefined(aggregationByValue[value])) {
        return {
          label: aggregationByValue[value]?.name,
          value,
          paramName,
        } as SavedSearchPill
      }
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

export const extractPills = (filters: FilterArray, aggregations: Aggregations): SavedSearchPill[] => {
  const pills = filters.map((filter) => {
    const { paramName, paramValue, displayText } = filter

    if (isUndefined(paramValue)) {
      return null
    }

    if (paramName === FilterParamName.width) {
      return {
        label: extractSizeLabel("w", displayText),
        value: paramValue as string,
        paramName: FilterParamName.width,
      }
    }

    if (paramName === FilterParamName.height) {
      return {
        label: extractSizeLabel("h", displayText),
        value: paramValue as string,
        paramName: FilterParamName.height,
      }
    }

    // Extract label from aggregations
    if (shouldExtractValueNamesFromAggregation.includes(paramName)) {
      return extractPillFromAggregation(filter, aggregations)
    }

    const waysToBuyOption = WAYS_TO_BUY_OPTIONS.find((option) => option.paramName === paramName)

    if (waysToBuyOption) {
      return {
        label: waysToBuyOption.displayText,
        value: true,
        paramName,
      }
    }

    // If the filter value is an array, then we extract the label from the displayed text
    if (Array.isArray(paramValue)) {
      return displayText.split(", ").map((label, index) => {
        return {
          label,
          value: paramValue[index],
          paramName,
        }
      })
    }

    return {
      label: displayText,
      value: paramValue,
      paramName,
    }
  })

  return compact(flatten(pills))
}

export const getNamePlaceholder = (artistName: string, pills: SavedSearchPill[]) => {
  const filtersCountLabel = pills.length > 1 ? "filters" : "filter"
  return `${artistName} ${bullet} ${pills.length} ${filtersCountLabel}`
}

export const extractPillValue = (pills: SavedSearchPill[]) => {
  return pills.map((pill) => pill.value)
}

export const getSearchCriteriaFromPills = (pills: SavedSearchPill[]) => {
  const pillsByParamName = groupBy(pills, "paramName")
  const criteria: SearchCriteriaAttributes = {}

  Object.entries(pillsByParamName).forEach((entry) => {
    const [paramName, values] = entry

    if (paramName === FilterParamName.artistIDs) {
      criteria.artistID = extractPillValue(values)[0] as string
      return
    }

    if (Array.isArray(defaultCommonFilterOptions[paramName as FilterParamName])) {
      criteria[paramName as keyof SearchCriteriaAttributes] = extractPillValue(values) as any
      return
    }

    criteria[paramName as keyof SearchCriteriaAttributes] = extractPillValue(values)[0] as any
  })

  return criteria
}
