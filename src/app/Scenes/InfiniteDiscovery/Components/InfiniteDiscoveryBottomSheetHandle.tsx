import { ArrowUpIcon, Flex, Text } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types"
import { useBottomSheetAnimatedStyles } from "app/Scenes/InfiniteDiscovery/hooks/useBottomSheetAnimatedStyles"
import { FC } from "react"
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated"

export const InfiniteDiscoveryBottomeSheetHandle: FC<BottomSheetDefaultHandleProps> = () => {
  const { opacityStyle, heightTextStyle } = useBottomSheetAnimatedStyles()
  const { animatedIndex } = useBottomSheet()

  const animatedHandle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateX:
            interpolate(animatedIndex.value, [0, 0.2, 1], [0, 20, 180], Extrapolation.CLAMP) +
            "deg",
        },
      ],
    }
  })
  return (
    <Flex
      justifyContent="center"
      borderRadius={20}
      alignItems="center"
      pt={0.5}
      backgroundColor="white100"
    >
      <Animated.View style={animatedHandle}>
        <ArrowUpIcon width={20} height={20} fill="black60" />
      </Animated.View>

      <Animated.View style={[opacityStyle, heightTextStyle]}>
        <Text selectable={false} color="black60">
          Swipe up for more details
        </Text>
      </Animated.View>
    </Flex>
  )
}
