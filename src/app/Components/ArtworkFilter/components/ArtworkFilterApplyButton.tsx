import { BellIcon, Box, Button, Separator, Text, useColor } from "palette"
import { useState } from "react"
import { Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export interface ArtworkFilterApplyButtonProps {
  disabled: boolean
  onCreateAlertPress?: () => void
  onPress: () => void
  shouldShowCreateAlertButton?: boolean
}

interface Button {
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  onPress: () => void
}

const InnerButton: React.FC<Button> = (props) => {
  const { label, disabled, icon, onPress } = props
  const [isPressed, setIsPressed] = useState(false)

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={{ flex: 1, opacity: disabled ? 0.4 : 1 }}
    >
      <Box flex={1} flexDirection="row" alignItems="center" justifyContent="center">
        {icon}
        <Text
          variant="xs"
          color="white100"
          lineHeight={14}
          style={{ textDecorationLine: isPressed ? "underline" : "none" }}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  )
}

export const ArtworkFilterApplyButton: React.FC<ArtworkFilterApplyButtonProps> = (props) => {
  const { disabled, shouldShowCreateAlertButton, onCreateAlertPress, onPress } = props
  const color = useColor()

  if (onCreateAlertPress) {
    return (
      <SafeAreaView
        style={{
          shadowColor: color("black100"),
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
          backgroundColor: "white",
          // the bottom padding that is created by safeareaview in almost all > X apple devices
          // is somewhere around 35px. This is a hack to make sure that the button is
          // displayed 40px above the bottom of the screen.
          paddingBottom: -15,
        }}
      >
        <Box p={2} backgroundColor="white">
          <Box
            height={50}
            borderRadius={50}
            px={1}
            backgroundColor="black100"
            flexDirection="row"
            alignItems="center"
          >
            {!!shouldShowCreateAlertButton && (
              <>
                <InnerButton
                  label="Create Alert"
                  icon={<BellIcon fill="white100" width="15px" height="15px" mr={1} />}
                  onPress={onCreateAlertPress}
                />
                <Box width="1" height={20} backgroundColor="white100" mx={1} />
              </>
            )}
            <InnerButton disabled={disabled} label="Show Results" onPress={onPress} />
          </Box>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <>
      <Separator my={0} />
      <Box p={2} pb={30}>
        <Button
          disabled={disabled}
          onPress={onPress}
          block
          width={100}
          variant="fillDark"
          size="large"
          testID="artwork-filter-apply-button"
        >
          Show results
        </Button>
      </Box>
    </>
  )
}
