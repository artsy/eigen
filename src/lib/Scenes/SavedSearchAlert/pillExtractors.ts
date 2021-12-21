import {
  aggregationForFilter,
  Aggregations,
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
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { compact, flatten, isNil, isUndefined, keyBy } from "lodash"
import { SavedSearchPill } from "./SavedSearchAlertModel"

export const extractPillFromAggregation = (
  paramName: FilterParamName,
  values: string[],
  aggregations: Aggregations
) => {
  const aggregation = aggregationForFilter(paramName, aggregations)

  if (aggregation) {
    const aggregationByValue = keyBy(aggregation.counts, "value")

    return values.map((value) => {
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

export const extractSizesPill = (values: string[]): SavedSearchPill[] => {
  return values.map((value) => {
    const sizeOption = SIZES_OPTIONS.find((option) => option.paramValue === value)

    return {
      label: sizeOption?.displayText ?? "",
      value,
      paramName: FilterParamName.sizes,
    }
  })
}

export const extractTimePeriodPills = (values: string[]): SavedSearchPill[] => {
  return values.map((value) => {
    return {
      label: getDisplayNameForTimePeriod(value),
      value,
      paramName: FilterParamName.timePeriod,
    }
  })
}

export const extractColorPills = (values: string[]): SavedSearchPill[] => {
  return values.map((value) => {
    const colorOption = COLORS_INDEXED_BY_VALUE[value]

    return {
      label: colorOption?.name ?? "",
      value,
      paramName: FilterParamName.colors,
    }
  })
}

export const extractAttributionPills = (values: string[]): SavedSearchPill[] => {
  return values.map((value) => {
    const colorOption = ATTRIBUTION_CLASS_OPTIONS.find((option) => option.paramValue === value)

    return {
      label: colorOption?.displayText ?? "",
      value,
      paramName: FilterParamName.attributionClass,
    }
  })
}

export const extractPriceRangePill = (value: string): SavedSearchPill => {
  const { min, max } = parseRange(value)

  return {
    label: parsePriceRangeLabel(min, max),
    value,
    paramName: FilterParamName.priceRange,
  }
}

export const extractWaysToBuyPill = (paramName: FilterParamName): SavedSearchPill => {
  const waysToBuyOption = WAYS_TO_BUY_OPTIONS.find((option) => option.paramName === paramName)

  return {
    label: waysToBuyOption?.displayText ?? "",
    value: true,
    paramName,
  }
}

export const extractPills = (attributes: SearchCriteriaAttributes, aggregations: Aggregations): SavedSearchPill[] => {
  const pills = Object.entries(attributes).map((entry) => {
    const [paramName, paramValue] = entry

    if (isNil(paramValue)) {
      return null
    }

    if (paramName === FilterParamName.width) {
      return {
        label: extractSizeLabel("w", paramValue),
        value: paramValue,
        paramName: FilterParamName.width,
      }
    }

    if (paramName === FilterParamName.height) {
      return {
        label: extractSizeLabel("h", paramValue),
        value: paramValue,
        paramName: FilterParamName.height,
      }
    }

    if (paramName === FilterParamName.sizes) {
      return extractSizesPill(paramValue)
    }

    if (paramName === FilterParamName.timePeriod) {
      return extractTimePeriodPills(paramValue)
    }

    if (paramName === FilterParamName.colors) {
      return extractColorPills(paramValue)
    }

    if (paramName === FilterParamName.attributionClass) {
      return extractAttributionPills(paramValue)
    }

    if (paramName === FilterParamName.priceRange) {
      return extractPriceRangePill(paramValue)
    }

    // Extract label from aggregations
    if (shouldExtractValueNamesFromAggregation.includes(paramName as FilterParamName)) {
      return extractPillFromAggregation(paramName as FilterParamName, paramValue, aggregations)
    }

    if (WAYS_TO_BUY_PARAM_NAMES.includes(paramName as FilterParamName)) {
      return extractWaysToBuyPill(paramName as FilterParamName)
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
