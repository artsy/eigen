import { CloseIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Touchable } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const InfiniteExplorerHeader: React.FC = () => {
  const insets = useSafeAreaInsets()

  return (
    <Flex position="absolute" top={insets.top} left={0} zIndex={100} p={2}>
      <Touchable accessibilityRole="button" onPress={() => goBack()} hitSlop={DEFAULT_HIT_SLOP} testID="infinite-explorer-close">
        <CloseIcon fill="mono0" />
      </Touchable>
    </Flex>
  )
}
