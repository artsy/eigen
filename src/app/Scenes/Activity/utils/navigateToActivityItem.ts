import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { navigate } from "app/system/navigation/navigate"
import { last } from "lodash"
import { parse as parseQueryString } from "query-string"

export const navigateToActivityItem = (targetHref: string) => {
  const splittedQueryParams = targetHref.split("?")
  const queryParams = last(splittedQueryParams) ?? ""
  const parsed = parseQueryString(queryParams)

  const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
    (sortEntity) => sortEntity.paramValue === "-published_at"
  )!

  navigate(targetHref, {
    passProps: {
      predefinedFilters: [sortFilterItem] as FilterArray,
      searchCriteriaID: parsed.search_criteria_id,
    },
  })
}
