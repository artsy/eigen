import { useColor } from "@artsy/palette-mobile"
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { useMemo } from "react"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

export const CityBottomSheetBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const color = useColor()

  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 0.4], Extrapolate.CLAMP),
  }))

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: color("mono100"),
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  )

  return <Animated.View style={containerStyle} pointerEvents="none" />
}
