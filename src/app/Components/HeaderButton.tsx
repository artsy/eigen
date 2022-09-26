import { Touchable } from "palette"
import { StyleProp, ViewProps, ViewStyle } from "react-native"
import Animated, { AnimateProps, FadeIn, FadeOut } from "react-native-reanimated"

interface HeaderButtonProps extends AnimateProps<ViewProps> {
  style?: StyleProp<Animated.AnimateStyle<ViewStyle>>
  shouldHide?: boolean
  onPress: () => void
}

// Constants
const BUTTON_SIZE = 40
const DURATION = 250

export const HeaderButton: React.FC<HeaderButtonProps> = (props) => {
  const { shouldHide, style, children, onPress, ...rest } = props

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
          backgroundColor: "white",
        },
        style,
      ]}
      {...rest}
    >
      <Touchable
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
