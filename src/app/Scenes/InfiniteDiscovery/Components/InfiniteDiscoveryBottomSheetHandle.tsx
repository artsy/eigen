import { Flex, useScreenDimensions, Text } from "@artsy/palette-mobile"
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types"
import { useBottomSheetAnimatedStyles } from "app/Scenes/InfiniteDiscovery/hooks/useBottomSheetAnimatedStyles"
import { FC } from "react"
import Animated from "react-native-reanimated"

export const InfiniteDiscoveryBottomeSheetHandle: FC<BottomSheetDefaultHandleProps> = () => {
  const { width } = useScreenDimensions()
  const { opacityStyle, heightStyle } = useBottomSheetAnimatedStyles()

  const handleWidth = (7.5 * width) / 100

  return (
    <Flex justifyContent="center" alignItems="center" gap={0.5} pt={1}>
      <Flex
        height={4}
        width={handleWidth}
        borderRadius={4}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      />

      <Animated.View style={[opacityStyle, heightStyle]}>
        <Text selectable={false} color="black60">
          Swipe up for more details
        </Text>
      </Animated.View>
    </Flex>
  )
}
