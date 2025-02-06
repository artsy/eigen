import { BellIcon, Box, DEFAULT_HIT_SLOP, VisualClueDot } from "@artsy/palette-mobile"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useActivityDotExperiment } from "app/utils/experiments/useActivityDotExperiment"
import React from "react"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { hasUnseenNotifications } = props
  const tracking = useHomeViewTracking()

  const { enabled, variant, forceDots } = useActivityDotExperiment()

  let BellVariant = BellWithSmallDot
  if (enabled && variant !== "control") BellVariant = BellWithLargeDot

  const displayUnseenNotifications = hasUnseenNotifications || forceDots

  const navigateToActivityPanel = () => {
    tracking.tappedNotificationBell()
  }

  return (
    <Box justifyContent="center">
      <RouterLink
        to="/notifications"
        accessibilityLabel="Activity"
        hitSlop={DEFAULT_HIT_SLOP}
        onPress={navigateToActivityPanel}
      >
        <BellVariant hasUnseenNotifications={displayUnseenNotifications} />
      </RouterLink>
    </Box>
  )
}

const BellWithSmallDot: React.FC<{ hasUnseenNotifications: boolean }> = (props) => {
  const { hasUnseenNotifications } = props
  const { color } = useActivityDotExperiment()

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
          <VisualClueDot diameter={4} color={color} />
        </Box>
      )}
    </>
  )
}

const BellWithLargeDot: React.FC<{ hasUnseenNotifications: boolean }> = (props) => {
  const { hasUnseenNotifications } = props
  const { color } = useActivityDotExperiment()

  return (
    <>
      <BellIcon height={24} width={30} />

      {!!hasUnseenNotifications && (
        <Box
          position="absolute"
          top={-0.5}
          right={0}
          accessibilityLabel="Unseen Notifications Indicator"
        >
          <VisualClueDot diameter={8} color={color} />
        </Box>
      )}
    </>
  )
}
