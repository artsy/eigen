import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { Dictionary, isNil, isNull, isNumber, keyBy } from "lodash"
import {
  Aggregation,
  AggregationItem,
  Aggregations,
  FilterData,
  filterKeyFromAggregation,
  FilterParamName,
} from "../ArtworkFilterHelpers"
import { DEFAULT_FILTERS } from "../ArtworkFilterStore"
import { ATTRIBUTION_CLASS_OPTIONS } from "../Filters/AttributionClassOptions"
import { COLORS } from "../Filters/ColorsOptions"
import { localizeDimension, Numeric, parsePriceRangeLabel, parseRange } from "../Filters/helpers"
import { SIZE_OPTIONS } from "../Filters/SizeOptions"
import { WAYS_TO_BUY_FILTER_PARAM_NAMES } from "../Filters/WaysToBuyOptions"

type SearchCriteriaAttributeKeys = keyof SearchCriteriaAttributes

export const parsePriceForFilterParams = (criteria: SearchCriteriaAttributes): FilterData | null => {
  let parsedPriceMin: Numeric = "*"
  let parsedPriceMax: Numeric = "*"

  if (isNumber(criteria.priceMin)) {
    parsedPriceMin = criteria.priceMin
  }
  if (isNumber(criteria.priceMax)) {
    parsedPriceMax = criteria.priceMax
  }

  if (parsedPriceMin !== "*" || parsedPriceMax !== "*") {
    return {
      displayText: parsePriceRangeLabel(parsedPriceMin, parsedPriceMax),
      paramValue: `${parsedPriceMin}-${parsedPriceMax}`,
      paramName: FilterParamName.priceRange,
    }
  }

  return null
}

export const parseCustomSizeFilterParamByName = (
  paramName: FilterParamName,
  min: number | null,
  max: number | null
) => {
  const minSizeValue = min ?? "*"
  const maxSizeValue = max ?? "*"
  const widthMinLocalized = localizeDimension(minSizeValue, "in")
  const widthMaxLocalized = localizeDimension(maxSizeValue, "in")

  return {
    displayText: `${widthMinLocalized.value}-${widthMaxLocalized.value}`,
    paramValue: `${minSizeValue}-${maxSizeValue}`,
    paramName,
  }
}

export const parseSizeForFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] => {
  // Parse predefined size
  if (isNumber(criteria.dimensionScoreMin) || isNumber(criteria.dimensionScoreMax)) {
    const dimensionScoreMin = criteria.dimensionScoreMin ?? "*"
    const dimensionScoreMax = criteria.dimensionScoreMax ?? "*"

    const sizeOptionItem = SIZE_OPTIONS.find((option) => {
      const { min, max } = parseRange(option.paramValue as string)
      return min === dimensionScoreMin && max === dimensionScoreMax
    })

    if (sizeOptionItem) {
      return [sizeOptionItem]
    }
  }

  const customFilterParams: FilterData[] = []

  // Parse custom width size
  if (isNumber(criteria.widthMin) || isNumber(criteria.widthMax)) {
    const filterParamItem = parseCustomSizeFilterParamByName(
      FilterParamName.width,
      criteria.widthMin!,
      criteria.widthMax!
    )
    customFilterParams.push(filterParamItem)
  }

  // Parse custom height size
  if (isNumber(criteria.heightMin) || isNumber(criteria.heightMax)) {
    const filterParamItem = parseCustomSizeFilterParamByName(
      FilterParamName.height,
      criteria.heightMin!,
      criteria.heightMax!
    )
    customFilterParams.push(filterParamItem)
  }

  // If we has custom width or size then we set the custom size mode for the size filter
  if (customFilterParams.length > 0) {
    customFilterParams.push({
      displayText: "Custom size",
      paramValue: "0-*",
      paramName: FilterParamName.dimensionRange,
    })

    return customFilterParams
  }

  // Size filter value by default
  return [
    {
      displayText: "All",
      paramValue: "*-*",
      paramName: FilterParamName.dimensionRange,
    },
  ]
}

