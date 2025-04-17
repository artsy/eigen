import { useColor } from "@artsy/palette-mobile"
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import { useMemo } from "react"
import { TouchableWithoutFeedback } from "react-native"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

export const MAX_OPACITY = 0.4
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
  const color = useColor()
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
        backgroundColor: color("mono100"),
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
