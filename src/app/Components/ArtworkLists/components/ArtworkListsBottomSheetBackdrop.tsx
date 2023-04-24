import { useColor } from "@artsy/palette-mobile"
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { useMemo } from "react"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

const MAX_OPACITY = 0.5

export const ArtworkListsBottomSheetBackdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  const color = useColor()

  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, MAX_OPACITY], Extrapolate.CLAMP),
  }))

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: color("black100"),
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  )

  return <Animated.View style={containerStyle} />
}
