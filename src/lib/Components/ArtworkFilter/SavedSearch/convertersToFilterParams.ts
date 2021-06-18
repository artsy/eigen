import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { Dictionary, isNil, isNumber, keyBy, mapValues } from "lodash"
import {
  Aggregation,
  Aggregations,
  FilterData,
  filterKeyFromAggregation,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "../ArtworkFilterHelpers"
import { DEFAULT_FILTERS } from "../ArtworkFilterStore"
import { ATTRIBUTION_CLASS_OPTIONS } from "../Filters/AttributionClassOptions"
import { COLORS_INDEXED_BY_VALUE } from "../Filters/ColorsOptions"
import { localizeDimension, Numeric, parsePriceRangeLabel, parseRange } from "../Filters/helpers"
import { SIZE_OPTIONS } from "../Filters/SizeOptions"
import { WAYS_TO_BUY_FILTER_PARAM_NAMES } from "../Filters/WaysToBuyOptions"

type SearchCriteriaAttributeKeys = keyof SearchCriteriaAttributes
export type AggregationByFilterParamName = Dictionary<Aggregation[]>

export const convertPriceToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
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

export const convertCustomSizeToFilterParamByName = (
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

export const convertSizeToFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] => {
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
    const filterParamItem = convertCustomSizeToFilterParamByName(
      FilterParamName.width,
      criteria.widthMin!,
      criteria.widthMax!
    )
    customFilterParams.push(filterParamItem)
  }

  // Parse custom height size
  if (isNumber(criteria.heightMin) || isNumber(criteria.heightMax)) {
    const filterParamItem = convertCustomSizeToFilterParamByName(
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

export const convertColorsToFilterParam = (
  criteria: SearchCriteriaAttributes,
  aggregation: AggregationByFilterParamName
): FilterData | null => {
  if (!isNil(criteria.colors)) {
    const colorFromAggregationByValue = keyBy(aggregation[FilterParamName.colors], "value")
    const availableColors = criteria.colors.filter((color) => !!colorFromAggregationByValue[color])
    const colorNames = availableColors.map((color) => COLORS_INDEXED_BY_VALUE[color].name)

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

export const convertAggregationValueNamesToFilterParam = (
  paramName: FilterParamName,
  aggregations: Aggregation[],
  criteriaValues: string[]
): FilterData | null => {
  const aggregationByValue = keyBy(aggregations, "value")
  const availableValues = criteriaValues.filter((criteriaValue) => !!aggregationByValue[criteriaValue])
  const names = availableValues.map((value) => aggregationByValue[value].name)

  if (availableValues.length > 0) {
    return {
      displayText: names.join(", "),
      paramValue: availableValues,
      paramName,
    }
  }

  return null
}

export const convertAttributionToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
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

export const convertWaysToBuyToFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] | null => {
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

export const convertMajorPeriodToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
  const periods = criteria[FilterParamName.timePeriod]

  if (!isNil(periods)) {
    const namedPeriods = periods.map((period) => getDisplayNameForTimePeriod(period))
    return {
      displayText: namedPeriods.join(", "),
      paramValue: periods,
      paramName: FilterParamName.timePeriod,
    }
  }

  return null
}

export const convertSavedSearchCriteriaToFilterParams = (
  criteria: SearchCriteriaAttributes,
  aggregations: Aggregations
) => {
  let filterParams: FilterData[] = []
  const aggregationByFilterParamName = keyBy(aggregations, (aggregation) => filterKeyFromAggregation[aggregation.slice])
  const aggregationValueByFilterParamName = mapValues(
    aggregationByFilterParamName,
    "counts"
  ) as AggregationByFilterParamName
  const shouldExtractValueNamesFromAggregation = [
    FilterParamName.locationCities,
    FilterParamName.materialsTerms,
    FilterParamName.additionalGeneIDs,
    FilterParamName.partnerIDs,
  ]

  const converters = [
    convertPriceToFilterParam,
    convertSizeToFilterParams,
    convertColorsToFilterParam,
    convertAttributionToFilterParam,
    convertWaysToBuyToFilterParams,
    convertMajorPeriodToFilterParam,
  ]

  converters.forEach((converter) => {
    const filterParamItem = converter(criteria, aggregationValueByFilterParamName)

    if (filterParamItem) {
      filterParams = filterParams.concat(filterParamItem)
    }
  })

  // Extract value names from aggregation
  shouldExtractValueNamesFromAggregation.forEach((filterParamName) => {
    const aggregationValue = aggregationValueByFilterParamName[filterParamName]
    const criteriaValue = criteria[filterParamName as SearchCriteriaAttributeKeys] as string[]

    if (aggregationValue) {
      const filterParamItem = convertAggregationValueNamesToFilterParam(
        filterParamName,
        aggregationValue,
        criteriaValue
      )

      if (filterParamItem) {
        filterParams = filterParams.concat(filterParamItem)
      }
    }
  })

  return filterParams
}
