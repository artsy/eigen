import { NotificationTypesEnum } from "__generated__/ActivityItem_item.graphql"
import { NotificationType } from "../types"

export const getNotificationTypes = (
  type: NotificationType
): NotificationTypesEnum[] | undefined => {
  if (type === "alerts") {
    return ["ARTWORK_ALERT"]
  }

  return []
}
