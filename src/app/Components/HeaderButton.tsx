import { Touchable, useColor } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { StyleProp, ViewProps, ViewStyle } from "react-native"
import Animated, { AnimateProps, FadeIn, FadeOut } from "react-native-reanimated"

interface HeaderButtonProps extends AnimateProps<ViewProps> {
  style?: StyleProp<Animated.AnimateStyle<ViewStyle>>
  shouldHide?: boolean
  position: "left" | "right"
  applySafeAreaTopInsets?: boolean
  onPress: () => void
}

// Constants
const BUTTON_SIZE = 40
const DURATION = 250
const BUTTON_HORIZONTAL_OFFSET = 12

export const HeaderButton: React.FC<React.PropsWithChildren<HeaderButtonProps>> = (props) => {
  const {
    shouldHide,
    style,
    children,
    position,
    applySafeAreaTopInsets = true,
    onPress,
    ...rest
  } = props
  const color = useColor()
  const { safeAreaInsets } = useScreenDimensions()

  if (shouldHide) {
    return null
  }

  return (
    <Animated.View
      entering={FadeIn.duration(DURATION)}
      exiting={FadeOut.duration(DURATION)}
      style={[
        {
          zIndex: 1,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          backgroundColor: color("mono0"),
          position: "absolute",
          left: position === "left" ? BUTTON_HORIZONTAL_OFFSET : undefined,
          right: position === "right" ? BUTTON_HORIZONTAL_OFFSET : undefined,
          top: 13 + (applySafeAreaTopInsets ? safeAreaInsets.top : 0),
        },
        style,
      ]}
      {...rest}
    >
      <Touchable
        accessibilityRole="button"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: BUTTON_SIZE / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPress}
      >
        {children}
      </Touchable>
    </Animated.View>
  )
}
