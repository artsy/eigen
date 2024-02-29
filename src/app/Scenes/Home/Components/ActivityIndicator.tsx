import { ActionType } from "@artsy/cohesion"
import { ClickedNotificationsBell } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { BellIcon, Box, useTheme, VisualClueDot } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { MotiView } from "moti"
import { useEffect } from "react"
import { TouchableOpacity } from "react-native"
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useTracking } from "react-tracking"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

const ANGLE = 10
const TIME = 100
const EASING = Easing.elastic(1.5)

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ hasUnseenNotifications }) => {
  const tracking = useTracking()
  const { space } = useTheme()

  const rotation = useSharedValue(0)

  useEffect(() => {
    if (hasUnseenNotifications) {
      rotation.value = withSequence(
        // deviate left to start from -ANGLE
        withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
        // wobble between -ANGLE and ANGLE 7 times
        withRepeat(
          withTiming(ANGLE, {
            duration: TIME,
            easing: EASING,
          }),
          7,
          true
        ),
        // go back to 0 at the end
        withTiming(0, { duration: TIME / 2, easing: EASING })
      )
    }
  }, [hasUnseenNotifications])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }))

  const navigateToActivityPanel = () => {
    navigate("/notifications")
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
        <MotiView style={animatedStyle}>
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
        </MotiView>
      </TouchableOpacity>
    </Box>
  )
}

const tracks = {
  clickedNotificationsBell: (): ClickedNotificationsBell => ({
    action: ActionType.clickedNotificationsBell,
  }),
}
