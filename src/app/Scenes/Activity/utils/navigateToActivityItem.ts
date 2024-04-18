import { ActivityItem_notification$data } from "__generated__/ActivityItem_notification.graphql"
import { ActivityRailItem_item$data } from "__generated__/ActivityRailItem_item.graphql"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { SUPPORTED_NOTIFICATION_TYPES } from "app/Scenes/Activity/ActivityItemScreen"
import { matchRoute } from "app/routes"
import { navigate } from "app/system/navigation/navigate"
import { last } from "lodash"
import { parse as parseQueryString } from "query-string"

export const navigateToActivityItem = (
  item: ActivityItem_notification$data | ActivityRailItem_item$data
) => {
  const { internalID, targetHref, notificationType } = item

  if (SUPPORTED_NOTIFICATION_TYPES.includes(notificationType)) {
    return navigate(`/notification/${internalID}`)
  }

  const splittedQueryParams = targetHref.split("?")
  const queryParams = last(splittedQueryParams) ?? ""
  const parsed = parseQueryString(queryParams)

  const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
    (sortEntity) => sortEntity.paramValue === "-published_at"
  )

  const passProps: any = {
    predefinedFilters: [sortFilterItem] as FilterArray,
    searchCriteriaID: parsed.search_criteria_id,
  }

  if ((matchRoute(targetHref) as any).module === "Artist") {
    passProps.scrollToArtworksGrid = true
  }

  navigate(targetHref, {
    passProps,
  })
}
