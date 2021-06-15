import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { isNumber } from "lodash"
import { FilterData, FilterParamName } from "../ArtworkFilterHelpers"
import { localizeDimension, Numeric, parsePriceRangeLabel, parseRange } from "../Filters/helpers"
import { SIZE_OPTIONS } from "../Filters/SizeOptions"

export const parsePriceForFilterParams = (priceMin: number | null, priceMax: number | null): FilterData => {
  let parsedPriceMin: Numeric = "*"
  let parsedPriceMax: Numeric = "*"
  let paramValue = "*-*"
  let displayText = "All"

  if (isNumber(priceMin)) {
    parsedPriceMin = priceMin
  }
  if (isNumber(priceMax)) {
    parsedPriceMax = priceMax
  }

  if (parsedPriceMin !== "*" || parsedPriceMax !== "*") {
    displayText = parsePriceRangeLabel(parsedPriceMin, parsedPriceMax)
    paramValue = `${parsedPriceMin}-${parsedPriceMax}`
  }

  return {
    displayText,
    paramValue,
    paramName: FilterParamName.priceRange,
  }
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
