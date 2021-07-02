import { isNull } from "lodash"
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
