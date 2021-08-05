import { isEqual, isNull, pick } from "lodash"
import {
  defaultCommonFilterOptions,
  FilterArray,
  FilterData,
  FilterParamName,
  FilterParams,
} from "../ArtworkFilterHelpers"
import { allowedSearchCriteriaKeys } from "./constants"
import { SearchCriteriaAttributeKeys, SearchCriteriaAttributes } from "./types"

export const getOnlyFilledSearchCriteriaValues = (searchCriteria: SearchCriteriaAttributes) => {
  const prepared: Record<string, any> = {}

  if (searchCriteria) {
    const filledSavedSearchCriteriaKeys = Object.keys(searchCriteria).filter((criteriaKey) => {
      const value = searchCriteria[criteriaKey as SearchCriteriaAttributeKeys]

      if (Array.isArray(value)) {
        return value.length > 0
      }

      return !isNull(value)
    })

    filledSavedSearchCriteriaKeys.forEach((criteriaKey) => {
      const value = searchCriteria[criteriaKey as SearchCriteriaAttributeKeys]
      prepared[criteriaKey] = value
    })
  }

  return prepared
}

// TODO: Remove when Saved Search M2 released
export const prepareFilterParamsForSaveSearchInput = (filterParams: FilterParams) => {
  const input: SearchCriteriaAttributes = {}
  const allowedKeys = pick(filterParams, allowedSearchCriteriaKeys)

  for (const key of Object.keys(allowedKeys)) {
    const value = filterParams[key as FilterParamName]
    const defaultValue = defaultCommonFilterOptions[key as FilterParamName]

    if (!isEqual(defaultValue, value)) {
      input[key as keyof SearchCriteriaAttributes] = value as any
    }
  }

  return input
}

export const getAllowedFiltersForSavedSearchInput = (filters: FilterArray) => {
  return filters.filter((filter) => allowedSearchCriteriaKeys.includes(filter.paramName))
}

export const prepareFilterDataForSaveSearchInput = (filters: FilterData[]) => {
  const input: SearchCriteriaAttributes = {}
  const allowedFilters = getAllowedFiltersForSavedSearchInput(filters)

  for (const filter of allowedFilters) {
    const value = filter.paramValue
    const defaultValue = defaultCommonFilterOptions[filter.paramName]

    if (!isEqual(defaultValue, value)) {
      input[filter.paramName as keyof SearchCriteriaAttributes] = value as any
    }
  }

  return input
}
