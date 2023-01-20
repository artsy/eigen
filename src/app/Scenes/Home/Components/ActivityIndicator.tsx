import { ActionType } from "@artsy/cohesion"
import { ClickedNotificationsBell } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { navigate } from "app/system/navigation/navigate"
import { BellIcon, Box, useTheme } from "palette"
import { VisualClueDot } from "palette/elements/VisualClue"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"

interface ActivityIndicatorProps {
  hasNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ hasNotifications }) => {
  const tracking = useTracking()
  const { space } = useTheme()

  const navigateToActivityPanel = () => {
    navigate("/activity")
    tracking.trackEvent(tracks.clickedNotificationsBell())
  }

  return (
    <Box position="absolute" right={2} top={0} bottom={0} justifyContent="center">
      <TouchableOpacity
        accessibilityLabel="Activity"
        onPress={navigateToActivityPanel}
        hitSlop={{
          top: space(1),
          bottom: space(1),
          left: space(1),
          right: space(1),
        }}
      >
        <BellIcon height={24} width={24} />

        {!!hasNotifications && (
          <Box
            position="absolute"
            top={0}
            right={0}
            accessibilityLabel="Unread Activities Indicator"
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
