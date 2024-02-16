import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"

export interface Notification {
  notificationType?: string | null
  artworks?: { totalCount?: number | null } | null
  item?: {
    viewingRoomsConnection?: { totalCount?: number | null } | null
    article?: { internalID?: number | null } | null
  } | null
}

export const shouldDisplayNotification = (notification: Notification) => {
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
