import { BellIcon, Box, DEFAULT_HIT_SLOP, VisualClueDot } from "@artsy/palette-mobile"
import { useActivityDotExperiment } from "app/Scenes/HomeView/hooks/useActivityDotExperiment"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { TouchableOpacity } from "react-native"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  let { hasUnseenNotifications } = props

  const tracking = useHomeViewTracking()

  const { enabled, variant, forceDots } = useActivityDotExperiment()

  let BellVariant = BellWithSmallBlueDot
  if (enabled && variant === "variant-b") BellVariant = BellWithLargeRedDot
  if (enabled && variant === "variant-c") BellVariant = BellWithLargeBlueDot

  hasUnseenNotifications = hasUnseenNotifications || forceDots

  const navigateToActivityPanel = () => {
    tracking.tappedNotificationBell()

    navigate("/notifications")
  }

  return (
    <Box justifyContent="center">
      <TouchableOpacity
        accessibilityLabel="Activity"
        onPress={navigateToActivityPanel}
        hitSlop={DEFAULT_HIT_SLOP}
      >
        <BellVariant hasUnseenNotifications={hasUnseenNotifications} />
      </TouchableOpacity>
    </Box>
  )
}

const BellWithSmallBlueDot: React.FC<{ hasUnseenNotifications: boolean }> = (props) => {
  const { hasUnseenNotifications } = props

  return (
    <>
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
    </>
  )
}

const BellWithLargeRedDot: React.FC<{ hasUnseenNotifications: boolean }> = (props) => {
  const { hasUnseenNotifications } = props

  return (
    <>
      <BellIcon height={24} width={30} />

      {!!hasUnseenNotifications && (
        <Box
          position="absolute"
          top="-0.5px"
          right="0px"
          accessibilityLabel="Unseen Notifications Indicator"
        >
          <VisualClueDot diameter={8} color="red50" />
        </Box>
      )}
    </>
  )
}

const BellWithLargeBlueDot: React.FC<{ hasUnseenNotifications: boolean }> = (props) => {
  const { hasUnseenNotifications } = props

  return (
    <>
      <BellIcon height={24} width={30} />

      {!!hasUnseenNotifications && (
        <Box
          position="absolute"
          top="-0.5px"
          right="0px"
          accessibilityLabel="Unseen Notifications Indicator"
        >
          <VisualClueDot diameter={8} color="blue100" />
        </Box>
      )}
    </>
  )
}
