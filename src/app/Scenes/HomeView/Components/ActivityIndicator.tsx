import { BellStrokeIcon } from "@artsy/icons/native"
import { Box, VisualClueDot } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React from "react"

interface ActivityIndicatorProps {
  hasUnseenNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { hasUnseenNotifications } = props
  const tracking = useHomeViewTracking()
  const showBlueDots = useFeatureFlag("AREnableBlueActivityDots")

  const navigateToActivityPanel = () => {
    tracking.tappedNotificationBell()
  }

  return (
    <Box justifyContent="center">
      <RouterLink
        to="/notifications"
        accessibilityLabel="Activity"
        hitSlop={ICON_HIT_SLOP}
        onPress={navigateToActivityPanel}
      >
        <>
          <BellStrokeIcon height={24} width={30} />

          {!!hasUnseenNotifications && (
            <Box
              position="absolute"
              top={-0.5}
              right={0}
              accessibilityLabel="Unseen Notifications Indicator"
            >
              <VisualClueDot diameter={8} color={showBlueDots ? "blue100" : "red50"} />
            </Box>
          )}
        </>
      </RouterLink>
    </Box>
  )
}
