import { Box, Text } from "@artsy/palette-mobile"
import { NotificationTypesEnum } from "__generated__/ActivityRail_viewer.graphql"
import { getNotificationTypeBadge } from "app/Scenes/Activity/utils/getNotificationTypeLabel"

interface PartnerOfferBadgeProps {
  notificationType: NotificationTypesEnum
}

export const PartnerOfferBadge: React.FC<PartnerOfferBadgeProps> = ({ notificationType }) => {
  return (
    <Box borderRadius={3} backgroundColor="blue10" px={0.5} alignSelf="flex-start">
      <Text variant="xs" color="blue100">
        {getNotificationTypeBadge(notificationType)}
      </Text>
    </Box>
  )
}
