import { useColor } from "@artsy/palette-mobile"
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import { useMemo } from "react"
import { TouchableWithoutFeedback } from "react-native"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

const MAX_OPACITY = 0.4
interface DefaultBottomSheetBackdrop extends BottomSheetDefaultBackdropProps {
  onClose?: () => void
}

export const DefaultBottomSheetBackdrop: React.FC<DefaultBottomSheetBackdrop> = ({
  animatedIndex,
  onClose,
  pressBehavior,
  style,
  appearsOnIndex,
  disappearsOnIndex,
}) => {
  const color = useColor()

  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => {
    "worklet"

    if (appearsOnIndex === undefined || disappearsOnIndex === undefined) {
      return {
        opacity: interpolate(animatedIndex.value, [-1, 0], [0, MAX_OPACITY], Extrapolate.CLAMP),
      }
    }

    return {
      opacity: interpolate(
        animatedIndex.value,
        [-1, disappearsOnIndex, appearsOnIndex],
        [0, 0, MAX_OPACITY],
        Extrapolate.CLAMP
      ),
    }
  })

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

  if (pressBehavior === "close") {
    return (
      <TouchableWithoutFeedback onPress={() => onClose?.()}>
        <Animated.View style={containerStyle} />
      </TouchableWithoutFeedback>
    )
  }

  return <Animated.View style={containerStyle} pointerEvents="none" />
}
