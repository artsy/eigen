import { useColor } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import { MAX_OPACITY } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { FC, useMemo } from "react"
import { ViewProps } from "react-native"
import { Pressable } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const InfiniteDiscoveryBottomSheetBackdrop: FC<BottomSheetDefaultBackdropProps> = ({
  disappearsOnIndex,
  appearsOnIndex,
  animatedIndex,
  style,
}) => {
  const color = useColor()
  const { collapse } = useBottomSheet()
  const { top } = useSafeAreaInsets()

  const animatedProps = useAnimatedProps<{ pointerEvents: ViewProps["pointerEvents"] }>(() => {
    return {
      pointerEvents: animatedIndex.value < 1 ? "none" : "auto",
    }
  })

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (appearsOnIndex === undefined || disappearsOnIndex === undefined) {
      return {}
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

  const containerStyle = useMemo(() => {
    return [
      style,
      {
        backgroundColor: color("mono100"),
        marginTop: -top,
      },
      containerAnimatedStyle,
    ]
  }, [style, containerAnimatedStyle])

  return (
    <Animated.View style={containerStyle} animatedProps={animatedProps}>
      <Pressable accessibilityRole="button" style={() => style} onPress={() => collapse()}>
        <Animated.View style={containerStyle} animatedProps={animatedProps} />
      </Pressable>
    </Animated.View>
  )
}
