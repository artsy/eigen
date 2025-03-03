import { useTextStyleForPalette } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const useBottomSheetAnimatedStyles = () => {
  const { animatedIndex } = useBottomSheet()
  const { bottom } = useSafeAreaInsets()
  const { lineHeight } = useTextStyleForPalette("sm-display")
  // Some devices need extra space, 30 does the job for all of them
  const handleTextHeight = bottom + (lineHeight as number) + 60

  const reversedOpacityStyle = useAnimatedStyle(() => ({
    opacity: animatedIndex.value < 0.5 ? 0 : (animatedIndex.value - 0.5) * 2,
  }))
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: 1 - animatedIndex.value,
  }))
  const heightStyle = useAnimatedStyle(() => ({
    height: handleTextHeight - animatedIndex.value * handleTextHeight,
  }))

  return { opacityStyle, heightStyle, reversedOpacityStyle }
}
