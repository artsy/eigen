import { Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import { getNotificationTypeBadge } from "app/Scenes/Activity/utils/getNotificationTypeLabel"

interface PartnerOfferBadgeProps {
  notificationType: NotificationTypesEnum
}

export const PartnerOfferBadge: React.FC<PartnerOfferBadgeProps> = ({ notificationType }) => {
  return (
    <Text
      variant="xs"
      color="blue100"
      backgroundColor="blue10"
      style={{ alignSelf: "flex-start" }}
      px={0.5}
    >
      {getNotificationTypeBadge(notificationType)}
    </Text>
  )
}
