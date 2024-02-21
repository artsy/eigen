import { Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import { getNotificationTypeBadge } from "app/Scenes/Activity/utils/getNotificationTypeLabel"

interface PartnerOfferBadgeProps {
  notificationType: NotificationTypesEnum
}

export const PartnerOfferBadge: React.FC<PartnerOfferBadgeProps> = ({ notificationType }) => {
  return (
    <Text variant="xs" fontWeight="bold" color="blue100">
      {getNotificationTypeBadge(notificationType)}
    </Text>
  )
}
