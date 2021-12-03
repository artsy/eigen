import { useFeatureFlag } from "lib/store/GlobalStore"
import { BellIcon, Box, Button, Separator, Text, useColor } from "palette"
import React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"

export interface ArtworkFilterApplyButtonProps {
  disabled: boolean
  onCreateAlertPress?: () => void
  onPress: () => void
}

export const ArtworkFilterApplyButton: React.FC<ArtworkFilterApplyButtonProps> = (props) => {
  const { disabled, onCreateAlertPress, onPress } = props
  const color = useColor()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow && onCreateAlertPress) {
    const buttonContainerStyle: ViewStyle = {
      flex: 1,
    }
    const buttonStyle: ViewStyle = {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }

    return (
      <Box
        p={2}
        backgroundColor="white"
        style={{
          shadowColor: color("black100"),
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <Box height={50} borderRadius={50} px={1} backgroundColor="black100" flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={onCreateAlertPress} style={buttonContainerStyle}>
            <Box style={buttonStyle}>
              <BellIcon fill="white100" width="15px" height="15px" mr={1} />
              <Text variant="xs" color="white100" lineHeight={14}>
                Create Alert
              </Text>
            </Box>
          </TouchableOpacity>

          <Box width="1" height={20} backgroundColor="white100" mx={1} />

          <TouchableOpacity
            onPress={onPress}
            style={[buttonContainerStyle, disabled && { opacity: 0.4 }]}
            disabled={disabled}
          >
            <Box style={buttonStyle}>
              <Text variant="xs" color="white100" lineHeight={14}>
                Apply Filters
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Separator my={0} />
      <Box p={2} pb={30}>
        <Button disabled={disabled} onPress={onPress} block width={100} variant="fillDark" size="large">
          Show results
        </Button>
      </Box>
    </>
  )
}
