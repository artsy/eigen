import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"

export const getNotificationTypeLabel = (notificationType: NotificationTypesEnum) => {
  switch (notificationType) {
    case "ARTICLE_FEATURED_ARTIST":
      return "Editorial"
    case "ARTWORK_ALERT":
      return "Alert"
    default:
      return null
  }
}

export const getNotificationTypeColor = (notificationType: NotificationTypesEnum) => {
  switch (notificationType) {
    case "ARTWORK_ALERT":
      return "blue100"
    default:
      return "black60"
  }
}

// const getNotificationTypeLabel = (notificationType: NotificationTypesEnum) => {
//   switch (notificationType) {
//     case "ARTICLE_FEATURED_ARTIST":
//       return "Editorial"
//     case "ARTWORK_ALERT":
//       return "Alert"
//     case "ARTWORK_PUBLISHED":
//       return "Artist"
//     case "PARTNER_SHOW_OPENED":
//       return "Gallery"
//     case "VIEWING_ROOM_PUBLISHED":
//       return "Viewing Room"
//     default:
//       return null
//   }
// }
