import { ActivityList_viewer$data } from "__generated__/ActivityList_viewer.graphql"
import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"

export type NotificationNode = NonNullable<
  NonNullable<NonNullable<ActivityList_viewer$data["notificationsConnection"]>["edges"]>[0]
>["node"]

export const shouldDisplayNotification = (
  notification:
    | Pick<NonNullable<NotificationNode>, "notificationType" | "artworks" | "item">
    | null
    | undefined
) => {
  if (!notification) {
    return false
  }

  if (isArtworksBasedNotification(notification?.notificationType ?? "")) {
    const artworksCount = notification.artworks?.totalCount ?? 0
    return artworksCount > 0
  }

  if (notification.notificationType === "VIEWING_ROOM_PUBLISHED") {
    const viewingRoomsCount = notification.item?.viewingRoomsConnection?.totalCount ?? 0
    return viewingRoomsCount > 0
  }

  if (notification.notificationType === "ARTICLE_FEATURED_ARTIST") {
    return !!notification.item?.article?.internalID
  }

  return true
}
