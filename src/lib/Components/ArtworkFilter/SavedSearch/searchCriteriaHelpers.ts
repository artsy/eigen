import { isNull } from "lodash"
import { SearchCriteriaAttributes } from "./types"

export const getOnlyFilledSearchCriteriaValues = (searchCriteria: SearchCriteriaAttributes) => {
  const prepared: Record<string, any> = {}

  if (searchCriteria) {
    const filledSavedSearchCriteria = Object.entries(searchCriteria).filter((entry) => {
      const [_, value] = entry

      if (Array.isArray(value)) {
        return value.length > 0
      }

      return !isNull(value)
    })

    filledSavedSearchCriteria.forEach((criteria) => {
      const [key, value] = criteria
      prepared[key] = value
    })
  }

  return prepared
}
