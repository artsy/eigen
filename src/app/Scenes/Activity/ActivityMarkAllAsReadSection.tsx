import { Button, Flex, Text } from "palette"

interface ActivityMarkAllAsReadSectionProps {
  hasUnreadNotifications: boolean
  loading: boolean
  onPress: () => void
}

export const ActivityMarkAllAsReadSection: React.FC<ActivityMarkAllAsReadSectionProps> = ({
  hasUnreadNotifications,
  loading,
  onPress,
}) => {
  const label = hasUnreadNotifications ? "New notifications" : "No new notifications"

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      py={1}
      px={2}
    >
      <Text variant="xs" color={hasUnreadNotifications ? "brand" : "black60"}>
        {label}
      </Text>
      <Button onPress={onPress} disabled={!hasUnreadNotifications || loading} size="small">
        Mark all as read
      </Button>
    </Flex>
  )
}
