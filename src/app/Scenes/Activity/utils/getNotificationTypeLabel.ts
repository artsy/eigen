import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"

export const getNotificationTypeLabel = (notificationType: NotificationTypesEnum) => {
  switch (notificationType) {
    case "ARTICLE_FEATURED_ARTIST":
      return "Editorial"
    case "ARTWORK_ALERT":
      return "Alert"
    case "PARTNER_OFFER_CREATED":
      return "Limited Time Offer"
    default:
      return null
  }
}

export const getNewNotificationTypeLabel = (notificationType: NotificationTypesEnum) => {
  switch (notificationType) {
    case "ARTICLE_FEATURED_ARTIST":
      return "Editorial"
    case "ARTWORK_PUBLISHED":
      return "Follow"
    case "ARTWORK_ALERT":
      return "Alert"
    case "PARTNER_OFFER_CREATED":
      return "Limited Time Offer"
    case "PARTNER_SHOW_OPENED":
      return "Show"
    case "VIEWING_ROOM_PUBLISHED":
      return "Viewing Room"
    default:
      return null
  }
}

export const getNotificationTypeColor = (notificationType: NotificationTypesEnum) => {
  switch (notificationType) {
    case "ARTWORK_ALERT":
      return "blue100"
    case "PARTNER_OFFER_CREATED":
      return "blue100"
    default:
      return "black60"
  }
}
