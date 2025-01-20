import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { useMemo } from "react"
import { TouchableWithoutFeedback } from "react-native"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

const MAX_OPACITY = 0.4

interface DefaultBottomSheetBackdrop extends BottomSheetBackdropProps {
  onClose?: () => void
  // set to "close" to close the bottom sheet when the backdrop is pressed
  pressBehavior?: "close"
}

export const DefaultBottomSheetBackdrop: React.FC<DefaultBottomSheetBackdrop> = ({
  animatedIndex,
  onClose,
  pressBehavior,
  style,
}) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => {
    "worklet"
    return {
      opacity: interpolate(animatedIndex.value, [-1, 0], [0, MAX_OPACITY], Extrapolate.CLAMP),
    }
  })

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        // We intentionally want the background color to be black regardless of the theme
        backgroundColor: "black",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  )

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (pressBehavior === "close") {
          onClose?.()
        }
      }}
    >
      <Animated.View style={containerStyle} />
    </TouchableWithoutFeedback>
  )
}
