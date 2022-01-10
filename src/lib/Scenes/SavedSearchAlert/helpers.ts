import { defaultCommonFilterOptions, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { groupBy } from "lodash"
import { bullet } from "palette"
import { extractPillValue } from "./pillExtractors"
import { SavedSearchPill } from "./SavedSearchAlertModel"

export const getNamePlaceholder = (artistName: string, pills: SavedSearchPill[]) => {
  const filtersCountLabel = pills.length > 1 ? "filters" : "filter"
  return `${artistName} ${bullet} ${pills.length} ${filtersCountLabel}`
}

export const getSearchCriteriaFromPills = (pills: SavedSearchPill[]) => {
  const pillsByParamName = groupBy(pills, "paramName")
  const criteria: SearchCriteriaAttributes = {}

  Object.entries(pillsByParamName).forEach((entry) => {
    const [paramName, values] = entry

    if (paramName === FilterParamName.artistIDs) {
      criteria.artistID = extractPillValue(values)[0] as string
      return
    }

    if (Array.isArray(defaultCommonFilterOptions[paramName as FilterParamName])) {
      criteria[paramName as keyof SearchCriteriaAttributes] = extractPillValue(values) as any
      return
    }

    criteria[paramName as keyof SearchCriteriaAttributes] = extractPillValue(values)[0] as any
  })

  return criteria
}
