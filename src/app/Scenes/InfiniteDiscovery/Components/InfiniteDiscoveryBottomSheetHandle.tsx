import { Flex, useScreenDimensions, Text } from "@artsy/palette-mobile"
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types"
import { useBottomSheetAnimatedStyles } from "app/Scenes/InfiniteDiscovery/hooks/useBottomSheetAnimatedStyles"
import { GlobalStore } from "app/store/GlobalStore"
import { FC } from "react"
import Animated from "react-native-reanimated"

export const InfiniteDiscoveryBottomeSheetHandle: FC<BottomSheetDefaultHandleProps> = () => {
  const { width } = useScreenDimensions()
  const { opacityStyle, heightTextStyle, heightHandleStyle } = useBottomSheetAnimatedStyles()
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  const handleWidth = (7.5 * width) / 100

  return (
    <Flex
      justifyContent="center"
      borderRadius={20}
      alignItems="center"
      gap={0.5}
      pt={0.5}
      backgroundColor="white100"
    >
      <Animated.View style={[heightHandleStyle, { width: 1 }]} />

      <Flex
        style={[
          {
            width: handleWidth,
            height: 4,
            borderRadius: 4,
            backgroundColor:
              theme === "light" ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.75)",
          },
        ]}
      />

      <Animated.View style={[opacityStyle, heightTextStyle]}>
        <Text selectable={false} color="black60">
          Swipe up for more details
        </Text>
      </Animated.View>
    </Flex>
  )
}
