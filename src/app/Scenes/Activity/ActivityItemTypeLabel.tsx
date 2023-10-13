import { Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import {
  getNotificationTypeColor,
  getNotificationTypeLabel,
} from "app/Scenes/Activity/utils/getNotificationTypeLabel"
import { shouldDisplayNotificationTypeLabel } from "app/Scenes/Activity/utils/shouldDisplayNotificationTypeLabel"

interface Props {
  notificationType: NotificationTypesEnum
}

export const ActivityItemTypeLabel: React.FC<Props> = ({ notificationType }) => {
  if (!shouldDisplayNotificationTypeLabel(notificationType)) {
    return null
  }

  const notificationTypeLabel = getNotificationTypeLabel(notificationType)
  const notificationTypeColor = getNotificationTypeColor(notificationType)

  return (
    <Text
      variant="xs"
      accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
      color={notificationTypeColor}
    >
      {notificationTypeLabel} •{" "}
    </Text>
  )
}
