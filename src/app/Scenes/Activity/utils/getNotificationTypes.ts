import { NotificationTypesEnum } from "__generated__/ActivityRailItem_item.graphql"
import { NotificationType } from "app/Scenes/Activity/types"

export const getNotificationTypes = (
  type: NotificationType
): NotificationTypesEnum[] | undefined => {
  switch (type) {
    case "alerts":
      return ["ARTWORK_ALERT"]
    case "offers":
      return ["PARTNER_OFFER_CREATED"]
    default:
      return []
  }
}
