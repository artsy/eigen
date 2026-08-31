import { useEffect } from "react"
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

const SCAN_DURATION_MS = 1400

interface LensScanLineProps {
  height: number
}

export const LensScanLine: React.FC<LensScanLineProps> = ({ height }) => {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.set(() =>
      withRepeat(
        withTiming(1, { duration: SCAN_DURATION_MS, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    "worklet"
    return {
      transform: [{ translateY: interpolate(progress.get(), [0, 1], [0, height]) }],
    }
  })

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          // `mono0`, spelled out: Animated.View takes a plain RN style, not palette's props.
          backgroundColor: "#FFFFFF",
          shadowColor: "#FFFFFF",
          shadowOpacity: 0.8,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 0 },
        },
        animatedStyle,
      ]}
    />
  )
}
