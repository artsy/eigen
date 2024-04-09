import { forwardRef, useImperativeHandle, useState } from "react"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

export interface Disappearable {
  disappear(): Promise<void>
}

export const Disappearable = forwardRef<Disappearable, React.PropsWithChildren<{}>>(
  ({ children }, ref) => {
    const [showContent, setShowContent] = useState(true)
    const opacity = useSharedValue(1)

    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      }
    })

    useImperativeHandle(
      ref,
      () => ({
        async disappear() {
          opacity.value = withTiming(0, { duration: 500 }, () => {
            runOnJS(setShowContent)(false)
          })
        },
      }),
      []
    )

    return showContent ? <Animated.View style={animatedStyles}>{children}</Animated.View> : null
  }
)
