import { Touchable } from "palette"
import { StyleProp, ViewProps, ViewStyle } from "react-native"
import Animated, { AnimateProps, FadeIn, FadeOut } from "react-native-reanimated"

interface HeaderButtonProps extends AnimateProps<ViewProps> {
  containerStyle?: StyleProp<Animated.AnimateStyle<ViewStyle>>
  shouldHide?: boolean
  onPress: () => void
}

// Constants
const BUTTON_SIZE = 40

export const HeaderButton: React.FC<HeaderButtonProps> = (props) => {
  const { shouldHide, containerStyle, children, onPress, ...rest } = props

  if (shouldHide) {
    return null
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(250)}
      style={[
        {
          zIndex: 1,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          backgroundColor: "white",
        },
        containerStyle,
      ]}
      {...rest}
    >
      <Touchable
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
        onPress={onPress}
      >
        {children}
      </Touchable>
    </Animated.View>
  )
}