export const parseColorsForFilterParams = (criteria: SearchCriteriaAttributes): FilterData | null => {
  if (!isNil(criteria.colors)) {
    const colorItemByValue = keyBy(COLORS, "value")
    const availableColors = criteria.colors.filter((color) => !!colorItemByValue[color])
    const colorNames = availableColors.map((color) => colorItemByValue[color].name)

    if (availableColors.length > 0) {
      return {
        displayText: colorNames.join(", "),
        paramValue: availableColors,
        paramName: FilterParamName.colors,
      }
    }
  }

  return null
}

export const parseAggregationValueNamesForFilterParams = (
  paramName: FilterParamName,
  aggregations: Aggregation[],
  criteriaValues: string[]
): FilterData | null => {
  const aggregationValueByName = keyBy(aggregations, "value")
  const availableValues = criteriaValues.filter((criteriaValue) => !!aggregationValueByName[criteriaValue])
  const names = availableValues.map((value) => aggregationValueByName[value].name)

  if (availableValues.length > 0) {
    return {
      displayText: names.join(", "),
      paramValue: availableValues,
      paramName,
    }
  }

  return null
}

export const parseAttributionClassesForFilterParams = (criteria: SearchCriteriaAttributes): FilterData | null => {
  if (!isNil(criteria.attributionClasses)) {
    const attributionItemByValue = keyBy(ATTRIBUTION_CLASS_OPTIONS, "paramValue")
    const availableAttributions = criteria.attributionClasses.filter(
      (attribution) => !!attributionItemByValue[attribution]
    )
    const names = availableAttributions.map((attribution) => attributionItemByValue[attribution].displayText)

    if (availableAttributions.length > 0) {
      return {
        displayText: names.join(", "),
        paramValue: availableAttributions,
        paramName: FilterParamName.attributionClass,
      }
    }
  }

  return null
}

export const parseWaysToBuyForFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] | null => {
  const defautFilterParamByName = keyBy(DEFAULT_FILTERS, "paramName")
  const availableWaysToBuyFilterParamNames = WAYS_TO_BUY_FILTER_PARAM_NAMES.filter(
    (filterParamName) => !isNil(criteria[filterParamName as SearchCriteriaAttributeKeys])
  )

  if (availableWaysToBuyFilterParamNames.length > 0) {
    return availableWaysToBuyFilterParamNames.map((filterParamName) => ({
      displayText: defautFilterParamByName[filterParamName].displayText,
      paramValue: criteria[filterParamName as SearchCriteriaAttributeKeys]!,
      paramName: filterParamName,
    }))
  }

  return null
}

export const parseSavedSearchCriteriaForFilterParams = (
  criteria: SearchCriteriaAttributes,
  aggregations: Aggregations
) => {
  let filterParams: FilterData[] = []
  const aggregationByFilterParamName = keyBy(
    aggregations,
    (aggregation) => filterKeyFromAggregation[aggregation.slice]
  ) as Dictionary<AggregationItem>
  const shouldParseValueNamesFromAggregations: Partial<Record<SearchCriteriaAttributeKeys, FilterParamName>> = {
    locationCities: FilterParamName.locationCities,
    majorPeriods: FilterParamName.timePeriod,
    materialsTerms: FilterParamName.materialsTerms,
    additionalGeneIDs: FilterParamName.additionalGeneIDs,
    partnerIDs: FilterParamName.partnerIDs,
  }

  const parserHandlers = [
    parsePriceForFilterParams,
    parseSizeForFilterParams,
    parseColorsForFilterParams,
    parseAttributionClassesForFilterParams,
    parseWaysToBuyForFilterParams,
  ]

  parserHandlers.forEach((parserHandler) => {
    const filterParamItem = parserHandler(criteria)

    if (filterParamItem) {
      filterParams = filterParams.concat(filterParamItem)
    }
  })

  Object.entries(criteria).forEach((entry) => {
    const [key, value] = entry as [SearchCriteriaAttributeKeys, any]

    if (!isNull(value)) {
      const filterParamName = shouldParseValueNamesFromAggregations[key]
      const aggregationValue = filterParamName && aggregationByFilterParamName[filterParamName]

      // Should get value names from aggregation
      if (filterParamName && aggregationValue) {
        const filterParamItem = parseAggregationValueNamesForFilterParams(
          filterParamName,
          aggregationValue.counts,
          value
        )

        if (filterParamItem) {
          filterParams = filterParams.concat(filterParamItem)
        }
      }
    }
  })

  return filterParams
}
