import { SearchCriteriaAttributes } from "__generated__/ArtistArtworksContainerCreateSavedSearchMutation.graphql"
import { isEqual } from "lodash"
import { defaultCommonFilterOptions, FilterParamName, FilterParams } from "./ArtworkFilterHelpers"
import { parseRangeByKeys } from "./Filters/helpers"

type SaveSearchHandler = (key: FilterParamName, value: any, params: FilterParams) => SearchCriteriaAttributes

type SaveSearchHandlerArgs = (
  ...args: any[]
) => (key: FilterParamName, value: any, params: FilterParams) => SearchCriteriaAttributes

interface SaveSearchItemHander {
  forKey: FilterParamName
  handler: SaveSearchHandler
}

export const justResend: SaveSearchHandlerArgs = () => (key, value) => ({
  [key]: value,
})

export const canSendIfNotEqualByDefault: SaveSearchHandlerArgs = () => (key, value) => {
  if (!isEqual(defaultCommonFilterOptions[key], value)) {
    return {
      [key]: value,
    }
  }

  return {}
}

export const parseFilledRangeByKeys = (range: string, minKey: string, maxKey: string) => {
  const filledRange: Record<string, number> = {}
  const parsedRange = parseRangeByKeys(range, { minKey, maxKey })

  Object.entries(parsedRange).forEach((entry) => {
    const [key, value] = entry

    if (value !== "*") {
      filledRange[key] = value
    }
  })

  return filledRange
}

export const justSendByAnotherName: SaveSearchHandlerArgs = (toKey: FilterParamName) => (_key: string, value) => ({
  [toKey]: value,
})

export const parseFilterParamSize: SaveSearchHandlerArgs = () => (_key, _value, filterParams: FilterParams) => {
  let input: SearchCriteriaAttributes = {}
  const sizeParamValue = filterParams[FilterParamName.dimensionRange] as string
  const widthParamValue = filterParams[FilterParamName.width] as string
  const heightParamValue = filterParams[FilterParamName.height] as string

  // Custom sizes
  if (sizeParamValue === "0-*") {
    if (widthParamValue) {
      input = {
        ...input,
        ...parseFilledRangeByKeys(widthParamValue, "widthMin", "widthMax"),
      }
    }

    if (heightParamValue) {
      input = {
        ...input,
        ...parseFilledRangeByKeys(heightParamValue, "heightMin", "heightMax"),
      }
    }
  } else {
    input = {
      ...input,
      ...parseFilledRangeByKeys(sizeParamValue, "dimensionScoreMin", "dimensionScoreMax"),
    }
  }

  return input
}

export const prepareFilterParamsForSaveSearchInput = (filterParams: FilterParams) => {
  let input: SearchCriteriaAttributes = {}
  const handlers: SaveSearchItemHander[] = [
    {
      forKey: FilterParamName.priceRange,
      handler: (_key, value) => parseFilledRangeByKeys(value, "priceMin", "priceMax"),
    },
    {
      forKey: FilterParamName.attributionClass,
      handler: justSendByAnotherName("attributionClasses"),
    },
    {
      forKey: FilterParamName.dimensionRange,
      handler: parseFilterParamSize(),
    },
    {
      forKey: FilterParamName.additionalGeneIDs,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.colors,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.locationCities,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.timePeriod,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.materialsTerms,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.partnerIDs,
      handler: justResend(),
    },
    {
      forKey: FilterParamName.waysToBuyBuy,
      handler: canSendIfNotEqualByDefault(),
    },
    {
      forKey: FilterParamName.waysToBuyBid,
      handler: canSendIfNotEqualByDefault(),
    },
    {
      forKey: FilterParamName.waysToBuyInquire,
      handler: canSendIfNotEqualByDefault(),
    },
    {
      forKey: FilterParamName.waysToBuyMakeOffer,
      handler: canSendIfNotEqualByDefault(),
    },
  ]

  handlers.forEach((entry) => {
    const entryValue = filterParams[entry.forKey]

    if (entryValue) {
      const value = entry.handler(entry.forKey, entryValue, filterParams)
      input = { ...input, ...value }
    }
  })

  return input
}
