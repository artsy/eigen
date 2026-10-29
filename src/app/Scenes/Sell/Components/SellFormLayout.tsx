import { Box, Button, Flex, useSpace } from "@artsy/palette-mobile"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useState } from "react"
import {
  KeyboardController,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellFormLayoutProps {
  buttonLabel: string
  buttonDisabled: boolean
  onButtonPress: () => void
}

export const SellFormLayout: React.FC<React.PropsWithChildren<SellFormLayoutProps>> = ({
  buttonLabel,
  buttonDisabled,
  onButtonPress,
  children,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const [stickyFooterHeight, setStickyFooterHeight] = useState(0)
  const keyboard = useReanimatedKeyboardAnimation()

  // Like KeyboardStickyView, but never below its resting place. Gboard's toolbar for hardware
  // keyboards is shorter than the bottom inset and would push the footer under the nav bar.
  const stickyFooterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: Math.min(0, keyboard.height.get() + keyboard.progress.get() * bottom) },
    ],
  }))

  return (
    <Flex flex={1} bg="mono0">
      <KeyboardAwareForm
        // The sticky footer covers the bottom of the form, so keep the focused input above it
        bottomOffset={stickyFooterHeight}
        contentContainerStyle={{ paddingBottom: space(2) }}
      >
        {children}
      </KeyboardAwareForm>

      <Animated.View
        style={stickyFooterStyle}
        onLayout={(event) => setStickyFooterHeight(event.nativeEvent.layout.height)}
      >
        <Box px={2} pt={2} bg="mono0" style={{ paddingBottom: bottom + space(2) }}>
          <Button
            block
            haptic
            variant="fillDark"
            disabled={buttonDisabled}
            onPress={() => {
              // An open keyboard would cover the sheet that confirms the last step
              KeyboardController.dismiss()
              onButtonPress()
            }}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Animated.View>
    </Flex>
  )
}
