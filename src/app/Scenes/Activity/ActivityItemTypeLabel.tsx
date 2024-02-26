import { Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import {
  getNewNotificationTypeLabel,
  getNotificationTypeColor,
  getNotificationTypeLabel,
} from "app/Scenes/Activity/utils/getNotificationTypeLabel"
import { shouldDisplayNotificationTypeLabel } from "app/Scenes/Activity/utils/shouldDisplayNotificationTypeLabel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface Props {
  notificationType: NotificationTypesEnum
}

export const ActivityItemTypeLabel: React.FC<Props> = ({ notificationType }) => {
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")

  if (!shouldDisplayNotificationTypeLabel(notificationType) && !enableNewActivityPanelManagement) {
    return null
  }

  const notificationTypeLabel = enableNewActivityPanelManagement
    ? getNewNotificationTypeLabel(notificationType)
    : getNotificationTypeLabel(notificationType)
  const notificationTypeColor = getNotificationTypeColor(notificationType)

  if (enableNewActivityPanelManagement) {
    return (
      <Text
        variant="xs"
        fontWeight="bold"
        accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
      >
        {notificationTypeLabel}
      </Text>
    )
  }

  return (
    <Text
      variant="xs"
      accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
      color={notificationTypeColor}
    >
      {notificationTypeLabel}
    </Text>
  )
}
