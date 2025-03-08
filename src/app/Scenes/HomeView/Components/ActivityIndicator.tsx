import { BellIcon, Box, DEFAULT_HIT_SLOP, VisualClueDot } from "@artsy/palette-mobile"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import React from "react"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { hasUnseenNotifications } = props
  const tracking = useHomeViewTracking()

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
        <>
          <BellIcon height={24} width={30} />

          {!!hasUnseenNotifications && (
            <Box
              position="absolute"
              top={-0.5}
              right={0}
              accessibilityLabel="Unseen Notifications Indicator"
            >
              <VisualClueDot diameter={8} color="red50" />
            </Box>
          )}
        </>
      </RouterLink>
    </Box>
  )
}
