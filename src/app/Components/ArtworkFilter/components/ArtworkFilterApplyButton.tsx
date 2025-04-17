import {
  BellIcon,
  Box,
  Button,
  Flex,
  Separator,
  SpacingUnit,
  SpacingUnitsTheme,
  Text,
  useColor,
} from "@artsy/palette-mobile"
import { ProgressiveOnboardingAlertFinish } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingAlertFinish"
import { useState } from "react"
import { Pressable, SafeAreaView } from "react-native"
import { ResponsiveValue } from "styled-system"

export interface ArtworkFilterApplyButtonProps {
  buttonText?: string
  disabled: boolean
  onCreateAlertPress?: () => void
  onPress: () => void
  shouldShowCreateAlertButton?: boolean
  pb?: ResponsiveValue<SpacingUnit, SpacingUnitsTheme>
  progressiveOnboardingEnabled?: boolean
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
          color="mono0"
          lineHeight="14px"
          style={{ textDecorationLine: isPressed ? "underline" : "none" }}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  )
}

export const ArtworkFilterApplyButton: React.FC<ArtworkFilterApplyButtonProps> = (props) => {
  const {
    buttonText,
    disabled,
    shouldShowCreateAlertButton,
    onCreateAlertPress,
    onPress,
    pb = 4,
    progressiveOnboardingEnabled,
  } = props
  const color = useColor()

  if (onCreateAlertPress) {
    return (
      <SafeAreaView
        style={{
          shadowColor: color("mono100"),
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
          backgroundColor: color("mono0"),
          // the bottom padding that is created by safeareaview in almost all > X apple devices
          // is somewhere around 35px. This is a hack to make sure that the button is
          // displayed 40px above the bottom of the screen.
          paddingBottom: -15,
        }}
      >
        <Box p={2} backgroundColor="mono0">
          <Box
            height={50}
            borderRadius={50}
            px={1}
            backgroundColor="mono100"
            flexDirection="row"
            alignItems="center"
          >
            {!!shouldShowCreateAlertButton && !!progressiveOnboardingEnabled && (
              <>
                <Flex flex={1} flexDirection="row" height={50} justifyContent="center">
                  <ProgressiveOnboardingAlertFinish>
                    <InnerButton
                      label="Create Alert"
                      icon={<BellIcon fill="mono0" width="15px" height="15px" mr={1} />}
                      onPress={onCreateAlertPress}
                    />
                  </ProgressiveOnboardingAlertFinish>
                </Flex>

                <Box width="1" height={20} backgroundColor="mono0" mx={1} />
              </>
            )}
            {!!shouldShowCreateAlertButton && !progressiveOnboardingEnabled && (
              <>
                <InnerButton
                  label="Create Alert"
                  icon={<BellIcon fill="mono0" width="15px" height="15px" mr={1} />}
                  onPress={onCreateAlertPress}
                />
                <Box width="1" height={20} backgroundColor="mono0" mx={1} />
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
      <Box p={2} pb={pb}>
        <Button
          disabled={disabled}
          onPress={onPress}
          block
          width={100}
          variant="fillDark"
          size="large"
          testID="artwork-filter-apply-button"
        >
          {buttonText ?? "Show results"}
        </Button>
      </Box>
    </>
  )
}
