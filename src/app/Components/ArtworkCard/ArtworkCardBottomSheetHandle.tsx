import { ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types"
import { useBottomSheetAnimatedStyles } from "app/Components/ArtworkCard/useBottomSheetAnimatedStyles"
import { FC } from "react"
import Animated from "react-native-reanimated"

export const ArtworkCardBottomSheetHandle: FC<BottomSheetDefaultHandleProps> = () => {
  const { opacityStyle, heightTextStyle } = useBottomSheetAnimatedStyles()

  return (
    <Flex
      justifyContent="center"
      borderRadius={20}
      alignItems="center"
      pt={0.5}
      backgroundColor="mono0"
    >
      <Flex>
        <ChevronUpIcon width={20} height={20} fill="mono60" />
      </Flex>

      <Animated.View style={[opacityStyle, heightTextStyle]}>
        <Text selectable={false} color="mono60">
          Swipe up for more details
        </Text>
      </Animated.View>
    </Flex>
  )
}
