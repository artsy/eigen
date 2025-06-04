import {
  Aggregation,
  Aggregations,
  FilterData,
  filterKeyFromAggregation,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { COLORS_INDEXED_BY_VALUE } from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { getSizeOptions } from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"

import { WAYS_TO_BUY_OPTIONS } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { parsePriceRangeLabel, parseRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { unsafe_getLocalizedUnit } from "app/store/GlobalStore"
import { compact, Dictionary, isNil, keyBy, mapValues } from "lodash"
import { FALLBACK_SIZE_OPTIONS, shouldExtractValueNamesFromAggregation } from "./constants"
import { SearchCriteria, SearchCriteriaAttributes } from "./types"

export type AggregationByFilterParamName = Dictionary<Aggregation[]>

export const convertPriceToFilterParam = (
  criteria: SearchCriteriaAttributes
): FilterData | null => {
  const priceRangeValue = criteria[SearchCriteria.priceRange]

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

  return {
    displayText: `${min}-${max}`,
    paramValue: `${min}-${max}`,
    paramName,
  }
}

export const convertSizeToFilterParams = (
  criteria: SearchCriteriaAttributes
): FilterData[] | null => {
  const filterParams: FilterData[] = []
  const dimensionRangeValue = criteria.dimensionRange
  const widthValue = criteria[SearchCriteria.width]
  const heightValue = criteria[SearchCriteria.height]
  const sizesValues = criteria[SearchCriteria.sizes]

  // Convert old size filter format to new
  if (!isNil(dimensionRangeValue) && dimensionRangeValue !== "0-*") {
    const sizeOptionItem = FALLBACK_SIZE_OPTIONS.find(
      (option) => option.oldParamValue === dimensionRangeValue
    )

    if (sizeOptionItem) {
      filterParams.push({
        displayText: sizeOptionItem.displayText,
        paramValue: [sizeOptionItem.newParamValue],
        paramName: FilterParamName.sizes,
      })
    }
  }

  if (Array.isArray(sizesValues)) {
    const sizeOptions = sizesValues.map((sizeValue) => {
      const unit = unsafe_getLocalizedUnit() || "in"
      const SIZES_OPTIONS = getSizeOptions(unit)

      return SIZES_OPTIONS.find((sizeOption) => sizeOption.paramValue === sizeValue)
    })
    const filledSizeOptions = compact(sizeOptions)

    if (filledSizeOptions.length > 0) {
      filterParams.push({
        displayText: filledSizeOptions.map((sizeOption) => sizeOption.displayText).join(", "),
        paramValue: filledSizeOptions.map((sizeOption) => sizeOption.paramValue) as string[],
        paramName: FilterParamName.sizes,
      })
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
  _aggregation: AggregationByFilterParamName = {}
): FilterData | null => {
  const availableColors = criteria[SearchCriteria.colors]

  if (Array.isArray(availableColors) && availableColors.length > 0) {
    const validColors = availableColors.filter((color) => !!COLORS_INDEXED_BY_VALUE[color])
    const validColorsNames = validColors.map((color) => COLORS_INDEXED_BY_VALUE[color].name)
    const validColorsValues = validColors.map((color) => COLORS_INDEXED_BY_VALUE[color].value)

    if (validColorsNames.length > 0) {
      return {
        displayText: validColorsNames.join(", "),
        paramValue: validColorsValues,
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

  const availableValues = criteriaValues.filter(
    (criteriaValue) => !!aggregationByValue[criteriaValue]
  )
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

export const convertAttributionToFilterParam = (
  criteria: SearchCriteriaAttributes
): FilterData | null => {
  const attributionValues = criteria[SearchCriteria.attributionClass]

  if (Array.isArray(attributionValues) && attributionValues.length > 0) {
    const attributionItemByValue = keyBy(ATTRIBUTION_CLASS_OPTIONS, "paramValue")
    const availableAttributions = attributionValues.filter(
      (attribution) => !!attributionItemByValue[attribution]
    )
    const names = availableAttributions.map(
      (attribution) => attributionItemByValue[attribution].displayText
    )

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

export const convertWaysToBuyToFilterParams = (
  criteria: SearchCriteriaAttributes
): FilterData[] | null => {
  const options = WAYS_TO_BUY_OPTIONS.filter((option) => {
    return !isNil(criteria[option.paramName as unknown as SearchCriteria])
  })

  if (options.length > 0) {
    return options.map((option) => ({
      ...option,
      paramValue: !!criteria[option.paramName as unknown as SearchCriteria],
    }))
  }

  return null
}

export const convertMajorPeriodToFilterParam = (
  criteria: SearchCriteriaAttributes
): FilterData | null => {
  const periods = criteria[SearchCriteria.majorPeriods]

  if (Array.isArray(periods) && periods.length > 0) {
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
): FilterData[] => {
  let filterParams: FilterData[] = []
  const aggregationByFilterParamName = keyBy(
    aggregations,
    (aggregation) => filterKeyFromAggregation[aggregation.slice]
  )
  const aggregationValueByFilterParamName = mapValues(
    aggregationByFilterParamName,
    "counts"
  ) as AggregationByFilterParamName

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
    const criteriaValue = (criteria[filterParamName] as string[]) || []

    if (aggregationValue) {
      const filterParamItem = convertAggregationValueNamesToFilterParam(
        filterParamName as unknown as FilterParamName,
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
