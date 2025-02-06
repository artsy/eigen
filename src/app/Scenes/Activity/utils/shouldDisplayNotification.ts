import { ActivityList_viewer$data } from "__generated__/ActivityList_viewer.graphql"
import { ActivityRail_viewer$data } from "__generated__/ActivityRail_viewer.graphql"
import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"
import { ExtractNodeType } from "app/utils/relayHelpers"

export type NotificationNode =
  | ExtractNodeType<ActivityList_viewer$data["notificationsConnection"]>
  | ExtractNodeType<ActivityRail_viewer$data["notificationsConnection"]>

export const shouldDisplayNotification = (
  notification:
    | Pick<NonNullable<NotificationNode>, "notificationType" | "artworks" | "item">
    | null
    | undefined,
  mode: "rail" | "list" = "list"
) => {
  if (!notification) {
    return false
  }

  if (isArtworksBasedNotification(notification?.notificationType ?? "")) {
    const artworksCount = notification.artworks?.totalCount ?? 0
    return artworksCount > 0
  }

  if (notification.item?.__typename === "ViewingRoomPublishedNotificationItem") {
    const viewingRoomsCount = notification.item?.viewingRoomsConnection?.totalCount ?? 0
    return viewingRoomsCount > 0
  }

  if (notification.item?.__typename === "ArticleFeaturedArtistNotificationItem") {
    return !!notification.item?.article?.internalID
  }

  if (
    mode === "rail" &&
    notification.item?.__typename === "CollectorProfileUpdatePromptNotificationItem"
  ) {
    return false
  }

  return true
}
