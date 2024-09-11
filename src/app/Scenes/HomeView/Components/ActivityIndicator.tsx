import { BellIcon, Box, DEFAULT_HIT_SLOP, VisualClueDot } from "@artsy/palette-mobile"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ hasUnseenNotifications }) => {
  const { clickedNotificationBell } = useHomeViewTracking()

  const navigateToActivityPanel = () => {
    clickedNotificationBell()
    navigate("/notifications")
  }

  return (
    <Box justifyContent="center">
      <TouchableOpacity
        accessibilityLabel="Activity"
        onPress={navigateToActivityPanel}
        hitSlop={DEFAULT_HIT_SLOP}
      >
        <BellIcon height={24} width={24} />

        {!!hasUnseenNotifications && (
          <Box
            position="absolute"
            top={0}
            right={0}
            accessibilityLabel="Unseen Notifications Indicator"
          >
            <VisualClueDot diameter={4} />
          </Box>
        )}
      </TouchableOpacity>
    </Box>
  )
}
