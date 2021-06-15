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

export const parseSizeForFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] => {
  const dimensionScoreMin = criteria.dimensionScoreMin ?? "*"
  const dimensionScoreMax = criteria.dimensionScoreMax ?? "*"

  // Skip default size option (use case "*-*")
  if (dimensionScoreMin !== "*" || dimensionScoreMax !== "*") {
    const sizeOptionItem = SIZE_OPTIONS.find((option) => {
      const { min, max } = parseRange(option.paramValue as string)
      return min === dimensionScoreMin && max === dimensionScoreMax
    })

    if (sizeOptionItem) {
      return [sizeOptionItem]
    }
  }

  const filterParams: FilterData[] = []

  // Parse custom width size
  if (isNumber(criteria.widthMin) || isNumber(criteria.widthMax)) {
    const widthMin = criteria.widthMin ?? "*"
    const widthMax = criteria.widthMax ?? "*"
    const widthMinLocalized = localizeDimension(widthMin, "in")
    const widthMaxLocalized = localizeDimension(widthMax, "in")

    filterParams.push({
      displayText: `${widthMinLocalized.value}-${widthMaxLocalized.value}`,
      paramValue: `${widthMin}-${widthMax}`,
      paramName: FilterParamName.width,
    })
  }

  // Parse custom height size
  if (isNumber(criteria.heightMin) || isNumber(criteria.heightMax)) {
    const heightMin = criteria.heightMin ?? "*"
    const heightMax = criteria.heightMax ?? "*"
    const heightMinLocalized = localizeDimension(heightMin, "in")
    const heightMaxLocalized = localizeDimension(heightMax, "in")

    filterParams.push({
      displayText: `${heightMinLocalized.value}-${heightMaxLocalized.value}`,
      paramValue: `${heightMin}-${heightMax}`,
      paramName: FilterParamName.height,
    })
  }

  // If we has custom width or size then we set the custom size mode for the size filter
  if (filterParams.length > 0) {
    filterParams.push({
      displayText: "Custom size",
      paramValue: "0-*",
      paramName: FilterParamName.dimensionRange,
    })

    return filterParams
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
