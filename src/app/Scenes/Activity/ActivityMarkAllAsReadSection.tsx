import { Button, Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"

interface ActivityMarkAllAsReadSectionProps extends FlexProps {
  hasUnreadNotifications: boolean
}

export const ActivityMarkAllAsReadSection: React.FC<ActivityMarkAllAsReadSectionProps> = ({
  hasUnreadNotifications,
  ...flexProps
}) => {
  const label = hasUnreadNotifications ? "New notifications" : "No new notifications"
  const { markAllNotificationsAsRead, mutationInProgress } = useMarkAllNotificationsAsRead()
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      {...flexProps}
    >
      <Text variant="xs" color={hasUnreadNotifications ? "brand" : "black60"}>
        {label}
      </Text>
      <Button
        disabled={!hasUnreadNotifications || mutationInProgress}
        size="small"
        variant="outline"
        onPress={markAllNotificationsAsRead}
      >
        Mark all as read
      </Button>
    </Flex>
  )
}
