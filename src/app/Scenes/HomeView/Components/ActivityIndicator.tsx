import { ActionType } from "@artsy/cohesion"
import { ClickedNotificationsBell } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { BellIcon, Box, DEFAULT_HIT_SLOP, VisualClueDot } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ hasUnseenNotifications }) => {
  const tracking = useTracking()

  const navigateToActivityPanel = () => {
    navigate("/notifications")
    tracking.trackEvent(tracks.clickedNotificationsBell())
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

const tracks = {
  clickedNotificationsBell: (): ClickedNotificationsBell => ({
    action: ActionType.clickedNotificationsBell,
  }),
}
