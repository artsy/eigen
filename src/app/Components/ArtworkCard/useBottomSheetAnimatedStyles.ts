import { useScreenDimensions, useTextStyleForPalette } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated"

export const useBottomSheetAnimatedStyles = () => {
  const { animatedIndex } = useBottomSheet()
  const { height } = useScreenDimensions()
  const { lineHeight } = useTextStyleForPalette("sm-display")
  // Tabs are eating the text up
  const handleTextHeight = (lineHeight as number) + 80
  const handleHeight = height * 0.05

  const reversedOpacityStyle = useAnimatedStyle(() => ({
    opacity: animatedIndex.value < 0.5 ? 0 : (animatedIndex.value - 0.5) * 2,
  }))

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 0.2, 1], [1, 0, 0], Extrapolation.CLAMP),
  }))

  const heightTextStyle = useAnimatedStyle(() => ({
    height: interpolate(
      animatedIndex.value,
      [0, 0.2, 1],
      [handleTextHeight, 10, 0],
      Extrapolation.CLAMP
    ),
  }))
  const heightHandleStyle = useAnimatedStyle(() => ({
    height: interpolate(
      animatedIndex.value,
      [0, 0.2, 1],
      [handleHeight, 10, 0],
      Extrapolation.CLAMP
    ),
  }))

  return { opacityStyle, heightTextStyle, heightHandleStyle, reversedOpacityStyle }
}
