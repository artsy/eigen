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
  const priceRangeValue = criteria[FilterParamName.priceRange]

  if (!isNil(priceRangeValue)) {
    const { min, max } = parseRange(priceRangeValue)

    if (min !== "*" || max !== "*") {
      return {
        displayText: parsePriceRangeLabel(min, max),
        paramValue: `${min}-${max}`,
        paramName: FilterParamName.priceRange,
      }
    }
  }

  return null
}

export const convertCustomSizeToFilterParamByName = (paramName: FilterParamName, range: string) => {
  const { min, max } = parseRange(range)
  const widthMinLocalized = localizeDimension(min, "in")
  const widthMaxLocalized = localizeDimension(max, "in")

  return {
    displayText: `${widthMinLocalized.value}-${widthMaxLocalized.value}`,
    paramValue: `${min}-${max}`,
    paramName,
  }
}

export const convertSizeToFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] | null => {
  const filterParams: FilterData[] = []
  const dimensionRangeValue = criteria[FilterParamName.dimensionRange]
  const widthValue = criteria[FilterParamName.width]
  const heightValue = criteria[FilterParamName.height]

  if (!isNil(dimensionRangeValue)) {
    const sizeOptionItem = SIZE_OPTIONS.find((option) => option.paramValue === dimensionRangeValue)

    if (sizeOptionItem) {
      filterParams.push(sizeOptionItem)
    }
  }

  // Parse custom width size
  if (!isNil(widthValue)) {
    filterParams.push(convertCustomSizeToFilterParamByName(FilterParamName.width, widthValue))
  }

  // Parse custom height size
  if (!isNil(heightValue)) {
    filterParams.push(convertCustomSizeToFilterParamByName(FilterParamName.height, heightValue))
  }

  if (filterParams.length > 0) {
    return filterParams
  }

  return null
}

export const convertColorsToFilterParam = (
  criteria: SearchCriteriaAttributes,
  aggregation: AggregationByFilterParamName
): FilterData | null => {
  const colorsValue = criteria[FilterParamName.colors]

  if (!isNil(colorsValue)) {
    const colorFromAggregationByValue = keyBy(aggregation[FilterParamName.colors], "value")
    const availableColors = colorsValue.filter((color) => !!colorFromAggregationByValue[color])
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
  const attributionValue = criteria[FilterParamName.attributionClass]

  if (!isNil(attributionValue)) {
    const attributionItemByValue = keyBy(ATTRIBUTION_CLASS_OPTIONS, "paramValue")
    const availableAttributions = attributionValue.filter((attribution) => !!attributionItemByValue[attribution])
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
