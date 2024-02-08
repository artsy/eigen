import { Flex, Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_notificationsConnection.graphql"
import { getNotificationTypeBadge } from "app/Scenes/Activity/utils/getNotificationTypeLabel"

const BADGE_BORDER_RADIUS = 3

interface PartnerOfferBadgeProps {
  notificationType: NotificationTypesEnum
}

export const PartnerOfferBadge: React.FC<PartnerOfferBadgeProps> = ({ notificationType }) => {
  return (
    <>
      <Flex borderRadius={BADGE_BORDER_RADIUS} backgroundColor="blue10" alignSelf="flex-start">
        <Text variant="xs" color="blue100" px={0.5}>
          {getNotificationTypeBadge(notificationType)}
        </Text>
      </Flex>
    </>
  )
}
