import {
  aggregationForFilter,
  Aggregations,
  FilterArray,
  FilterData,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ATTRIBUTION_CLASS_OPTIONS } from "lib/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { COLORS_INDEXED_BY_VALUE } from "lib/Components/ArtworkFilter/Filters/ColorsOptions"
import {
  LOCALIZED_UNIT,
  localizeDimension,
  parsePriceRangeLabel,
  parseRange,
} from "lib/Components/ArtworkFilter/Filters/helpers"
import { SIZES_OPTIONS } from "lib/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { WAYS_TO_BUY_OPTIONS, WAYS_TO_BUY_PARAM_NAMES } from "lib/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { shouldExtractValueNamesFromAggregation } from "lib/Components/ArtworkFilter/SavedSearch/constants"
import { compact, flatten, isUndefined, keyBy } from "lodash"
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
  const range = parseRange(value)
  const min = localizeDimension(range.min, "in").value
  const max = localizeDimension(range.max, "in").value
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

export const extractSizesPill = (filter: FilterData): SavedSearchPill[] => {
  return (filter.paramValue as string[]).map((value) => {
    const sizeOption = SIZES_OPTIONS.find((option) => option.paramValue === value)

    return {
      label: sizeOption?.displayText ?? "",
      value,
      paramName: filter.paramName,
    }
  })
}

export const extractTimePeriodPills = (filter: FilterData): SavedSearchPill[] => {
  return (filter.paramValue as string[]).map((value) => {
    return {
      label: getDisplayNameForTimePeriod(value),
      value,
      paramName: FilterParamName.timePeriod,
    }
  })
}

export const extractColorPills = (filter: FilterData): SavedSearchPill[] => {
  return (filter.paramValue as string[]).map((value) => {
    const colorOption = COLORS_INDEXED_BY_VALUE[value]

    return {
      label: colorOption?.name ?? "",
      value,
      paramName: FilterParamName.colors,
    }
  })
}

export const extractAttributionPills = (filter: FilterData): SavedSearchPill[] => {
  return (filter.paramValue as string[]).map((value) => {
    const colorOption = ATTRIBUTION_CLASS_OPTIONS.find((option) => option.paramValue === value)

    return {
      label: colorOption?.displayText ?? "",
      value,
      paramName: FilterParamName.attributionClass,
    }
  })
}

export const extractPriceRangePill = (filter: FilterData): SavedSearchPill => {
  const { min, max } = parseRange(filter.paramValue as string)

  return {
    label: parsePriceRangeLabel(min, max),
    value: filter.paramValue as string,
    paramName: FilterParamName.priceRange,
  }
}

export const extractWaysToBuyPill = (filter: FilterData): SavedSearchPill => {
  const waysToBuyOption = WAYS_TO_BUY_OPTIONS.find((option) => option.paramName === filter.paramName)

  return {
    label: waysToBuyOption?.displayText ?? "",
    value: true,
    paramName: filter.paramName,
  }
}

export const extractPills = (filters: FilterArray, aggregations: Aggregations): SavedSearchPill[] => {
  const pills = filters.map((filter) => {
    const { paramName, paramValue } = filter

    if (isUndefined(paramValue)) {
      return null
    }

    if (paramName === FilterParamName.width) {
      return {
        label: extractSizeLabel("w", paramValue as string),
        value: paramValue as string,
        paramName: FilterParamName.width,
      }
    }

    if (paramName === FilterParamName.height) {
      return {
        label: extractSizeLabel("h", paramValue as string),
        value: paramValue as string,
        paramName: FilterParamName.height,
      }
    }

    if (paramName === FilterParamName.sizes) {
      return extractSizesPill(filter)
    }

    if (paramName === FilterParamName.timePeriod) {
      return extractTimePeriodPills(filter)
    }

    if (paramName === FilterParamName.colors) {
      return extractColorPills(filter)
    }

    if (paramName === FilterParamName.attributionClass) {
      return extractAttributionPills(filter)
    }

    if (paramName === FilterParamName.priceRange) {
      return extractPriceRangePill(filter)
    }

    // Extract label from aggregations
    if (shouldExtractValueNamesFromAggregation.includes(paramName)) {
      return extractPillFromAggregation(filter, aggregations)
    }

    if (WAYS_TO_BUY_PARAM_NAMES.includes(paramName)) {
      return extractWaysToBuyPill(filter)
    }

    return null
  })

  const flattenedPills = flatten(pills)
  const compactedPills = compact(flattenedPills)
  const preparedPills = compactedPills.filter((pill) => {
    return pill.label !== "" && !isUndefined(pill.value)
  })

  return preparedPills
}

export const extractPillValue = (pills: SavedSearchPill[]) => {
  return pills.map((pill) => pill.value)
}
