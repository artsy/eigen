import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { BellIcon, Box, useTheme } from "palette"
import { VisualClueDot } from "palette/elements/VisualClue"
import { TouchableOpacity } from "react-native"

interface ActivityIndicatorProps {
  hasNotifications: boolean
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ hasNotifications }) => {
  const enableActivityPanel = useFeatureFlag("AREnableActivityPanel")
  const { space } = useTheme()

  const navigateToActivityPanel = () => {
    navigate("/activity-panel")
  }

  if (enableActivityPanel) {
    return (
      <Box position="absolute" right={2} top={0} bottom={0} justifyContent="center">
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
