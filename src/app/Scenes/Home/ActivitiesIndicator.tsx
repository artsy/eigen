import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { BellIcon, Box, useTheme } from "palette"
import { VisualClueDot } from "palette/elements/VisualClue"
import { TouchableOpacity } from "react-native"

interface ActivitiesIndicatorProps {
  hasNotifications: boolean
}

export const ActivitiesIndicator: React.FC<ActivitiesIndicatorProps> = ({ hasNotifications }) => {
  const enableActivities = useFeatureFlag("AREnableActivities")
  const { space } = useTheme()

  const navigateToActivityPanel = () => {
    navigate("/activity-panel")
  }

  if (enableActivities) {
    return (
      <Box
        position="absolute"
        right={2}
        top={0}
        bottom={0}
        justifyContent="center"
        accessibilityLabel="Activities"
      >
        <TouchableOpacity
          onPress={navigateToActivityPanel}
          hitSlop={{
            top: space(1),
            bottom: space(1),
            left: space(1),
            right: space(1),
          }}
        >
          <BellIcon />

          {!!hasNotifications && (
            <Box position="absolute" top={0} right={0}>
              <VisualClueDot diameter={4} />
            </Box>
          )}
        </TouchableOpacity>
      </Box>
    )
  }

  return null
}
