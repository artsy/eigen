import { Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import { getNotificationTypeLabel } from "app/Scenes/Activity/utils/getNotificationTypeLabel"

interface Props {
  notificationType: NotificationTypesEnum
}

export const ActivityItemTypeLabel: React.FC<Props> = ({ notificationType }) => {
  const isPartnerOffer = notificationType === "PARTNER_OFFER_CREATED"
  const notificationTypeLabel = getNotificationTypeLabel(notificationType)

  return (
    <Text
      variant="xs"
      fontWeight="bold"
      accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
    >
      {notificationTypeLabel}{" "}
      {!isPartnerOffer && (
        <Text variant="xs" mr={0.5}>
          {" "}
          •{" "}
        </Text>
      )}
    </Text>
  )
}
