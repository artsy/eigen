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

/**
 * A horizontal line that sweeps up and down within its parent's bounds — the "scanning" motion
 * for LensAnalyzing. Follows this repo's standard looping-animation shape (useSharedValue +
 * useAnimatedStyle + withRepeat), see `app/utils/animations/useSkeletonAnimation.tsx`.
 */
export const LensScanLine: React.FC<LensScanLineProps> = ({ height }) => {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.set(() =>
      withRepeat(withTiming(1, { duration: SCAN_DURATION_MS, easing: Easing.inOut(Easing.ease) }), -1, true)
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
          // #FFFFFF matches the `mono0` token — Animated.View takes a plain RN style object, not
          // palette-mobile's styled-system props, so the token can't be referenced by name here.
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
